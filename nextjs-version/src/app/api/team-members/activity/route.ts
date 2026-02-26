import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// POST - Log team member activity
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
    const { member_id, action, details, ip_address } = body

    if (!member_id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log activity to database
    // You would create an activity_logs table for this
    const activityLog = {
      user_id: userId,
      member_id,
      action,
      details: details || {},
      ip_address: ip_address || null,
      created_at: new Date().toISOString(),
    }

    console.log('Activity logged:', activityLog)

    // In production, insert into activity_logs table:
    // const { data, error } = await supabaseAdmin
    //   .from('activity_logs')
    //   .insert(activityLog)

    return NextResponse.json({ 
      success: true,
      message: 'Activity logged successfully'
    })
  } catch (error) {
    console.error('Activity log API error:', error)
    return NextResponse.json(
      { error: 'Failed to log activity' },
      { status: 500 }
    )
  }
}

// GET - Fetch activity logs for a team member
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const memberId = searchParams.get('member_id')

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      )
    }

    // In production, fetch from activity_logs table:
    // const { data: activities, error } = await supabaseAdmin
    //   .from('activity_logs')
    //   .select('*')
    //   .eq('member_id', memberId)
    //   .order('created_at', { ascending: false })
    //   .limit(50)

    // Mock data for now
    const activities = [
      {
        id: '1',
        action: 'member_invited',
        details: { role: 'editor' },
        created_at: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ activities })
  } catch (error) {
    console.error('Get activity logs API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    )
  }
}
