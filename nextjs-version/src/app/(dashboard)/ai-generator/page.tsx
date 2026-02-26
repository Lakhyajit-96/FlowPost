"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Copy, Check, Loader2, Wand2, Save, History, Trash2, Calendar, Crown, Zap, Lock, Target, Lightbulb, AlertCircle, BookOpen, Sliders, FileType, Hash, MessageCircle, Smile, Settings2, RefreshCw, BarChart3, MessageSquare, Rocket, Video, Star, BookText, TrendingUp, Users, GraduationCap, Camera, Gift, Quote, PieChart, PartyPopper, Wrench, CalendarDays, HelpCircle, Leaf, ArrowLeftRight, Mic } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { ContentAnalyzer } from "./components/content-analyzer"
import { AISuggestions } from "./components/ai-suggestions"
import { BrandVoiceSelector } from "./components/brand-voice-selector"
import { ContentVariations } from "./components/content-variations"
import { ExportOptions } from "./components/export-options"

interface GeneratedContent {
  id?: string
  content: string
  content_type: string
  platform: string
  tone: string
  length: string
  prompt: string
  keywords: string
  include_emojis: boolean
  include_hashtags: boolean
  created_at?: string
}

interface PlanLimits {
  plan: string
  ai_generations_limit: number
  ai_generations_used: number
  allowed: boolean
  remaining: number
}

const PLAN_FEATURES = {
  free: {
    name: "Free",
    generations: 0,
    contentTypes: [] as string[],
    features: ["1 social media account", "5 posts per month", "Basic features"]
  },
  starter: {
    name: "Starter",
    generations: 10,
    contentTypes: ["caption", "hashtags"] as string[],
    features: ["3 social media accounts", "30 posts per month", "10 AI generations/month", "Basic analytics", "Post scheduling", "Email support"]
  },
  professional: {
    name: "Professional",
    generations: 50,
    contentTypes: ["caption", "hashtags", "post_idea", "thread", "story"] as string[],
    features: ["10 social media accounts", "100 posts per month", "50 AI generations/month", "Advanced analytics", "AI content generation", "Priority support", "Team collaboration"]
  },
  agency: {
    name: "Agency",
    generations: -1,
    contentTypes: ["caption", "hashtags", "post_idea", "thread", "story", "video_script"] as string[],
    features: ["Unlimited social accounts", "Unlimited posts", "Unlimited AI generations", "Advanced AI features", "White-label reports", "Dedicated support", "API access"]
  }
}

