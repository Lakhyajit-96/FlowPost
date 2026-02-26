"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Mail, MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

const notificationsFormSchema = z.object({
  emailSecurity: z.boolean(),
  emailUpdates: z.boolean(),
  emailMarketing: z.boolean(),
  pushMessages: z.boolean(),
  pushMentions: z.boolean(),
  pushTasks: z.boolean(),
  emailFrequency: z.string(),
  quietHoursStart: z.string(),
  quietHoursEnd: z.string(),
  channelEmail: z.boolean(),
  channelPush: z.boolean(),
  channelSms: z.boolean(),
  orderUpdatesEmail: z.boolean(),
  orderUpdatesBrowser: z.boolean(),
  orderUpdatesApp: z.boolean(),
  invoiceRemindersEmail: z.boolean(),
  invoiceRemindersBrowser: z.boolean(),
  invoiceRemindersApp: z.boolean(),
  promotionalOffersEmail: z.boolean(),
  promotionalOffersBrowser: z.boolean(),
  promotionalOffersApp: z.boolean(),
  systemMaintenanceEmail: z.boolean(),
  systemMaintenanceBrowser: z.boolean(),
  systemMaintenanceApp: z.boolean(),
  notificationTiming: z.string(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

export default function NotificationSettings() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailSecurity: false,
      emailUpdates: true,
      emailMarketing: false,
      pushMessages: true,
      pushMentions: true,
      pushTasks: false,
      emailFrequency: "instant",
      quietHoursStart: "22:00",
      quietHoursEnd: "06:00",
      channelEmail: true,
      channelPush: true,
      channelSms: false,
      orderUpdatesEmail: true,
      orderUpdatesBrowser: true,
      orderUpdatesApp: true,
      invoiceRemindersEmail: true,
      invoiceRemindersBrowser: false,
      invoiceRemindersApp: true,
      promotionalOffersEmail: false,
      promotionalOffersBrowser: true,
      promotionalOffersApp: false,
      systemMaintenanceEmail: true,
      systemMaintenanceBrowser: true,
      systemMaintenanceApp: false,
      notificationTiming: "online",
    },
  })

  useEffect(() => {
    async function fetchPreferences() {
      if (!user) return

      try {
        const response = await fetch('/api/notifications/preferences')
        const data = await response.json()

        if (response.ok && data.preferences) {
          // Map database fields to form fields
          form.reset({
            emailSecurity: data.preferences.email_security,
            emailUpdates: data.preferences.email_updates,
            emailMarketing: data.preferences.email_marketing,
            pushMessages: data.preferences.push_messages,
            pushMentions: data.preferences.push_mentions,
            pushTasks: data.preferences.push_tasks,
            emailFrequency: data.preferences.email_frequency,
            quietHoursStart: data.preferences.quiet_hours_start,
            quietHoursEnd: data.preferences.quiet_hours_end,
            channelEmail: data.preferences.channel_email,
            channelPush: data.preferences.channel_push,
            channelSms: data.preferences.channel_sms,
            orderUpdatesEmail: data.preferences.order_updates_email,
            orderUpdatesBrowser: data.preferences.order_updates_browser,
            orderUpdatesApp: data.preferences.order_updates_app,
            invoiceRemindersEmail: data.preferences.invoice_reminders_email,
            invoiceRemindersBrowser: data.preferences.invoice_reminders_browser,
            invoiceRemindersApp: data.preferences.invoice_reminders_app,
            promotionalOffersEmail: data.preferences.promotional_offers_email,
            promotionalOffersBrowser: data.preferences.promotional_offers_browser,
            promotionalOffersApp: data.preferences.promotional_offers_app,
            systemMaintenanceEmail: data.preferences.system_maintenance_email,
            systemMaintenanceBrowser: data.preferences.system_maintenance_browser,
            systemMaintenanceApp: data.preferences.system_maintenance_app,
            notificationTiming: data.preferences.notification_timing,
          })
        }
      } catch (error) {
        console.error('Error fetching preferences:', error)
        toast.error('Failed to load notification preferences')
      } finally {
        setFetching(false)
      }
    }

    fetchPreferences()
  }, [user, form])

  async function onSubmit(data: NotificationsFormValues) {
    setLoading(true)
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Notification preferences saved successfully!")
      } else {
        toast.error(result.error || "Failed to save notification preferences")
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error("Failed to save notification preferences")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Configure how you receive notifications.
          </p>
        </div>

        {fetching ? (
          <Card>
            <CardContent className="py-10">
              <div className="flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Loading preferences...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Choose what email notifications you want to receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="emailSecurity"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Security alerts</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Get notified when there are security events on your account.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emailUpdates"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Product updates</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Receive updates about new features and improvements.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emailMarketing"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Marketing emails</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Receive emails about our latest offers and promotions.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Push Notifications</CardTitle>
                  <CardDescription>
                    Configure browser and mobile push notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="pushMessages"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">New messages</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Get notified when you receive new messages.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pushMentions"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Mentions</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Get notified when someone mentions you.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pushTasks"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Task updates</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Get notified about task assignments and updates.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Notification Frequency</CardTitle>
                <CardDescription>
                  Control how often you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="emailFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Frequency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="instant">Instant</SelectItem>
                          <SelectItem value="hourly">Hourly digest</SelectItem>
                          <SelectItem value="daily">Daily digest</SelectItem>
                          <SelectItem value="weekly">Weekly digest</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Quiet Hours</FormLabel>
                  <div className="flex space-x-2">
                    <FormField
                      control={form.control}
                      name="quietHoursStart"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-50">
                              <SelectValue placeholder="Start" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="22:00">10:00 PM</SelectItem>
                            <SelectItem value="23:00">11:00 PM</SelectItem>
                            <SelectItem value="00:00">12:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <span className="self-center">to</span>
                    <FormField
                      control={form.control}
                      name="quietHoursEnd"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-50">
                              <SelectValue placeholder="End" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="06:00">6:00 AM</SelectItem>
                            <SelectItem value="07:00">7:00 AM</SelectItem>
                            <SelectItem value="08:00">8:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </FormItem>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  We need permission from your browser to show notifications.{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary"
                    type="button"
                    onClick={() => {
                      if ("Notification" in window) {
                        Notification.requestPermission().then((permission) => {
                          if (permission === "granted") {
                            toast.success("Notification permission granted!")
                          } else {
                            toast.error("Notification permission denied")
                          }
                        })
                      } else {
                        toast.error("Notifications not supported in this browser")
                      }
                    }}
                  >
                    Request Permission
                  </Button>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    {/* Order Updates */}
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium mb-4">Order updates</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="orderUpdatesEmail"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-3 bg-muted/30">
                              <FormLabel className="text-sm font-normal">Email</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="orderUpdatesBrowser"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-3 bg-muted/30">
                              <FormLabel className="text-sm font-normal">Browser</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="orderUpdatesApp"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-3 bg-muted/30">
                              <FormLabel className="text-sm font-normal">App</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Invoice Reminders */}
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium mb-4">Invoice reminders</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="invoiceRemindersEmail"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-3 bg-muted/30">
                              <FormLabel className="text-sm font-normal">Email</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="invoiceRemindersBrowser"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-3 bg-muted/30">
                              <FormLabel className="text-sm font-normal">Browser</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="invoiceRemindersApp"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-3 bg-muted/30">
                              <FormLabel className="text-sm font-normal">App</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Promotional Offers */}
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium mb-4">Promotional offers</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="promotionalOffersEmail"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-3 bg-muted/30">
                              <FormLabel className="text-sm font-normal">Email</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="promotionalOffersBrowser"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-3 bg-muted/30">
                              <FormLabel className="text-sm font-normal">Browser</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="promotionalOffersApp"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-3 bg-muted/30">
                              <FormLabel className="text-sm font-normal">App</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* System Maintenance */}
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium mb-4">System maintenance</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="systemMaintenanceEmail"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-3 bg-muted/30">
                              <FormLabel className="text-sm font-normal">Email</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="systemMaintenanceBrowser"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-3 bg-muted/30">
                              <FormLabel className="text-sm font-normal">Browser</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="systemMaintenanceApp"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-3 bg-muted/30">
                              <FormLabel className="text-sm font-normal">App</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="notificationTiming"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>When should we send you notifications?</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full max-w-sm">
                                <SelectValue placeholder="Select timing" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="online">Only When I&apos;m online</SelectItem>
                              <SelectItem value="always">Always</SelectItem>
                              <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>
                  Choose your preferred notification channels for different types of alerts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="channelEmail"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-medium">Email</FormLabel>
                            <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="channelPush"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-medium">Push Notifications</FormLabel>
                            <div className="text-sm text-muted-foreground">Receive browser push notifications</div>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="channelSms"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="h-5 w-5 text-muted-foreground" />
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-medium">SMS</FormLabel>
                            <div className="text-sm text-muted-foreground">Receive notifications via SMS</div>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-2">
              <Button type="submit" className="cursor-pointer" disabled={loading || fetching}>
                {loading ? "Saving..." : "Save Preferences"}
              </Button>
              <Button 
                variant="outline" 
                type="button" 
                className="cursor-pointer" 
                disabled={fetching}
                onClick={async () => {
                  try {
                    const response = await fetch('/api/notifications/preferences')
                    const data = await response.json()

                    if (response.ok && data.preferences) {
                      form.reset({
                        emailSecurity: data.preferences.email_security,
                        emailUpdates: data.preferences.email_updates,
                        emailMarketing: data.preferences.email_marketing,
                        pushMessages: data.preferences.push_messages,
                        pushMentions: data.preferences.push_mentions,
                        pushTasks: data.preferences.push_tasks,
                        emailFrequency: data.preferences.email_frequency,
                        quietHoursStart: data.preferences.quiet_hours_start,
                        quietHoursEnd: data.preferences.quiet_hours_end,
                        channelEmail: data.preferences.channel_email,
                        channelPush: data.preferences.channel_push,
                        channelSms: data.preferences.channel_sms,
                        orderUpdatesEmail: data.preferences.order_updates_email,
                        orderUpdatesBrowser: data.preferences.order_updates_browser,
                        orderUpdatesApp: data.preferences.order_updates_app,
                        invoiceRemindersEmail: data.preferences.invoice_reminders_email,
                        invoiceRemindersBrowser: data.preferences.invoice_reminders_browser,
                        invoiceRemindersApp: data.preferences.invoice_reminders_app,
                        promotionalOffersEmail: data.preferences.promotional_offers_email,
                        promotionalOffersBrowser: data.preferences.promotional_offers_browser,
                        promotionalOffersApp: data.preferences.promotional_offers_app,
                        systemMaintenanceEmail: data.preferences.system_maintenance_email,
                        systemMaintenanceBrowser: data.preferences.system_maintenance_browser,
                        systemMaintenanceApp: data.preferences.system_maintenance_app,
                        notificationTiming: data.preferences.notification_timing,
                      })
                      toast.info("Changes discarded")
                    } else {
                      form.reset()
                      toast.info("Reset to defaults")
                    }
                  } catch (error) {
                    form.reset()
                    toast.info("Reset to defaults")
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
        )}
      </div>
  )
}
