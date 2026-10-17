import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const VALID_LEVELS = ['intro', 'beginner', 'intermediate', 'culture']

function extractYoutubeId(input: string): string | null {
  const s = input.trim()
  if (!s) return null
  let m = s.match(/[?&]v=([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  m = s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  m = s.match(/\/embed\/([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  m = s.match(/\/shorts\/([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s
  return null
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

// PUT /api/lessons/[id] — auth-gated, updates a lesson
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = getTokenFromRequest(req)
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const data: Record<string, unknown> = {}
  if (typeof body.title === 'string') data.title = body.title.trim()
  if (typeof body.description === 'string') data.description = body.description.trim()
  if (VALID_LEVELS.includes(body.level)) data.level = body.level
  if (body.lessonNumber !== undefined) data.lessonNumber = body.lessonNumber ? Number(body.lessonNumber) : null
  if (typeof body.durationMins === 'number') data.durationMins = body.durationMins
  if (typeof body.featured === 'boolean') data.featured = body.featured

  // If a new YouTube URL is provided, extract the ID + update thumbnail
  if (typeof body.youtubeUrl === 'string' && body.youtubeUrl.trim()) {
    const ytId = extractYoutubeId(body.youtubeUrl)
    if (!ytId) {
      return NextResponse.json(
        { error: 'Could not extract a valid YouTube video ID' },
        { status: 400 },
      )
    }
    data.youtubeId = ytId
    data.thumbnail = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
  }

  // Regenerate slug if title changed
  if (typeof body.title === 'string') {
    const newSlug = slugify(body.title)
    if (newSlug) {
      const existing = await db.lesson.findFirst({
        where: { slug: newSlug, NOT: { id } },
      })
      data.slug = existing ? `${newSlug}-${Date.now().toString(36).slice(-4)}` : newSlug
    }
  }

  const lesson = await db.lesson.update({ where: { id }, data })
  return NextResponse.json({ lesson })
}

// DELETE /api/lessons/[id] — auth-gated, deletes a lesson
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = getTokenFromRequest(req)
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await db.lesson.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
