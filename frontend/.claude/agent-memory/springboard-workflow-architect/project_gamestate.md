---
name: GameState & Store Architecture
description: Core state machine, playlist definitions, phase transitions, and store shape as of final pre-launch review
type: project
---

GameState is defined in `src/store/gameStore.ts` using Zustand + persist (version 2).

**Phases:** `idle` | `hub` | `word_path` | `number_path` | `complete`

**Playlists (hardcoded in store):**
- `WORD_PATH = [15, 13, 14, 4, 11]`
- `NUMBER_PATH = [101, 102, 104, 105, 106, 103, 107]`
- Finale is ID 12 (triggered via `startFinale()`, sets `currentAssignment: 12`)

**Key state fields:** `wordPathComplete`, `numberPathComplete`, `eggKeyFound`, `activePath`, `codeBoard` (numberLock: 3-slot, wordLock: 4-slot), `hintsUnlocked`, `assignmentProgress`

**State machine transitions:**
- `startGame()` → hub
- `enterWordPath()` / `enterNumberPath()` → respective path phase
- `solveAssignment(lastInPath)` → hub + sets `wordPathComplete` or `numberPathComplete`
- `startFinale()` → complete + stops timer
- `returnToHub()` → hub, clears activePath

**Why:** Needed for any new assignment additions or phase logic changes.
**How to apply:** Always check playlist arrays and `solveAssignment` path-complete logic when adding/reordering assignments.
