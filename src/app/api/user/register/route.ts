import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  generateUsername,
  generatePassword,
  hashPassword,
} from '@/lib/user-auth'
import { sendWelcomeEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

// POST /api/user/register — auto-generate username + password, send email
// Body: { email: string }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body.email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const email = body.email.toLowerCase().trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // Check if email already registered
  const existing = await db.userAccount.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json(
      { error: 'An account with this email already exists. Check your inbox for your credentials, or contact us.' },
      { status: 409 },
    )
  }

  // Generate unique username
  let username = generateUsername(email)
  while (await db.userAccount.findUnique({ where: { username } })) {
    username = generateUsername(email)
  }

  // Generate password
  const password = generatePassword()
  const passwordHash = await hashPassword(password)

  // Create user
  const user = await db.userAccount.create({
    data: {
      email,
      username,
      passwordHash,
      subStatus: 'pending',
    },
  })

  // Send welcome email with credentials
  const emailSent = await sendWelcomeEmail(email, username, password)

  return NextResponse.json(
    {
      ok: true,
      userId: user.id,
      emailSent,
      message: emailSent
        ? 'Welcome email sent with your login credentials. Check your inbox!'
        : 'Account created. Email sending is not configured on the server — contact the admin for your credentials.',
    },
    { status: 201 },
  )
}
