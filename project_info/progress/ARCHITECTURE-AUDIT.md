# Architecture Audit: Easter 2026 Frontend

**Date**: 2026-04-01 (Easter Eve)
**Scope**: All 22 active source files in `frontend/src/`
**Auditor**: React/TypeScript Lead
**Purpose**: Design quality audit — SOLID principles, DRY violations, React optimization, component architecture

---

## Executive Summary

The codebase is compact (~1,500 lines across 22 files) and ships a working Easter egg hunt game. The architecture is sound at the macro level — Zustand for client state, config-driven assignments, shared components for inputs and media. However, the rush to ship has produced significant DRY violations (particularly in drag-and-drop components and success screens), a god-component in `ProgressiveDisclosureAssignment`, and several React optimization gaps. The `Assignment` interface is a textbook Interface Segregation violation — a single type with ~20 optional fields serving 11 different assignment types.

Given Easter is tomorrow, I have prioritized every finding. The HIGH items are ones that would cause real UX issues or make post-Easter maintenance painful. The LOW items are for a future refactor.

---

## 1. DRY Violations

### DRY-1: DraggableLetter and DraggablePair are the same component
**Files**: `A11_ShedReveal.tsx` (lines 18-56), `NumberLockAssembly.tsx` (lines 16-54)
**Severity**: HIGH

These two components are structurally identical. The only differences:
- `ITEM_TYPE` string (`'LETTER'` vs `'PAIR'`)
- One prop is named `letter`/`moveLetter`, the other `value`/`movePair`
- Dimensions: `64x80` vs `80x64`
- One has `font-mono` in className, the other does not

**Refactoring suggestion**: Extract a generic `DraggableItem` component:

```tsx
// components/shared/DraggableItem.tsx
interface DraggableItemProps {
  value: string
  index: number
  itemType: string
  onMove: (from: number, to: number) => void
  sparkle: boolean
  width?: number
  height?: number
  className?: string
}
```

Both `A11_ShedReveal` and `NumberLockAssembly` would import and configure this shared component. The `useDrag`/`useDrop` wiring is identical — zero behavioral difference.

**Priority**: MEDIUM — Not a bug, but two copies of drag-and-drop wiring will drift apart during maintenance.

---

### DRY-2: fireLetterSparkle and fireSparkle are identical functions
**Files**: `A11_ShedReveal.tsx` (lines 58-69), `NumberLockAssembly.tsx` (lines 56-67)
**Severity**: HIGH

These are character-for-character identical, with only the function name differing. Same confetti config, same origin calculation, same colors, same physics parameters.

**Refactoring suggestion**: Move to `lib/utils.ts` or `shared/confettiUtils.ts`:

```tsx
export function fireElementSparkle(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { ... },
    colors: ['#FCD34D', '#1B4F8A', '#22C55E', '#A855F7'],
    startVelocity: 20,
    gravity: 0.8,
    ticks: 60,
  })
}
```

**Priority**: HIGH — This is the most egregious copy-paste. One-line fix.

---

### DRY-3: isTouchDevice detection duplicated
**Files**: `A11_ShedReveal.tsx` (line 13), `NumberLockAssembly.tsx` (line 12)
**Severity**: MEDIUM

Exact same line:
```tsx
const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
```

And both files duplicate the same DndProvider wrapper pattern:
```tsx
export function ComponentName(props) {
  return (
    <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
      <InnerComponent {...props} />
    </DndProvider>
  )
}
```

**Refactoring suggestion**: Extract a `DndWrapper` component or hook:

```tsx
// components/shared/DndWrapper.tsx
const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export function DndWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
      {children}
    </DndProvider>
  )
}
```

**Priority**: MEDIUM — Low risk, but trivial to extract.

---

### DRY-4: Fisher-Yates shuffle duplicated with identical "ensure not original" loop
**Files**: `A11_ShedReveal.tsx` (lines 82-94), `NumberLockAssembly.tsx` (lines 80-90)
**Severity**: MEDIUM

Both files implement the same do-while shuffle pattern:
```tsx
do {
  for (let i = p.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
} while (p.join('...') === target)
```

**Refactoring suggestion**: Extract to `lib/utils.ts`:

