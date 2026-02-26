-- =====================================================
-- FLOWPOST - COMPLETE DATABASE SCHEMA
-- =====================================================
-- Production-ready schema for AI-powered social media management SaaS
-- Created by: FlowPost Founder
-- Database: Supabase PostgreSQL
-- URL: https://bcqlqejenkgqwaqppzum.supabase.co
-- =====================================================

-- =====================================================
-- STEP 1: CLEANUP (Run this first to start fresh)
-- =====================================================

-- Drop existing policies (only if tables exist)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
    END LOOP;
END $$;

-- Drop existing triggers (only if they exist)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT trigger_name, event_object_table
        FROM information_schema.triggers
        WHERE trigger_schema = 'public'
    ) LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || r.trigger_name || ' ON ' || r.event_object_table || ' CASCADE';
    END LOOP;
END $$;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS check_plan_limit(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS increment_usage(TEXT, TEXT, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_user_plan_limits(TEXT) CASCADE;
DROP FUNCTION IF EXISTS get_monthly_usage(TEXT) CASCADE;

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS ai_generations CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS post_analytics CASCADE;
DROP TABLE IF EXISTS media_library CASCADE;
DROP TABLE IF EXISTS social_accounts CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS team_role CASCADE;
DROP TYPE IF EXISTS social_platform CASCADE;
DROP TYPE IF EXISTS post_status CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS subscription_tier CASCADE;

DO $$ BEGIN RAISE NOTICE '✓ Cleanup complete!'; END $$;

-- =====================================================
-- STEP 2: EXTENSIONS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

DO $$ BEGIN RAISE NOTICE '✓ Extensions enabled!'; END $$;

-- =====================================================
-- STEP 3: CUSTOM TYPES (Enums)
-- =====================================================

-- Subscription tiers
CREATE TYPE subscription_tier AS ENUM ('free', 'starter', 'professional', 'agency');

-- Subscription statuses
CREATE TYPE subscription_status AS ENUM (
  'inactive',
  'trialing',
  'active',
  'past_due',
  'canceled',
  'paused'
);

-- Post statuses
CREATE TYPE post_status AS ENUM (
  'draft',
  'scheduled',
  'publishing',
  'published',
  'failed',
  'deleted'
);

-- Social media platforms
CREATE TYPE social_platform AS ENUM (
  'instagram',
  'facebook',
  'twitter',
  'linkedin',
  'youtube',
  'pinterest'
);

-- Team member roles
CREATE TYPE team_role AS ENUM (
  'owner',
  'admin',
  'editor',
  'viewer'
);

DO $$ BEGIN RAISE NOTICE '✓ Custom types created!'; END $$;

-- =====================================================
-- STEP 4: CORE TABLES
-- =====================================================

-- =====================================================
-- 4.1 USERS TABLE
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Subscription info
  subscription_tier subscription_tier DEFAULT 'free' NOT NULL,
  subscription_status subscription_status DEFAULT 'inactive' NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  trial_ends_at TIMESTAMPTZ,
  subscription_started_at TIMESTAMPTZ,
  subscription_canceled_at TIMESTAMPTZ,
  
  -- Preferences
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  email_notifications BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  onboarding_completed BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for users
CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_users_trial_ends ON users(trial_ends_at) WHERE trial_ends_at IS NOT NULL;

-- Comments
COMMENT ON TABLE users IS 'Core user accounts with subscription and preferences';
COMMENT ON COLUMN users.subscription_tier IS 'Plan: free, starter, professional, agency';
COMMENT ON COLUMN users.subscription_status IS 'Status: inactive, trialing, active, past_due, canceled, paused';

-- =====================================================
-- 4.2 SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  
  -- Stripe data
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  
  -- Subscription details
  plan_name subscription_tier NOT NULL,
  status subscription_status NOT NULL,
  
  -- Billing periods
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  
  -- Trial info
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);

COMMENT ON TABLE subscriptions IS 'Stripe subscription details and billing history';

-- =====================================================
-- 4.3 POSTS TABLE
-- =====================================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  
  -- Content
  content TEXT NOT NULL,
  platforms social_platform[] NOT NULL,
  media_urls TEXT[],
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  status post_status DEFAULT 'draft' NOT NULL,
  
  -- AI info
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_prompt TEXT,
  ai_model TEXT,
  
  -- Publishing results
  platform_post_ids JSONB DEFAULT '{}'::jsonb, -- {instagram: "post_id", facebook: "post_id"}
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled_at ON posts(scheduled_at) WHERE scheduled_at IS NOT NULL;
CREATE INDEX idx_posts_published_at ON posts(published_at) WHERE published_at IS NOT NULL;
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_ai_generated ON posts(ai_generated);
CREATE INDEX idx_posts_platforms ON posts USING GIN(platforms);

COMMENT ON TABLE posts IS 'Social media posts with scheduling and AI generation info';

-- =====================================================
-- 4.4 SOCIAL ACCOUNTS TABLE
-- =====================================================
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  
  -- Platform info
  platform social_platform NOT NULL,
  platform_account_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_username TEXT,
  profile_picture_url TEXT,
  
  -- OAuth tokens
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Account stats
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_synced_at TIMESTAMPTZ,
  sync_error TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(user_id, platform, platform_account_id)
);

