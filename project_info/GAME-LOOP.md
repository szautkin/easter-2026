# Game Loop -- Easter 2026 Egg Hunt

## Complete State Machine

```
                    +------------------+
                    |   APP LOADS      |
                    |  Timer: 60:00    |
                    |  [START] button  |
                    +--------+---------+
                             |
                      Parent presses START
                             |
                    +--------v---------+
                    |   PHASE 0        |
                    |  Egg Registration|
                    |  20 mini-riddles |
                    |  Any order       |
                    |  Timer: running  |
                    +--------+---------+
                             |
                      All 20 solved
                      Confetti burst
                             |
                    +--------v---------+
                    |   PHASE 1        |
                    |  Digit Discovery |
                    |  Assignments 1-3 |
                    |  Sequential      |
                    |  Reveals: 1,8,3  |
                    +--------+---------+
                             |
                      Assignment 3 solved
                             |
                    +--------v---------+
                    |   PHASE 2        |
                    |  Letter Discovery|
                    |  Assignments 4-7 |
                    |  Sequential      |
                    |  Reveals: S,H,E,D|
                    +--------+---------+
                             |
                      Assignment 7 solved
                             |
                    +--------v---------+
                    |   PHASE 3        |
                    |  Assembly        |
                    |  Assignments 8-10|
                    |  Sequential      |
                    |  Reveals: 18,38,18|
                    +--------+---------+
                             |
                      Assignment 10 solved
                             |
                    +--------v---------+
                    |   PHASE 4        |
                    |  Unlock!         |
                    |  Assignments 11-12|
                    |  Word: SHED      |
                    |  FINALE          |
                    +--------+---------+
                             |
                      Assignment 12 reached
                      Timer STOPS
                             |
                    +--------v---------+
                    |   VICTORY        |
                    |  Both codes shown|
                    |  RUN TO SHED!    |
                    +------------------+
```

---

## Phase 0 -- Egg Registration

### Entry Condition
- Parent has pressed START
- Timer is running

### Flow
1. App displays 20 riddle cards in a scrollable grid
2. Each card shows a riddle (word or number type)
3. Word riddles: player taps a word chip from the pool of 10 words
4. Number riddles: player types a number on the keypad
5. Correct answer: card flips to Easter illustration, green checkmark, counter increments
6. Wrong answer: shake animation, "Try again!" -- unlimited retries
7. Cards can be solved in ANY order
8. Used word chips are dimmed in the pool

### Exit Condition
- All 20 riddles solved (20/20)
- Triggers: confetti burst, transition message, Code Board appears, Phase 1 unlocks

### Edge Cases
| Scenario | Behavior |
|----------|----------|
| Timer expires during Phase 0 | Soft timeout overlay. "Keep going" resumes Phase 0. |
| Player closes app mid-Phase 0 | Solved riddles persist in localStorage. Resume where left off. |
| Player enters number for word riddle | Not possible -- word riddles use chip selector, not free text. |
| All word chips used except one | Last chip auto-highlights as the only option. |

---

## Phase 1 -- Digit Discovery (Assignments 1-3)

### Entry Condition
- Phase 0 complete (20/20 riddles)

### Flow

**Assignment 1: The Great Egg Sum** (multi-step math)
```
Step 1: "Add all egg numbers: 23+37+42+56+64+71+85+92+47+87 = ?" -> 604
Step 2: "Add the digits: 6+0+4 = ?" -> 10
Step 3: "One more: 1+0 = ?" -> 1
REVEALS: Digit 1
```

**Assignment 2: The Scale Explorer** (single answer)
```
"Play C major scale. How many keys?" -> 8
REVEALS: Digit 8
```

**Assignment 3: Grandma Juliaa's Video** (video question)
```
Watch video -> "How many egg words contain letter N?" -> 3
(NINJA, BANJO, FUNKY)
REVEALS: Digit 3
```

### Code Board After Phase 1
Collected digits: 1, 8, 3 (shown as raw materials, not yet in lock slots)

---

## Phase 2 -- Letter Discovery (Assignments 4-7)

### Entry Condition
- Assignment 3 complete

### Flow

**Assignment 4: The Ssssnake Poem** (poem riddle)
```
Read poem about snake -> "First letter of the creature?" -> S
REVEALS: Letter S -> Lock 2 slot 1
```

**Assignment 5: The Alphabet Chain** (chain logic)
```
"Piano number was 8. A=1, B=2... what letter is position 8?" -> H
REVEALS: Letter H -> Lock 2 slot 2
```

**Assignment 6: Grandma Vera's Video** (video question)
```
Watch video -> "What letter do Easter and Eggs start with?" -> E
REVEALS: Letter E -> Lock 2 slot 3
```

**Assignment 7: The Vlad Equation** (multi-step)
```
Step 1: "How many letters in VLAD?" -> 4
Step 2: "4th letter of alphabet?" -> D
REVEALS: Letter D -> Lock 2 slot 4
```

### Code Board After Phase 2
- Lock 1: `[__]-[__]-[__]` (still empty)
- Lock 2: `[S][H][E][D]` (COMPLETE)

---

## Phase 3 -- Assembly Challenges (Assignments 8-10)

### Entry Condition
- Assignment 7 complete

### Flow

**Assignment 8: The Semitone Puzzle** (multi-step piano math)
```
Step 1: "How many semitones in one octave?" -> 12
Step 2: "How many semitones from C to F?" -> 5
Step 3: "12 + 5 = 17. Add first digit (1): 17 + 1 = ?" -> 18
REVEALS: Lock 1 position 0 = 18
```

**Assignment 9: The Cousin Calculator** (video + table math)
```
Watch video -> Fill in name letter counts:
  Andrii=6, Svyatik=7, Katiia=6, Nastiia=7, Daryna=6 -> Subtotal: 32
  Add family count (6): 32 + 6 = ? -> 38
REVEALS: Lock 1 position 1 = 38
```

