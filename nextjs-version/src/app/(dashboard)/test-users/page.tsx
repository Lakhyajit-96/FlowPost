"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { UserPlus, Trash2, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TestUsersPage() {
  const [loading, setLoading] = useState(false)
  const [testUsers, setTestUsers] = useState<any[]>([])

  const addTestUser = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test/add-test-user', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Test user added successfully! Go to Team Members page to see it.')
        setTestUsers(prev => [...prev, data.teamMember])
      } else {
        toast.error(data.error || 'Failed to add test user')
        console.error('Error details:', data.details)
      }
    } catch (error) {
      console.error('Error adding test user:', error)
      toast.error('Failed to add test user. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const clearTestUsers = async () => {
    setTestUsers([])
    toast.success('Test users list cleared')
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div>
        <h1 className="text-3xl font-bold">Test Users</h1>
        <p className="text-muted-foreground">
          Add test users to test team management features
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Test User Generator</CardTitle>
          <CardDescription>
            Click the button below to add yourself as a test team member. This will use your real Clerk account data so you can test all features with actual user information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              💡 <strong>How it works:</strong> This will add your current Clerk account as a team member with the "Editor" role. 
              You'll see your real name, email, and avatar in the team members list, allowing you to test all features with actual data.
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={addTestUser} 
              disabled={loading}
              className="cursor-pointer"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {loading ? 'Adding...' : 'Add Myself as Test User'}
            </Button>
            <Button 
              onClick={clearTestUsers} 
              variant="outline"
              className="cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear List
            </Button>
            <Button 
              onClick={() => window.location.href = '/users'} 
              variant="secondary"
              className="cursor-pointer"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Go to Team Members
            </Button>
          </div>

          {testUsers.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold">Recently Added Test Users:</h3>
              {testUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Test User {index + 1}</p>
                    <p className="text-sm text-muted-foreground">ID: {user.member_id.substring(0, 20)}...</p>
                  </div>
                  <Badge variant="secondary">{user.role}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Add Test Users</h4>
            <p className="text-sm text-muted-foreground">
              Click "Add Test User" button above to create test team members in your database.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">2. Go to Team Members Page</h4>
            <p className="text-sm text-muted-foreground">
              Navigate to the Team Members page to see your test users.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">3. Test All Features</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>👁️ Click the eye icon to view user details</li>
              <li>✏️ Click the pencil icon to edit user role and permissions</li>
              <li>📧 Click "Send Email" to test email functionality</li>
              <li>🔑 Click "Reset Password" to test password reset</li>
              <li>🗑️ Click "Remove from Team" to delete the user</li>
              <li>📥 Click "Export" to download CSV file</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">4. Check Activity Logs</h4>
            <p className="text-sm text-muted-foreground">
              All actions are logged in the activity system. Check your browser console for activity logs.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
        <CardHeader>
          <CardTitle className="text-orange-700 dark:text-orange-400">⚠️ Development Only</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-600 dark:text-orange-400">
            This test page is for development purposes only. Make sure to remove the <code>/api/test/add-test-user</code> endpoint and this page before deploying to production!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
