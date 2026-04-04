import { useState } from 'react'
import { useGameStore, WORD_PATH, NUMBER_PATH } from '@/store/gameStore'
import { useGameConfig } from '@/hooks/useGameConfig'
import type { GamePhase } from '@/types'
import { cn } from '@/lib/utils'

const PHASES: GamePhase[] = ['idle', 'hub', 'word_path', 'number_path', 'complete']

export function MasterPanel() {
  const [collapsed, setCollapsed] = useState(false)
  const config = useGameConfig()
  const phase = useGameStore((s) => s.phase)
  const currentAssignment = useGameStore((s) => s.currentAssignment)
  const activePath = useGameStore((s) => s.activePath)
  const assignmentProgress = useGameStore((s) => s.assignmentProgress)
  const wordPathComplete = useGameStore((s) => s.wordPathComplete)
  const numberPathComplete = useGameStore((s) => s.numberPathComplete)

  const store = useGameStore

  const jumpToPhase = (p: GamePhase) => {
    if (p === 'idle') {
      store.getState().resetGame()
    } else if (p === 'hub') {
      if (!store.getState().timer.isRunning && !store.getState().timer.startedAt) store.getState().startGame()
      store.setState({ phase: 'hub', activePath: null, currentAssignment: null })
    } else if (p === 'word_path') {
      if (!store.getState().timer.isRunning && !store.getState().timer.startedAt) store.getState().startGame()
      store.getState().enterWordPath()
    } else if (p === 'number_path') {
      if (!store.getState().timer.isRunning && !store.getState().timer.startedAt) store.getState().startGame()
      store.getState().enterNumberPath()
    } else {
      store.setState({ phase: p, currentAssignment: null })
    }
  }

  const jumpToAssignment = (id: number) => {
    if (!store.getState().timer.isRunning && !store.getState().timer.startedAt) store.getState().startGame()
    const isWordPath = WORD_PATH.includes(id)
    store.setState({
      phase: isWordPath ? 'word_path' : 'number_path',
      activePath: isWordPath ? 'word' : 'number',
      currentAssignment: id,
    })
  }

  const solveCurrentAssignment = () => {
    if (!currentAssignment) return
    const assignment = config.assignments.find((a) => a.id === currentAssignment)
    if (!assignment) return
    store.getState().revealCode(assignment.reveals)
    store.getState().solveAssignment(currentAssignment)
  }

  const wordLockLetters = config.codes.wordLock.value.split('') as [string, string, string, string]
  const numberLockValues = config.codes.numberLock.values

  const completeWordPath = () => {
    const progress = { ...store.getState().assignmentProgress }
    WORD_PATH.forEach((id) => {
      progress[id] = { solved: true, currentStep: 0, attempts: 0 }
    })
    store.setState({
      assignmentProgress: progress,
      wordPathComplete: true,
      phase: 'hub',
      activePath: null,
      currentAssignment: null,
      codeBoard: {
        ...store.getState().codeBoard,
        wordLock: wordLockLetters,
      },
    })
  }

  const completeNumberPath = () => {
    const progress = { ...store.getState().assignmentProgress }
    NUMBER_PATH.forEach((id) => {
      progress[id] = { solved: true, currentStep: 0, attempts: 0 }
    })
    store.setState({
      assignmentProgress: progress,
      numberPathComplete: true,
      phase: 'hub',
      activePath: null,
      currentAssignment: null,
      codeBoard: {
        ...store.getState().codeBoard,
        numberLock: numberLockValues,
      },
    })
  }

  const solveAll = () => {
    const progress: Record<number, { solved: boolean; currentStep: number; attempts: number }> = {}
    config.assignments.forEach((a) => {
      progress[a.id] = { solved: true, currentStep: 0, attempts: 0 }
    })
    store.setState({
      assignmentProgress: progress,
      phase: 'complete',
      currentAssignment: null,
      activePath: null,
      wordPathComplete: true,
      numberPathComplete: true,
      codeBoard: { numberLock: numberLockValues, wordLock: wordLockLetters },
    })
  }

  const wordSolved = WORD_PATH.filter((id) => assignmentProgress[id]?.solved).length
  const numberSolved = NUMBER_PATH.filter((id) => assignmentProgress[id]?.solved).length

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 right-4 z-[9999] w-10 h-10 bg-red-600 text-white rounded-full text-xs font-bold shadow-lg hover:bg-red-700"
        title="Master Mode"
      >
        M
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-gray-900 text-white rounded-2xl shadow-2xl p-4 w-80 max-h-[85vh] overflow-y-auto text-xs">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-red-400 text-sm">MASTER MODE</span>
        <button onClick={() => setCollapsed(true)} className="text-gray-400 hover:text-white text-lg leading-none">
          &times;
        </button>
      </div>

      {/* State info */}
      <div className="bg-gray-800 rounded-lg p-2 mb-3 space-y-1">
        <div>Phase: <span className="text-yellow-400 font-mono">{phase}</span></div>
        <div>Path: <span className="text-yellow-400 font-mono">{activePath ?? 'none'}</span></div>
        <div>Assignment: <span className="text-yellow-400 font-mono">{currentAssignment ?? 'hub'}</span></div>
        <div>
          Word: <span className={cn('font-mono', wordPathComplete ? 'text-green-400' : 'text-yellow-400')}>{wordPathComplete ? 'DONE' : `${wordSolved}/${WORD_PATH.length}`}</span>
          {' | '}
          Number: <span className={cn('font-mono', numberPathComplete ? 'text-green-400' : 'text-yellow-400')}>{numberPathComplete ? 'DONE' : `${numberSolved}/${NUMBER_PATH.length}`}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <MBtn onClick={solveCurrentAssignment} color="green">Solve Current</MBtn>
        <MBtn onClick={completeWordPath} color="blue">Complete Word</MBtn>
        <MBtn onClick={completeNumberPath} color="blue">Complete Number</MBtn>
        <MBtn onClick={solveAll} color="purple">Solve All</MBtn>
        <MBtn onClick={() => store.getState().resetGame()} color="red">Reset</MBtn>
      </div>

      {/* Phase jumps */}
      <div className="mb-3">
        <div className="text-gray-400 font-bold mb-1">Phases</div>
        <div className="flex flex-wrap gap-1">
          {PHASES.map((p) => (
            <button
              key={p}
              onClick={() => jumpToPhase(p)}
              className={cn(
                'px-2 py-1 rounded text-[10px] font-mono',
                phase === p ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Word Path assignments */}
      <div className="mb-3">
        <div className="text-gray-400 font-bold mb-1">🔤 Word Path</div>
        <div className="grid grid-cols-5 gap-1">
          {WORD_PATH.map((id) => {
            const a = config.assignments.find((x) => x.id === id)
            if (!a) return null
            const solved = assignmentProgress[id]?.solved
            const isCurrent = currentAssignment === id
            return (
              <button
                key={id}
                onClick={() => jumpToAssignment(id)}
                title={a.title}
                className={cn(
                  'rounded flex flex-col items-center justify-center py-1 font-bold text-[10px] leading-tight',
                  solved && 'bg-green-700 text-green-200',
                  isCurrent && !solved && 'bg-yellow-600 text-black',
                  !solved && !isCurrent && 'bg-gray-700 hover:bg-gray-600',
                )}
              >
                <span>{a.icon}</span>
                <span>{id}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Number Path assignments */}
      <div>
        <div className="text-gray-400 font-bold mb-1">🔢 Number Path</div>
        <div className="grid grid-cols-7 gap-1">
          {NUMBER_PATH.map((id) => {
            const a = config.assignments.find((x) => x.id === id)
            if (!a) return null
            const solved = assignmentProgress[id]?.solved
            const isCurrent = currentAssignment === id
            return (
              <button
                key={id}
                onClick={() => jumpToAssignment(id)}
                title={a.title}
                className={cn(
                  'rounded flex flex-col items-center justify-center py-1 font-bold text-[10px] leading-tight',
                  solved && 'bg-green-700 text-green-200',
                  isCurrent && !solved && 'bg-yellow-600 text-black',
                  !solved && !isCurrent && 'bg-gray-700 hover:bg-gray-600',
                )}
              >
                <span>{a.icon}</span>
                <span className="text-[8px]">{id}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MBtn({ onClick, color, children }: { onClick: () => void; color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-600 hover:bg-blue-500',
    green: 'bg-green-600 hover:bg-green-500',
    purple: 'bg-purple-600 hover:bg-purple-500',
    red: 'bg-red-600 hover:bg-red-500',
  }
  return (
    <button onClick={onClick} className={cn('px-2 py-1 rounded text-[11px] font-bold', colors[color])}>
      {children}
    </button>
  )
}
