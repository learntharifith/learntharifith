import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/lessons — returns all lessons ordered by learning path
export async function GET() {
  const lessons = await db.lesson.findMany({
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      youtubeId: true,
      level: true,
      lessonNumber: true,
      thumbnail: true,
      durationMins: true,
      order: true,
      featured: true,
    },
  })
  return NextResponse.json({ lessons })
}
