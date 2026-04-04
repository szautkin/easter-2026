import { useRef, useCallback, type KeyboardEvent, type ChangeEvent } from 'react'
import { cn } from '@/lib/utils'

interface CharacterInputProps {
  length: number
  type: 'number' | 'letter'
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
  success?: boolean
}

export function CharacterInput({
  length,
  type,
  value,
  onChange,
  disabled = false,
  error = false,
  success = false,
}: CharacterInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const focusInput = useCallback((index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus()
    }
  }, [length])

  const handleChange = useCallback(
    (index: number, e: ChangeEvent<HTMLInputElement>) => {
      const char = e.target.value.slice(-1)

      if (type === 'number' && !/^\d$/.test(char)) return
      if (type === 'letter' && !/^[a-zA-Z]$/.test(char)) return

      const chars = value.padEnd(length, ' ').split('')
      chars[index] = type === 'letter' ? char.toUpperCase() : char
      const newValue = chars.join('').trimEnd()
      onChange(newValue)

      if (char && index < length - 1) {
        focusInput(index + 1)
      }
    },
    [value, length, type, onChange, focusInput],
  )

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        const chars = value.padEnd(length, ' ').split('')
        if (chars[index]?.trim()) {
          chars[index] = ' '
          onChange(chars.join('').trimEnd())
        } else if (index > 0) {
          chars[index - 1] = ' '
          onChange(chars.join('').trimEnd())
          focusInput(index - 1)
        }
        e.preventDefault()
      } else if (e.key === 'ArrowLeft') {
        focusInput(index - 1)
      } else if (e.key === 'ArrowRight') {
        focusInput(index + 1)
      }
    },
    [value, length, onChange, focusInput],
  )

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length }, (_, i) => {
        const char = value[i] ?? ''
        return (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el }}
            type="text"
            inputMode={type === 'number' ? 'numeric' : 'text'}
            maxLength={1}
            value={char}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={disabled}
            autoComplete="off"
            className={cn(
              'w-16 h-16 text-center text-3xl font-bold rounded-xl border-2 outline-none transition-all duration-200 font-mono',
              'focus:border-blue-primary focus:shadow-glow-blue',
              !char && !disabled && 'bg-[#F8FAFC] border-dashed border-blue-light',
              char && !error && !success && 'bg-white border-blue-primary',
              error && 'animate-shake border-error bg-red-50',
              success && 'bg-yellow-tint border-yellow-accent',
              disabled && 'opacity-60 cursor-not-allowed',
            )}
          />
        )
      })}
    </div>
  )
}
