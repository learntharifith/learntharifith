'use client'

import { CheckCircle2, Clock, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp, LEVEL_META, type LessonLite } from '@/lib/store'

const LEVEL_SHORT: Record<string, string> = {
  intro: 'Start here',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  culture: 'Culture',
}

export function LessonCard({ lesson }: { lesson: LessonLite }) {
  const { openLessonById, isCompleted } = useApp()
  const done = isCompleted(lesson.id)
  const meta = LEVEL_META[lesson.level] ?? LEVEL_META.beginner

  return (
    <button
      onClick={() => openLessonById(lesson.id)}
      className={cn(
        'lt-card-hover-gold group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card text-left shadow-sm',
        done ? 'border-primary/40' : 'border-border',
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={lesson.thumbnail}
          alt={lesson.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />

        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="lt-pulse grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
            <PlayCircle className="h-6 w-6" />
          </span>
        </div>

        {/* Level chip */}
        <span
          className={cn(
            'absolute left-2.5 top-2.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur',
            meta.chip,
          )}
        >
          {LEVEL_SHORT[lesson.level] ?? lesson.level}
        </span>

        {/* Duration */}
        {lesson.durationMins > 0 && (
          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-medium text-white">
            <Clock className="h-3 w-3" />
            {lesson.durationMins} min
          </span>
        )}

        {/* Completed badge */}
        {done && (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow">
            <CheckCircle2 className="h-3 w-3" /> Done
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {lesson.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {lesson.description}
        </p>
      </div>
    </button>
  )
}
