import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, subject, message } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Get IP address and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Insert contact into database
    const { data: contact, error: dbError } = await supabase
      .from('contacts')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        subject: subject,
        message: message,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: 'new'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save contact information' },
        { status: 500 }
      )
    }

    // Send email notification to admin
    try {
      await resend.emails.send({
        from: 'FlowPost Contact <noreply@flowpost.app>',
        to: process.env.ADMIN_EMAIL || 'admin@flowpost.com',
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
                  color: white;
                  padding: 30px;
                  border-radius: 10px 10px 0 0;
                  text-align: center;
                }
                .content {
                  background: #f9fafb;
                  padding: 30px;
                  border-radius: 0 0 10px 10px;
                }
                .field {
                  margin-bottom: 20px;
                  padding: 15px;
                  background: white;
                  border-radius: 8px;
                  border-left: 4px solid #7c3aed;
                }
                .label {
                  font-weight: 600;
                  color: #7c3aed;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  margin-bottom: 5px;
                }
                .value {
                  color: #1f2937;
                  font-size: 15px;
                }
                .message-box {
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  border: 1px solid #e5e7eb;
                  margin-top: 10px;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                  color: #6b7280;
                  font-size: 13px;
                }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background: #7c3aed;
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                  margin-top: 20px;
                  font-weight: 600;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">📬 New Contact Form Submission</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone reached out via FlowPost landing page</p>
              </div>
              
              <div class="content">
                <div class="field">
                  <div class="label">Contact Name</div>
                  <div class="value">${firstName} ${lastName}</div>
                </div>
                
                <div class="field">
                  <div class="label">Email Address</div>
                  <div class="value"><a href="mailto:${email}" style="color: #7c3aed;">${email}</a></div>
                </div>
                
                <div class="field">
                  <div class="label">Subject</div>
                  <div class="value">${subject}</div>
                </div>
                
                <div class="field">
                  <div class="label">Message</div>
                  <div class="message-box">${message}</div>
                </div>
                
                <div class="field">
                  <div class="label">Submission Details</div>
                  <div class="value" style="font-size: 13px; color: #6b7280;">
                    <strong>IP:</strong> ${ipAddress}<br>
                    <strong>Time:</strong> ${new Date().toLocaleString()}<br>
                    <strong>Contact ID:</strong> ${contact.id}
                  </div>
                </div>
                
                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
                    View in Dashboard
                  </a>
                </div>
              </div>
              
              <div class="footer">
                <p>This is an automated notification from FlowPost Contact Form</p>
                <p style="margin-top: 10px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #7c3aed; text-decoration: none;">FlowPost</a> | 
                  AI-Powered Social Media Management
                </p>
              </div>
            </body>
          </html>
        `,
      })
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the request if email fails
    }

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: 'FlowPost Support <support@flowpost.app>',
        to: email,
        subject: 'We received your message - FlowPost',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
                  color: white;
                  padding: 40px;
                  border-radius: 10px 10px 0 0;
                  text-align: center;
                }
                .content {
                  background: #f9fafb;
                  padding: 40px;
                  border-radius: 0 0 10px 10px;
                }
                .message-box {
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  border-left: 4px solid #7c3aed;
                  margin: 20px 0;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                  color: #6b7280;
                  font-size: 13px;
                }
                .button {
                  display: inline-block;
                  padding: 14px 28px;
                  background: #7c3aed;
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                  margin-top: 20px;
                  font-weight: 600;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">✅ Message Received!</h1>
                <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 16px;">Thank you for contacting FlowPost</p>
              </div>
              
              <div class="content">
                <p style="font-size: 16px; margin-bottom: 20px;">Hi ${firstName},</p>
                
                <p style="font-size: 15px; color: #4b5563;">
                  We've received your message and our team will get back to you within 24 hours. 
                  We're excited to help you with your social media management needs!
                </p>
                
                <div class="message-box">
                  <p style="margin: 0 0 10px 0; font-weight: 600; color: #7c3aed;">Your Message:</p>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>Subject:</strong> ${subject}</p>
                  <p style="margin: 10px 0 0 0; color: #1f2937; white-space: pre-wrap; word-wrap: break-word;">${message}</p>
                </div>
                
                <p style="font-size: 15px; color: #4b5563; margin-top: 30px;">
                  In the meantime, feel free to explore our platform and see how FlowPost can transform your social media workflow.
                </p>
                
                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/sign-up" class="button">
                    Start Free Trial
                  </a>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; margin-top: 30px; text-align: center;">
                  Need immediate assistance? Reply to this email or visit our 
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/landing#faq" style="color: #7c3aed;">Help Center</a>
                </p>
              </div>
              
              <div class="footer">
                <p><strong>FlowPost Team</strong></p>
                <p style="margin-top: 10px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #7c3aed; text-decoration: none;">FlowPost</a> | 
                  AI-Powered Social Media Management
                </p>
                <p style="margin-top: 15px; font-size: 12px;">
                  © ${new Date().getFullYear()} FlowPost. All rights reserved.
                </p>
              </div>
            </body>
          </html>
        `,
      })
    } catch (emailError) {
      console.error('Confirmation email error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for contacting us! We\'ll get back to you within 24 hours.',
        contactId: contact.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
