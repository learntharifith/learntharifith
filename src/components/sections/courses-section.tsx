'use client'

import * as React from 'react'
import { GraduationCap, Clock, Users, Star, BookOpen, ArrowRight, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useApp } from '@/lib/store'
import { AmazighBand } from '@/components/amazigh-pattern'

type Course = {
  id: string
  title: string
  slug: string
  description: string
  level: string
  lessonsCount: number
  durationHrs: number
  price: number
  image: string
  instructor: string
  rating: number
  students: number
}

const COURSE_GLYPHS = ['ⴰ', 'ⵔ', 'ⵙ']

export function CoursesSection() {
  const { setActiveTab, openLessonById, lessons } = useApp()
  const [courses, setCourses] = React.useState<Course[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let alive = true
    fetch('/api/courses')
      .then((r) => r.json())
      .then((d) => alive && setCourses(d.courses ?? []))
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const firstLesson = lessons[0]

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          <GraduationCap className="h-3.5 w-3.5" /> Online courses
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Guided paths from zero to fluent
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Structured courses that bundle the free video lessons into clear
          weekly paths — with practice, progress tracking and the culture of the
          Rif woven through every module.
        </p>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <CourseCard key={c.id} course={c} glyph={COURSE_GLYPHS[i % COURSE_GLYPHS.length]} />
          ))}
        </div>
      )}

      {/* Free entry CTA */}
      <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid gap-6 p-6 sm:grid-cols-[1.4fr_1fr] sm:p-8">
          <div>
            <Badge className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
              Always free
            </Badge>
            <h3 className="mt-3 text-2xl font-bold text-foreground">
              Not ready for a course? Start the free lessons now.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              All 25 video lessons are free, forever. Begin with the welcome
              video and follow the path — phonetics, pronouns, greetings and
              your first real Riffian sentences.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  if (firstLesson) openLessonById(firstLesson.id)
                }}
              >
                <PlayCircle className="h-4 w-4" /> Start lesson 1
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setActiveTab('learn')}>
                <BookOpen className="h-4 w-4" /> See all lessons
              </Button>
            </div>
          </div>
          <div className="relative hidden items-center justify-center rounded-xl bg-gradient-to-br from-primary/12 via-primary/5 to-primary/10 sm:flex">
            <div className="absolute inset-0 lt-dots opacity-50" />
            <span className="lt-tifinagh relative text-8xl font-bold text-primary/30">ⵜ</span>
          </div>
        </div>
      </div>

      <div className="mt-14 text-primary/40">
        <AmazighBand className="h-4 w-full" color="currentColor" />
      </div>
    </section>
  )
}

function CourseCard({ course, glyph }: { course: Course; glyph: string }) {
  return (
    <div className="lt-card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Cover */}
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-primary/12">
        <div className="absolute inset-0 lt-dots opacity-50" />
        <span className="lt-tifinagh relative text-7xl font-bold text-primary/30 transition-transform duration-500 group-hover:scale-110">
          {glyph}
        </span>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary backdrop-blur">
          {course.level}
        </span>
        {course.price === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Free
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="font-semibold">{course.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{course.students.toLocaleString()} students</span>
        </div>

        <h3 className="mt-2 text-base font-bold leading-snug text-foreground">
          {course.title}
        </h3>
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {course.description}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" /> {course.lessonsCount} lessons
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {course.durationHrs}h
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {course.instructor}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
          <span className="text-xl font-extrabold text-foreground">
            {course.price === 0 ? 'Free' : `€${course.price}`}
          </span>
          <Button
            size="sm"
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Enrol <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
