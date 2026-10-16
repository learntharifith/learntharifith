import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/progress?browserId=xxx — returns completed lesson ids for a browser
export async function GET(req: NextRequest) {
  const browserId = req.nextUrl.searchParams.get('browserId')
  if (!browserId) return NextResponse.json({ completed: [] })

  const rows = await db.userProgress.findMany({
    where: { browserId, completed: true },
    select: { lessonId: true },
  })
  return NextResponse.json({ completed: rows.map((r) => r.lessonId) })
}

// POST /api/progress  { browserId, lessonId, completed }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || !body.browserId || !body.lessonId) {
    return NextResponse.json({ error: 'browserId and lessonId are required' }, { status: 400 })
  }
  const completed = Boolean(body.completed)
  const watchedAt = completed ? new Date() : null

  const row = await db.userProgress.upsert({
    where: {
      browserId_lessonId: {
        browserId: body.browserId,
        lessonId: body.lessonId,
      },
    },
    update: { completed, watchedAt },
    create: {
      browserId: body.browserId,
      lessonId: body.lessonId,
      completed,
      watchedAt,
    },
  })
  return NextResponse.json({ ok: true, progress: row })
}
