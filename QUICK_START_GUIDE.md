# 🚀 FlowPost AI Integration - Quick Start Guide

## ⚡ Get AI Working in 5 Minutes

### Step 1: Get OpenAI API Key (2 minutes)

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-proj-...`)

### Step 2: Add to Environment (30 seconds)

Create or update `nextjs-version/.env.local`:

```bash
OPENAI_API_KEY=sk-proj-your-actual-key-here-paste-it-here
```

### Step 3: Run Database Migration (1 minute)

**Option A: Supabase Dashboard (Easiest)**
1. Go to your Supabase project
2. Click "SQL Editor"
3. Copy contents from `nextjs-version/database/add_ai_tracking.sql`
4. Paste and click "Run"

**Option B: Command Line**
```bash
# If you have psql installed
psql -h your-supabase-host.supabase.co -U postgres -d postgres -f nextjs-version/database/add_ai_tracking.sql
```

### Step 4: Test the API (1 minute)

**Option A: Use the existing UI**
1. Start your dev server: `cd nextjs-version && npm run dev`
2. Go to http://localhost:3000/ai-generator
3. The page already works with mock data
4. To use real AI, update the `handleGenerate` function (see below)

**Option B: Test API directly with curl**
```bash
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a post about AI automation",
    "contentType": "caption",
    "platform": "instagram",
    "tone": "professional",
    "length": "medium"
  }'
```

### Step 5: Integrate with UI (30 seconds)

Replace the `handleGenerate` function in `nextjs-version/src/app/(dashboard)/ai-generator/page.tsx`:

Find this line (around line 200):
```typescript
const handleGenerate = async () => {
```

Replace the entire function with:

```typescript
const handleGenerate = async () => {
  if (!prompt.trim()) {
    toast.error("Please enter a prompt")
    return
  }

  if (!planLimits?.allowed) {
    toast.error("You've reached your monthly AI generation limit!")
    return
  }

  setGenerating(true)
  
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        contentType,
        platform,
        tone,
        length,
        keywords,
        includeEmojis,
        includeHashtags,
        brandVoice
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate')
    }

    setGeneratedContent(data.content)
    toast.success("Content generated!")
    
    await fetchPlanLimits()
    await fetchHistory()
  } catch (error: any) {
    toast.error(error.message || "Failed to generate")
  } finally {
    setGenerating(false)
  }
}
```

---

## ✅ That's It!

You now have:
- ✅ Real AI generation with GPT-4
- ✅ Token tracking
- ✅ Cost monitoring
- ✅ Usage limits
- ✅ Error handling

---

## 🧪 Test It

1. Go to http://localhost:3000/ai-generator
2. Enter a prompt: "Write about our new product launch"
3. Select platform: Instagram
4. Click "Generate Content"
5. Watch the magic happen! ✨

---

## 📊 Monitor Usage

Check your database:

```sql
-- See all generations today
SELECT * FROM ai_generated_content 
WHERE created_at >= CURRENT_DATE
ORDER BY created_at DESC;

-- Check costs
SELECT 
  COUNT(*) as generations,
  SUM(tokens_used) as total_tokens,
  SUM(cost) as total_cost
FROM ai_generated_content
WHERE created_at >= CURRENT_DATE;
```

---

## 💰 Cost Tracking

- Each generation costs ~$0.01
- 100 generations = ~$1
- 1,000 generations = ~$10

**Very affordable!**

---

## 🚨 Troubleshooting

### "Unauthorized" Error
- Make sure you're logged in with Clerk
- Check Clerk is properly configured

### "Failed to generate" Error
- Check OpenAI API key is correct
- Check you have credits in OpenAI account
- Check API key has proper permissions

### "Rate limit exceeded"
- Wait a minute and try again
- OpenAI has rate limits for new accounts
- Upgrade OpenAI account if needed

### Database Error
- Make sure migration ran successfully
- Check Supabase connection
- Verify table exists: `SELECT * FROM ai_generated_content LIMIT 1;`

---

## 🎯 Next Steps

### Want Streaming (Like ChatGPT)?

Use the streaming API instead:

```typescript
'use client';
import { useCompletion } from '@ai-sdk/react';

export function AIGenerator() {
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/ai/stream',
  });
  
  return (
    <div>
      <button onClick={() => complete(prompt, {
        body: { contentType, platform, tone, length }
      })}>
        Generate
      </button>
      <div>{completion}</div> {/* Updates in real-time! */}
    </div>
  );
}
```

### Want to Add Twitter Posting?

See `AI_AGENT_INTEGRATION_GUIDE.md` Phase 3

### Want Web Scraping?

See `AI_AGENT_INTEGRATION_GUIDE.md` Phase 5

---

## 📚 Documentation

- **Full Integration Guide:** `AI_AGENT_INTEGRATION_GUIDE.md`
- **Implementation Plan:** `IMPLEMENTATION_PLAN.md`
- **Implementation Status:** `IMPLEMENTATION_STATUS.md`
- **Vercel AI SDK Docs:** https://sdk.vercel.ai/docs

---

## 🎉 Congratulations!

You've successfully integrated AI into FlowPost!

**Your users can now:**
- Generate real AI content
- Create captions, hashtags, threads, stories
- Customize tone and style
- Track usage and costs

**You're ready to ship!** 🚀

---

**Questions?** Review the documentation or check the API routes for implementation details.

**Happy Building!** 💪
