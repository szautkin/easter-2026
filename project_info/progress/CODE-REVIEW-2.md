# Code Review #2 -- Frontend Codebase (Post-Restructure)

**Reviewer:** React/TypeScript Lead
**Date:** 2026-04-01
**Scope:** All source files in `frontend/src/`
**Stack:** React 19 + TypeScript (strict) + Vite 8 + Tailwind CSS 4 + Zustand 5
**Event Date:** Easter Sunday, April 5, 2026 (T-4 days)

---

## Summary

Major restructuring from linear playlist to hub-and-spoke navigation is architecturally sound. The progressive disclosure pattern is well-implemented. Timer drift from CR1 is fixed (wall-clock elapsed time). TypeScript strict mode is on with `noUnusedLocals` and `noUnusedParameters`. No `any` types found in active code.

However, there are **critical production-day risks**: the Zustand persist store has no version/migration, meaning any device that played a previous version will hydrate stale `phase` values like `'phase1'` and brick the app. There are 16 dead files still in the source tree that inflate the bundle. The hardcoded answer "SHED" and "18-38-18" appear as plaintext in HubPage.tsx, visible in DevTools. Several state machine transitions can leave the app in an unreachable state.

---

## BLOCKING ISSUES (Must Fix Before Merge)

### B1. No Zustand persist migration -- old localStorage will brick the app

**File:** `src/store/gameStore.ts`
**Severity:** CRITICAL -- will cause white screen on any device that previously ran v1

The persist middleware has `name: 'easter-2026-game'` but no `version` or `migrate` function. If a child's iPad has localStorage from the previous version with `phase: 'phase1'` or `phase: 'intake'`, Zustand will hydrate that value into the store. Since `GamePhase` is now `'idle' | 'hub' | 'word_path' | 'number_path' | 'complete'`, the old value `'phase1'` passes the string type at runtime but matches NONE of the render conditions in App.tsx:

```tsx
// App.tsx lines 71-127
if (phase === 'idle') { ... }
// ...
{phase === 'hub' && <HubPage />}
{(phase === 'word_path' || phase === 'number_path') && <AssignmentRouter />}
{phase === 'complete' && <AssignmentRouter />}
```

With `phase: 'phase1'`, the app renders the header + empty main content. No way to recover without clearing localStorage manually -- a 7-year-old cannot do this.

**Fix:** Add `version: 2` and a `migrate` function that maps any unrecognized phase to `'idle'`, effectively forcing a fresh start on old devices.

**STATUS: FIXED**

---

### B2. Timer `totalElapsed` is wrong when game completes -- `pauseTimer` not called before `solveAssignment(12)`

**File:** `src/components/assignments/A12_GrandFinale.tsx:16-23`

```tsx
useEffect(() => {
  if (!message) return
  if (progress?.solved) return
  solveAssignment(12)    // sets phase='complete' -- timer still running
  pauseTimer()           // captures totalElapsed AFTER phase is already 'complete'
  // ...
}, [message, solveAssignment, pauseTimer, progress?.solved])
```

The issue: `solveAssignment(12)` sets `phase: 'complete'` but does NOT stop the timer. Then `pauseTimer()` is called, which reads `startedAt` and computes `totalElapsed`. This works because both run synchronously in the same microtask and Zustand batches state -- BUT if `pauseTimer` is ever called when `startedAt` is already null (e.g., timer was already paused from the TimeUpScreen "Continue Without Timer" flow), the `sessionElapsed` calculation produces 0, and `totalElapsed` stays at whatever it was before -- which could be a wildly wrong number.

The real problem: if the timer has already been paused (user hit "Continue Without Timer"), then `startedAt` is null and `timer.isRunning` is false. Calling `pauseTimer()` again adds 0 to `totalElapsed` and does nothing useful. But `timer.totalElapsed` at that point reflects only elapsed time up to when the timer ran out -- it does NOT include any time spent playing after "Continue Without Timer." The displayed completion time is wrong.

**Fix:** Call `pauseTimer()` BEFORE `solveAssignment(12)`, and guard for null startedAt.

**STATUS: FIXED**

---

### B3. 16 dead component files still in `src/` -- will be bundled by Vite

