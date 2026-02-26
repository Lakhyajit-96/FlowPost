# FlowPost Social Media Connections System

## Overview
Complete social media OAuth integration system with database storage for FlowPost SaaS application. This allows users to connect their social media accounts (Facebook, Twitter, Instagram, LinkedIn, YouTube) and manage posts across all platforms.

## Database Setup

### 1. Run the SQL Script
Execute the following SQL file in your Supabase SQL Editor:
```sql
\i database/social_connections_table.sql
```

This creates:
- `social_connections` table with OAuth token storage
- Row Level Security (RLS) policies
- Indexes for performance
- Automatic timestamp updates
- Unique constraints per platform per user

### 2. Table Structure

**Main Fields:**
- Platform information (platform, username, display name, profile image)
- OAuth tokens (access_token, refresh_token, expiration)
- Connection status (is_active, last_synced_at)
- Account metadata (follower/following/post counts)
- Permissions (can_post, can_read, can_delete)
- Error tracking (last_error, error_count)

**Supported Platforms:**
- Facebook
- Twitter (X)
- Instagram
- LinkedIn
- YouTube
- Pinterest

## API Endpoints

### GET `/api/social-connections`
Fetches all social media connections for the current user.

**Response:**
```json
{
  "connections": [
    {
      "id": "uuid",
      "platform": "twitter",
      "platform_username": "@johndoe",
      "platform_display_name": "John Doe",
      "platform_profile_image": "https://...",
      "is_active": true,
      "follower_count": 1250,
      "following_count": 450,
      "post_count": 89,
      "connected_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST `/api/social-connections`
Creates a new social media connection (initiates OAuth flow).

**Request Body:**
```json
{
  "platform": "twitter"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Twitter account connected successfully",
  "connection": { /* connection data */ }
}
```

### DELETE `/api/social-connections/[id]`
Disconnects a social media account.

**Response:**
```json
{
  "success": true,
  "message": "Twitter account disconnected successfully"
}
```

### PATCH `/api/social-connections/[id]`
Updates connection status (activate/deactivate).

**Request Body:**
```json
{
  "is_active": false
}
```

## Frontend Implementation

### Location
`src/app/(dashboard)/settings/connections/page.tsx`

### Features

1. **Real-time Connection Status**
   - Fetches connections from database on mount
   - Shows loading spinner while fetching
   - Displays connected accounts with badges

2. **Connect/Disconnect Functionality**
   - Connect button for unconnected platforms
   - Disconnect button for connected platforms
   - Loading states during operations
   - Toast notifications for feedback

3. **Account Information Display**
   - Platform username
   - Follower count
   - Profile image
   - Connection status badge
   - Visual indicators (checkmarks)

4. **Supported Platforms**
   - Facebook (blue)
   - Twitter (light blue)
   - Instagram (pink/purple)
   - LinkedIn (blue)
   - YouTube (red)

### UI Components

**Connection Card:**
- Platform icon with brand color
- Platform name and status badge
- Username and follower count (if connected)
- Connect/Disconnect button
- Loading states with spinner

**Status Indicators:**
- Green checkmark for connected accounts
- "Connected" badge (secondary variant)
- "Not Connected" badge (outline variant)

## OAuth Flow (Production Implementation)

### Current Implementation
The current implementation uses **mock OAuth** for demonstration:
- Creates fake tokens and user data
- Simulates successful connection
- Stores in database

### Production OAuth Flow

For production, implement real OAuth 2.0 flow:

#### 1. Facebook OAuth
```typescript
// Redirect to Facebook OAuth
const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?
  client_id=${FACEBOOK_APP_ID}&
  redirect_uri=${REDIRECT_URI}&
  scope=pages_manage_posts,pages_read_engagement&
  state=${STATE}`
```

#### 2. Twitter OAuth 2.0
```typescript
// Use Twitter OAuth 2.0 with PKCE
const twitterAuthUrl = `https://twitter.com/i/oauth2/authorize?
  response_type=code&
  client_id=${TWITTER_CLIENT_ID}&
  redirect_uri=${REDIRECT_URI}&
  scope=tweet.read tweet.write users.read&
  state=${STATE}&
  code_challenge=${CODE_CHALLENGE}&
  code_challenge_method=S256`
```

#### 3. Instagram OAuth
```typescript
// Instagram uses Facebook OAuth
const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?
  client_id=${INSTAGRAM_APP_ID}&
  redirect_uri=${REDIRECT_URI}&
  scope=user_profile,user_media&
  response_type=code`
```

#### 4. LinkedIn OAuth
```typescript
const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?
  response_type=code&
  client_id=${LINKEDIN_CLIENT_ID}&
  redirect_uri=${REDIRECT_URI}&
  scope=w_member_social r_liteprofile`
```

#### 5. YouTube OAuth
```typescript
const youtubeAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?
  client_id=${GOOGLE_CLIENT_ID}&
  redirect_uri=${REDIRECT_URI}&
  scope=https://www.googleapis.com/auth/youtube.upload&
  response_type=code`
