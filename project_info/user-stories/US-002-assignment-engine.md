# US-002: Assignment Engine (Phases 1-4)

## As a player (child, age 7-12)
## I want to progress through 12 sequential puzzle assignments that reveal lock codes piece by piece
## So that I experience a building sense of discovery and earn the final codes to open the treasure

---

## Overview

The Assignment Engine is the core game loop. After Phase 0 (Egg Registration), the app unlocks 12 assignments in strict sequential order. Each assignment is a unique puzzle type (math, piano, video question, poem, logic chain, anagram) that reveals one piece of the two lock codes. The assignments are grouped into 4 phases that map to the progressive code reveal strategy.

**Phases:**
- Phase 1 (Assignments 1-3): Digit Discovery -- reveals digits 1, 8, 3
- Phase 2 (Assignments 4-7): Letter Discovery -- reveals letters S, H, E, D
- Phase 3 (Assignments 8-10): Assembly Challenges -- reveals lock numbers 18, 38, 18
- Phase 4 (Assignments 11-12): Unlock -- assembles word SHED + finale

**Sequential unlock rule:** Assignment N+1 only becomes accessible after Assignment N is solved.

---

## Acceptance Criteria

### Sequential Progression

- [ ] AC-001: Assignments 1-12 are locked by default until the preceding assignment is solved
- [ ] AC-002: Phase 0 completion (all 20 riddles) is required before Assignment 1 unlocks
- [ ] AC-003: Only the current (next unsolved) assignment is interactive -- completed assignments can be reviewed but not re-submitted
- [ ] AC-004: Navigation dots in the bottom bar reflect status: filled = completed, yellow ring = current, light outline = locked
- [ ] AC-005: Back button allows reviewing previously completed assignments (read-only)
- [ ] AC-006: State persists to localStorage -- reopening the app resumes at the correct assignment

### Code Board Integration

- [ ] AC-007: Each solved assignment triggers a reveal animation on the Code Board
- [ ] AC-008: Digit reveals (Phase 1): individual digits fly to the Code Board
- [ ] AC-009: Letter reveals (Phase 2): individual letters fly to the Code Board
- [ ] AC-010: Lock number reveals (Phase 3): two-digit numbers slide into lock position
- [ ] AC-011: Word code reveal (Phase 4): "SHED" letters fill the word lock slots
- [ ] AC-012: Code Board always shows current state -- previously revealed values remain visible

### Assignment Types

- [ ] AC-013: `single_answer` type -- one prompt, one input, one answer (Assignments 2, 5)
- [ ] AC-014: `multi_step_math` type -- sequential prompts where each step unlocks the next (Assignments 1, 7, 8)
- [ ] AC-015: `video_question` type -- video plays first, question appears after video ends (Assignments 3, 6)
- [ ] AC-016: `video_table_math` type -- video + interactive table + follow-up calculation (Assignment 9)
- [ ] AC-017: `poem_riddle` type -- animated poem display + answer input (Assignments 4, 10)
- [ ] AC-018: `chain_logic` type -- references answer from a previous assignment (Assignment 5)
- [ ] AC-019: `anagram` type -- drag-and-drop letter tiles with progressive hints (Assignment 11)
- [ ] AC-020: `finale` type -- celebration screen, no input required (Assignment 12)

### Answer Validation

- [ ] AC-021: All answers validated against `config.assignments[].answer` or step answers
- [ ] AC-022: Number answers: exact integer match after parsing (trim whitespace, strip leading zeros)
- [ ] AC-023: Letter answers: case-insensitive single character match
- [ ] AC-024: Word answers (SHED in Assignment 11): case-insensitive 4-character string match
- [ ] AC-025: Wrong answers produce encouraging feedback ("Not quite -- try again!"), gentle shake, no penalty
- [ ] AC-026: Unlimited retries on all assignments
- [ ] AC-027: Correct answer produces celebration feedback, success message from config, Code Board animation

### Multi-Step Assignments

- [ ] AC-028: Multi-step assignments (1, 7, 8, 9) show one step at a time
- [ ] AC-029: Each step must be answered correctly before the next step appears
- [ ] AC-030: Previous steps remain visible (but read-only) as context for the current step
- [ ] AC-031: The final step's answer triggers the code reveal

