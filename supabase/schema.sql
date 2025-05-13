-- USERS TABLE
-- Stores user information and authentication details
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  webflow_access_token TEXT,
  webflow_refresh_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- SITES TABLE
-- Webflow sites connected by users
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  webflow_site_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, webflow_site_id)
);

-- Enable Row Level Security
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can CRUD their own sites" ON sites
  USING (auth.uid() = user_id);

-- COLLECTIONS TABLE
-- Blog collections to analyze
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  webflow_collection_id TEXT NOT NULL,
  name TEXT NOT NULL,
  field_mappings JSONB NOT NULL, -- { title, slug, content, metaDescription }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(site_id, webflow_collection_id)
);

-- Enable Row Level Security
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can CRUD their own collections" ON collections
  USING (EXISTS (
    SELECT 1 FROM sites
    WHERE sites.id = collections.site_id
    AND sites.user_id = auth.uid()
  ));

-- BLOG POSTS TABLE
-- Cache of blog posts from Webflow
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  webflow_item_id TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, webflow_item_id)
);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can CRUD their own blog posts" ON blog_posts
  USING (EXISTS (
    SELECT 1 FROM collections
    JOIN sites ON collections.site_id = sites.id
    WHERE blog_posts.collection_id = collections.id
    AND sites.user_id = auth.uid()
  ));

-- LINK SUGGESTIONS TABLE
-- Generated link suggestions
CREATE TABLE link_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  target_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  anchor_text TEXT NOT NULL,
  context TEXT NOT NULL,
  relevance_score FLOAT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE link_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can CRUD their own link suggestions" ON link_suggestions
  USING (EXISTS (
    SELECT 1 FROM blog_posts
    JOIN collections ON blog_posts.collection_id = collections.id
    JOIN sites ON collections.site_id = sites.id
    WHERE link_suggestions.source_post_id = blog_posts.id
    AND sites.user_id = auth.uid()
  ));

-- LINK HISTORY TABLE
-- Record of implemented links
CREATE TABLE link_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_suggestion_id UUID NOT NULL REFERENCES link_suggestions(id) ON DELETE CASCADE,
  source_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  target_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  anchor_text TEXT NOT NULL,
  implementation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE link_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own link history" ON link_history
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM link_suggestions
    JOIN blog_posts ON link_suggestions.source_post_id = blog_posts.id
    JOIN collections ON blog_posts.collection_id = collections.id
    JOIN sites ON collections.site_id = sites.id
    WHERE link_history.link_suggestion_id = link_suggestions.id
    AND sites.user_id = auth.uid()
  ));

-- Create indexes for performance
CREATE INDEX idx_blog_posts_collection_id ON blog_posts(collection_id);
CREATE INDEX idx_link_suggestions_source_post_id ON link_suggestions(source_post_id);
CREATE INDEX idx_link_suggestions_target_post_id ON link_suggestions(target_post_id);
CREATE INDEX idx_link_history_link_suggestion_id ON link_history(link_suggestion_id);
CREATE INDEX idx_link_history_source_post_id ON link_history(source_post_id);
CREATE INDEX idx_link_history_target_post_id ON link_history(target_post_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_blog_posts_timestamp
BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_link_suggestions_timestamp
BEFORE UPDATE ON link_suggestions
FOR EACH ROW EXECUTE FUNCTION update_timestamp(); 