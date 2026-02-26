import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Hash API key for storage
function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

// Generate random API key
function generateApiKey(prefix: string): string {
  const randomBytes = crypto.randomBytes(24)
  const randomPart = randomBytes.toString('base64')
    .replace(/\+/g, '')
    .replace(/\//g, '')
    .replace(/=/g, '')
  return `${prefix}${randomPart}`
}

// GET - Fetch all API keys for the user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, key_name, key_prefix, key_last_four, environment, is_active, last_used_at, usage_count, created_at')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching API keys:', error)
      return NextResponse.json(
        { error: 'Failed to fetch API keys' },
        { status: 500 }
      )
    }

    return NextResponse.json({ apiKeys: data || [] })

  } catch (error) {
    console.error('API keys GET error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// POST - Create new API key
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { key_name, environment } = body

    if (!key_name || !environment) {
      return NextResponse.json(
        { error: 'Key name and environment are required' },
        { status: 400 }
      )
    }

    if (!['production', 'development'].includes(environment)) {
      return NextResponse.json(
        { error: 'Environment must be production or development' },
        { status: 400 }
      )
    }

    // Generate API key
    const prefix = environment === 'production' ? 'sk_live_' : 'sk_test_'
    const fullKey = generateApiKey(prefix)
    const keyHash = hashApiKey(fullKey)
    const keyLastFour = fullKey.slice(-4)

    // Store in database
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        key_name,
        key_prefix: prefix,
        key_hash: keyHash,
        key_last_four: keyLastFour,
        environment,
        is_active: true,
      })
      .select('id, key_name, key_prefix, key_last_four, environment, is_active, created_at')
      .single()

    if (error) {
      console.error('Error creating API key:', error)
      return NextResponse.json(
        { error: 'Failed to create API key' },
        { status: 500 }
      )
    }

    // Return the full key ONLY once (never stored in plain text)
    return NextResponse.json({
      success: true,
      message: 'API key created successfully',
      apiKey: data,
      fullKey: fullKey, // Only returned once!
      warning: 'Save this key now. You won\'t be able to see it again.'
    }, { status: 201 })

  } catch (error) {
    console.error('API keys POST error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
