'use client'

import { PlayCircle, BookOpen, Sparkles, Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/store'
import { AmazighField, AmazighBand } from '@/components/amazigh-pattern'
import { ShareBar } from '@/components/share-buttons'

export function Hero({ totalLessons }: { totalLessons: number }) {
  const { setActiveTab, lessons, openLessonById } = useApp()

  const firstLesson = lessons[0]
  const featured = lessons.filter((l) => l.featured).slice(0, 3)

  return (
    <section className="relative overflow-hidden">
      {/* Decorative field */}
      <div className="lt-sand-bg absolute inset-0 -z-10" />
      {/* Generated Amazigh art as subtle background texture */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 -z-10 h-[520px] w-[520px] rounded-full opacity-[0.12] blur-[2px] mix-blend-multiply dark:opacity-[0.18] dark:mix-blend-screen"
        style={{
          backgroundImage: 'url(/images/hero-art.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />
      <AmazighField
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-primary/[0.07]"
        color="currentColor"
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left — copy */}
          <div className="lt-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Free Amazigh Riffian lessons
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Learn{' '}
              <span className="lt-gradient-text">Riffian</span>
              <br className="hidden sm:block" /> language.
            </h1>

            <p className="mt-3 text-2xl font-medium text-muted-foreground sm:text-3xl">
              ⵜⴰⵔⵉⴼⵉⵜ — the voice of the Rif.
            </p>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg">
              Structured video lessons that take you from your first Riffian
              sounds to real conversations — paired with the culture, stories
              and symbols that give the language its soul.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="h-12 gap-2 bg-primary px-6 text-base text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  if (firstLesson) openLessonById(firstLesson.id)
                }}
              >
                <PlayCircle className="h-5 w-5" />
                Start lesson 1
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 px-6 text-base"
                onClick={() => setActiveTab('learn')}
              >
                <BookOpen className="h-5 w-5" />
                Browse all lessons
              </Button>
            </div>

            {/* Stats */}
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border/60 pt-6">
              <Stat value={String(totalLessons)} label="Video lessons" />
              <Stat value="4" label="Learning levels" />
              <Stat value="100%" label="Free, forever" />
            </dl>

            {/* Share buttons */}
            <div className="mt-6">
              <ShareBar />
            </div>
          </div>

          {/* Right — featured lessons stack */}
          <div className="lt-fade-up relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/15 via-primary/10 to-primary/10 blur-2xl" />
            <div className="grid gap-4">
              {featured.map((l, i) => (
                <FeaturedRow key={l.id} lesson={l} index={i} />
              ))}
            </div>

            {/* zigzag band */}
            <div className="mt-6 text-primary/50">
              <AmazighBand className="h-4 w-full" color="currentColor" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-2xl font-extrabold text-foreground sm:text-3xl">{value}</dt>
      <dd className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{label}</dd>
    </div>
  )
}

function FeaturedRow({
  lesson,
  index,
}: {
  lesson: ReturnType<typeof useApp.getState>['lessons'][number]
  index: number
}) {
  const { openLessonById } = useApp()
  return (
    <button
      onClick={() => openLessonById(lesson.id)}
      style={{ animationDelay: `${120 + index * 90}ms` }}
      className="lt-fade-up lt-card-hover group flex items-center gap-4 rounded-2xl border border-border bg-card/90 p-3 text-left shadow-sm backdrop-blur"
    >
      <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-20 sm:w-32">
        <img
          src={lesson.thumbnail}
          alt={lesson.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 grid place-items-center bg-black/25 opacity-0 transition group-hover:opacity-100">
          <PlayCircle className="h-7 w-7 text-white" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{lesson.title}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
          {lesson.description}
        </p>
        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-primary">
          <Globe2 className="h-3 w-3" />
          {lesson.level}
        </span>
      </div>
    </button>
  )
}
