import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// DELETE - Disconnect a social account
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const connectionId = params.id

    // Verify the connection belongs to the user before deleting
    const { data: connection, error: fetchError } = await supabase
      .from('social_connections')
      .select('platform')
      .eq('id', connectionId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      )
    }

    // Delete the connection
    const { error: deleteError } = await supabase
      .from('social_connections')
      .delete()
      .eq('id', connectionId)
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Error deleting social connection:', deleteError)
      return NextResponse.json(
        { error: 'Failed to disconnect account' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: `${connection.platform.charAt(0).toUpperCase() + connection.platform.slice(1)} account disconnected successfully`
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Social connection DELETE error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// PATCH - Update connection status (activate/deactivate)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const connectionId = params.id
    const body = await request.json()
    const { is_active } = body

    if (typeof is_active !== 'boolean') {
      return NextResponse.json(
        { error: 'is_active must be a boolean' },
        { status: 400 }
      )
    }

    // Update the connection
    const { data, error } = await supabase
      .from('social_connections')
      .update({ is_active })
      .eq('id', connectionId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating social connection:', error)
      return NextResponse.json(
        { error: 'Failed to update connection' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: `Connection ${is_active ? 'activated' : 'deactivated'} successfully`,
        connection: {
          id: data.id,
          platform: data.platform,
          is_active: data.is_active,
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Social connection PATCH error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
