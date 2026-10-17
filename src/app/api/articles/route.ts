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

// GET /api/articles — public, returns published articles
export async function GET() {
  const articles = await db.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      category: true,
      readMins: true,
      createdAt: true,
    },
  })
  return NextResponse.json({ articles })
}

// POST /api/articles — auth-gated, creates a new article
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body || !body.title || !body.content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
  }

  const title = String(body.title).trim()
  const content = String(body.content).trim()
  const excerpt = String(body.excerpt || '').trim() || content.slice(0, 160) + '…'
  const category = String(body.category || 'Culture').trim() || 'Culture'
  const readMins = Number(body.readMins) || Math.max(1, Math.round(content.split(/\s+/).length / 200))
  const published = body.published !== false // default true
  const coverImage = body.coverImage ? String(body.coverImage) : null

  // Generate a unique slug
  let slug = slugify(title) || `article-${Date.now()}`
  const existing = await db.article.findUnique({ where: { slug } })
  if (existing) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`
  }

  const article = await db.article.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      readMins,
      published,
    },
  })

  return NextResponse.json({ article }, { status: 201 })
}
