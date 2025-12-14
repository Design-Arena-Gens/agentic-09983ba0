import { NextRequest, NextResponse } from 'next/server'
import { mockEmails } from '@/lib/mockEmails'

// Simple AI-powered draft generation using pattern matching
// In production, this would use OpenAI API
function generateDraftReply(email: any): string {
  const subject = email.subject.toLowerCase()
  const body = email.body.toLowerCase()

  // Pattern matching for common email types
  if (body.includes('thank you') || body.includes('thanks')) {
    return `Hi,\n\nYou're welcome! I'm glad I could help. Please don't hesitate to reach out if you need anything else.\n\nBest regards`
  }

  if (subject.includes('meeting') || body.includes('meeting')) {
    return `Hi,\n\nThank you for reaching out. I've received your message about the meeting. I'll review my calendar and get back to you shortly to confirm the details.\n\nBest regards`
  }

  if (body.includes('purchase') || body.includes('order')) {
    return `Hi,\n\nThank you for the update regarding my order. I appreciate the confirmation and look forward to receiving it.\n\nBest regards`
  }

  if (subject.includes('newsletter') || subject.includes('news')) {
    return `Hi,\n\nThank you for the newsletter. I'll take a look at the content when I have a moment.\n\nBest regards`
  }

  if (body.includes('question') || body.includes('?')) {
    return `Hi,\n\nThank you for your email. I've received your question and will review it carefully. I'll get back to you with a detailed response shortly.\n\nBest regards`
  }

  // Default response
  return `Hi,\n\nThank you for your email. I've received your message and will review it carefully. I'll get back to you as soon as possible.\n\nBest regards`
}

// Check if email should be auto-replied
function shouldAutoReply(email: any): boolean {
  const body = email.body.toLowerCase()
  const autoReplyKeywords = ['thank you', 'thanks', 'received', 'acknowledge']

  return autoReplyKeywords.some(keyword => body.includes(keyword))
}

export async function POST(request: NextRequest) {
  try {
    const { emailId } = await request.json()

    const email = mockEmails.find((e) => e.id === emailId)

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email not found' },
        { status: 404 }
      )
    }

    // Generate draft using AI patterns
    const draft = generateDraftReply(email)
    const autoReply = shouldAutoReply(email)

    // Update mock email with draft
    const emailIndex = mockEmails.findIndex((e) => e.id === emailId)
    if (emailIndex !== -1) {
      mockEmails[emailIndex].draft = draft
      mockEmails[emailIndex].status = 'drafted'
    }

    return NextResponse.json({
      success: true,
      draft,
      autoReply
    })
  } catch (error) {
    console.error('Error generating draft:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate draft' },
      { status: 500 }
    )
  }
}
