import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'edge';
export const maxDuration = 30;

interface StreamRequest {
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
      return new Response('Unauthorized', { status: 401 });
    }

    // Parse request body
    const body: StreamRequest = await req.json();
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
      return new Response('Missing required fields', { status: 400 });
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt(contentType, platform, tone, brandVoice);
    
    // Build user prompt
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

    // Stream content using OpenAI
    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error('AI Streaming Error:', error);
    return new Response('Failed to stream content', { status: 500 });
  }
}

function buildSystemPrompt(
  contentType: string,
  platform: string,
  tone: string,
  brandVoice: string
): string {
  const platformGuidelines: Record<string, string> = {
    instagram: 'Instagram posts should be visually engaging, use emojis strategically, and include relevant hashtags.',
    facebook: 'Facebook posts should be conversational and community-focused.',
    twitter: 'Twitter/X posts must be under 280 characters. Be concise and impactful.',
    linkedin: 'LinkedIn posts should be professional, value-driven, and thought-provoking.',
    youtube: 'YouTube content should be engaging and optimized for video format.',
    pinterest: 'Pinterest content should be visually descriptive and keyword-rich.'
  };

  const toneGuidelines: Record<string, string> = {
    professional: 'Use formal language and maintain a business-appropriate tone.',
    casual: 'Use conversational language and a friendly, approachable tone.',
    friendly: 'Be warm, welcoming, and personable.',
    humorous: 'Incorporate wit and light humor.',
    inspirational: 'Use motivational language and uplifting messages.'
  };

  return `You are an expert social media content creator for ${platform}.

${platformGuidelines[platform] || 'Create engaging content.'}

Tone: ${toneGuidelines[tone] || 'Appropriate tone'}

Create ${contentType} content that drives engagement and delivers value.`;
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
    short: 'Keep it brief (50-100 words)',
    medium: 'Moderate detail (100-200 words)',
    long: 'Comprehensive content (200-400 words)'
  };

  let userPrompt = `Create ${contentType} about: ${prompt}\n\n`;
  userPrompt += `Length: ${lengthGuidelines[length]}\n`;
  
  if (keywords) {
    userPrompt += `Keywords: ${keywords}\n`;
  }
  
  if (includeEmojis) {
    userPrompt += `Include relevant emojis.\n`;
  }
  
  if (includeHashtags) {
    userPrompt += `Include hashtags.\n`;
  }

  return userPrompt;
}
