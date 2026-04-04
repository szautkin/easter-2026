import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeAnswer(input: string, type: 'number' | 'letter'): string | number {
  const trimmed = input.trim()
  if (type === 'number') {
    const n = parseInt(trimmed, 10)
    return Number.isNaN(n) ? -1 : n
  }
  return trimmed.toUpperCase()
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

import confetti from 'canvas-confetti'

export function fireSparkle(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  confetti({
    particleCount: 30,
    spread: 50,
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    },
    colors: ['#FCD34D', '#1B4F8A', '#22C55E', '#A855F7'],
    startVelocity: 20,
    gravity: 0.8,
    ticks: 60,
  })
}
