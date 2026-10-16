'use client'

import * as React from 'react'
import {
  Compass,
  Sprout,
  TrendingUp,
  BookHeart,
  ArrowRight,
  PlayCircle,
  Coffee,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp, LEVEL_META } from '@/lib/store'
import { Hero } from '@/components/sections/hero'
import { LessonCard } from '@/components/lesson-card'
import { AmazighBand } from '@/components/amazigh-pattern'

type ArticleLite = {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  readMins: number
}
type CourseLite = {
  id: string
  title: string
  slug: string
  description: string
  level: string
  lessonsCount: number
  durationHrs: number
  price: number
  rating: number
  students: number
}

const KOFI_1 = 'https://ko-fi.com/summary/06275ede-c500-4330-93ee-f52addb9eabb'

export function HomeContent() {
  const { lessons, setActiveTab, completed } = useApp()
  const featured = lessons.filter((l) => l.featured).slice(0, 8)

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { intro: 0, beginner: 0, intermediate: 0, culture: 0 }
    for (const l of lessons) c[l.level] = (c[l.level] || 0) + 1
    return c
  }, [lessons])

  const [articles, setArticles] = React.useState<ArticleLite[]>([])
  const [courses, setCourses] = React.useState<CourseLite[]>([])

  React.useEffect(() => {
    fetch('/api/articles')
      .then((r) => r.json())
      .then((d) => setArticles((d.articles ?? []).slice(0, 3)))
      .catch(() => {})
    fetch('/api/courses')
      .then((r) => r.json())
      .then((d) => setCourses((d.courses ?? []).slice(0, 3)))
      .catch(() => {})
  }, [])

  return (
    <>
      <Hero totalLessons={lessons.length} />

      {/* Learning path overview */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Compass className="h-3.5 w-3.5" /> The path
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Four steps, one language
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Follow the path in order or jump to whatever you need. Each level
            builds on the last, so by the end you can hold a real Riffian
            conversation.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PathCard
            icon={<Sparkles className="h-5 w-5" />}
            level="intro"
            count={counts.intro ?? 0}
            onClick={() => setActiveTab('learn')}
          />
          <PathCard
            icon={<Sprout className="h-5 w-5" />}
            level="beginner"
            count={counts.beginner ?? 0}
            onClick={() => setActiveTab('learn')}
          />
          <PathCard
            icon={<TrendingUp className="h-5 w-5" />}
            level="intermediate"
            count={counts.intermediate ?? 0}
            onClick={() => setActiveTab('learn')}
          />
          <PathCard
            icon={<BookHeart className="h-5 w-5" />}
            level="culture"
            count={counts.culture ?? 0}
            onClick={() => setActiveTab('learn')}
          />
        </div>
      </section>

      {/* Featured lessons */}
      <section className="bg-card/40 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <PlayCircle className="h-3.5 w-3.5" /> Featured
              </span>
              <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Start with these
              </h2>
            </div>
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => setActiveTab('learn')}
            >
              All lessons <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((l) => (
              <LessonCard key={l.id} lesson={l} />
            ))}
          </div>
        </div>
      </section>

      {/* Continue learning strip (only if some completed) */}
      {completed.size > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <ContinueStrip />
        </section>
      )}

      {/* Culture preview */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <BookHeart className="h-3.5 w-3.5" /> Culture
            </span>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Stories of the Rif
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              The language lives in its stories. Read, watch and understand the
              world your new words come from.
            </p>
          </div>
          <Button variant="outline" className="gap-1.5" onClick={() => setActiveTab('culture')}>
            All culture <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-2xl border border-border bg-muted/40"
                />
              ))
            : articles.map((a) => (
                <div
                  key={a.id}
                  className="lt-card-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                >
                  <div className="relative h-28 overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-primary/10">
                    <div className="absolute inset-0 lt-dots opacity-60" />
                    <span className="absolute bottom-2.5 left-3 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary backdrop-blur">
                      {a.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                      {a.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                      {a.excerpt}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* Courses preview */}
      <section className="bg-card/40 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <GraduationCap className="h-3.5 w-3.5" /> Courses
              </span>
              <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Guided courses
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Want a structured weekly path with progress tracking? The
                courses bundle the free lessons into clear journeys.
              </p>
            </div>
            <Button variant="outline" className="gap-1.5" onClick={() => setActiveTab('courses')}>
              All courses <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-2xl border border-border bg-muted/40"
                  />
                ))
              : courses.map((c) => (
                  <div
                    key={c.id}
                    className="lt-card-hover flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                  >
                    <div className="relative flex h-28 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-primary/12">
                      <div className="absolute inset-0 lt-dots opacity-50" />
                      <span className="lt-tifinagh text-6xl font-bold text-primary/30">
                        ⵄ
                      </span>
                      <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary backdrop-blur">
                        {c.level}
                      </span>
                      {c.price === 0 && (
                        <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                          Free
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="text-sm font-bold leading-snug text-foreground">
                        {c.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                        {c.description}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span>{c.lessonsCount} lessons</span>
                        <span>·</span>
                        <span>{c.durationHrs}h</span>
                        <span>·</span>
                        <span>★ {c.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.07] via-card to-card">
          <div className="grid items-center gap-6 p-6 sm:grid-cols-[1.3fr_1fr] sm:p-10">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Coffee className="h-3.5 w-3.5" /> Keep it free
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Free Riffian lessons, made possible by you
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                No ads. No paywalls. Just a language being taught the way it
                should be. If these lessons helped you, a coffee keeps the next
                one free for someone else.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <a href={KOFI_1} target="_blank" rel="noreferrer noopener">
                    <Coffee className="h-4 w-4" /> Buy me a coffee
                  </a>
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('support')}>
                  Other ways to support
                </Button>
              </div>
            </div>
            <div className="relative hidden items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 sm:flex">
              <div className="absolute inset-0 lt-dots opacity-50" />
              <div className="relative text-center">
                <div className="lt-tifinagh text-6xl font-bold text-primary/40">ⵣ</div>
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Yaz — the free Amazigh
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-border/60 text-primary/40">
            <AmazighBand className="h-4 w-full" color="currentColor" />
          </div>
        </div>
      </section>
    </>
  )
}

function PathCard({
  icon,
  level,
  count,
  onClick,
}: {
  icon: React.ReactNode
  level: 'intro' | 'beginner' | 'intermediate' | 'culture'
  count: number
  onClick: () => void
}) {
  const meta = LEVEL_META[level]
  return (
    <button
      onClick={onClick}
      className={`lt-card-hover group flex flex-col items-start rounded-2xl border border-border bg-card p-5 text-left shadow-sm ${meta.chip}`}
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-card/80 text-primary ring-1 ring-border">
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-bold text-foreground">{meta.label}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{meta.blurb}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        {count} {count === 1 ? 'lesson' : 'lessons'}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  )
}

function ContinueStrip() {
  const { lessons, completed, openLessonById, setActiveTab } = useApp()
  const next = lessons.find((l) => !completed.has(l.id))
  if (!next) return null
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-primary/30 bg-primary/[0.05] p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
          <img src={next.thumbnail} alt={next.title} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Continue learning
          </p>
          <h3 className="text-base font-bold text-foreground">{next.title}</h3>
          <p className="text-xs text-muted-foreground">
            {completed.size} of {lessons.length} lessons complete
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => openLessonById(next.id)}
        >
          <PlayCircle className="h-4 w-4" /> Continue
        </Button>
        <Button variant="outline" onClick={() => setActiveTab('learn')}>
          All lessons
        </Button>
      </div>
    </div>
  )
}
