"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Sparkles, Zap, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

export function UpgradeToProButton() {
  return (
    <div className="fixed z-50 bottom-8 right-4 md:right-6 lg:right-8 flex flex-col items-end gap-2">
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button
            size="lg"
            className="px-6 py-3 bg-gradient-to-br shadow-lg from-primary to-primary/60 text-primary-foreground font-bold cursor-pointer"
            style={{ minWidth: 180 }}
            asChild
          >
            <Link href="/settings/billing">
              Upgrade Plan
              <Sparkles size={20} className="ml-2" />
            </Link>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="mb-3 w-90 rounded-xl shadow-2xl bg-background border border-border p-4 animate-in fade-in slide-in-from-bottom-4 relative mr-4 md:mr-6 lg:mr-8">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 mb-2">
              <Sparkles className="size-12 text-primary mx-auto mb-2" />
            </div>
            <h3 className="font-bold text-lg flex items-center py-2 gap-2">
              <Zap size={18} className="text-primary" />
              Unlock More Power
              <Badge variant="default" className="text-xs px-2 py-0.5 rounded-full shadow">Pro</Badge>
            </h3>
            <p className="text-muted-foreground text-sm mb-2">
              Upgrade to Professional or Agency plan to unlock unlimited posts, advanced AI features, and team collaboration.
            </p>
            <div className="flex flex-col gap-2 w-full text-left text-sm mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <span>Unlimited scheduled posts</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <span>Advanced AI content generation</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-primary" />
                <span>Priority support & analytics</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full mt-2">
              <Link href="/settings/billing" className="w-full">
                <Button className="w-full flex items-center justify-center cursor-pointer gap-2" variant="default">
                  View Plans
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/pricing" className="w-full">
                <Button className="w-full flex items-center justify-center cursor-pointer" variant="outline">
                  Compare Features
                </Button>
              </Link>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
