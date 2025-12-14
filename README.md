# Email Agent - AI-Powered Email Assistant

An intelligent email monitoring and auto-reply system built with Next.js that helps you manage your inbox efficiently.

## Features

- **Email Monitoring**: Continuously monitor your inbox for new emails
- **AI Draft Generation**: Automatically generate contextual reply drafts using AI
- **Auto-Reply**: Automatically respond to basic emails (thank you notes, confirmations, etc.)
- **Manual Review**: Review and edit AI-generated drafts before sending
- **Real-time Dashboard**: Monitor all emails and their status in one place

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Email account credentials (Gmail, Outlook, etc.)
- OpenAI API key (optional, for enhanced AI replies)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
OPENAI_API_KEY=your-openai-api-key
```

### Gmail Setup

For Gmail users:
1. Enable 2-Factor Authentication
2. Generate an App Password: Google Account → Security → 2-Step Verification → App passwords
3. Use the app password in your .env file

### Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## Usage

1. **Configure Email**: Set up your email credentials in the environment variables
2. **Start Monitoring**: Click "Start Monitoring" to begin watching for new emails
3. **Generate Drafts**: Click "Generate Draft" on any email to create an AI reply
4. **Review & Send**: Review the draft, edit if needed, and send the reply
5. **Auto-Reply**: Enable auto-reply for basic emails like acknowledgments

## Architecture

- **Frontend**: Next.js 14 with React and TypeScript
- **API Routes**: Server-side email processing and AI integration
- **Email Service**: IMAP/SMTP integration (demo mode included)
- **AI Service**: Pattern-based and OpenAI-powered reply generation

## Demo Mode

The application includes a demo mode with mock emails for testing without email credentials. This allows you to:
- Test the UI and workflow
- Generate sample reply drafts
- See how auto-reply works

## Deployment

Deploy to Vercel:
```bash
vercel deploy --prod
```

Add environment variables in Vercel dashboard under Settings → Environment Variables.

## Security Notes

- Never commit your .env file
- Use app-specific passwords, not your main email password
- Keep your OpenAI API key secure
- Review all auto-replies before enabling in production

## License

MIT
