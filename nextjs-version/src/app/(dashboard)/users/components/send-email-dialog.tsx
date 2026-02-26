"use client"

import { useState } from "react"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { TeamMember } from "../page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Send, Sparkles } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const sendEmailFormSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type SendEmailFormValues = z.infer<typeof sendEmailFormSchema>

interface SendEmailDialogProps {
  user: TeamMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSend: (email: string, subject: string, message: string, memberName: string) => Promise<void>
}

export function SendEmailDialog({ user, open, onOpenChange, onSend }: SendEmailDialogProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<SendEmailFormValues>({
    resolver: zodResolver(sendEmailFormSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  })

  async function onSubmit(data: SendEmailFormValues) {
    if (!user) return
    
    setLoading(true)
    try {
      await onSend(user.email, data.subject, data.message, user.name)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error sending email:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Send Email</DialogTitle>
              <DialogDescription className="text-xs">
                Compose and send a message to this team member
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Recipient Info Card */}
        <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-3">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
              {user.avatar && user.avatar.startsWith('http') ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : null}
              <AvatarFallback className="text-xs font-bold bg-primary/20">
                {user.avatar && !user.avatar.startsWith('http') ? user.avatar : user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-medium text-muted-foreground">To:</span>
                <p className="font-semibold text-sm truncate">{user.name}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Subject Field */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Subject</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter email subject" 
                      className="h-9 text-sm"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Type your message here..."
                      className="min-h-[140px] resize-none text-sm leading-relaxed"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Info Banner */}
            <div className="rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-2.5">
              <div className="flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This email will be sent from FlowPost with your team branding. The recipient can reply directly.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset()
                  onOpenChange(false)
                }}
                className="cursor-pointer h-9 px-4 text-sm"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="cursor-pointer h-9 px-4 gap-2 text-sm" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Send Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