-- Indexes
CREATE INDEX idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX idx_social_accounts_active ON social_accounts(is_active);
CREATE INDEX idx_social_accounts_user_platform ON social_accounts(user_id, platform);

COMMENT ON TABLE social_accounts IS 'Connected social media accounts with OAuth tokens';

-- =====================================================
-- 4.5 POST ANALYTICS TABLE
-- =====================================================
CREATE TABLE post_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  platform social_platform NOT NULL,
  
  -- Engagement metrics
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  
  -- Reach metrics
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Metadata
  fetched_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(post_id, platform)
);

-- Indexes
CREATE INDEX idx_post_analytics_post_id ON post_analytics(post_id);
CREATE INDEX idx_post_analytics_platform ON post_analytics(platform);
CREATE INDEX idx_post_analytics_engagement_rate ON post_analytics(engagement_rate DESC);
CREATE INDEX idx_post_analytics_fetched_at ON post_analytics(fetched_at DESC);

COMMENT ON TABLE post_analytics IS 'Engagement and reach metrics for published posts';

-- =====================================================
-- 4.6 MEDIA LIBRARY TABLE
-- =====================================================
CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  
  -- File info
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- image/jpeg, video/mp4, etc.
  file_size INTEGER NOT NULL, -- in bytes
  
  -- Image/video metadata
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- for videos, in seconds
  
  -- Organization
  folder TEXT DEFAULT 'default',
  tags TEXT[],
  
  -- Usage
  used_in_posts UUID[], -- array of post IDs
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_media_library_user_id ON media_library(user_id);
CREATE INDEX idx_media_library_folder ON media_library(folder);
CREATE INDEX idx_media_library_file_type ON media_library(file_type);
CREATE INDEX idx_media_library_tags ON media_library USING GIN(tags);
CREATE INDEX idx_media_library_created_at ON media_library(created_at DESC);

COMMENT ON TABLE media_library IS 'User uploaded media files for posts';

-- =====================================================
-- 4.7 TEAM MEMBERS TABLE
-- =====================================================
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id TEXT NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  member_id TEXT NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  
  -- Role and permissions
  role team_role DEFAULT 'viewer' NOT NULL,
  permissions JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  invited_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  accepted_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(owner_id, member_id)
);

-- Indexes
CREATE INDEX idx_team_members_owner_id ON team_members(owner_id);
CREATE INDEX idx_team_members_member_id ON team_members(member_id);
CREATE INDEX idx_team_members_role ON team_members(role);
CREATE INDEX idx_team_members_active ON team_members(is_active);

COMMENT ON TABLE team_members IS 'Team collaboration with role-based access';

