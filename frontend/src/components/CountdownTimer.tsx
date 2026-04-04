import { useEffect } from 'react'
import { Timer } from 'lucide-react'
import { useGameStore } from '@/store/gameStore'
import { useGameConfig } from '@/hooks/useGameConfig'
import { formatTime, cn } from '@/lib/utils'

export function CountdownTimer() {
  const timer = useGameStore((s) => s.timer)
  const tickTimer = useGameStore((s) => s.tickTimer)
  const config = useGameConfig()

  useEffect(() => {
    if (!timer.isRunning) return
    const interval = setInterval(tickTimer, 1000)
    return () => clearInterval(interval)
  }, [timer.isRunning, tickTimer])

  const isWarning = timer.remainingSeconds <= config.timer.warningAtSeconds
  const isUrgent = timer.remainingSeconds <= config.timer.urgentAtSeconds

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xl font-bold transition-colors',
        isUrgent && 'text-error animate-pulse-soft',
        isWarning && !isUrgent && 'text-yellow-accent',
        !isWarning && 'text-blue-primary',
      )}
    >
      <Timer className="w-5 h-5" />
      <span>{formatTime(timer.remainingSeconds)}</span>
    </div>
  )
}
