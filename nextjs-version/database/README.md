# FlowPost Database Setup

## 🎯 Quick Setup (2 Minutes)

### Step 1: Open Supabase SQL Editor

Go to: https://supabase.com/dashboard/project/bcqlqejenkgqwaqppzum/sql/new

### Step 2: Run the Complete Schema

1. Open `flowpost_complete_schema.sql`
2. Copy the ENTIRE file content
3. Paste into Supabase SQL Editor
4. Click "Run" (or press Ctrl+Enter)
5. Wait for completion (~10 seconds)

### Step 3: Verify Setup

You should see:
```
✓ FLOWPOST DATABASE SETUP COMPLETE!
Tables created: 8
Functions created: 4
Triggers created: 8
RLS policies created: 17
```

Go to Table Editor to verify: https://supabase.com/dashboard/project/bcqlqejenkgqwaqppzum/editor

## 📊 Database Schema Overview

### Core Tables (8 Total)

#### 1. **users** - User Accounts
- Clerk authentication integration
- Subscription tier and status
- User preferences and settings
- Onboarding state

**Key Fields**:
- `clerk_user_id` - Unique ID from Clerk
- `subscription_tier` - free, starter, professional, agency
- `subscription_status` - inactive, trialing, active, past_due, canceled
- `stripe_customer_id` - Stripe customer reference

#### 2. **subscriptions** - Stripe Subscriptions
- Complete Stripe subscription data
- Billing periods and trial info
- Cancellation tracking

**Key Fields**:
- `stripe_subscription_id` - Stripe subscription ID
- `plan_name` - Current plan
- `current_period_start/end` - Billing cycle
- `trial_start/end` - Trial period dates

#### 3. **posts** - Social Media Posts
- Multi-platform post content
- Scheduling and publishing status
- AI generation tracking
- Platform-specific post IDs

**Key Fields**:
- `content` - Post text
- `platforms` - Array of platforms (instagram, facebook, etc.)
- `status` - draft, scheduled, publishing, published, failed
- `scheduled_at` - When to publish
- `ai_generated` - Whether AI created it
- `platform_post_ids` - JSON with platform-specific IDs

#### 4. **social_accounts** - Connected Accounts
- OAuth tokens for each platform
- Account statistics
- Sync status and errors

**Key Fields**:
- `platform` - instagram, facebook, twitter, linkedin, youtube, pinterest
- `access_token` - OAuth access token
- `refresh_token` - OAuth refresh token
- `followers_count` - Current follower count
- `is_active` - Whether account is connected

#### 5. **post_analytics** - Engagement Metrics
- Likes, comments, shares, saves
- Impressions and reach
- Engagement rate calculation

**Key Fields**:
- `post_id` - Reference to post
- `platform` - Which platform
- `likes`, `comments`, `shares`, `saves` - Engagement counts
- `impressions`, `reach` - Reach metrics
- `engagement_rate` - Calculated percentage

#### 6. **media_library** - Uploaded Media
- Images and videos
- File metadata (size, dimensions, duration)
- Organization (folders, tags)
- Usage tracking

**Key Fields**:
- `file_url` - CDN URL
- `file_type` - MIME type
- `file_size` - Size in bytes
- `width`, `height` - Dimensions
- `folder` - Organization folder
- `tags` - Search tags

#### 7. **team_members** - Collaboration
- Team member invitations
- Role-based permissions
- Access control

**Key Fields**:
- `owner_id` - Team owner
- `member_id` - Team member
- `role` - owner, admin, editor, viewer
- `permissions` - Custom permissions JSON
- `is_active` - Active status

#### 8. **ai_generations** - AI Usage Tracking
- All AI content generations
- Token usage and costs
- Generation history

**Key Fields**:
- `prompt` - User's prompt
- `generated_content` - AI output
- `model` - GPT model used
- `tokens_used` - Token count
- `cost` - Cost in USD
- `generation_type` - caption, hashtags, post_idea, etc.

## 🔧 Helper Functions

### 1. `get_user_plan_limits(user_id)`
Returns plan limits for a user.

**Usage**:
```sql
SELECT * FROM get_user_plan_limits('user_123');
```

**Returns**:
```
plan          | posts_limit | ai_generations_limit | accounts_limit
starter       | 30          | 10                   | 3
```

### 2. `get_monthly_usage(user_id)`
Returns current month's usage.