-- =====================================================
-- 4.8 AI GENERATIONS TABLE
-- =====================================================
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  
  -- Generation details
  prompt TEXT NOT NULL,
  generated_content TEXT NOT NULL,
  model TEXT NOT NULL, -- gpt-4, gpt-3.5-turbo, etc.
  
  -- Usage
  tokens_used INTEGER NOT NULL,
  cost DECIMAL(10,4) NOT NULL, -- in USD
  
  -- Context
  generation_type TEXT NOT NULL, -- caption, hashtags, post_idea, etc.
  used_in_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX idx_ai_generations_type ON ai_generations(generation_type);
CREATE INDEX idx_ai_generations_created_at ON ai_generations(created_at DESC);
CREATE INDEX idx_ai_generations_post_id ON ai_generations(used_in_post_id);

COMMENT ON TABLE ai_generations IS 'AI content generation history and usage tracking';

DO $$ BEGIN RAISE NOTICE '✓ Core tables created!'; END $$;

-- =====================================================
-- STEP 5: FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Get user plan limits
CREATE OR REPLACE FUNCTION get_user_plan_limits(p_user_id TEXT)
RETURNS TABLE(
  plan subscription_tier,
  posts_limit INTEGER,
  ai_generations_limit INTEGER,
  accounts_limit INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.subscription_tier,
    CASE u.subscription_tier
      WHEN 'free' THEN 0
      WHEN 'starter' THEN 30
      WHEN 'professional' THEN 100
      WHEN 'agency' THEN -1
    END AS posts_limit,
    CASE u.subscription_tier
      WHEN 'free' THEN 0
      WHEN 'starter' THEN 10
      WHEN 'professional' THEN 50
      WHEN 'agency' THEN -1
    END AS ai_generations_limit,
    CASE u.subscription_tier
      WHEN 'free' THEN 0
      WHEN 'starter' THEN 3
      WHEN 'professional' THEN 10
      WHEN 'agency' THEN -1
    END AS accounts_limit
  FROM users u
  WHERE u.clerk_user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get monthly usage
CREATE OR REPLACE FUNCTION get_monthly_usage(p_user_id TEXT)
RETURNS TABLE(
  posts_created INTEGER,
  ai_generations_used INTEGER,
  accounts_connected INTEGER
) AS $$
DECLARE
  v_month_start TIMESTAMPTZ;
BEGIN
  v_month_start := DATE_TRUNC('month', NOW());
  
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT p.id)::INTEGER AS posts_created,
    COUNT(DISTINCT ai.id)::INTEGER AS ai_generations_used,
    COUNT(DISTINCT sa.id)::INTEGER AS accounts_connected
  FROM users u
  LEFT JOIN posts p ON p.user_id = u.clerk_user_id AND p.created_at >= v_month_start
  LEFT JOIN ai_generations ai ON ai.user_id = u.clerk_user_id AND ai.created_at >= v_month_start
  LEFT JOIN social_accounts sa ON sa.user_id = u.clerk_user_id AND sa.is_active = TRUE
  WHERE u.clerk_user_id = p_user_id
  GROUP BY u.clerk_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can perform action based on plan limits
