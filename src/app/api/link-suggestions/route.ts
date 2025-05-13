import { NextRequest, NextResponse } from 'next/server';
import * as nlp from '@/lib/nlp';
import * as db from '@/lib/supabase';
import createWebflowClient from '@/lib/webflow';
import { getServerSession } from 'next-auth';

// POST /api/link-suggestions - Generate link suggestions for a post
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from session
    // Get user ID from session email since id might not be available
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 401 });
    }
    
    // Get user by email
    const userRecord = await db.getUserByEmail(userEmail);
    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userId = userRecord.id;

    // Get request body
    const body = await req.json();
    const { postId, collectionId } = body;

    if (!postId || !collectionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user to check if they have Webflow tokens
    const user = await db.getUser(userId);
    if (!user || !user.webflow_access_token) {
      return NextResponse.json({ error: 'Webflow connection required' }, { status: 400 });
    }

    // Get the collection to access field mappings
    const collections = await db.getSiteCollections(collectionId);
    const collection = collections.find(c => c.id === collectionId);
    
    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Create Webflow client
    const webflowClient = createWebflowClient(user.webflow_access_token);

    // Fetch all blog posts in the collection
    const posts = await db.getCollectionPosts(collectionId);
    
    if (posts.length === 0) {
      // If no posts are cached, fetch them from Webflow and store them
      const webflowPosts = await webflowClient.getCollectionItems(collection.webflow_collection_id);
      
      // Process and store posts
      for (const webflowPost of webflowPosts) {
        const title = webflowPost[collection.field_mappings.title] || webflowPost.name;
        const slug = webflowPost[collection.field_mappings.slug] || webflowPost.slug;
        const content = webflowPost[collection.field_mappings.content] || '';
        const metaDescription = collection.field_mappings.metaDescription ? 
          webflowPost[collection.field_mappings.metaDescription] : '';
        
        await db.createBlogPost(
          collectionId,
          webflowPost._id,
          title,
          slug,
          content,
          metaDescription
        );
      }
      
      // Refetch the posts
      const refreshedPosts = await db.getCollectionPosts(collectionId);
      if (refreshedPosts.length === 0) {
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
      }
    }
    
    // Convert to the format needed for NLP analysis
    const nlpPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      slug: post.slug,
      metaDescription: post.meta_description
    }));

    // Extract keywords using TF-IDF
    const keywordsMap = nlp.extractKeywordsTfIdf(nlpPosts);

    // Find link opportunities
    const suggestions = nlp.findLinkLocations(nlpPosts, keywordsMap);

    // Filter suggestions for the current post
    const postSuggestions = suggestions.filter(s => s.sourcePostId === postId);

    // Save suggestions to database
    const savedSuggestions = [];
    for (const suggestion of postSuggestions) {
      // Improve anchor text with OpenAI (optional)
      const improvedAnchorText = await nlp.improveAnchorText(suggestion);
      
      const savedSuggestion = await db.createLinkSuggestion(
        suggestion.sourcePostId,
        suggestion.targetPostId,
        suggestion.keyword,
        improvedAnchorText || suggestion.anchorText,
        suggestion.context,
        suggestion.relevanceScore
      );
      
      if (savedSuggestion) {
        savedSuggestions.push(savedSuggestion);
      }
    }

    return NextResponse.json({
      success: true,
      suggestions: savedSuggestions
    });
    
  } catch (error) {
    console.error('Error generating link suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate link suggestions' }, 
      { status: 500 }
    );
  }
}

// PUT /api/link-suggestions/:id - Update a link suggestion status
export async function PUT(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await req.json();
    const { id, status, anchorText } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update the suggestion status
    const updated = await db.updateLinkSuggestionStatus(id, status);
    
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update suggestion' }, { status: 500 });
    }

    // If approved, implement the link in Webflow
    if (status === 'approved') {
      const userEmail = session.user.email;
      if (!userEmail) {
        return NextResponse.json({ error: 'User email not found' }, { status: 401 });
      }
      
      // Get user by email
      const userRecord = await db.getUserByEmail(userEmail);
      if (!userRecord) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      const user = await db.getUser(userRecord.id);
      if (!user || !user.webflow_access_token) {
        return NextResponse.json({ error: 'Webflow connection required' }, { status: 400 });
      }

      // Get suggestion details to implement the link
      const suggestions = await db.getPostLinkSuggestions(id);
      const suggestion = suggestions[0];
      
      if (!suggestion) {
        return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 });
      }

      // Get source and target posts
      const sourcePosts = await db.getCollectionPosts(suggestion.source_post_id);
      const targetPosts = await db.getCollectionPosts(suggestion.target_post_id);
      
      if (sourcePosts.length === 0 || targetPosts.length === 0) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      const sourcePost = sourcePosts[0];
      const targetPost = targetPosts[0];

      // Create Webflow client
      const webflowClient = createWebflowClient(user.webflow_access_token);

      // Insert the link into the HTML content
      const updatedContent = nlp.insertLink(
        sourcePost.content,
        suggestion.keyword,
        anchorText || suggestion.anchor_text,
        `/blog/${targetPost.slug}`
      );

      // Update the post in Webflow
      // Get collection to get field mappings
      const collections = await db.getSiteCollections(sourcePost.collection_id);
      const collection = collections.find(c => c.id === sourcePost.collection_id);
      
      if (!collection) {
        return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
      }

      // Prepare fields to update
      const fields: Record<string, any> = {};
      fields[collection.field_mappings.content] = updatedContent;

      // Update in Webflow
      await webflowClient.updateCollectionItem(
        collection.webflow_collection_id,
        sourcePost.webflow_item_id,
        fields
      );

      // Publish the changes if in production
      await webflowClient.publishCollectionItem(
        collection.webflow_collection_id,
        sourcePost.webflow_item_id
      );

      // Record in link history
      await db.createLinkHistory(
        suggestion.id,
        suggestion.source_post_id,
        suggestion.target_post_id,
        anchorText || suggestion.anchor_text
      );
    }

    return NextResponse.json({
      success: true,
      status
    });
    
  } catch (error) {
    console.error('Error updating link suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to update link suggestion' }, 
      { status: 500 }
    );
  }
} 