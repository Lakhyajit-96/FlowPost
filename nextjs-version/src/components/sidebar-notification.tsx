"use client"

import * as React from "react"
import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export function SidebarNotification() {
  const [isVisible, setIsVisible] = React.useState(true)

  if (!isVisible) return null

  return (
    <Card className="mb-3 py-0 border-primary/20 bg-primary/5">
      <CardContent className="p-4 relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Close notification</span>
        </Button>
        
        <div className="pr-6">
          <h3 className="flex items-center gap-2 font-semibold mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Try AI Content Generator
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Create engaging posts in seconds with our AI-powered content generator.
          </p>
          <Button size="sm" className="w-full cursor-pointer" asChild>
            <Link href="/mail">
              Generate Content
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
