"use client"

import { useEffect, useState } from "react"
import { StatCards } from "./components/stat-cards"
import { DataTable } from "./components/data-table"
import { EditUserDialog } from "./components/edit-user-dialog"
import { ViewUserDialog } from "./components/view-user-dialog"
import { SendEmailDialog } from "./components/send-email-dialog"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

export interface TeamMember {
  id: string
  member_id: string
  name: string
  email: string
  avatar: string
  role: string
  plan: string
  status: string
  invited_at: string
  accepted_at: string | null
  created_at: string
  is_active: boolean
}

export interface TeamMemberFormValues {
  name: string
  email: string
  role: string
  plan: string
  status: string
}

export default function UsersPage() {
  const { user } = useUser()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0
  })

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  // Log activity helper
  const logActivity = async (memberId: string, action: string, details: any = {}) => {
    try {
      await fetch('/api/team-members/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_id: memberId,
          action,
          details,
        }),
      })
    } catch (error) {
      console.error('Failed to log activity:', error)
    }
  }

  // Fetch team members from database
  useEffect(() => {
    async function fetchTeamMembers() {
      if (!user) return

      try {
        const response = await fetch('/api/team-members')
        const data = await response.json()

        if (response.ok) {
          // Transform data to match UI expectations
          const members: TeamMember[] = data.teamMembers.map((member: any) => ({
            id: member.id,
            member_id: member.member_id,
            name: member.name || 'Unknown User',
            email: member.email || 'no-email@example.com',
            avatar: member.avatar || member.name?.substring(0, 2).toUpperCase() || 'U',
            role: member.role,
            plan: 'Free', // Default plan, can be fetched from users table
            status: member.is_active ? 'Active' : 'Inactive',
            invited_at: member.invited_at,
            accepted_at: member.accepted_at,
            created_at: member.created_at,
            is_active: member.is_active
          }))

          setTeamMembers(members)

          // Calculate stats
          setStats({
            total: members.length,
            active: members.filter(m => m.status === 'Active').length,
            pending: members.filter(m => m.status === 'Pending').length,
            inactive: members.filter(m => m.status === 'Inactive').length
          })
        } else {
          toast.error('Failed to fetch team members')
        }
      } catch (error) {
        console.error('Error fetching team members:', error)
        toast.error('Failed to load team members')
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [user])

  const handleAddUser = async (userData: TeamMemberFormValues) => {
    try {
      const response = await fetch('/api/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: `temp_${Date.now()}`,
          role: userData.role,
          permissions: {},
        }),
      })

      if (response.ok) {
        const { teamMember } = await response.json()
        
        const newMember: TeamMember = {
          id: teamMember.id,
          member_id: teamMember.member_id,
          name: userData.name,
          email: userData.email,
          avatar: userData.name.substring(0, 2).toUpperCase(),
          role: userData.role,
          plan: userData.plan,
          status: userData.status,
          invited_at: teamMember.invited_at,
          accepted_at: null,
          created_at: teamMember.created_at,
          is_active: true
        }

        setTeamMembers(prev => [newMember, ...prev])
        await logActivity(newMember.member_id, 'member_added', { role: userData.role })
        toast.success('Team member added successfully')
      } else {
        toast.error('Failed to add team member')
      }
    } catch (error) {
      console.error('Error adding team member:', error)
      toast.error('Failed to add team member')
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      const member = teamMembers.find(m => m.id === id)
      const response = await fetch(`/api/team-members/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTeamMembers(prev => prev.filter(member => member.id !== id))
        if (member) {
          await logActivity(member.member_id, 'member_removed', { name: member.name })
        }
        toast.success('Team member removed successfully')
      } else {
        toast.error('Failed to remove team member')
      }
    } catch (error) {
      console.error('Error deleting team member:', error)
      toast.error('Failed to remove team member')
    }
  }

  const handleEditUser = (member: TeamMember) => {
    setSelectedMember(member)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async (userId: string, data: any) => {
    try {
      const response = await fetch(`/api/team-members/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const { teamMember } = await response.json()
        setTeamMembers(prev => prev.map(m => 
          m.id === userId 
            ? { ...m, role: teamMember.role, is_active: teamMember.is_active }
            : m
        ))
        await logActivity(teamMember.member_id, 'member_updated', { changes: data })
        toast.success('Team member updated successfully')
      } else {
        toast.error('Failed to update team member')
      }
    } catch (error) {
      console.error('Error updating team member:', error)
      toast.error('Failed to update team member')
    }
  }

  const handleViewDetails = (member: TeamMember) => {
    setSelectedMember(member)
    setViewDialogOpen(true)
    logActivity(member.member_id, 'profile_viewed')
  }

  const handleSendEmail = (member: TeamMember) => {
    setSelectedMember(member)
    setEmailDialogOpen(true)
  }

  const handleSendEmailSubmit = async (email: string, subject: string, message: string, memberName: string) => {
    try {
      const response = await fetch('/api/team-members/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          subject,
          message,
          memberName,
        }),
      })

      if (response.ok) {
        if (selectedMember) {
          await logActivity(selectedMember.member_id, 'email_sent', { subject })
        }
        toast.success(`Email sent to ${email}`)
      } else {
        toast.error('Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Failed to send email')
    }
  }

  const handleResetPassword = async (member: TeamMember) => {
    try {
      const response = await fetch('/api/team-members/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: member.email,
        }),
      })

      if (response.ok) {
        await logActivity(member.member_id, 'password_reset_requested')
        toast.success(`Password reset email sent to ${member.email}`)
      } else {
        toast.error('Failed to send password reset email')
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      toast.error('Failed to reset password')
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch('/api/team-members/export')
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `team-members-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        await logActivity(user?.id || '', 'data_exported', { type: 'team_members' })
        toast.success('Team members exported successfully')
      } else {
        toast.error('Failed to export team members')
      }
    } catch (error) {
      console.error('Error exporting team members:', error)
      toast.error('Failed to export team members')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="@container/main px-4 lg:px-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading team members...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="@container/main px-4 lg:px-6">
        <StatCards stats={stats} />
      </div>
      
      <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
        <DataTable 
          users={teamMembers}
          onDeleteUser={handleDeleteUser}
          onEditUser={handleEditUser}
          onAddUser={handleAddUser}
          onViewDetails={handleViewDetails}
          onSendEmail={handleSendEmail}
          onResetPassword={handleResetPassword}
          onExport={handleExport}
        />
      </div>

      {/* Dialogs */}
      <EditUserDialog
        user={selectedMember}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEdit}
      />

      <ViewUserDialog
        user={selectedMember}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <SendEmailDialog
        user={selectedMember}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onSend={handleSendEmailSubmit}
      />
    </div>
  )
}
