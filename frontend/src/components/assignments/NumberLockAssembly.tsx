import { useState, useCallback, useRef, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { useAssignment, useGameConfig } from '@/hooks/useGameConfig'
import { useGameStore } from '@/store/gameStore'
import { DraggableItem } from '@/components/shared/DraggableItem'
import { Confetti } from '@/components/shared/Confetti'
import { fireSparkle } from '@/lib/utils'

const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

function NumberLockInner({ assignmentId }: { assignmentId: number }) {
  const assignment = useAssignment(assignmentId)
  const config = useGameConfig()
  const solveAssignment = useGameStore((s) => s.solveAssignment)
  const revealCode = useGameStore((s) => s.revealCode)
  const progress = useGameStore((s) => s.assignmentProgress[assignmentId])

  const correctPairs = assignment?.correctPairs
  const isSolved = progress?.solved ?? false

  const [pairs, setPairs] = useState<string[]>(() => {
    const p = [...(correctPairs ?? ['18', '38', '18'])]
    const target = p.join('-')
    do {
      for (let i = p.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[p[i], p[j]] = [p[j], p[i]]
      }
    } while (p.join('-') === target)
    return p
  })

  const [allCorrect, setAllCorrect] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleSwap = useCallback((from: number, to: number) => {
    setPairs((prev) => {
      const next = [...prev]
      ;[next[from], next[to]] = [next[to], next[from]]
      return next
    })
  }, [])

  useEffect(() => {
    if (allCorrect || !correctPairs) return
    if (pairs.join('-') === correctPairs.join('-')) {
      setAllCorrect(true)
      itemRefs.current.forEach((el) => { if (el) fireSparkle(el) })
    }
  }, [pairs, allCorrect, correctPairs])

  const handleOpenLock = useCallback(() => {
    if (!assignment) return
    config.codes.numberLock.values.forEach((value, position) => {
      revealCode({ type: 'lock_number', position, value })
    })
    setShowSuccess(true)
  }, [assignment, revealCode, config.codes.numberLock.values])

  const handleNextTask = useCallback(() => {
    solveAssignment(assignmentId)
  }, [solveAssignment, assignmentId])

  if (!assignment) {
    return <div className="text-center py-12 text-error">Assignment {assignmentId} configuration missing</div>
  }

  if (showSuccess || isSolved) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-12 text-center animate-pop">
        <Confetti trigger duration={5000} />
        <div className="text-7xl">🔓</div>
        <h2 className="text-4xl font-bold text-blue-primary">Number Lock Unlocked!</h2>
        <p className="text-lg text-text-secondary max-w-sm">You cracked the combination! Lock 3 is now open!</p>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Lock 3 — Combination Code</span>
          <div className="flex items-center gap-2 text-4xl font-mono font-bold text-blue-primary">
            {config.codes.numberLock.values.map((v, i) => (
              <span key={i} className="contents">
                <span className="bg-yellow-accent rounded-xl px-4 py-2">{v}</span>
                {i < config.codes.numberLock.values.length - 1 && <span className="text-yellow-accent">&ndash;</span>}
              </span>
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
    <div className="flex flex-col items-center gap-6 py-6 max-w-lg mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-blue-primary flex items-center justify-center gap-2">
          <span className="text-3xl">{assignment.icon}</span>
          {assignment.title}
        </h2>
        <p className="text-text-secondary">
          You discovered 6 digits: <strong className="font-mono">1, 8, 3, 8, 1, 8</strong>
        </p>
        <p className="text-text-primary">They form 3 pairs. Drag them into the right order!</p>
      </div>

      <div className="flex gap-1.5">
        {[1, 8, 3, 8, 1, 8].map((d, i) => (
          <div key={i} className="w-9 h-11 flex items-center justify-center text-lg font-bold font-mono bg-yellow-tint border-2 border-yellow-accent text-blue-primary rounded-lg">{d}</div>
        ))}
      </div>

      <div className="bg-blue-tint rounded-2xl p-5 flex flex-col items-center gap-4 border-2 border-blue-light/30 w-full">
        <p className="font-bold text-blue-primary text-lg">Put the pairs in order:</p>
        <div className="flex items-center gap-3">
          {pairs.map((pair, index) => (
            <div key={`${pair}-${index}`} className="flex items-center gap-2">
              <div ref={(el) => { itemRefs.current[index] = el }}>
                <DraggableItem value={pair} index={index} onSwap={handleSwap} sparkle={allCorrect} width={80} height={64} className="font-mono" />
              </div>
              {index < pairs.length - 1 && <span className="text-2xl font-bold text-blue-light">&ndash;</span>}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>Your combination:</span>
          <span className="font-bold font-mono text-blue-primary text-lg">{pairs.join(' - ')}</span>
        </div>
        {allCorrect && (
          <div className="animate-pop flex flex-col items-center gap-3">
            <p className="text-xl font-bold text-success">That's the combination!</p>
            <button onClick={handleOpenLock} className="px-10 py-4 rounded-2xl font-bold text-xl bg-yellow-accent text-blue-primary hover:bg-yellow-accent/80 shadow-lg transition-all hover:scale-105 active:scale-95 border-2 border-blue-primary">
              🔐 Open the Lock!
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function NumberLockAssembly({ assignmentId }: { assignmentId: number }) {
  return (
    <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
      <NumberLockInner assignmentId={assignmentId} />
    </DndProvider>
  )
}
