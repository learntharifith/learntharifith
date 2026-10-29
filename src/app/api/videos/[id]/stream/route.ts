import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyUserToken } from '@/lib/user-auth'
import { createReadStream, statSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

const UPLOAD_DIR = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads')

// GET /api/videos/[id]/stream — stream a video file
// Public videos: anyone can watch. Private videos: requires user token + access.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const video = await db.video.findUnique({ where: { id } })
  if (!video) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // If private, check user access
  if (video.isPrivate) {
    const token = getTokenFromRequest(req)
    const payload = verifyUserToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    const access = await db.videoAccess.findFirst({
      where: { userId: payload.userId, videoId: video.id },
    })
    if (!access) {
      return NextResponse.json({ error: 'Access denied — unlock this series first' }, { status: 403 })
    }
  }

  // Serve the file
  const fileName = video.filePath.split('/').pop()
  if (!fileName) {
    return NextResponse.json({ error: 'Invalid file path' }, { status: 500 })
  }

  const fullPath = join(UPLOAD_DIR, fileName)
  try {
    const stat = statSync(fullPath)
    const fileSize = stat.size
    const range = req.headers.get('range')

    if (range) {
      // Handle range requests (for video seeking)
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunkSize = end - start + 1

      const stream = createReadStream(fullPath, { start, end })
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunkSize),
        'Content-Type': video.mimeType,
      }

      const readable = new ReadableStream({
        start(controller) {
          stream.on('data', (chunk) => controller.enqueue(chunk))
          stream.on('end', () => controller.close())
          stream.on('error', (err) => controller.error(err))
        },
      })

      return new NextResponse(readable, { status: 206, headers })
    } else {
      const stream = createReadStream(fullPath)
      const headers = {
        'Content-Length': String(fileSize),
        'Content-Type': video.mimeType,
        'Accept-Ranges': 'bytes',
      }

      const readable = new ReadableStream({
        start(controller) {
          stream.on('data', (chunk) => controller.enqueue(chunk))
          stream.on('end', () => controller.close())
          stream.on('error', (err) => controller.error(err))
        },
      })

      return new NextResponse(readable, { status: 200, headers })
    }
  } catch {
    return NextResponse.json({ error: 'File not found on disk' }, { status: 404 })
  }
}
