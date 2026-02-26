-- Notification Preferences Table
-- Stores user notification preferences for FlowPost

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  
  -- Email Notifications
  email_security BOOLEAN DEFAULT false,
  email_updates BOOLEAN DEFAULT true,
  email_marketing BOOLEAN DEFAULT false,
  
  -- Push Notifications
  push_messages BOOLEAN DEFAULT true,
  push_mentions BOOLEAN DEFAULT true,
  push_tasks BOOLEAN DEFAULT false,
  
  -- Notification Frequency
  email_frequency TEXT DEFAULT 'instant' CHECK (email_frequency IN ('instant', 'hourly', 'daily', 'weekly', 'never')),
  quiet_hours_start TEXT DEFAULT '22:00',
  quiet_hours_end TEXT DEFAULT '06:00',
  
  -- Notification Channels
  channel_email BOOLEAN DEFAULT true,
  channel_push BOOLEAN DEFAULT true,
  channel_sms BOOLEAN DEFAULT false,
  
  -- Notification Preferences by Type
  order_updates_email BOOLEAN DEFAULT true,
  order_updates_browser BOOLEAN DEFAULT true,
  order_updates_app BOOLEAN DEFAULT true,
  
  invoice_reminders_email BOOLEAN DEFAULT true,
  invoice_reminders_browser BOOLEAN DEFAULT false,
  invoice_reminders_app BOOLEAN DEFAULT true,
  
  promotional_offers_email BOOLEAN DEFAULT false,
  promotional_offers_browser BOOLEAN DEFAULT true,
  promotional_offers_app BOOLEAN DEFAULT false,
  
  system_maintenance_email BOOLEAN DEFAULT true,
  system_maintenance_browser BOOLEAN DEFAULT true,
  system_maintenance_app BOOLEAN DEFAULT false,
  
  -- Notification Timing
  notification_timing TEXT DEFAULT 'online' CHECK (notification_timing IN ('online', 'always', 'never')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- Enable Row Level Security
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only view their own notification preferences
CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Users can insert their own notification preferences
CREATE POLICY "Users can insert own notification preferences"
  ON notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Users can update their own notification preferences
CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Users can delete their own notification preferences
CREATE POLICY "Users can delete own notification preferences"
  ON notification_preferences
  FOR DELETE
  USING (auth.uid()::text = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_preferences_updated_at();

-- Comments for documentation
COMMENT ON TABLE notification_preferences IS 'Stores user notification preferences for email, push, and app notifications';
COMMENT ON COLUMN notification_preferences.user_id IS 'References the Clerk user ID from the users table';
COMMENT ON COLUMN notification_preferences.email_frequency IS 'How often to send email notifications: instant, hourly, daily, weekly, or never';
COMMENT ON COLUMN notification_preferences.notification_timing IS 'When to send notifications: only when online, always, or never';
