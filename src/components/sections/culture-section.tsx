'use client'

import * as React from 'react'
import { BookOpen, ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useApp } from '@/lib/store'
import { LessonCard } from '@/components/lesson-card'
import { AmazighBand } from '@/components/amazigh-pattern'
import { SITE_LINKS } from '@/lib/links'

export function CultureSection() {
  const { lessons, setActiveTab } = useApp()
  const cultureLessons = lessons.filter((l) => l.level === 'culture')

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Culture banner */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-border">
        <img
          src="/images/culture-art.png"
          alt="The Rif mountains at golden sunset with Amazigh symbols"
          className="h-44 w-full object-cover sm:h-56 md:h-64"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <BookOpen className="h-3.5 w-3.5" /> Culture of the Rif
          </span>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-white drop-shadow sm:text-4xl">
            The world behind the words
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
            A language is only alive when you know the stories it carries — its
            saints, its New Year, its tattoos and its songs.
          </p>
        </div>
      </div>

      {/* Culture videos */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold text-foreground">Culture &amp; stories — videos</h3>
        {cultureLessons.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cultureLessons.map((l) => (
              <LessonCard key={l.id} lesson={l} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp channel banner */}
      <div className="mt-10 overflow-hidden rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] p-5 sm:p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Daily tasks &amp; lessons on WhatsApp
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Join the WhatsApp channel for a new Riffian task every day —
                vocabulary, phrases and mini-challenges to keep you learning.
              </p>
            </div>
          </div>
          <Button asChild className="shrink-0 gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
            <a href={SITE_LINKS.whatsapp} target="_blank" rel="noreferrer noopener">
              <MessageCircle className="h-4 w-4" /> Join channel
            </a>
          </Button>
        </div>
      </div>

      {/* CTA to lessons */}
      <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h3 className="text-xl font-bold text-foreground">Ready to speak Riffian?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Jump into the structured video lessons — from phonetics to real
            conversations.
          </p>
        </div>
        <Button
          onClick={() => setActiveTab('learn')}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Go to lessons <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-14 text-primary/40">
        <AmazighBand className="h-4 w-full" color="currentColor" />
      </div>
    </section>
  )
}
