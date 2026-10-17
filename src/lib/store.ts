'use client'

import { create } from 'zustand'

export type TabId = 'home' | 'learn' | 'culture' | 'shop' | 'courses' | 'support'
export type LevelFilter = 'all' | 'intro' | 'beginner' | 'intermediate' | 'culture'

export type LessonLite = {
  id: string
  title: string
  slug: string
  description: string
  youtubeId: string
  level: string
  lessonNumber: number | null
  thumbnail: string
  durationMins: number
  order: number
  featured: boolean
}

interface AppState {
  // navigation
  activeTab: TabId
  setActiveTab: (t: TabId) => void

  // learn filters
  level: LevelFilter
  setLevel: (l: LevelFilter) => void
  query: string
  setQuery: (q: string) => void

  // lessons data
  lessons: LessonLite[]
  setLessons: (l: LessonLite[]) => void

  // progress (set of completed lesson ids for THIS browser)
  completed: Set<string>
  setCompleted: (ids: string[]) => void
  toggleCompleted: (id: string) => void
  isCompleted: (id: string) => boolean

  // currently-open lesson modal
  openLesson: LessonLite | null
  openLessonById: (id: string) => void
  closeLesson: () => void

  // browser id
  browserId: string | null
  setBrowserId: (id: string) => void
}

export const useApp = create<AppState>((set, get) => ({
  activeTab: 'home',
  setActiveTab: (t) => set({ activeTab: t }),

  level: 'all',
  setLevel: (l) => set({ level: l }),
  query: '',
  setQuery: (q) => set({ query: q }),

  lessons: [],
  setLessons: (l) => set({ lessons: l }),

  completed: new Set<string>(),
  setCompleted: (ids) => set({ completed: new Set(ids) }),
  toggleCompleted: (id) => {
    const next = new Set(get().completed)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    set({ completed: next })
  },
  isCompleted: (id) => get().completed.has(id),

  openLesson: null,
  openLessonById: (id) => {
    const lesson = get().lessons.find((l) => l.id === id) ?? null
    set({ openLesson: lesson })
  },
  closeLesson: () => set({ openLesson: null }),

  browserId: null,
  setBrowserId: (id) => set({ browserId: id }),
}))

export const LEVEL_LABELS: Record<LevelFilter, string> = {
  all: 'All lessons',
  intro: 'Start here',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  culture: 'Culture & stories',
}

export const LEVEL_META: Record<
  string,
  { label: string; chip: string; blurb: string }
> = {
  intro: {
    label: 'Start here',
    chip: 'lt-chip-intro',
    blurb: 'New to Riffian? These three short videos set the scene.',
  },
  beginner: {
    label: 'Beginner',
    chip: 'lt-chip-beginner',
    blurb: 'Phonetics, pronouns, greetings — your first 200 words.',
  },
  intermediate: {
    label: 'Intermediate',
    chip: 'lt-chip-intermediate',
    blurb: 'Verbs, tenses and the phrases real conversations need.',
  },
  culture: {
    label: 'Culture & stories',
    chip: 'lt-chip-culture',
    blurb: 'Moulay Mohand, Yennayer, tattoos — the world behind the words.',
  },
}
