import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// POST - Send email to team member
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
    const { email, subject, message, memberName } = body

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send email using Resend
    try {
      const { data, error } = await resend.emails.send({
        from: 'FlowPost Team <noreply@flowpost.app>',
        to: [email],
        subject: subject,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${subject}</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">FlowPost</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Social Media Management</p>
              </div>
              
              <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <h2 style="color: #1f2937; margin-top: 0;">${subject}</h2>
                
                ${memberName ? `<p style="color: #6b7280;">Hi ${memberName},</p>` : ''}
                
                <div style="color: #374151; margin: 20px 0;">
                  ${message}
                </div>
                
                <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0;">
                    Best regards,<br>
                    <strong style="color: #7c3aed;">The FlowPost Team</strong>
                  </p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
                <p>© ${new Date().getFullYear()} FlowPost. All rights reserved.</p>
                <p style="margin-top: 10px;">
                  <a href="https://flowpost.app" style="color: #7c3aed; text-decoration: none;">Visit our website</a> | 
                  <a href="https://flowpost.app/support" style="color: #7c3aed; text-decoration: none;">Get support</a>
                </p>
              </div>
            </body>
          </html>
        `,
      })

      if (error) {
        console.error('Resend error:', error)
        return NextResponse.json(
          { error: 'Failed to send email' },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        success: true,
        message: 'Email sent successfully',
        emailId: data?.id
      })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Send email API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
