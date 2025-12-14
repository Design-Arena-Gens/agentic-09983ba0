import { NextResponse } from 'next/server'
import { mockEmails } from '@/lib/mockEmails'

export async function GET() {
  try {
    // In production, implement IMAP email fetching here
    // For demo, return mock data
    return NextResponse.json({
      success: true,
      emails: mockEmails
    })
  } catch (error) {
    console.error('Error fetching emails:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch emails' },
      { status: 500 }
    )
  }
}
