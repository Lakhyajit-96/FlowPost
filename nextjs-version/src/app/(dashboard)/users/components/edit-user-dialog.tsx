"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { TeamMember } from "../page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const editUserFormSchema = z.object({
  role: z.string().min(1, {
    message: "Please select a role.",
  }),
  is_active: z.boolean(),
  permissions: z.object({
    canManageTeam: z.boolean(),
    canManagePosts: z.boolean(),
    canManageAnalytics: z.boolean(),
    canManageSettings: z.boolean(),
  }),
})

type EditUserFormValues = z.infer<typeof editUserFormSchema>

interface EditUserDialogProps {
  user: TeamMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (userId: string, data: EditUserFormValues) => Promise<void>
}

export function EditUserDialog({ user, open, onOpenChange, onSave }: EditUserDialogProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      role: "",
      is_active: true,
      permissions: {
        canManageTeam: false,
        canManagePosts: false,
        canManageAnalytics: false,
        canManageSettings: false,
      },
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        role: user.role,
        is_active: user.is_active,
        permissions: {
          canManageTeam: false,
          canManagePosts: true,
          canManageAnalytics: true,
          canManageSettings: false,
        },
      })
    }
  }, [user, form])

  async function onSubmit(data: EditUserFormValues) {
    if (!user) return
    
    setLoading(true)
    try {
      await onSave(user.id, data)
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold">Edit Team Member</DialogTitle>
          <DialogDescription className="text-sm">
            Update role, permissions, and status for this team member.
          </DialogDescription>
        </DialogHeader>

        {/* User Info Header */}
        <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
          <Avatar className="h-14 w-14 border-2 border-background shadow-md">
            {user.avatar && user.avatar.startsWith('http') ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : null}
            <AvatarFallback className="text-base font-bold bg-primary/20">
              {user.avatar && !user.avatar.startsWith('http') ? user.avatar : user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base mb-0.5 truncate">{user.name}</h3>
            <p className="text-xs text-muted-foreground mb-2 truncate">{user.email}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-2 py-0.5">{user.plan}</Badge>
              <Badge 
                variant={user.status === 'Active' ? 'default' : 'secondary'}
                className="text-xs px-2 py-0.5"
              >
                {user.status}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="my-3" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">Role Assignment</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="cursor-pointer w-full h-10 text-sm">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="owner" className="py-2 cursor-pointer">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">Owner</span>
                          <span className="text-xs text-muted-foreground">Full access to everything</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin" className="py-2 cursor-pointer">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">Admin</span>
                          <span className="text-xs text-muted-foreground">Can manage team and settings</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="editor" className="py-2 cursor-pointer">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">Editor</span>
                          <span className="text-xs text-muted-foreground">Can create and edit content</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="viewer" className="py-2 cursor-pointer">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">Viewer</span>
                          <span className="text-xs text-muted-foreground">Read-only access</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    The role determines what this team member can do in FlowPost.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Status */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-muted/30">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">Active Status</FormLabel>
                    <FormDescription className="text-xs">
                      Inactive members cannot access the platform.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Permissions Section */}
            <div className="space-y-3">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Permissions</h4>
                <p className="text-xs text-muted-foreground">
                  Fine-tune what this team member can access and manage.
                </p>
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="permissions.canManageTeam"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2.5 bg-background hover:bg-muted/30 transition-colors">
                      <div className="space-y-0.5 flex-1">
                        <FormLabel className="text-sm font-medium cursor-pointer">Manage Team</FormLabel>
                        <FormDescription className="text-xs">
                          Add, edit, and remove team members
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.canManagePosts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2.5 bg-background hover:bg-muted/30 transition-colors">
                      <div className="space-y-0.5 flex-1">
                        <FormLabel className="text-sm font-medium cursor-pointer">Manage Posts</FormLabel>
                        <FormDescription className="text-xs">
                          Create, edit, and delete social media posts
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.canManageAnalytics"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2.5 bg-background hover:bg-muted/30 transition-colors">
                      <div className="space-y-0.5 flex-1">
                        <FormLabel className="text-sm font-medium cursor-pointer">View Analytics</FormLabel>
                        <FormDescription className="text-xs">
                          Access analytics and performance reports
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions.canManageSettings"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2.5 bg-background hover:bg-muted/30 transition-colors">
                      <div className="space-y-0.5 flex-1">
                        <FormLabel className="text-sm font-medium cursor-pointer">Manage Settings</FormLabel>
                        <FormDescription className="text-xs">
                          Change account and billing settings
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-3" />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="cursor-pointer h-9 px-4 text-sm"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="cursor-pointer h-9 px-4 text-sm" 
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
