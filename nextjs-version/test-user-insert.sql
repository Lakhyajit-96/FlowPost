-- Insert a test team member into your Supabase database
-- Run this in your Supabase SQL Editor

-- First, get your current user ID from Clerk
-- Replace 'YOUR_CLERK_USER_ID' with your actual Clerk user ID

INSERT INTO team_members (
  owner_id,
  member_id,
  role,
  permissions,
  is_active,
  invited_at,
  accepted_at,
  created_at,
  updated_at
) VALUES (
  'YOUR_CLERK_USER_ID',  -- Replace with your Clerk user ID
  'user_test123456789',   -- Test member ID
  'editor',               -- Role: owner, admin, editor, or viewer
  '{"canManageTeam": false, "canManagePosts": true, "canManageAnalytics": true, "canManageSettings": false}'::jsonb,
  true,                   -- Active status
  NOW(),                  -- Invited at
  NOW(),                  -- Accepted at
  NOW(),                  -- Created at
  NOW()                   -- Updated at
);

-- To find your Clerk user ID, run this query first:
-- SELECT clerk_user_id FROM users WHERE email = 'your-email@example.com';
