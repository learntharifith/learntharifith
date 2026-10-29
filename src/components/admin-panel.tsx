'use client'

import * as React from 'react'
import {
  X, Lock, Film, Plus, Trash2, Upload, Loader2, Users, Key,
  Video as VideoIcon, Copy, Check, ShieldCheck,
} from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type VideoItem = {
  id: string
  title: string
  description: string
  fileName: string
  fileSize: number
  isPrivate: boolean
  series: string | null
  order: number
  createdAt: string
}

type PasscodeItem = {
  id: string
  code: string
  series: string
  used: boolean
  createdAt: string
  uses: { user: { email: string; username: string } }[]
}

type UserItem = {
  id: string
  email: string
  username: string
  subStatus: string
  createdAt: string
  _count: { accesses: number }
}

export function AdminPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [token, setToken] = React.useState<string | null>(null)
  const [password, setPassword] = React.useState('')
  const [loginLoading, setLoginLoading] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    const saved = localStorage.getItem('lt:adminToken')
    if (saved) setToken(saved)
  }, [open])

  const handleLogin = async () => {
    setLoginLoading(true)
    try {
      const r = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await r.json()
      if (!r.ok) {
        toast.error(data.error || 'Login failed')
        return
      }
      localStorage.setItem('lt:adminToken', data.token)
      setToken(data.token)
      setPassword('')
      toast.success('Admin access granted 🔐')
    } catch {
      toast.error('Network error')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('lt:adminToken')
    setToken(null)
    toast.success('Logged out')
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-h-[92vh] max-w-5xl overflow-hidden rounded-2xl border-border bg-card p-0"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">Admin dashboard</DialogTitle>
        <DialogDescription className="sr-only">
          Manage videos, users, and passcodes.
        </DialogDescription>

        <div className="flex items-center justify-between border-b border-border bg-primary/[0.04] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-foreground">Admin dashboard</h2>
              <p className="text-[11px] text-muted-foreground">Videos, users &amp; passcodes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {token && (
              <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={handleLogout}>
                Logout
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

        <div className="max-h-[80vh] overflow-y-auto lt-scroll">
          {!token ? (
            <div className="mx-auto max-w-sm p-8">
              <div className="mb-6 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Lock className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">Admin login</h3>
                <p className="mt-1 text-sm text-muted-foreground">Enter the admin password.</p>
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); handleLogin() }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="admin-pass" className="text-xs font-semibold">Admin password</Label>
                  <Input
                    id="admin-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Admin password"
                    className="mt-1.5 h-11"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loginLoading || !password}
                  className="h-11 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                  {loginLoading ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
            </div>
          ) : (
            <AdminTabs token={token} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Admin tabs ──────────────────────────────────────────────────────
function AdminTabs({ token }: { token: string }) {
  const [tab, setTab] = React.useState<'videos' | 'passcodes' | 'users'>('videos')

  return (
    <div>
      <div className="flex border-b border-border">
        {([
          { id: 'videos' as const, label: 'Videos', icon: <VideoIcon className="h-4 w-4" /> },
          { id: 'passcodes' as const, label: 'Passcodes', icon: <Key className="h-4 w-4" /> },
          { id: 'users' as const, label: 'Users', icon: <Users className="h-4 w-4" /> },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors',
              tab === t.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'videos' && <VideosTab token={token} />}
      {tab === 'passcodes' && <PasscodesTab token={token} />}
      {tab === 'users' && <UsersTab token={token} />}
    </div>
  )
}

// ─── Videos tab (upload + list) ──────────────────────────────────────
function VideosTab({ token }: { token: string }) {
  const [videos, setVideos] = React.useState<VideoItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [uploading, setUploading] = React.useState(false)
  const [showUpload, setShowUpload] = React.useState(false)

  // upload form state
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [file, setFile] = React.useState<File | null>(null)
  const [isPrivate, setIsPrivate] = React.useState(false)
  const [series, setSeries] = React.useState('')
  const [order, setOrder] = React.useState('0')

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/videos', { headers: { Authorization: `Bearer ${token}` } })
      const d = await r.json()
      setVideos(d.videos ?? [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [token])

  React.useEffect(() => { load() }, [load])

  const handleUpload = async () => {
    if (!title || !file) {
      toast.error('Title and video file are required')
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('isPrivate', String(isPrivate))
      formData.append('series', series)
      formData.append('order', order)

      const r = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const d = await r.json()
      if (!r.ok) { toast.error(d.error || 'Upload failed'); return }
      toast.success('Video uploaded 🎉')
      setTitle(''); setDescription(''); setFile(null); setIsPrivate(false); setSeries(''); setOrder('0')
      setShowUpload(false)
      load()
    } catch {
      toast.error('Network error')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, vidTitle: string) => {
    if (!confirm(`Delete "${vidTitle}"? The file will be removed from the server.`)) return
    try {
      await fetch(`/api/admin/videos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Video deleted')
      load()
    } catch { toast.error('Delete failed') }
  }

  if (showUpload) {
    return (
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Upload new video</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>Cancel</Button>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="vid-file" className="text-xs font-semibold">Video file (MP4)</Label>
            <Input
              id="vid-file"
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1.5 h-11"
            />
            {file && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                {file.name} — {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="vid-title" className="text-xs font-semibold">Title</Label>
            <Input
              id="vid-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lesson 17: Verb conjugation"
              className="mt-1.5 h-11"
            />
          </div>
          <div>
            <Label htmlFor="vid-desc" className="text-xs font-semibold">Description</Label>
            <Textarea
              id="vid-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 min-h-[60px]"
              rows={2}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="vid-private" className="text-xs font-semibold">Access</Label>
              <div className="mt-1.5 flex h-11 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPrivate(false)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-sm font-medium',
                    !isPrivate ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-border text-muted-foreground',
                  )}
                >
                  Public (free)
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrivate(true)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-sm font-medium',
                    isPrivate ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-border text-muted-foreground',
                  )}
                >
                  Private (passcode)
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="vid-series" className="text-xs font-semibold">
                Series {isPrivate && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="vid-series"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                placeholder={isPrivate ? 'e.g. Beginner Pack 1' : '(optional)'}
                className="mt-1.5 h-11"
                disabled={!isPrivate}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="vid-order" className="text-xs font-semibold">Order</Label>
            <Input
              id="vid-order"
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="mt-1.5 h-11"
            />
          </div>
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="h-11 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Upload video'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Videos ({videos.length})</h3>
        <Button
          size="sm"
          className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowUpload(true)}
        >
          <Plus className="h-3.5 w-3.5" /> Upload video
        </Button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <Film className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">No videos uploaded yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Click “Upload video” to add your first MP4.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {videos.map((v) => (
            <li key={v.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{v.title}</p>
                  {v.isPrivate ? (
                    <Badge className="bg-amber-500 text-white hover:bg-amber-600">🔒 Private</Badge>
                  ) : (
                    <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">Public</Badge>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {v.series ? `${v.series} · ` : ''}{(v.fileSize / 1024 / 1024).toFixed(1)} MB · {new Date(v.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(v.id, v.title)}
                title="Delete"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Passcodes tab ───────────────────────────────────────────────────
function PasscodesTab({ token }: { token: string }) {
  const [passcodes, setPasscodes] = React.useState<PasscodeItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [series, setSeries] = React.useState('')
  const [count, setCount] = React.useState('1')
  const [generating, setGenerating] = React.useState(false)
  const [copied, setCopied] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/passcodes', { headers: { Authorization: `Bearer ${token}` } })
      const d = await r.json()
      setPasscodes(d.passcodes ?? [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [token])

  React.useEffect(() => { load() }, [load])

  const handleGenerate = async () => {
    if (!series) { toast.error('Series name required'); return }
    setGenerating(true)
    try {
      const r = await fetch('/api/admin/passcodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ series, count: Number(count) }),
      })
      const d = await r.json()
      if (!r.ok) { toast.error(d.error); return }
      toast.success(`Generated ${d.passcodes.length} passcode(s) 🎉`)
      setSeries(''); setCount('1')
      load()
    } catch { toast.error('Network error') }
    finally { setGenerating(false) }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    toast.success('Passcode copied')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="p-5">
      {/* Generate form */}
      <div className="mb-6 rounded-xl border border-border bg-background p-4">
        <h3 className="mb-3 text-sm font-bold text-foreground">Generate passcodes</h3>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <div>
            <Label htmlFor="pc-series" className="text-xs font-semibold">Series name</Label>
            <Input
              id="pc-series"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              placeholder="e.g. Beginner Pack 1"
              className="mt-1 h-10"
            />
          </div>
          <div>
            <Label htmlFor="pc-count" className="text-xs font-semibold">Count</Label>
            <Input
              id="pc-count"
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="mt-1 h-10 w-20"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleGenerate}
              disabled={generating || !series}
              className="h-10 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
              Generate
            </Button>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Passcodes are one-use. Send them to users after they pay on Ko-fi.
        </p>
      </div>

      {/* List */}
      <h3 className="mb-3 text-sm font-bold text-foreground">All passcodes ({passcodes.length})</h3>
      {loading ? (
        <div className="grid place-items-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : passcodes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <Key className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No passcodes yet.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {passcodes.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-bold text-foreground">{p.code}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {p.series} · {p.used ? `Used by ${p.uses[0]?.user.email ?? 'unknown'}` : 'Available'}
                </p>
              </div>
              {!p.used && (
                <button
                  onClick={() => copyCode(p.code)}
                  title="Copy"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {copied === p.code ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              )}
              {p.used && <Badge variant="outline" className="shrink-0">Used</Badge>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Users tab ───────────────────────────────────────────────────────
function UsersTab({ token }: { token: string }) {
  const [users, setUsers] = React.useState<UserItem[]>([])
  const [loading, setLoading] = React.useState(true)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      const d = await r.json()
      setUsers(d.users ?? [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [token])

  React.useEffect(() => { load() }, [load])

  return (
    <div className="p-5">
      <h3 className="mb-3 text-sm font-bold text-foreground">Registered users ({users.length})</h3>
      {loading ? (
        <div className="grid place-items-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <Users className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No users registered yet.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{u.username}</p>
                  <Badge
                    className={cn(
                      'shrink-0',
                      u.subStatus === 'active'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-amber-500 text-white hover:bg-amber-600',
                    )}
                  >
                    {u.subStatus}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {u.email} · {u._count.accesses} unlocked · {new Date(u.createdAt).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
