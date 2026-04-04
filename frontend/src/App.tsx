import { useGameStore } from '@/store/gameStore'
import { useGameConfig } from '@/hooks/useGameConfig'
import { useMasterMode } from '@/hooks/useMasterMode'
import { CountdownTimer } from '@/components/CountdownTimer'
import { ProgressBar } from '@/components/ProgressBar'
import { AssignmentRouter } from '@/components/AssignmentRouter'
import { HubPage } from '@/components/HubPage'
import { MasterPanel } from '@/components/MasterPanel'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Egg, ArrowLeft } from 'lucide-react'

function StartScreen() {
  const startGame = useGameStore((s) => s.startGame)
  const config = useGameConfig()

  return (
    <div className="flex flex-col items-center justify-center gap-8 min-h-[80vh] px-4">
      <div className="text-7xl animate-float">🥚</div>
      <h1 className="text-4xl md:text-5xl font-bold text-blue-primary text-center">
        {config.meta.event}
      </h1>
      <p className="text-lg text-text-secondary text-center max-w-md">
        Collect all 20 eggs, solve the riddles, crack the codes, and find the treasure!
      </p>
      <button
        onClick={startGame}
        className="px-12 py-4 bg-blue-primary text-white text-2xl font-bold rounded-2xl shadow-card hover:bg-blue-primary/90 transition-all hover:scale-105 active:scale-95"
      >
        START THE HUNT!
      </button>
      <div className="flex gap-3 text-3xl">
        <span>🐰</span>
        <span>🌸</span>
        <span>🐣</span>
        <span>🌷</span>
        <span>🦋</span>
      </div>
    </div>
  )
}

function TimeUpScreen() {
  const pauseTimer = useGameStore((s) => s.pauseTimer)
  const assignmentProgress = useGameStore((s) => s.assignmentProgress)

  const solvedCount = Object.values(assignmentProgress).filter((p) => p.solved).length

  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-[60vh] px-4">
      <div className="text-6xl">⏰</div>
      <h2 className="text-3xl font-bold text-blue-primary text-center">Time's Up!</h2>
      <p className="text-lg text-text-secondary text-center max-w-md">
        You solved {solvedCount} tasks. Great job! Want to keep going without the timer?
      </p>
      <button
        onClick={pauseTimer}
        className="px-8 py-3 bg-blue-primary text-white text-lg font-bold rounded-xl shadow-card hover:bg-blue-primary/90 transition-all"
      >
        Continue Without Timer
      </button>
    </div>
  )
}

export default function App() {
  const phase = useGameStore((s) => s.phase)
  const timer = useGameStore((s) => s.timer)
  const activePath = useGameStore((s) => s.activePath)
  const returnToHub = useGameStore((s) => s.returnToHub)
  const isMaster = useMasterMode()

  if (phase === 'idle') {
    return (
      <div className="min-h-dvh bg-blue-tint">
        <StartScreen />
      </div>
    )
  }

  const isTimeUp = timer.remainingSeconds <= 0 && timer.isRunning && phase !== 'complete'

  if (isTimeUp) {
    return (
      <div className="min-h-dvh bg-blue-tint">
        <TimeUpScreen />
      </div>
    )
  }

  const assignmentLabel =
    phase === 'hub'
      ? 'Mission Control'
      : phase === 'word_path'
        ? '🔤 Word Lock'
        : phase === 'number_path'
          ? '🔢 Number Lock'
          : ''

  return (
    <div className="min-h-dvh bg-blue-tint flex flex-col">
      {/* Header */}
      <header className="bg-blue-primary text-white px-4 py-3 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {activePath ? (
            <button onClick={returnToHub} className="flex items-center gap-1 text-yellow-accent hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-bold hidden sm:inline">Hub</span>
            </button>
          ) : (
            <>
              <Egg className="w-6 h-6 text-yellow-accent" />
              <span className="font-bold text-lg hidden sm:inline">EASTER 2026</span>
            </>
          )}
        </div>
        <span className="text-sm font-medium text-blue-light">
          {assignmentLabel}
        </span>
        <CountdownTimer />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 max-w-5xl mx-auto w-full">
        <ErrorBoundary>
          {phase === 'hub' && <HubPage />}
          {(phase === 'word_path' || phase === 'number_path') && <AssignmentRouter />}
          {phase === 'complete' && <AssignmentRouter />}
        </ErrorBoundary>
      </main>

      {/* Progress Bar — only during paths */}
      {(phase === 'word_path' || phase === 'number_path') && (
        <footer className="px-4 py-3 bg-white border-t border-blue-light/20">
          <ProgressBar />
        </footer>
      )}

      {isMaster && <MasterPanel />}
    </div>
  )
}