**Files (not imported by any active code path):**
- `src/components/assignments/A01_EggSum.tsx`
- `src/components/assignments/A02_ScaleExplorer.tsx`
- `src/components/assignments/A03_VideoLetterN.tsx`
- `src/components/assignments/A04_SnakePoem.tsx`
- `src/components/assignments/A05_AlphabetChain.tsx`
- `src/components/assignments/A06_VideoEaster.tsx`
- `src/components/assignments/A07_VladEquation.tsx`
- `src/components/assignments/A08_SemitonePuzzle.tsx`
- `src/components/assignments/A09_CousinCalc.tsx`
- `src/components/assignments/A10_MirrorRiddle.tsx`
- `src/components/assignments/A11_WordScramble.tsx`
- `src/components/assignments/PoemAssignment.tsx`
- `src/components/BottomNav.tsx`
- `src/components/EggIntake.tsx`
- `src/components/RiddleCard.tsx`
- `src/components/shared/QuestionPanel.tsx`
- `src/components/shared/HintSystem.tsx`
- `src/components/shared/AssignmentLayout.tsx`

**Impact:** Vite tree-shakes unreferenced modules from the bundle, so these files will NOT increase bundle size in production. However, they are actively confusing -- anyone reading the codebase (or an AI agent) will waste time understanding dead code. They also import from each other (e.g., EggIntake imports RiddleCard, A01 imports AssignmentLayout + QuestionPanel), creating a web of dead cross-references. With `noUnusedLocals: true` in tsconfig, these files will cause TS errors if their internal imports become unused, creating fragile build dependencies on dead code.

**Fix:** Delete all 18 dead files. They can be recovered from git history if ever needed.

**STATUS: FIXED**

---

### B4. Hardcoded answer spoilers in HubPage.tsx -- visible in page source/DevTools

**File:** `src/components/HubPage.tsx`

Lines 88-89: `{'SHED'.split('').map(...)}`
Line 115: `<span ...>18-38-18</span>`
Lines 148, 154: `'The code is SHED'`, `'SHED'.split('').map(...)`
Lines 188-189: `'The code is 18-38-18'`

These strings appear in the component source unconditionally. A tech-savvy older sibling can open DevTools and read the answers. For a children's treasure hunt, this defeats the purpose.

**Fix:** Read the values from `config.codes` instead of hardcoding, and only render them in the JSX when `wordPathComplete` / `numberPathComplete` is true. The config JSON file also has them, but that's one more step removed from "right-click inspect element."

**STATUS: FIXED**

---

### B5. `handleOpenTreasure` bypasses the state machine -- uses raw `setState`

**File:** `src/components/HubPage.tsx:26-30`

```tsx
const store = useGameStore
const handleOpenTreasure = () => {
  store.setState({ phase: 'complete', currentAssignment: 12 })
}
```

This sets `phase: 'complete'` and `currentAssignment: 12` but does NOT:
- Pause the timer
- Clear `activePath`

So the timer keeps counting, and if the user somehow navigates back, `activePath` could be stale. The proper flow should go through a store action that handles all side effects atomically.

Additionally, `const store = useGameStore` (line 26) breaks React's mental model -- this grabs the Zustand store object outside the subscription system. While Zustand supports this pattern, it should be used ONLY in event handlers (which it is here), never in render. The variable name `store` is misleading in a component body.

**Fix:** Add a `startFinale` action to the store that handles timer pause + phase transition atomically.

**STATUS: FIXED**

---

### B6. `NumberLockAssembly` hardcodes lock values `18, 38, 18` instead of reading from config

**File:** `src/components/assignments/NumberLockAssembly.tsx:112-116`

```tsx
const handleOpenLock = useCallback(() => {
  if (!assignment) return
  revealCode({ type: 'lock_number', position: 0, value: 18 })
  revealCode({ type: 'lock_number', position: 1, value: 38 })
  revealCode({ type: 'lock_number', position: 2, value: 18 })
  setShowSuccess(true)
}, [assignment, revealCode])
```

These values are hardcoded instead of reading from `config.codes.numberLock.values`. If the combination ever changes in config, this component will reveal the wrong numbers.

**Fix:** Read from config.

**STATUS: FIXED**

---

## WARNINGS (Should Fix, Risks Production Issues)

### W1. Timer continues running during hub navigation

**File:** `src/store/gameStore.ts`

