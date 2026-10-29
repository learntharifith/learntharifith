import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyUserToken } from '@/lib/user-auth'

export const dynamic = 'force-dynamic'

// POST /api/user/unlock — redeem a passcode to unlock a series
// Body: { passcode: string }
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req)
  const payload = verifyUserToken(token)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body.passcode !== 'string') {
    return NextResponse.json({ error: 'Passcode is required' }, { status: 400 })
  }

  const code = body.passcode.toUpperCase().trim()
  const passcode = await db.passcode.findUnique({
    where: { code },
  })

  if (!passcode) {
    return NextResponse.json({ error: 'Invalid passcode' }, { status: 404 })
  }

  if (passcode.used) {
    return NextResponse.json(
      { error: 'This passcode has already been used' },
      { status: 410 },
    )
  }

  // Redeem the passcode
  await db.passcode.update({
    where: { id: passcode.id },
    data: {
      used: true,
      usedById: payload.userId,
      usedAt: new Date(),
    },
  })

  // Record the use
  await db.passcodeUse.create({
    data: {
      userId: payload.userId,
      passcodeId: passcode.id,
      series: passcode.series,
    },
  })

  // Grant access to all videos in this series
  const videos = await db.video.findMany({
    where: { series: passcode.series, isPrivate: true },
  })
  for (const video of videos) {
    // Check if access already exists
    const existing = await db.videoAccess.findFirst({
      where: { userId: payload.userId, videoId: video.id },
    })
    if (!existing) {
      await db.videoAccess.create({
        data: {
          userId: payload.userId,
          videoId: video.id,
          series: passcode.series,
        },
      })
    }
  }

  // Update user subscription status
  await db.userAccount.update({
    where: { id: payload.userId },
    data: { subStatus: 'active' },
  })

  return NextResponse.json({
    ok: true,
    series: passcode.series,
    videosUnlocked: videos.length,
    message: `Successfully unlocked "${passcode.series}" — ${videos.length} videos now available!`,
  })
}
