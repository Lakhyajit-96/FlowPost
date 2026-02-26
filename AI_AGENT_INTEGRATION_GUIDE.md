# 🤖 Complete AI Agent Integration Guide for FlowPost

## 📋 Table of Contents
1. [Executive Summary](#executive-summary)
2. [What's Inside Each Repo](#whats-inside)
3. [How They Work (Real Implementation)](#how-they-work)
4. [Practical Integration for FlowPost](#practical-integration)
5. [Ready-to-Use Code Examples](#code-examples)
6. [Step-by-Step Implementation](#implementation-steps)

---

## 🎯 Executive Summary <a name="executive-summary"></a>

You have two powerful AI repositories downloaded. Here's what they actually do and how to use them:

### **ai-main** (Vercel AI SDK) - Your AI Brain
Think of this as your AI engine. It's like having ChatGPT built into your app.

**What it does:**
- Generates text using AI (OpenAI, Anthropic, Google, etc.)
- Streams responses in real-time (like ChatGPT typing)
- Provides React hooks for easy UI integration
- Handles structured data generation (JSON, objects)

**Real-world use:**
```typescript
// Generate a social media post
const { text } = await generateText({
  model: openai('gpt-4'),
  prompt: 'Write a Twitter post about AI',
});
// Result: "🤖 AI is transforming how we work..."
```

### **social-media-agent-main** (LangChain Social Media Agent) - Your Automation System
Think of this as a complete social media automation workflow.

**What it does:**
- Takes a URL → Scrapes content → Generates posts → Posts to Twitter/LinkedIn
- Handles OAuth authentication for social platforms
- Manages images and media uploads
- Provides human approval workflow (you review before posting)

**Real-world use:**
```typescript
// Give it a blog URL, it creates and posts content
await client.runs.create(thread_id, "generate_post", {
  input: { links: ["https://yourblog.com/article"] }
});
// Result: Automatically generates Twitter + LinkedIn posts with images
```

### **The Perfect Combination for FlowPost:**
- Use **Vercel AI SDK** for: Real-time AI generation in your UI
- Use **Social Media Agent** concepts for: Platform posting, OAuth, scheduling

---

## � What's Inside Each Repo <a name="whats-inside"></a>

### **Vercel AI SDK (ai-main)** - File Structure Explained

```
ai-main/
├── packages/
│   ├── ai/                          # ⭐ MAIN PACKAGE - This is what you'll use
│   │   ├── src/
│   │   │   ├── generate-text.ts     # Generate AI text
│   │   │   ├── stream-text.ts       # Stream AI responses
│   │   │   ├── generate-object.ts   # Generate structured data
│   │   │   └── tool.ts              # Define AI tools/functions
│   │   └── package.json             # Version: 6.0.103
│   │
│   ├── react/                       # ⭐ REACT HOOKS - For your UI
│   │   ├── src/
│   │   │   ├── use-chat.ts          # Chat interface hook
│   │   │   ├── use-completion.ts    # Text completion hook
│   │   │   └── use-assistant.ts     # Assistant API hook
│   │
│   ├── openai/                      # OpenAI provider
│   ├── anthropic/                   # Anthropic (Claude) provider
│   ├── google/                      # Google AI provider
│   └── [50+ more providers]
│
└── examples/
    ├── next-agent/                  # ⭐ MOST RELEVANT EXAMPLE
    │   ├── agent/
    │   │   └── weather-agent.ts     # How to build an agent
    │   ├── app/api/chat/route.ts    # API route example
    │   └── tool/weather-tool.ts     # Tool definition
    │
    └── ai-functions/                # More examples
```

**Key Files You'll Actually Use:**
1. `packages/ai/` - Core AI functions (install as `npm install ai`)
2. `packages/react/` - React hooks (install as `npm install @ai-sdk/react`)
3. `packages/openai/` - OpenAI integration (install as `npm install @ai-sdk/openai`)
4. `examples/next-agent/` - Copy these patterns for your implementation

---

### **Social Media Agent (social-media-agent-main)** - File Structure Explained

```
social-media-agent-main/
├── src/
│   ├── agents/
│   │   ├── generate-post/           # ⭐ MAIN WORKFLOW
│   │   │   ├── generate-post-graph.ts    # Complete workflow logic
│   │   │   ├── nodes/
│   │   │   │   ├── generate-post/        # Post generation
│   │   │   │   ├── generate-report/      # Content analysis
│   │   │   │   └── condense-post.ts      # Shorten posts
│   │   │   └── prompts/
│   │   │       ├── index.ts              # ⭐ PROMPTS TO CUSTOMIZE
│   │   │       └── examples.ts           # Example posts
│   │   │
│   │   ├── upload-post/             # Posting to platforms
│   │   ├── ingest-data/             # Slack integration
│   │   └── verify-links/            # URL verification
│   │
│   ├── clients/                     # ⭐ PLATFORM INTEGRATIONS
│   │   ├── twitter/
│   │   │   └── client.ts            # Twitter API wrapper
│   │   ├── linkedin.ts              # LinkedIn API wrapper
│   │   └── auth-server.ts           # OAuth server
│   │
│   └── utils/
│       ├── firecrawl.ts             # ⭐ WEB SCRAPING
│       ├── supabase.ts              # Image storage
│       └── date.ts                  # Scheduling utilities
│
├── scripts/
│   ├── generate-post.ts             # ⭐ HOW TO RUN THE AGENT
│   └── crons/                       # Cron job management
│
└── langgraph.json                   # Graph configuration
```

**Key Files You'll Actually Use:**
1. `src/clients/twitter/client.ts` - Copy this for Twitter integration
2. `src/clients/linkedin.ts` - Copy this for LinkedIn integration
3. `src/utils/firecrawl.ts` - Copy this for web scraping
4. `src/agents/generate-post/prompts/` - Customize these prompts
5. `scripts/generate-post.ts` - See how to invoke the workflow

---

## ⚙️ How They Work (Real Implementation) <a name="how-they-work"></a>

### **Vercel AI SDK - How It Actually Works**

#### **1. Basic Text Generation**
```typescript
// File: nextjs-version/src/app/api/ai/generate/route.ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  // This calls OpenAI API and returns the result
  const { text } = await generateText({
    model: openai('gpt-4'),
    prompt: `Generate a Twitter post about: ${prompt}`,
  });
  
  return Response.json({ content: text });
}
```

**What happens:**
1. User sends prompt to your API
2. `generateText()` calls OpenAI API
3. OpenAI returns generated text
4. You send it back to user

**Cost:** ~$0.03 per 1000 tokens (GPT-4)

#### **2. Streaming Responses (Like ChatGPT)**
```typescript
// File: nextjs-version/src/app/api/ai/stream/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  const result = streamText({
    model: openai('gpt-4'),
    prompt,
  });
  
  // Returns a stream that sends text as it's generated
  return result.toDataStreamResponse();
}
```

**In your React component:**
```typescript
'use client';
import { useCompletion } from '@ai-sdk/react';

export function AIGenerator() {
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/ai/stream',
  });
  
  return (
    <div>
      <button onClick={() => complete('Write a post about AI')}>
        Generate
      </button>
      {/* Text appears word by word as it's generated */}
      <div>{completion}</div>
    </div>
  );
}
```

**What happens:**
1. User clicks button
2. Request sent to `/api/ai/stream`
3. Text streams back word-by-word
4. UI updates in real-time (like ChatGPT typing)

---

### **Social Media Agent - How It Actually Works**

#### **1. The Complete Workflow**

```typescript
// File: social-media-agent-main/scripts/generate-post.ts
import { Client } from "@langchain/langgraph-sdk";

async function generatePost() {
  // 1. Connect to LangGraph server
  const client = new Client({
    apiUrl: "http://localhost:54367"
  });
  
  // 2. Create a thread (conversation)
  const { thread_id } = await client.threads.create();
  
  // 3. Start the workflow
  await client.runs.create(thread_id, "generate_post", {
    input: {
      links: ["https://blog.example.com/article"]
    }
  });
}
```

**What happens behind the scenes:**

**Step 1: Scrape Content**
```typescript
// Uses FireCrawl to extract content from URL
const content = await scrapeUrl("https://blog.example.com/article");
// Result: Full article text in markdown format
```

**Step 2: Generate Report**
```typescript
// Analyzes if content is relevant for your business
const report = await generateContentReport(content);
// Result: Summary of key points, relevance score
```

**Step 3: Generate Posts**
```typescript
// Creates Twitter and LinkedIn posts
const posts = await generatePost(report);
// Result: 
// {
//   twitter: "🚀 New AI breakthrough...",
//   linkedin: "Excited to share insights on..."
// }
```

**Step 4: Human Approval**
```typescript
// Pauses and waits for your approval
await humanNode(); // Graph stops here
// You review in Agent Inbox, then approve/reject/edit
```

**Step 5: Post to Platforms**
```typescript
// If approved, posts to Twitter and LinkedIn
await uploadPost(posts);
// Result: Posts live on both platforms
```

#### **2. Twitter Integration - How It Works**

```typescript
// File: social-media-agent-main/src/clients/twitter/client.ts
import { TwitterApi } from 'twitter-api-v2';

export class TwitterClient {
  private twitterClient: TwitterApi;
  
  constructor() {
    // Authenticates with Twitter API
    this.twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_KEY_SECRET,
      accessToken: process.env.TWITTER_USER_TOKEN,
      accessSecret: process.env.TWITTER_USER_TOKEN_SECRET,
    });
  }
  
  // Post a tweet
  async uploadTweet({ text, media }) {
    // 1. Upload image if provided
    let mediaId;
    if (media) {
      mediaId = await this.uploadMedia(media.buffer, media.mimeType);
    }
    
    // 2. Post tweet with image
    const response = await this.twitterClient.v2.tweet({
      text,
      media: mediaId ? { media_ids: [mediaId] } : undefined
    });
    
    return response;
  }
  
  // Upload media to Twitter
  async uploadMedia(buffer: Buffer, mimeType: string) {
    const mediaId = await this.twitterClient.readWrite.v1.uploadMedia(
      buffer,
      { mimeType }
    );
    return mediaId;
  }
}
```

**What happens:**
1. You provide text + optional image
2. Image uploaded to Twitter first (gets media ID)
3. Tweet posted with text + media ID
4. Twitter returns tweet URL

**Authentication:**
- Need Twitter Developer Account
- Create app in Twitter Developer Portal
- Get API keys and tokens
- Set in environment variables

#### **3. LinkedIn Integration - How It Works**

```typescript
// File: social-media-agent-main/src/clients/linkedin.ts
export class LinkedInClient {
  private accessToken: string;
  private personUrn: string;
  
  // Post text to LinkedIn
  async createTextPost(text: string) {
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        author: `urn:li:person:${this.personUrn}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      })
    });
    
    return response.json();
  }
  
  // Post with image
  async createImagePost({ text, imageUrl }) {
    // 1. Register upload with LinkedIn
    const registerResponse = await this.registerUpload();
    
    // 2. Upload image to LinkedIn's server
    const imageBuffer = await fetch(imageUrl).then(r => r.arrayBuffer());
    await this.uploadImage(imageBuffer, registerResponse.uploadUrl);
    
    // 3. Create post with uploaded image
    return this.createPost(text, registerResponse.assetId);
  }
}
```

**What happens:**
1. Authenticate with LinkedIn OAuth
2. Get access token and person URN
3. Post text or image to LinkedIn API
4. LinkedIn returns post URL

#### **4. Web Scraping - How It Works**

```typescript
// Uses FireCrawl API to scrape websites
import FirecrawlApp from '@mendable/firecrawl-js';

