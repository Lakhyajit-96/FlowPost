import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET - Export team members to CSV
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch all team members
    const { data: teamMembers, error } = await supabaseAdmin
      .from('team_members')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching team members for export:', error)
      return NextResponse.json(
        { error: 'Failed to fetch team members' },
        { status: 500 }
      )
    }

    // Convert to CSV format
    const headers = [
      'ID',
      'Member ID',
      'Role',
      'Status',
      'Invited At',
      'Accepted At',
      'Created At'
    ]

    const csvRows = [
      headers.join(','),
      ...teamMembers.map(member => [
        member.id,
        member.member_id,
        member.role,
        member.is_active ? 'Active' : 'Inactive',
        member.invited_at || '',
        member.accepted_at || '',
        member.created_at
      ].map(field => `"${field}"`).join(','))
    ]

    const csvContent = csvRows.join('\n')

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="team-members-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export team members API error:', error)
    return NextResponse.json(
      { error: 'Failed to export team members' },
      { status: 500 }
    )
  }
}
