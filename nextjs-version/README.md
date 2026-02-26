# FlowPost - AI-Powered Social Media Management Platform

## 🚀 Quick Start

This is the Next.js version of FlowPost, a complete social media management platform with AI content generation.

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Clerk account
- Stripe account (for payments)

### Installation

```bash
cd nextjs-version
npm install
```

### Environment Setup

Create `.env.local` file:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Database Setup

1. Run the SQL scripts in `database/` folder in your Supabase SQL editor:
   - `flowpost_complete_schema.sql` - Main database schema
   - `ai_generated_content_table.sql` - AI content table
   - `setup_test_user.sql` - Test user setup

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✨ Features

### AI Content Generator (Fully Functional)

The AI Generator is production-ready with complete pricing plan integration:

#### Free Plan ($0/month)
- ❌ No AI generations
- ✅ View interface
- ✅ See locked features

#### Starter Plan ($19/month)
- ✅ 10 AI generations/month
- ✅ Caption & Hashtags
- ✅ Real-time usage tracking
- ✅ Content history
- ✅ Export options

#### Professional Plan ($49/month)
- ✅ 50 AI generations/month
- ✅ 5 content types (Caption, Hashtags, Post Ideas, Threads, Stories)
- ✅ Content analyzer
- ✅ AI suggestions
- ✅ Content variations
- ✅ 4 brand voices
- ✅ Advanced export

#### Agency Plan ($99/month)
- ✅ UNLIMITED generations
- ✅ ALL 6 content types (including Video Scripts)
- ✅ All 6 brand voices
- ✅ All premium features
- ✅ Priority support

### Key Features

1. **Content Generation**
   - 6 content types
   - 6 social platforms
   - 5 tone options
   - 3 length options
   - Keyword integration
   - Emoji/hashtag control

2. **Content Analysis**
   - Word/character count
   - Hashtag tracking
   - Emoji tracking
   - Engagement score
   - Reading time
   - Performance badges

3. **AI Suggestions**
   - Call-to-action prompts
   - Platform optimization
   - Storytelling tips
   - Data integration
   - One-click apply

4. **Brand Voice**
   - 6 voice profiles
   - Plan-based access
   - Consistent branding

5. **Content Variations**
   - 3 automatic variations
   - Copy/use functionality
   - A/B testing ready

6. **Export Options**
   - Text export (.txt)
   - JSON export (.json)
   - Native sharing
   - Metadata included

7. **History & Templates**
   - Unlimited history
   - 6 pre-built templates
   - Load/copy/delete
   - Full metadata

## 🔒 Security

- Row Level Security (RLS)
- User data isolation
- Authentication required
- Input validation
- SQL injection prevention

## 📊 Database Schema

### Main Tables
- `users` - User accounts and subscriptions
- `ai_generated_content` - Generated content history
- `social_connections` - Connected social accounts
- `posts` - Scheduled posts
- `subscriptions` - Stripe subscriptions

## 🎯 Testing the AI Generator

### Test User Setup

1. Sign up with Clerk
2. Note your Clerk User ID from console
3. Run `setup_test_user.sql` with your user ID
4. Set subscription tier in users table

### Verify Pricing Plans

**Free Plan:**
```sql
UPDATE users SET subscription_tier = 'free' WHERE clerk_user_id = 'your_id';
```
- Should see "No AI generations available"
- All features locked

**Starter Plan:**
```sql
UPDATE users SET subscription_tier = 'starter' WHERE clerk_user_id = 'your_id';
```
- Should have 10 generations/month
- Only Caption & Hashtags unlocked

**Professional Plan:**
```sql
UPDATE users SET subscription_tier = 'professional' WHERE clerk_user_id = 'your_id';
```
- Should have 50 generations/month
- 5 content types unlocked
- All analysis features available

**Agency Plan:**
```sql
UPDATE users SET subscription_tier = 'agency' WHERE clerk_user_id = 'your_id';
```
- Should show "Unlimited generations"
- All 6 content types unlocked
- All features available

### Test Workflow

1. **Generate Content**
   - Enter a prompt
   - Select content type
   - Choose platform, tone, length
   - Add keywords
   - Click "Generate Content"
   - Verify content appears

2. **Check Usage Tracking**
   - Generate content
   - Verify counter decreases
   - Check progress bar updates
   - Verify monthly reset

3. **Test Plan Limits**
   - Generate until limit reached
   - Verify error message
   - Verify button disabled
   - Check upgrade prompt

4. **Test Content Analysis**
   - Generate content
   - Verify word/character count
   - Check engagement score
   - Verify badges appear

5. **Test AI Suggestions**
   - Click "Apply" on suggestion
   - Verify prompt updates
   - Generate with suggestion

6. **Test Content Variations**
   - Generate content
   - Verify 3 variations appear
   - Click "Use" on variation
   - Verify content replaces

7. **Test Export**
   - Generate content
   - Click "Export" dropdown
   - Export as Text
   - Export as JSON
   - Verify files download

8. **Test History**
   - Generate and save content
   - Switch to History tab
   - Verify content appears
   - Load from history
   - Delete from history

9. **Test Templates**
   - Switch to Templates tab
   - Click a template
   - Verify prompt loads
   - Generate content

## 🐛 Troubleshooting

### AI Generator Not Working

1. Check Clerk authentication
2. Verify Supabase connection
3. Check user exists in database
4. Verify subscription_tier is set
5. Check browser console for errors

### Usage Not Tracking

1. Verify ai_generated_content table exists
2. Check RLS policies are active
3. Verify user_id matches Clerk ID
4. Check created_at timestamps

### Content Not Saving

1. Check Supabase connection
2. Verify table permissions
3. Check RLS policies
4. Verify user authentication

## 📝 Development

### Project Structure

```
nextjs-version/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (dashboard)/     # Dashboard pages
│   │   │   └── ai-generator/
│   │   │       ├── page.tsx
│   │   │       └── components/
│   │   └── api/             # API routes
│   ├── components/          # Shared components
│   ├── lib/                 # Utilities
│   └── hooks/               # Custom hooks
├── database/                # SQL scripts
└── public/                  # Static assets
```

### Key Files

- `src/app/(dashboard)/ai-generator/page.tsx` - Main AI generator
- `src/lib/supabase/client.ts` - Supabase client
- `database/flowpost_complete_schema.sql` - Database schema
- `database/ai_generated_content_table.sql` - AI content table

## 🚀 Deployment

### Vercel Deployment

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables

Add all variables from `.env.local` to Vercel:
- Clerk keys
- Supabase keys
- Stripe keys

### Post-Deployment

1. Run database migrations
2. Set up Stripe webhooks
3. Configure Clerk production
4. Test all features

## 📞 Support

For issues or questions:
- Check console logs
- Verify environment variables
- Check database connection
- Review Supabase logs

## 🎉 Success Criteria

✅ AI Generator fully functional
✅ Pricing plans working correctly
✅ Database integration complete
✅ Real-time usage tracking
✅ Content analysis working
✅ AI suggestions functional
✅ Export options working
✅ History & templates working
✅ All icons added
✅ Layout optimized
✅ No diagnostic errors
✅ Production ready

## 📄 License

See License.md

---

**Built with ❤️ by Lakhyajit**
**Repository:** https://github.com/Lakhyajit-96/FlowPost.git