```tsx
export function shuffleAwayFrom<T>(items: T[], target: string, joiner = ''): T[] {
  const p = [...items]
  do {
    for (let i = p.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[p[i], p[j]] = [p[j], p[i]]
    }
  } while (p.join(joiner) === target)
  return p
}
```

**Priority**: LOW — Works fine as-is, but if the shuffle logic ever needs a bug fix, you'd need to patch two files.

---

### DRY-5: Success/celebration screens follow identical patterns across 3 components
**Files**: `ProgressiveDisclosureAssignment.tsx` (lines 234-249), `A11_ShedReveal.tsx` (lines 132-165), `NumberLockAssembly.tsx` (lines 131-157)
**Severity**: MEDIUM

All three share this structure:
1. `<Confetti trigger />` at the top
2. Large emoji icon
3. Bold title in `text-blue-primary`
4. Subtitle/description
5. Revealed code/answer display
6. "Next Task" button with identical styling

The differences are content and code display format. The pattern is:

```
confetti + icon + title + description + code_display + next_button
```

**Refactoring suggestion**: Extract a `SuccessScreen` compound component:

```tsx
interface SuccessScreenProps {
  icon: string
  title: string
  description: string
  onNext: () => void
  nextLabel?: string
  confettiDuration?: number
  children?: React.ReactNode  // for custom code display
}
```

**Priority**: LOW — All three work fine. This is a maintenance/consistency improvement, not a correctness one. Extract post-Easter if you add more assignment types.

---

### DRY-6: "Next Task" button styling duplicated verbatim
**Files**: `ProgressiveDisclosureAssignment.tsx` (line 243), `A11_ShedReveal.tsx` (line 158), `NumberLockAssembly.tsx` (line 150)
**Severity**: LOW

Identical className on all three:
```
"mt-4 px-10 py-3 rounded-xl font-bold text-lg bg-blue-primary text-white hover:bg-blue-primary/90 shadow-card transition-all hover:scale-105 active:scale-95"
```

**Refactoring suggestion**: Either extract as part of `SuccessScreen` (DRY-5) or create a `PrimaryButton` shared component.

**Priority**: LOW — Pure cosmetic consistency.

---

### DRY-7: "Open the Lock!" button styling duplicated
**Files**: `A11_ShedReveal.tsx` (line 223), `NumberLockAssembly.tsx` (line 217)
**Severity**: LOW

Both have an identical "Open the Lock!" confirmation button inside an `allCorrect` guard with the same animation, same colors, same padding.

**Priority**: LOW — Folded into DRY-1/DRY-5 refactoring naturally.

---

### DRY-8: Assignment title rendering pattern duplicated
**Files**: `ProgressiveDisclosureAssignment.tsx` (lines 261-265), `A11_ShedReveal.tsx` (lines 172-175), `NumberLockAssembly.tsx` (lines 163-166)
**Severity**: LOW

All three render:
```tsx
<h2 className="text-2xl font-bold text-blue-primary flex items-center justify-center gap-2">
  <span className="text-3xl">{assignment.icon}</span>
  {assignment.title}
</h2>
```

**Priority**: LOW — Extract as `<AssignmentTitle icon={...} title={...} />` when doing the success screen extraction.

---

### DRY-9: Default `AssignmentProgress` literal duplicated in gameStore
**File**: `gameStore.ts` (lines 122-126, 137-141, 197-201)
**Severity**: LOW

The same fallback object `{ solved: false, currentStep: 0, attempts: 0 }` appears three times in `advanceAssignmentStep`, `solveAssignment`, and `incrementAttempts`.

**Refactoring suggestion**: Extract a constant:
```tsx
const DEFAULT_PROGRESS: AssignmentProgress = { solved: false, currentStep: 0, attempts: 0 }
```

Then reference it: `state.assignmentProgress[id] ?? DEFAULT_PROGRESS`

**Priority**: LOW — Three occurrences in one file, trivial.

---

## 2. SOLID Principle Violations

### SOLID-1: Interface Segregation Violation — the `Assignment` type is a mega-interface
**File**: `types.ts` (lines 111-159)
**Severity**: HIGH

