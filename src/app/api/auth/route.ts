import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, signToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// POST /api/auth  { password } → { token }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  if (!verifyPassword(body.password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = signToken()
  return NextResponse.json({ token })
}
