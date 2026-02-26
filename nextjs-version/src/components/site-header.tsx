"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CommandSearch, SearchTrigger } from "@/components/command-search"
import { ModeToggle } from "@/components/mode-toggle"
import { Plus, Sparkles, FileText, Download, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { UserButton, useUser } from "@clerk/nextjs"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = React.useState(false)
  const { user } = useUser()
  const [userPlan, setUserPlan] = React.useState<string>("Free")
  const [generatingReport, setGeneratingReport] = React.useState(false)
  const [exportingData, setExportingData] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    async function fetchUserPlan() {
      if (!user) return

      const supabase = createClient()
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan_name, status')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (subscription && subscription.plan_name) {
        // Capitalize first letter
        const planName = subscription.plan_name.charAt(0).toUpperCase() + subscription.plan_name.slice(1).toLowerCase()
        setUserPlan(planName)
      } else {
        setUserPlan("Free")
      }
    }

    fetchUserPlan()
  }, [user])

  const handleGenerateReport = async () => {
    setGeneratingReport(true)
    try {
      if (!user) {
        toast.error("Please sign in to generate report")
        return
      }

      const supabase = createClient()
      
      // Fetch analytics data
      const [
        { data: connections },
        { data: integrations },
        { data: aiContent }
      ] = await Promise.all([
        supabase.from('social_connections').select('platform, is_active').eq('user_id', user.id),
        supabase.from('other_integrations').select('integration_name, is_active').eq('user_id', user.id),
        supabase.from('ai_generated_content').select('content_type, platform, created_at').eq('user_id', user.id)
      ])

      // Calculate metrics
      const activeConnections = connections?.filter(c => c.is_active).length || 0
      const activeIntegrations = integrations?.filter(i => i.is_active).length || 0
      const totalAiGenerations = aiContent?.length || 0
      
      // Group AI content by platform
      const contentByPlatform = aiContent?.reduce((acc: any, item: any) => {
        acc[item.platform] = (acc[item.platform] || 0) + 1
        return acc
      }, {}) || {}

      // Group AI content by type
      const contentByType = aiContent?.reduce((acc: any, item: any) => {
        acc[item.content_type] = (acc[item.content_type] || 0) + 1
        return acc
      }, {}) || {}

      const reportData = {
        reportMetadata: {
          title: "FlowPost Analytics Report",
          generatedDate: new Date().toISOString(),
          reportPeriod: "All Time",
          reportVersion: "1.0"
        },
        userInfo: {
          name: user.fullName || "User",
          email: user.primaryEmailAddress?.emailAddress,
          plan: userPlan,
          userId: user.id
        },
        summary: {
          totalConnections: (connections?.length || 0) + (integrations?.length || 0),
          activeConnections: activeConnections + activeIntegrations,
          totalSocialPlatforms: connections?.length || 0,
          activeSocialPlatforms: activeConnections,
          totalIntegrations: integrations?.length || 0,
          activeIntegrations: activeIntegrations,
          totalAiGenerations: totalAiGenerations
        },
        connectedPlatforms: {
          social: connections?.map(c => ({
            platform: c.platform,
            status: c.is_active ? 'Active' : 'Inactive'
          })) || [],
          integrations: integrations?.map(i => ({
            service: i.integration_name,
            status: i.is_active ? 'Active' : 'Inactive'
          })) || []
        },
        aiContentAnalytics: {
          totalGenerations: totalAiGenerations,
          byPlatform: contentByPlatform,
          byContentType: contentByType,
          mostUsedPlatform: Object.entries(contentByPlatform).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A',
          mostUsedContentType: Object.entries(contentByType).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A'
        },
        recommendations: [
          activeConnections === 0 ? "Connect your social media accounts to start posting" : null,
          totalAiGenerations === 0 ? "Try the AI Content Generator to create engaging posts" : null,
          activeConnections < 3 ? "Connect more platforms to expand your reach" : null,
          totalAiGenerations > 0 && totalAiGenerations < 10 ? "Generate more content variations to find what works best" : null
        ].filter(Boolean)
      }
      
      // Create downloadable report
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `flowpost-analytics-report-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success("Report generated successfully!")
    } catch (error) {
      console.error("Error generating report:", error)
      toast.error("Failed to generate report")
    } finally {
      setGeneratingReport(false)
    }
  }

  const handleExportData = async () => {
    setExportingData(true)
    try {
      if (!user) {
        toast.error("Please sign in to export data")
        return
      }

      // Fetch user's data from Supabase
      const supabase = createClient()
      
      const [
        { data: connections },
        { data: integrations },
        { data: apiKeys },
        { data: notifications },
        { data: aiContent }
      ] = await Promise.all([
        supabase.from('social_connections').select('platform, connected_at, is_active').eq('user_id', user.id),
        supabase.from('other_integrations').select('integration_name, connected_at, is_active').eq('user_id', user.id),
        supabase.from('api_keys').select('id, key_name, environment, created_at').eq('user_id', user.id),
        supabase.from('notification_preferences').select('*').eq('user_id', user.id).single(),
        supabase.from('ai_generated_content').select('content_type, platform, tone, length, prompt, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
      ])

      const exportData = {
        exportMetadata: {
          exportDate: new Date().toISOString(),
          exportVersion: "1.0",
          dataFormat: "JSON"
        },
        user: {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
          plan: userPlan
        },
        socialConnections: {
          total: connections?.length || 0,
          platforms: connections || []
        },
        integrations: {
          total: integrations?.length || 0,
          services: integrations || []
        },
        apiKeys: {
          total: apiKeys?.length || 0,
          keys: apiKeys || []
        },
        notificationPreferences: notifications || null,
        aiGeneratedContent: {
          total: aiContent?.length || 0,
          recentGenerations: aiContent || []
        },
        statistics: {
          totalConnections: (connections?.length || 0) + (integrations?.length || 0),
          activeConnections: [...(connections || []), ...(integrations || [])].filter((c: any) => c.is_active).length,
          totalApiKeys: apiKeys?.length || 0,
          totalAiGenerations: aiContent?.length || 0
        }
      }

      // Create JSON download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `flowpost-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Data exported successfully!")
    } catch (error) {
      console.error("Error exporting data:", error)
      toast.error("Failed to export data")
    } finally {
      setExportingData(false)
    }
  }

  return (
    <>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 py-3 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex-1 max-w-sm">
            <SearchTrigger onClick={() => setSearchOpen(true)} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="default" size="sm" className="hidden sm:flex gap-2" asChild>
              <Link href="/ai-generator">
                <Sparkles className="size-4" />
                AI Generate
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2 cursor-pointer">
                  <Plus className="size-4" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href="/tasks">
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={handleGenerateReport}
                  disabled={generatingReport}
                >
                  {generatingReport ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={handleExportData}
                  disabled={exportingData}
                >
                  {exportingData ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href="/settings/account">
                    <FileText className="h-4 w-4 mr-2" />
                    Dashboard Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
            {user && (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium">{user.fullName || user.firstName || 'User'}</span>
                  <Badge variant="secondary" className="text-xs">
                    {userPlan} Plan
                  </Badge>
                </div>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                  afterSignOutUrl="/landing"
                />
              </div>
            )}
          </div>
        </div>
      </header>
      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