The `Assignment` interface has ~20 optional fields to support 11 different `AssignmentType` variants. This is the canonical ISP violation. A `single_answer` assignment doesn't need `layers`, `digits`, `correctPairs`, `table`, or `message`. A `finale` assignment doesn't need `steps`, `poem`, or `letters`.

Current state:
```tsx
export interface Assignment {
  id: number
  // ... 5 required fields
  prompt?: string           // single_answer
  answer?: number | string  // single_answer, progressive_disclosure
  steps?: AssignmentStep[]  // multi_step_math
  video?: VideoConfig       // video_question, shed_reveal
  poem?: string[]           // poem_riddle
  table?: TableConfig       // video_table_math
  layers?: DisclosureLayer[] // progressive_disclosure
  digits?: number[]         // number_lock_assembly
  correctPairs?: string[]   // number_lock_assembly
  message?: MessageConfig   // finale
  // ... etc
}
```

Every consumer must defensively check for `undefined` on fields that should be guaranteed for their assignment type.

**Refactoring suggestion**: Use a discriminated union on the `type` field:

```tsx
interface BaseAssignment {
  id: number
  phase: number
  title: string
  icon: string
  assignedTo: 'boy' | 'girl' | 'both'
  reveals: RevealConfig
  successMessage?: string
  bonusText?: string
  hint?: string
}

interface SingleAnswerAssignment extends BaseAssignment {
  type: 'single_answer'
  prompt: string
  answer: number | string
  inputType: InputType
}

interface ProgressiveDisclosureAssignment extends BaseAssignment {
  type: 'progressive_disclosure'
  layers: DisclosureLayer[]
  answer: number | string
  inputType?: InputType
  prompt?: string
}

// ... etc for each type

export type Assignment =
  | SingleAnswerAssignment
  | ProgressiveDisclosureAssignment
  | NumberLockAssemblyAssignment
  | FinaleAssignment
  // ...
```

This gives you compiler-enforced field presence — no more `assignment?.layers` when you already know the type is `progressive_disclosure`.

**Priority**: MEDIUM — The current approach works but forces every consumer to handle impossible states. This is the single most impactful type-safety improvement possible.

---

### SOLID-2: Single Responsibility Violation — ProgressiveDisclosureAssignment is a god-component
**File**: `ProgressiveDisclosureAssignment.tsx` (385 lines)
**Severity**: MEDIUM

This one component handles:
1. Layer progress tracking and rendering
2. Three different layer types (video, magic word, poem)
3. Answer validation with attempt tracking
4. Lockout logic (MAX_ATTEMPTS)
5. Success screen with confetti
6. Locked-forever screen
7. "Need more hints" navigation
8. Magic word unlock gating

The `ProgressiveDisclosureAssignment` function itself manages 6 pieces of `useState`, 4 `useCallback` handlers, 2 `useEffect` hooks, and reads from 6 store selectors. It renders 4 different screens depending on state (locked, success, solved, active).

**Refactoring suggestion**: The file already partially does this with extracted sub-components (`AnimatedLines`, `VideoClueContent`, `MagicWordContent`, `RiddleContent`, `LockedScreen`). The next step is to extract:
- `SuccessScreen` (shared with other components per DRY-5)
- `AttemptCounter` (the attempt dots + warning UI)
- `AnswerSection` (the answer input + check button + error feedback)

This would reduce the main function from ~130 lines of JSX to ~50.

**Priority**: LOW — It works, it's one file, and the internal decomposition is already started. Finish the extraction post-Easter.

---

### SOLID-3: Open/Closed Principle Violation — AssignmentRouter uses hardcoded conditionals
**File**: `AssignmentRouter.tsx` (lines 8-46)
**Severity**: LOW

```tsx
const ASSIGNMENT_MAP: Record<number, React.ComponentType> = {
  11: A11_ShedReveal,
  12: A12_GrandFinale,
}
// ...
if (assignmentConfig?.type === 'progressive_disclosure') { ... }
if (assignmentConfig?.type === 'number_lock_assembly') { ... }
```

Adding a new assignment type requires modifying `AssignmentRouter`. This violates OCP. A registry pattern would be better:

