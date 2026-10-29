'use client'

import * as React from 'react'
import {
  Lock, User, Loader2, Video as VideoIcon, Key, PlayCircle,
  Lock as LockIcon, CheckCircle2, Mail, ArrowRight, LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { SITE_LINKS } from '@/lib/links'
import { AmazighBand } from '@/components/amazigh-pattern'

type UserProfile = {
  id: string
  email: string
  username: string
  subStatus: string
  createdAt: string
}

type UserVideo = {
  id: string
  title: string
  description: string
  isPrivate: boolean
  series: string | null
  order: number
  fileSize: number
}

export function UserDashboardSection() {
  const [token, setToken] = React.useState<string | null>(null)
  const [user, setUser] = React.useState<UserProfile | null>(null)
  const [showLogin, setShowLogin] = React.useState(true)

  React.useEffect(() => {
    const saved = localStorage.getItem('lt:userToken')
    if (saved) {
      setToken(saved)
      setShowLogin(false)
    }
  }, [])

  // Fetch user profile when token changes
  React.useEffect(() => {
    if (!token) { setUser(null); return }
    fetch('/api/user/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user)
        else { localStorage.removeItem('lt:userToken'); setToken(null); setShowLogin(true) }
      })
      .catch(() => {})
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem('lt:userToken')
    setToken(null)
    setUser(null)
    setShowLogin(true)
    toast.success('Logged out')
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          <User className="h-3.5 w-3.5" /> Dashboard
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {user ? `Welcome, ${user.username}` : 'Your Riffian dashboard'}
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          {user
            ? 'Watch your unlocked Riffian video series and manage your subscription.'
            : 'Create an account to access private Riffian video series. Your credentials are auto-generated and sent by email.'}
        </p>
      </div>

      <div className="mt-8">
        {user ? (
          <UserContent token={token!} user={user} onLogout={handleLogout} />
        ) : showLogin ? (
          <AuthForms onLogin={(t) => { setToken(t); setShowLogin(false) }} />
        ) : null}
      </div>

      <div className="mt-14 text-primary/40">
        <AmazighBand className="h-4 w-full" color="currentColor" />
      </div>
    </section>
  )
}

// ─── Auth forms (login + register) ───────────────────────────────────
function AuthForms({ onLogin }: { onLogin: (token: string) => void }) {
  const [mode, setMode] = React.useState<'login' | 'register'>('login')

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 flex rounded-xl border border-border p-1">
        <button
          onClick={() => setMode('login')}
          className={cn(
            'flex-1 rounded-lg py-2 text-sm font-semibold transition',
            mode === 'login' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
          )}
        >
          Log in
        </button>
        <button
          onClick={() => setMode('register')}
          className={cn(
            'flex-1 rounded-lg py-2 text-sm font-semibold transition',
            mode === 'register' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
          )}
        >
          Create account
        </button>
      </div>

      {mode === 'login' ? (
        <LoginForm onLogin={onLogin} onSwitch={() => setMode('register')} />
      ) : (
        <RegisterForm onLogin={onLogin} onSwitch={() => setMode('login')} />
      )}
    </div>
  )
}

function LoginForm({ onLogin, onSwitch }: { onLogin: (t: string) => void; onSwitch: () => void }) {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const d = await r.json()
      if (!r.ok) { toast.error(d.error); return }
      localStorage.setItem('lt:userToken', d.token)
      toast.success('Welcome back!')
      onLogin(d.token)
    } catch { toast.error('Network error') }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div>
        <Label htmlFor="login-user" className="text-xs font-semibold">Username</Label>
        <Input
          id="login-user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1.5 h-11"
          autoFocus
        />
      </div>
      <div>
        <Label htmlFor="login-pass" className="text-xs font-semibold">Password</Label>
        <Input
          id="login-pass"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 h-11"
        />
      </div>
      <Button type="submit" disabled={loading || !username || !password} className="h-11 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        {loading ? 'Signing in…' : 'Log in'}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        No account?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-primary hover:underline">
          Create one
        </button>
      </p>
    </form>
  )
}

function RegisterForm({ onLogin, onSwitch }: { onLogin: (t: string) => void; onSwitch: () => void }) {
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [done, setDone] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const d = await r.json()
      if (!r.ok) { toast.error(d.error); return }
      setDone(true)
      toast.success('Account created! Check your email for credentials.')
    } catch { toast.error('Network error') }
    finally { setLoading(false) }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Mail className="h-7 w-7" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-foreground">Check your inbox 📧</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We've sent your username and password to <strong>{email}</strong>.
          Use them to log in and access your dashboard.
        </p>
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-left">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Next step: subscribe on Ko-fi</p>
          <p className="mt-1 text-xs text-muted-foreground">
            After payment, you'll receive a passcode to unlock the private video series.
          </p>
          <Button asChild size="sm" className="mt-3 gap-1.5 bg-amber-500 text-white hover:bg-amber-600">
            <a href={SITE_LINKS.kofiTiers} target="_blank" rel="noreferrer noopener">
              Subscribe on Ko-fi <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={onSwitch} className="mt-4">
          I have my credentials — log in
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div className="text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <User className="h-6 w-6" />
        </span>
        <h3 className="mt-3 text-base font-bold text-foreground">Create your account</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Enter your email — we'll auto-generate your username and password and send them to you.
        </p>
      </div>
      <div>
        <Label htmlFor="reg-email" className="text-xs font-semibold">Email address</Label>
        <Input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1.5 h-11"
          autoFocus
        />
      </div>
      <Button type="submit" disabled={loading || !email} className="h-11 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        {loading ? 'Creating account…' : 'Create account & send credentials'}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-primary hover:underline">
          Log in
        </button>
      </p>
    </form>
  )
}