**Assignment 10: The Mirror Riddle** (poem riddle)
```
"First and last are the same. First number was 18. Third number?" -> 18
REVEALS: Lock 1 position 2 = 18
```

### Code Board After Phase 3
- Lock 1: `[18]-[38]-[18]` (COMPLETE)
- Lock 2: `[S][H][E][D]` (COMPLETE)

---

## Phase 4 -- Unlock! (Assignments 11-12)

### Entry Condition
- Assignment 10 complete

### Flow

**Assignment 11: The Word Scramble** (anagram / drag-and-drop)
```
Letters: S, H, E, D (scrambled, draggable tiles)
Arrange into correct order -> SHED
Progressive hints:
  30s: "It's a small building in the backyard"
  60s: "The snake in your poem does this with its skin"
  90s: "Dad keeps tools in this!"
REVEALS: Word code SHED (confirmation of Lock 2)
```

**Assignment 12: The Grand Unlock!** (finale)
```
No input required. Celebration screen:
  "YOU CRACKED BOTH CODES!"
  Lock 1: 18 - 38 - 18
  Lock 2: SHED
  "RUN TO THE SHED!"
Timer STOPS. Confetti explosion. Triumphant sound.
```

---

## Timer Overlay (Parallel Track)

The timer runs as a parallel concern across all phases:

```
60:00 -------- 10:00 -------- 5:00 -------- 0:00
  |              |              |              |
  Normal       Warning        Urgent       Soft timeout
  (white)      (red pulse)    ("Hurry!")    (overlay)
                                              |
                                    [Keep going without timer]
```

### Timer vs. Phase Interaction

| Timer Event | Phase Impact |
|-------------|-------------|
| Timer starts | Phase 0 unlocks |
| Timer at 10:00 | Visual warning only -- no gameplay impact |
| Timer at 5:00 | "Hurry up!" banner -- no gameplay impact |
| Timer at 0:00 | Soft timeout overlay. Player can dismiss and continue. |
| Dismissed timeout | Timer hidden, all phases continue normally |
| Victory (A12) | Timer stops and freezes at remaining time |

---

## State Persistence Model

All game state is stored in localStorage to survive browser close/reopen:

```
localStorage keys:
  easter2026_timerStart     -> Unix timestamp (ms) when START was pressed
  easter2026_timerDismissed -> boolean, true if soft timeout was dismissed
  easter2026_solvedRiddles  -> array of riddle IDs solved in Phase 0
  easter2026_completedAssignments -> array of assignment IDs (1-12) completed
  easter2026_currentPhase   -> 0, 1, 2, 3, or 4
```

### Derived State (not stored, computed on render)
- Code Board contents: derived from `completedAssignments` + config `reveals` fields
- Current assignment: first assignment not in `completedAssignments` list
- Timer remaining: `3600 - ((Date.now() - timerStart) / 1000)`
- Phase label: derived from current assignment's `phase` field

---

## Answer Validation Rules

| Input Type | Validation | Examples |
|-----------|-----------|----------|
| Number (single) | `parseInt(input) === answer` | "8" === 8, "08" === 8 |
| Number (multi-digit) | `parseInt(input) === answer` | "604" === 604, " 604 " === 604 |
| Letter (single) | `input.toUpperCase() === answer` | "h" === "H", "H" === "H" |
| Word (multi-letter) | `input.toUpperCase() === answer` | "shed" === "SHED" |
| Word chip (tap) | Exact match from predefined set | Chip value === answer |
| Table entry | Each row validated individually | "6" === 6 for Andrii |

### Wrong Answer Behavior (all types)
1. Gentle horizontal shake animation on input
2. Brief red flash on input border
3. Encouraging message: "Not quite -- try again!"
4. Input clears for retry
5. No penalty, no attempt counter, unlimited retries
6. After 3 wrong attempts on the same step: hint automatically appears (if not already visible)

### Correct Answer Behavior (all types)
1. Input border flashes yellow briefly
2. Success message from config displays
3. If code reveal: animation fires on Code Board
4. If multi-step: next step appears
5. If final step of assignment: assignment marked complete, next assignment unlocks
6. Sound effect plays (correct ding)

---

## Critical Path Analysis

The minimum time to complete all phases (expert player, no wrong answers):

| Phase | Tasks | Estimated Minimum |
|-------|-------|-------------------|
| Phase 0 | 20 riddles | 5 minutes |
| Phase 1 | 3 assignments | 5 minutes |
| Phase 2 | 4 assignments (inc. video watch time) | 8 minutes |
| Phase 3 | 3 assignments (inc. video watch time) | 8 minutes |
| Phase 4 | 2 assignments | 3 minutes |
| **Total** | **32 interactions** | **~29 minutes** |

This leaves approximately 30 minutes of buffer for wrong answers, discussion, video replays, and enjoyment. The 60-minute timer is appropriately sized.

---

## Failure Modes and Recovery

| Failure | Impact | Recovery |
|---------|--------|----------|
| Browser crashes | State lost since last save | localStorage saves after each interaction -- resume at last completed step |
| Video won't play | Assignment 3, 6, or 9 blocked | Fallback text mode delivers the question without video |
| Timer expires | Game paused by overlay | "Keep going without timer" button resumes play |
| Wrong answer on multi-step | Step resets | Only current step resets; previous steps remain |
| All word chips assigned wrong | Stuck state | Chips are only assigned on correct answer, so this cannot happen |
| localStorage cleared | Full reset | Game starts from scratch -- parent must press START again |
| Device rotation mid-assignment | Layout shifts | Responsive design handles portrait/landscape; state unaffected |
