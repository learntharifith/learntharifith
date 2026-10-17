'use client'

import { Heart, Mail, Youtube, Coffee, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp, type TabId } from '@/lib/store'
import { AmazighBand, TifinaghStrip } from '@/components/amazigh-pattern'

const KOFI_1 = 'https://ko-fi.com/summary/06275ede-c500-4330-93ee-f52addb9eabb'
const KOFI_2 = 'https://ko-fi.com/summary/b6135d33-d4f0-4a3f-ac75-d0e6ccacb378'

export function SiteFooter({ onAuthorClick }: { onAuthorClick?: () => void }) {
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

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
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
                <a href={KOFI_1} target="_blank" rel="noreferrer noopener">
                  <Coffee className="h-3.5 w-3.5" /> Buy me a coffee
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-8 gap-1.5">
                <a href={KOFI_2} target="_blank" rel="noreferrer noopener">
                  <Heart className="h-3.5 w-3.5" /> Support the project
                </a>
              </Button>
            </div>
          </div>

          {/* Explore */}
          <FooterCol title="Explore">
            <FooterLink onClick={() => go('home')}>Home</FooterLink>
            <FooterLink onClick={() => go('learn')}>Lessons</FooterLink>
            <FooterLink onClick={() => go('culture')}>Culture</FooterLink>
            <FooterLink onClick={() => go('courses')}>Courses</FooterLink>
            <FooterLink onClick={() => go('shop')}>Shop</FooterLink>
          </FooterCol>

          {/* Learning path */}
          <FooterCol title="Learning path">
            <FooterLink onClick={() => go('learn')}>Start here</FooterLink>
            <FooterLink onClick={() => go('learn')}>Beginner</FooterLink>
            <FooterLink onClick={() => go('learn')}>Intermediate</FooterLink>
            <FooterLink onClick={() => go('culture')}>Culture &amp; stories</FooterLink>
          </FooterCol>

          {/* Connect */}
          <FooterCol title="Connect">
            <FooterLink href="https://www.youtube.com/@learntharifith" external>
              <span className="inline-flex items-center gap-1.5">
                <Youtube className="h-3.5 w-3.5" /> YouTube
              </span>
            </FooterLink>
            <FooterLink href="mailto:hello@learntharifith.com">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email
              </span>
            </FooterLink>
            <FooterLink href={KOFI_1} external>
              <span className="inline-flex items-center gap-1.5">
                <Coffee className="h-3.5 w-3.5" /> Ko-fi
              </span>
            </FooterLink>
            <FooterLink onClick={() => go('support')}>Support us</FooterLink>
          </FooterCol>
        </div>

        {/* Amazigh band divider */}
        <div className="my-8 text-primary/40">
          <AmazighBand className="h-4 w-full" color="currentColor" />
        </div>

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Learntharifith. Made with care for the
            Riffian language.
          </p>
          <div className="flex items-center gap-4">
            <p className="lt-tifinagh">ⵜⴰⵣⵡⴽⵉ ⵏ ⵜⵎⴰⵣⵉⵖⵜ</p>
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
