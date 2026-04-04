import { useState, useCallback, useRef, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { useAssignment, useGameConfig } from '@/hooks/useGameConfig'
import { useGameStore } from '@/store/gameStore'
import { MediaPlayer } from '@/components/shared/MediaPlayer'
import { DraggableItem } from '@/components/shared/DraggableItem'
import { Confetti } from '@/components/shared/Confetti'
import { fireSparkle } from '@/lib/utils'

const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

function ShedRevealInner() {
  const assignment = useAssignment(11)
  const config = useGameConfig()
  const solveAssignment = useGameStore((s) => s.solveAssignment)
  const revealCode = useGameStore((s) => s.revealCode)
  const progress = useGameStore((s) => s.assignmentProgress[11])
  const wordCode = config.codes.wordLock.value

  const isSolved = progress?.solved ?? false

  const [letters, setLetters] = useState<string[]>(() => {
    const p = wordCode.split('')
    do {
      for (let i = p.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[p[i], p[j]] = [p[j], p[i]]
      }
    } while (p.join('') === wordCode)
    return p
  })

  const [allCorrect, setAllCorrect] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleSwap = useCallback((from: number, to: number) => {
    setLetters((prev) => {
      const next = [...prev]
      ;[next[from], next[to]] = [next[to], next[from]]
      return next
    })
  }, [])

  useEffect(() => {
    if (allCorrect) return
    if (letters.join('') === wordCode) {
      setAllCorrect(true)
      itemRefs.current.forEach((el) => { if (el) fireSparkle(el) })
    }
  }, [letters, allCorrect, wordCode])

  const handleReveal = useCallback(() => {
    if (!assignment) return
    revealCode(assignment.reveals)
    setShowSuccess(true)
  }, [assignment, revealCode])

  const handleNextTask = useCallback(() => {
    solveAssignment(11)
  }, [solveAssignment])

  if (!assignment) {
    return <div className="text-center py-12 text-error">Assignment 11 configuration missing</div>
  }

  if (showSuccess || isSolved) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-12 text-center animate-pop">
        <Confetti trigger duration={5000} />
        <div className="text-7xl">🔓</div>
        <h2 className="text-4xl font-bold text-blue-primary">Word Lock Unlocked!</h2>
        <p className="text-lg text-text-secondary max-w-sm">You cracked the word code! Lock 2 is now open!</p>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Lock 2 — Word Code</span>
          <div className="flex gap-2">
            {wordCode.split('').map((l, i) => (
              <div key={i} className="w-16 h-20 flex items-center justify-center text-3xl font-bold bg-yellow-accent text-blue-primary rounded-xl border-[3px] border-blue-primary shadow-lg">{l}</div>
            ))}
          </div>
        </div>
        <button onClick={handleNextTask} className="mt-4 px-10 py-3 rounded-xl font-bold text-lg bg-blue-primary text-white hover:bg-blue-primary/90 shadow-card transition-all hover:scale-105 active:scale-95">
          Next Task →
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-blue-primary flex items-center justify-center gap-2">
          <span className="text-3xl">{assignment.icon}</span>
          {assignment.title}
        </h2>
        <div className="flex items-center justify-center gap-2">
          {wordCode.split('').sort().map((l, i) => (
            <div key={i} className="w-10 h-12 flex items-center justify-center text-xl font-bold font-mono bg-yellow-tint border-2 border-yellow-accent text-blue-primary rounded-lg">{l}</div>
          ))}
        </div>
        <p className="text-text-secondary">You revealed these letters — put them in the right order!</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-5">
        <p className="text-sm text-text-secondary mb-3">Watch the video — what place is this?</p>
        {assignment.video && <MediaPlayer video={assignment.video} />}
      </div>

      <div className="bg-blue-tint rounded-2xl p-5 flex flex-col items-center gap-4 border-2 border-blue-light/30">
        <p className="font-bold text-blue-primary text-lg">Spell the secret word!</p>
        <div className="flex gap-3">
          {letters.map((letter, index) => (
            <div key={`${letter}-${index}`} ref={(el) => { itemRefs.current[index] = el }}>
              <DraggableItem value={letter} index={index} onSwap={handleSwap} sparkle={allCorrect} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary">Your word:</span>
          <span className="text-xl font-bold font-mono text-blue-primary tracking-widest">{letters.join('')}</span>
        </div>
        {allCorrect && (
          <div className="animate-pop flex flex-col items-center gap-3">
            <p className="text-xl font-bold text-success">That's the word!</p>
            <button onClick={handleReveal} className="px-10 py-4 rounded-2xl font-bold text-xl bg-yellow-accent text-blue-primary hover:bg-yellow-accent/80 shadow-lg transition-all hover:scale-105 active:scale-95 border-2 border-blue-primary">
              🔐 Open the Lock!
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function A11_ShedReveal() {
  return (
    <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
      <ShedRevealInner />
    </DndProvider>
  )
}
