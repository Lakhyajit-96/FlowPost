# FlowPost Notification System

## Overview
Complete notification preferences system with database integration for FlowPost SaaS application.

## Database Setup

### 1. Run the SQL Script
Execute the following SQL file in your Supabase SQL Editor:
```
database/notification_preferences_table.sql
```

This creates:
- `notification_preferences` table with all preference fields
- Row Level Security (RLS) policies for user data protection
- Indexes for performance
- Automatic timestamp updates
- Proper foreign key relationships

### 2. Table Structure

**Main Fields:**
- Email Notifications (security, updates, marketing)
- Push Notifications (messages, mentions, tasks)
- Notification Frequency (instant, hourly, daily, weekly, never)
- Quiet Hours (start/end times)
- Notification Channels (email, push, SMS)
- Notification Preferences by Type (order updates, invoices, promotions, maintenance)
- Notification Timing (online, always, never)

## API Endpoints

### GET `/api/notifications/preferences`
Fetches the current user's notification preferences.

**Response:**
```json
{
  "preferences": {
    "email_security": true,
    "email_updates": true,
    "push_messages": true,
    // ... all other fields
  }
}
```

### POST `/api/notifications/preferences`
Creates or updates notification preferences for the current user.

**Request Body:**
```json
{
  "emailSecurity": true,
  "emailUpdates": true,
  "pushMessages": true,
  // ... all other fields in camelCase
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification preferences saved successfully",
  "preferences": { /* saved data */ }
}
```

## Frontend Implementation

### Location
`src/app/(dashboard)/settings/notifications/page.tsx`

### Features
1. **Real-time Loading**: Fetches preferences from database on mount
2. **Auto-save**: Saves to database on form submission
3. **Cancel/Discard**: Reverts to last saved state
4. **Loading States**: Shows spinner while fetching data
5. **Toast Notifications**: User feedback for all actions
6. **Modern UI**: Switch toggles instead of checkboxes

### Form Fields Mapping
The form uses camelCase field names that map to snake_case database columns:

| Form Field | Database Column |
|------------|----------------|
| emailSecurity | email_security |
| emailUpdates | email_updates |
| pushMessages | push_messages |
| ... | ... |

## Security

### Row Level Security (RLS)
- Users can only view/edit their own preferences
- Automatic user_id validation via Clerk authentication
- Protected against unauthorized access

### Authentication
- Uses Clerk's `auth()` function for user identification
- Requires valid session to access API endpoints
- Returns 401 for unauthorized requests

## Usage Flow

1. **User visits notifications page**
   - Page loads with spinner
   - Fetches preferences from `/api/notifications/preferences`
   - Populates form with saved data or defaults

2. **User modifies preferences**
   - Changes are tracked in form state
   - No auto-save (user must click Save)

3. **User clicks Save**
   - Form validates data
   - Sends POST request to API
   - API creates/updates database record
   - Shows success toast

4. **User clicks Cancel**
   - Fetches latest data from database
   - Resets form to saved state
   - Shows info toast

## Default Values

When no preferences exist in database:
- Email updates: ON
- Push messages: ON
- Push mentions: ON
- Email frequency: Instant
- Quiet hours: 10 PM - 6 AM
- All channels: Email and Push ON, SMS OFF
- Order updates: All ON
- Invoice reminders: Email and App ON
- Promotional offers: Browser ON only
- System maintenance: Email and Browser ON
- Notification timing: Only when online

## Testing

### 1. Database Setup
```sql
-- Run in Supabase SQL Editor
\i database/notification_preferences_table.sql
```

### 2. Test API Endpoints
```bash
# GET preferences
curl http://localhost:3000/api/notifications/preferences \
  -H "Cookie: your-session-cookie"

# POST preferences
curl -X POST http://localhost:3000/api/notifications/preferences \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"emailSecurity": true, "emailUpdates": true, ...}'
```

### 3. Test UI
1. Navigate to `/settings/notifications`
2. Verify preferences load correctly
3. Toggle some switches
4. Click Save and verify success toast
5. Refresh page and verify changes persist
6. Click Cancel and verify form resets

## Future Enhancements

1. **Real-time Notifications**: Implement actual notification delivery
2. **Email Templates**: Create branded email templates
3. **Push Notifications**: Integrate browser push API
4. **SMS Integration**: Add Twilio or similar service
5. **Notification History**: Track sent notifications
6. **Batch Operations**: Bulk enable/disable categories
7. **Smart Defaults**: AI-suggested preferences based on usage

## Troubleshooting

### Preferences not saving
- Check Supabase connection
- Verify RLS policies are enabled
- Check browser console for errors
- Verify user is authenticated

### Preferences not loading
- Check API endpoint is accessible
- Verify database table exists
- Check user_id matches Clerk ID
- Look for CORS issues

### Database errors
- Ensure foreign key to users table exists
- Verify RLS policies allow user access
- Check column names match exactly

## Production Checklist

- [ ] Database table created in production Supabase
- [ ] RLS policies enabled and tested
- [ ] API endpoints secured with authentication
- [ ] Error handling implemented
- [ ] Loading states working
- [ ] Toast notifications configured
- [ ] Form validation working
- [ ] Cancel button resets correctly
- [ ] Data persists across sessions
- [ ] Mobile responsive design tested

## Support

For issues or questions:
1. Check Supabase logs for database errors
2. Check browser console for frontend errors
3. Verify environment variables are set
4. Test API endpoints directly
5. Review RLS policies in Supabase dashboard
