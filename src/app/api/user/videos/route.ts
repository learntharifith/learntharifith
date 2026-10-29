import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyUserToken } from '@/lib/user-auth'

export const dynamic = 'force-dynamic'

// GET /api/user/videos — get videos accessible to the logged-in user
// Returns: public videos + private videos in series the user has unlocked
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req)
  const payload = verifyUserToken(token)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's unlocked series
  const accesses = await db.videoAccess.findMany({
    where: { userId: payload.userId },
    select: { series: true },
    distinct: ['series'],
  })
  const unlockedSeries = accesses.map((a) => a.series)

  // Get public videos + private videos in unlocked series
  const videos = await db.video.findMany({
    where: {
      OR: [
        { isPrivate: false },
        { isPrivate: true, series: { in: unlockedSeries } },
      ],
    },
    orderBy: [{ series: 'asc' }, { order: 'asc' }],
    select: {
      id: true,
      title: true,
      description: true,
      isPrivate: true,
      series: true,
      order: true,
      fileSize: true,
      createdAt: true,
    },
  })

  // Also get locked series (private series the user hasn't unlocked yet)
  const allPrivateSeries = await db.video.findMany({
    where: { isPrivate: true },
    select: { series: true },
    distinct: ['series'],
  })
  const lockedSeries = allPrivateSeries
    .map((v) => v.series)
    .filter((s) => s && !unlockedSeries.includes(s))

  return NextResponse.json({
    videos,
    unlockedSeries,
    lockedSeries,
  })
}
