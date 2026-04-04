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
