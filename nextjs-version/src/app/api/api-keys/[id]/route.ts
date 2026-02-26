import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function generateApiKey(prefix: string): string {
  const randomBytes = crypto.randomBytes(24)
  const randomPart = randomBytes.toString('base64')
    .replace(/\+/g, '')
    .replace(/\//g, '')
    .replace(/=/g, '')
  return `${prefix}${randomPart}`
}

function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

// DELETE - Revoke/delete API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify ownership and delete
    const { error: deleteError } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Error deleting API key:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete API key' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully'
    })

  } catch (error) {
    console.error('API key DELETE error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// PATCH - Regenerate API key
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Get existing key info
    const { data: existingKey, error: fetchError } = await supabase
      .from('api_keys')
      .select('key_prefix, environment, key_name')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (fetchError || !existingKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      )
    }

    // Generate new key
    const fullKey = generateApiKey(existingKey.key_prefix)
    const keyHash = hashApiKey(fullKey)
    const keyLastFour = fullKey.slice(-4)

    // Update in database
    const { data, error } = await supabase
      .from('api_keys')
      .update({
        key_hash: keyHash,
        key_last_four: keyLastFour,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select('id, key_name, key_prefix, key_last_four, environment, is_active, created_at')
      .single()

    if (error) {
      console.error('Error regenerating API key:', error)
      return NextResponse.json(
        { error: 'Failed to regenerate API key' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'API key regenerated successfully',
      apiKey: data,
      fullKey: fullKey,
      warning: 'Save this key now. You won\'t be able to see it again.'
    })

  } catch (error) {
    console.error('API key PATCH error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
