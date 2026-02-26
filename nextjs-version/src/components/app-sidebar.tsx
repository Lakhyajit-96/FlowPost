"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Sparkles,
  ListChecks,
  MessageSquare,
  Calendar,
  Settings,
  Users,
  BarChart3,
  Instagram,
  Facebook,
  Linkedin,
  Share2,
  Youtube,
} from "lucide-react"
import { XIcon } from "@/components/icons/x-icon"
import { PinterestIcon } from "@/components/icons/pinterest-icon"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { useUser } from "@clerk/nextjs"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navGroups: [
    {
      label: "Overview",
      items: [
        {
          title: "Analytics",
          url: "/dashboard",
          icon: BarChart3,
        },
      ],
    },
    {
      label: "Content",
      items: [
        {
          title: "AI Content Generator",
          url: "/mail",
          icon: Sparkles,
        },
        {
          title: "Post Queue",
          url: "/tasks",
          icon: ListChecks,
        },
        {
          title: "Content Calendar",
          url: "/calendar",
          icon: Calendar,
        },
      ],
    },
    {
      label: "Engagement",
      items: [
        {
          title: "Social Inbox",
          url: "/chat",
          icon: MessageSquare,
        },
      ],
    },
    {
      label: "Management",
      items: [
        {
          title: "Connected Accounts",
          url: "/settings/connections",
          icon: Share2,
          items: [
            {
              title: "Instagram",
              url: "/settings/connections?platform=instagram",
              icon: Instagram,
            },
            {
              title: "Facebook",
              url: "/settings/connections?platform=facebook",
              icon: Facebook,
            },
            {
              title: "X",
              url: "/settings/connections?platform=twitter",
              icon: XIcon,
            },
            {
              title: "LinkedIn",
              url: "/settings/connections?platform=linkedin",
              icon: Linkedin,
            },
            {
              title: "YouTube",
              url: "/settings/connections?platform=youtube",
              icon: Youtube,
            },
            {
              title: "Pinterest",
              url: "/settings/connections?platform=pinterest",
              icon: PinterestIcon,
            },
          ],
        },
        {
          title: "Team Members",
          url: "/users",
          icon: Users,
        },
        {
          title: "Appearance",
          url: "/settings/appearance",
          icon: Settings,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  
  const userData = {
    name: user?.fullName || user?.firstName || "User",
    email: user?.primaryEmailAddress?.emailAddress || "",
    avatar: user?.imageUrl || "",
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Logo size={24} className="text-current" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">FlowPost</span>
                  <span className="truncate text-xs">Social Media Manager</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