```tsx
const TYPE_REGISTRY: Record<AssignmentType, React.ComponentType<{ assignmentId: number }>> = {
  progressive_disclosure: ProgressiveDisclosureAssignment,
  number_lock_assembly: NumberLockAssembly,
  shed_reveal: A11_ShedReveal,
  finale: A12_GrandFinale,
  // ...
}

export function AssignmentRouter() {
  const Component = TYPE_REGISTRY[assignmentConfig.type]
  return Component ? <Component key={id} assignmentId={id} /> : <NotFound />
}
```

**Priority**: LOW — There are exactly 3 assignment components and no plan to add more. The if-chain is perfectly readable for this scale.

---

### SOLID-4: Dependency Inversion — MasterPanel directly calls `store.setState`
**File**: `MasterPanel.tsx` (lines 41-42, 64-74, 77-93, 96-108)
**Severity**: LOW

`MasterPanel` bypasses the store's action interface and calls `store.setState()` directly to manipulate state. This couples it to the store's internal shape and makes it impossible to enforce invariants.

Example (line 42):
```tsx
store.setState({
  phase: isWordPath ? 'word_path' : 'number_path',
  activePath: isWordPath ? 'word' : 'number',
  currentAssignment: id,
})
```

**Refactoring suggestion**: Add dedicated master/debug actions to the store (e.g., `jumpToAssignment`, `completeWordPath`, `solveAll`).

**Priority**: LOW — This is a dev-only debug panel. It ships to prod behind `?mode=master` but is not user-facing. The coupling is acceptable for a debug tool.

---

## 3. React Optimization Issues

### OPT-1: CountdownTimer subscribes to entire `timer` object — re-renders every tick
**File**: `CountdownTimer.tsx` (line 8)
**Severity**: MEDIUM

```tsx
const timer = useGameStore((s) => s.timer)
```

`tickTimer` creates a new `timer` object every second (because `{ ...state.timer, remainingSeconds: remaining }` creates a new reference). This means `CountdownTimer` re-renders every second, which is correct for the timer display itself.

However, the problem is that **App.tsx also subscribes to the entire timer object** (line 67):
```tsx
const timer = useGameStore((s) => s.timer)
```

This means the **entire App component and all its children** re-render every second while the timer is running. The `timer` reference changes every tick because `tickTimer` spreads `...state.timer`.

**Impact**: Every second, the header, the content area, the progress bar, and the master panel all re-render. On a low-end mobile device, this is 60+ component re-renders per minute that are pure waste.

**Refactoring suggestion**: In `App.tsx`, subscribe only to the specific fields needed:
```tsx
const isTimeUp = useGameStore((s) => s.timer.remainingSeconds <= 0 && s.timer.isRunning && s.phase !== 'complete')
```

This selector returns a boolean, which only changes once (when time runs out), instead of a new object every second.

**Priority**: HIGH — This is the single biggest performance issue. Every component in the tree re-renders every second. On a 3G phone this could cause visible jank.

---

### OPT-2: HubPage creates 7 separate store subscriptions
**File**: `HubPage.tsx` (lines 21-27)
**Severity**: LOW

```tsx
const wordPathComplete = useGameStore((s) => s.wordPathComplete)
const numberPathComplete = useGameStore((s) => s.numberPathComplete)
const eggKeyFound = useGameStore((s) => s.eggKeyFound)
const enterWordPath = useGameStore((s) => s.enterWordPath)
const enterNumberPath = useGameStore((s) => s.enterNumberPath)
const markEggKeyFound = useGameStore((s) => s.markEggKeyFound)
const startFinale = useGameStore((s) => s.startFinale)
```

While Zustand selector subscriptions are individually cheap, this pattern means 7 separate subscriptions for one component. The action selectors (lines 24-27) always return the same function reference (Zustand actions are stable), so they never cause re-renders. But it's unnecessary ceremony.

**Refactoring suggestion**: Group state and actions:
```tsx
const { wordPathComplete, numberPathComplete, eggKeyFound } = useGameStore(
  useShallow((s) => ({ wordPathComplete: s.wordPathComplete, numberPathComplete: s.numberPathComplete, eggKeyFound: s.eggKeyFound }))
)
```

For actions, a single destructure is fine since they are stable references.

**Priority**: LOW — Zustand handles this efficiently. This is a readability preference, not a performance issue.

