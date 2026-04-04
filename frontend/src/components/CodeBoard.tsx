import { useGameStore } from '@/store/gameStore'
import { cn } from '@/lib/utils'

export function CodeBoard() {
  const codeBoard = useGameStore((s) => s.codeBoard)
  const phase = useGameStore((s) => s.phase)

  if (phase === 'idle' || phase === 'hub' || phase === 'complete') return null

  return (
    <div className="bg-blue-tint rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 shadow-card">
      {/* Lock 1: Number combination */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Lock 1</span>
        <div className="flex items-center gap-1">
          {codeBoard.numberLock.map((digit, i) => (
            <div key={`nl-${i}`} className="flex items-center">
              <CodeCell value={digit !== null ? String(digit) : null} />
              {i < 2 && <span className="text-blue-primary font-bold mx-0.5">&ndash;</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Lock 2: Word code */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Lock 2</span>
        <div className="flex items-center gap-1">
          {codeBoard.wordLock.map((letter, i) => (
            <CodeCell key={`wl-${i}`} value={letter} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CodeCell({ value }: { value: string | null }) {
  return (
    <div
      className={cn(
        'w-10 h-12 flex items-center justify-center rounded-lg font-mono text-xl font-bold transition-all duration-300',
        value
          ? 'bg-yellow-accent text-blue-primary border-2 border-blue-primary animate-pop'
          : 'bg-white border-2 border-dashed border-blue-light text-blue-light',
      )}
    >
      {value ?? '?'}
    </div>
  )
}
