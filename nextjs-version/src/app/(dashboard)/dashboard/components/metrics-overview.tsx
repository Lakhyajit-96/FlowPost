"use client"

import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2 
} from "lucide-react"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const metrics = [
  {
    title: "Total Followers",
    value: "24,567",
    description: "Across all platforms",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    footer: "Growing steadily",
    subfooter: "Across all platforms this month"
  },
  {
    title: "Engagement Rate",
    value: "8.4%",
    description: "Average engagement",
    change: "+2.1%", 
    trend: "up",
    icon: Heart,
    footer: "Above industry average",
    subfooter: "Likes, comments, and shares"
  },
  {
    title: "Posts This Month",
    value: "156",
    description: "Published content",
    change: "+18%",
    trend: "up", 
    icon: MessageCircle,
    footer: "Consistent posting schedule",
    subfooter: "Meeting content goals"
  },
  {
    title: "Total Reach",
    value: "1.2M",
    description: "Monthly impressions",
    change: "+24%",
    trend: "up",
    icon: Share2,
    footer: "Expanding audience reach",
    subfooter: "Impressions this month"
  },
]

export function MetricsOverview() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
      {metrics.map((metric) => {
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
        
        return (
          <Card key={metric.title} className=" cursor-pointer">
            <CardHeader>
              <CardDescription>{metric.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {metric.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendIcon className="h-4 w-4" />
                  {metric.change}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {metric.footer} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                {metric.subfooter}
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