---

### OPT-3: Inline object literals in render paths
**File**: `HubPage.tsx` (lines 209, 211)
**Severity**: LOW

```tsx
<span className="animate-float" style={{ animationDelay: '0s' }}>
<span className="animate-float" style={{ animationDelay: '0.3s' }}>
<span className="animate-float" style={{ animationDelay: '0.6s' }}>
```

These create new style objects every render. At 3 objects per render in a component that re-renders when hub state changes, this is negligible.

However, `FLOATING_ITEMS` (line 6-17) does this correctly with a static array — consistent pattern would lift the treasure button styles too.

**Priority**: LOW — No measurable impact at this scale.

---

### OPT-4: AnimatedLines resets on parent re-render
**File**: `ProgressiveDisclosureAssignment.tsx` (lines 13-37)
**Severity**: MEDIUM

`AnimatedLines` uses `useState(0)` for `visibleLines`. If the parent (`ProgressiveDisclosureAssignment`) re-renders and React unmounts/remounts `AnimatedLines` (which happens when the key changes in the layers list), the animation restarts from 0.

More critically, the `useEffect` that drives the animation:
```tsx
useEffect(() => {
  if (visibleLines >= lines.length) return
  const timer = setTimeout(() => setVisibleLines((v) => v + 1), 800)
  return () => clearTimeout(timer)
}, [visibleLines, lines.length])
```

If `lines` is a prop from config (which it is — `layer.poem`), and the parent re-renders without changing the layer, `lines.length` is the same, `visibleLines` is the same, so the effect doesn't re-run. This is fine. But the component itself is not memoized, so it re-renders on every parent render (e.g., when the user types in the answer box, updating `answerValue` state).

**Refactoring suggestion**: Wrap `AnimatedLines` in `React.memo` since it depends only on `lines` and `icon` props, both of which are stable between renders.

**Priority**: MEDIUM — On the poem layers, this component does expensive opacity transitions. Unnecessary re-renders from typing in the answer box will cause layout thrashing.

---

### OPT-5: MasterPanel reads from store 8 times, re-renders on any state change
**File**: `MasterPanel.tsx` (lines 12-18)
**Severity**: LOW

The MasterPanel subscribes to `phase`, `currentAssignment`, `activePath`, `assignmentProgress`, `wordPathComplete`, `numberPathComplete`, plus `config`. Nearly any state change will trigger a re-render.

This is acceptable because:
1. It is a dev-only debug tool
2. It needs to reflect all state changes to be useful

**Priority**: LOW — Intentionally broad subscriptions for a debug panel. No action needed.

---

### OPT-6: Missing React.memo on pure display components
**Files**: `CodeBoard.tsx/CodeCell`, `ProgressBar.tsx`
**Severity**: LOW

`CodeCell` (CodeBoard.tsx line 38) renders based only on `value` prop. It is not memoized. Since `CodeBoard` itself only re-renders when `codeBoard` or `phase` changes (infrequent), this is not impactful.

`ProgressBar` re-renders whenever `assignmentProgress` changes (every solve) and `phase`/`activePath` changes. These are infrequent. No issue.

**Priority**: LOW — Correct as-is for the current render frequency.

---

### OPT-7: useGameConfig returns a module-level constant — useMemo is unnecessary
**File**: `hooks/useGameConfig.ts` (lines 7-9)
**Severity**: LOW

```tsx
const config = configData as GameConfig  // module-level constant

export function useGameConfig(): GameConfig {
  return config  // returns the same object every time
}
```

This is fine — the `useMemo` in `useAssignment` (line 11-14) is justified because `.find()` creates a new reference each call. But `useGameConfig` itself is just returning a stable reference. The hook wrapper is correct (for future refactoring to fetch from an API), but it's worth noting there is zero memoization concern here.

**Priority**: LOW — No action needed. Noting for documentation.

---

## 4. Component Architecture

### ARCH-1: A11_ShedReveal and NumberLockAssembly share 80% of their architecture
**Files**: `A11_ShedReveal.tsx` (242 lines), `NumberLockAssembly.tsx` (234 lines)
**Severity**: MEDIUM

