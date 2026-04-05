// ─── Game Phases ───────────────────────────────────────────────
export type GamePhase =
  | 'idle'
  | 'hub'
  | 'word_path'
  | 'number_path'
  | 'complete'

// ─── Intake (Phase 0) ─────────────────────────────────────────
export interface IntakeRiddle {
  id: string
  type: 'word' | 'number'
  riddle: string
  answer: string | number
  hint: string
  illustration: string
}

// ─── Assignments (Phase 1-4) ──────────────────────────────────
export type AssignmentType =
  | 'single_answer'
  | 'multi_step_math'
  | 'video_question'
  | 'poem_riddle'
  | 'chain_logic'
  | 'progressive_disclosure'
  | 'shed_reveal'
  | 'number_lock_assembly'
  | 'video_table_math'
  | 'anagram'
  | 'finale'

export type InputType = 'number' | 'letter'

export interface AssignmentStep {
  prompt: string
  answer: number | string
  inputType: InputType
}

export interface VideoConfig {
  src: string
  poster: string
  subtitles?: string
  fallbackText: string
}

export interface TableRow {
  name: string
  answer: number
}

export interface TableConfig {
  label: string
  rows: TableRow[]
  subtotal: number
  subtotalLabel: string
}

export interface FollowUpConfig {
  prompt: string
  answer: number
}

export interface HintConfig {
  delaySeconds: number
  text: string
}

export interface RevealConfig {
  type: 'digit' | 'letter' | 'lock_number' | 'word_code' | 'treasure'
  value?: number | string
  position?: number
}

export interface MessageConfig {
  title: string
  numberCode: string
  wordCode: string
  instruction: string
}

// ─── Progressive Disclosure Layers ────────────────────────────
export type LayerType = 'video_clue' | 'magic_word' | 'poem_riddle'

export interface VideoClueLayer {
  type: 'video_clue'
  label: string
  prompt: string
  video: VideoConfig
}

export interface MagicWordLayer {
  type: 'magic_word'
  label: string
  prompt: string
  riddle?: string
  acceptedWords: string[]
  unlockMessage?: string
}

export interface PoemRiddleLayer {
  type: 'poem_riddle'
  label: string
  prompt: string
  poem: string[]
}

export type DisclosureLayer = VideoClueLayer | MagicWordLayer | PoemRiddleLayer

export interface Assignment {
  id: number
  phase: number
  title: string
  icon: string
  type: AssignmentType
  assignedTo: 'boy' | 'girl' | 'both'
  reveals: RevealConfig

  // Single answer assignments
  prompt?: string
  answer?: number | string
  inputType?: InputType

  // Multi-step assignments
  steps?: AssignmentStep[]

  // Video assignments
  video?: VideoConfig

  // Poem assignments
  poem?: string[]

  // Chain logic
  chainFrom?: { assignmentId: number; label: string }

  // Table math
  table?: TableConfig
  followUp?: FollowUpConfig

  // Anagram
  letters?: string[]
  hints?: HintConfig[]

  // Finale
  message?: MessageConfig

  // Progressive disclosure
  layers?: DisclosureLayer[]

  // Number lock assembly
  digits?: number[]
  correctPairs?: string[]

  // Common
  successMessage?: string
  bonusText?: string
  hint?: string
}

// ─── Code Board ───────────────────────────────────────────────
export interface CodeBoardState {
  numberLock: [number | null, number | null, number | null]
  wordLock: [string | null, string | null, string | null, string | null]
}

// ─── Timer ────────────────────────────────────────────────────
export interface TimerState {
  durationSeconds: number
  remainingSeconds: number
  isRunning: boolean
  startedAt: number | null
  totalElapsed: number
}

// ─── Assignment Progress ──────────────────────────────────────
export interface AssignmentProgress {
  solved: boolean
  currentStep: number
  attempts: number
}

// ─── Game Config (loaded from JSON) ───────────────────────────
export interface GameConfig {
  meta: {
    event: string
    version: string
    description?: string
  }
  timer: {
    durationSeconds: number
    warningAtSeconds: number
    urgentAtSeconds: number
    softTimeout: boolean
  }
  codes: {
    numberLock: {
      values: [number, number, number]
      displayFormat: string
      selectorOptions: { min: number; max: number }
    }
    wordLock: {
      value: string
      selectorOptions: string
    }
  }
  eggs: {
    words: string[]
  }
  intake: {
    instructions: string
    transitionMessage: string
    riddles: IntakeRiddle[]
  }
  assignments: Assignment[]
  ui: {
    theme: string
    wrongAnswerMessage: string
    correctAnswerMessage: string
    illustrations: string[]
  }
}

// ─── Game Store ───────────────────────────────────────────────
export interface GameStore {
  // State
  phase: GamePhase
  timer: TimerState
  assignmentProgress: Record<number, AssignmentProgress>
  codeBoard: CodeBoardState
  currentAssignment: number | null
  hintsUnlocked: Record<number, number[]>
  playlist: number[]
  activePath: 'word' | 'number' | null
  wordPathComplete: boolean
  numberPathComplete: boolean
  eggKeyFound: boolean

  // Actions
  startGame: () => void
  setCurrentAssignment: (id: number | null) => void
  advanceAssignmentStep: (id: number) => void
  solveAssignment: (id: number) => void
  revealCode: (reveal: RevealConfig) => void
  incrementAttempts: (id: number) => void
  unlockHint: (assignmentId: number, hintIndex: number) => void
  setPlaylist: (ids: number[]) => void
  enterWordPath: () => void
  enterNumberPath: () => void
  returnToHub: () => void
  markEggKeyFound: () => void
  startFinale: () => void
  tickTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetGame: () => void
}
