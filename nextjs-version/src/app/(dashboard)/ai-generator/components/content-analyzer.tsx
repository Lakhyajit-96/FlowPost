"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Target, MessageSquare } from "lucide-react"

interface ContentAnalyzerProps {
  content: string
}

export function ContentAnalyzer({ content }: ContentAnalyzerProps) {
  if (!content) return null

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length
  const charCount = content.length
  const hashtagCount = (content.match(/#\w+/g) || []).length
  const emojiCount = (content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length
  const readingTime = Math.ceil(wordCount / 200)
  
  const engagementScore = Math.min(100, Math.round(
    (hashtagCount * 10) + 
    (emojiCount * 5) + 
    (wordCount > 50 && wordCount < 300 ? 30 : 10) +
    (content.includes('?') ? 10 : 0) +
    (content.includes('!') ? 5 : 0)
  ))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          Content Analysis
        </CardTitle>
        <CardDescription>Real-time content metrics and insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Words</p>
            <p className="text-2xl font-bold">{wordCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Characters</p>
            <p className="text-2xl font-bold">{charCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Hashtags</p>
            <p className="text-2xl font-bold">{hashtagCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Emojis</p>
            <p className="text-2xl font-bold">{emojiCount}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Engagement Score
            </span>
            <span className="text-sm font-bold">{engagementScore}%</span>
          </div>
          <Progress value={engagementScore} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {engagementScore >= 70 ? "Excellent!" : engagementScore >= 50 ? "Good" : "Could be improved"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            {readingTime} min read
          </Badge>
          {wordCount > 50 && wordCount < 300 && (
            <Badge variant="secondary" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              Optimal length
            </Badge>
          )}
          {hashtagCount >= 3 && (
            <Badge variant="secondary" className="text-xs">
              Good hashtag use
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
