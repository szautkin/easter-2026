import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameStore, RevealConfig, CodeBoardState, GamePhase } from '@/types'

const INITIAL_DURATION = 3600 // 60 minutes

const VALID_PHASES: GamePhase[] = ['idle', 'hub', 'word_path', 'number_path', 'complete']

const initialCodeBoard: CodeBoardState = {
  numberLock: [null, null, null],
  wordLock: [null, null, null, null],
}

// ─── Path Playlists ──────────────────────────────────────────
export const WORD_PATH = [15, 13, 14, 4, 11]
export const NUMBER_PATH = [101, 102, 104, 105, 106, 103, 107]

function getPathPlaylist(path: 'word' | 'number'): number[] {
  return path === 'word' ? WORD_PATH : NUMBER_PATH
}

function getNextInPath(path: number[], currentId: number): number | null {
  const idx = path.indexOf(currentId)
  if (idx === -1 || idx >= path.length - 1) return null
  return path[idx + 1]
}

function isLastInPath(path: number[], currentId: number): boolean {
  return path.indexOf(currentId) === path.length - 1
}

// ─── Store ───────────────────────────────────────────────────
export const useGameStore = create<GameStore>()(
  persist(
    (set, _get) => ({
      // ── State ──────────────────────────────────────────
      phase: 'idle',
      timer: {
        durationSeconds: INITIAL_DURATION,
        remainingSeconds: INITIAL_DURATION,
        isRunning: false,
        startedAt: null,
        totalElapsed: 0,
      },
      assignmentProgress: {},
      codeBoard: { ...initialCodeBoard },
      currentAssignment: null,
      hintsUnlocked: {},
      playlist: [...WORD_PATH, ...NUMBER_PATH, 12],
      activePath: null,
      wordPathComplete: false,
      numberPathComplete: false,
      eggKeyFound: false,

      // ── Actions ────────────────────────────────────────
      startGame: () =>
        set({
          phase: 'hub',
          timer: {
            durationSeconds: INITIAL_DURATION,
            remainingSeconds: INITIAL_DURATION,
            isRunning: true,
            startedAt: Date.now(),
            totalElapsed: 0,
          },
        }),

      setCurrentAssignment: (id: number | null) =>
        set({ currentAssignment: id }),

      enterWordPath: () => {
        const playlist = getPathPlaylist('word')
        set({
          phase: 'word_path',
          activePath: 'word',
          currentAssignment: playlist[0],
        })
      },

      enterNumberPath: () => {
        const playlist = getPathPlaylist('number')
        set({
          phase: 'number_path',
          activePath: 'number',
          currentAssignment: playlist[0],
        })
      },

      returnToHub: () =>
        set({
          phase: 'hub',
          activePath: null,
          currentAssignment: null,
        }),

      markEggKeyFound: () =>
        set({ eggKeyFound: true }),

      startFinale: () =>
        set((state) => {
          // Capture elapsed time before stopping the timer
          const sessionElapsed = state.timer.startedAt !== null
            ? Math.floor((Date.now() - state.timer.startedAt) / 1000)
            : 0
          const remaining = Math.max(0, state.timer.durationSeconds - sessionElapsed)
          return {
            phase: 'complete' as const,
            currentAssignment: 12,
            activePath: null,
            timer: {
              ...state.timer,
              isRunning: false,
              remainingSeconds: remaining,
              totalElapsed: state.timer.totalElapsed + sessionElapsed,
              startedAt: null,
            },
          }
        }),

      advanceAssignmentStep: (id: number) =>
        set((state) => {
          const progress = state.assignmentProgress[id] ?? {
            solved: false,
            currentStep: 0,
            attempts: 0,
          }
          return {
            assignmentProgress: {
              ...state.assignmentProgress,
              [id]: { ...progress, currentStep: progress.currentStep + 1 },
            },
          }
        }),

      solveAssignment: (id: number) =>
        set((state) => {
          const progress = state.assignmentProgress[id] ?? {
            solved: false,
            currentStep: 0,
            attempts: 0,
          }
          const newProgress = {
            ...state.assignmentProgress,
            [id]: { ...progress, solved: true },
          }

          // Check if this is the finale
          if (id === 12) {
            return {
              assignmentProgress: newProgress,
              phase: 'complete' as const,
              currentAssignment: null,
            }
          }

          // Check if we're in an active path
          if (state.activePath) {
            const pathPlaylist = getPathPlaylist(state.activePath)
            if (isLastInPath(pathPlaylist, id)) {
              // Path complete → return to hub
              return {
                assignmentProgress: newProgress,
                phase: 'hub' as const,
                activePath: null,
                currentAssignment: null,
                wordPathComplete: state.activePath === 'word' ? true : state.wordPathComplete,
                numberPathComplete: state.activePath === 'number' ? true : state.numberPathComplete,
              }
            }
            // Advance within path
            const next = getNextInPath(pathPlaylist, id)
            return {
              assignmentProgress: newProgress,
              currentAssignment: next,
            }
          }

          return { assignmentProgress: newProgress }
        }),

      revealCode: (reveal: RevealConfig) =>
        set((state) => {
          const board = { ...state.codeBoard }
          if (reveal.type === 'lock_number' && reveal.position !== undefined && typeof reveal.value === 'number') {
            const nl = [...board.numberLock] as CodeBoardState['numberLock']
            nl[reveal.position] = reveal.value
            board.numberLock = nl
          } else if (reveal.type === 'word_code' && typeof reveal.value === 'string') {
            const chars = reveal.value.split('')
            board.wordLock = [chars[0] ?? null, chars[1] ?? null, chars[2] ?? null, chars[3] ?? null]
          }
          return { codeBoard: board }
        }),

      incrementAttempts: (id: number) =>
        set((state) => {
          const progress = state.assignmentProgress[id] ?? {
            solved: false,
            currentStep: 0,
            attempts: 0,
          }
          return {
            assignmentProgress: {
              ...state.assignmentProgress,
              [id]: { ...progress, attempts: progress.attempts + 1 },
            },
          }
        }),

      setPlaylist: (ids: number[]) =>
        set({ playlist: ids }),

      unlockHint: (assignmentId: number, hintIndex: number) =>
        set((state) => {
          const current = state.hintsUnlocked[assignmentId] ?? []
          if (current.includes(hintIndex)) return state
          return {
            hintsUnlocked: {
              ...state.hintsUnlocked,
              [assignmentId]: [...current, hintIndex],
            },
          }
        }),

      tickTimer: () =>
        set((state) => {
          if (!state.timer.isRunning || state.timer.startedAt === null) return state
          const elapsed = Math.floor((Date.now() - state.timer.startedAt) / 1000)
          const remaining = Math.max(0, state.timer.durationSeconds - elapsed)
          return {
            timer: { ...state.timer, remainingSeconds: remaining },
          }
        }),

      pauseTimer: () =>
        set((state) => {
          const sessionElapsed = state.timer.startedAt !== null
            ? Math.floor((Date.now() - state.timer.startedAt) / 1000)
            : 0
          const remaining = Math.max(0, state.timer.durationSeconds - sessionElapsed)
          return {
            timer: {
              ...state.timer,
              isRunning: false,
              remainingSeconds: remaining,
              totalElapsed: state.timer.totalElapsed + sessionElapsed,
            },
          }
        }),

      resumeTimer: () =>
        set((state) => ({
          timer: {
            ...state.timer,
            isRunning: true,
            startedAt: Date.now(),
            durationSeconds: state.timer.remainingSeconds,
          },
        })),

      resetGame: () =>
        set({
          phase: 'idle',
          timer: {
            durationSeconds: INITIAL_DURATION,
            remainingSeconds: INITIAL_DURATION,
            isRunning: false,
            startedAt: null,
            totalElapsed: 0,
          },
          assignmentProgress: {},
          codeBoard: { ...initialCodeBoard },
          currentAssignment: null,
          hintsUnlocked: {},
          playlist: [...WORD_PATH, ...NUMBER_PATH, 12],
          activePath: null,
          wordPathComplete: false,
          numberPathComplete: false,
          eggKeyFound: false,
        }),
    }),
    {
      name: 'easter-2026-game',
      version: 2,
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>
        if (version < 2) {
          // v1 had phases like 'idle', 'intake', 'phase1', 'phase2', etc.
          // v2 uses 'idle', 'hub', 'word_path', 'number_path', 'complete'.
          // Any unrecognized phase resets to 'idle' for a clean start.
          const phase = state.phase as string | undefined
          if (!phase || !VALID_PHASES.includes(phase as GamePhase)) {
            state.phase = 'idle'
          }
          // Ensure new v2 fields exist
          if (state.activePath === undefined) state.activePath = null
          if (state.wordPathComplete === undefined) state.wordPathComplete = false
          if (state.numberPathComplete === undefined) state.numberPathComplete = false
          if (state.eggKeyFound === undefined) state.eggKeyFound = false
        }
        return state as unknown as GameStore
      },
    },
  ),
)
