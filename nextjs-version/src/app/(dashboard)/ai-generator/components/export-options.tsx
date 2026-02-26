"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, Share2 } from "lucide-react"
import { toast } from "sonner"

interface ExportOptionsProps {
  content: string
  metadata: {
    contentType: string
    platform: string
    tone: string
    length: string
  }
}

export function ExportOptions({ content, metadata }: ExportOptionsProps) {
  const exportAsText = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flowpost-content-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Content exported as text file!")
  }

  const exportAsJSON = () => {
    const data = {
      content,
      metadata,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flowpost-content-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Content exported as JSON!")
  }

  const shareContent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FlowPost Generated Content',
          text: content
        })
        toast.success("Content shared successfully!")
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error("Failed to share content")
        }
      }
    } else {
      navigator.clipboard.writeText(content)
      toast.success("Content copied to clipboard!")
    }
  }

  if (!content) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportAsText} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsJSON} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={shareContent} className="cursor-pointer">
          <Share2 className="h-4 w-4 mr-2" />
          Share Content
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
