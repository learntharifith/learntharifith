'use client'

import * as React from 'react'
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, Clock, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useApp, LEVEL_META } from '@/lib/store'
import { toast } from 'sonner'

export function LessonModal() {
  const {
    openLesson,
    closeLesson,
    lessons,
    toggleCompleted,
    isCompleted,
    browserId,
  } = useApp()

  const open = Boolean(openLesson)

  // Find position in the ordered list for prev/next
  const currentIndex = openLesson
    ? lessons.findIndex((l) => l.id === openLesson.id)
    : -1
  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const next =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null

  const meta = openLesson ? LEVEL_META[openLesson.level] : null
  const done = openLesson ? isCompleted(openLesson.id) : false

  const handleToggle = async () => {
    if (!openLesson) return
    toggleCompleted(openLesson.id)
    // persist
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          browserId: browserId ?? 'anon',
          lessonId: openLesson.id,
          completed: !done,
        }),
      })
      toast.success(!done ? 'Lesson marked as complete 🎉' : 'Marked as not done')
    } catch {
      /* offline-first: state already updated locally */
      toast.success(!done ? 'Lesson marked as complete 🎉' : 'Marked as not done')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeLesson()}>
      <DialogContent
        className="max-w-4xl overflow-hidden rounded-2xl border-border bg-card p-0 sm:max-w-4xl"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {openLesson && (
          <>
            <DialogTitle className="sr-only">{openLesson.title}</DialogTitle>
            <DialogDescription className="sr-only">
              {openLesson.description}
            </DialogDescription>

            {/* Close button */}
            <button
              onClick={closeLesson}
              aria-label="Close lesson"
              className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75"
            >
              <X className="h-4 w-4" />
            </button>

            {/* YouTube embed */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                key={openLesson.id}
                src={`https://www.youtube-nocookie.com/embed/${openLesson.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={openLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>

            {/* Body */}
            <div className="max-h-[42vh] overflow-y-auto lt-scroll p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                {meta && (
                  <span
                    className={cn(
                      'rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
                      meta.chip,
                    )}
                  >
                    {meta.label}
                  </span>
                )}
                {openLesson.lessonNumber != null && (
                  <Badge variant="outline" className="rounded-full font-medium">
                    Lesson {openLesson.lessonNumber}
                  </Badge>
                )}
                {openLesson.durationMins > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {openLesson.durationMins} min
                  </span>
                )}
              </div>

              <h2 className="mt-3 text-xl font-bold leading-tight text-foreground sm:text-2xl">
                {openLesson.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {openLesson.description}
              </p>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Button
                  onClick={handleToggle}
                  className={cn(
                    'h-9 gap-1.5',
                    done
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90',
                  )}
                >
                  {done ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Completed
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4" /> Mark as complete
                    </>
                  )}
                </Button>

                {prev && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5"
                    onClick={() => useApp.getState().openLessonById(prev.id)}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                )}
                {next && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5"
                    onClick={() => useApp.getState().openLessonById(next.id)}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
