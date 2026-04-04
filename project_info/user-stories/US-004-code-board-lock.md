# US-004: Code Board and Lock System

## As a player (child, age 7-12)
## I want to see lock code slots gradually fill in as I solve puzzles
## So that I feel the momentum of progress and understand I am building toward the final unlock

---

## Overview

The Code Board is a persistent UI element displayed at the top of the screen throughout Phases 1-4. It shows two lock representations -- a 3-number combination lock (18-38-18) and a 4-letter word lock (SHED) -- with empty slots that progressively fill as assignments are completed. This progressive reveal is the primary engagement mechanic: every solved puzzle visibly contributes to cracking the codes.

**Lock 1 (Combination):** 18 - 38 - 18
- Displayed as: `[__] - [__] - [__]` (three 2-digit slots)
- Filled by: Phase 1 digits (individually) and Phase 3 lock numbers (as pairs)

**Lock 2 (Word):** SHED
- Displayed as: `[_] [_] [_] [_]` (four single-letter slots)
- Filled by: Phase 2 letter discoveries

---

## Acceptance Criteria

### Code Board Display

- [ ] AC-001: Code Board is visible at all times during Phases 1-4 (below the header bar, above the assignment content)
- [ ] AC-002: Code Board is NOT visible during Phase 0 (Egg Registration) -- it appears after the Phase 0 transition
- [ ] AC-003: Lock 1 displays as three 2-digit slots separated by dashes: `[__]-[__]-[__]`
- [ ] AC-004: Lock 2 displays as four single-letter slots: `[_][_][_][_]`
- [ ] AC-005: Labels "LOCK 1" and "LOCK 2" are visible above or beside each lock representation
- [ ] AC-006: Empty slots have dashed blue-light borders (`#85B7EB`) with blue-tint background (`#EFF6FF`)
- [ ] AC-007: Filled slots have solid blue-primary borders (`#1B4F8A`) with yellow-accent background (`#FCD34D`)
- [ ] AC-008: Code Board background is blue-tint (`#EFF6FF`)
- [ ] AC-009: Code Board is compact enough to not consume excessive vertical space, especially on mobile

### Progressive Reveal Logic

The reveal happens in a specific order tied to assignment completion:

| Assignment | Reveals | Code Board Effect |
|-----------|---------|-------------------|
| 1 | Digit 1 | Phase 1 accumulates individual digits: 1 appears as a "collected digit" indicator |
| 2 | Digit 8 | Digit 8 added to collected digits |
| 3 | Digit 3 | Digit 3 added to collected digits -- Phase 1 complete |
| 4 | Letter S | S fills Lock 2 slot 1 |
| 5 | Letter H | H fills Lock 2 slot 2 |
| 6 | Letter E | E fills Lock 2 slot 3 |
| 7 | Letter D | D fills Lock 2 slot 4 -- Lock 2 complete |
| 8 | Number 18 | 18 fills Lock 1 slot 1 |
| 9 | Number 38 | 38 fills Lock 1 slot 2 |
| 10 | Number 18 | 18 fills Lock 1 slot 3 -- Lock 1 complete |
| 11 | Word SHED | Confirmation animation on Lock 2 |
| 12 | Finale | Both locks pulse/glow, celebration |

- [ ] AC-010: Phase 1 digits (1, 8, 3) appear as collected raw materials -- they are building blocks, not yet placed in lock slots
- [ ] AC-011: Phase 2 letters (S, H, E, D) fill Lock 2 slots sequentially as each is discovered
- [ ] AC-012: Phase 3 numbers (18, 38, 18) fill Lock 1 slots sequentially
- [ ] AC-013: Phase 4 Assignment 11 triggers a confirmation animation on Lock 2 (the letters were already revealed in Phase 2, but now the word is confirmed)
- [ ] AC-014: Assignment 12 triggers the final celebration -- both locks glow/pulse

### Reveal Animations

- [ ] AC-015: When a digit/letter/number is revealed, it "flies" from the assignment area to the Code Board slot
- [ ] AC-016: The target slot briefly flashes yellow on arrival
- [ ] AC-017: A sound effect plays on reveal (correct ding or unlock click)
- [ ] AC-018: Animation completes in under 2 seconds -- does not block the player from proceeding
- [ ] AC-019: If animations are interrupted (player navigates away), the state is still correctly updated

### Completion States

- [ ] AC-020: When Lock 1 is fully filled (after Assignment 10): visual flourish on Lock 1 (glow, border change)
- [ ] AC-021: When Lock 2 is fully filled (after Assignment 7 for letters, confirmed after Assignment 11): visual flourish on Lock 2
- [ ] AC-022: When both locks are complete (Assignment 12): Code Board enters celebration mode

---

## Technical Notes

- **Component:** `CodeBoard.tsx` -- reads game state to determine which slots are filled
- **State derivation:** Code Board state is derived from the list of completed assignments. Each assignment's `reveals` field in config defines what it contributes:
  - `{ "type": "digit", "value": 1 }` -- raw digit for Phase 1 collection
  - `{ "type": "letter", "value": "S" }` -- fills a Lock 2 slot
  - `{ "type": "lock_number", "position": 0, "value": 18 }` -- fills Lock 1 at position 0, 1, or 2
  - `{ "type": "word_code", "value": "SHED" }` -- confirms Lock 2 word
  - `{ "type": "treasure" }` -- finale trigger
- **No separate state:** The Code Board does not have its own localStorage entry. It reconstructs its display from the list of completed assignments on every render.
- **Responsive design:** On mobile, the Code Board compresses to a single row. On desktop/tablet, it has more breathing room with labels.

---

## Dependencies

| Dependency | Type | Status |
|-----------|------|--------|
| `AssignmentRouter.tsx` providing completed assignment list | Code | Needed |
| `easter-2026-config.json` with `reveals` field per assignment | Data | Done |
| Reveal animation library or CSS transitions | Code | Needed |
| Sound effects for reveal moments | Assets | Nice-to-have |
| Theme tokens (blue-primary, blue-light, yellow-accent) | Code | Needed |

---

## Design Reference

### Desktop/Tablet Layout
```
LOCK 1  [1][8] - [3][8] - [1][8]    LOCK 2  [S][H][E][D]
```

### Mobile Layout (Compact)
```
[18]-[38]-[18]  [S][H][E][D]
```

### Slot States
- **Empty:** `bg-blue-50 border-dashed border-blue-300` with `_` placeholder
- **Filled:** `bg-yellow-300 border-solid border-blue-800 font-bold` with value
- **Just revealed (transient):** Yellow pulse animation for 1.5 seconds
- **Lock complete:** Green border or subtle glow

---

## Test Scenarios

1. **Initial state:** After Phase 0 completes, Code Board appears with all slots empty
2. **Phase 1 accumulation:** After Assignments 1-3, verify digits 1, 8, 3 are shown as collected
3. **Phase 2 sequential fill:** After Assignment 4, Lock 2 shows [S][_][_][_]; after 5, [S][H][_][_]; etc.
4. **Phase 3 lock fill:** After Assignment 8, Lock 1 shows [18][__][__]; after 9, [18][38][__]; after 10, [18][38][18]
5. **Animation integrity:** Verify reveal animation plays and slot updates even if the user scrolls during animation
6. **State persistence:** Complete Assignments 1-5, close browser, reopen -- Code Board shows correct state for 5 completed assignments
7. **Mobile rendering:** Verify Code Board fits on 375px-wide screen without horizontal scroll
8. **Both locks complete:** After Assignment 10 + 11, verify both locks show complete state before Assignment 12