export async function scrapeUrl(url: string) {
  const app = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY
  });
  
  // Scrapes the URL and returns markdown
  const result = await app.scrapeUrl(url, {
    formats: ['markdown'],
  });
  
  return result.markdown;
}
```

**What happens:**
1. Send URL to FireCrawl API
2. FireCrawl fetches page, removes ads/navigation
3. Converts to clean markdown
4. Returns article text

**Cost:** FireCrawl gives 500 free credits, then ~$0.001 per page

---

## � Practical Integration for FlowPost <a name="practical-integration"></a>

### **What You Should Actually Do**

#### **Option 1: Quick Start (Recommended for MVP)**
Use Vercel AI SDK only - Get AI generation working in 1 day

**Steps:**
1. Install Vercel AI SDK
2. Replace your mock AI with real `generateText()`
3. Add streaming with `useCompletion()`
4. Done! You have working AI generation

**Pros:**
- Fast implementation (1 day)
- No complex setup
- Works immediately
- Easy to maintain

**Cons:**
- No automatic posting to platforms
- No web scraping
- Manual copy-paste to social media

#### **Option 2: Full Integration (Recommended for Production)**
Use Vercel AI SDK + Extract code from Social Media Agent

**Steps:**
1. Start with Option 1 (Vercel AI SDK)
2. Copy Twitter client from social-media-agent
3. Copy LinkedIn client from social-media-agent
4. Add FireCrawl for web scraping
5. Build your own workflow

**Pros:**
- Full control over features
- Customizable to your needs
- No LangGraph dependency
- Easier to understand

**Cons:**
- More code to write
- Need to handle OAuth yourself
- Takes 2-3 weeks

#### **Option 3: Use Social Media Agent As-Is**
Run the entire social-media-agent system

**Steps:**
1. Install LangGraph CLI
2. Configure environment variables
3. Start LangGraph server
4. Use Agent Inbox for approvals

**Pros:**
- Complete solution out of the box
- Human-in-the-loop built-in
- Proven workflow

**Cons:**
- Heavy dependency (LangGraph)
- Less flexible
- Harder to customize
- Requires Python + Node.js

---

### **Recommended Approach for FlowPost: Option 2**

Here's why:
1. You already have a UI (AI Generator page)
2. You want custom branding and workflow
3. You need flexibility for future features
4. You don't need the full LangGraph complexity

**What to extract from each repo:**

#### **From Vercel AI SDK:**
- ✅ `generateText()` - Core AI generation
- ✅ `streamText()` - Streaming responses
- ✅ `useCompletion()` - React hook for UI
- ✅ Tool calling patterns

#### **From Social Media Agent:**
- ✅ `TwitterClient` class - Twitter API wrapper
- ✅ `LinkedInClient` class - LinkedIn API wrapper
- ✅ `scrapeUrl()` function - Web scraping
- ✅ Prompt templates - Post generation prompts
- ✅ OAuth flows - Authentication logic

---

### **File Extraction Guide**

#### **Files to Copy from social-media-agent-main:**

1. **Twitter Integration**
```bash
# Copy entire Twitter client
cp -r social-media-agent-main/src/clients/twitter/ \
  nextjs-version/src/lib/platforms/twitter/
