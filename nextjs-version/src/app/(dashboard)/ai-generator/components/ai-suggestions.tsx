"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Lightbulb, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface AISuggestionsProps {
  contentType: string
  platform: string
  onApplySuggestion: (suggestion: string) => void
}

export function AISuggestions({ contentType, platform, onApplySuggestion }: AISuggestionsProps) {
  const suggestions = [
    {
      title: "Add Call-to-Action",
      description: "Include a clear CTA to boost engagement",
      prompt: "Add a compelling call-to-action that encourages users to take action",
      icon: Sparkles
    },
    {
      title: "Optimize for Platform",
      description: `Best practices for ${platform}`,
      prompt: `Optimize this content specifically for ${platform} audience and format`,
      icon: Brain
    },
    {
      title: "Add Storytelling",
      description: "Make it more engaging with a story",
      prompt: "Rewrite this with a compelling story or narrative arc",
      icon: Lightbulb
    },
    {
      title: "Include Statistics",
      description: "Add data to build credibility",
      prompt: "Add relevant statistics or data points to support the message",
      icon: Brain
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          AI Suggestions
        </CardTitle>
        <CardDescription>Smart recommendations to improve your content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon
          return (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border hover:border-primary/50 transition-colors">
              <div className="mt-0.5">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{suggestion.title}</p>
                <p className="text-xs text-muted-foreground">{suggestion.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => {
                  onApplySuggestion(suggestion.prompt)
                  toast.success("Suggestion applied to prompt!")
                }}
              >
                Apply
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
