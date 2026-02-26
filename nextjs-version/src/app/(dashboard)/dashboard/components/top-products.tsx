"use client"

import { Eye, Heart, TrendingUp, Instagram, Facebook, Twitter, Linkedin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

const platformIcons = {
  Instagram,
  Facebook,
  Twitter,
  LinkedIn: Linkedin,
}

const topPosts = [
  {
    id: 1,
    content: "Customer spotlight: Meet Sarah, who grew 300%!",
    platform: "Instagram",
    engagement: 2847,
    reach: "28.9K",
    growth: "+45%",
    engagementRate: 9.8,
    likes: 1834,
  },
  {
    id: 2,
    content: "Behind the scenes: How we built our latest feature",
    platform: "LinkedIn",
    engagement: 1923,
    reach: "19.2K",
    growth: "+38%",
    engagementRate: 10.0,
    likes: 892,
  },
  {
    id: 3,
    content: "🚀 Excited to announce our new product launch!",
    platform: "Instagram",
    engagement: 1456,
    reach: "15.4K",
    growth: "+32%",
    engagementRate: 9.5,
    likes: 1247,
  },
  {
    id: 4,
    content: "Quick tip: The best time to post on Instagram",
    platform: "Twitter",
    engagement: 892,
    reach: "11.2K",
    growth: "+28%",
    engagementRate: 8.0,
    likes: 678,
  },
  {
    id: 5,
    content: "Throwback Thursday: Remember when we started?",
    platform: "Instagram",
    engagement: 3421,
    reach: "34.2K",
    growth: "+52%",
    engagementRate: 10.0,
    likes: 2145,
  },
]

export function TopProducts() {
  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>Highest engagement this month</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer" asChild>
          <Link href="/tasks">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {topPosts.map((post, index) => {
          const PlatformIcon = platformIcons[post.platform as keyof typeof platformIcons]
          
          return (
            <div key={post.id} className="flex items-center p-3 rounded-lg border gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                #{index + 1}
              </div>
              <div className="flex gap-2 items-center justify-between space-x-3 flex-1 flex-wrap">
                <div className="">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium truncate">{post.content}</p>
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <PlatformIcon className="h-3 w-3" />
                      {post.platform}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 fill-red-400 text-red-400" />
                      <span className="text-xs text-muted-foreground">{post.likes.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{post.engagement.toLocaleString()} total</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{post.reach}</p>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200 cursor-pointer"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {post.growth}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Rate: {post.engagementRate}%</span>
                    <Progress
                      value={post.engagementRate * 10}
                      className="w-12 h-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
