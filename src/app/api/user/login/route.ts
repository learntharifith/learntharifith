import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyUserPassword, signUserToken } from '@/lib/user-auth'

export const dynamic = 'force-dynamic'

// POST /api/user/login — authenticate with username + password
// Body: { username: string, password: string }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body.username !== 'string' || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
  }

  const username = body.username.toLowerCase().trim()
  const user = await db.userAccount.findUnique({ where: { username } })

  if (!user) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  }

  const valid = await verifyUserPassword(body.password, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  }

  const token = signUserToken(user.id)
  return NextResponse.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      subStatus: user.subStatus,
    },
  })
}