// ─── Logged-in user content ──────────────────────────────────────────
function UserContent({ token, user, onLogout }: { token: string; user: UserProfile; onLogout: () => void }) {
  const [videos, setVideos] = React.useState<UserVideo[]>([])
  const [unlockedSeries, setUnlockedSeries] = React.useState<string[]>([])
  const [lockedSeries, setLockedSeries] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showUnlock, setShowUnlock] = React.useState(false)
  const [playingVideo, setPlayingVideo] = React.useState<UserVideo | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/user/videos', { headers: { Authorization: `Bearer ${token}` } })
      const d = await r.json()
      setVideos(d.videos ?? [])
      setUnlockedSeries(d.unlockedSeries ?? [])
      setLockedSeries(d.lockedSeries ?? [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [token])

  React.useEffect(() => { load() }, [load])

  return (
    <div>
      {/* User bar */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn(
            'uppercase',
            user.subStatus === 'active' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-amber-500 text-white hover:bg-amber-600',
          )}>
            {user.subStatus}
          </Badge>
          <Button variant="ghost" size="sm" onClick={onLogout} className="gap-1.5">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </Button>
        </div>
      </div>

      {/* Locked series — subscribe CTA */}
      {lockedSeries.length > 0 && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-500/[0.05] p-5 sm:p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-600">
                <LockIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Unlock the private series
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {lockedSeries.length} series available: {lockedSeries.join(', ')}. Subscribe on Ko-fi, then enter your passcode.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowUnlock(true)} className="gap-1.5">
                <Key className="h-3.5 w-3.5" /> Enter passcode
              </Button>
              <Button asChild size="sm" className="gap-1.5 bg-amber-500 text-white hover:bg-amber-600">
                <a href={SITE_LINKS.kofiTiers} target="_blank" rel="noreferrer noopener">
                  Subscribe <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Unlock form */}
      {showUnlock && (
        <UnlockForm
          token={token}
          onClose={() => setShowUnlock(false)}
          onUnlocked={() => { setShowUnlock(false); load() }}
        />
      )}

      {/* Videos */}
      {loading ? (
        <div className="grid place-items-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : videos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <VideoIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No videos available yet.</p>
        </div>
      ) : (
        <div>
          <h3 className="mb-4 text-sm font-bold text-foreground">Your videos ({videos.length})</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <button
                key={v.id}
                onClick={() => setPlayingVideo(v)}
                className="lt-card-hover-gold group flex flex-col rounded-2xl border border-border bg-card p-4 text-left shadow-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  {v.isPrivate ? (
                    <Badge className="bg-amber-500/80 text-white">🔒 {v.series}</Badge>
                  ) : (
                    <Badge className="bg-emerald-600/80 text-white">Free</Badge>
                  )}
                </div>
                <div className="relative mb-3 flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-primary/10">
                  <PlayCircle className="h-10 w-10 text-primary/60 transition group-hover:scale-110" />
                </div>
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary">{v.title}</h4>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{v.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Video player modal */}
      {playingVideo && (
        <VideoPlayer video={playingVideo} token={token} onClose={() => setPlayingVideo(null)} />
      )}
    </div>
  )
}

// ─── Unlock form ─────────────────────────────────────────────────────
function UnlockForm({ token, onClose, onUnlocked }: { token: string; onClose: () => void; onUnlocked: () => void }) {
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await fetch('/api/user/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ passcode: code }),
      })
      const d = await r.json()
      if (!r.ok) { toast.error(d.error); return }
      toast.success(d.message || 'Unlocked!')
      onUnlocked()
    } catch { toast.error('Network error') }
    finally { setLoading(false) }
  }

  return (
    <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/[0.03] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Enter your passcode</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="XXXX-XXXX-XXXX"
          className="h-11 flex-1 font-mono text-center text-lg tracking-wider"
          autoFocus
        />
        <Button type="submit" disabled={loading || !code} className="h-11 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Unlock
        </Button>
      </form>
      <p className="mt-2 text-xs text-muted-foreground">
        Your passcode was sent after your Ko-fi payment. It unlocks all videos in the series.
      </p>
    </div>
  )
}

// ─── Video player ────────────────────────────────────────────────────
function VideoPlayer({ video, token, onClose }: { video: UserVideo; token: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{video.title}</h3>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            ✕
          </button>
        </div>
        <video
          controls
          autoPlay
          className="w-full rounded-xl bg-black"
          src={`/api/videos/${video.id}/stream?token=${encodeURIComponent(token)}`}
        />
        {video.description && (
          <p className="mt-3 text-sm text-white/70">{video.description}</p>
        )}
      </div>
    </div>
  )
}
