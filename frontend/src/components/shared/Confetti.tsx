import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface ConfettiProps {
  trigger: boolean
  duration?: number
}

export function Confetti({ trigger, duration = 3000 }: ConfettiProps) {
  useEffect(() => {
    if (!trigger) return

    const end = Date.now() + duration
    const colors = ['#1B4F8A', '#85B7EB', '#FCD34D', '#22C55E', '#EF4444', '#A855F7']
    let rafId: number
    let cancelled = false

    const frame = () => {
      if (cancelled) return
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      })
      if (Date.now() < end) {
        rafId = requestAnimationFrame(frame)
      }
    }

    rafId = requestAnimationFrame(frame)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
    }
  }, [trigger, duration])

  return null
}