export default function AIGeneratorPage() {
  const { user } = useUser()
  const [prompt, setPrompt] = useState("")
  const [contentType, setContentType] = useState("caption")
  const [platform, setPlatform] = useState("instagram")
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState("medium")
  const [keywords, setKeywords] = useState("")
  const [includeEmojis, setIncludeEmojis] = useState(true)
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [history, setHistory] = useState<GeneratedContent[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [planLimits, setPlanLimits] = useState<PlanLimits | null>(null)
  const [loadingLimits, setLoadingLimits] = useState(true)
  const [userPlan, setUserPlan] = useState<string>("starter")
  const [brandVoice, setBrandVoice] = useState<string>("default")
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    if (user) {
      console.log("🔑 Your Clerk User ID:", user.id)
      console.log("📧 Email:", user.primaryEmailAddress?.emailAddress)
      console.log("👤 Name:", user.fullName)
      console.log("\n💡 To set up your plan, run the SQL script in database/setup_test_user.sql")
      fetchPlanLimits()
      fetchHistory()
    }
  }, [user])

  const fetchPlanLimits = async () => {
    if (!user) return
    
    setLoadingLimits(true)
    try {
      const supabase = createClient()
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('clerk_user_id', user.id)
        .maybeSingle()

      let plan = "starter"
      
      if (!userError && userData) {
        plan = userData.subscription_tier || "starter"
      }
      
      setUserPlan(plan)

      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: usageData } = await supabase
        .from('ai_generated_content')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())

      const used = usageData?.length || 0
      const limit = PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES]?.generations || 0
      const allowed = limit === -1 || used < limit

      setPlanLimits({
        plan,
        ai_generations_limit: limit,
        ai_generations_used: used,
        allowed,
        remaining: limit === -1 ? -1 : Math.max(0, limit - used)
      })
    } catch (error) {
      console.error("Error fetching plan limits:", error)
      setUserPlan("starter")
      setPlanLimits({
        plan: "starter",
        ai_generations_limit: 10,
        ai_generations_used: 0,
        allowed: true,
        remaining: 10
      })
    } finally {
      setLoadingLimits(false)
    }
  }

  const fetchHistory = async () => {
    if (!user) return
    
    setLoadingHistory(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('ai_generated_content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error("Error fetching history:", error)
        setHistory([])
        return
      }
      
      setHistory(data || [])
    } catch (error) {
      console.error("Error fetching history:", error)
      setHistory([])
    } finally {
      setLoadingHistory(false)
    }
  }

  const canUseContentType = (type: string): boolean => {
    const planFeatures = PLAN_FEATURES[userPlan as keyof typeof PLAN_FEATURES]
    return planFeatures?.contentTypes.includes(type) || false
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    if (!planLimits?.allowed) {
      toast.error("You've reached your monthly AI generation limit. Upgrade to generate more!")
      return
    }

    if (!canUseContentType(contentType)) {
      toast.error(`${contentType} is not available in your plan. Upgrade to unlock!`)
      return
    }

    setGenerating(true)
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          contentType,
          platform,
          tone,
          length,
          keywords,
          includeEmojis,
          includeHashtags,
          brandVoice
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content')
      }

      setGeneratedContent(data.content)
      toast.success("Content generated successfully!")
      
      await fetchPlanLimits()
      await fetchHistory()
    } catch (error: any) {
      console.error("Error generating content:", error)
      toast.error(error.message || "Failed to generate content")
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!user || !generatedContent) {
      toast.error("Please generate content first")
      return
    }

    // Content is already saved by the API, just refresh history
    toast.success("Content is already saved in your history!")
    await fetchHistory()
  }

  const handleDeleteHistory = async (id: string) => {
    if (!user) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('ai_generated_content')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      
      toast.success("Content deleted from history")
      await fetchHistory()
    } catch (error) {
      console.error("Error deleting content:", error)
      toast.error("Failed to delete content")
    }
  }

  const handleLoadFromHistory = (item: GeneratedContent) => {
    setGeneratedContent(item.content)
    setContentType(item.content_type)
    setPlatform(item.platform)
    setTone(item.tone)
    setLength(item.length)
    setPrompt(item.prompt)
    setKeywords(item.keywords)
    setIncludeEmojis(item.include_emojis)
    setIncludeHashtags(item.include_hashtags)
    toast.success("Content loaded from history")
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const generateDetailedContent = (
    type: string, 
    plat: string, 
    t: string, 
    len: string,
    p: string,
    kw: string,
    emojis: boolean,
    hashtags: boolean,
    voice: string
  ): string => {
    const keywordList = kw.split(',').map(k => k.trim()).filter(k => k)
    
    // Brand voice prefixes
    const voicePrefix: Record<string, string> = {
      default: "",
      professional: "[Professional tone] ",
      conversational: "[Conversational style] ",
      bold: "[Bold & confident voice] ",
      empathetic: "[Empathetic approach] ",
      thought_leader: "[Thought leadership] "
    }
    
    const emojiMap: Record<string, string> = {
      professional: "💼 📊 🎯",
      casual: "😊 👋 ✨",
      friendly: "🤗 💙 🌟",
      humorous: "😄 🤣 😎",
      inspirational: "🚀 💪 ⭐"
    }
    
    const lengthMap: Record<string, number> = {
      short: 1,
      medium: 2,
      long: 3
    }

    const emoji = emojis ? emojiMap[t] || "✨" : ""
    const multiplier = lengthMap[len] || 2
    const prefix = voicePrefix[voice] || ""

    if (type === "caption") {
      let caption = prefix
      caption += emojis ? `${emoji.split(' ')[0]} ` : ""
      caption += `${p}\n\n`
      
      if (multiplier >= 2) {
        caption += `Discover how FlowPost transforms your social media strategy with powerful automation and analytics. `
      }
      if (multiplier >= 3) {
        caption += `Our platform helps you schedule posts across all major platforms, track engagement metrics in real-time, and grow your audience organically. `
      }
      
      caption += `Perfect for ${plat === 'linkedin' ? 'professionals and businesses' : plat === 'instagram' ? 'creators and brands' : 'marketers and entrepreneurs'}.\n\n`
      
      if (keywordList.length > 0) {
        caption += `Key features: ${keywordList.slice(0, 3).join(', ')}\n\n`
      }
      
      if (hashtags) {
        const tags = [
          `#${p.replace(/\s+/g, '')}`,
          '#SocialMediaMarketing',
          '#ContentCreation',
          `#${plat.charAt(0).toUpperCase() + plat.slice(1)}`,
          ...keywordList.slice(0, 2).map(k => `#${k.replace(/\s+/g, '')}`)
        ]
        caption += tags.join(' ')
      }
      
      return caption
    }
    
    if (type === "hashtags") {
      const baseTags = [
        `#${p.replace(/\s+/g, '')}`,
        '#SocialMediaMarketing',
        '#ContentCreation',
        '#DigitalMarketing',
        `#${plat.charAt(0).toUpperCase() + plat.slice(1)}Marketing`,
        '#GrowYourBusiness',
        '#MarketingStrategy',
        '#SocialMediaTips',
        '#ContentStrategy',
        '#BrandBuilding'
      ]
      
      const keywordTags = keywordList.map(k => `#${k.replace(/\s+/g, '')}`)
      const platformTags = plat === 'instagram' ? ['#InstaGrowth', '#IGMarketing'] :
                          plat === 'linkedin' ? ['#LinkedInTips', '#B2BMarketing'] :
                          plat === 'twitter' ? ['#TwitterMarketing', '#SocialMedia'] :
                          ['#SocialMediaGrowth', '#DigitalStrategy']
      
      const allTags = [...baseTags, ...keywordTags, ...platformTags]
      return allTags.slice(0, multiplier * 10).join(' ')
    }
    
    if (type === "post_idea") {
      let idea = `${emojis ? '💡 ' : ''}Post Idea: "${p}"\n\n`
      
      if (plat === 'instagram') {
        idea += `📱 Create a carousel post showcasing:\n`
        idea += `1. Problem: ${keywordList[0] || 'Time-consuming social media management'}\n`
        idea += `2. Solution: FlowPost automation features\n`
        idea += `3. Benefits: Save 10+ hours per week\n`
        if (multiplier >= 2) {
          idea += `4. Features: AI content generation, analytics dashboard\n`
          idea += `5. Social proof: Join 10,000+ satisfied users\n`
        }
        if (multiplier >= 3) {
          idea += `6. Pricing: Plans starting at $19/month\n`
          idea += `7. Testimonial: "FlowPost changed my workflow!"\n`
        }
        idea += `${multiplier >= 2 ? '8' : '4'}. Call-to-action: Try free for 14 days\n\n`
        idea += `Best time to post: 11 AM - 1 PM or 7 PM - 9 PM\n`
        idea += `Recommended format: 1080x1080px, 5-7 slides\n`
      } else if (plat === 'linkedin') {
        idea += `💼 Create a professional post with:\n`
        idea += `• Hook: Start with a compelling question or stat\n`
        idea += `• Story: Share a brief case study or success story\n`
        idea += `• Value: Provide 3-5 actionable tips\n`
        if (multiplier >= 2) {
          idea += `• Data: Include relevant metrics or research\n`
          idea += `• Visual: Add an infographic or chart\n`
        }
        if (multiplier >= 3) {
          idea += `• Engagement: Ask a thought-provoking question\n`
          idea += `• Resources: Link to additional content\n`
        }
        idea += `• CTA: Encourage comments and shares\n\n`
        idea += `Best time to post: Tuesday-Thursday, 9 AM - 11 AM\n`
      } else {
        idea += `Create engaging content featuring:\n`
        idea += `• Attention-grabbing opening\n`
        idea += `• Clear value proposition\n`
        idea += `• Visual elements (images/video)\n`
        if (multiplier >= 2) {
          idea += `• User testimonials or social proof\n`
          idea += `• Step-by-step guide or tutorial\n`
        }
        if (multiplier >= 3) {
          idea += `• Behind-the-scenes content\n`
          idea += `• Interactive elements (polls, questions)\n`
        }
        idea += `• Strong call-to-action\n\n`
        idea += `Optimal posting time: Check your analytics for best engagement\n`
      }
      
      if (hashtags) {
        idea += `\nSuggested hashtags: ${keywordList.slice(0, 5).map(k => `#${k.replace(/\s+/g, '')}`).join(' ')}`
      }
      
      return idea
    }
    
    if (type === "thread") {
      let thread = `${emojis ? '🧵 ' : ''}Thread about ${p}:\n\n`
      thread += `1/ Let's talk about transforming your social media strategy with ${keywordList[0] || 'automation'}...\n\n`
      thread += `2/ The biggest challenge? Managing multiple platforms efficiently while maintaining quality content.\n\n`
      thread += `3/ That's where FlowPost comes in - one powerful dashboard, all your platforms connected.\n\n`
      
      if (multiplier >= 2) {
        thread += `4/ Key features:\n• AI-powered content generation\n• Smart scheduling across 6 platforms\n• Real-time analytics and insights\n\n`
        thread += `5/ The results speak for themselves: Users save an average of 15 hours per week on social media management.\n\n`
      }
      
      if (multiplier >= 3) {
        thread += `6/ But it's not just about saving time - it's about growing smarter:\n• Track what works\n• Optimize posting times\n• Engage with your audience\n\n`
        thread += `7/ Whether you're a solopreneur, agency, or enterprise team, FlowPost scales with your needs.\n\n`
        thread += `8/ Pricing is transparent and flexible:\n• Free plan to get started\n• Starter at $19/mo\n• Professional at $49/mo\n• Agency at $99/mo\n\n`
      }
      
      thread += `${multiplier >= 3 ? '9' : multiplier >= 2 ? '6' : '4'}/ Ready to level up your social media game? ${emojis ? '🚀' : ''}\n\n`
      thread += `${multiplier >= 3 ? '10' : multiplier >= 2 ? '7' : '5'}/ Start your free 14-day trial today - no credit card required. Link in bio! ${emojis ? '✨' : ''}`
      
      return thread
    }
    
    if (type === "story") {
      let story = `${emojis ? '📱 ' : ''}Story Sequence: ${p}\n\n`
      story += `Slide 1: Eye-catching visual with text overlay\n`
      story += `"${p}" ${emojis ? '✨' : ''}\n\n`
      
      story += `Slide 2: Problem statement\n`
      story += `"Struggling with ${keywordList[0] || 'social media management'}?"\n\n`
      
      story += `Slide 3: Solution intro\n`
      story += `"Meet FlowPost ${emojis ? '🚀' : ''}"\n\n`
      
      if (multiplier >= 2) {
        story += `Slide 4: Feature highlight #1\n`
        story += `"Schedule posts across all platforms"\n\n`
        
        story += `Slide 5: Feature highlight #2\n`
        story += `"AI-powered content generation"\n\n`
      }
      
      if (multiplier >= 3) {
        story += `Slide 6: Social proof\n`
        story += `"Join 10,000+ happy users"\n\n`
        
        story += `Slide 7: Testimonial\n`
        story += `"FlowPost saved me 15 hours/week!"\n\n`
      }
      
      story += `Final Slide: CTA\n`
      story += `"Swipe up to start free trial" ${emojis ? '👆' : ''}\n\n`
      
      story += `Duration: ${multiplier >= 3 ? '7-8' : multiplier >= 2 ? '5-6' : '3-4'} slides, 5-7 seconds each\n`
      story += `Best for: ${plat === 'instagram' ? 'Instagram Stories' : plat === 'facebook' ? 'Facebook Stories' : 'Social Stories'}\n`
      
      return story
    }
    
    if (type === "video_script") {
      let script = `${emojis ? '🎬 ' : ''}Video Script: ${p}\n\n`
      script += `[HOOK - 0:00-0:03]\n`
      script += `"Want to ${keywordList[0] || 'save time'} on social media? Watch this."\n\n`
      
      script += `[INTRO - 0:03-0:10]\n`
      script += `"Hi, I'm going to show you how FlowPost can transform your social media workflow in just 60 seconds."\n\n`
      
      script += `[PROBLEM - 0:10-0:20]\n`
      script += `"If you're spending hours every day managing multiple social accounts, posting content, and tracking analytics..."\n\n`
      
      script += `[SOLUTION - 0:20-0:35]\n`
      script += `"FlowPost brings everything together in one powerful dashboard. Schedule posts, generate content with AI, and track performance across all platforms."\n\n`
      
      if (multiplier >= 2) {
        script += `[FEATURES - 0:35-0:45]\n`
        script += `"Connect Facebook, Instagram, X, LinkedIn, YouTube, and Pinterest. Use AI to create captions, hashtags, and post ideas. Get real-time analytics."\n\n`
      }
      
      if (multiplier >= 3) {
        script += `[BENEFITS - 0:45-0:55]\n`
        script += `"Our users save an average of 15 hours per week. That's time you can spend growing your business, creating better content, or just taking a break."\n\n`
        
        script += `[SOCIAL PROOF - 0:55-1:05]\n`
        script += `"Join over 10,000 marketers, creators, and businesses who trust FlowPost for their social media management."\n\n`
      }
      
      script += `[CTA - ${multiplier >= 3 ? '1:05-1:15' : multiplier >= 2 ? '0:45-0:55' : '0:35-0:45'}]\n`
      script += `"Start your free 14-day trial today. No credit card required. Link in description."\n\n`
      
      script += `[OUTRO - ${multiplier >= 3 ? '1:15-1:20' : multiplier >= 2 ? '0:55-1:00' : '0:45-0:50'}]\n`
      script += `"Thanks for watching! Don't forget to like and subscribe for more social media tips."\n\n`
      
      script += `Total Duration: ${multiplier >= 3 ? '1:20' : multiplier >= 2 ? '1:00' : '0:50'}\n`
      script += `Recommended format: ${plat === 'youtube' ? '16:9 landscape' : plat === 'instagram' ? '9:16 vertical' : '1:1 square'}\n`
      script += `B-roll suggestions: Dashboard screenshots, user testimonials, feature demos\n`
      
      return script
    }
    
    return `Generated ${type} content for ${p} on ${plat} with ${t} tone.`
  }

  return (
    <div className="flex-1 space-y-6 px-6 pt-0">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="h-7 w-7 text-primary" />
                AI Content Generator
              </h1>
              <p className="text-muted-foreground mt-2 text-base">
                Create high-quality, engaging social media content in seconds with AI-powered assistance
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <FileType className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">6 Content Types</p>
                  <p className="text-xs text-muted-foreground">Captions, hashtags, threads, stories & more</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Multi-Platform</p>
                  <p className="text-xs text-muted-foreground">Optimized for Instagram, LinkedIn, X & more</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className="h-10 w-10 rounded-full bg-gray-500/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Brand Voice</p>
                  <p className="text-xs text-muted-foreground">6 voice styles to match your brand personality</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Smart Analytics</p>
                  <p className="text-xs text-muted-foreground">Real-time engagement scores & insights</p>
                </div>
              </div>
            </div>
          </div>
          
          {planLimits && (
            <Card className="min-w-[280px]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Current Plan</p>
                    <p className="text-lg font-bold">{PLAN_FEATURES[userPlan as keyof typeof PLAN_FEATURES]?.name}</p>
                  </div>
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                {planLimits.ai_generations_limit === -1 ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>Unlimited AI generations</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">This Month</span>
                      <span className="font-semibold">{planLimits.ai_generations_used} / {planLimits.ai_generations_limit}</span>
                    </div>
                    <Progress 
                      value={(planLimits.ai_generations_used / planLimits.ai_generations_limit) * 100} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{planLimits.remaining} remaining</span>
                      <span>{Math.round((planLimits.ai_generations_used / planLimits.ai_generations_limit) * 100)}% used</span>
                    </div>
                  </div>
                )}
                {userPlan !== "agency" && (
                  <Link href="/settings/billing" className="block w-full mt-3">
                    <Button variant="outline" size="sm" className="w-full cursor-pointer">
                      <Zap className="h-3 w-3 mr-1" />
                      Upgrade Plan
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Alerts */}
      {userPlan === "free" && (
        <Alert className="border-primary/50 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription>
            You're on the Free plan. Upgrade to Starter ($19/mo) to unlock AI content generation!
            <Link href="/settings/billing" className="ml-2 text-primary hover:underline font-medium">
              Upgrade Now
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {userPlan === "starter" && !loadingLimits && (
        <Alert className="border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-blue-500/5">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <AlertDescription className="text-sm">
                <span className="font-semibold text-blue-700 dark:text-blue-400">Welcome to FlowPost AI Generator!</span>
                <p className="mt-1 text-muted-foreground">
                  You're currently on the <span className="font-medium text-foreground">Starter plan</span> with <span className="font-medium text-foreground">10 AI generations per month</span>. 
                  Need more content? Upgrade to Professional (50/month) or Agency (unlimited) for advanced features.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Link href="/settings/billing">
                    <Button variant="default" size="sm" className="cursor-pointer">
                      <Crown className="h-3 w-3 mr-1" />
                      View Plans
                    </Button>
                  </Link>
                  <Link href="/settings/billing">
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      Compare Features
                    </Button>
                  </Link>
                </div>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {!planLimits?.allowed && userPlan !== "free" && (
        <Alert className="border-orange-500/50 bg-orange-500/5">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription>
            You've used all {planLimits?.ai_generations_limit} AI generations this month. Upgrade for more!
            <Link href="/settings/billing" className="ml-2 text-primary hover:underline font-medium">
              Upgrade Plan
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="generate">
            <Wand2 className="h-4 w-4 mr-2" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History ({history.length})
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Lightbulb className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            {/* Main Content Area - Left */}
            <div className="space-y-4">
              {/* Prompt Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    Your Prompt
                  </CardTitle>
                  <CardDescription>
                    Describe what you want to create
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="E.g., Write a post about our new product launch that highlights the key features and benefits..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about what you want to create
                  </p>
                  <Button
                    onClick={handleGenerate}
                    disabled={generating || !prompt.trim() || !planLimits?.allowed || loadingLimits}
                    className="w-full cursor-pointer"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Output Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Generated Content
                  </CardTitle>
                  <CardDescription>
                    Your AI-generated content will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedContent ? (
                    <>
                      <div className="relative">
                        <div className="bg-muted p-4 rounded-lg min-h-[300px] max-h-[500px] overflow-y-auto whitespace-pre-wrap">
                          {generatedContent}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 cursor-pointer"
                          onClick={handleCopy}
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 mr-2 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="cursor-pointer"
                          onClick={handleGenerate}
                          disabled={generating || !planLimits?.allowed}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerate
                        </Button>
                        <Button
                          variant="outline"
                          className="cursor-pointer"
                          onClick={handleSave}
                          disabled={saving || !user}
                        >
                          {saving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                        <ExportOptions 
                          content={generatedContent}
                          metadata={{
                            contentType,
                            platform,
                            tone,
                            length
                          }}
                        />
                        <Button
                          variant="default"
                          className="cursor-pointer"
                          onClick={() => toast.info("Post scheduling coming soon!")}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          {contentType.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {platform.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {tone.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {length.toUpperCase()}
                        </Badge>
                        {includeEmojis && <Badge variant="outline">Emojis</Badge>}
                        {includeHashtags && <Badge variant="outline">Hashtags</Badge>}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                      <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Configure your settings and enter a prompt to generate content
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Content Analyzer */}
              <ContentAnalyzer content={generatedContent} />

              {/* Content Variations */}
              <ContentVariations 
                baseContent={generatedContent}
                onSelectVariation={setGeneratedContent}
              />

              {/* Quick Tips */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Quick Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground pb-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                    <p>Use specific keywords for better results</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                    <p>Try different tones to find your voice</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Save className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                    <p>Save successful prompts for reuse</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                    <p>Analyze engagement scores to improve</p>
                  </div>
                </CardContent>
              </Card>

              {/* Brand Voice Selector */}
              <BrandVoiceSelector 
                value={brandVoice}
                onChange={setBrandVoice}
                userPlan={userPlan}
              />
            </div>

            {/* Right Sidebar - Settings & Tools */}
            <div className="space-y-4">
              {/* Content Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    Content Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your content generation preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content-type" className="flex items-center gap-2">
                      <FileType className="h-4 w-4" />
                      Content Type
                    </Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger id="content-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="caption" disabled={!canUseContentType("caption")}>
                          <div className="flex items-center justify-between w-full">
                            <span>Caption</span>
                            {!canUseContentType("caption") && <Lock className="h-3 w-3 ml-2" />}
                          </div>
                        </SelectItem>
                        <SelectItem value="hashtags" disabled={!canUseContentType("hashtags")}>
                          <div className="flex items-center justify-between w-full">
                            <span>Hashtags</span>
                            {!canUseContentType("hashtags") && <Lock className="h-3 w-3 ml-2" />}
                          </div>
                        </SelectItem>
                        <SelectItem value="post_idea" disabled={!canUseContentType("post_idea")}>
                          <div className="flex items-center justify-between w-full">
                            <span>Post Idea</span>
                            {!canUseContentType("post_idea") && <Lock className="h-3 w-3 ml-2" />}
                          </div>
                        </SelectItem>
                        <SelectItem value="thread" disabled={!canUseContentType("thread")}>
                          <div className="flex items-center justify-between w-full">
                            <span>Thread</span>
                            {!canUseContentType("thread") && <Lock className="h-3 w-3 ml-2" />}
                          </div>
                        </SelectItem>
                        <SelectItem value="story" disabled={!canUseContentType("story")}>
                          <div className="flex items-center justify-between w-full">
                            <span>Story Sequence</span>
                            {!canUseContentType("story") && <Lock className="h-3 w-3 ml-2" />}
                          </div>
                        </SelectItem>
                        <SelectItem value="video_script" disabled={!canUseContentType("video_script")}>
                          <div className="flex items-center justify-between w-full">
                            <span>Video Script</span>
                            {!canUseContentType("video_script") && <Lock className="h-3 w-3 ml-2" />}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {!canUseContentType(contentType) && (
                      <p className="text-xs text-orange-500 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Upgrade to unlock this content type
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="platform" className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Platform
                      </Label>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger id="platform">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="twitter">X</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="pinterest">Pinterest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="length" className="flex items-center gap-2">
                        <FileType className="h-4 w-4" />
                        Length
                      </Label>
                      <Select value={length} onValueChange={setLength}>
                        <SelectTrigger id="length">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="long">Long</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Tone
                    </Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger id="tone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="humorous">Humorous</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords" className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Keywords (comma-separated)
                    </Label>
                    <Input
                      id="keywords"
                      placeholder="e.g., automation, analytics, scheduling"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Add relevant keywords to enhance content
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emojis" className="cursor-pointer flex items-center gap-2">
                        <Smile className="h-4 w-4" />
                        Include Emojis
                      </Label>
                      <Switch
                        id="emojis"
                        checked={includeEmojis}
                        onCheckedChange={setIncludeEmojis}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hashtags" className="cursor-pointer flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Include Hashtags
                      </Label>
                      <Switch
                        id="hashtags"
                        checked={includeHashtags}
                        onCheckedChange={setIncludeHashtags}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Crown className="h-4 w-4 text-primary" />
                    Your Plan Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {PLAN_FEATURES[userPlan as keyof typeof PLAN_FEATURES]?.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  {userPlan !== "agency" && (
                    <Link href="/settings/billing" className="block w-full mt-4">
                      <Button variant="default" className="w-full cursor-pointer">
                        <Zap className="h-4 w-4 mr-2" />
                        Upgrade for More Features
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>

              {/* AI Suggestions */}
              <AISuggestions 
                contentType={contentType}
                platform={platform}
                onApplySuggestion={(suggestion) => {
                  setPrompt(prev => prev + " " + suggestion)
                }}
              />

              {/* Advanced Settings Toggle */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    Advanced Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="advanced" className="cursor-pointer">Show Advanced Options</Label>
                    <Switch
                      id="advanced"
                      checked={showAdvanced}
                      onCheckedChange={setShowAdvanced}
                    />
                  </div>
                  {showAdvanced && (
                    <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                      <p>• Custom temperature control</p>
                      <p>• Token limit adjustment</p>
                      <p>• Model selection</p>
                      <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tips Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Pro Tips for Better Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex flex-col items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Be Specific</h4>
                  <p className="text-sm text-muted-foreground">
                    Include details about your product, service, or topic for more relevant content
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Hash className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Use Keywords</h4>
                  <p className="text-sm text-muted-foreground">
                    Add relevant keywords to help the AI understand your focus areas
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <FileType className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Choose Length</h4>
                  <p className="text-sm text-muted-foreground">
                    Select short for quick posts, medium for standard, or long for detailed content
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Save & Iterate</h4>
                  <p className="text-sm text-muted-foreground">
                    Save good results to history and regenerate to explore variations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Generation History
              </CardTitle>
              <CardDescription>
                View and reuse your previously generated content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <History className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No saved content yet. Generate and save content to see it here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <Card key={item.id} className="border">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.content.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {item.platform}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {item.tone}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {item.length}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium mb-1">
                                Prompt: {item.prompt}
                              </p>
                              {item.keywords && (
                                <p className="text-xs text-muted-foreground mb-2">
                                  Keywords: {item.keywords}
                                </p>
                              )}
                              <div className="bg-muted p-3 rounded text-sm max-h-32 overflow-y-auto whitespace-pre-wrap">
                                {item.content.substring(0, 200)}
                                {item.content.length > 200 && '...'}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => handleLoadFromHistory(item)}
                              >
                                <Wand2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => {
                                  navigator.clipboard.writeText(item.content)
                                  toast.success("Copied to clipboard!")
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => item.id && handleDeleteHistory(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {item.created_at && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.created_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Content Templates
              </CardTitle>
              <CardDescription>
                Professional templates to jumpstart your content creation. Click any template to load it instantly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { 
                    title: "Product Launch Announcement", 
                    prompt: "Create an exciting announcement for our new product launch, highlighting the key features, benefits, and special launch offer. Include a strong call-to-action to drive early adoption.", 
                    type: "caption",
                    icon: Rocket,
                    iconColor: "text-orange-600",
                    category: "Marketing",
                    platform: "instagram"
                  },
                  { 
                    title: "Behind the Scenes Story", 
                    prompt: "Share an authentic behind-the-scenes look at our team's daily work, showcasing our company culture, values, and the people who make it all happen.", 
                    type: "story",
                    icon: Video,
                    iconColor: "text-gray-600",
                    category: "Brand",
                    platform: "instagram"
                  },
                  { 
                    title: "Customer Success Story", 
                    prompt: "Feature a compelling customer testimonial that showcases how our product/service solved their problem, improved their business, and delivered measurable results.", 
                    type: "post_idea",
                    icon: Star,
                    iconColor: "text-yellow-600",
                    category: "Social Proof",
                    platform: "linkedin"
                  },
                  { 
                    title: "Educational Thread", 
                    prompt: "Create an informative thread sharing 7 actionable tips for social media success, including best practices, common mistakes to avoid, and pro strategies.", 
                    type: "thread",
                    icon: BookText,
                    iconColor: "text-blue-600",
                    category: "Education",
                    platform: "twitter"
                  },
                  { 
                    title: "Industry Insights", 
                    prompt: "Share expert commentary on the latest industry trends, news, or developments, positioning our brand as a thought leader in the space.", 
                    type: "caption",
                    icon: TrendingUp,
                    iconColor: "text-green-600",
                    category: "Thought Leadership",
                    platform: "linkedin"
                  },
                  { 
                    title: "Team Member Spotlight", 
                    prompt: "Introduce a team member with their role, background, fun facts, and what they love about working here. Make it personal and engaging.", 
                    type: "post_idea",
                    icon: Users,
                    iconColor: "text-indigo-600",
                    category: "Culture",
                    platform: "linkedin"
                  },
                  { 
                    title: "How-To Tutorial", 
                    prompt: "Create a step-by-step tutorial showing how to use our product/service to achieve a specific goal. Make it clear, actionable, and beginner-friendly.", 
                    type: "video_script",
                    icon: GraduationCap,
                    iconColor: "text-cyan-600",
                    category: "Education",
                    platform: "youtube"
                  },
                  { 
                    title: "User-Generated Content", 
                    prompt: "Craft a post featuring and celebrating content created by our community, encouraging more users to share their experiences with our brand.", 
                    type: "caption",
                    icon: Camera,
                    iconColor: "text-pink-600",
                    category: "Community",
                    platform: "instagram"
                  },
                  { 
                    title: "Limited-Time Offer", 
                    prompt: "Announce a special limited-time promotion or discount with urgency, clear value proposition, and easy-to-follow redemption instructions.", 
                    type: "caption",
                    icon: Gift,
                    iconColor: "text-red-600",
                    category: "Sales",
                    platform: "facebook"
                  },
                  { 
                    title: "Motivational Quote", 
                    prompt: "Share an inspiring quote relevant to our industry or audience, with context on why it matters and how it applies to their journey.", 
                    type: "caption",
                    icon: Quote,
                    iconColor: "text-gray-600",
                    category: "Inspiration",
                    platform: "instagram"
                  },
                  { 
                    title: "Poll & Engagement", 
                    prompt: "Create an engaging poll or question to spark conversation, gather audience insights, and boost engagement with our community.", 
                    type: "caption",
                    icon: PieChart,
                    iconColor: "text-teal-600",
                    category: "Engagement",
                    platform: "twitter"
                  },
                  { 
                    title: "Milestone Celebration", 
                    prompt: "Celebrate a company milestone, achievement, or anniversary with gratitude to our community and a look forward to what's next.", 
                    type: "caption",
                    icon: PartyPopper,
                    iconColor: "text-amber-600",
                    category: "Brand",
                    platform: "linkedin"
                  },
                  { 
                    title: "Problem-Solution Post", 
                    prompt: "Address a common pain point our audience faces, explain why it matters, and present our solution as the answer they've been looking for.", 
                    type: "post_idea",
                    icon: Wrench,
                    iconColor: "text-slate-600",
                    category: "Marketing",
                    platform: "linkedin"
                  },
                  { 
                    title: "Weekly Recap", 
                    prompt: "Summarize the week's highlights, top content, important updates, and what's coming next week to keep our audience informed and engaged.", 
                    type: "thread",
                    icon: CalendarDays,
                    iconColor: "text-emerald-600",
                    category: "Updates",
                    platform: "twitter"
                  },
                  { 
                    title: "FAQ Explainer", 
                    prompt: "Answer the most frequently asked questions about our product/service in a clear, helpful, and comprehensive way.", 
                    type: "post_idea",
                    icon: HelpCircle,
                    iconColor: "text-sky-600",
                    category: "Support",
                    platform: "facebook"
                  },
                  { 
                    title: "Seasonal Campaign", 
                    prompt: "Create seasonal content tied to current holidays, events, or trends, connecting our brand to what's happening now in a relevant way.", 
                    type: "caption",
                    icon: Leaf,
                    iconColor: "text-lime-600",
                    category: "Seasonal",
                    platform: "instagram"
                  },
                  { 
                    title: "Before & After", 
                    prompt: "Showcase a transformation or improvement achieved using our product/service, with compelling visuals and measurable results.", 
                    type: "post_idea",
                    icon: ArrowLeftRight,
                    iconColor: "text-fuchsia-600",
                    category: "Social Proof",
                    platform: "instagram"
                  },
                  { 
                    title: "Live Event Promotion", 
                    prompt: "Promote an upcoming webinar, workshop, or live event with key details, speaker highlights, and registration information.", 
                    type: "caption",
                    icon: Mic,
                    iconColor: "text-rose-600",
                    category: "Events",
                    platform: "linkedin"
                  }
                ].map((template, index) => {
                  const isLocked = !canUseContentType(template.type)
                  const IconComponent = template.icon
                  return (
                    <Card 
                      key={index} 
                      className={`cursor-pointer transition-all ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-primary hover:shadow-md'}`}
                      onClick={() => {
                        if (isLocked) {
                          toast.error(`${template.type.replace('_', ' ')} is not available in your plan. Upgrade to unlock!`)
                          return
                        }
                        setPrompt(template.prompt)
                        setContentType(template.type)
                        setPlatform(template.platform)
                        toast.success("Template loaded! Ready to generate.")
                      }}
                    >
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <IconComponent className={`h-6 w-6 ${template.iconColor}`} />
                          {isLocked && (
                            <div className="flex items-center gap-1">
                              <Lock className="h-4 w-4 text-muted-foreground" />
                              <Badge variant="outline" className="text-xs">Locked</Badge>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1 text-sm">{template.title}</h4>
                          {isLocked ? (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">
                                This template is available in higher plans. Upgrade to unlock professional templates.
                              </p>
                              <Link href="/settings/billing" onClick={(e) => e.stopPropagation()} className="block w-full">
                                <Button variant="outline" size="sm" className="w-full cursor-pointer">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Upgrade Plan
                                </Button>
                              </Link>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground line-clamp-3">{template.prompt}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {template.type.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {template.platform}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}



