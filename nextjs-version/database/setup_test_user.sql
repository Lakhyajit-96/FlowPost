-- Setup Test User for AI Generator
-- Run this in Supabase SQL Editor to create a test user with a plan

-- Replace 'YOUR_CLERK_USER_ID' with your actual Clerk user ID
-- You can find it in the browser console: console.log(user.id)

-- Option 1: Create user with Starter plan (10 generations/month)
INSERT INTO users (
  clerk_user_id,
  email,
  full_name,
  subscription_tier,
  subscription_status,
  created_at
)
VALUES (
  'YOUR_CLERK_USER_ID',  -- Replace with your Clerk user ID
  'test@flowpost.com',
  'Test User',
  'starter',  -- Change to: 'free', 'starter', 'professional', or 'agency'
  'active',
  NOW()
)
ON CONFLICT (clerk_user_id) 
DO UPDATE SET 
  subscription_tier = 'starter',
  subscription_status = 'active';

-- Verify the user was created/updated
SELECT clerk_user_id, email, subscription_tier, subscription_status 
FROM users 
WHERE clerk_user_id = 'YOUR_CLERK_USER_ID';

-- Check current AI generation usage
SELECT COUNT(*) as generations_this_month
FROM ai_generated_content
WHERE user_id = 'YOUR_CLERK_USER_ID'
AND created_at >= DATE_TRUNC('month', NOW());

-- To test different plans, run one of these:

-- Set to Free plan (0 generations)
-- UPDATE users SET subscription_tier = 'free' WHERE clerk_user_id = 'YOUR_CLERK_USER_ID';

-- Set to Starter plan (10 generations)
-- UPDATE users SET subscription_tier = 'starter' WHERE clerk_user_id = 'YOUR_CLERK_USER_ID';

-- Set to Professional plan (50 generations)
-- UPDATE users SET subscription_tier = 'professional' WHERE clerk_user_id = 'YOUR_CLERK_USER_ID';

-- Set to Agency plan (unlimited generations)
-- UPDATE users SET subscription_tier = 'agency' WHERE clerk_user_id = 'YOUR_CLERK_USER_ID';

-- Reset monthly usage (for testing)
-- DELETE FROM ai_generated_content WHERE user_id = 'YOUR_CLERK_USER_ID';