When a player finishes a path and returns to hub (`returnToHub` action, line 97-102), the timer keeps running. When they re-enter a path, the timer keeps running. This is probably intentional (continuous game timer). However, when the game goes to `'complete'` via `solveAssignment(12)`, the timer is NOT stopped. The `A12_GrandFinale` component calls `pauseTimer()` in a `useEffect`, but there's a brief window where the timer ticks after completion.

The `startFinale` action fix from B5 addresses this.

**STATUS: FIXED (via B5 fix)**

---

### W2. `correctPairs` cast in NumberLockAssembly is unsafe

**File:** `src/components/assignments/NumberLockAssembly.tsx:75`

```tsx
const correctPairs = assignment?.correctPairs as string[] | undefined
```

The `Assignment` interface defines `correctPairs?: string[]`, so this cast is technically redundant. But the pattern of `as string[] | undefined` suggests the developer wasn't sure about the type. Since `assignment` is typed as `Assignment | undefined`, `assignment?.correctPairs` is already `string[] | undefined`. The cast does nothing but it sets a bad precedent.

**Fix:** Remove the unnecessary cast.

**STATUS: FIXED**

---

### W3. `MagicWordContent` comparison is case-sensitive on `acceptedWords`

**File:** `src/components/assignments/ProgressiveDisclosureAssignment.tsx:63`

```tsx
if (layer.acceptedWords.includes(word)) {
```

The `word` is `.toUpperCase()` but the `acceptedWords` in config are also uppercase (`["NINJA"]`, `["GOOFY"]`, etc.). This works today. But if someone adds a lowercase word to config, it silently fails. Defensive programming says: normalize both sides.

**Fix:** Normalize comparison.

**STATUS: FIXED**

---

### W4. Duplicate path playlist constants across 3 files

**Files:**
- `src/store/gameStore.ts:13-14`
- `src/components/MasterPanel.tsx:8-9`
- `src/components/ProgressBar.tsx:4-5`

The `WORD_PATH` and `NUMBER_PATH` arrays are duplicated in 3 files. If an assignment ID changes, someone must remember to update all 3. This WILL cause a desync bug.

**Fix:** Export the constants from the store and import them in MasterPanel and ProgressBar.

**STATUS: FIXED**

---

### W5. `AnimatedLines` resets `visibleLines` to 0 on every parent re-render

**File:** `src/components/assignments/ProgressiveDisclosureAssignment.tsx:13-37`

`AnimatedLines` uses `useState(0)` for `visibleLines`. If the parent re-renders (e.g., from a Zustand store update), React preserves state because the component identity doesn't change. But if the parent remounts the component (key change), the animation resets. Since the parent uses `layers.slice(0, currentLayer + 1).map(...)`, the `key` is the array index `i`, which is stable. So this is fine in practice, but the animation will replay if `currentLayer` changes (revealing a new layer causes ALL previously rendered layers to remain, and the last poem re-animates). This is actually desirable UX -- when a new layer is added, the poem re-animates in the new context. No fix needed.

**STATUS: Acceptable**

---

### W6. `A12_GrandFinale` useEffect dependency array includes `solveAssignment` and `pauseTimer`

**File:** `src/components/assignments/A12_GrandFinale.tsx:16-23`

