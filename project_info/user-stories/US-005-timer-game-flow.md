# US-005: Timer and Game Flow

## As a parent
## I want the hunt to have a 60-minute countdown that creates excitement without harsh punishment
## So that the kids feel urgency and thrill but are never crushed by a "game over" if time runs out

---

## Overview

The timer is a 60-minute countdown that runs from the moment the parent presses START until either the kids complete all assignments or the timer reaches zero. Unlike last year's implementation (which had a hard game-over screen), this year's timer uses a "soft timeout" -- when time expires, the kids see an encouraging "time's up" screen and can choose to continue without the timer.

The timer is visible in the header bar at all times and creates three escalating urgency states: normal (white), warning (yellow pulse at 10:00), and urgent (red pulse at 5:00).

---

## Acceptance Criteria

### Timer Display

- [ ] AC-001: Timer displays in the header bar, right-aligned, showing `MM:SS` format
- [ ] AC-002: Initial display shows `60:00` with a prominent START button
- [ ] AC-003: Timer digits use yellow-accent color (`#FCD34D`) on the blue-primary header background
- [ ] AC-004: Timer font is large enough to read from across a table (minimum 24px on tablet)

### Timer States

- [ ] AC-005: **Pre-start:** Timer shows `60:00` and a START button. No assignments are accessible until START is pressed.
- [ ] AC-006: **Running (normal):** Timer counts down second by second. White/yellow digits. Phase 0 begins.
- [ ] AC-007: **Running (warning):** At 10:00 remaining, timer digits turn red/orange with a gentle pulse animation
- [ ] AC-008: **Running (urgent):** At 5:00 remaining, a "Hurry up!" banner message appears below the header
- [ ] AC-009: **Soft timeout:** At 0:00, a gentle overlay appears (NOT a harsh game-over screen):
  - Title: "Time's up!"
  - Body: Shows how far the kids got (e.g., "You completed 8 of 12 assignments!")
  - Shows any codes already discovered
  - Button: "Keep going without timer" (removes timer, lets them finish)
  - The tone is encouraging, not punitive
- [ ] AC-010: **Completed:** When Assignment 12 is reached (while timer is still running), timer stops. Final time is displayed as part of the celebration screen.

### Timer Behavior

- [ ] AC-011: Timer starts ONLY when the START button is pressed (not on page load)
- [ ] AC-012: Timer runs continuously across all phases (Phase 0 through Phase 4) -- it does not pause between assignments
- [ ] AC-013: Timer does not pause when the browser tab is backgrounded -- it uses wall-clock time, not animation frames
- [ ] AC-014: Timer persists to localStorage (start timestamp) -- if the app is closed and reopened, the timer resumes at the correct remaining time
- [ ] AC-015: If the app is reopened after the timer would have expired, it immediately shows the soft timeout screen
- [ ] AC-016: After soft timeout, if the user chooses "Keep going without timer," the timer display shows "No timer" or is hidden, and all assignments remain accessible

### Game Flow Integration

- [ ] AC-017: START button press is the single entry point -- it triggers the timer AND unlocks Phase 0 simultaneously
- [ ] AC-018: The 60-minute duration is configured in `config.timer.durationSeconds` (3600)
- [ ] AC-019: Warning threshold is configured in `config.timer.warningAtSeconds` (600 = 10 minutes)
- [ ] AC-020: Urgent threshold is configured in `config.timer.urgentAtSeconds` (300 = 5 minutes)
- [ ] AC-021: `config.timer.softTimeout` is `true` -- this enables the gentle timeout behavior (as opposed to a hard game-over)

### Complete Game Flow Sequence

```
1. App loads -> Header shows "EASTER 2026" + timer at 60:00 + START button
2. Parent presses START -> Timer begins counting down
3. Phase 0 (Egg Registration) -> 20 riddle cards appear
4. All 20 riddles solved -> Confetti + transition message
5. Phase 1 begins -> Assignments 1-3 unlock sequentially
6. Phase 2 begins -> Assignments 4-7 unlock sequentially
7. Phase 3 begins -> Assignments 8-10 unlock sequentially
8. Phase 4 begins -> Assignment 11 (Word Scramble)
9. Assignment 12 -> Timer stops, celebration screen
10. Kids RUN TO THE SHED with the codes
```