```

2. **LinkedIn Integration**
```bash
# Copy LinkedIn client
cp social-media-agent-main/src/clients/linkedin.ts \
  nextjs-version/src/lib/platforms/linkedin.ts
```

3. **Web Scraping**
```bash
# Copy FireCrawl utility
cp social-media-agent-main/src/utils/firecrawl.ts \
  nextjs-version/src/lib/scraping/firecrawl.ts
```

4. **Prompts (Customize these!)**
```bash
# Copy prompt templates
cp -r social-media-agent-main/src/agents/generate-post/prompts/ \
  nextjs-version/src/lib/ai/prompts/
```

5. **OAuth Server (Optional)**
```bash
# Copy auth server if you want to handle OAuth yourself
cp social-media-agent-main/src/clients/auth-server.ts \
  nextjs-version/src/lib/auth/social-auth-server.ts
```

#### **Dependencies to Install:**

```bash
cd nextjs-version

# Vercel AI SDK
npm install ai @ai-sdk/openai @ai-sdk/react zod

# Social Media APIs
npm install twitter-api-v2 @arcadeai/arcadejs

# Web Scraping
npm install @mendable/firecrawl-js

# Image Storage (optional)
npm install @supabase/supabase-js

# OAuth (if not using Arcade)
npm install express express-session passport passport-twitter
```

---

## 💻 Ready-to-Use Code Examples <a name="code-examples"></a>

### **Example 1: Basic AI Generation (Copy-Paste Ready)**

```typescript
// File: nextjs-version/src/app/api/ai/generate/route.ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  try {
    const { prompt, platform, contentType } = await req.json();
    
    // Customize prompt based on platform
    const systemPrompt = platform === 'twitter' 
      ? 'You are a Twitter content expert. Create engaging tweets under 280 characters.'
      : 'You are a LinkedIn content expert. Create professional posts.';
    
    const { text } = await generateText({
      model: openai('gpt-4'),
      system: systemPrompt,
      prompt: `Create a ${contentType} about: ${prompt}`,
    });
    
    return Response.json({ 
      success: true, 
      content: text 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

**Usage in your AI Generator page:**
```typescript
const handleGenerate = async () => {
  setGenerating(true);
  
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: userInput,
      platform: selectedPlatform,
      contentType: selectedType
    }),
  });
  
  const data = await response.json();
  if (data.success) {
    setGeneratedContent(data.content);
  }
  
  setGenerating(false);
};
```

---

### **Example 2: Streaming AI Generation (Like ChatGPT)**

```typescript
// File: nextjs-version/src/app/api/ai/stream/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt, platform } = await req.json();
  
  const systemPrompt = platform === 'twitter'
    ? 'Create engaging tweets under 280 characters.'
    : 'Create professional LinkedIn posts.';
  
  const result = streamText({
    model: openai('gpt-4'),
    system: systemPrompt,
    prompt,
  });
  
  return result.toDataStreamResponse();
}
```

**Usage with React Hook:**
```typescript
'use client';
import { useCompletion } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function AIGeneratorStreaming() {
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/ai/stream',
  });
  
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('twitter');
  
  const handleGenerate = () => {
    complete(prompt, {
      body: { platform }
    });
  };
  
  return (
    <div className="space-y-4">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="What do you want to post about?"
      />
      
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Content'}
      </Button>
      
      {completion && (
        <div className="p-4 border rounded bg-white">
          <p className="whitespace-pre-wrap">{completion}</p>
        </div>
      )}
    </div>
  );
}
```

---

### **Example 3: Post to Twitter**

```typescript
// File: nextjs-version/src/lib/platforms/twitter.ts
import { TwitterApi } from 'twitter-api-v2';

export class TwitterService {
  private client: TwitterApi;
  
  constructor() {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_KEY_SECRET!,
      accessToken: process.env.TWITTER_USER_TOKEN!,
      accessSecret: process.env.TWITTER_USER_TOKEN_SECRET!,
    });
  }
  
  async postTweet(text: string, imageBuffer?: Buffer) {
    try {
      let mediaId: string | undefined;
      
      // Upload image if provided
      if (imageBuffer) {
        mediaId = await this.client.v1.uploadMedia(imageBuffer, {
          mimeType: 'image/jpeg',
        });
      }
      
      // Post tweet
      const tweet = await this.client.v2.tweet({
        text,
        ...(mediaId && { media: { media_ids: [mediaId] } })
      });
      
      return {
        success: true,
        tweetId: tweet.data.id,
        url: `https://twitter.com/user/status/${tweet.data.id}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
```

**API Route:**
```typescript
// File: nextjs-version/src/app/api/posts/twitter/route.ts
import { TwitterService } from '@/lib/platforms/twitter';

export async function POST(req: Request) {
  const { content, image } = await req.json();
  
  const twitter = new TwitterService();
  
  // Convert base64 image to buffer if provided
  let imageBuffer: Buffer | undefined;
  if (image) {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    imageBuffer = Buffer.from(base64Data, 'base64');
  }
  
  const result = await twitter.postTweet(content, imageBuffer);
  
  return Response.json(result);
}
```

---

### **Example 4: Post to LinkedIn**

```typescript
// File: nextjs-version/src/lib/platforms/linkedin.ts
export class LinkedInService {
  private accessToken: string;
  private personUrn: string;
  
  constructor() {
    this.accessToken = process.env.LINKEDIN_ACCESS_TOKEN!;
    this.personUrn = process.env.LINKEDIN_PERSON_URN!;
  }
  
  async createPost(text: string) {
    try {
      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify({
          author: `urn:li:person:${this.personUrn}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: { text },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
          }
        })
      });
      
      const data = await response.json();
      
      return {
        success: true,
        postId: data.id,
        url: `https://www.linkedin.com/feed/update/${data.id}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
```

**API Route:**
```typescript
// File: nextjs-version/src/app/api/posts/linkedin/route.ts
import { LinkedInService } from '@/lib/platforms/linkedin';

export async function POST(req: Request) {
  const { content } = await req.json();
  
  const linkedin = new LinkedInService();
  const result = await linkedin.createPost(content);
  
  return Response.json(result);
}
```

---

### **Example 5: Web Scraping with FireCrawl**

```typescript
// File: nextjs-version/src/lib/scraping/firecrawl.ts
import FirecrawlApp from '@mendable/firecrawl-js';

export async function scrapeUrl(url: string) {
  try {
    const app = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY!
    });
    
    const result = await app.scrapeUrl(url, {
      formats: ['markdown'],
    });
    
    return {
      success: true,
      content: result.markdown,
      title: result.metadata?.title,
      description: result.metadata?.description,
      images: result.metadata?.image ? [result.metadata.image] : []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

**API Route:**
```typescript
// File: nextjs-version/src/app/api/scrape/route.ts
import { scrapeUrl } from '@/lib/scraping/firecrawl';

export async function POST(req: Request) {
  const { url } = await req.json();
  
  const result = await scrapeUrl(url);
  
  return Response.json(result);
}
```

---

### **Example 6: Complete Workflow (URL → AI → Post)**

```typescript
// File: nextjs-version/src/lib/workflows/generate-and-post.ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { scrapeUrl } from '@/lib/scraping/firecrawl';
import { TwitterService } from '@/lib/platforms/twitter';
import { LinkedInService } from '@/lib/platforms/linkedin';

export async function generateAndPost(url: string, platforms: string[]) {
  try {
    // 1. Scrape content from URL
    const scrapeResult = await scrapeUrl(url);
    if (!scrapeResult.success) {
      throw new Error('Failed to scrape URL');
    }
    
    // 2. Generate posts using AI
    const { text: twitterPost } = await generateText({
      model: openai('gpt-4'),
      system: 'Create engaging tweets under 280 characters.',
      prompt: `Create a Twitter post about this content:\n\n${scrapeResult.content}`
    });
    
    const { text: linkedinPost } = await generateText({
      model: openai('gpt-4'),
      system: 'Create professional LinkedIn posts.',
      prompt: `Create a LinkedIn post about this content:\n\n${scrapeResult.content}`
    });
    
    // 3. Post to selected platforms
    const results = [];
    
    if (platforms.includes('twitter')) {
      const twitter = new TwitterService();
      const twitterResult = await twitter.postTweet(twitterPost);
      results.push({ platform: 'twitter', ...twitterResult });
    }
    
    if (platforms.includes('linkedin')) {
      const linkedin = new LinkedInService();
      const linkedinResult = await linkedin.createPost(linkedinPost);
      results.push({ platform: 'linkedin', ...linkedinResult });
    }
    
    return {
      success: true,
      posts: {
        twitter: twitterPost,
        linkedin: linkedinPost
      },
      results
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

**API Route:**
```typescript
// File: nextjs-version/src/app/api/workflows/generate-and-post/route.ts
import { generateAndPost } from '@/lib/workflows/generate-and-post';

export async function POST(req: Request) {
  const { url, platforms } = await req.json();
  
  const result = await generateAndPost(url, platforms);
  
  return Response.json(result);
}
```

**Usage in UI:**
```typescript
const handleGenerateAndPost = async () => {
  setLoading(true);
  
  const response = await fetch('/api/workflows/generate-and-post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: inputUrl,
      platforms: ['twitter', 'linkedin']
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    toast.success('Posted to all platforms!');
  } else {
    toast.error(data.error);
  }
  
  setLoading(false);
};
```

---

## 📋 Step-by-Step Implementation <a name="implementation-steps"></a>

### **Phase 1: Get AI Generation Working (Day 1)**

#### **Step 1: Install Dependencies**
```bash
cd nextjs-version
npm install ai @ai-sdk/openai @ai-sdk/react zod
```

#### **Step 2: Set Environment Variables**
```bash
# Add to nextjs-version/.env.local
OPENAI_API_KEY=sk-your-key-here
```

#### **Step 3: Create AI API Route**
Create file: `nextjs-version/src/app/api/ai/generate/route.ts`
```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt, platform } = await req.json();
  
  const systemPrompt = platform === 'twitter'
    ? 'Create engaging tweets under 280 characters.'
    : 'Create professional LinkedIn posts.';
  
  const { text } = await generateText({
    model: openai('gpt-4'),
    system: systemPrompt,
    prompt,
  });
  
  return Response.json({ content: text });
}
```

#### **Step 4: Update Your AI Generator Page**
Find your existing AI Generator page and replace the mock generation:
```typescript
// In nextjs-version/src/app/(dashboard)/ai-generator/page.tsx
const handleGenerate = async () => {
  setGenerating(true);
  
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: userInput,
        platform: selectedPlatform
      }),
    });
    
    const data = await response.json();
    setGeneratedContent(data.content);
  } catch (error) {
    console.error('Generation failed:', error);
  }
  
  setGenerating(false);
};
```

#### **Step 5: Test It**
1. Run your dev server: `npm run dev`
2. Go to AI Generator page
3. Enter a prompt
4. Click generate
5. You should see real AI-generated content!

**✅ Checkpoint:** You now have working AI generation!

---

### **Phase 2: Add Streaming (Day 2)**

#### **Step 1: Create Streaming API Route**
Create file: `nextjs-version/src/app/api/ai/stream/route.ts`
```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt, platform } = await req.json();
  
  const systemPrompt = platform === 'twitter'
    ? 'Create engaging tweets under 280 characters.'
    : 'Create professional LinkedIn posts.';
  
  const result = streamText({
    model: openai('gpt-4'),
    system: systemPrompt,
    prompt,
  });
  
  return result.toDataStreamResponse();
}
```

#### **Step 2: Update UI to Use Streaming**
```typescript
'use client';
import { useCompletion } from '@ai-sdk/react';

