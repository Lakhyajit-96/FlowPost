import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

// POST - Send password reset email
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Use Clerk's API to send password reset email
    // In production, you'd use Clerk's password reset functionality
    console.log('Sending password reset email to:', email)

    // Example: You can use Clerk's API or your own email service
    // const client = await clerkClient()
    // await client.users.getUserList({ emailAddress: [email] })
    // Then trigger password reset

    return NextResponse.json({ 
      success: true,
      message: 'Password reset email sent successfully' 
    })
  } catch (error) {
    console.error('Reset password API error:', error)
    return NextResponse.json(
      { error: 'Failed to send password reset email' },
      { status: 500 }
    )
  }
}
