import { NextResponse } from 'next/server'

export async function GET() {
  const configured = !!(
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASSWORD
  )

  return NextResponse.json({ configured })
}
