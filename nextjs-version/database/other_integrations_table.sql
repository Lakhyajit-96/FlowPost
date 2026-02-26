-- Other Integrations Table
-- Stores connections for productivity tools (Apple, Google, Github, Slack, Zapier, Webhooks, Database)

-- =====================================================
-- CLEANUP: Drop existing objects if they exist
-- =====================================================

DO $$ 
BEGIN
    -- Drop policies if table exists
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'other_integrations') THEN
        DROP POLICY IF EXISTS "Users can manage own integrations" ON other_integrations;
        DROP TRIGGER IF EXISTS other_integrations_updated_at ON other_integrations;
    END IF;
END $$;

-- Drop function
DROP FUNCTION IF EXISTS update_other_integrations_updated_at();

-- Drop table
DROP TABLE IF EXISTS other_integrations CASCADE;

-- =====================================================
-- CREATE TABLE
-- =====================================================

CREATE TABLE other_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  
  -- Integration type
  integration_type TEXT NOT NULL CHECK (integration_type IN ('apple', 'google', 'github', 'slack', 'zapier', 'webhooks', 'database')),
  
  -- Connection status
  is_connected BOOLEAN DEFAULT false,
  
  -- OAuth tokens (if applicable)
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Integration metadata
  integration_name TEXT,
  integration_email TEXT,
  integration_username TEXT,
  
  -- Configuration (JSON for flexibility)
  config JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  connected_at TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one integration per type per user
  UNIQUE(user_id, integration_type)
);

-- Create indexes
CREATE INDEX idx_other_integrations_user_id ON other_integrations(user_id);
CREATE INDEX idx_other_integrations_type ON other_integrations(integration_type);
CREATE INDEX idx_other_integrations_connected ON other_integrations(is_connected);

-- Enable Row Level Security
ALTER TABLE other_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can manage own integrations"
  ON other_integrations
  FOR ALL
  USING (auth.uid()::text = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_other_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER other_integrations_updated_at
  BEFORE UPDATE ON other_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_other_integrations_updated_at();

-- Comments
COMMENT ON TABLE other_integrations IS 'Stores connections for productivity and development tools';
COMMENT ON COLUMN other_integrations.integration_type IS 'Type: apple, google, github, slack, zapier, webhooks, database';
COMMENT ON COLUMN other_integrations.is_connected IS 'Whether the integration is currently active';
