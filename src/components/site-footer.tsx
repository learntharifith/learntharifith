'use client'

import { Heart, Mail, Youtube, Coffee, PenLine, MessageCircle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp, type TabId } from '@/lib/store'
import { AmazighBand, TifinaghStrip } from '@/components/amazigh-pattern'
import { SITE_LINKS } from '@/lib/links'

export function SiteFooter({ onAuthorClick, onAdminClick }: { onAuthorClick?: () => void; onAdminClick?: () => void }) {
  const { setActiveTab } = useApp()
  const go = (t: TabId) => {
    setActiveTab(t)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="mt-auto border-t border-border/60 bg-card/40">
      {/* Tifinagh marquee strip */}
      <div className="border-b border-border/60 bg-primary/[0.04] py-2 text-primary/70">
        <TifinaghStrip className="text-sm font-medium" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Mobile: compact layout (brand + support + copyright) */}
        <div className="md:hidden">
          <div className="flex items-center justify-between gap-3">
            <span className="text-base font-extrabold tracking-tight">
              Learn<span className="text-primary">tharifith</span>
            </span>
            <div className="flex items-center gap-1.5">
              <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 px-2.5">
                <a href={SITE_LINKS.kofi} target="_blank" rel="noreferrer noopener">
                  <Coffee className="h-3.5 w-3.5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 px-2.5">
                <a href={SITE_LINKS.whatsapp} target="_blank" rel="noreferrer noopener">
                  <MessageCircle className="h-3.5 w-3.5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 px-2.5">
                <a href={SITE_LINKS.youtube} target="_blank" rel="noreferrer noopener">
                  <Youtube className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Free Riffian Amazigh lessons and the culture of the Rif.
          </p>
          {/* Mobile nav — single row scroll */}
          <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Footer">
            {(['home', 'learn', 'culture', 'articles', 'practice', 'dashboard', 'shop', 'courses', 'support'] as TabId[]).map((t) => (
              <button
                key={t}
                onClick={() => go(t)}
                className="text-xs font-medium capitalize text-foreground/70 transition-colors hover:text-primary"
              >
                {t}
              </button>
            ))}
          </nav>
        </div>

        {/* Desktop: full 4-column layout */}
        <div className="hidden gap-10 md:grid md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight">
                Learn<span className="text-primary">tharifith</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Free, structured video lessons to learn Tarifit — the Riffian
              Amazigh language — and the culture of the Rif that lives inside it.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button asChild variant="outline" size="sm" className="h-8 gap-1.5">
                <a href={SITE_LINKS.kofi} target="_blank" rel="noreferrer noopener">
                  <Coffee className="h-3.5 w-3.5" /> Buy me a coffee
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-8 gap-1.5">
                <a href={SITE_LINKS.whatsapp} target="_blank" rel="noreferrer noopener">
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Explore */}
          <FooterCol title="Explore">
            <FooterLink onClick={() => go('home')}>Home</FooterLink>
            <FooterLink onClick={() => go('learn')}>Lessons</FooterLink>
            <FooterLink onClick={() => go('culture')}>Culture</FooterLink>
            <FooterLink onClick={() => go('articles')}>Articles</FooterLink>
            <FooterLink onClick={() => go('practice')}>Practice</FooterLink>
            <FooterLink onClick={() => go('courses')}>Courses</FooterLink>
            <FooterLink onClick={() => go('shop')}>Shop</FooterLink>
          </FooterCol>

          {/* Learning path */}
          <FooterCol title="Learning path">
            <FooterLink onClick={() => go('learn')}>Start here</FooterLink>
            <FooterLink onClick={() => go('learn')}>Beginner</FooterLink>
            <FooterLink onClick={() => go('learn')}>Intermediate</FooterLink>
            <FooterLink onClick={() => go('culture')}>Culture &amp; stories</FooterLink>
            <FooterLink onClick={() => go('articles')}>Articles</FooterLink>
          </FooterCol>

          {/* Connect */}
          <FooterCol title="Connect">
            <FooterLink href={SITE_LINKS.youtube} external>
              <span className="inline-flex items-center gap-1.5">
                <Youtube className="h-3.5 w-3.5" /> YouTube
              </span>
            </FooterLink>
            <FooterLink href={SITE_LINKS.whatsapp} external>
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp channel
              </span>
            </FooterLink>
            <FooterLink href={SITE_LINKS.email}>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email
              </span>
            </FooterLink>
            <FooterLink href={SITE_LINKS.kofi} external>
              <span className="inline-flex items-center gap-1.5">
                <Coffee className="h-3.5 w-3.5" /> Ko-fi
              </span>
            </FooterLink>
            <FooterLink onClick={() => go('support')}>Support us</FooterLink>
          </FooterCol>
        </div>

        {/* Amazigh band divider */}
        <div className="my-6 text-primary/40 md:my-8">
          <AmazighBand className="h-4 w-full" color="currentColor" />
        </div>

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Learntharifith. Made with care for the
            Riffian language.
          </p>
          <div className="flex items-center gap-4">
            <p className="lt-tifinagh">ⵜⴰⵣⵡⴽⵉ ⵏ ⵜⵎⴰⵣⵉⵖⵜ</p>
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                title="Admin dashboard"
                className="inline-flex items-center gap-1 text-muted-foreground/40 transition-colors hover:text-primary"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
              </button>
            )}
            {onAuthorClick && (
              <button
                onClick={onAuthorClick}
                title="Author login"
                className="inline-flex items-center gap-1 text-muted-foreground/60 transition-colors hover:text-primary"
              >
                <PenLine className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Author</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  )
}

function FooterLink({
  children,
  href,
  external,
  onClick,
}: {
  children: React.ReactNode
  href?: string
  external?: boolean
  onClick?: () => void
}) {
  if (href) {
    return (
      <li>
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer noopener' : undefined}
          className="text-sm text-foreground/80 transition-colors hover:text-primary"
        >
          {children}
        </a>
      </li>
    )
  }
  return (
    <li>
      <button
        onClick={onClick}
        className="text-sm text-foreground/80 transition-colors hover:text-primary"
      >
        {children}
      </button>
    </li>
  )
}
