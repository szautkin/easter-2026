# ADR-002: State Management Architecture

## Status
Accepted

## Context
The game has complex state: 20 intake riddles, 12 sequential assignments, progressive code reveal across two locks, a countdown timer, and phase transitions. State must persist across page refreshes (kids might accidentally close the browser).

## Decision
Use **Zustand** with `persist` middleware backed by `localStorage`.

### Store Structure
```
GameStore
├── phase: 'idle' | 'intake' | 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'complete'
├── timerState: { startedAt, remaining, isRunning, isPaused }
├── intake: { solvedIds: Set<string>, totalRequired: 20 }
├── assignments: Map<number, { solved: boolean, currentStep: number, attempts: number }>
├── codeBoard: {
│   numberLock: [number|null, number|null, number|null]
│   wordLock: [string|null, string|null, string|null, string|null]
│ }
├── currentAssignment: number | null
├── hintsUnlocked: Map<number, number[]>
└── actions: { solveIntake, solveAssignment, advanceStep, revealCode, startTimer, ... }
```

### State Machine Transitions
```
idle → intake (START pressed)
intake → phase1 (all 20 riddles solved)
phase1 → phase2 (assignments 1-3 solved)
phase2 → phase3 (assignments 4-7 solved)
phase3 → phase4 (assignments 8-10 solved)
phase4 → complete (assignments 11-12 solved)
```

## Consequences
- No Redux boilerplate; simple actions as store methods
- localStorage persistence survives browser refresh
- Zustand's shallow comparison prevents unnecessary re-renders
- Timer runs via `setInterval` with drift compensation, stored as `startedAt` timestamp
