import { NextRequest, NextResponse } from 'next/server'
import { mockEmails } from '@/lib/mockEmails'

export async function POST(request: NextRequest) {
  try {
    const { emailId, draft } = await request.json()

    const email = mockEmails.find((e) => e.id === emailId)

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email not found' },
        { status: 404 }
      )
    }

    // In production, this would use nodemailer to send actual email
    console.log('Sending reply to:', email.from)
    console.log('Subject: Re:', email.subject)
    console.log('Body:', draft)

    // Update mock email status
    const emailIndex = mockEmails.findIndex((e) => e.id === emailId)
    if (emailIndex !== -1) {
      mockEmails[emailIndex].status = 'replied'
    }

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully'
    })
  } catch (error) {
    console.error('Error sending reply:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send reply' },
      { status: 500 }
    )
  }
}
