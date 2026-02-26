import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Fetch all social connections for the user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch all connections for the user
    const { data: connections, error } = await supabase
      .from('social_connections')
      .select('*')
      .eq('user_id', userId)
      .order('connected_at', { ascending: false })

    if (error) {
      console.error('Error fetching social connections:', error)
      return NextResponse.json(
        { error: 'Failed to fetch social connections' },
        { status: 500 }
      )
    }

    // Don't send sensitive tokens to frontend
    const sanitizedConnections = connections?.map(conn => ({
      id: conn.id,
      platform: conn.platform,
      platform_user_id: conn.platform_user_id,
      platform_username: conn.platform_username,
      platform_display_name: conn.platform_display_name,
      platform_profile_image: conn.platform_profile_image,
      is_active: conn.is_active,
      last_synced_at: conn.last_synced_at,
      follower_count: conn.follower_count,
      following_count: conn.following_count,
      post_count: conn.post_count,
      can_post: conn.can_post,
      can_read: conn.can_read,
      can_delete: conn.can_delete,
      connected_at: conn.connected_at,
      last_error: conn.last_error,
    }))

    return NextResponse.json({ connections: sanitizedConnections || [] })

  } catch (error) {
    console.error('Social connections GET error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// POST - Create a new social connection (mock OAuth for now)
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
    const { platform } = body

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform is required' },
        { status: 400 }
      )
    }

    // In production, this would handle OAuth flow
    // For now, create a mock connection
    const mockConnection = {
      user_id: userId,
      platform: platform,
      platform_user_id: `${platform}_${Date.now()}`,
      platform_username: `@user_${platform}`,
      platform_display_name: `User on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
      platform_profile_image: `https://ui-avatars.com/api/?name=${platform}&background=7c3aed&color=fff`,
      access_token: `mock_token_${Date.now()}`, // In production, this would be real OAuth token
      refresh_token: `mock_refresh_${Date.now()}`,
      token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
      is_active: true,
      follower_count: Math.floor(Math.random() * 10000),
      following_count: Math.floor(Math.random() * 1000),
      post_count: Math.floor(Math.random() * 500),
      can_post: true,
      can_read: true,
      can_delete: false,
    }

    const { data, error } = await supabase
      .from('social_connections')
      .insert(mockConnection)
      .select()
      .single()

    if (error) {
      console.error('Error creating social connection:', error)
      return NextResponse.json(
        { error: 'Failed to connect account' },
        { status: 500 }
      )
    }

    // Sanitize response
    const sanitizedConnection = {
      id: data.id,
      platform: data.platform,
      platform_user_id: data.platform_user_id,
      platform_username: data.platform_username,
      platform_display_name: data.platform_display_name,
      platform_profile_image: data.platform_profile_image,
      is_active: data.is_active,
      follower_count: data.follower_count,
      following_count: data.following_count,
      post_count: data.post_count,
      can_post: data.can_post,
      can_read: data.can_read,
      can_delete: data.can_delete,
      connected_at: data.connected_at,
    }

    return NextResponse.json(
      {
        success: true,
        message: `${platform.charAt(0).toUpperCase() + platform.slice(1)} account connected successfully`,
        connection: sanitizedConnection
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Social connections POST error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
