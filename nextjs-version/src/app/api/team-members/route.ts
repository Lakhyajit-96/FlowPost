import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET - Fetch all team members for the current user's organization
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get team members where the current user is the owner
    const { data: teamMembers, error } = await supabaseAdmin
      .from('team_members')
      .select(`
        id,
        member_id,
        role,
        permissions,
        is_active,
        invited_at,
        accepted_at,
        created_at,
        updated_at
      `)
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching team members:', error)
      return NextResponse.json(
        { error: 'Failed to fetch team members' },
        { status: 500 }
      )
    }

    // Fetch user details from Clerk for each team member
    const client = await clerkClient()
    const membersWithDetails = await Promise.all(
      teamMembers.map(async (member) => {
        try {
          // Fetch real user details from Clerk
          const clerkUser = await client.users.getUser(member.member_id)
          
          return {
            ...member,
            name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown User',
            email: clerkUser.emailAddresses[0]?.emailAddress || 'no-email@example.com',
            avatar: clerkUser.imageUrl || null,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            lastSignInAt: clerkUser.lastSignInAt,
          }
        } catch (error) {
          console.error('Error fetching Clerk user details:', error)
          // Fallback if Clerk user not found
          return {
            ...member,
            name: `User ${member.member_id.substring(0, 8)}`,
            email: 'user@example.com',
            avatar: null,
          }
        }
      })
    )

    return NextResponse.json({ teamMembers: membersWithDetails })
  } catch (error) {
    console.error('Team members API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add a new team member
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
    const { member_id, role, permissions } = body

    if (!member_id || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert new team member
    const { data: newMember, error } = await supabaseAdmin
      .from('team_members')
      .insert({
        owner_id: userId,
        member_id,
        role,
        permissions: permissions || {},
        is_active: true,
        invited_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding team member:', error)
      return NextResponse.json(
        { error: 'Failed to add team member' },
        { status: 500 }
      )
    }

    return NextResponse.json({ teamMember: newMember }, { status: 201 })
  } catch (error) {
    console.error('Add team member API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