Both components follow the exact same pattern:
1. DndProvider wrapper with touch detection
2. Inner component with: assignment config, store access, shuffle state init
3. Drag-and-drop zone with sparkle feedback
4. "allCorrect" detection via `useEffect`
5. "Open the Lock!" confirmation button
6. Success screen with confetti, lock emoji, code display, next button

The behavioral skeleton is identical. The differences are:
- A11 drags individual letters; NumberLock drags digit pairs
- A11 has a video section above the drag zone
- A11 shows collected letters sorted; NumberLock shows collected digits
- Success screens show different lock types (word vs number)

**Refactoring suggestion**: Extract a `DragToOrderAssignment` base component that accepts:
```tsx
interface DragToOrderProps {
  assignmentId: number
  items: string[]          // the things to drag
  correctOrder: string     // joined target
  joiner?: string          // '' for letters, '-' for pairs
  itemDimensions?: { width: number; height: number }
  renderPreamble?: () => ReactNode    // video, collected digits, etc.
  renderSuccess?: () => ReactNode     // lock-specific success display
}
```

This would eliminate ~150 lines of duplication.

**Priority**: MEDIUM — If you ever add a third drag-to-order assignment, doing this first will save significant time. For now, the duplication is manageable.

---

### ARCH-2: AnimatedLines should be a shared component
**File**: `ProgressiveDisclosureAssignment.tsx` (lines 13-37)
**Severity**: LOW

`AnimatedLines` is defined as a private function inside `ProgressiveDisclosureAssignment.tsx`. It is a clean, self-contained component that could be reused for any "lines appear one at a time" pattern elsewhere (e.g., if the finale wanted animated text).

**Refactoring suggestion**: Move to `components/shared/AnimatedLines.tsx`. No API change needed — it already takes clean props.

**Priority**: LOW — Only one consumer today. Extract if a second consumer appears.

---

### ARCH-3: LockedScreen is tightly coupled to ProgressiveDisclosureAssignment
**File**: `ProgressiveDisclosureAssignment.tsx` (lines 129-152)
**Severity**: LOW

`LockedScreen` takes an `assignmentId` prop that it immediately discards (prefixed with `_`). The component is fully self-contained and could be shared, but currently only `ProgressiveDisclosureAssignment` uses attempt-based lockout.

**Priority**: LOW — Only one consumer. Remove the unused `assignmentId` prop.

---

### ARCH-4: Error handling inconsistency — no error boundaries around individual assignments
**File**: `App.tsx` (lines 124-129)
**Severity**: MEDIUM

There is one `ErrorBoundary` wrapping the entire content area. If `A11_ShedReveal` throws (e.g., a drag-and-drop error), the entire game view is replaced with the error screen.

**Refactoring suggestion**: Wrap individual assignment renders in `ErrorBoundary` within `AssignmentRouter`:
```tsx
<ErrorBoundary key={currentAssignment}>
  <Component assignmentId={currentAssignment} />
</ErrorBoundary>
```

The `key` prop ensures the boundary resets when navigating between assignments. This isolates failures to the individual assignment.

**Priority**: MEDIUM — A single error in one assignment currently kills the entire view. With the ErrorBoundary already built, wrapping is a one-line change.

---

### ARCH-5: useMasterMode computes once and never updates
**File**: `hooks/useMasterMode.ts` (lines 3-8)
**Severity**: LOW

```tsx
export function useMasterMode(): boolean {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('mode') === 'master'
  }, [])  // empty deps = computed once
}
```

The empty dependency array means this is computed on mount and never again. If someone navigates to `?mode=master` via history.pushState (unlikely but possible), the hook won't detect it. This is fine for the current use case — master mode is set before page load.

**Priority**: LOW — Documenting, not flagging.

---

## 5. TypeScript Strictness

### TS-1: `as` casts in gameStore migration
**File**: `gameStore.ts` (lines 286, 301)
**Severity**: LOW

```tsx
const state = persisted as Record<string, unknown>
return state as unknown as GameStore
```

These casts are in the Zustand persist migration handler, which receives `unknown` typed persisted data. The double cast through `unknown` is the standard pattern for migration code. Not ideal, but unavoidable without a runtime validation library.

