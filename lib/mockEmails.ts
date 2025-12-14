// Shared mock email data
export type EmailStatus = 'pending' | 'drafted' | 'replied'

export interface MockEmail {
  id: string
  from: string
  subject: string
  body: string
  date: string
  status: EmailStatus
  draft?: string
}

export let mockEmails: MockEmail[] = [
  {
    id: '1',
    from: 'john.doe@example.com',
    subject: 'Meeting tomorrow',
    body: 'Hi, just wanted to confirm our meeting scheduled for tomorrow at 2 PM. Looking forward to discussing the project details.',
    date: new Date().toISOString(),
    status: 'pending'
  },
  {
    id: '2',
    from: 'support@service.com',
    subject: 'Thank you for your purchase',
    body: 'Thank you for your recent purchase. Your order #12345 has been confirmed and will be shipped within 2-3 business days.',
    date: new Date(Date.now() - 3600000).toISOString(),
    status: 'pending'
  },
  {
    id: '3',
    from: 'newsletter@tech.com',
    subject: 'Weekly Tech News',
    body: 'Here are this week\'s top technology stories: AI breakthroughs, new smartphone releases, and cloud computing trends.',
    date: new Date(Date.now() - 7200000).toISOString(),
    status: 'pending'
  }
]