export function AIGeneratorPage() {
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/ai/stream',
  });
  
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('twitter');
  
  const handleGenerate = () => {
    complete(prompt, {
      body: { platform }
    });
  };
  
  return (
    <div>
      {/* Your existing UI */}
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate'}
      </Button>
      
      {/* Display streaming content */}
      {completion && (
        <div className="mt-4 p-4 border rounded">
          <p className="whitespace-pre-wrap">{completion}</p>
        </div>
      )}
    </div>
  );
}
```

**✅ Checkpoint:** Content now streams word-by-word like ChatGPT!

---

### **Phase 3: Add Twitter Integration (Week 1)**

#### **Step 1: Get Twitter API Credentials**
1. Go to https://developer.twitter.com/
2. Create a new app
3. Get these credentials:
   - API Key
   - API Key Secret
   - Access Token
   - Access Token Secret

#### **Step 2: Set Environment Variables**
```bash
# Add to nextjs-version/.env.local
TWITTER_API_KEY=your-api-key
TWITTER_API_KEY_SECRET=your-api-key-secret
TWITTER_USER_TOKEN=your-access-token
TWITTER_USER_TOKEN_SECRET=your-access-token-secret
```

#### **Step 3: Install Twitter API**
```bash
npm install twitter-api-v2
```

#### **Step 4: Copy Twitter Client**
Copy the file from social-media-agent:
```bash
# Create directory
mkdir -p nextjs-version/src/lib/platforms

