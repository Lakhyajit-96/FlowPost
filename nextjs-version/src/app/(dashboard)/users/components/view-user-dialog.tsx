"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TeamMember } from "../page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Mail, 
  Calendar, 
  Clock, 
  Shield, 
  CheckCircle2, 
  XCircle,
  User,
  CreditCard
} from "lucide-react"

interface ViewUserDialogProps {
  user: TeamMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewUserDialog({ user, open, onOpenChange }: ViewUserDialogProps) {
  if (!user) return null

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
      case "admin":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
      case "editor":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      case "viewer":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-xl font-bold">Team Member Details</DialogTitle>
          <DialogDescription className="text-sm">
            Complete profile and activity information
          </DialogDescription>
        </DialogHeader>

        {/* User Profile Header */}
        <Card className="border">
          <CardContent className="pt-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                {user.avatar && user.avatar.startsWith('http') ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="text-lg font-medium">
                  {user.avatar && !user.avatar.startsWith('http') ? user.avatar : user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold mb-1 truncate">{user.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className={getRoleBadgeColor(user.role) + " text-xs px-2 py-0.5"}>
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    <CreditCard className="h-3 w-3 mr-1" />
                    {user.plan}
                  </Badge>
                  <Badge 
                    variant={user.status === 'Active' ? 'default' : 'secondary'}
                    className={(user.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : '') + " text-xs px-2 py-0.5"}
                  >
                    {user.status === 'Active' ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-3" />

        {/* Account Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Account Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Member ID</p>
                    <p className="font-mono text-xs truncate">{user.member_id.substring(0, 12)}...</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-xs font-medium truncate">{formatDate(user.created_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Invited At</p>
                    <p className="text-xs font-medium truncate">{formatDate(user.invited_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Accepted At</p>
                    <p className="text-xs font-medium truncate">{formatDate(user.accepted_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-3" />

        {/* Role & Permissions */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Role & Permissions
          </h4>
          
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Role</span>
                  <Badge variant="secondary" className={getRoleBadgeColor(user.role) + " text-xs px-2 py-0.5"}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-1.5 text-xs">
                  <p className="text-muted-foreground leading-relaxed">
                    {user.role === 'owner' && 'Full access to all features and settings. Can manage team members and billing.'}
                    {user.role === 'admin' && 'Can manage team members, posts, and most settings. Cannot access billing.'}
                    {user.role === 'editor' && 'Can create, edit, and publish content. Limited access to settings.'}
                    {user.role === 'viewer' && 'Read-only access. Can view content and analytics but cannot make changes.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-3" />

        {/* Activity Summary */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Activity Summary
          </h4>
          
          <div className="grid grid-cols-3 gap-2.5">
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-xl font-bold text-primary">0</p>
                <p className="text-xs text-muted-foreground mt-1">Posts Created</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-xl font-bold text-primary">0</p>
                <p className="text-xs text-muted-foreground mt-1">Comments</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-xl font-bold text-primary">0</p>
                <p className="text-xs text-muted-foreground mt-1">Edits Made</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
