-- API Keys Table
-- Stores user-generated API keys for programmatic access to FlowPost

-- =====================================================
-- CLEANUP: Drop existing objects if they exist
-- =====================================================

DO $$ 
BEGIN
    -- Drop policies and trigger if table exists
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'api_keys') THEN
        DROP POLICY IF EXISTS "Users can manage own API keys" ON api_keys;
        DROP TRIGGER IF EXISTS api_keys_updated_at ON api_keys;
    END IF;
END $$;

-- Drop functions
DROP FUNCTION IF EXISTS update_api_keys_updated_at();
DROP FUNCTION IF EXISTS generate_api_key(TEXT);

-- Drop table
DROP TABLE IF EXISTS api_keys CASCADE;

-- =====================================================
-- CREATE TABLE
-- =====================================================

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  
  -- Key information
  key_name TEXT NOT NULL,
  key_prefix TEXT NOT NULL, -- sk_live_ or sk_test_
  key_hash TEXT NOT NULL UNIQUE, -- Hashed version of the full key
  key_last_four TEXT NOT NULL, -- Last 4 characters for display
  
  -- Key type
  environment TEXT NOT NULL CHECK (environment IN ('production', 'development')),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Usage tracking
  last_used_at TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0,
  
  -- Permissions (JSON for flexibility)
  permissions JSONB DEFAULT '{"read": true, "write": true}'::jsonb,
  
  -- Rate limiting
  rate_limit INTEGER DEFAULT 1000, -- requests per hour
  
  -- Expiration
  expires_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);
CREATE INDEX idx_api_keys_environment ON api_keys(environment);

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can manage own API keys"
  ON api_keys
  FOR ALL
  USING (auth.uid()::text = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_api_keys_updated_at();

-- Function to generate random API key
CREATE OR REPLACE FUNCTION generate_api_key(prefix TEXT)
RETURNS TEXT AS $$
DECLARE
  random_part TEXT;
BEGIN
  -- Generate 32 random characters
  random_part := encode(gen_random_bytes(24), 'base64');
  -- Remove special characters and make it URL-safe
  random_part := replace(replace(replace(random_part, '+', ''), '/', ''), '=', '');
  -- Return prefix + random part
  RETURN prefix || random_part;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE api_keys IS 'User-generated API keys for programmatic access';
COMMENT ON COLUMN api_keys.key_hash IS 'SHA-256 hash of the full API key';
COMMENT ON COLUMN api_keys.key_last_four IS 'Last 4 characters for display purposes';
COMMENT ON COLUMN api_keys.environment IS 'production or development';
