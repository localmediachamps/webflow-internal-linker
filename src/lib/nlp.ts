import { OpenAI } from 'openai';
import { JSDOM } from 'jsdom';
import natural from 'natural';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize natural NLP tools
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const tfidf = new natural.TfIdf();

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  metaDescription?: string;
}

interface KeywordData {
  keyword: string;
  score: number;
}

interface LinkSuggestion {
  sourcePostId: string;
  targetPostId: string;
  sourceTitle: string;
  targetTitle: string;
  keyword: string;
  anchorText: string;
  context: string;
  destinationUrl: string;
  relevanceScore: number;
}

// Extract HTML text content
export const extractTextFromHtml = (html: string): string => {
  const dom = new JSDOM(html);
  return dom.window.document.body.textContent || '';
};

// Extract keywords using TF-IDF
export const extractKeywordsTfIdf = (posts: BlogPost[]): Map<string, KeywordData[]> => {
  const keywordsMap = new Map<string, KeywordData[]>();
  
  // Add all documents to TF-IDF
  posts.forEach((post, index) => {
    const text = `${post.title} ${post.metaDescription || ''} ${extractTextFromHtml(post.content)}`;
    tfidf.addDocument(text);
  });
  
  // Extract top keywords for each post
  posts.forEach((post, index) => {
    const keywords: KeywordData[] = [];
    
    tfidf.listTerms(index).slice(0, 10).forEach(item => {
      keywords.push({
        keyword: item.term,
        score: item.tfidf
      });
    });
    
    keywordsMap.set(post.id, keywords);
  });
  
  return keywordsMap;
};

// Extract keywords using OpenAI API
export const extractKeywordsOpenAI = async (post: BlogPost): Promise<KeywordData[]> => {
  const text = `${post.title} ${post.metaDescription || ''} ${extractTextFromHtml(post.content)}`;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a keyword extraction expert. Extract the most relevant keywords and phrases from the text, focusing on important SEO terms. Return a JSON array with objects containing 'keyword' and 'score' (0-1) properties."
      },
      {
        role: "user",
        content: text
      }
    ],
    response_format: { type: "json_object" }
  });

  try {
    const result = JSON.parse(completion.choices[0].message.content || '{"keywords": []}');
    return result.keywords || [];
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    return [];
  }
};

// Find potential link locations
export const findLinkLocations = (posts: BlogPost[], keywordsMap: Map<string, KeywordData[]>): LinkSuggestion[] => {
  const suggestions: LinkSuggestion[] = [];
  
  // For each post
  posts.forEach(sourcePost => {
    // Get all other posts
    const otherPosts = posts.filter(post => post.id !== sourcePost.id);
    
    // For each other post, check if its keywords appear in the source post
    otherPosts.forEach(targetPost => {
      const targetKeywords = keywordsMap.get(targetPost.id) || [];
      
      // Check each keyword
      targetKeywords.forEach(keywordData => {
        const { keyword } = keywordData;
        
        // Simple search for the keyword in the content
        const content = sourcePost.content.toLowerCase();
        const keywordLower = keyword.toLowerCase();
        
        if (content.includes(keywordLower)) {
          // Extract context (simplified)
          const index = content.indexOf(keywordLower);
          const start = Math.max(0, index - 50);
          const end = Math.min(content.length, index + keyword.length + 50);
          const context = content.substring(start, end);
          
          // Create suggestion
          suggestions.push({
            sourcePostId: sourcePost.id,
            targetPostId: targetPost.id,
            sourceTitle: sourcePost.title,
            targetTitle: targetPost.title,
            keyword,
            anchorText: keyword, // Default to the keyword itself
            context,
            destinationUrl: `/blog/${targetPost.slug}`,
            relevanceScore: keywordData.score
          });
        }
      });
    });
  });
  
  // Sort by relevance score
  return suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);
};

// Generate better anchor text using OpenAI
export const improveAnchorText = async (suggestion: LinkSuggestion): Promise<string> => {
  const prompt = `
    I need to create an internal link in this text: "${suggestion.context}"
    
    I want to link to a post titled "${suggestion.targetTitle}" using the keyword "${suggestion.keyword}".
    
    Please suggest a natural anchor text that includes this keyword but flows well in the sentence.
    Return only the anchor text, nothing else.
  `;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an SEO expert specializing in creating natural-sounding internal links."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const anchorText = completion.choices[0].message.content?.trim() || suggestion.keyword;
  return anchorText;
};

// Process HTML content to insert a link
export const insertLink = (html: string, keyword: string, anchorText: string, url: string): string => {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Find all text nodes
  const walker = document.createTreeWalker(
    document.body,
    dom.window.NodeFilter.SHOW_TEXT,
    null
  );
  
  const textNodes: Node[] = [];
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }
  
  // Look for the keyword in text nodes
  for (const textNode of textNodes) {
    const content = textNode.textContent || '';
    const keywordIndex = content.toLowerCase().indexOf(keyword.toLowerCase());
    
    if (keywordIndex >= 0) {
      // Make sure this isn't already in a link
      let parent = textNode.parentElement;
      let isInLink = false;
      
      while (parent) {
        if (parent.tagName === 'A') {
          isInLink = true;
          break;
        }
        parent = parent.parentElement;
      }
      
      // Don't add links inside headings
      const isInHeading = parent?.tagName === 'H1' || 
                          parent?.tagName === 'H2' || 
                          parent?.tagName === 'H3' || 
                          parent?.tagName === 'H4' || 
                          parent?.tagName === 'H5' || 
                          parent?.tagName === 'H6';
      
      if (!isInLink && !isInHeading) {
        // Split the text node and insert link
        const before = content.substring(0, keywordIndex);
        const after = content.substring(keywordIndex + keyword.length);
        
        const fragment = document.createDocumentFragment();
        
        if (before) {
          fragment.appendChild(document.createTextNode(before));
        }
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('data-internal-link', 'true');
        link.textContent = anchorText;
        fragment.appendChild(link);
        
        if (after) {
          fragment.appendChild(document.createTextNode(after));
        }
        
        textNode.parentNode?.replaceChild(fragment, textNode);
        
        // We've inserted one link, so let's stop
        break;
      }
    }
  }
  
  return dom.serialize();
}; 