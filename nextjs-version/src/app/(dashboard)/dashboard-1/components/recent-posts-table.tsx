"use client"

import * as React from "react"
import { Instagram, Facebook, Twitter, Linkedin, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Post {
  id: number
  content: string
  platform: string
  status: string
  likes: number
  comments: number
  shares: number
  reach: number
  publishedAt: string | null
  performance: string
}

interface RecentPostsTableProps {
  data: Post[]
}

const platformIcons = {
  Instagram: Instagram,
  Facebook: Facebook,
  Twitter: Twitter,
  LinkedIn: Linkedin,
}

const platformColors = {
  Instagram: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
  Facebook: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Twitter: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  LinkedIn: "bg-blue-600/10 text-blue-800 dark:text-blue-300",
}

const statusColors = {
  Published: "default",
  Scheduled: "secondary",
  Draft: "outline",
}

const performanceConfig = {
  High: { icon: TrendingUp, color: "text-green-600 dark:text-green-400" },
  Medium: { icon: Minus, color: "text-yellow-600 dark:text-yellow-400" },
  Low: { icon: TrendingDown, color: "text-red-600 dark:text-red-400" },
  Pending: { icon: Minus, color: "text-muted-foreground" },
}

export function RecentPostsTable({ data }: RecentPostsTableProps) {
  // Show only the 10 most recent posts
  const recentPosts = data.slice(0, 10)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <Card>
      <CardHeader className="px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Your latest social media activity and performance</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/tasks">View All</a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 lg:px-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Content</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Engagement</TableHead>
                <TableHead className="text-right">Reach</TableHead>
                <TableHead className="text-center">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPosts.map((post) => {
                const PlatformIcon = platformIcons[post.platform as keyof typeof platformIcons]
                const PerformanceIcon = performanceConfig[post.performance as keyof typeof performanceConfig].icon
                const performanceColor = performanceConfig[post.performance as keyof typeof performanceConfig].color

                return (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none line-clamp-2">
                          {post.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(post.publishedAt)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${platformColors[post.platform as keyof typeof platformColors]}`}>
                        <PlatformIcon className="size-3" />
                        {post.platform}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[post.status as keyof typeof statusColors] as any}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {post.status === "Published" ? (
                        <div className="text-sm">
                          <div className="font-medium">{formatNumber(post.likes + post.comments + post.shares)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatNumber(post.likes)} ❤️ {formatNumber(post.comments)} 💬 {formatNumber(post.shares)} 🔄
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {post.status === "Published" ? (
                        <span className="text-sm font-medium">{formatNumber(post.reach)}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`inline-flex items-center gap-1 ${performanceColor}`}>
                        <PerformanceIcon className="size-4" />
                        <span className="text-xs font-medium">{post.performance}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
