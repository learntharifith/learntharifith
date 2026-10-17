import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/articles/[id] — public (includes unpublished for preview? no, only published)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const article = await db.article.findUnique({ where: { id } })
  if (!article || !article.published) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ article })
}

// PUT /api/articles/[id] — auth-gated, updates an article
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
  if (typeof body.excerpt === 'string') data.excerpt = body.excerpt.trim()
  if (typeof body.content === 'string') data.content = body.content.trim()
  if (typeof body.category === 'string') data.category = body.category.trim() || 'Culture'
  if (typeof body.readMins === 'number') data.readMins = body.readMins
  if (typeof body.published === 'boolean') data.published = body.published
  if (body.coverImage !== undefined) data.coverImage = body.coverImage ? String(body.coverImage) : null

  if (typeof body.title === 'string') {
    // regenerate slug if title changed
    const newSlug = body.title
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
    if (newSlug) {
      const existing = await db.article.findFirst({
        where: { slug: newSlug, NOT: { id } },
      })
      data.slug = existing ? `${newSlug}-${Date.now().toString(36).slice(-4)}` : newSlug
    }
  }

  const article = await db.article.update({ where: { id }, data })
  return NextResponse.json({ article })
}

// DELETE /api/articles/[id] — auth-gated, deletes an article
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = getTokenFromRequest(req)
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await db.article.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
