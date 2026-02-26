import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// POST - Add a test user for testing purposes
// WARNING: This is for development/testing only - remove in production!
export async function POST(_req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in first' },
        { status: 401 }
      )
    }

    // First, ensure the user exists in the users table
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, clerk_user_id')
      .eq('clerk_user_id', userId)
      .single()

    if (!existingUser) {
      // Fetch user details from Clerk
      const client = await clerkClient()
      const clerkUser = await client.users.getUser(userId)
      
      // Create user in database
      const { error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          clerk_user_id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || 'no-email@example.com',
          full_name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          avatar_url: clerkUser.imageUrl,
          subscription_tier: 'free',
          subscription_status: 'inactive',
          onboarding_completed: true,
          last_login_at: new Date().toISOString(),
        })

      if (userError) {
        console.error('Error creating user:', userError)
        return NextResponse.json(
          { error: 'Failed to create user in database', details: userError.message },
          { status: 500 }
        )
      }
    }

    // Check if this user is already a team member
    const { data: existingMember } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('owner_id', userId)
      .eq('member_id', userId)
      .single()

    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already added as a team member. Check the Team Members page.' },
        { status: 400 }
      )
    }

    // Use the current logged-in user as the test member
    const testMember = {
      owner_id: userId,
      member_id: userId,
      role: 'editor',
      permissions: {
        canManageTeam: false,
        canManagePosts: true,
        canManageAnalytics: true,
        canManageSettings: false,
      },
      is_active: true,
      invited_at: new Date().toISOString(),
      accepted_at: new Date().toISOString(),
    }

    const { data: newMember, error } = await supabaseAdmin
      .from('team_members')
      .insert(testMember)
      .select()
      .single()

    if (error) {
      console.error('Error adding test user:', error)
      return NextResponse.json(
        { error: 'Failed to add test user', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Test user added successfully! Go to Team Members page to see it.',
      teamMember: newMember 
    }, { status: 201 })
  } catch (error) {
    console.error('Add test user API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