**Refactoring suggestion**: If you adopt Zod for config validation, use it here too:
```tsx
migrate: (persisted, version) => {
  const result = GameStoreSchema.safeParse(persisted)
  if (!result.success) return defaultState
  return result.data
}
```

**Priority**: LOW — Migration code runs once per version bump. The casts are contained and documented.

---

### TS-2: MBtn `color` prop is typed as `string` instead of a union
**File**: `MasterPanel.tsx` (line 236)
**Severity**: LOW

```tsx
function MBtn({ onClick, color, children }: { onClick: () => void; color: string; children: React.ReactNode })
```

Should be:
```tsx
color: 'blue' | 'green' | 'purple' | 'red'
```

An invalid color silently falls back to no color class. With a union, TypeScript catches typos at compile time.

**Priority**: LOW — Dev-only component. But it's a 10-second fix.

---

### TS-3: `ASSIGNMENT_MAP` uses `React.ComponentType` without props constraint
**File**: `AssignmentRouter.tsx` (line 8)
**Severity**: LOW

```tsx
const ASSIGNMENT_MAP: Record<number, React.ComponentType> = {
  11: A11_ShedReveal,
  12: A12_GrandFinale,
}
```

`React.ComponentType` (no generic) means `React.ComponentType<{}>`, which accepts components with any props. If someone adds a component that requires an `assignmentId` prop, TypeScript won't catch the missing prop at the render site (line 28: `<Component key={currentAssignment} />`).

**Refactoring suggestion**:
```tsx
const ASSIGNMENT_MAP: Record<number, React.ComponentType<Record<string, never>>> = { ... }
```

Or better, move to the type-based registry pattern from SOLID-3.

**Priority**: LOW — Only 2 entries, both zero-prop components.

---

### TS-4: Hardcoded magic numbers scattered through components
**Files**: Multiple
**Severity**: LOW

- Assignment ID `11` hardcoded in `A11_ShedReveal.tsx` (lines 76, 123, 129)
- Assignment ID `12` hardcoded in `A12_GrandFinale.tsx` (line 13) and `gameStore.ts` (line 149)
- `MAX_ATTEMPTS = 3` defined only in `ProgressiveDisclosureAssignment.tsx`
- Digit arrays `[1, 8, 3, 8, 1, 8]` hardcoded in `NumberLockAssembly.tsx` (line 177) instead of derived from config

**Refactoring suggestion**: Extract to a constants file or derive from config:
```tsx
// NumberLockAssembly.tsx line 177 — should be:
const digits = assignment.digits ?? []
// not:
{[1, 8, 3, 8, 1, 8].map((d, i) => ...)}
```

**Priority**: MEDIUM for the hardcoded digits (they're data that belongs in config); LOW for the assignment IDs (they're structural).

---

## 6. Specific Pattern Analysis

### PAT-1: DraggableLetter vs DraggablePair — verdict: same component

After careful comparison:

| Aspect | DraggableLetter | DraggablePair |
|--------|----------------|---------------|
| DnD type | `'LETTER'` | `'PAIR'` |
| DragItem | `{ index, letter }` | `{ index, value }` |
| Move callback prop | `moveLetter` | `movePair` |
| Size | 64x80 | 80x64 |
| Extra class | (none) | `font-mono` |
| Sparkle behavior | Identical | Identical |
| Drop behavior | Identical | Identical |

**Verdict**: These are the same component with different prop names. The `font-mono` class and dimensions should be configurable props. The DnD type difference is correct and necessary (prevents cross-component dragging) but should be a prop.

---

### PAT-2: "I need more hints" button — only appears in ProgressiveDisclosureAssignment

Contrary to the audit request, this pattern only appears once (ProgressiveDisclosureAssignment.tsx line 307). Not a DRY issue.

---

### PAT-3: Lock celebration screens in A11 and NumberLockAssembly — highly duplicated

Both show:
1. `<Confetti trigger duration={5000} />`
2. `<div className="text-7xl">` with lock emoji
3. Title: "[Type] Lock Unlocked!"
4. Description text
5. Lock code display
6. "Next Task" button

The structure is 95% identical. See DRY-5 and ARCH-1.

---

## Summary of Findings by Priority

