import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/admin/users — list all user accounts
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await db.userAccount.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      username: true,
      subStatus: true,
      createdAt: true,
      _count: { select: { accesses: true } },
    },
  })
  return NextResponse.json({ users })
}
