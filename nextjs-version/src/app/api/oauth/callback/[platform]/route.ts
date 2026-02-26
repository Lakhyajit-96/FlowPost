import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { OAUTH_CONFIG, OAUTH_REDIRECT_URI } from '@/lib/oauth/config'
import { encryptToken } from '@/lib/oauth/encryption'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    const { platform: platformParam } = await params
    const platform = platformParam as keyof typeof OAUTH_CONFIG

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?error=${error}`
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?error=missing_params`
      )
    }

    // Verify state to prevent CSRF
    const cookieStore = await cookies()
    const storedState = cookieStore.get(`oauth_state_${platform}`)?.value
    const userId = cookieStore.get(`oauth_user_${platform}`)?.value

    if (!storedState || storedState !== state || !userId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?error=invalid_state`
      )
    }

    const config = OAUTH_CONFIG[platform]

    // Exchange authorization code for access token
    const tokenParams: Record<string, string> = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: `${OAUTH_REDIRECT_URI}/${platform}`,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }

    // Twitter requires PKCE code_verifier
    if (platform === 'twitter') {
      const codeVerifier = cookieStore.get(`oauth_verifier_${platform}`)?.value
      if (codeVerifier) {
        tokenParams.code_verifier = codeVerifier
      }
    }

    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams(tokenParams),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange error:', errorData)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?error=token_exchange_failed`
      )
    }

    const tokens = await tokenResponse.json()

    // Fetch user profile from the platform
    let profileResponse
    const authHeader = `Bearer ${tokens.access_token}`

    if (platform === 'youtube') {
      // YouTube requires different endpoint
      profileResponse = await fetch(
        `${config.profileUrl}?part=snippet&mine=true`,
        {
          headers: { Authorization: authHeader },
        }
      )
    } else if (platform === 'facebook' || platform === 'instagram') {
      profileResponse = await fetch(
        `${config.profileUrl}?fields=id,name,picture`,
        {
          headers: { Authorization: authHeader },
        }
      )
    } else {
      profileResponse = await fetch(config.profileUrl, {
        headers: { Authorization: authHeader },
      })
    }

    if (!profileResponse.ok) {
      console.error('Profile fetch error:', await profileResponse.text())
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?error=profile_fetch_failed`
      )
    }

    const profile = await profileResponse.json()

    // Extract profile data based on platform
    let platformUserId: string
    let platformUsername: string
    let platformDisplayName: string
    let platformProfileImage: string

    switch (platform) {
      case 'twitter':
        platformUserId = profile.data.id
        platformUsername = profile.data.username
        platformDisplayName = profile.data.name
        platformProfileImage = profile.data.profile_image_url || ''
        break
      case 'facebook':
      case 'instagram':
        platformUserId = profile.id
        platformUsername = profile.username || profile.name
        platformDisplayName = profile.name
        platformProfileImage = profile.picture?.data?.url || ''
        break
      case 'linkedin':
        platformUserId = profile.id
        platformUsername = profile.localizedFirstName + profile.localizedLastName
        platformDisplayName = `${profile.localizedFirstName} ${profile.localizedLastName}`
        platformProfileImage = ''
        break
      case 'youtube':
        const channel = profile.items?.[0]
        platformUserId = channel?.id || ''
        platformUsername = channel?.snippet?.customUrl || channel?.snippet?.title || ''
        platformDisplayName = channel?.snippet?.title || ''
        platformProfileImage = channel?.snippet?.thumbnails?.default?.url || ''
        break
      default:
        platformUserId = profile.id || profile.user_id || ''
        platformUsername = profile.username || profile.name || ''
        platformDisplayName = profile.display_name || profile.name || ''
        platformProfileImage = profile.profile_image_url || profile.avatar_url || ''
    }

    // Encrypt tokens before storing
    const encryptedAccessToken = encryptToken(tokens.access_token)
    const encryptedRefreshToken = tokens.refresh_token 
      ? encryptToken(tokens.refresh_token) 
      : null

    // Calculate token expiration
    const tokenExpiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000)
      : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // Default 60 days

    // Store connection in database
    const { data, error: dbError } = await supabase
      .from('social_connections')
      .upsert({
        user_id: userId,
        platform: platform,
        platform_user_id: platformUserId,
        platform_username: platformUsername,
        platform_display_name: platformDisplayName,
        platform_profile_image: platformProfileImage,
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        token_expires_at: tokenExpiresAt.toISOString(),
        is_active: true,
        last_synced_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,platform,platform_user_id'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?error=database_error`
      )
    }

    // Clear OAuth cookies
    cookieStore.delete(`oauth_state_${platform}`)
    cookieStore.delete(`oauth_user_${platform}`)
    if (platform === 'twitter') {
      cookieStore.delete(`oauth_verifier_${platform}`)
    }

    // Redirect back to connections page with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?success=${platform}`
    )

  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?error=unexpected_error`
    )
  }
}
