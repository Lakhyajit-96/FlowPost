# OAuth Setup Guide for FlowPost

## ✅ Completed Implementation

All OAuth infrastructure is now complete:
- ✅ Token encryption/decryption
- ✅ OAuth initiation endpoints
- ✅ OAuth callback handlers
- ✅ Token refresh logic
- ✅ All 6 platforms visible in UI
- ✅ Database schema ready
- ✅ Security measures implemented

## Step-by-Step Setup Instructions

### 1. Generate Encryption Key

Run this command to generate a secure encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and add it to your `.env.local`:

```env
TOKEN_ENCRYPTION_KEY=your_generated_64_character_hex_key_here
```

### 2. Create OAuth Apps for Each Platform

#### Facebook & Instagram

1. Go to https://developers.facebook.com/apps
2. Click "Create App"
3. Choose "Business" type
4. Fill in app details
5. Go to "Settings" → "Basic"
6. Copy App ID and App Secret
7. Add to `.env.local`:
   ```env
   FACEBOOK_APP_ID=your_app_id
   FACEBOOK_APP_SECRET=your_app_secret
   INSTAGRAM_APP_ID=your_app_id
   INSTAGRAM_APP_SECRET=your_app_secret
   ```
8. Go to "Facebook Login" → "Settings"
9. Add OAuth Redirect URI:
   ```
   http://localhost:3000/api/oauth/callback/facebook
   http://localhost:3000/api/oauth/callback/instagram
   ```
10. Enable required permissions:
    - pages_manage_posts
    - pages_read_engagement
    - instagram_basic
    - instagram_content_publish

#### Twitter (X)

1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create a new Project and App
3. Go to "Keys and tokens"
4. Generate OAuth 2.0 Client ID and Secret
5. Add to `.env.local`:
   ```env
   TWITTER_CLIENT_ID=your_client_id
   TWITTER_CLIENT_SECRET=your_client_secret
   ```
6. Go to "User authentication settings"
7. Enable OAuth 2.0
8. Add Callback URI:
   ```
   http://localhost:3000/api/oauth/callback/twitter
   ```
9. Add scopes:
   - tweet.read
   - tweet.write
   - users.read
   - offline.access

#### LinkedIn

1. Go to https://www.linkedin.com/developers/apps
2. Click "Create app"
3. Fill in app details
4. Go to "Auth" tab
5. Copy Client ID and Client Secret
6. Add to `.env.local`:
   ```env
   LINKEDIN_CLIENT_ID=your_client_id
   LINKEDIN_CLIENT_SECRET=your_client_secret
   ```
7. Add OAuth 2.0 Redirect URL:
   ```
   http://localhost:3000/api/oauth/callback/linkedin
   ```
8. Request access to:
   - w_member_social
   - r_liteprofile

#### YouTube (Google)

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 Client ID
5. Choose "Web application"
6. Add to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```
7. Add Authorized redirect URI:
   ```
   http://localhost:3000/api/oauth/callback/youtube
   ```
8. Add scopes:
   - https://www.googleapis.com/auth/youtube.upload
   - https://www.googleapis.com/auth/youtube.readonly

#### Pinterest

1. Go to https://developers.pinterest.com/apps
2. Create a new app
3. Go to app settings
4. Copy App ID and App Secret
5. Add to `.env.local`:
   ```env
   PINTEREST_APP_ID=your_app_id
   PINTEREST_APP_SECRET=your_app_secret
   ```
6. Add Redirect URI:
   ```
   http://localhost:3000/api/oauth/callback/pinterest
   ```
7. Request scopes:
   - boards:read
   - pins:read
   - pins:write

### 3. Update Production URLs

For production, update all redirect URIs to:
```
https://yourdomain.com/api/oauth/callback/[platform]
```

And update `NEXT_PUBLIC_APP_URL` in `.env`:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4. Test OAuth Flow

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/settings/connections`

3. Click "Connect" on any platform

4. You'll be redirected to the platform's OAuth page

5. Authorize the app

6. You'll be redirected back with the connection saved

### 5. Verify Database

Check Supabase to see the connection stored:

```sql
SELECT * FROM social_connections WHERE user_id = 'your_user_id';
```

You should see:
- Encrypted access_token
- Encrypted refresh_token (if provided)
- Platform user information
- Token expiration date

## Testing Without Real OAuth Apps

If you want to test without setting up OAuth apps, you can use the mock endpoint:

```typescript
// Temporarily use mock endpoint for testing
const response = await fetch('/api/social-connections', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ platform: 'twitter' }),
})
```

This will create a fake connection for testing the UI.

## Security Checklist

- [ ] Encryption key generated and added to `.env.local`
- [ ] All OAuth secrets stored in environment variables
- [ ] Never commit `.env.local` to git
- [ ] Use HTTPS in production
- [ ] Enable CORS restrictions on OAuth apps
- [ ] Set up rate limiting on API routes
- [ ] Monitor for failed OAuth attempts
- [ ] Implement token refresh before expiration
- [ ] Log all OAuth errors for debugging

## Troubleshooting

### "Invalid redirect URI" error
- Ensure the redirect URI in your OAuth app matches exactly
- Check for trailing slashes
- Verify HTTP vs HTTPS

### "Token encryption failed" error
- Verify TOKEN_ENCRYPTION_KEY is exactly 64 hex characters
- Regenerate the key if needed

### "Connection not saved" error
- Check Supabase connection
- Verify RLS policies are enabled
- Check user_id matches Clerk ID

### "Token refresh failed" error
- Verify refresh_token was provided by platform
- Check if platform supports refresh tokens
- Ensure OAuth app has offline_access scope

## Production Deployment

1. Update all environment variables in production
2. Update OAuth redirect URIs to production URLs
3. Enable HTTPS
4. Set up monitoring for OAuth errors
5. Implement automatic token refresh cron job
6. Set up alerts for connection failures
7. Test each platform thoroughly

## Next Steps

1. Implement posting functionality using connected accounts
2. Add analytics fetching from platforms
3. Build scheduling system
4. Create content calendar
5. Add bulk posting features

## Support

For issues:
1. Check browser console for errors
2. Check server logs for OAuth errors
3. Verify environment variables are set
4. Test OAuth flow manually
5. Check platform API status pages
