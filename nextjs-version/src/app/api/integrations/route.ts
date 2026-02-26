import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Fetch all integrations for the user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('other_integrations')
      .select('*')
      .eq('user_id', userId)
      .order('integration_type', { ascending: true })

    if (error) {
      console.error('Error fetching integrations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch integrations' },
        { status: 500 }
      )
    }

    return NextResponse.json({ integrations: data || [] })

  } catch (error) {
    console.error('Integrations GET error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// POST - Toggle integration on/off
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { integration_type, is_connected } = body

    if (!integration_type) {
      return NextResponse.json(
        { error: 'Integration type is required' },
        { status: 400 }
      )
    }

    // Upsert integration
    const { data, error } = await supabase
      .from('other_integrations')
      .upsert({
        user_id: userId,
        integration_type,
        is_connected,
        connected_at: is_connected ? new Date().toISOString() : null,
        last_synced_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,integration_type'
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating integration:', error)
      return NextResponse.json(
        { error: 'Failed to update integration' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `${integration_type} ${is_connected ? 'connected' : 'disconnected'} successfully`,
      integration: data
    })

  } catch (error) {
    console.error('Integrations POST error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
