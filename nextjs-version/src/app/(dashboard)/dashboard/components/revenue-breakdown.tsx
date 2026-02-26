"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const platformData = [
  { platform: "instagram", value: 40, engagement: 18500, fill: "var(--color-instagram)" },
  { platform: "facebook", value: 25, engagement: 11600, fill: "var(--color-facebook)" },
  { platform: "twitter", value: 20, engagement: 9300, fill: "var(--color-twitter)" },
  { platform: "linkedin", value: 15, engagement: 6950, fill: "var(--color-linkedin)" },
]

const chartConfig = {
  engagement: {
    label: "Engagement",
  },
  total: {
    label: "Total",
  },
  instagram: {
    label: "Instagram",
    color: "hsl(330 81% 60%)",
  },
  facebook: {
    label: "Facebook",
    color: "hsl(221 83% 53%)",
  },
  twitter: {
    label: "Twitter",
    color: "hsl(203 89% 53%)",
  },
  linkedin: {
    label: "LinkedIn",
    color: "hsl(201 100% 35%)",
  },
}

export function RevenueBreakdown() {
  const id = "platform-distribution"
  const [activePlatform, setActivePlatform] = React.useState("instagram")

  const activeIndex = React.useMemo(() => {
    const index = platformData.findIndex((item) => item.platform === activePlatform)
    return index === -1 ? 0 : index
  }, [activePlatform])

  const platforms = React.useMemo(() => platformData.map((item) => item.platform), [])

  return (
    <Card data-chart={id} className="flex flex-col cursor-pointer">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-2">
        <div>
          <CardTitle>Platform Distribution</CardTitle>
          <CardDescription>Engagement across platforms</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={activePlatform} onValueChange={setActivePlatform}>
            <SelectTrigger
              className="w-[175px] rounded-lg cursor-pointer"
              aria-label="Select a platform"
            >
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-lg">
              {platforms.map((key) => {
                const config = chartConfig[key as keyof typeof chartConfig]

                if (!config) {
                  return null
                }

                return (
                  <SelectItem
                    key={key}
                    value={key}
                    className="rounded-md [&_span]:flex cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-3 w-3 shrink-0 rounded-sm"
                        style={{
                          backgroundColor: `var(--color-${key})`,
                        }}
                      />
                      {config?.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <Button variant="outline" className="cursor-pointer">
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <div className="flex justify-center">
            <ChartContainer
              id={id}
              config={chartConfig}
              className="mx-auto aspect-square w-full max-w-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={platformData}
                  dataKey="engagement"
                  nameKey="platform"
                  innerRadius={60}
                  strokeWidth={5}
                  activeIndex={activeIndex}
                  activeShape={({
                    outerRadius = 0,
                    ...props
                  }: PieSectorDataItem) => (
                    <g>
                      <Sector {...props} outerRadius={outerRadius + 10} />
                      <Sector
                        {...props}
                        outerRadius={outerRadius + 25}
                        innerRadius={outerRadius + 12}
                      />
                    </g>
                  )}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {(platformData[activeIndex].engagement / 1000).toFixed(1)}K
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Engagement
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          <div className="flex flex-col justify-center space-y-4">
            {platformData.map((item, index) => {
              const config = chartConfig[item.platform as keyof typeof chartConfig]
              const isActive = index === activeIndex

              return (
                <div
                  key={item.platform}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                    isActive ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setActivePlatform(item.platform)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: `var(--color-${item.platform})`,
                      }}
                    />
                    <span className="font-medium">{config?.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{(item.engagement / 1000).toFixed(1)}K</div>
                    <div className="text-sm text-muted-foreground">{item.value}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
