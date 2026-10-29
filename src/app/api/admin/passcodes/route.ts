import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { generatePasscode } from '@/lib/user-auth'

export const dynamic = 'force-dynamic'

// GET /api/admin/passcodes — list all passcodes
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const passcodes = await db.passcode.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      uses: { include: { user: { select: { email: true, username: true } } } },
    },
  })
  return NextResponse.json({ passcodes })
}

// POST /api/admin/passcodes — generate new passcodes
// Body: { series: string, count: number }
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body || !body.series) {
    return NextResponse.json(
      { error: 'Series name is required' },
      { status: 400 },
    )
  }

  const count = Math.min(Number(body.count) || 1, 50)
  const series = String(body.series)

  const passcodes = []
  for (let i = 0; i < count; i++) {
    let code = generatePasscode()
    // Ensure uniqueness
    while (await db.passcode.findUnique({ where: { code } })) {
      code = generatePasscode()
    }
    const pc = await db.passcode.create({
      data: { code, series },
    })
    passcodes.push(pc)
  }

  return NextResponse.json({ passcodes }, { status: 201 })
}
