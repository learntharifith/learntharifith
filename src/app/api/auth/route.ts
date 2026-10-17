import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, signToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// ── Brute-force protection (in-memory rate limiter) ──────────────────
// Tracks failed attempts per IP. After MAX_FAILED attempts, locks the IP
// out for LOCKOUT_MS. Resets on successful login.
const MAX_FAILED = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes
const WINDOW_MS = 15 * 60 * 1000  // attempts counted within a 15-min window

const attempts = new Map<string, { count: number; firstAt: number; lockedUntil: number }>()

function getClientIp(req: NextRequest): string {
  // Try common forwarded headers (behind OLS proxy)
  const xfwd = req.headers.get('x-forwarded-for')
  if (xfwd) return xfwd.split(',')[0].trim()
  const xreal = req.headers.get('x-real-ip')
  if (xreal) return xreal.trim()
  return 'unknown'
}

function getRemainingMs(ip: string): number {
  const a = attempts.get(ip)
  if (!a) return 0
  return Math.max(0, a.lockedUntil - Date.now())
}

function recordFailure(ip: string) {
  const now = Date.now()
  const a = attempts.get(ip)
  if (!a || now - a.firstAt > WINDOW_MS) {
    // start a new window
    attempts.set(ip, { count: 1, firstAt: now, lockedUntil: 0 })
    return
  }
  a.count++
  if (a.count >= MAX_FAILED) {
    a.lockedUntil = now + LOCKOUT_MS
  }
}

function recordSuccess(ip: string) {
  attempts.delete(ip)
}

// POST /api/auth  { password } → { token }
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  // Check lockout
  const remaining = getRemainingMs(ip)
  if (remaining > 0) {
    return NextResponse.json(
      {
        error: `Too many attempts. Try again in ${Math.ceil(remaining / 1000 / 60)} minute(s).`,
        retryAfter: Math.ceil(remaining / 1000),
      },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(remaining / 1000)) },
      },
    )
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  if (!verifyPassword(body.password)) {
    recordFailure(ip)
    const a = attempts.get(ip)
    const attemptsLeft = a ? Math.max(0, MAX_FAILED - a.count) : MAX_FAILED
    return NextResponse.json(
      {
        error: 'Invalid password',
        attemptsLeft,
      },
      { status: 401 },
    )
  }

  recordSuccess(ip)
  const token = signToken()
  return NextResponse.json({ token })
}
