"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Copy, Check } from "lucide-react"
import { toast } from "sonner"

interface ContentVariationsProps {
  baseContent: string
  onSelectVariation: (content: string) => void
}

export function ContentVariations({ baseContent, onSelectVariation }: ContentVariationsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  if (!baseContent) return null

  // Generate simple variations (in real app, this would call AI API)
  const variations = [
    {
      title: "Shorter Version",
      content: baseContent.substring(0, Math.floor(baseContent.length * 0.6)) + "...",
      badge: "Concise"
    },
    {
      title: "With More Emojis",
      content: baseContent.replace(/\./g, ". ✨").replace(/!/g, "! 🚀"),
      badge: "Engaging"
    },
    {
      title: "Question Format",
      content: "Did you know? " + baseContent + "\n\nWhat do you think? 🤔",
      badge: "Interactive"
    }
  ]

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content)
    setCopiedIndex(index)
    toast.success("Variation copied!")
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-primary" />
          Content Variations
        </CardTitle>
        <CardDescription>Alternative versions of your content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {variations.map((variation, index) => (
          <div key={index} className="p-3 rounded-lg border space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{variation.title}</span>
                <Badge variant="secondary" className="text-xs">{variation.badge}</Badge>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer h-8 w-8 p-0"
                  onClick={() => handleCopy(variation.content, index)}
                >
                  {copiedIndex === index ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => {
                    onSelectVariation(variation.content)
                    toast.success("Variation selected!")
                  }}
                >
                  Use
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {variation.content}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
