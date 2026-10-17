'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useApp, type TabId } from '@/lib/store'
import { AmazighStar } from '@/components/amazigh-pattern'

const TABS: { id: TabId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'learn', label: 'Learn' },
  { id: 'culture', label: 'Culture' },
  { id: 'shop', label: 'Shop' },
  { id: 'courses', label: 'Courses' },
  { id: 'support', label: 'Support' },
]

export function SiteHeader() {
  const { activeTab, setActiveTab } = useApp()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const go = (t: TabId) => {
    setActiveTab(t)
    setMobileOpen(false)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => go('home')}
          className="group flex items-center gap-2.5"
          aria-label="Learntharifith — home"
        >
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25 transition group-hover:bg-primary/15">
            <AmazighStar className="h-5 w-5" color="currentColor" />
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-[15px] font-extrabold tracking-tight text-foreground">
              Learn<span className="text-primary">tharifith</span>
            </span>
            <span className="lt-tifinagh text-[10px] text-muted-foreground">
              ⵜⴰⵔⵉⴼⵉⵜ
            </span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => go(t.id)}
              data-active={activeTab === t.id}
              className={cn(
                'lt-nav-link rounded-md px-3 py-2 text-sm font-medium transition-colors',
                activeTab === t.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="h-9 w-9"
          >
            {mounted && resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <Button
            size="sm"
            onClick={() => go('learn')}
            className="hidden h-9 bg-primary text-primary-foreground hover:bg-primary/90 sm:inline-flex"
          >
            Start learning
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                  activeTab === t.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted',
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
