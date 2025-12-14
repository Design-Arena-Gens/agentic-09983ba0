// AI service for generating email replies
// This would integrate with OpenAI API in production

export interface EmailContext {
  from: string
  subject: string
  body: string
}

export class AIService {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || ''
  }

  // Generate a reply draft using AI
  async generateReplyDraft(context: EmailContext): Promise<string> {
    // In production, use OpenAI API
    // Example:
    // const openai = new OpenAI({ apiKey: this.apiKey })
    // const response = await openai.chat.completions.create({
    //   model: 'gpt-4',
    //   messages: [
    //     {
    //       role: 'system',
    //       content: 'You are a helpful email assistant. Generate professional, concise email replies.'
    //     },
    //     {
    //       role: 'user',
    //       content: `Generate a reply to this email:\n\nFrom: ${context.from}\nSubject: ${context.subject}\nBody: ${context.body}`
    //     }
    //   ]
    // })
    // return response.choices[0].message.content

    // Fallback to pattern matching for demo
    return this.generatePatternBasedReply(context)
  }

  // Pattern-based reply generation (fallback)
  private generatePatternBasedReply(context: EmailContext): string {
    const body = context.body.toLowerCase()
    const subject = context.subject.toLowerCase()

    if (body.includes('thank') || body.includes('thanks')) {
      return `Hi,\n\nYou're welcome! I'm happy to help. Please don't hesitate to reach out if you need anything else.\n\nBest regards`
    }

    if (subject.includes('meeting') || body.includes('meeting')) {
      return `Hi,\n\nThank you for your message. I've received your meeting request and will review my calendar. I'll get back to you shortly with confirmation.\n\nBest regards`
    }

    if (body.includes('question') || body.includes('?')) {
      return `Hi,\n\nThank you for your question. I'll review it carefully and provide you with a detailed response as soon as possible.\n\nBest regards`
    }

    return `Hi,\n\nThank you for your email. I've received your message and will get back to you shortly.\n\nBest regards`
  }

  // Determine if email should be auto-replied
  shouldAutoReply(context: EmailContext): boolean {
    const body = context.body.toLowerCase()
    const autoReplyPatterns = [
      'thank you',
      'thanks',
      'received',
      'acknowledge',
      'got it',
      'confirmation'
    ]

    return autoReplyPatterns.some(pattern => body.includes(pattern))
  }

  // Classify email urgency
  classifyUrgency(context: EmailContext): 'low' | 'medium' | 'high' {
    const urgent = ['urgent', 'asap', 'immediately', 'emergency']
    const body = context.body.toLowerCase()
    const subject = context.subject.toLowerCase()

    if (urgent.some(word => body.includes(word) || subject.includes(word))) {
      return 'high'
    }

    if (body.includes('?') || subject.includes('question')) {
      return 'medium'
    }

    return 'low'
  }
}