CREATE OR REPLACE FUNCTION check_plan_limit(
  p_user_id TEXT,
  p_limit_type TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_limits RECORD;
  v_usage RECORD;
  v_current INTEGER;
  v_limit INTEGER;
  v_allowed BOOLEAN;
BEGIN
  -- Get plan limits
  SELECT * INTO v_limits FROM get_user_plan_limits(p_user_id);
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'User not found', 'allowed', false);
  END IF;
  
  -- Get current usage
  SELECT * INTO v_usage FROM get_monthly_usage(p_user_id);
  
  -- Determine current usage and limit based on type
  CASE p_limit_type
    WHEN 'posts' THEN
      v_current := v_usage.posts_created;
      v_limit := v_limits.posts_limit;
    WHEN 'ai_generations' THEN
      v_current := v_usage.ai_generations_used;
      v_limit := v_limits.ai_generations_limit;
    WHEN 'accounts' THEN
      v_current := v_usage.accounts_connected;
      v_limit := v_limits.accounts_limit;
    ELSE
      RETURN jsonb_build_object('error', 'Invalid limit type', 'allowed', false);
  END CASE;
  
  -- Check if allowed (-1 means unlimited)
  v_allowed := (v_limit = -1 OR v_current < v_limit);
  
  RETURN jsonb_build_object(
    'plan', v_limits.plan,
    'limit', v_limit,
    'current', v_current,
    'allowed', v_allowed,
    'remaining', CASE WHEN v_limit = -1 THEN -1 ELSE GREATEST(0, v_limit - v_current) END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN RAISE NOTICE '✓ Functions created!'; END $$;

-- =====================================================
-- STEP 6: TRIGGERS
-- =====================================================

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_library_updated_at BEFORE UPDATE ON media_library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_analytics_updated_at BEFORE UPDATE ON post_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_generations_updated_at BEFORE UPDATE ON ai_generations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DO $$ BEGIN RAISE NOTICE '✓ Triggers created!'; END $$;

-- =====================================================
-- STEP 7: ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Service role full access on users" ON users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Service role full access on subscriptions" ON subscriptions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Posts policies
CREATE POLICY "Users can manage own posts" ON posts
  FOR ALL USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Service role full access on posts" ON posts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Social accounts policies
CREATE POLICY "Users can manage own social accounts" ON social_accounts
  FOR ALL USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Service role full access on social_accounts" ON social_accounts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Post analytics policies
CREATE POLICY "Users can view own post analytics" ON post_analytics
  FOR SELECT USING (
    post_id IN (SELECT id FROM posts WHERE user_id = auth.jwt() ->> 'sub')
  );

CREATE POLICY "Service role full access on post_analytics" ON post_analytics
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Media library policies
CREATE POLICY "Users can manage own media" ON media_library
  FOR ALL USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Service role full access on media_library" ON media_library
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Team members policies
CREATE POLICY "Users can view teams they're part of" ON team_members
  FOR SELECT USING (
    owner_id = auth.jwt() ->> 'sub' OR member_id = auth.jwt() ->> 'sub'
  );

CREATE POLICY "Owners can manage their team" ON team_members
  FOR ALL USING (owner_id = auth.jwt() ->> 'sub');

CREATE POLICY "Service role full access on team_members" ON team_members
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- AI generations policies
CREATE POLICY "Users can view own AI generations" ON ai_generations
  FOR SELECT USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can create AI generations" ON ai_generations
  FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Service role full access on ai_generations" ON ai_generations
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DO $$ BEGIN RAISE NOTICE '✓ RLS policies created!'; END $$;

-- =====================================================
-- FINAL VERIFICATION
-- =====================================================

DO $$ 
DECLARE
  v_tables INTEGER;
  v_functions INTEGER;
  v_triggers INTEGER;
  v_policies INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_tables FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  
  SELECT COUNT(*) INTO v_functions FROM information_schema.routines 
    WHERE routine_schema = 'public' AND routine_type = 'FUNCTION';
  
  SELECT COUNT(*) INTO v_triggers FROM information_schema.triggers 
    WHERE trigger_schema = 'public';
  
  SELECT COUNT(*) INTO v_policies FROM pg_policies 
    WHERE schemaname = 'public';
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓ FLOWPOST DATABASE SETUP COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables created: %', v_tables;
  RAISE NOTICE 'Functions created: %', v_functions;
  RAISE NOTICE 'Triggers created: %', v_triggers;
  RAISE NOTICE 'RLS policies created: %', v_policies;
  RAISE NOTICE '';
  RAISE NOTICE 'Database URL: https://bcqlqejenkgqwaqppzum.supabase.co';
  RAISE NOTICE 'Your FlowPost database is ready! 🚀';
  RAISE NOTICE '========================================';
END $$;

-- Show created tables
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;
