import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/**
 * Extract the 11-char YouTube video ID from a variety of URL formats:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://www.youtube.com/embed/VIDEO_ID
 *   - https://www.youtube.com/shorts/VIDEO_ID
 *   - Or a bare 11-char video ID
 */
function extractYoutubeId(input: string): string | null {
  const s = input.trim()
  if (!s) return null
  // watch?v=
  let m = s.match(/[?&]v=([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  // youtu.be/
  m = s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  // /embed/
  m = s.match(/\/embed\/([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  // /shorts/
  m = s.match(/\/shorts\/([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  // bare 11-char ID
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s
  return null
}

const VALID_LEVELS = ['intro', 'beginner', 'intermediate', 'culture']

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

// POST /api/lessons — auth-gated, creates a new lesson
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body || !body.title || !body.youtubeUrl) {
    return NextResponse.json(
      { error: 'Title and YouTube URL are required' },
      { status: 400 },
    )
  }

  const youtubeId = extractYoutubeId(body.youtubeUrl)
  if (!youtubeId) {
    return NextResponse.json(
      { error: 'Could not extract a valid YouTube video ID from that URL' },
      { status: 400 },
    )
  }

  const title = String(body.title).trim()
  const description = String(body.description || '').trim() || 'A new Riffian lesson.'
  const level = VALID_LEVELS.includes(body.level) ? body.level : 'beginner'
  const lessonNumber = body.lessonNumber ? Number(body.lessonNumber) : null
  const durationMins = Number(body.durationMins) || 0
  const featured = Boolean(body.featured)
  const thumbnail = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`

  // Generate a unique slug
  let slug = slugify(title) || `lesson-${Date.now()}`
  const existing = await db.lesson.findUnique({ where: { slug } })
  if (existing) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`
  }

  // Determine order: place new lessons at the end of their level
  const lastInLevel = await db.lesson.findFirst({
    where: { level },
    orderBy: { order: 'desc' },
    select: { order: true },
  })
  const order = (lastInLevel?.order ?? 0) + 1

  const lesson = await db.lesson.create({
    data: {
      title,
      slug,
      description,
      youtubeId,
      level,
      lessonNumber,
      thumbnail,
      durationMins,
      order,
      featured,
    },
  })

  return NextResponse.json({ lesson }, { status: 201 })
}
