import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { unlinkSync, existsSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

const UPLOAD_DIR = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads')

// PUT /api/admin/videos/[id] — update video metadata
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
  if (typeof body.title === 'string') data.title = body.title
  if (typeof body.description === 'string') data.description = body.description
  if (typeof body.isPrivate === 'boolean') data.isPrivate = body.isPrivate
  if (typeof body.series === 'string') data.series = body.series || null
  if (typeof body.order === 'number') data.order = body.order

  const video = await db.video.update({ where: { id }, data })
  return NextResponse.json({ video })
}

// DELETE /api/admin/videos/[id] — delete video + file
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = getTokenFromRequest(req)
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const video = await db.video.findUnique({ where: { id } })
  if (!video) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Delete the file from disk
  const fileName = video.filePath.split('/').pop()
  if (fileName) {
    const fullPath = join(UPLOAD_DIR, fileName)
    if (existsSync(fullPath)) {
      try {
        unlinkSync(fullPath)
      } catch {
        /* ignore file deletion errors */
      }
    }
  }

  // Delete from database (cascades to VideoAccess)
  await db.video.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
