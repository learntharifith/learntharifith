'use client'

import * as React from 'react'
import { BookOpen, Clock, PlayCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useApp } from '@/lib/store'
import { LessonCard } from '@/components/lesson-card'
import { AmazighBand } from '@/components/amazigh-pattern'

type Article = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  category: string
  readMins: number
}

export function CultureSection() {
  const { lessons, setActiveTab } = useApp()
  const cultureLessons = lessons.filter((l) => l.level === 'culture')

  const [articles, setArticles] = React.useState<Article[]>([])
  const [loading, setLoading] = React.useState(true)
  const [openArticle, setOpenArticle] = React.useState<Article | null>(null)

  React.useEffect(() => {
    let alive = true
    fetch('/api/articles')
      .then((r) => r.json())
      .then((d) => {
        if (alive) setArticles(d.articles ?? [])
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Culture banner */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-border">
        <img
          src="/images/culture-art.png"
          alt="The Rif mountains at golden sunset with Amazigh symbols"
          className="h-44 w-full object-cover sm:h-56 md:h-64"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <BookOpen className="h-3.5 w-3.5" /> Culture of the Rif
          </span>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-white drop-shadow sm:text-4xl">
            The world behind the words
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
            A language is only alive when you know the stories it carries — its
            saints, its New Year, its tattoos and its songs.
          </p>
        </div>
      </div>

      {/* Culture videos */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold text-foreground">Culture &amp; stories — videos</h3>
        {cultureLessons.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cultureLessons.map((l) => (
              <LessonCard key={l.id} lesson={l} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        )}
      </div>

      {/* Articles */}
      <div className="mt-14">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h3 className="text-lg font-bold text-foreground">Articles &amp; essays</h3>
          <span className="text-sm text-muted-foreground">
            {articles.length} {articles.length === 1 ? 'piece' : 'pieces'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <p className="text-sm text-muted-foreground">No articles yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} onOpen={() => setOpenArticle(a)} />
            ))}
          </div>
        )}
      </div>

      {/* Article reader */}
      {openArticle && (
        <ArticleReader article={openArticle} onClose={() => setOpenArticle(null)} />
      )}

      {/* CTA to lessons */}
      <div className="mt-14 flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h3 className="text-xl font-bold text-foreground">Ready to speak Riffian?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Jump into the structured video lessons — from phonetics to real
            conversations.
          </p>
        </div>
        <Button
          onClick={() => setActiveTab('learn')}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Go to lessons <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-14 text-primary/40">
        <AmazighBand className="h-4 w-full" color="currentColor" />
      </div>
    </section>
  )
}

function ArticleCard({ article, onOpen }: { article: Article; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="lt-card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm"
    >
      {/* Decorative cover (since we have no real images) */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-primary/10">
        <div className="absolute inset-0 lt-dots opacity-60" />
        <span className="absolute bottom-2.5 left-3 inline-flex items-center gap-1 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary backdrop-blur">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
          {article.title}
        </h4>
        <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {article.readMins} min read
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-primary">
            Read <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </button>
  )
}

function ArticleReader({ article, onClose }: { article: Article; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="my-8 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <Badge variant="outline" className="rounded-full">
            {article.category}
          </Badge>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close article"
          >
            ✕
          </button>
        </div>
        <h2 className="mt-3 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
          {article.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {article.readMins} min read
        </p>
        <div className="mt-5 h-32 overflow-hidden rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-primary/10">
          <div className="h-full w-full lt-dots opacity-60" />
        </div>
        <article className="prose prose-sm mt-6 max-w-none text-foreground/85">
          {article.content.split('\n').map((p, i) => (
            <p key={i} className="mb-4 leading-relaxed">
              {p}
            </p>
          ))}
        </article>
      </div>
    </div>
  )
}
