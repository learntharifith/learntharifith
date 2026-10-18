'use client'

import * as React from 'react'
import {
  Gamepad2, Brain, Layers, CheckCircle2, XCircle, RotateCcw,
  Trophy, Sparkles, ArrowRight, ArrowLeft, RefreshCw, Lightbulb,
  Award, Zap, Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { VOCAB, CATEGORIES, type VocabEntry } from '@/lib/vocab'
import { AmazighBand } from '@/components/amazigh-pattern'
import { toast } from 'sonner'

type GameMode = 'menu' | 'flashcards' | 'multiple-choice' | 'matching' | 'word-scramble'

export function ExercisesSection() {
  const [mode, setMode] = React.useState<GameMode>('menu')
  const [category, setCategory] = React.useState<string>('all')
  const [score, setScore] = React.useState(0)

  const filtered = React.useMemo(
    () =>
      category === 'all' ? VOCAB : VOCAB.filter((v) => v.category === category),
    [category],
  )

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          <Gamepad2 className="h-3.5 w-3.5" /> Practice
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Riffian games &amp; exercises
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Learn by playing. Flip flashcards, test yourself with multiple choice,
          match pairs, and unscramble words — all built from the Riffian lesson
          vocabulary.
        </p>
      </div>

      {/* Category filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory('all')}
          className={cn(
            'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
            category === 'all'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-foreground',
          )}
        >
          All ({VOCAB.length})
        </button>
        {CATEGORIES.map((c) => {
          const count = VOCAB.filter((v) => v.category === c).length
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                category === c
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-foreground',
              )}
            >
              {c} ({count})
            </button>
          )
        })}
      </div>

      {/* Game area */}
      <div className="mt-8">
        {mode === 'menu' && <GameMenu onSelect={setMode} vocabCount={filtered.length} />}

        {mode === 'flashcards' && (
          <FlashcardGame vocab={filtered} onExit={() => setMode('menu')} />
        )}

        {mode === 'multiple-choice' && (
          <MultipleChoiceGame vocab={filtered} onExit={() => setMode('menu')} onScore={setScore} />
        )}

        {mode === 'matching' && (
          <MatchingGame vocab={filtered} onExit={() => setMode('menu')} />
        )}

        {mode === 'word-scramble' && (
          <WordScrambleGame vocab={filtered} onExit={() => setMode('menu')} />
        )}
      </div>

      <div className="mt-14 text-primary/40">
        <AmazighBand className="h-4 w-full" color="currentColor" />
      </div>
    </section>
  )
}

