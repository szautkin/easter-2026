import { useEffect, useState } from 'react'
import { useAssignment, useGameConfig } from '@/hooks/useGameConfig'
import { useGameStore } from '@/store/gameStore'
import { Confetti } from '@/components/shared/Confetti'

export function A12_GrandFinale() {
  const assignment = useAssignment(12)
  const config = useGameConfig()
  const solveAssignment = useGameStore((s) => s.solveAssignment)
  const timer = useGameStore((s) => s.timer)
  const [showFull, setShowFull] = useState(false)
  const progress = useGameStore((s) => s.assignmentProgress[12])
  const numberLockValues = config.codes.numberLock.values
  const wordLockValue = config.codes.wordLock.value

  const message = assignment?.message

  useEffect(() => {
    if (!message) return
    if (progress?.solved) return // Already solved, don't re-fire
    solveAssignment(12)
    const timeout = setTimeout(() => setShowFull(true), 500)
    return () => clearTimeout(timeout)
  }, [message, solveAssignment, progress?.solved])

  if (!message) {
    return <div className="text-center py-12 text-error">Assignment 12 configuration missing</div>
  }

  const timeUsed = timer.totalElapsed
  const minutes = Math.floor(timeUsed / 60)
  const seconds = timeUsed % 60

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8 min-h-[60vh]">
      <Confetti trigger={true} duration={6000} />

      <h1 className="text-4xl md:text-5xl font-bold text-blue-primary text-center animate-pop">
        🎊 {message.title} 🎊
      </h1>

      {showFull && (
        <div className="flex flex-col items-center gap-6 animate-pop">
          {/* Number Lock */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-bold text-text-secondary uppercase tracking-wider">
              🔢 Combination Lock
            </span>
            <div className="flex items-center gap-2 text-5xl font-mono font-bold text-blue-primary">
              {numberLockValues.map((v, i) => (
                <span key={i} className="contents">
                  <span className="bg-yellow-accent rounded-xl px-4 py-2">{v}</span>
                  {i < numberLockValues.length - 1 && <span className="text-yellow-accent">&ndash;</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Word Lock */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-bold text-text-secondary uppercase tracking-wider">
              🔤 Word Lock
            </span>
            <div className="flex gap-2">
              {wordLockValue.split('').map((letter, i) => (
                <div
                  key={i}
                  className="w-16 h-20 flex items-center justify-center text-4xl font-bold bg-yellow-accent text-blue-primary rounded-xl border-[3px] border-blue-primary"
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>

          {/* Instruction */}
          <div className="bg-yellow-tint border-2 border-yellow-accent rounded-2xl p-6 max-w-lg text-center">
            <p className="text-2xl font-bold text-blue-primary">
              {message.instruction}
            </p>
          </div>

          {/* Time */}
          <p className="text-lg text-text-secondary">
            Completed in <strong>{minutes}m {seconds.toString().padStart(2, '0')}s</strong>
          </p>

          {/* Celebration emojis */}
          <div className="flex gap-4 text-5xl">
            <span className="animate-float" style={{ animationDelay: '0s' }}>🐰</span>
            <span className="animate-float" style={{ animationDelay: '0.4s' }}>🎁</span>
            <span className="animate-float" style={{ animationDelay: '0.8s' }}>🍫</span>
            <span className="animate-float" style={{ animationDelay: '1.2s' }}>🏆</span>
          </div>
        </div>
      )}
    </div>
  )
}
