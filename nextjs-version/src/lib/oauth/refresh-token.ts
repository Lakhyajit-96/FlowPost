import { createClient } from '@supabase/supabase-js'
import { OAUTH_CONFIG } from './config'
import { encryptToken, decryptToken } from './encryption'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Refreshes an expired access token using the refresh token
 * @param connectionId - The ID of the social connection
 * @returns Updated connection with new tokens
 */
export async function refreshAccessToken(connectionId: string) {
  try {
    // Fetch the connection
    const { data: connection, error: fetchError } = await supabase
      .from('social_connections')
      .select('*')
      .eq('id', connectionId)
      .single()

    if (fetchError || !connection) {
      throw new Error('Connection not found')
    }

    if (!connection.refresh_token) {
      throw new Error('No refresh token available')
    }

    const platform = connection.platform as keyof typeof OAUTH_CONFIG
    const config = OAUTH_CONFIG[platform]

    if (!config) {
      throw new Error('Invalid platform')
    }

    // Decrypt the refresh token
    const refreshToken = decryptToken(connection.refresh_token)

    // Exchange refresh token for new access token
    const tokenParams: Record<string, string> = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
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
      console.error('Token refresh error:', errorData)
      
      // Mark connection as inactive if refresh fails
      await supabase
        .from('social_connections')
        .update({
          is_active: false,
          last_error: 'Token refresh failed',
          error_count: connection.error_count + 1,
        })
        .eq('id', connectionId)

      throw new Error('Token refresh failed')
    }

    const tokens = await tokenResponse.json()

    // Encrypt new tokens
    const encryptedAccessToken = encryptToken(tokens.access_token)
    const encryptedRefreshToken = tokens.refresh_token 
      ? encryptToken(tokens.refresh_token)
      : connection.refresh_token // Keep old refresh token if new one not provided

    // Calculate new expiration
    const tokenExpiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000)
      : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // Default 60 days

    // Update database with new tokens
    const { data: updatedConnection, error: updateError } = await supabase
      .from('social_connections')
      .update({
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        token_expires_at: tokenExpiresAt.toISOString(),
        is_active: true,
        last_error: null,
        error_count: 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', connectionId)
      .select()
      .single()

    if (updateError) {
      throw new Error('Failed to update connection with new tokens')
    }

    return updatedConnection

  } catch (error) {
    console.error('Token refresh error:', error)
    throw error
  }
}

/**
 * Checks if a token is expired or will expire soon
 * @param expiresAt - Token expiration timestamp
 * @param bufferMinutes - Minutes before expiration to consider token expired (default: 5)
 * @returns True if token is expired or will expire soon
 */
export function isTokenExpired(expiresAt: string, bufferMinutes: number = 5): boolean {
  const expirationTime = new Date(expiresAt).getTime()
  const currentTime = Date.now()
  const bufferTime = bufferMinutes * 60 * 1000

  return currentTime >= (expirationTime - bufferTime)
}

/**
 * Gets a valid access token, refreshing if necessary
 * @param connectionId - The ID of the social connection
 * @returns Decrypted access token
 */
export async function getValidAccessToken(connectionId: string): Promise<string> {
  try {
    // Fetch the connection
    const { data: connection, error } = await supabase
      .from('social_connections')
      .select('*')
      .eq('id', connectionId)
      .single()

    if (error || !connection) {
      throw new Error('Connection not found')
    }

    // Check if token is expired
    if (isTokenExpired(connection.token_expires_at)) {
      // Refresh the token
      const updatedConnection = await refreshAccessToken(connectionId)
      return decryptToken(updatedConnection.access_token)
    }

    // Token is still valid, return it
    return decryptToken(connection.access_token)

  } catch (error) {
    console.error('Error getting valid access token:', error)
    throw error
  }
}