# Copy Twitter client (manually copy the TwitterService class from Example 3 above)
```

Or create file: `nextjs-version/src/lib/platforms/twitter.ts`
```typescript
import { TwitterApi } from 'twitter-api-v2';

export class TwitterService {
  private client: TwitterApi;
  
  constructor() {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_KEY_SECRET!,
      accessToken: process.env.TWITTER_USER_TOKEN!,
      accessSecret: process.env.TWITTER_USER_TOKEN_SECRET!,
    });
  }
  
  async postTweet(text: string) {
    const tweet = await this.client.v2.tweet(text);
    return {
      success: true,
      tweetId: tweet.data.id,
      url: `https://twitter.com/user/status/${tweet.data.id}`
    };
  }
}
```

#### **Step 5: Create Twitter API Route**
Create file: `nextjs-version/src/app/api/posts/twitter/route.ts`
```typescript
import { TwitterService } from '@/lib/platforms/twitter';

export async function POST(req: Request) {
  const { content } = await req.json();
  
  const twitter = new TwitterService();
  const result = await twitter.postTweet(content);
  
  return Response.json(result);
}
```

#### **Step 6: Add Post Button to UI**
```typescript
const handlePostToTwitter = async () => {
  const response = await fetch('/api/posts/twitter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: generatedContent })
  });
  
  const data = await response.json();
  if (data.success) {
    toast.success('Posted to Twitter!');
  }
};
```

**✅ Checkpoint:** You can now post to Twitter!

---

### **Phase 4: Add LinkedIn Integration (Week 1)**

#### **Step 1: Get LinkedIn API Credentials**
1. Go to https://developer.linkedin.com/
2. Create a new app
3. Enable "Share on LinkedIn" product
4. Get OAuth credentials

#### **Step 2: Run OAuth Flow**
You need to get an access token. Two options:

**Option A: Use Arcade (Easier)**
```bash
npm install @arcadeai/arcadejs
```
Set `ARCADE_API_KEY` in `.env.local`

**Option B: Manual OAuth (More Control)**
Follow the OAuth flow in `social-media-agent-main/src/clients/auth-server.ts`

#### **Step 3: Set Environment Variables**
```bash
# Add to nextjs-version/.env.local
LINKEDIN_ACCESS_TOKEN=your-access-token
LINKEDIN_PERSON_URN=your-person-urn
```

#### **Step 4: Create LinkedIn Service**
Create file: `nextjs-version/src/lib/platforms/linkedin.ts`
(Copy the LinkedInService class from Example 4 above)

#### **Step 5: Create LinkedIn API Route**
Create file: `nextjs-version/src/app/api/posts/linkedin/route.ts`
```typescript
import { LinkedInService } from '@/lib/platforms/linkedin';

