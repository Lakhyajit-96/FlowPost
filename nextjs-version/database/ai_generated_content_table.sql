-- AI Generated Content Table
-- Stores AI-generated social media content with full configuration

CREATE TABLE IF NOT EXISTS ai_generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('caption', 'hashtags', 'post_idea', 'thread', 'story', 'video_script')),
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'pinterest')),
  tone TEXT NOT NULL CHECK (tone IN ('professional', 'casual', 'friendly', 'humorous', 'inspirational')),
  length TEXT NOT NULL CHECK (length IN ('short', 'medium', 'long')),
  prompt TEXT NOT NULL,
  keywords TEXT,
  include_emojis BOOLEAN DEFAULT true,
  include_hashtags BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_content_user_id ON ai_generated_content(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_ai_content_created_at ON ai_generated_content(created_at DESC);

-- Enable Row Level Security
ALTER TABLE ai_generated_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own AI generated content" ON ai_generated_content;
DROP POLICY IF EXISTS "Users can insert own AI generated content" ON ai_generated_content;
DROP POLICY IF EXISTS "Users can update own AI generated content" ON ai_generated_content;
DROP POLICY IF EXISTS "Users can delete own AI generated content" ON ai_generated_content;

-- Create RLS policies
CREATE POLICY "Users can view own AI generated content"
  ON ai_generated_content
  FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own AI generated content"
  ON ai_generated_content
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own AI generated content"
  ON ai_generated_content
  FOR UPDATE
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own AI generated content"
  ON ai_generated_content
  FOR DELETE
  USING (auth.jwt() ->> 'sub' = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_ai_content_timestamp ON ai_generated_content;
CREATE TRIGGER update_ai_content_timestamp
  BEFORE UPDATE ON ai_generated_content
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_content_updated_at();
