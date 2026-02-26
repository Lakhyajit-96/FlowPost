"use client"

import { Eye, MoreHorizontal, Instagram, Facebook, Twitter, Linkedin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

const platformIcons = {
  Instagram,
  Facebook,
  Twitter,
  LinkedIn: Linkedin,
}

const recentPosts = [
  {
    id: "POST-001",
    content: "🚀 Excited to announce our new product launch!",
    platform: "Instagram",
    engagement: "1.2K",
    status: "published",
    date: "2 hours ago",
  },
  {
    id: "POST-002",
    content: "Behind the scenes: How we built our latest feature",
    platform: "LinkedIn",
    engagement: "892",
    status: "published",
    date: "5 hours ago",
  },
  {
    id: "POST-003",
    content: "Monday motivation: Your only limit is you",
    platform: "Twitter",
    engagement: "456",
    status: "published",
    date: "1 day ago",
  },
  {
    id: "POST-004",
    content: "New blog post: 10 Tips for Growing Your Social Media",
    platform: "Facebook",
    engagement: "234",
    status: "scheduled",
    date: "Tomorrow",
  },
  {
    id: "POST-005",
    content: "Customer spotlight: Meet Sarah, who grew 300%!",
    platform: "Instagram",
    engagement: "1.8K",
    status: "published",
    date: "2 days ago",
  },
]

export function RecentTransactions() {
  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Latest published content</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer" asChild>
          <Link href="/tasks">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentPosts.map((post) => {
          const PlatformIcon = platformIcons[post.platform as keyof typeof platformIcons]
          
          return (
            <div key={post.id}>
              <div className="flex p-3 rounded-lg border gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <PlatformIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-1 items-center flex-wrap justify-between gap-1">
                  <div className="flex items-center space-x-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{post.content}</p>
                      <p className="text-xs text-muted-foreground">{post.platform}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={post.status === "published" ? "default" : "secondary"}
                      className="cursor-pointer"
                    >
                      {post.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">{post.engagement}</p>
                      <p className="text-xs text-muted-foreground">{post.date}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Edit Post</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">View Analytics</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
