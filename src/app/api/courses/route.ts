import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const courses = await db.course.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      level: true,
      lessonsCount: true,
      durationHrs: true,
      price: true,
      image: true,
      instructor: true,
      rating: true,
      students: true,
    },
  })
  return NextResponse.json({ courses })
}
