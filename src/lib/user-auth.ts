import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const SALT_ROUNDS = 10

/** Hash a password with bcrypt */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

/** Verify a password against a bcrypt hash */
export async function verifyUserPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

/**
 * Auto-generate a username from an email address.
 * e.g. "john.doe@example.com" → "johndoe" (with a random suffix if taken)
 */
export function generateUsername(email: string): string {
  const base = email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 12)
  const suffix = Math.random().toString(36).slice(2, 5)
  return `${base}${suffix}`
}

/**
 * Auto-generate a strong random password (12 chars, alphanumeric)
 */
export function generatePassword(): string {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let pwd = ''
  const bytes = crypto.randomBytes(12)
  for (let i = 0; i < 12; i++) {
    pwd += chars[bytes[i] % chars.length]
  }
  return pwd
}

/**
 * Generate a unique passcode for unlocking a video series.
 * Format: XXXX-XXXX-XXXX (alphanumeric, uppercase)
 */
export function generatePasscode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.randomBytes(12)
  const parts: string[] = []
  for (let p = 0; p < 3; p++) {
    let part = ''
    for (let i = 0; i < 4; i++) {
      part += chars[bytes[p * 4 + i] % chars.length]
    }
    parts.push(part)
  }
  return parts.join('-')
}

/**
 * Sign a user session token (HMAC, 7-day expiry).
 * Same mechanism as the author token but with userId embedded.
 */
const SECRET = process.env.AUTHOR_SECRET || 'lt-default-secret-change-me'

export function signUserToken(userId: string): string {
  const payload = JSON.stringify({
    sub: userId,
    role: 'user',
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  })
  const payloadB64 = Buffer.from(payload).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(payloadB64).digest('base64url')
  return `${payloadB64}.${sig}`
}

export function verifyUserToken(token: string | null | undefined): { userId: string } | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payloadB64, sig] = parts
  const expectedSig = crypto.createHmac('sha256', SECRET).update(payloadB64).digest('base64url')
  const sigBuf = Buffer.from(sig)
  const expectedBuf = Buffer.from(expectedSig)
  if (sigBuf.length !== expectedBuf.length) return null
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())
    if (typeof payload.exp === 'number' && Date.now() < payload.exp && payload.sub) {
      return { userId: payload.sub }
    }
    return null
  } catch {
    return null
  }
}

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get('authorization')
  if (!auth) return null
  const m = auth.match(/^Bearer\s+(.+)$/i)
  return m ? m[1] : null
}
