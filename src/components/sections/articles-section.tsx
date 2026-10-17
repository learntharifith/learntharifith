'use client'

import * as React from 'react'
import { Newspaper, Clock, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useApp } from '@/lib/store'
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

export function ArticlesSection() {
  const { setActiveTab } = useApp()
  const [articles, setArticles] = React.useState<Article[]>([])
  const [loading, setLoading] = React.useState(true)
  const [openArticle, setOpenArticle] = React.useState<Article | null>(null)
  const [activeCat, setActiveCat] = React.useState<string>('all')

  React.useEffect(() => {
    let alive = true
    fetch('/api/articles')
      .then((r) => r.json())
      .then((d) => alive && setArticles(d.articles ?? []))
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const categories = React.useMemo(() => {
    const s = new Set<string>()
    articles.forEach((a) => s.add(a.category))
    return ['all', ...Array.from(s)]
  }, [articles])

  const filtered = React.useMemo(
    () => (activeCat === 'all' ? articles : articles.filter((a) => a.category === activeCat)),
    [articles, activeCat],
  )

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          <Newspaper className="h-3.5 w-3.5" /> Articles
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Stories, essays &amp; deep dives
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Long-form writing on the Amazigh world — Yennayer, Tifinagh, music,
          tattoos, folklore and the history that shapes the Riffian language.
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 2 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeCat === c
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      )}

      {/* Articles grid */}
      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <Newspaper className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">No articles yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((a) => (
              <ArticleCard key={a.id} article={a} onOpen={() => setOpenArticle(a)} />
            ))}
          </div>
        )}
      </div>

      {/* Article reader */}
      {openArticle && (
        <ArticleReader article={openArticle} onClose={() => setOpenArticle(null)} />
      )}

      {/* CTA */}
      <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h3 className="text-xl font-bold text-foreground">Want to learn Riffian?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Dive into the free video lessons — phonetics, grammar and
            conversation.
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
      className="lt-card-hover-gold group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm"
    >
      {/* Cover image (from Ko-fi shop) or decorative gradient */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-primary/10">
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 lt-dots opacity-60" />
        )}
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
  // Simple markdown-ish render
  const blocks: React.ReactNode[] = []
  let list: string[] = []
  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="my-3 list-disc space-y-1 pl-6">
          {list.map((li, i) => (
            <li key={i} className="text-sm leading-relaxed">
              {li}
            </li>
          ))}
        </ul>,
      )
      list = []
    }
  }
  article.content.split('\n').forEach((raw, i) => {
    const line = raw.trim()
    if (!line) {
      flushList()
      return
    }
    if (line.startsWith('### ')) {
      flushList()
      blocks.push(
        <h3 key={i} className="mt-5 mb-2 text-base font-bold text-foreground">
          {line.slice(4)}
        </h3>,
      )
    } else if (line.startsWith('## ')) {
      flushList()
      blocks.push(
        <h2 key={i} className="mt-6 mb-2.5 text-lg font-bold text-foreground">
          {line.slice(3)}
        </h2>,
      )
    } else if (line.startsWith('# ')) {
      flushList()
      blocks.push(
        <h1 key={i} className="mt-6 mb-3 text-xl font-extrabold text-foreground">
          {line.slice(2)}
        </h1>,
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      list.push(line.slice(2))
    } else {
      flushList()
      blocks.push(
        <p key={i} className="my-3 text-sm leading-relaxed text-foreground/85">
          {line}
        </p>,
      )
    }
  })
  flushList()

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
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close article"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <h2 className="mt-3 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
          {article.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {article.readMins} min read
        </p>
        {article.coverImage ? (
          <div className="mt-5 h-48 overflow-hidden rounded-xl">
            <img
              src={article.coverImage}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="mt-5 h-32 overflow-hidden rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-primary/10">
            <div className="h-full w-full lt-dots opacity-60" />
          </div>
        )}
        <article className="prose prose-sm mt-6 max-w-none text-foreground/85">{blocks}</article>
      </div>
    </div>
  )
}