### HIGH Priority (fix before Easter if time permits)
| ID | Issue | Effort |
|----|-------|--------|
| OPT-1 | App.tsx re-renders entire tree every second via timer subscription | 5 min |
| DRY-2 | fireLetterSparkle/fireSparkle identical functions in 2 files | 5 min |

### MEDIUM Priority (fix in post-Easter sprint)
| ID | Issue | Effort |
|----|-------|--------|
| DRY-1 | DraggableLetter/DraggablePair duplicate components | 30 min |
| DRY-3 | isTouchDevice + DndProvider wrapper duplicated | 15 min |
| SOLID-1 | Assignment interface is a bag of optionals, not a discriminated union | 2 hr |
| OPT-4 | AnimatedLines not memoized, re-renders on typing | 5 min |
| ARCH-1 | A11/NumberLock share 80% architecture, could be one base component | 2 hr |
| ARCH-4 | Single ErrorBoundary wraps entire content area | 5 min |
| TS-4 | Hardcoded digits in NumberLockAssembly should come from config | 10 min |

### LOW Priority (tech debt backlog)
| ID | Issue | Effort |
|----|-------|--------|
| DRY-4 | Shuffle algorithm duplicated | 10 min |
| DRY-5 | Success screen pattern duplicated across 3 components | 45 min |
| DRY-6 | "Next Task" button className duplicated | 10 min |
| DRY-7 | "Open the Lock" button duplicated | 10 min |
| DRY-8 | Assignment title rendering duplicated | 10 min |
| DRY-9 | Default AssignmentProgress literal repeated in store | 5 min |
| SOLID-2 | ProgressiveDisclosureAssignment is a god-component | 1 hr |
| SOLID-3 | AssignmentRouter uses hardcoded conditionals | 30 min |
| SOLID-4 | MasterPanel bypasses store actions with setState | 30 min |
| TS-1 | Migration uses double cast | 15 min |
| TS-2 | MBtn color prop typed as string | 1 min |
| TS-3 | ASSIGNMENT_MAP uses unconstrained ComponentType | 5 min |

---

## What's Done Well

1. **Zustand selector pattern**: Every component uses individual selectors (`(s) => s.specificField`), not whole-store subscriptions. This is the correct Zustand pattern and prevents most unnecessary re-renders.

2. **Shared `CharacterInput` component**: Well-built, properly typed, handles keyboard navigation, auto-advance, and backspace. Good use of `useCallback` and `useRef`.

3. **`Confetti` component cleanup**: Properly cancels `requestAnimationFrame` on unmount with both a `cancelled` flag and `cancelAnimationFrame`. This is the right way to handle animation cleanup.

4. **`MediaPlayer` graceful degradation**: Handles YouTube, Google Drive, and raw video with proper fallback text. Error state shows the fallback instead of crashing.

5. **`ErrorBoundary` with hook bridge**: Correctly uses a class component for the boundary with a functional `ReturnToHubButton` child to access hooks. This is the right pattern for mixing class-based error boundaries with hooks.

6. **Config-driven architecture**: Assignments come from JSON config, not hardcoded component trees. This is the right foundation — new assignments can be added by editing config + (sometimes) adding a component.

7. **Zustand persist with migration**: Version-aware migration with `VALID_PHASES` validation ensures stale localStorage doesn't crash the app after schema changes.

8. **Clean discriminated union for DisclosureLayer**: `VideoClueLayer | MagicWordLayer | PoemRiddleLayer` is textbook TypeScript — exhaustive type narrowing on `layer.type`. (Now apply this same pattern to `Assignment`.)

9. **Timer architecture**: The `startedAt` + `durationSeconds` pattern calculates remaining time from wall clock rather than decrementing a counter. This is drift-resistant and survives tab backgrounding.

---

## Verdict

The codebase is in solid shape for a one-off Easter game. The two HIGH priority items (OPT-1: timer re-render cascade, DRY-2: duplicated sparkle function) should be fixed today — they take 10 minutes combined. Everything else is maintainability debt that can be addressed post-Easter.

If this app is intended to be reused or expanded for future events, SOLID-1 (discriminated union for Assignment) and ARCH-1 (shared drag-to-order base) should be the first refactoring targets.
