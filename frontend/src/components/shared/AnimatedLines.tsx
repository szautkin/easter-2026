import { useState, useEffect, memo } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedLinesProps {
  lines: string[]
  icon: string
}

export const AnimatedLines = memo(function AnimatedLines({ lines, icon }: AnimatedLinesProps) {
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    if (visibleLines >= lines.length) return
    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1)
      if ('vibrate' in navigator) navigator.vibrate(30)
    }, 800)
    return () => clearTimeout(timer)
  }, [visibleLines, lines.length])

  return (
    <div className="space-y-3">
      <div className="text-4xl text-center">{icon}</div>
      {lines.map((line, i) => (
        <p
          key={i}
          className={cn(
            'text-lg italic leading-relaxed transition-all duration-700 text-blue-primary',
            i < visibleLines ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          )}
        >
          {line}
        </p>
      ))}
    </div>
  )
})
