"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Social media engagement over time"

const chartData = [
  { date: "2024-04-01", likes: 1850, comments: 420, shares: 180 },
  { date: "2024-04-02", likes: 1620, comments: 380, shares: 165 },
  { date: "2024-04-03", likes: 1890, comments: 445, shares: 195 },
  { date: "2024-04-04", likes: 2240, comments: 520, shares: 230 },
  { date: "2024-04-05", likes: 2580, comments: 610, shares: 275 },
  { date: "2024-04-06", likes: 2350, comments: 560, shares: 245 },
  { date: "2024-04-07", likes: 1980, comments: 465, shares: 205 },
  { date: "2024-04-08", likes: 2680, comments: 635, shares: 290 },
  { date: "2024-04-09", likes: 1450, comments: 340, shares: 150 },
  { date: "2024-04-10", likes: 2120, comments: 495, shares: 220 },
  { date: "2024-04-11", likes: 2890, comments: 680, shares: 310 },
  { date: "2024-04-12", likes: 2450, comments: 575, shares: 260 },
  { date: "2024-04-13", likes: 2980, comments: 705, shares: 325 },
  { date: "2024-04-14", likes: 1850, comments: 435, shares: 195 },
  { date: "2024-04-15", likes: 1720, comments: 405, shares: 180 },
  { date: "2024-04-16", likes: 1890, comments: 445, shares: 200 },
  { date: "2024-04-17", likes: 3250, comments: 765, shares: 350 },
  { date: "2024-04-18", likes: 3120, comments: 735, shares: 335 },
  { date: "2024-04-19", likes: 2180, comments: 515, shares: 235 },
  { date: "2024-04-20", likes: 1650, comments: 390, shares: 175 },
  { date: "2024-04-21", likes: 1890, comments: 445, shares: 200 },
  { date: "2024-04-22", likes: 2050, comments: 485, shares: 220 },
  { date: "2024-04-23", likes: 2180, comments: 515, shares: 235 },
  { date: "2024-04-24", likes: 2850, comments: 670, shares: 305 },
  { date: "2024-04-25", likes: 2350, comments: 555, shares: 250 },
  { date: "2024-04-26", likes: 1580, comments: 370, shares: 165 },
  { date: "2024-04-27", likes: 3450, comments: 815, shares: 370 },
  { date: "2024-04-28", likes: 1920, comments: 450, shares: 205 },
  { date: "2024-04-29", likes: 2650, comments: 625, shares: 285 },
  { date: "2024-04-30", likes: 3580, comments: 845, shares: 385 },
  { date: "2024-05-01", likes: 2150, comments: 505, shares: 230 },
  { date: "2024-05-02", likes: 2850, comments: 670, shares: 305 },
  { date: "2024-05-03", likes: 2280, comments: 535, shares: 245 },
  { date: "2024-05-04", likes: 3420, comments: 805, shares: 365 },
  { date: "2024-05-05", likes: 3850, comments: 905, shares: 410 },
  { date: "2024-05-06", likes: 4250, comments: 1000, shares: 455 },
  { date: "2024-05-07", likes: 2980, comments: 700, shares: 320 },
  { date: "2024-05-08", likes: 2050, comments: 480, shares: 220 },
  { date: "2024-05-09", likes: 2180, comments: 515, shares: 235 },
  { date: "2024-05-10", likes: 2950, comments: 695, shares: 315 },
  { date: "2024-05-11", likes: 2750, comments: 645, shares: 295 },
  { date: "2024-05-12", likes: 2350, comments: 555, shares: 250 },
  { date: "2024-05-13", likes: 1980, comments: 465, shares: 210 },
  { date: "2024-05-14", likes: 4150, comments: 975, shares: 445 },
  { date: "2024-05-15", likes: 3680, comments: 865, shares: 395 },
  { date: "2024-05-16", likes: 3250, comments: 765, shares: 350 },
  { date: "2024-05-17", likes: 4050, comments: 950, shares: 435 },
  { date: "2024-05-18", likes: 3150, comments: 740, shares: 340 },
  { date: "2024-05-19", likes: 2280, comments: 535, shares: 245 },
  { date: "2024-05-20", likes: 2150, comments: 505, shares: 230 },
  { date: "2024-05-21", likes: 1650, comments: 390, shares: 175 },
  { date: "2024-05-22", likes: 1580, comments: 370, shares: 170 },
  { date: "2024-05-23", likes: 2680, comments: 630, shares: 290 },
  { date: "2024-05-24", likes: 2450, comments: 575, shares: 260 },
  { date: "2024-05-25", likes: 2350, comments: 555, shares: 250 },
  { date: "2024-05-26", likes: 2050, comments: 480, shares: 220 },
  { date: "2024-05-27", likes: 4180, comments: 985, shares: 450 },
  { date: "2024-05-28", likes: 2280, comments: 535, shares: 245 },
  { date: "2024-05-29", likes: 1650, comments: 390, shares: 175 },
  { date: "2024-05-30", likes: 2950, comments: 695, shares: 315 },
  { date: "2024-05-31", likes: 2180, comments: 515, shares: 235 },
  { date: "2024-06-01", likes: 2150, comments: 505, shares: 230 },
  { date: "2024-06-02", likes: 3980, comments: 935, shares: 425 },
  { date: "2024-06-03", likes: 1850, comments: 435, shares: 195 },
  { date: "2024-06-04", likes: 3650, comments: 860, shares: 390 },
  { date: "2024-06-05", likes: 1680, comments: 395, shares: 180 },
  { date: "2024-06-06", likes: 2650, comments: 625, shares: 285 },
  { date: "2024-06-07", likes: 3150, comments: 740, shares: 340 },
  { date: "2024-06-08", likes: 3250, comments: 765, shares: 350 },
  { date: "2024-06-09", likes: 4350, comments: 1025, shares: 465 },
  { date: "2024-06-10", likes: 2150, comments: 505, shares: 230 },
  { date: "2024-06-11", likes: 1750, comments: 410, shares: 185 },
  { date: "2024-06-12", likes: 4050, comments: 950, shares: 435 },
  { date: "2024-06-13", likes: 1650, comments: 390, shares: 175 },
  { date: "2024-06-14", likes: 3750, comments: 880, shares: 400 },
  { date: "2024-06-15", likes: 3250, comments: 765, shares: 350 },
  { date: "2024-06-16", likes: 3150, comments: 740, shares: 340 },
  { date: "2024-06-17", likes: 4550, comments: 1070, shares: 485 },
  { date: "2024-06-18", likes: 1950, comments: 460, shares: 210 },
  { date: "2024-06-19", likes: 2950, comments: 695, shares: 315 },
  { date: "2024-06-20", likes: 4150, comments: 975, shares: 445 },
  { date: "2024-06-21", likes: 2250, comments: 530, shares: 240 },
  { date: "2024-06-22", likes: 2850, comments: 670, shares: 305 },
  { date: "2024-06-23", likes: 4650, comments: 1095, shares: 495 },
  { date: "2024-06-24", likes: 2050, comments: 480, shares: 220 },
  { date: "2024-06-25", likes: 2150, comments: 505, shares: 230 },
  { date: "2024-06-26", likes: 3650, comments: 860, shares: 390 },
  { date: "2024-06-27", likes: 4350, comments: 1025, shares: 465 },
  { date: "2024-06-28", likes: 2150, comments: 505, shares: 230 },
  { date: "2024-06-29", likes: 1850, comments: 435, shares: 195 },
  { date: "2024-06-30", likes: 3950, comments: 930, shares: 425 },
]

const chartConfig = {
  engagement: {
    label: "Engagement",
  },
  likes: {
    label: "Likes",
    color: "hsl(var(--chart-1))",
  },
  comments: {
    label: "Comments",
    color: "hsl(var(--chart-2))",
  },
  shares: {
    label: "Shares",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Engagement Overview</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total engagement across all platforms
          </span>
          <span className="@[540px]/card:hidden">All platforms</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillLikes" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-likes)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-likes)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillComments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-comments)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-comments)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillShares" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-shares)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-shares)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value as string | number | Date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="shares"
              type="natural"
              fill="url(#fillShares)"
              stroke="var(--color-shares)"
              stackId="a"
            />
            <Area
              dataKey="comments"
              type="natural"
              fill="url(#fillComments)"
              stroke="var(--color-comments)"
              stackId="a"
            />
            <Area
              dataKey="likes"
              type="natural"
              fill="url(#fillLikes)"
              stroke="var(--color-likes)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