export async function POST(req: Request) {
  const { content } = await req.json();
  
  const linkedin = new LinkedInService();
  const result = await linkedin.createPost(content);
  
  return Response.json(result);
}
```

**✅ Checkpoint:** You can now post to LinkedIn!

---

### **Phase 5: Add Web Scraping (Week 2)**

#### **Step 1: Get FireCrawl API Key**
1. Go to https://www.firecrawl.dev/
2. Sign up (500 free credits)
3. Get API key

#### **Step 2: Set Environment Variable**
```bash
# Add to nextjs-version/.env.local
FIRECRAWL_API_KEY=your-api-key
```

#### **Step 3: Install FireCrawl**
```bash
npm install @mendable/firecrawl-js
```

#### **Step 4: Create Scraping Utility**
Create file: `nextjs-version/src/lib/scraping/firecrawl.ts`
(Copy the scrapeUrl function from Example 5 above)

#### **Step 5: Create Scraping API Route**
Create file: `nextjs-version/src/app/api/scrape/route.ts`
```typescript
import { scrapeUrl } from '@/lib/scraping/firecrawl';

export async function POST(req: Request) {
  const { url } = await req.json();
  const result = await scrapeUrl(url);
  return Response.json(result);
}
```

#### **Step 6: Add URL Input to UI**
```typescript
const handleScrapeAndGenerate = async () => {
  // 1. Scrape URL
  const scrapeResponse = await fetch('/api/scrape', {
    method: 'POST',
    body: JSON.stringify({ url: inputUrl })
  });
  const scrapeData = await scrapeResponse.json();
  
  // 2. Generate post from scraped content
  const genResponse = await fetch('/api/ai/generate', {
    method: 'POST',
    body: JSON.stringify({
      prompt: `Create a post about: ${scrapeData.content}`,
      platform: selectedPlatform
    })
  });
  const genData = await genResponse.json();
  
  setGeneratedContent(genData.content);
};
```

**✅ Checkpoint:** You can now scrape URLs and generate posts!

---

### **Phase 6: Complete Workflow (Week 2)**

#### **Step 1: Create Workflow Function**
Create file: `nextjs-version/src/lib/workflows/generate-and-post.ts`
(Copy the complete workflow from Example 6 above)

#### **Step 2: Create Workflow API Route**
Create file: `nextjs-version/src/app/api/workflows/generate-and-post/route.ts`
```typescript
import { generateAndPost } from '@/lib/workflows/generate-and-post';

