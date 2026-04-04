---
name: Easter 2026 Frontend Architecture
description: Core architecture patterns, component hierarchy, and state management for the Easter 2026 egg hunt game frontend
type: project
---

Easter 2026 is a children's egg hunt game. React 19 + Vite 8 + TypeScript strict + Tailwind CSS 4 + Zustand 5.

**Why:** This is a real-time event app for kids on Easter day (April 5, 2026), often on tablets/mobile with unreliable connections. Performance and offline resilience matter.

**How to apply:** Evaluate all changes through the lens of mobile-first, child-friendly UX. Timer accuracy, touch support, and graceful error states are non-negotiable.

Key architecture decisions established across CR1 and CR2 (2026-04-01):

### Navigation
- Hub-and-spoke navigation: HubPage -> Word Path / Number Path (replaced linear playlist in CR2)
- GamePhase: 'idle' | 'hub' | 'word_path' | 'number_path' | 'complete'
- Path playlists exported from gameStore.ts: WORD_PATH = [15, 13, 14, 4, 11], NUMBER_PATH = [101, 102, 104, 105, 106, 103, 107]

### State Management
- Zustand store with persist middleware (version: 2, with migration from v1)
- Game config is static JSON imported at build time, not fetched from API
- Timer uses wall-clock elapsed time (Date.now() - startedAt), not interval decrements
- Timer has totalElapsed field for accurate completion time across pause/resume cycles
- `startFinale` action atomically: pauses timer, sets phase='complete', clears activePath

### Components
- Assignment components: ProgressiveDisclosureAssignment (generic), A11_ShedReveal, NumberLockAssembly, A12_GrandFinale
- Old A01-A10 components and EggIntake/RiddleCard/BottomNav were removed in CR2 (dead code)
- Touch backend detection for drag-and-drop in A11_ShedReveal and NumberLockAssembly
- All answer values read from config, not hardcoded in components (fixed in CR2)

### Known Remaining Items (Suggestions, Not Blocking)
- CodeBoard.tsx exists but is not rendered in the active layout
- useAssignmentsByPhase and useEggs hooks are exported but unused
- No React Error Boundary around AssignmentRouter/HubPage
- intakeSolved and related intake actions still in store interface (dead state)