**Usage**:
```sql
SELECT * FROM get_monthly_usage('user_123');
```

**Returns**:
```
posts_created | ai_generations_used | accounts_connected
5             | 3                   | 2
```

### 3. `check_plan_limit(user_id, limit_type)`
Check if user can perform action.

**Usage**:
```sql
SELECT check_plan_limit('user_123', 'posts');
```

**Returns**:
```json
{
  "plan": "starter",
  "limit": 30,
  "current": 5,
  "allowed": true,
  "remaining": 25
}
```

## 📈 Plan Limits

| Plan | Posts/Month | AI Generations | Accounts | Price |
|------|-------------|----------------|----------|-------|
| Free | 0 | 0 | 0 | $0 |
| Starter | 30 | 10 | 3 | $19 |
| Professional | 100 | 50 | 10 | $49 |
| Agency | Unlimited | Unlimited | Unlimited | $99 |

## 🔒 Security (RLS)

All tables have Row Level Security enabled:

- ✅ Users can only access their own data
- ✅ Service role (webhooks) has full access
- ✅ Team members can access shared data
- ✅ Authenticated users can CRUD their own records

## 🔄 Stripe Webhook Flow

When a user completes checkout:

1. **Stripe sends webhook** → `/api/stripe/webhook`
2. **Handler creates user record**:
   ```sql
   INSERT INTO users (clerk_user_id, email, subscription_tier, subscription_status, stripe_customer_id, trial_ends_at)
   VALUES ('user_123', 'user@example.com', 'starter', 'trialing', 'cus_xxx', NOW() + INTERVAL '14 days');
   ```

3. **Handler creates subscription record**:
   ```sql
   INSERT INTO subscriptions (user_id, stripe_subscription_id, plan_name, status, current_period_start, current_period_end)
   VALUES ('user_123', 'sub_xxx', 'starter', 'trialing', NOW(), NOW() + INTERVAL '1 month');
   ```

## 🧪 Testing the Database

### Test 1: Create a User
```sql
INSERT INTO users (clerk_user_id, email, full_name, subscription_tier)
VALUES ('test_user_123', 'test@flowpost.com', 'Test User', 'starter')
RETURNING *;
```

### Test 2: Check Plan Limits
```sql
SELECT check_plan_limit('test_user_123', 'posts');
```

### Test 3: Create a Post
```sql
INSERT INTO posts (user_id, content, platforms, status)
VALUES ('test_user_123', 'My first post!', ARRAY['instagram', 'facebook']::social_platform[], 'draft')
RETURNING *;
```

### Test 4: Get Monthly Usage
```sql
SELECT * FROM get_monthly_usage('test_user_123');
```

## 📱 Integration with App

### In your API routes:

```typescript
import { supabaseAdmin } from '@/lib/supabase/server'

// Check if user can create post
const { data: limitCheck } = await supabaseAdmin
  .rpc('check_plan_limit', {
    p_user_id: userId,
    p_limit_type: 'posts'
  })

if (!limitCheck.allowed) {
  return { error: 'Monthly post limit reached' }
}

// Create post
const { data: post } = await supabaseAdmin
  .from('posts')
  .insert({
    user_id: userId,
    content: 'Hello world!',
    platforms: ['instagram', 'facebook'],
    status: 'draft'
  })
  .select()
  .single()
```

## 🐛 Troubleshooting

### "relation does not exist" error
- Make sure you ran the complete schema file
- Check you're in the correct project

### "permission denied" error
- RLS policies are working correctly
- Use service role key for admin operations
- Use anon key for client-side operations

### "function does not exist" error
- Ensure all functions were created
- Check function names match exactly

## ✅ Verification Checklist

- [ ] Ran `flowpost_complete_schema.sql` successfully
- [ ] Verified 8 tables exist in Table Editor
- [ ] Tested `check_plan_limit` function
- [ ] Tested `get_monthly_usage` function
- [ ] Verified RLS policies are active
- [ ] Tested creating a user record
- [ ] Tested creating a post record
- [ ] Stripe webhook can write to database

## 🚀 Next Steps

1. ✅ Database setup complete
2. Test Stripe checkout flow
3. Verify webhook saves data correctly
4. Implement plan limit checks in app
5. Build post creation feature
6. Add AI content generation
7. Connect social media accounts

---

**Your FlowPost database is production-ready!** 🎉

All tables, functions, triggers, and security policies are configured for a real SaaS business.