---

## Technical Notes

- **Existing component:** `CountdownTimer.tsx` from the 2025 codebase -- needs modification from 59:59 to 60:00, integration into new header bar, and soft timeout behavior
- **Time tracking:** Store `startTimestamp` (Unix epoch ms) in localStorage when START is pressed. On every render, calculate `remainingSeconds = durationSeconds - ((Date.now() - startTimestamp) / 1000)`. This is immune to tab backgrounding and browser sleep.
- **Config source:** `config.timer` object provides all thresholds
- **Urgency states:** Derive from `remainingSeconds` compared to `warningAtSeconds` and `urgentAtSeconds`
- **Soft timeout state:** When `remainingSeconds <= 0 && softTimeout === true`, show the timeout overlay instead of hard game-over
- **Post-timeout mode:** Store `timerDismissed: true` in localStorage. When this flag is set, hide the timer and allow all game interactions to continue normally.

---

## Dependencies

| Dependency | Type | Status |
|-----------|------|--------|
| `CountdownTimer.tsx` (modified from 2025) | Code | Needs modification |
| `easter-2026-config.json` timer config | Data | Done |
| Header bar layout with timer slot | Code | Needed |
| localStorage persistence for start timestamp | Code | Needed |
| Soft timeout overlay component | Code | Needed |
| Sound effect for timer warning (nice-to-have) | Asset | Nice-to-have |

---

## Timer UX States Visual Reference

### Normal (60:00 - 10:01)
```
[EASTER 2026]    Assignment 3 of 12      [47:23]
                                          ^white/yellow digits
```

### Warning (10:00 - 5:01)
```
[EASTER 2026]    Assignment 8 of 12      [09:47]
                                          ^red digits, gentle pulse
```

### Urgent (5:00 - 0:01)
```
[EASTER 2026]    Assignment 9 of 12      [03:12]
         *** Hurry up! ***                ^red digits, faster pulse
```

### Soft Timeout (0:00)
```
+------------------------------------------+
|                                          |
|            Time's up!                    |
|                                          |
|   You completed 9 of 12 assignments!    |
|                                          |
|   Codes found so far:                   |
|   Lock 1: [18] - [38] - [__]           |
|   Lock 2: [S][H][E][D]                 |
|                                          |
|   [  Keep going without timer  ]        |
|                                          |
+------------------------------------------+
```

### Victory (timer stopped)
```
[EASTER 2026]    COMPLETE!               [12:34 remaining!]
                                          ^green digits, frozen
```

---

## Test Scenarios

1. **Happy path:** Press START, complete all 12 assignments within 60 minutes -- timer stops, victory screen shows remaining time
2. **Soft timeout:** Press START, wait 60 minutes (or set duration to 60 seconds for testing) -- verify soft timeout overlay appears, NOT a game-over screen
3. **Continue after timeout:** After soft timeout, press "Keep going without timer" -- verify assignments remain accessible and timer is hidden
4. **Warning state:** At 10:00 remaining, verify timer turns red and pulses
5. **Urgent state:** At 5:00 remaining, verify "Hurry up!" banner appears
6. **Tab backgrounding:** Press START, background tab for 2 minutes, return -- verify timer shows correct remaining time (not 2 minutes ahead)
7. **Browser close/reopen:** Press START, close browser after 10 minutes, reopen -- verify timer shows ~50:00
8. **Browser reopen after expiry:** Press START, close browser, wait 70 minutes, reopen -- verify soft timeout screen appears immediately
9. **Pre-start state:** On fresh load, verify no assignments are accessible until START is pressed
10. **Timer at exactly 0:** Verify the transition from 0:01 to 0:00 triggers timeout, not at -0:01
11. **Config override:** Change `durationSeconds` to 120 in config -- verify timer starts at 2:00 (for testing purposes)
