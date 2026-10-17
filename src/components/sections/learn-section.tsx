'use client'

import * as React from 'react'
import { Search, Filter, CheckCircle2, X, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useApp, LEVEL_LABELS, LEVEL_META, type LevelFilter } from '@/lib/store'
import { LessonCard } from '@/components/lesson-card'
import { AmazighBand } from '@/components/amazigh-pattern'

// Culture videos live in the Culture section — Learn only shows the learning path.
const LEVELS: LevelFilter[] = ['all', 'intro', 'beginner', 'intermediate']

export function LearnSection() {
  const { lessons, level, setLevel, query, setQuery, completed } = useApp()

  // Exclude culture videos — they belong to the Culture tab now
  const learnLessons = React.useMemo(
    () => lessons.filter((l) => l.level !== 'culture'),
    [lessons],
  )

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return learnLessons.filter((l) => {
      if (level !== 'all' && l.level !== level) return false
      if (q) {
        const hay = `${l.title} ${l.description} ${l.level}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [learnLessons, level, query])

  const doneCount = completed.size
  const totalForProgress = learnLessons.length
  const pct = totalForProgress > 0 ? Math.round((doneCount / totalForProgress) * 100) : 0

  // group filtered by level for the "all" view
  const grouped = React.useMemo(() => {
    const g: Record<string, typeof lessons> = {}
    for (const l of filtered) {
      ;(g[l.level] ||= []).push(l)
    }
    return g
  }, [filtered])

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Heading */}
      <div className="flex flex-col gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Lessons
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          The full Riffian learning path
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          {learnLessons.length} video lessons organised from your very first
          sounds to confident conversations. Click any lesson to play it — your
          progress is saved on this device. Culture videos live in the Culture
          tab.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Your progress</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {doneCount} / {totalForProgress} lessons · {pct}%
          </span>
        </div>
        <Progress value={pct} className="mt-3 h-2" />
      </div>

      {/* Search + filters */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons — e.g. pronouns, greetings, Yennayer…"
            className="h-11 pl-9 pr-9"
            aria-label="Search lessons"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden items-center gap-1 text-xs font-medium text-muted-foreground sm:inline-flex">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          {LEVELS.map((lv) => (
            <button
              key={lv}
              onClick={() => setLevel(lv)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                level === lv
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-foreground',
              )}
            >
              {LEVEL_LABELS[lv]}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="mt-4 text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span>{' '}
        {filtered.length === 1 ? 'lesson' : 'lessons'}
        {level !== 'all' && ` in ${LEVEL_LABELS[level]}`}
        {query && ` matching “${query}”`}
      </p>

      {/* Lessons */}
      {filtered.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <Search className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium text-foreground">No lessons found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or clear your filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setQuery('')
              setLevel('all')
            }}
          >
            Reset filters
          </Button>
        </div>
      ) : level === 'all' ? (
        <div className="mt-6 space-y-12">
          {LEVELS.filter((l) => l !== 'all').map((lv) => {
            const items = grouped[lv] ?? []
            if (items.length === 0) return null
            const meta = LEVEL_META[lv]
            return (
              <div key={lv}>
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                      <span
                        className={cn(
                          'rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                          meta.chip,
                        )}
                      >
                        {meta.label}
                      </span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {items.length} {items.length === 1 ? 'lesson' : 'lessons'}
                      </span>
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{meta.blurb}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((l) => (
                    <LessonCard key={l.id} lesson={l} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((l) => (
            <LessonCard key={l.id} lesson={l} />
          ))}
        </div>
      )}

      {/* Closing band */}
      <div className="mt-14 text-primary/40">
        <AmazighBand className="h-4 w-full" color="currentColor" />
      </div>
    </section>
  )
}
