import nodemailer from 'nodemailer'

/**
 * Email sending via SMTP.
 * Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env
 * If not configured, emails are logged to console (dev mode).
 */

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
  return transporter
}

const FROM_NAME = process.env.SMTP_FROM_NAME || 'Learntharifith'
const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'no-reply@learntharifith.com'

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const t = getTransporter()
  if (!t) {
    // Dev mode — log to console
    console.log(`📧 [EMAIL NOT SENT — no SMTP config] To: ${to}\nSubject: ${subject}\n${html}`)
    return false
  }
  try {
    await t.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    })
    return true
  } catch (err) {
    console.error('Email send failed:', err)
    return false
  }
}

export async function sendWelcomeEmail(
  email: string,
  username: string,
  password: string,
): Promise<boolean> {
  const siteUrl = process.env.SITE_URL || 'https://www.learntharifith.com'
  const html = `
<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #fffdf8; color: #2a2a23;">
  <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #c87038;">
    <h1 style="font-size: 28px; color: #c87038; margin: 0;">Learn<span style="color: #2a2a23;">tharifith</span></h1>
    <p style="color: #5b6573; font-size: 14px; margin: 4px 0 0;">ⵜⴰⵔⵉⴼⵉⵜ — the voice of the Rif</p>
  </div>

  <h2 style="color: #2a2a23; font-size: 22px; margin: 24px 0 12px;">Welcome to Learntharifith 🎉</h2>

  <p style="font-size: 15px; line-height: 1.6; color: #3a3a33;">
    Your account has been created. Here are your login credentials:
  </p>

  <div style="background: #f5f0e8; border: 1px solid #d4c4a8; border-radius: 12px; padding: 20px; margin: 16px 0;">
    <p style="margin: 0 0 8px; font-size: 14px; color: #5b6573;">Your username:</p>
    <p style="margin: 0 0 16px; font-size: 18px; font-weight: bold; color: #c87038; font-family: monospace;">${username}</p>
    <p style="margin: 0 0 8px; font-size: 14px; color: #5b6573;">Your password:</p>
    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #c87038; font-family: monospace;">${password}</p>
  </div>

  <p style="font-size: 15px; line-height: 1.6; color: #3a3a33;">
    To access the private video series, complete your subscription via Ko-fi:
  </p>

  <div style="text-align: center; margin: 24px 0;">
    <a href="https://ko-fi.com/learntharifith/tiers" style="background: #c87038; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
      Subscribe on Ko-fi →
    </a>
  </div>

  <p style="font-size: 15px; line-height: 1.6; color: #3a3a33;">
    After your payment, you'll receive a <strong>passcode</strong> from us.
    Log in to your dashboard and enter the passcode to unlock the private
    Riffian video series.
  </p>

  <div style="text-align: center; margin: 24px 0;">
    <a href="${siteUrl}" style="background: #f5f0e8; color: #c87038; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; border: 1px solid #c87038; display: inline-block;">
      Go to your dashboard
    </a>
  </div>

  <p style="font-size: 13px; color: #5b6573; line-height: 1.5; border-top: 1px solid #e5dfd3; padding-top: 16px; margin-top: 24px;">
    Keep your credentials safe. If you have any questions, reply to this email.<br>
    ⵜⴰⵣⵡⴽⵉ ⵏ ⵜⵎⴰⵣⵉⵖⵜ
  </p>
</div>
`
  return sendEmail(
    email,
    'Welcome to Learntharifith — your account credentials',
    html,
  )
}