export async function POST(req: Request) {
  const { url, platforms } = await req.json();
  const result = await generateAndPost(url, platforms);
  return Response.json(result);
}
```

#### **Step 3: Add One-Click Button**
```typescript
const handleOneClick = async () => {
  setLoading(true);
  
  const response = await fetch('/api/workflows/generate-and-post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: inputUrl,
      platforms: ['twitter', 'linkedin']
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    toast.success('Posted to all platforms!');
  }
  
  setLoading(false);
};
```

**✅ Checkpoint:** Complete automation! URL → AI → Post to all platforms!

---

## 🎯 Final Recommendations

### **Start Here (This Week):**
1. ✅ Phase 1: Get AI generation working (1 day)
2. ✅ Phase 2: Add streaming (1 day)
3. ✅ Test with your existing UI

### **Then Add (Next Week):**
1. ✅ Phase 3: Twitter integration (2-3 days)
2. ✅ Phase 4: LinkedIn integration (2-3 days)
3. ✅ Phase 5: Web scraping (1 day)

### **Finally (Week 3):**
1. ✅ Phase 6: Complete workflow
2. ✅ Add scheduling
3. ✅ Add analytics
4. ✅ Polish UI

---

## 💰 Cost Estimates

### **API Costs (Monthly for 1000 posts):**
- OpenAI GPT-4: ~$30-50
- FireCrawl: ~$10 (after free credits)
- Twitter API: Free
- LinkedIn API: Free
- **Total: ~$40-60/month**

### **Development Time:**
- Phase 1-2: 2 days
- Phase 3-4: 1 week
- Phase 5-6: 1 week
- **Total: 2-3 weeks**

---

## 📚 Resources

- **Vercel AI SDK Docs**: https://sdk.vercel.ai/docs
- **Twitter API Docs**: https://developer.twitter.com/en/docs
- **LinkedIn API Docs**: https://learn.microsoft.com/en-us/linkedin/
- **FireCrawl Docs**: https://docs.firecrawl.dev
- **Example Code**: See all examples above

---

## ❓ Common Questions

**Q: Do I need to use LangGraph?**
A: No! Use Vercel AI SDK + copy the platform clients. Much simpler.

**Q: Can I use Claude instead of GPT-4?**
A: Yes! Just change `openai('gpt-4')` to `anthropic('claude-3-5-sonnet-20241022')`

**Q: How do I handle multiple user accounts?**
A: Store OAuth tokens in your database per user, pass them to the services.

**Q: What about image generation?**
A: Add `generateImage()` from Vercel AI SDK or use DALL-E API.

**Q: Can I schedule posts?**
A: Yes! Use a job queue (BullMQ, Inngest) or cron jobs.

---

**This guide gives you everything you need to integrate AI agents into FlowPost. Start with Phase 1 today!** 🚀
