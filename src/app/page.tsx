'use client'

import * as React from 'react'
import { useApp } from '@/lib/store'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LessonModal } from '@/components/lesson-modal'
import { HomeContent } from '@/components/sections/home-content'
import { LearnSection } from '@/components/sections/learn-section'
import { CultureSection } from '@/components/sections/culture-section'
import { ShopSection } from '@/components/sections/shop-section'
import { CoursesSection } from '@/components/sections/courses-section'
import { SupportSection } from '@/components/sections/support-section'

export default function Home() {
  const { activeTab, setLessons, setCompleted, setBrowserId } = useApp()
  const [ready, setReady] = React.useState(false)

  // Boot: generate browser id, fetch lessons + progress
  React.useEffect(() => {
    let alive = true

    async function boot() {
      // browser id (persisted in localStorage)
      let bid = ''
      try {
        bid = localStorage.getItem('lt:bid') ?? ''
      } catch {
        bid = ''
      }
      if (!bid) {
        bid =
          'b_' +
          Math.random().toString(36).slice(2, 10) +
          Date.now().toString(36).slice(-4)
        try {
          localStorage.setItem('lt:bid', bid)
        } catch {
          /* ignore */
        }
      }
      setBrowserId(bid)

      // lessons
      try {
        const lr = await fetch('/api/lessons')
        const ld = await lr.json()
        if (alive && Array.isArray(ld.lessons)) setLessons(ld.lessons)
      } catch {
        /* ignore */
      }

      // progress
      try {
        const pr = await fetch(`/api/progress?browserId=${encodeURIComponent(bid)}`)
        const pd = await pr.json()
        if (alive && Array.isArray(pd.completed)) setCompleted(pd.completed)
      } catch {
        /* ignore */
      }

      if (alive) setReady(true)
    }

    boot()
    return () => {
      alive = false
    }
  }, [])

  // Listen for cross-tab progress sync
  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'lt:bid' && e.newValue) setBrowserId(e.newValue)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [setBrowserId])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {!ready ? (
          <BootSkeleton />
        ) : (
          <TabView tab={activeTab} />
        )}
      </main>

      <SiteFooter />

      {/* Global lesson modal */}
      <LessonModal />
    </div>
  )
}

function TabView({ tab }: { tab: string }) {
  switch (tab) {
    case 'home':
      return <HomeContent />
    case 'learn':
      return <LearnSection />
    case 'culture':
      return <CultureSection />
    case 'shop':
      return <ShopSection />
    case 'courses':
      return <CoursesSection />
    case 'support':
      return <SupportSection />
    default:
      return <HomeContent />
  }
}

function BootSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-5 w-32 animate-pulse rounded-full bg-muted" />
          <div className="h-14 w-3/4 animate-pulse rounded-xl bg-muted" />
          <div className="h-14 w-1/2 animate-pulse rounded-xl bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="mt-4 flex gap-3">
            <div className="h-12 w-40 animate-pulse rounded-xl bg-muted" />
            <div className="h-12 w-40 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}
