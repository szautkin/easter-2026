import { useGameStore, WORD_PATH, NUMBER_PATH } from '@/store/gameStore'

export function ProgressBar() {
  const phase = useGameStore((s) => s.phase)
  const activePath = useGameStore((s) => s.activePath)
  const assignmentProgress = useGameStore((s) => s.assignmentProgress)

  if (phase === 'idle' || phase === 'hub' || phase === 'complete') return null

  const pathPlaylist = activePath === 'word' ? WORD_PATH : NUMBER_PATH
  const label = activePath === 'word' ? '🔤 Word Lock' : '🔢 Number Lock'
  const total = pathPlaylist.length
  const current = pathPlaylist.filter((id) => assignmentProgress[id]?.solved).length
  const pct = Math.round((current / total) * 100)

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
        <span>{label}</span>
        <span>{current}/{total}</span>
      </div>
      <div className="relative h-3 bg-blue-tint rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-yellow-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
        {pct > 5 && (
          <span
            className="absolute top-1/2 -translate-y-1/2 text-xs transition-all duration-500"
            style={{ left: `calc(${pct}% - 12px)` }}
          >
            🐰
          </span>
        )}
      </div>
    </div>
  )
}
