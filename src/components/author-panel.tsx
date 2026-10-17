'use client'

import * as React from 'react'
import {
  X, Lock, FileText, Plus, Pencil, Trash2, Eye, EyeOff,
  Save, LogOut, Newspaper, Loader2,
} from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Article = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  category: string
  readMins: number
  published: boolean
  createdAt: string
}

const CATEGORIES = ['Culture', 'Tradition', 'Language', 'Music', 'Heritage', 'News']

export function AuthorPanel({
  open,
  onClose,
  onArticlesChanged,
}: {
  open: boolean
  onClose: () => void
  onArticlesChanged: () => void
}) {
  const [token, setToken] = React.useState<string | null>(null)
  const [password, setPassword] = React.useState('')
  const [loginLoading, setLoginLoading] = React.useState(false)

  // Load token from localStorage on mount
  React.useEffect(() => {
    if (!open) return
    const saved = localStorage.getItem('lt:authorToken')
    if (saved) setToken(saved)
  }, [open])

  const [lockoutMsg, setLockoutMsg] = React.useState<string | null>(null)

  const handleLogin = async () => {
    setLoginLoading(true)
    setLockoutMsg(null)
    try {
      const r = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await r.json()
      if (!r.ok) {
        if (r.status === 429) {
          // Locked out
          const mins = data.retryAfter ? Math.ceil(data.retryAfter / 60) : 15
          setLockoutMsg(`Too many attempts. Try again in ${mins} minute(s).`)
          toast.error(`Locked out for ${mins} min`)
        } else if (typeof data.attemptsLeft === 'number') {
          setLockoutMsg(
            data.attemptsLeft > 0
              ? `Wrong password. ${data.attemptsLeft} attempt(s) left.`
              : 'Wrong password. Account locked — try again later.',
          )
          toast.error(`Wrong password — ${data.attemptsLeft} left`)
        } else {
          toast.error(data.error || 'Login failed')
        }
        return
      }
      localStorage.setItem('lt:authorToken', data.token)
      setToken(data.token)
      setPassword('')
      setLockoutMsg(null)
      toast.success('Welcome back, author 👋')
    } catch {
      toast.error('Network error — try again')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('lt:authorToken')
    setToken(null)
    toast.success('Logged out')
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border-border bg-card p-0"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">Author panel</DialogTitle>
        <DialogDescription className="sr-only">
          Write and manage articles for the Culture section.
        </DialogDescription>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-primary/[0.04] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
              <Newspaper className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-foreground">Author panel</h2>
              <p className="text-[11px] text-muted-foreground">
                Write articles for the Culture section
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {token && (
              <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={handleLogout}>
                <LogOut className="h-3.5 w-3.5" /> Logout
              </Button>
            )}
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[78vh] overflow-y-auto lt-scroll">
          {!token ? (
            <LoginForm
              password={password}
              setPassword={setPassword}
              loading={loginLoading}
              lockoutMsg={lockoutMsg}
              onSubmit={handleLogin}
            />
          ) : (
            <AuthorDashboard token={token} onArticlesChanged={onArticlesChanged} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Login form ──────────────────────────────────────────────────────
function LoginForm({
  password,
  setPassword,
  loading,
  lockoutMsg,
  onSubmit,
}: {
  password: string
  setPassword: (s: string) => void
  loading: boolean
  lockoutMsg: string | null
  onSubmit: () => void
}) {
  const [show, setShow] = React.useState(false)
  const isLocked = lockoutMsg?.includes('Too many') ?? false
  return (
    <div className="mx-auto max-w-sm p-8">
      <div className="mb-6 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-foreground">Author login</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your password to write and manage articles.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="author-pass" className="text-xs font-semibold">
            Password
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="author-pass"
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your author password"
              className="h-11 pr-10"
              autoFocus
              autoComplete="current-password"
              disabled={isLocked}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {lockoutMsg && (
          <div className={`rounded-lg border px-3 py-2 text-xs font-medium ${isLocked ? 'border-destructive/30 bg-destructive/5 text-destructive' : 'border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400'}`}>
            {lockoutMsg}
          </div>
        )}
        <Button
          type="submit"
          disabled={loading || !password || isLocked}
          className="h-11 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}

// ─── Author dashboard (list + editor) ────────────────────────────────
function AuthorDashboard({
  token,
  onArticlesChanged,
}: {
  token: string
  onArticlesChanged: () => void
}) {
  const [articles, setArticles] = React.useState<Article[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editing, setEditing] = React.useState<Article | null>(null)
  const [showEditor, setShowEditor] = React.useState(false)

  const loadArticles = React.useCallback(async () => {
    setLoading(true)
    try {
      // Fetch ALL articles (including unpublished) — we use the public endpoint
      // for published, and trust the author sees what's published + their own.
      // For simplicity, we fetch published; unpublished only show in editor flow.
      const r = await fetch('/api/articles')
      const data = await r.json()
      setArticles(data.articles ?? [])
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadArticles()
  }, [loadArticles])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Article deleted')
      loadArticles()
      onArticlesChanged()
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleTogglePublish = async (a: Article) => {
    try {
      await fetch(`/api/articles/${a.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: !a.published }),
      })
      toast.success(a.published ? 'Unpublished' : 'Published 🎉')
      loadArticles()
      onArticlesChanged()
    } catch {
      toast.error('Update failed')
    }
  }

  const handleEditorClose = () => {
    setShowEditor(false)
    setEditing(null)
  }
  const handleEditorSaved = () => {
    handleEditorClose()
    loadArticles()
    onArticlesChanged()
  }

  if (showEditor || editing) {
    return (
      <ArticleEditor
        token={token}
        article={editing}
        onClose={handleEditorClose}
        onSaved={handleEditorSaved}
      />
    )
  }

  return (
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">
          Articles ({articles.length})
        </h3>
        <Button
          size="sm"
          className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowEditor(true)}
        >
          <Plus className="h-3.5 w-3.5" /> New article
        </Button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">No articles yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Click “New article” to write your first piece.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {articles.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{a.title}</p>
                  {a.published ? (
                    <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">Live</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {a.category} · {a.readMins} min read ·{' '}
                  {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => handleTogglePublish(a)}
                  title={a.published ? 'Unpublish' : 'Publish'}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {a.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setEditing(a)}
                  title="Edit"
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(a.id, a.title)}
                  title="Delete"
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Article editor ──────────────────────────────────────────────────
function ArticleEditor({
  token,
  article,
  onClose,
  onSaved,
}: {
  token: string
  article: Article | null
  onClose: () => void
  onSaved: () => void
}) {
  const [title, setTitle] = React.useState(article?.title ?? '')
  const [excerpt, setExcerpt] = React.useState(article?.excerpt ?? '')
  const [content, setContent] = React.useState(article?.content ?? '')
  const [category, setCategory] = React.useState(article?.category ?? 'Culture')
  const [coverImage, setCoverImage] = React.useState(article?.coverImage ?? '')
  const [published, setPublished] = React.useState(article?.published ?? true)
  const [saving, setSaving] = React.useState(false)
  const [showPreview, setShowPreview] = React.useState(false)

  const isEdit = Boolean(article)
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const autoReadMins = Math.max(1, Math.round(wordCount / 200))

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim() || content.slice(0, 160) + '…',
        content: content.trim(),
        category,
        coverImage: coverImage.trim() || null,
        published,
        readMins: autoReadMins,
      }
      const r = await fetch(
        isEdit ? `/api/articles/${article!.id}` : '/api/articles',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      )
      const data = await r.json()
      if (!r.ok) {
        toast.error(data.error || 'Save failed')
        return
      }
      toast.success(isEdit ? 'Article updated 🎉' : 'Article published 🎉')
      onSaved()
    } catch {
      toast.error('Network error — try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">
          {isEdit ? 'Edit article' : 'New article'}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setShowPreview((p) => !p)}
          >
            {showPreview ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      {showPreview ? (
        <ArticlePreview title={title} excerpt={excerpt} content={content} category={category} />
      ) : (
        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="art-title" className="text-xs font-semibold">
              Title
            </Label>
            <Input
              id="art-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Tifinagh script: writing the Amazigh voice"
              className="mt-1.5 h-11 text-base font-semibold"
              autoFocus
            />
          </div>

          {/* Category + published */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="art-cat" className="text-xs font-semibold">
                Category
              </Label>
              <select
                id="art-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Status</Label>
              <div className="mt-1.5 flex h-11 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPublished(true)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-sm font-medium transition',
                    published
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'border-border text-muted-foreground hover:bg-muted',
                  )}
                >
                  Published
                </button>
                <button
                  type="button"
                  onClick={() => setPublished(false)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-sm font-medium transition',
                    !published
                      ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                      : 'border-border text-muted-foreground hover:bg-muted',
                  )}
                >
                  Draft
                </button>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="art-excerpt" className="text-xs font-semibold">
              Excerpt <span className="font-normal text-muted-foreground">(optional — auto-generated if empty)</span>
            </Label>
            <Textarea
              id="art-excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short summary shown on the article card…"
              className="mt-1.5 min-h-[60px] resize-y"
              rows={2}
            />
          </div>

          {/* Cover image URL */}
          <div>
            <Label htmlFor="art-cover" className="text-xs font-semibold">
              Cover image URL <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="art-cover"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://…"
              className="mt-1.5 h-10"
            />
          </div>

          {/* Content (markdown) */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="art-content" className="text-xs font-semibold">
                Content <span className="font-normal text-muted-foreground">(Markdown supported)</span>
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {wordCount} words · ~{autoReadMins} min read
              </span>
            </div>
            <Textarea
              id="art-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={'Write your article here…\n\n## A heading\n\nYour paragraph.\n\n- A bullet point\n- Another point'}
              className="mt-1.5 min-h-[260px] resize-y font-mono text-[13px] leading-relaxed"
              rows={12}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Preview ─────────────────────────────────────────────────────────
function ArticlePreview({
  title,
  excerpt,
  content,
  category,
}: {
  title: string
  excerpt: string
  content: string
  category: string
}) {
  // Simple markdown-ish render: headings, paragraphs, bullets
  const lines = content.split('\n')
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
  lines.forEach((raw, i) => {
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
    <div className="rounded-xl border border-border bg-background p-6">
      <Badge className="rounded-full">{category}</Badge>
      <h1 className="mt-3 text-2xl font-extrabold leading-tight text-foreground">
        {title || 'Untitled'}
      </h1>
      {excerpt && <p className="mt-2 text-sm text-muted-foreground">{excerpt}</p>}
      <div className="mt-5">{blocks}</div>
    </div>
  )
}