### Progressive Hints

- [ ] AC-032: Each assignment has a hint available from config
- [ ] AC-033: Assignment 11 (Word Scramble) has timed progressive hints at 30s, 60s, 90s
- [ ] AC-034: Hints appear automatically after the configured delay from when the assignment was opened

---

## Technical Notes

- **Config source:** All 12 assignments defined in `easter-2026-config.json` under `assignments[]`
- **Router component:** `AssignmentRouter.tsx` manages the state machine: which assignment is current, which are completed, which are locked
- **State machine states per assignment:** `locked` -> `active` -> `completed`
- **localStorage keys:** Store array of completed assignment IDs and current assignment index
- **Code Board state:** Derived from completed assignments -- each completed assignment's `reveals` field defines what appears on the board
- **Chain dependencies:** Assignment 5 references Assignment 2's answer (value 8). The config encodes this via `chainFrom.assignmentId`

---

## Dependencies

| Dependency | Type | Status |
|-----------|------|--------|
| US-001 (Egg Registration) must be complete before Phase 1 | Feature | Needed |
| `AssignmentRouter.tsx` state machine | Code | Needed |
| `CodeBoard.tsx` with reveal animations | Code | Needed |
| `CharacterInput.tsx` for answer entry | Code | Needed |
| `AssignmentLayout.tsx` two-column layout | Code | Needed |
| All 12 assignment components (A01-A12) | Code | Needed |
| `HintSystem.tsx` for progressive hints | Code | Needed |
| Video assets for Assignments 3, 6, 9 | Assets | Needed |
| `easter-2026-config.json` fully populated | Data | Done |

---

## Assignment Reference

| # | Title | Type | For | Reveals | Answer(s) |
|---|-------|------|-----|---------|-----------|
| 1 | The Great Egg Sum | multi_step_math | Both | Digit 1 | 604, 10, 1 |
| 2 | The Scale Explorer | single_answer | Boy | Digit 8 | 8 |
| 3 | Grandma Juliaa's Video | video_question | Girl | Digit 3 | 3 |
| 4 | The Ssssnake Poem | poem_riddle | Girl | Letter S | S |
| 5 | The Alphabet Chain | chain_logic | Both | Letter H | H |
| 6 | Grandma Vera's Video | video_question | Girl | Letter E | E |
| 7 | The Vlad Equation | multi_step_math | Boy | Letter D | 4, D |
| 8 | The Semitone Puzzle | multi_step_math | Boy | Lock #1: 18 | 12, 5, 18 |
| 9 | The Cousin Calculator | video_table_math | Both | Lock #2: 38 | 6,7,6,7,6 -> 32+6=38 |
| 10 | The Mirror Riddle | poem_riddle | Girl | Lock #3: 18 | 18 |
| 11 | The Word Scramble | anagram | Both | Word: SHED | SHED |
| 12 | The Grand Unlock! | finale | Both | Treasure | N/A |

---

## Test Scenarios

1. **Happy path:** Complete all 12 in order with correct answers -- verify code board fills correctly
2. **Sequential lock enforcement:** Try to access Assignment 5 before completing 4 -- verify it is locked
3. **Multi-step progression:** In Assignment 1, enter 604 correctly, then enter wrong value for step 2 -- verify step 2 rejects and step 1 remains visible
4. **Code Board accumulation:** After Assignment 3, verify Code Board shows: [1][8][3] in digit slots
5. **Chain reference:** In Assignment 5, verify the prompt references "8" from Assignment 2's answer
6. **State persistence:** Complete assignments 1-5, close browser, reopen -- verify assignments 1-5 show as completed and 6 is current
7. **Back navigation:** After completing Assignment 7, press Back repeatedly -- verify can review 1-7 read-only
8. **Wrong answer flood:** Enter 10 wrong answers rapidly on Assignment 3 -- verify no state corruption
9. **Phase transition:** After Assignment 3 (last in Phase 1), verify Phase 2 label appears in progress bar
