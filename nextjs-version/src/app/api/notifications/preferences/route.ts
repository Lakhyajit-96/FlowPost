import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Fetch user's notification preferences
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch notification preferences
    const { data: preferences, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching notification preferences:', error)
      return NextResponse.json(
        { error: 'Failed to fetch notification preferences' },
        { status: 500 }
      )
    }

    // If no preferences exist, return default values
    if (!preferences) {
      return NextResponse.json({
        preferences: null,
        message: 'No preferences found, using defaults'
      })
    }

    return NextResponse.json({ preferences })

  } catch (error) {
    console.error('Notification preferences GET error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// POST - Create or update notification preferences
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

    // Validate required fields
    if (!body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      )
    }

    // Check if preferences already exist
    const { data: existing } = await supabase
      .from('notification_preferences')
      .select('id')
      .eq('user_id', userId)
      .single()

    let result

    if (existing) {
      // Update existing preferences
      const { data, error } = await supabase
        .from('notification_preferences')
        .update({
          email_security: body.emailSecurity,
          email_updates: body.emailUpdates,
          email_marketing: body.emailMarketing,
          push_messages: body.pushMessages,
          push_mentions: body.pushMentions,
          push_tasks: body.pushTasks,
          email_frequency: body.emailFrequency,
          quiet_hours_start: body.quietHoursStart,
          quiet_hours_end: body.quietHoursEnd,
          channel_email: body.channelEmail,
          channel_push: body.channelPush,
          channel_sms: body.channelSms,
          order_updates_email: body.orderUpdatesEmail,
          order_updates_browser: body.orderUpdatesBrowser,
          order_updates_app: body.orderUpdatesApp,
          invoice_reminders_email: body.invoiceRemindersEmail,
          invoice_reminders_browser: body.invoiceRemindersBrowser,
          invoice_reminders_app: body.invoiceRemindersApp,
          promotional_offers_email: body.promotionalOffersEmail,
          promotional_offers_browser: body.promotionalOffersBrowser,
          promotional_offers_app: body.promotionalOffersApp,
          system_maintenance_email: body.systemMaintenanceEmail,
          system_maintenance_browser: body.systemMaintenanceBrowser,
          system_maintenance_app: body.systemMaintenanceApp,
          notification_timing: body.notificationTiming,
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating notification preferences:', error)
        return NextResponse.json(
          { error: 'Failed to update notification preferences' },
          { status: 500 }
        )
      }

      result = data
    } else {
      // Create new preferences
      const { data, error } = await supabase
        .from('notification_preferences')
        .insert({
          user_id: userId,
          email_security: body.emailSecurity,
          email_updates: body.emailUpdates,
          email_marketing: body.emailMarketing,
          push_messages: body.pushMessages,
          push_mentions: body.pushMentions,
          push_tasks: body.pushTasks,
          email_frequency: body.emailFrequency,
          quiet_hours_start: body.quietHoursStart,
          quiet_hours_end: body.quietHoursEnd,
          channel_email: body.channelEmail,
          channel_push: body.channelPush,
          channel_sms: body.channelSms,
          order_updates_email: body.orderUpdatesEmail,
          order_updates_browser: body.orderUpdatesBrowser,
          order_updates_app: body.orderUpdatesApp,
          invoice_reminders_email: body.invoiceRemindersEmail,
          invoice_reminders_browser: body.invoiceRemindersBrowser,
          invoice_reminders_app: body.invoiceRemindersApp,
          promotional_offers_email: body.promotionalOffersEmail,
          promotional_offers_browser: body.promotionalOffersBrowser,
          promotional_offers_app: body.promotionalOffersApp,
          system_maintenance_email: body.systemMaintenanceEmail,
          system_maintenance_browser: body.systemMaintenanceBrowser,
          system_maintenance_app: body.systemMaintenanceApp,
          notification_timing: body.notificationTiming,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating notification preferences:', error)
        return NextResponse.json(
          { error: 'Failed to create notification preferences' },
          { status: 500 }
        )
      }

      result = data
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Notification preferences saved successfully',
        preferences: result
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Notification preferences POST error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