Zustand selector functions from `useGameStore((s) => s.solveAssignment)` return stable references (they're defined in the store creator). So this is safe. However, the effect runs on mount, calls `solveAssignment(12)` which sets `phase: 'complete'`, and then the component is still mounted because App.tsx renders `<AssignmentRouter />` when `phase === 'complete'`. The guard `if (progress?.solved) return` prevents double-fire. This is correct but fragile -- in React StrictMode, the effect fires twice in development. The guard handles this.

**STATUS: Acceptable**

---

### W7. `isTouchDevice` detection is evaluated at module load time

**Files:**
- `src/components/assignments/A11_ShedReveal.tsx:13`
- `src/components/assignments/NumberLockAssembly.tsx:12`

```tsx
const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
```

This runs at module parse time, before any component renders. On devices that support both touch and mouse (Surface Pro, iPad with keyboard), this will always pick `TouchBackend`. The `TouchBackend` works with mouse too (with some quirks), so this is acceptable for a kids' game. However, `navigator.maxTouchPoints` can be > 0 on some desktop Chrome configurations. For production, this is good enough.

**STATUS: Acceptable**

---

## SUGGESTIONS (Would Improve Quality)

### S1. Add React Error Boundary around AssignmentRouter

If any assignment component throws during render (e.g., missing config data, undefined property access), the entire app white-screens. An Error Boundary around `<AssignmentRouter />` and `<HubPage />` in App.tsx would catch the error and show a fallback UI with a "Return to Hub" button. For a production app used by children, this is important.

### S2. Consider prefetching Google Drive videos

Google Drive embedded videos (`/preview` endpoint) can be slow to load, especially on mobile. The `MediaPlayer` renders an iframe which only starts loading when the layer becomes visible. Consider adding `<link rel="preconnect" href="https://drive.google.com">` in `index.html` to reduce DNS/TLS latency.

### S3. `CodeBoard` component is unused in the active UI

`CodeBoard.tsx` exists and is functional, but it's not rendered anywhere in the current App.tsx layout. It's gated by `if (phase === 'idle' || phase === 'hub' || phase === 'complete') return null`, which means it would only show during `word_path` or `number_path` phases. If the intent is to show accumulated code progress during paths, it should be added to the layout. If not, it's dead code.

### S4. `useAssignmentsByPhase` and `useEggs` hooks are unused

`src/hooks/useGameConfig.ts` exports `useAssignmentsByPhase` and `useEggs` hooks that are not imported anywhere in active code. These are dead exports. With `noUnusedLocals` in tsconfig, they survive because they're exported (not local).

### S5. Add `<meta name="viewport">` content verification

The `index.css` has `font-size: 16px` on inputs to prevent iOS zoom, which is correct. Verify that `index.html` has `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">` to fully prevent pinch-zoom issues on mobile.

### S6. Consider extracting config-derived constants

The config JSON has `codes.numberLock.values: [18, 38, 18]` and `codes.wordLock.value: "SHED"`. Several components need these. Instead of reading `config.codes.numberLock.values` repeatedly, a simple derived constant at the top of the config hook would clean this up.

### S7. `LockedScreen` has dead code in the ternary

**File:** `src/components/assignments/ProgressiveDisclosureAssignment.tsx:140`

```tsx
{assignment?.answer ? '?' : '?'}
```

Both branches return `'?'`. This ternary is meaningless.

### S8. `intakeSolved` and related intake state/actions are unused in the active flow

The store still has `intakeSolved`, `solveIntakeRiddle`, `completeIntake`, and the `intake` config section. The `EggIntake` component is dead code (B3), but the store actions remain. These should be cleaned out of the store interface and implementation for clarity.

---

## WHAT'S DONE WELL

1. **TypeScript strict mode** is properly configured with `strict: true`, `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`. Zero `any` types in active code.

2. **Timer architecture** uses wall-clock elapsed time (`Date.now() - startedAt`), fixing the drift issue from CR1. The `totalElapsed` accumulator properly handles pause/resume cycles.

3. **Discriminated unions** for `DisclosureLayer` (`VideoClueLayer | MagicWordLayer | PoemRiddleLayer`) with `type` discriminant enable type-safe narrowing in the layer renderers.

4. **Zustand selector patterns** are excellent -- every component uses `useGameStore((s) => s.specificField)`, which means re-renders are scoped to the subscribed field. No component subscribes to the entire store.

5. **Progressive disclosure pattern** is clean -- layers accumulate visually, the magic word gate blocks advancement, and the 3-attempt lockout adds genuine game tension.

6. **Touch backend detection** for DnD components handles the mobile-first requirement.

7. **iOS zoom prevention** via `font-size: 16px` on inputs.

8. **Confetti cleanup** is proper -- the `useEffect` in `Confetti.tsx` sets a `cancelled` flag and calls `cancelAnimationFrame` on unmount.

9. **Swap-on-drop DnD** in both `A11_ShedReveal` and `NumberLockAssembly` is correct -- the `moveLetter`/`movePair` callbacks use functional state updates and swap in-place, avoiding the reorder-on-hover complexity.

10. **Config-as-static-import** avoids network dependency at runtime. The entire game config is bundled at build time, which is perfect for offline resilience.

---

## VERDICT: CHANGES REQUESTED

The app has a clean architecture and good patterns, but **B1 (persist migration)** alone would brick the app on any device with stale localStorage. Combined with hardcoded spoilers (B4), a bypassed state machine (B5), and 16 dead files (B3), these must be resolved before the April 5 production date.

All blocking issues (B1-B6) and warnings (W1-W4) have been fixed in this review pass.
