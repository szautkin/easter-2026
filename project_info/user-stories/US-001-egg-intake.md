# US-001: Egg Registration (Phase 0)

## As a player (child, age 7-12)
## I want to match riddles to the egg slips I found during the outdoor hunt
## So that I can register all 20 eggs and unlock the main puzzle assignments

---

## Overview

Phase 0 is the bridge between the physical egg hunt and the digital puzzle experience. After the kids collect all 20 plastic eggs from the yard, they open them at the table and spread out the slips. The app presents 20 riddle cards -- 10 for word eggs and 10 for number eggs. Kids solve riddles in any order, matching each riddle to the correct egg slip. All 20 must be solved before the 12 main assignments unlock.

**Player count:** 2 kids (girl age 7, boy age 12) working together
**Expected duration:** 10-15 minutes of the 60-minute timer
**Critical path:** Yes -- blocks all subsequent phases

---

## Acceptance Criteria

### Functional

- [ ] AC-001: App displays a grid of 20 riddle cards (scrollable on mobile, grid on tablet/desktop)
- [ ] AC-002: Each card shows the riddle text, an input area, and a status indicator (unsolved/solved)
- [ ] AC-003: Word riddle cards display tappable word chips at the bottom showing all 10 word slips (WACKY, GOOFY, ZIPPY, SILLY, BUBBY, NINJA, BANJO, YUMMY, FUNKY, JELLY)
- [ ] AC-004: Number riddle cards display a number keypad for input
- [ ] AC-005: Cards can be solved in ANY order -- no forced sequence
- [ ] AC-006: Correct answer triggers: card flips to reveal Easter illustration, green checkmark, progress counter increments
- [ ] AC-007: Wrong answer triggers: gentle horizontal shake animation, "Try again!" message, no penalty, unlimited retries
- [ ] AC-008: Progress bar displays "X/20 eggs registered" and updates in real time
- [ ] AC-009: When all 20 riddles are solved: confetti burst animation plays, transition message appears ("All eggs registered! Now the REAL challenge begins..."), then Phase 1 unlocks
- [ ] AC-010: Word chips that have already been used (matched to a riddle) are visually dimmed/disabled to prevent confusion
- [ ] AC-011: State persists to localStorage -- if the app is closed and reopened, solved riddles remain solved

### Input Validation

- [ ] AC-012: Number inputs accept only numeric characters (no letters, no special characters)
- [ ] AC-013: Number answers are validated as exact integer match (e.g., "23" not "023" or "23.0")
- [ ] AC-014: Word answers are case-insensitive (tapped from chips, so this is enforced by UI)
- [ ] AC-015: Empty submissions are blocked -- Check button is disabled until input is provided

### Edge Cases

- [ ] AC-016: If a child taps a word chip already assigned to a solved riddle, the chip is non-interactive
- [ ] AC-017: If the browser tab is backgrounded and restored, timer and state resume correctly
- [ ] AC-018: If all 20 are solved while the transition animation is playing, no double-trigger occurs
- [ ] AC-019: The riddle grid is readable and usable on both landscape tablet (primary) and portrait phone

---

## Technical Notes

- **Config source:** All 20 riddles, answers, hints, and illustrations are defined in `easter-2026-config.json` under `intake.riddles[]`
- **Input mechanism:** Word riddles use tappable chip selector (pre-populated from `config.eggs.words`); number riddles use a numeric keypad or standard `<input type="number">`
- **Illustration assets:** Each riddle has an `illustration` field (e.g., "bunny", "chick", "egg_blue") -- these are the flip-reveal images
- **Answer matching:** Word answers compared case-insensitively against `riddle.answer`; number answers compared as `parseInt(input) === riddle.answer`
- **Components involved:** `EggIntake.tsx` (grid container), `RiddleCard.tsx` (individual card with flip animation)
- **State management:** Solved riddle IDs stored in localStorage key; `useGameConfig` hook provides typed access to riddle data

---

## Dependencies

| Dependency | Type | Status |
|-----------|------|--------|
| `easter-2026-config.json` with all 20 riddles populated | Data | Done |
| `useGameConfig.ts` hook for typed config access | Code | Needed |
| `RiddleCard.tsx` component | Code | Needed |
| 20 Easter illustration assets (bunny, chick, etc.) | Assets | Needed |
| Timer must be running (started in app header) | Feature | Needed |
| localStorage persistence layer | Code | Needed |

---

## Riddle Content Reference

### Word Riddles (tappable chip input)

| ID | Riddle | Answer |
|----|--------|--------|
| W1 | "Who is Mickey Mouse's tall, clumsy best friend?" | GOOFY |
| W2 | "A warrior dressed in black who moves in silence..." | NINJA |
| W3 | "What stringed instrument does Kermit the Frog play?" | BANJO |
| W4 | "What do you say when food tastes SO good?" | YUMMY |
| W5 | "What wiggly, jiggly treat wobbles when you poke it?" | JELLY |
| W6 | "'___ Races' is a cartoon!" | WACKY |
| W7 | "Super-duper fast -- like a hummingbird -- it's really ___!" | ZIPPY |
| W8 | "Opposite of serious? Making funny faces..." | SILLY |
| W9 | "Sweet nickname that rhymes with 'hubby'" | BUBBY |
| W10 | "Groovy beat that makes you dance? '___ town'" | FUNKY |

### Number Riddles (keypad input)

| ID | Riddle | Answer |
|----|--------|--------|
| N1 | "What is 15 + 8?" | 23 |
| N2 | "Normal body temperature in Celsius" | 37 |
| N3 | "What is 6 x 7?" | 42 |
| N4 | "What is 8 x 7?" | 56 |
| N5 | "How many squares on a chess board?" | 64 |
| N6 | "What is 100 - 29?" | 71 |
| N7 | "What is 17 x 5?" | 85 |
| N8 | "What is 46 + 46?" | 92 |
| N9 | "What is 50 - 3?" | 47 |
| N10 | "A piano has 88 keys. Subtract 1." | 87 |

---

## Test Scenarios

1. **Happy path:** Solve all 20 in sequence W1-W10, N1-N10 -- verify confetti and transition
2. **Random order:** Solve in random order -- verify no ordering bugs
3. **Wrong answers:** Enter wrong answers repeatedly -- verify shake, no penalty, no lockout
4. **Near-miss numbers:** Enter "24" for N1 (answer is 23) -- verify rejection
5. **Chip reuse:** After assigning GOOFY to W1, verify GOOFY chip is dimmed for all other word riddles
6. **Persistence:** Solve 10 riddles, close browser, reopen -- verify 10 remain solved
7. **Mobile layout:** Test on portrait phone -- verify grid scrolls, chips are tappable
8. **Rapid solve:** Solve all 20 as fast as possible -- verify no race conditions in state updates