// ─── Game Menu ───────────────────────────────────────────────────────
function GameMenu({ onSelect, vocabCount }: { onSelect: (m: GameMode) => void; vocabCount: number }) {
  const games = [
    {
      id: 'flashcards' as GameMode,
      icon: <Layers className="h-6 w-6" />,
      title: 'Flashcards',
      desc: 'Flip cards to reveal the meaning. Great for memorising vocabulary.',
      color: 'bg-primary/10 text-primary',
    },
    {
      id: 'multiple-choice' as GameMode,
      icon: <Target className="h-6 w-6" />,
      title: 'Multiple choice',
      desc: 'See a Riffian word, pick the correct English meaning. Track your score.',
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      id: 'matching' as GameMode,
      icon: <Brain className="h-6 w-6" />,
      title: 'Match the pairs',
      desc: 'Connect each Riffian word to its English translation. Beat the clock.',
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      id: 'word-scramble' as GameMode,
      icon: <Zap className="h-6 w-6" />,
      title: 'Word scramble',
      desc: 'Unscramble the letters to form the correct Riffian word.',
      color: 'bg-pink-500/10 text-pink-600',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {games.map((g) => (
        <button
          key={g.id}
          onClick={() => onSelect(g.id)}
          className="lt-card-hover-gold group flex flex-col items-start rounded-2xl border border-border bg-card p-6 text-left shadow-sm"
        >
          <span className={cn('grid h-12 w-12 place-items-center rounded-2xl', g.color)}>
            {g.icon}
          </span>
          <h3 className="mt-4 text-lg font-bold text-foreground">{g.title}</h3>
          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
            {g.desc}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Play <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </button>
      ))}
      <div className="col-span-full rounded-2xl border border-border bg-card/50 p-4 text-center text-sm text-muted-foreground">
        <Sparkles className="mr-1.5 inline h-4 w-4 text-primary" />
        {vocabCount} words available — select a category above to narrow the practice set.
      </div>
    </div>
  )
}

// ─── Flashcard Game ──────────────────────────────────────────────────
function FlashcardGame({ vocab, onExit }: { vocab: VocabEntry[]; onExit: () => void }) {
  const [index, setIndex] = React.useState(0)
  const [flipped, setFlipped] = React.useState(false)
  const [known, setKnown] = React.useState<Set<number>>(new Set())

  const current = vocab[index]
  const progress = ((index + 1) / vocab.length) * 100

  const next = () => {
    setFlipped(false)
    setTimeout(() => setIndex((i) => Math.min(i + 1, vocab.length - 1)), 150)
  }
  const prev = () => {
    setFlipped(false)
    setTimeout(() => setIndex((i) => Math.max(i - 1, 0)), 150)
  }
  const markKnown = () => {
    setKnown((s) => new Set(s).add(index))
    toast.success('Marked as known ✓')
    next()
  }

  if (vocab.length === 0) return <EmptyState onExit={onExit} />

  return (
    <div>
      <GameHeader title="Flashcards" onExit={onExit} progress={progress} extra={`${known.size}/${vocab.length} known`} />
      <div className="mt-6 flex justify-center">
        {/* Flashcard */}
        <button
          onClick={() => setFlipped((f) => !f)}
          className="group relative h-72 w-full max-w-md cursor-pointer [perspective:1000px]"
        >
          <div
            className={cn(
              'relative h-full w-full rounded-3xl border-2 transition-transform duration-500 [transform-style:preserve-3d]',
              flipped && '[transform:rotateY(180deg)]',
            )}
          >
            {/* Front — Riffian */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-8 [backface-visibility:hidden]">
              <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Riffian</span>
              <p className="text-center text-4xl font-extrabold text-foreground">{current.riffian}</p>
              {current.tifinagh && (
                <p className="lt-tifinagh mt-3 text-2xl text-muted-foreground">{current.tifinagh}</p>
              )}
              <span className="mt-4 text-xs text-muted-foreground">Click to flip →</span>
            </div>
            {/* Back — English */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">English</span>
              <p className="text-center text-3xl font-bold text-foreground">{current.english}</p>
              <Badge className="mt-4 rounded-full" variant="outline">{current.category}</Badge>
              <span className="mt-3 text-xs text-muted-foreground">Click to flip back ←</span>
            </div>
          </div>
        </button>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={prev} disabled={index === 0} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Prev
        </Button>
        <Button variant="outline" size="sm" onClick={() => setFlipped((f) => !f)} className="gap-1.5">
          <RotateCcw className="h-4 w-4" /> Flip
        </Button>
        <Button size="sm" onClick={markKnown} className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> I know this
        </Button>
        <Button variant="outline" size="sm" onClick={next} disabled={index === vocab.length - 1} className="gap-1.5">
          Next <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress dots */}
      <div className="mt-6 flex flex-wrap justify-center gap-1.5">
        {vocab.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); setFlipped(false) }}
            className={cn(
              'h-2.5 w-2.5 rounded-full transition-all',
              i === index ? 'bg-primary scale-125' : known.has(i) ? 'bg-emerald-500' : 'bg-muted-foreground/30',
            )}
            aria-label={`Card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Multiple Choice Game ────────────────────────────────────────────
function MultipleChoiceGame({
  vocab,
  onExit,
  onScore,
}: {
  vocab: VocabEntry[]
  onExit: () => void
  onScore: (n: number) => void
}) {
  const [questionIdx, setQuestionIdx] = React.useState(0)
  const [selected, setSelected] = React.useState<string | null>(null)
  const [answered, setAnswered] = React.useState(false)
  const [correctCount, setCorrectCount] = React.useState(0)
  const [finished, setFinished] = React.useState(false)
  const [shuffledVocab, setShuffledVocab] = React.useState<VocabEntry[]>([])
  const [options, setOptions] = React.useState<VocabEntry[]>([])

  // Shuffle vocab and pick 10 questions
  React.useEffect(() => {
    const shuffled = [...vocab].sort(() => Math.random() - 0.5).slice(0, Math.min(10, vocab.length))
    setShuffledVocab(shuffled)
  }, [vocab])

  // Generate 4 options for current question
  React.useEffect(() => {
    if (!shuffledVocab[questionIdx]) return
    const correct = shuffledVocab[questionIdx]
    const distractors = vocab
      .filter((v) => v.english !== correct.english)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    setOptions([...distractors, correct].sort(() => Math.random() - 0.5))
  }, [questionIdx, shuffledVocab, vocab])

  const current = shuffledVocab[questionIdx]
  const total = shuffledVocab.length

  const handleSelect = (english: string) => {
    if (answered) return
    setSelected(english)
    setAnswered(true)
    if (english === current.english) {
      setCorrectCount((c) => c + 1)
      toast.success('Correct! 🎉')
    } else {
      toast.error(`Wrong — it means "${current.english}"`)
    }
  }

  const handleNext = () => {
    if (questionIdx + 1 >= total) {
      setFinished(true)
      onScore(correctCount)
    } else {
      setQuestionIdx((i) => i + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const restart = () => {
    setQuestionIdx(0)
    setSelected(null)
    setAnswered(false)
    setCorrectCount(0)
    setFinished(false)
    const shuffled = [...vocab].sort(() => Math.random() - 0.5).slice(0, Math.min(10, vocab.length))
    setShuffledVocab(shuffled)
  }

  if (vocab.length < 4) {
    return <EmptyState onExit={onExit} message="Need at least 4 words for multiple choice. Select 'All' or a bigger category." />
  }

  if (finished) {
    const pct = Math.round((correctCount / total) * 100)
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
          <Trophy className="h-8 w-8" />
        </span>
        <h3 className="mt-4 text-2xl font-extrabold text-foreground">Quiz complete!</h3>
        <p className="mt-2 text-lg text-muted-foreground">
          You scored <span className="font-bold text-primary">{correctCount}</span> out of{' '}
          <span className="font-bold">{total}</span> ({pct}%)
        </p>
        <div className="mx-auto mt-4 max-w-xs">
          <Progress value={pct} className="h-3" />
        </div>
        <p className="mt-4 text-sm font-medium">
          {pct >= 80 ? '🌟 Excellent! You\'re mastering Riffian!' : pct >= 50 ? '👍 Good effort — keep practising!' : '💪 Keep going — practice makes perfect!'}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={restart} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <RotateCcw className="h-4 w-4" /> Play again
          </Button>
          <Button variant="outline" onClick={onExit}>Back to games</Button>
        </div>
      </div>
    )
  }

  if (!current || options.length < 4) return <div>Loading…</div>

  return (
    <div>
      <GameHeader
        title="Multiple choice"
        onExit={onExit}
        progress={((questionIdx + 1) / total) * 100}
        extra={`Q ${questionIdx + 1}/${total} · Score: ${correctCount}`}
      />

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          What does this Riffian word mean?
        </p>
        <p className="mt-3 text-center text-4xl font-extrabold text-foreground">
          {current.riffian}
        </p>
        {current.tifinagh && (
          <p className="lt-tifinagh mt-2 text-center text-2xl text-muted-foreground">
            {current.tifinagh}
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {options.map((opt) => {
            const isCorrect = opt.english === current.english
            const isSelected = selected === opt.english
            return (
              <button
                key={opt.english}
                onClick={() => handleSelect(opt.english)}
                disabled={answered}
                className={cn(
                  'flex items-center justify-between rounded-xl border-2 p-4 text-left text-sm font-semibold transition-all',
                  !answered && 'border-border hover:border-primary/40 hover:bg-primary/5',
                  answered && isCorrect && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
                  answered && isSelected && !isCorrect && 'border-destructive bg-destructive/5',
                  answered && !isCorrect && !isSelected && 'border-border opacity-50',
                )}
              >
                <span>{opt.english}</span>
                {answered && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                {answered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="mt-6 flex justify-center">
            <Button onClick={handleNext} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              {questionIdx + 1 >= total ? 'See results' : 'Next question'} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Matching Game ───────────────────────────────────────────────────
function MatchingGame({ vocab, onExit }: { vocab: VocabEntry[]; onExit: () => void }) {
  const [pairs, setPairs] = React.useState<{ id: number; riffian: string; english: string; matched: boolean }[]>([])
  const [selected, setSelected] = React.useState<number | null>(null)
  const [wrongPair, setWrongPair] = React.useState<[number, number] | null>(null)
  const [moves, setMoves] = React.useState(0)
  const [startTime, setStartTime] = React.useState(0)
  const [elapsed, setElapsed] = React.useState(0)

  const setup = React.useCallback(() => {
    const picked = [...vocab].sort(() => Math.random() - 0.5).slice(0, Math.min(6, vocab.length))
    const newPairs: { id: number; riffian: string; english: string; matched: boolean }[] = []
    picked.forEach((v, i) => {
      newPairs.push({ id: i, riffian: v.riffian, english: v.english, matched: false })
    })
    // Shuffle the display order for each column
    setPairs(newPairs)
    setSelected(null)
    setWrongPair(null)
    setMoves(0)
    setStartTime(Date.now())
    setElapsed(0)
  }, [vocab])

  React.useEffect(() => {
    setup()
  }, [setup])

  // Timer
  React.useEffect(() => {
    if (pairs.length === 0 || pairs.every((p) => p.matched)) return
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 500)
    return () => clearInterval(t)
  }, [pairs, startTime])

  const riffianCol = [...pairs].sort(() => Math.random() - 0.5)
  const englishCol = [...pairs].sort(() => Math.random() - 0.5)
  const allMatched = pairs.length > 0 && pairs.every((p) => p.matched)

  const handleRiffianClick = (id: number) => {
    if (pairs[id].matched) return
    setSelected(id)
    setWrongPair(null)
  }

  const handleEnglishClick = (id: number) => {
    if (pairs[id].matched || selected === null) return
    setMoves((m) => m + 1)
    if (selected === id) {
      // Match!
      setPairs((ps) => ps.map((p) => (p.id === id ? { ...p, matched: true } : p)))
      setSelected(null)
      toast.success('Match! ✓')
    } else {
      setWrongPair([selected, id])
      setTimeout(() => {
        setWrongPair(null)
        setSelected(null)
      }, 800)
      toast.error('No match — try again')
    }
  }

  if (vocab.length < 4) {
    return <EmptyState onExit={onExit} message="Need at least 4 words for matching. Select 'All' or a bigger category." />
  }

  if (allMatched) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
          <Award className="h-8 w-8" />
        </span>
        <h3 className="mt-4 text-2xl font-extrabold text-foreground">All matched!</h3>
        <p className="mt-2 text-lg text-muted-foreground">
          {moves} moves · {elapsed}s
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={setup} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <RotateCcw className="h-4 w-4" /> Play again
          </Button>
          <Button variant="outline" onClick={onExit}>Back to games</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <GameHeader
        title="Match the pairs"
        onExit={onExit}
        progress={(pairs.filter((p) => p.matched).length / pairs.length) * 100}
        extra={`${pairs.filter((p) => p.matched).length}/${pairs.length} matched · ${moves} moves · ${elapsed}s`}
      />

      <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-8">
        {/* Riffian column */}
        <div>
          <h3 className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-primary">Riffian</h3>
          <div className="space-y-3">
            {riffianCol.map((p) => (
              <button
                key={`r-${p.id}`}
                onClick={() => handleRiffianClick(p.id)}
                disabled={p.matched}
                className={cn(
                  'w-full rounded-xl border-2 p-4 text-center text-sm font-bold transition-all',
                  p.matched && 'border-emerald-500/30 bg-emerald-500/5 opacity-40 line-through',
                  !p.matched && selected === p.id && 'border-primary bg-primary/10 scale-105',
                  !p.matched && selected !== p.id && 'border-border hover:border-primary/40 hover:bg-primary/5',
                  wrongPair && wrongPair[0] === p.id && 'border-destructive animate-pulse bg-destructive/5',
                )}
              >
                {p.riffian}
              </button>
            ))}
          </div>
        </div>

        {/* English column */}
        <div>
          <h3 className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-emerald-600">English</h3>
          <div className="space-y-3">
            {englishCol.map((p) => (
              <button
                key={`e-${p.id}`}
                onClick={() => handleEnglishClick(p.id)}
                disabled={p.matched}
                className={cn(
                  'w-full rounded-xl border-2 p-4 text-center text-sm font-semibold transition-all',
                  p.matched && 'border-emerald-500/30 bg-emerald-500/5 opacity-40 line-through',
                  !p.matched && wrongPair && wrongPair[1] === p.id && 'border-destructive animate-pulse bg-destructive/5',
                  !p.matched && (!wrongPair || wrongPair[1] !== p.id) && 'border-border hover:border-emerald-500/40 hover:bg-emerald-500/5',
                )}
              >
                {p.english}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Lightbulb className="mr-1 inline h-3.5 w-3.5" />
        Click a Riffian word, then click its English translation to match.
      </p>
    </div>
  )
}

// ─── Word Scramble Game ──────────────────────────────────────────────
function WordScrambleGame({ vocab, onExit }: { vocab: VocabEntry[]; onExit: () => void }) {
  const [index, setIndex] = React.useState(0)
  const [scrambled, setScrambled] = React.useState<string[]>([])
  const [selected, setSelected] = React.useState<number[]>([])
  const [solved, setSolved] = React.useState(false)
  const [score, setScore] = React.useState(0)

  const current = vocab[index]

  const scramble = (word: string) => {
    const letters = word.split('')
    let scrambled = [...letters]
    // Make sure it's actually different from the original
    while (scrambled.join('') === word && word.length > 1) {
      scrambled = [...letters].sort(() => Math.random() - 0.5)
    }
    return scrambled
  }

  React.useEffect(() => {
    if (current) {
      setScrambled(scramble(current.riffian))
      setSelected([])
      setSolved(false)
    }
  }, [index, current])

  const builtWord = selected.map((i) => scrambled[i]).join('')

  const handleClick = (i: number) => {
    if (solved || selected.includes(i)) return
    const newSel = [...selected, i]
    setSelected(newSel)
    const built = newSel.map((j) => scrambled[j]).join('')
    if (built === current.riffian) {
      setSolved(true)
      setScore((s) => s + 1)
      toast.success('Correct! 🎉')
    } else if (newSel.length === scrambled.length) {
      // Wrong — reset after a delay
      toast.error(`Almost! The answer is "${current.riffian}"`)
      setTimeout(() => setSelected([]), 1500)
    }
  }

  const handleUndo = () => {
    setSelected((s) => s.slice(0, -1))
  }

  const handleNext = () => {
    setIndex((i) => (i + 1) % vocab.length)
  }

  if (vocab.length === 0) return <EmptyState onExit={onExit} />

  return (
    <div>
      <GameHeader
        title="Word scramble"
        onExit={onExit}
        progress={((index + 1) / vocab.length) * 100}
        extra={`Word ${index + 1}/${vocab.length} · Solved: ${score}`}
      />

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Unscramble this word:
        </p>
        <p className="mt-2 text-center text-2xl font-bold text-foreground">
          "{current.english}"
        </p>
        {current.tifinagh && (
          <p className="lt-tifinagh mt-1 text-center text-lg text-muted-foreground">{current.tifinagh}</p>
        )}

        {/* Built word display */}
        <div className="mt-6 flex min-h-[56px] flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 p-4">
          {selected.length === 0 ? (
            <span className="text-sm text-muted-foreground">Click letters below to build the word…</span>
          ) : (
            selected.map((i, pos) => (
              <span
                key={pos}
                className="grid h-10 w-10 place-items-center rounded-lg border-2 border-primary bg-primary/10 text-lg font-bold text-primary"
              >
                {scrambled[i]}
              </span>
            ))
          )}
        </div>

        {/* Scrambled letters */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {scrambled.map((letter, i) => {
            const used = selected.includes(i)
            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                disabled={used || solved}
                className={cn(
                  'grid h-12 w-12 place-items-center rounded-xl border-2 text-lg font-bold transition-all',
                  used
                    ? 'border-muted opacity-30'
                    : 'border-primary/40 bg-card hover:scale-110 hover:border-primary hover:bg-primary/10',
                )}
              >
                {letter}
              </button>
            )
          })}
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {!solved ? (
            <Button variant="outline" size="sm" onClick={handleUndo} disabled={selected.length === 0} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Undo
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Next word <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setSelected([])} disabled={solved || selected.length === 0} className="gap-1.5">
            <RefreshCw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Shared components ───────────────────────────────────────────────
function GameHeader({
  title,
  onExit,
  progress,
  extra,
}: {
  title: string
  onExit: () => void
  progress: number
  extra?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onExit} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
        </div>
        {extra && <span className="text-xs font-medium text-muted-foreground">{extra}</span>}
      </div>
      <Progress value={progress} className="mt-3 h-1.5" />
    </div>
  )
}

function EmptyState({ onExit, message }: { onExit: () => void; message?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      <Brain className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium text-foreground">No words available</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {message || 'Select a different category or add more vocabulary.'}
      </p>
      <Button variant="outline" size="sm" onClick={onExit} className="mt-4">Back to games</Button>
    </div>
  )
}
