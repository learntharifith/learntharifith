import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPasswordEnv, signToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// POST /api/admin/auth — login with ADMIN_PASSWORD
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Admin login not configured on server' },
      { status: 503 },
    )
  }

  if (!verifyAdminPasswordEnv(body.password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = signToken()
  return NextResponse.json({ token, role: 'admin' })
}
