import crypto from 'crypto'

const SECRET = process.env.AUTHOR_SECRET || 'lt-default-secret-change-me'
const ITERATIONS = 10000
const KEYLEN = 64
const SALT = 'learntharifith-author-salt'

/**
 * Hash a password with PBKDF2 + salt.
 * Used to compare against the plaintext AUTHOR_PASSWORD env var.
 */
function hashPassword(password: string): string {
  return crypto
    .pbkdf2Sync(password, SALT, ITERATIONS, KEYLEN, 'sha512')
    .toString('hex')
}

/**
 * Verify a submitted password against the env-configured author password.
 */
export function verifyPassword(submitted: string): boolean {
  const expected = process.env.AUTHOR_PASSWORD
  if (!expected) return false
  return verifyAgainstPassword(submitted, expected)
}

/**
 * Verify a submitted password against the env-configured admin password.
 */
export function verifyAdminPasswordEnv(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return verifyAgainstPassword(submitted, expected)
}

function verifyAgainstPassword(submitted: string, expected: string): boolean {
  const submittedHash = hashPassword(submitted)
  const expectedHash = hashPassword(expected)
  // constant-time compare
  return crypto.timingSafeEqual(
    Buffer.from(submittedHash, 'hex'),
    Buffer.from(expectedHash, 'hex'),
  )
}

/**
 * Sign a token (HMAC) for an authenticated author session.
 * Token = base64(payload).base64(hmac)
 */
export function signToken(): string {
  const payload = JSON.stringify({
    role: 'author',
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  })
  const payloadB64 = Buffer.from(payload).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(payloadB64).digest('base64url')
  return `${payloadB64}.${sig}`
}

/**
 * Verify a token signature and expiry. Returns true if valid.
 */
export function verifyToken(token: string | null | undefined): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payloadB64, sig] = parts
  const expectedSig = crypto.createHmac('sha256', SECRET).update(payloadB64).digest('base64url')
  // constant-time compare
  const sigBuf = Buffer.from(sig)
  const expectedBuf = Buffer.from(expectedSig)
  if (sigBuf.length !== expectedBuf.length) return false
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false
  // check expiry
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())
    return typeof payload.exp === 'number' && Date.now() < payload.exp
  } catch {
    return false
  }
}

/**
 * Extract token from an Authorization: Bearer <token> header.
 */
export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get('authorization')
  if (!auth) return null
  const m = auth.match(/^Bearer\s+(.+)$/i)
  return m ? m[1] : null
}
