-- Social Media Connections Table
-- Stores OAuth tokens and connection status for social media accounts

-- =====================================================
-- CLEANUP: Drop existing objects if they exist
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own social connections" ON social_connections;
DROP POLICY IF EXISTS "Users can insert own social connections" ON social_connections;
DROP POLICY IF EXISTS "Users can update own social connections" ON social_connections;
DROP POLICY IF EXISTS "Users can delete own social connections" ON social_connections;

-- Drop existing trigger
DROP TRIGGER IF EXISTS social_connections_updated_at ON social_connections;

-- Drop existing function
DROP FUNCTION IF EXISTS update_social_connections_updated_at();

-- Drop existing table
DROP TABLE IF EXISTS social_connections CASCADE;

-- =====================================================
-- CREATE TABLE
-- =====================================================

CREATE TABLE social_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  
  -- Platform information
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'pinterest')),
  platform_user_id TEXT NOT NULL,
  platform_username TEXT,
  platform_display_name TEXT,
  platform_profile_image TEXT,
  
  -- OAuth tokens (encrypted in production)
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Connection status
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  
  -- Account metadata
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  
  -- Permissions granted
  can_post BOOLEAN DEFAULT true,
  can_read BOOLEAN DEFAULT true,
  can_delete BOOLEAN DEFAULT false,
  
  -- Error tracking
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  
  -- Timestamps
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one connection per platform per user
  UNIQUE(user_id, platform, platform_user_id)
);

-- Create indexes for faster lookups
DROP INDEX IF EXISTS idx_social_connections_user_id;
DROP INDEX IF EXISTS idx_social_connections_platform;
DROP INDEX IF EXISTS idx_social_connections_active;

CREATE INDEX idx_social_connections_user_id ON social_connections(user_id);
CREATE INDEX idx_social_connections_platform ON social_connections(platform);
CREATE INDEX idx_social_connections_active ON social_connections(is_active);

-- Enable Row Level Security
ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only view their own connections
CREATE POLICY "Users can view own social connections"
  ON social_connections
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Users can insert their own connections
CREATE POLICY "Users can insert own social connections"
  ON social_connections
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Users can update their own connections
CREATE POLICY "Users can update own social connections"
  ON social_connections
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Users can delete their own connections
CREATE POLICY "Users can delete own social connections"
  ON social_connections
  FOR DELETE
  USING (auth.uid()::text = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_social_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER social_connections_updated_at
  BEFORE UPDATE ON social_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_social_connections_updated_at();

-- Comments for documentation
COMMENT ON TABLE social_connections IS 'Stores OAuth connections and tokens for social media platforms';
COMMENT ON COLUMN social_connections.platform IS 'Social media platform: facebook, twitter, instagram, linkedin, youtube, pinterest';
COMMENT ON COLUMN social_connections.access_token IS 'OAuth access token (should be encrypted in production)';
COMMENT ON COLUMN social_connections.is_active IS 'Whether the connection is currently active and valid';
