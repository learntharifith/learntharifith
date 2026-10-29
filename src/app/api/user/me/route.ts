import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyUserToken } from '@/lib/user-auth'

export const dynamic = 'force-dynamic'

// GET /api/user/me — get current user profile + unlocked series
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req)
  const payload = verifyUserToken(token)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await db.userAccount.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      username: true,
      subStatus: true,
      createdAt: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Get unlocked series
  const accesses = await db.videoAccess.findMany({
    where: { userId: user.id },
    select: { series: true, createdAt: true },
    distinct: ['series'],
  })

  return NextResponse.json({
    user,
    unlockedSeries: accesses.map((a) => a.series),
  })
}
