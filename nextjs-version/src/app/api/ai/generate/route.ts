import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/client';

export const runtime = 'edge';
export const maxDuration = 30;

interface GenerateRequest {
  prompt: string;
  contentType: string;
  platform: string;
  tone: string;
  length: string;
  keywords?: string;
  includeEmojis?: boolean;
  includeHashtags?: boolean;
  brandVoice?: string;
}

export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: GenerateRequest = await req.json();
    const {
      prompt,
      contentType,
      platform,
      tone,
      length,
      keywords = '',
      includeEmojis = true,
      includeHashtags = true,
      brandVoice = 'default'
    } = body;

    // Validate required fields
    if (!prompt || !contentType || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Build system prompt based on content type and platform
    const systemPrompt = buildSystemPrompt(contentType, platform, tone, brandVoice);
    
    // Build user prompt with all context
    const userPrompt = buildUserPrompt({
      prompt,
      contentType,
      platform,
      tone,
      length,
      keywords,
      includeEmojis,
      includeHashtags
    });

    // Generate content using OpenAI
    const { text, usage } = await generateText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Track usage in database
    try {
      const supabase = createClient();
      await supabase.from('ai_generated_content').insert({
        user_id: userId,
        content: text,
        content_type: contentType,
        platform,
        tone,
        length,
        prompt,
        keywords,
        include_emojis: includeEmojis,
        include_hashtags: includeHashtags,
        tokens_used: usage?.totalTokens || 0,
        cost: calculateCost(usage?.totalTokens || 0)
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Don't fail the request if DB insert fails
    }

    return NextResponse.json({
      success: true,
      content: text,
      usage: {
        tokens: usage?.totalTokens || 0,
        cost: calculateCost(usage?.totalTokens || 0)
      }
    });

  } catch (error: any) {
    console.error('AI Generation Error:', error);
    
    // Handle specific OpenAI errors
    if (error.message?.includes('rate_limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      );
    }
    
    if (error.message?.includes('insufficient_quota')) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please contact support.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate content. Please try again.' },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(
  contentType: string,
  platform: string,
  tone: string,
  brandVoice: string
): string {
  const platformGuidelines: Record<string, string> = {
    instagram: 'Instagram posts should be visually engaging, use emojis strategically, and include relevant hashtags. Keep captions concise but impactful.',
    facebook: 'Facebook posts should be conversational and community-focused. Encourage engagement through questions and calls-to-action.',
    twitter: 'Twitter/X posts must be under 280 characters. Be concise, witty, and use hashtags sparingly (1-2 max).',
    linkedin: 'LinkedIn posts should be professional, value-driven, and thought-provoking. Focus on industry insights and professional growth.',
    youtube: 'YouTube content should be engaging, informative, and optimized for video format. Include timestamps and clear structure.',
    pinterest: 'Pinterest content should be visually descriptive and include keywords for searchability.'
  };

  const toneGuidelines: Record<string, string> = {
    professional: 'Use formal language, industry terminology, and maintain a business-appropriate tone.',
    casual: 'Use conversational language, contractions, and a friendly, approachable tone.',
    friendly: 'Be warm, welcoming, and personable. Use inclusive language and positive framing.',
    humorous: 'Incorporate wit, wordplay, and light humor. Keep it tasteful and brand-appropriate.',
    inspirational: 'Use motivational language, powerful words, and uplifting messages.'
  };

  const contentTypeGuidelines: Record<string, string> = {
    caption: 'Create an engaging caption that captures attention and drives engagement.',
    hashtags: 'Generate relevant, trending hashtags that increase discoverability.',
    post_idea: 'Provide a detailed content idea with structure, key points, and execution tips.',
    thread: 'Create a multi-part thread with numbered posts that tell a cohesive story.',
    story: 'Design a story sequence with slide-by-slide content for ephemeral content.',
    video_script: 'Write a complete video script with timestamps, hooks, and calls-to-action.'
  };

  const brandVoiceGuidelines: Record<string, string> = {
    default: '',
    professional: 'Maintain a polished, expert voice that establishes authority.',
    conversational: 'Write as if speaking directly to a friend, using natural language.',
    bold: 'Be confident, assertive, and make strong statements.',
    empathetic: 'Show understanding, compassion, and emotional intelligence.',
    thought_leader: 'Position as an industry expert sharing valuable insights.'
  };

  return `You are an expert social media content creator specializing in ${platform} content.

PLATFORM GUIDELINES:
${platformGuidelines[platform] || 'Create engaging, platform-appropriate content.'}

TONE:
${toneGuidelines[tone] || 'Maintain an appropriate tone for the content.'}

CONTENT TYPE:
${contentTypeGuidelines[contentType] || 'Create high-quality content.'}

${brandVoiceGuidelines[brandVoice] ? `BRAND VOICE:\n${brandVoiceGuidelines[brandVoice]}` : ''}

IMPORTANT:
- Create original, engaging content that drives results
- Follow platform best practices and character limits
- Use clear, compelling language
- Include actionable calls-to-action when appropriate
- Ensure content is grammatically correct and well-structured`;
}

function buildUserPrompt(params: {
  prompt: string;
  contentType: string;
  platform: string;
  tone: string;
  length: string;
  keywords: string;
  includeEmojis: boolean;
  includeHashtags: boolean;
}): string {
  const {
    prompt,
    contentType,
    length,
    keywords,
    includeEmojis,
    includeHashtags
  } = params;

  const lengthGuidelines: Record<string, string> = {
    short: 'Keep it brief and punchy (1-2 sentences or 50-100 words)',
    medium: 'Provide moderate detail (3-5 sentences or 100-200 words)',
    long: 'Create comprehensive content (6+ sentences or 200-400 words)'
  };

  let userPrompt = `Create ${contentType} content about: ${prompt}\n\n`;
  
  userPrompt += `LENGTH: ${lengthGuidelines[length]}\n\n`;
  
  if (keywords) {
    userPrompt += `KEYWORDS TO INCLUDE: ${keywords}\n\n`;
  }
  
  if (includeEmojis) {
    userPrompt += `Include relevant emojis to enhance engagement.\n`;
  }
  
  if (includeHashtags && contentType !== 'hashtags') {
    userPrompt += `Include 3-5 relevant hashtags at the end.\n`;
  }
  
  if (contentType === 'hashtags') {
    userPrompt += `Generate 15-20 relevant hashtags, mixing popular and niche tags.\n`;
  }

  return userPrompt;
}

function calculateCost(tokens: number): number {
  // GPT-4 Turbo pricing: $0.01 per 1K input tokens, $0.03 per 1K output tokens
  // Simplified: average $0.02 per 1K tokens
  return (tokens / 1000) * 0.02;
}
