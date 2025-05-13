import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface User {
  id: string;
  email: string;
  webflow_access_token?: string;
  webflow_refresh_token?: string;
  created_at: string;
}

export interface Site {
  id: string;
  user_id: string;
  webflow_site_id: string;
  name: string;
  created_at: string;
}

export interface Collection {
  id: string;
  site_id: string;
  webflow_collection_id: string;
  name: string;
  field_mappings: {
    title: string;
    slug: string;
    content: string;
    metaDescription?: string;
  };
  created_at: string;
}

export interface BlogPost {
  id: string;
  collection_id: string;
  webflow_item_id: string;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  keywords?: string[];
  created_at: string;
  updated_at: string;
}

export interface LinkSuggestion {
  id: string;
  source_post_id: string;
  target_post_id: string;
  keyword: string;
  anchor_text: string;
  context: string;
  relevance_score: number;
  status: 'pending' | 'approved' | 'declined';
  created_at: string;
  updated_at: string;
}

export interface LinkHistory {
  id: string;
  link_suggestion_id: string;
  source_post_id: string;
  target_post_id: string;
  anchor_text: string;
  implementation_date: string;
}

// Database functions

// Users
export const getUser = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  
  return data;
};

export const updateWebflowTokens = async (
  userId: string, 
  accessToken: string, 
  refreshToken: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('users')
    .update({
      webflow_access_token: accessToken,
      webflow_refresh_token: refreshToken
    })
    .eq('id', userId);
    
  if (error) {
    console.error('Error updating Webflow tokens:', error);
    return false;
  }
  
  return true;
};

// Sites
export const getUserSites = async (userId: string): Promise<Site[]> => {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error fetching user sites:', error);
    return [];
  }
  
  return data || [];
};

export const createSite = async (
  userId: string,
  webflowSiteId: string,
  name: string
): Promise<Site | null> => {
  const { data, error } = await supabase
    .from('sites')
    .insert({
      user_id: userId,
      webflow_site_id: webflowSiteId,
      name
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating site:', error);
    return null;
  }
  
  return data;
};

// Collections
export const getSiteCollections = async (siteId: string): Promise<Collection[]> => {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('site_id', siteId);
    
  if (error) {
    console.error('Error fetching site collections:', error);
    return [];
  }
  
  return data || [];
};

export const createCollection = async (
  siteId: string,
  webflowCollectionId: string,
  name: string,
  fieldMappings: Collection['field_mappings']
): Promise<Collection | null> => {
  const { data, error } = await supabase
    .from('collections')
    .insert({
      site_id: siteId,
      webflow_collection_id: webflowCollectionId,
      name,
      field_mappings: fieldMappings
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating collection:', error);
    return null;
  }
  
  return data;
};

// Blog Posts
export const getCollectionPosts = async (collectionId: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('collection_id', collectionId);
    
  if (error) {
    console.error('Error fetching collection posts:', error);
    return [];
  }
  
  return data || [];
};

export const createBlogPost = async (
  collectionId: string,
  webflowItemId: string,
  title: string,
  slug: string,
  content: string,
  metaDescription?: string,
  keywords?: string[]
): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      collection_id: collectionId,
      webflow_item_id: webflowItemId,
      title,
      slug,
      content,
      meta_description: metaDescription,
      keywords
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating blog post:', error);
    return null;
  }
  
  return data;
};

// Link Suggestions
export const getPostLinkSuggestions = async (postId: string): Promise<LinkSuggestion[]> => {
  const { data, error } = await supabase
    .from('link_suggestions')
    .select('*')
    .eq('source_post_id', postId);
    
  if (error) {
    console.error('Error fetching post link suggestions:', error);
    return [];
  }
  
  return data || [];
};

export const createLinkSuggestion = async (
  sourcePostId: string,
  targetPostId: string,
  keyword: string,
  anchorText: string,
  context: string,
  relevanceScore: number
): Promise<LinkSuggestion | null> => {
  const { data, error } = await supabase
    .from('link_suggestions')
    .insert({
      source_post_id: sourcePostId,
      target_post_id: targetPostId,
      keyword,
      anchor_text: anchorText,
      context,
      relevance_score: relevanceScore,
      status: 'pending'
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating link suggestion:', error);
    return null;
  }
  
  return data;
};

export const updateLinkSuggestionStatus = async (
  id: string,
  status: 'approved' | 'declined'
): Promise<boolean> => {
  const { error } = await supabase
    .from('link_suggestions')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
    
  if (error) {
    console.error('Error updating link suggestion status:', error);
    return false;
  }
  
  return true;
};

// Link History
export const createLinkHistory = async (
  linkSuggestionId: string,
  sourcePostId: string,
  targetPostId: string,
  anchorText: string
): Promise<LinkHistory | null> => {
  const { data, error } = await supabase
    .from('link_history')
    .insert({
      link_suggestion_id: linkSuggestionId,
      source_post_id: sourcePostId,
      target_post_id: targetPostId,
      anchor_text: anchorText,
      implementation_date: new Date().toISOString()
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating link history:', error);
    return null;
  }
  
  return data;
};

export const getUserLinkHistory = async (userId: string): Promise<LinkHistory[]> => {
  // This query joins through multiple tables to get link history for a user
  const { data, error } = await supabase
    .from('link_history')
    .select(`
      *,
      link_suggestions:link_suggestion_id (
        *,
        source_post:source_post_id (
          *,
          collection:collection_id (
            *,
            site:site_id (
              *
            )
          )
        )
      )
    `)
    .eq('link_suggestions.source_post.collection.site.user_id', userId);
    
  if (error) {
    console.error('Error fetching user link history:', error);
    return [];
  }
  
  return data || [];
}; 