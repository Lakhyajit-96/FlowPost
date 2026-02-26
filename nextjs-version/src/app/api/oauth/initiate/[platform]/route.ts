import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { OAUTH_CONFIG, OAUTH_REDIRECT_URI } from '@/lib/oauth/config'
import { generateState, generatePKCE } from '@/lib/oauth/encryption'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { platform: platformParam } = await params
    const platform = platformParam as keyof typeof OAUTH_CONFIG

    if (!OAUTH_CONFIG[platform]) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      )
    }

    const config = OAUTH_CONFIG[platform]
    const state = generateState()
    
    // Store state and userId in cookies for verification in callback
    const cookieStore = await cookies()
    cookieStore.set(`oauth_state_${platform}`, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    })
    cookieStore.set(`oauth_user_${platform}`, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
    })

    // Build authorization URL
    const authUrl = new URL(config.authUrl)
    authUrl.searchParams.set('client_id', config.clientId)
    authUrl.searchParams.set('redirect_uri', `${OAUTH_REDIRECT_URI}/${platform}`)
    authUrl.searchParams.set('scope', config.scope)
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('response_type', 'code')

    // Twitter requires PKCE
    if (platform === 'twitter') {
      const { code_verifier, code_challenge } = generatePKCE()
      authUrl.searchParams.set('code_challenge', code_challenge)
      authUrl.searchParams.set('code_challenge_method', 'S256')
      
      // Store code_verifier for token exchange
      cookieStore.set(`oauth_verifier_${platform}`, code_verifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600,
      })
    }

    // Redirect to OAuth provider
    return NextResponse.redirect(authUrl.toString())

  } catch (error) {
    console.error('OAuth initiation error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    )
  }
}