```

### OAuth Callback Handler

Create `/api/oauth/callback/[platform]/route.ts`:

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const platform = params.platform
  
  // Exchange code for access token
  const tokenResponse = await fetch(PLATFORM_TOKEN_URL, {
    method: 'POST',
    body: JSON.stringify({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    })
  })
  
  const tokens = await tokenResponse.json()
  
  // Fetch user profile
  const profileResponse = await fetch(PLATFORM_PROFILE_URL, {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`
    }
  })
  
  const profile = await profileResponse.json()
  
  // Store in database
  await supabase.from('social_connections').insert({
    user_id: userId,
    platform: platform,
    platform_user_id: profile.id,
    platform_username: profile.username,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expires_at: new Date(Date.now() + tokens.expires_in * 1000)
  })
  
  // Redirect back to connections page
  return NextResponse.redirect('/settings/connections')
}
```

## Security Considerations

### Token Storage
- **Current**: Tokens stored in plain text (development only)
- **Production**: Encrypt tokens using AES-256
- **Best Practice**: Use environment-specific encryption keys

### Token Encryption Example
```typescript
import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY!
const ALGORITHM = 'aes-256-gcm'

function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
  let encrypted = cipher.update(token, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

function decryptToken(encryptedToken: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedToken.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
  decipher.setAuthTag(authTag)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
```

### RLS Policies
- Users can only access their own connections
- Automatic user_id validation via Clerk
- Protected against unauthorized access

## Token Refresh

Implement automatic token refresh:

```typescript
async function refreshAccessToken(connectionId: string) {
  const { data: connection } = await supabase
    .from('social_connections')
    .select('*')
    .eq('id', connectionId)
    .single()
  
  if (!connection.refresh_token) {
    throw new Error('No refresh token available')
  }
  
  // Exchange refresh token for new access token
  const response = await fetch(PLATFORM_TOKEN_URL, {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: connection.refresh_token,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })
  })
  
  const tokens = await response.json()
  
  // Update database
  await supabase
    .from('social_connections')
    .update({
      access_token: tokens.access_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000)
    })
    .eq('id', connectionId)
}
```

## Usage Flow

1. **User visits connections page**
   - Page loads with spinner
   - Fetches connections from database
   - Displays connected and available platforms

2. **User clicks Connect**
   - Shows loading state
   - Initiates OAuth flow (mock in development)
   - Stores connection in database
   - Updates UI with success message

3. **User clicks Disconnect**
   - Shows confirmation (optional)
   - Deletes connection from database
   - Revokes OAuth tokens (production)
   - Updates UI with success message

## Testing

### 1. Database Setup
```sql
-- Run in Supabase SQL Editor
\i database/social_connections_table.sql
```

### 2. Test API Endpoints
```bash
# GET connections
curl http://localhost:3000/api/social-connections \
  -H "Cookie: your-session-cookie"

# POST new connection
curl -X POST http://localhost:3000/api/social-connections \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"platform": "twitter"}'

# DELETE connection
curl -X DELETE http://localhost:3000/api/social-connections/[id] \
  -H "Cookie: your-session-cookie"
```

### 3. Test UI
1. Navigate to `/settings/connections`
2. Click "Connect" on any platform
3. Verify connection appears with badge
4. Check follower count displays
5. Click "Disconnect" and verify removal
6. Refresh page and verify persistence

## Environment Variables

Add to `.env.local`:

```env
# Facebook OAuth
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret

# Twitter OAuth
TWITTER_CLIENT_ID=your_client_id
TWITTER_CLIENT_SECRET=your_client_secret

# Instagram OAuth (uses Facebook)
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret

# Google/YouTube OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Token encryption
TOKEN_ENCRYPTION_KEY=your_32_byte_encryption_key

# OAuth redirect URI
OAUTH_REDIRECT_URI=http://localhost:3000/api/oauth/callback
```

## Future Enhancements

1. **Real OAuth Integration**: Implement actual OAuth flows for all platforms
2. **Token Refresh**: Automatic token refresh before expiration
3. **Webhook Support**: Receive real-time updates from platforms
4. **Analytics Sync**: Fetch and display platform analytics
5. **Bulk Operations**: Connect/disconnect multiple accounts
6. **Account Switching**: Switch between multiple accounts per platform
7. **Permission Management**: Granular control over what FlowPost can do
8. **Connection Health**: Monitor and alert on connection issues

## Troubleshooting

### Connections not loading
- Check Supabase connection
- Verify RLS policies are enabled
- Check browser console for errors
- Verify user is authenticated

### Connection fails
- Check OAuth credentials
- Verify redirect URI matches
- Check platform API status
- Review error logs

### Token expired
- Implement token refresh
- Check token expiration dates
- Verify refresh token is valid

## Production Checklist

- [ ] Database table created in production
- [ ] RLS policies enabled and tested
- [ ] OAuth apps created for all platforms
- [ ] Environment variables configured
- [ ] Token encryption implemented
- [ ] Token refresh implemented
- [ ] Error handling complete
- [ ] Loading states working
- [ ] Toast notifications configured
- [ ] Mobile responsive design tested
- [ ] OAuth callback handlers implemented
- [ ] Webhook endpoints configured (optional)

## Support

For issues or questions:
1. Check Supabase logs for database errors
2. Check browser console for frontend errors
3. Verify OAuth app credentials
4. Test API endpoints directly
5. Review platform API documentation
