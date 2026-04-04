import { useState, useCallback, useEffect } from 'react'
import { useAssignment } from '@/hooks/useGameConfig'
import { useGameStore } from '@/store/gameStore'
import { CharacterInput } from '@/components/shared/CharacterInput'
import { MediaPlayer } from '@/components/shared/MediaPlayer'
import { AnimatedLines } from '@/components/shared/AnimatedLines'
import { Confetti } from '@/components/shared/Confetti'
import type { DisclosureLayer } from '@/types'
import { cn } from '@/lib/utils'

const MAX_ATTEMPTS = 3

// ─── Layer Renderers ─────────────────────────────────────────
function VideoClueContent({ layer }: { layer: Extract<DisclosureLayer, { type: 'video_clue' }> }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">{layer.prompt}</p>
      <MediaPlayer video={layer.video} />
    </div>
  )
}

function MagicWordContent({
  layer,
  onUnlock,
  unlocked,
}: {
  layer: Extract<DisclosureLayer, { type: 'magic_word' }>
  onUnlock: () => void
  unlocked: boolean
}) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = useCallback(() => {
    const word = input.trim().toUpperCase()
    if (layer.acceptedWords.some((w) => w.toUpperCase() === word)) {
      onUnlock()
    } else {
      setError(true)
      setTimeout(() => setError(false), 600)
    }
  }, [input, layer.acceptedWords, onUnlock])

  if (unlocked) {
    return (
      <div className="bg-success/10 border border-success/30 rounded-xl p-3 text-center text-success font-bold animate-pop">
        {layer.unlockMessage ?? 'Unlocked! Keep going...'}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-primary">{layer.prompt}</p>
      {layer.riddle && (
        <div className="bg-yellow-tint border border-yellow-accent/30 rounded-xl p-4 text-base italic text-text-primary leading-relaxed">
          {layer.riddle}
        </div>
      )}
      <div className={cn('flex items-center gap-2', error && 'animate-shake')}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="TYPE THE MAGIC WORD"
          aria-label="Magic word"
          className={cn(
            'flex-1 h-12 text-center font-bold rounded-lg border-2 outline-none transition-all text-lg uppercase tracking-wider',
            error ? 'border-error bg-red-50' : 'border-blue-light focus:border-blue-primary',
          )}
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className={cn(
            'h-12 px-5 rounded-lg font-bold transition-all',
            input.trim()
              ? 'bg-blue-primary text-white hover:bg-blue-primary/90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
        >
          🔑
        </button>
      </div>
      {error && <p className="text-xs text-error" role="alert">That's not the magic word — look at your egg slips!</p>}
    </div>
  )
}

function RiddleContent({ layer, icon }: { layer: Extract<DisclosureLayer, { type: 'poem_riddle' }>; icon: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">{layer.prompt}</p>
      <AnimatedLines lines={layer.poem} icon={icon} />
    </div>
  )
}

// ─── Locked Screen ───────────────────────────────────────────
function LockedScreen({ assignmentId: _assignmentId }: { assignmentId: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
      <div className="text-8xl animate-shake">💀</div>
      <div className="bg-red-950 border-4 border-red-600 rounded-2xl p-8 max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-red-500 mb-3">LOCKED FOREVER</h2>
        <p className="text-red-300 text-lg mb-4">
          You used all 3 attempts. This letter is now sealed in darkness...
        </p>
        <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-2xl bg-red-900 border-2 border-red-600 text-4xl font-bold font-mono text-red-500 line-through">
          ?
        </div>
        <p className="text-red-400 text-sm mt-4 italic">
          The code board will have a missing piece. Can you still figure out the final answer?
        </p>
      </div>
      <div className="flex gap-3 text-3xl animate-pulse-soft">
        <span>🔒</span>
        <span>⛓️</span>
        <span>🔒</span>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────
interface Props {
  assignmentId: number
}

export function ProgressiveDisclosureAssignment({ assignmentId }: Props) {
  const assignment = useAssignment(assignmentId)
  const solveAssignment = useGameStore((s) => s.solveAssignment)
  const revealCode = useGameStore((s) => s.revealCode)
  const progress = useGameStore((s) => s.assignmentProgress[assignmentId])
  const incrementAttempts = useGameStore((s) => s.incrementAttempts)
  const advanceStep = useGameStore((s) => s.advanceAssignmentStep)

  const currentLayer = progress?.currentStep ?? 0
  const attempts = progress?.attempts ?? 0
  const isSolved = progress?.solved ?? false
  const isLocked = attempts >= MAX_ATTEMPTS && !isSolved

  const [answerValue, setAnswerValue] = useState('')
  const [error, setError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [magicWordUnlocked, setMagicWordUnlocked] = useState(false)

  const layers = assignment?.layers

  const handleCheckAnswer = useCallback(() => {
    if (!answerValue.trim() || !assignment) return
    const expected = String(assignment.answer).toUpperCase()
    const actual = answerValue.trim().toUpperCase()
    if (actual === expected) {
      setShowSuccess(true)
      revealCode(assignment.reveals)
    } else {
      incrementAttempts(assignmentId)
      setError(true)
      setTimeout(() => setError(false), 600)
    }
  }, [answerValue, assignment, assignmentId, revealCode, incrementAttempts])

  const handleNextTask = useCallback(() => {
    solveAssignment(assignmentId)
  }, [solveAssignment, assignmentId])

  const handleNeedMoreHints = useCallback(() => {
    if (!layers || currentLayer >= layers.length - 1) return
    advanceStep(assignmentId)
  }, [layers, currentLayer, advanceStep, assignmentId])

  const handleMagicWordUnlock = useCallback(() => {
    setMagicWordUnlocked(true)
    setTimeout(() => {
      advanceStep(assignmentId)
    }, 1000)
  }, [advanceStep, assignmentId])

  useEffect(() => {
    setMagicWordUnlocked(false)
  }, [currentLayer])

  if (!assignment || !layers) {
    return <div className="text-center py-12 text-error">Assignment {assignmentId} configuration missing</div>
  }

  if (isLocked) {
    return (
      <div>
        <LockedScreen assignmentId={assignmentId} />
        <div className="flex justify-center mt-6">
          <button
            onClick={handleNextTask}
            className="px-10 py-3 rounded-xl font-bold text-lg bg-blue-primary text-white hover:bg-blue-primary/90 shadow-card transition-all"
          >
            Continue →
          </button>
        </div>
      </div>
    )
  }

  if (showSuccess || isSolved) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12 text-center animate-pop">
        <Confetti trigger />
        <span className="text-6xl">{assignment.icon}</span>
        <h2 className="text-3xl font-bold text-blue-primary">{assignment.successMessage}</h2>
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-yellow-tint border-2 border-yellow-accent text-4xl font-bold font-mono text-blue-primary">
          {String(assignment.answer)}
        </div>
        <button
          onClick={handleNextTask}
          className="mt-4 px-10 py-3 rounded-xl font-bold text-lg bg-blue-primary text-white hover:bg-blue-primary/90 shadow-card transition-all hover:scale-105 active:scale-95"
        >
          Next Task →
        </button>
      </div>
    )
  }

  const activeLayer = layers[currentLayer]
  const isLastLayer = currentLayer >= layers.length - 1
  const canAdvance = activeLayer?.type !== 'magic_word' || magicWordUnlocked
  const attemptsLeft = MAX_ATTEMPTS - attempts

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-primary flex items-center justify-center gap-2">
          <span className="text-3xl">{assignment.icon}</span>
          {assignment.title}
        </h2>
      </div>

      {/* Layer Progress */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {layers.map((layer, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all',
                i < currentLayer && 'bg-success/20 text-success',
                i === currentLayer && 'bg-blue-primary text-white',
                i > currentLayer && 'bg-gray-100 text-gray-400',
              )}
            >
              {i < currentLayer ? '✓' : i + 1} {layer.label}
            </div>
            {i < layers.length - 1 && (
              <span className={cn('text-xs', i < currentLayer ? 'text-success' : 'text-gray-300')}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* Accumulated Layers */}
      <div className="flex flex-col gap-4">
        {layers.slice(0, currentLayer + 1).map((layer, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-card p-5 animate-pop">
            {layer.type === 'video_clue' && <VideoClueContent layer={layer} />}
            {layer.type === 'magic_word' && (
              <MagicWordContent
                layer={layer}
                onUnlock={handleMagicWordUnlock}
                unlocked={i < currentLayer || magicWordUnlocked}
              />
            )}
            {layer.type === 'poem_riddle' && <RiddleContent layer={layer} icon={assignment.icon} />}
          </div>
        ))}
      </div>

      {/* Need More Hints Button — only after a wrong attempt */}
      {!isLastLayer && canAdvance && attempts > 0 && (
        <button
          onClick={handleNeedMoreHints}
          className="self-center px-6 py-2.5 rounded-full bg-yellow-tint border-2 border-yellow-accent text-blue-primary font-bold text-sm hover:bg-yellow-accent/30 transition-all"
        >
          I need more hints...
        </button>
      )}

      {/* Answer Section — always visible */}
      <div className={cn(
        'rounded-2xl p-5 flex flex-col items-center gap-4 border-2',
        attemptsLeft === 1
          ? 'bg-red-50 border-red-300'
          : 'bg-blue-tint border-blue-light/30',
      )}>
        <p className="font-bold text-blue-primary text-lg">
          {assignment.prompt ?? 'What is the answer? Type the FIRST letter!'}
        </p>

        {/* Attempt counter */}
        <div className={cn(
          'flex items-center gap-2 text-sm font-bold',
          attemptsLeft === 1 ? 'text-red-600 animate-pulse-soft' : 'text-text-secondary',
        )}>
          <span>Attempts:</span>
          <div className="flex gap-1">
            {Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
              <span
                key={i}
                className={cn(
                  'w-3 h-3 rounded-full transition-all',
                  i < attempts ? 'bg-red-500' : 'bg-success',
                )}
              />
            ))}
          </div>
          <span>({attemptsLeft} left)</span>
        </div>

        {/* Warning on last attempt */}
        {attemptsLeft === 1 && (
          <div className="bg-red-100 border-2 border-red-400 rounded-xl p-3 text-center animate-shake">
            <p className="text-red-700 font-bold text-sm">
              ⚠️ LAST CHANCE! One more wrong answer and this letter is LOCKED FOREVER! ⚠️
            </p>
          </div>
        )}

        <CharacterInput
          length={String(assignment.answer).length}
          type={assignment.inputType ?? 'letter'}
          value={answerValue}
          onChange={setAnswerValue}
          error={error}
        />
        <button
          onClick={handleCheckAnswer}
          disabled={answerValue.length < String(assignment.answer).length}
          className={cn(
            'px-8 py-3 rounded-xl font-bold text-lg transition-all',
            answerValue.length >= String(assignment.answer).length
              ? attemptsLeft === 1
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-card'
                : 'bg-blue-primary text-white hover:bg-blue-primary/90 shadow-card'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
        >
          Check Answer
        </button>
        {error && (
          <p className="text-error font-bold animate-shake">
            {attemptsLeft === 0 ? 'Too late...' : `Wrong! ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining!`}
          </p>
        )}
      </div>
    </div>
  )
}
