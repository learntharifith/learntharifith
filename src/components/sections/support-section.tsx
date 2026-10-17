'use client'

import { Coffee, Heart, Youtube, Mail, Sparkles, HandHeart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/store'
import { AmazighBand, TifinaghStrip } from '@/components/amazigh-pattern'

const KOFI_1 = 'https://ko-fi.com/summary/06275ede-c500-4330-93ee-f52addb9eabb'
const KOFI_2 = 'https://ko-fi.com/summary/b6135d33-d4f0-4a3f-ac75-d0e6ccacb378'

export function SupportSection() {
  const { setActiveTab } = useApp()

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Heart className="h-3.5 w-3.5" /> Support
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Keep Riffian free for everyone
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Learntharifith is an independent, ad-free project. Every lesson,
          every video, every article is free — forever. Your support is what
          makes that possible.
        </p>
      </div>

      {/* Ko-fi cards */}
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <SupportCard
          icon={<Coffee className="h-6 w-6" />}
          title="Buy me a coffee"
          desc="A one-off thank-you that fuels the next lesson. Every coffee goes straight into recording, editing and hosting."
          cta="Buy a coffee"
          href={KOFI_1}
          accent="bg-amber-500/10 text-amber-600 ring-amber-500/20"
        />
        <SupportCard
          icon={<HandHeart className="h-6 w-6" />}
          title="Become a supporter"
          desc="Join the monthly supporters who keep the project sustainable. Perks include early access and your name in the credits."
          cta="Support monthly"
          href={KOFI_2}
          accent="bg-primary/10 text-primary ring-primary/20"
        />
      </div>

      {/* Other ways */}
      <div className="mt-12">
        <h3 className="text-center text-lg font-bold text-foreground">Other ways to help</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <WayCard
            icon={<Youtube className="h-5 w-5" />}
            title="Watch & subscribe"
            desc="Subscribing and watching on YouTube is free support that helps the channel grow."
            cta="YouTube channel"
            href="https://www.youtube.com/@learntharifith"
          />
          <WayCard
            icon={<Share2 className="h-5 w-5" />}
            title="Share with a learner"
            desc="Know someone who wants to learn Riffian? Send them the link — every share matters."
            cta="Copy link"
            href="#"
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText('https://dev.learntharifith.com')
              }
            }}
          />
          <WayCard
            icon={<Mail className="h-5 w-5" />}
            title="Send feedback"
            desc="Tell me what lessons you want next, what was confusing, what you loved. I read every message."
            cta="Email me"
            href="mailto:hello@learntharifith.com"
          />
        </div>
      </div>

      {/* Promise */}
      <div className="mt-12 overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.06] via-card to-card">
        <div className="border-b border-border/60 bg-primary/[0.04] py-2 text-primary/70">
          <TifinaghStrip className="text-sm font-medium" />
        </div>
        <div className="p-6 sm:p-10">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                The promise: free, forever.
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Riffian is a language of resilience. It survived centuries
                without permission. This project will never put a price on
                learning it. Support is welcome — paywalls are not.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <a href={KOFI_1} target="_blank" rel="noreferrer noopener">
                <Coffee className="h-4 w-4" /> Buy me a coffee
              </a>
            </Button>
            <Button variant="outline" onClick={() => setActiveTab('learn')}>
              Back to lessons
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-14 text-primary/40">
        <AmazighBand className="h-4 w-full" color="currentColor" />
      </div>
    </section>
  )
}

function SupportCard({
  icon,
  title,
  desc,
  cta,
  href,
  accent,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  cta: string
  href: string
  accent: string
}) {
  return (
    <div className="lt-card-hover flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
      <span className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ${accent}`}>
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      <Button asChild className="mt-5 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
        <a href={href} target="_blank" rel="noreferrer noopener">
          {cta}
        </a>
      </Button>
    </div>
  )
}

function WayCard({
  icon,
  title,
  desc,
  cta,
  href,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  cta: string
  href: string
  onClick?: () => void
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <h4 className="mt-3 text-sm font-bold text-foreground">{title}</h4>
      <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
      <Button
        asChild={onClick ? undefined : true}
        variant="outline"
        size="sm"
        className="mt-4 h-8"
        onClick={onClick}
      >
        {onClick ? <button>{cta}</button> : <a href={href} target="_blank" rel="noreferrer noopener">{cta}</a>}
      </Button>
    </div>
  )
}
