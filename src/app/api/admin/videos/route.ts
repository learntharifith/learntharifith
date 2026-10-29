import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

const UPLOAD_DIR = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads')

// GET /api/admin/videos — list all videos
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const videos = await db.video.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ videos })
}

// POST /api/admin/videos — upload a new video (multipart form data)
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string | null
    const description = formData.get('description') as string | null
    const isPrivate = formData.get('isPrivate') === 'true'
    const series = formData.get('series') as string | null
    const order = Number(formData.get('order')) || 0

    if (!file || !title) {
      return NextResponse.json(
        { error: 'File and title are required' },
        { status: 400 },
      )
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Only video files are allowed' },
        { status: 400 },
      )
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true })
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'mp4'
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filePath = join(UPLOAD_DIR, uniqueName)
    const relativePath = `/uploads/${uniqueName}`

    // Write file to disk
    const bytes = await file.arrayBuffer()
    writeFileSync(filePath, Buffer.from(bytes))

    // Save to database
    const video = await db.video.create({
      data: {
        title,
        description: description || '',
        fileName: file.name,
        filePath: relativePath,
        fileSize: file.size,
        mimeType: file.type || 'video/mp4',
        isPrivate,
        series: isPrivate ? (series || 'Private Series') : null,
        order,
      },
    })

    return NextResponse.json({ video }, { status: 201 })
  } catch (err) {
    console.error('Video upload error:', err)
    return NextResponse.json(
      { error: 'Upload failed: ' + (err as Error).message },
      { status: 500 },
    )
  }
}
