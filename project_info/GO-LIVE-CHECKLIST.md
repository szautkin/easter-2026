# Go-Live Checklist -- Easter 2026

**Go-Live Date:** Sunday, April 5, 2026 (Easter Sunday morning)
**Today:** April 1, 2026
**Days Remaining:** 4

---

## Status Key
- [ ] Not started
- [x] Complete
- [~] In progress
- [!] BLOCKED

---

## 1. Technical Readiness

### Core Game Engine
- [ ] `AssignmentRouter.tsx` state machine: locked -> active -> completed transitions
- [ ] Sequential unlock logic: Assignment N+1 only after N is solved
- [ ] Phase transitions: Phase 0 -> 1 -> 2 -> 3 -> 4 work correctly
- [ ] localStorage persistence: game state survives browser close/reopen
- [ ] localStorage persistence: timer survives browser close/reopen
- [ ] State derivation: Code Board contents computed from completed assignments

### Phase 0 -- Egg Registration
- [ ] 20 riddle cards render in scrollable grid
- [ ] Word riddles accept tappable chip input (10 word chips)
- [ ] Number riddles accept numeric keypad input
- [ ] Correct answer: card flip animation + green checkmark + counter increment
- [ ] Wrong answer: shake animation + "Try again!" + no penalty
- [ ] Used word chips are dimmed
- [ ] Progress bar: "X/20 eggs registered"
- [ ] 20/20 triggers confetti + transition to Phase 1
- [ ] Riddles solvable in any order

### Assignments 1-12
- [ ] Assignment 1 (Egg Sum): 3-step math works (604 -> 10 -> 1)
- [ ] Assignment 2 (Scale Explorer): single number input, answer 8
- [ ] Assignment 3 (Grandma Juliaa Video): video plays, question appears after, answer 3
- [ ] Assignment 4 (Snake Poem): poem displays line-by-line, letter input, answer S
- [ ] Assignment 5 (Alphabet Chain): alphabet reference, letter input, answer H
- [ ] Assignment 6 (Grandma Vera Video): video plays with subtitles, letter input, answer E
- [ ] Assignment 7 (Vlad Equation): 2-step (4 -> D)
- [ ] Assignment 8 (Semitone Puzzle): 3-step (12 -> 5 -> 18)
- [ ] Assignment 9 (Cousin Calculator): video + table (6+7+6+7+6=32, 32+6=38)
- [ ] Assignment 10 (Mirror Riddle): poem + number input, answer 18
- [ ] Assignment 11 (Word Scramble): drag-and-drop SHED with progressive hints
- [ ] Assignment 12 (Grand Finale): celebration screen, timer stops, codes displayed

### Code Board
- [ ] Code Board appears after Phase 0 completion
- [ ] Empty slots display correctly (dashed blue borders)
- [ ] Phase 1 digit reveals animate correctly (1, 8, 3)
- [ ] Phase 2 letter reveals fill Lock 2 slots (S, H, E, D)
- [ ] Phase 3 number reveals fill Lock 1 slots (18, 38, 18)
- [ ] Phase 4 confirmation animations play
- [ ] Code Board state persists across browser reload

### Timer
- [ ] Timer displays 60:00 on load with START button
- [ ] START begins countdown and unlocks Phase 0
- [ ] Timer counts down correctly (wall-clock based, not animation-frame)
- [ ] Timer persists across browser close/reopen (uses start timestamp)
- [ ] Warning state at 10:00 remaining (red digits, pulse)
- [ ] Urgent state at 5:00 remaining ("Hurry up!" banner)
- [ ] Soft timeout at 0:00 (encouraging overlay, not game-over)
- [ ] "Keep going without timer" resumes gameplay
- [ ] Timer stops when Assignment 12 is reached

### Video Player
- [ ] Videos play from local files (public/videos/)
- [ ] Custom controls: rewind 10s, play/pause, replay
- [ ] Autoplay on assignment load (with play button fallback)
- [ ] Poster images display before playback
- [ ] VTT subtitles display for Ukrainian videos
- [ ] Fallback text mode works when video file is missing

### Input System
- [ ] Character input cells: one per expected character
- [ ] Auto-advance focus to next cell
- [ ] Number mode accepts digits only
- [ ] Letter mode accepts letters only
- [ ] Correct animation: yellow flash
- [ ] Wrong animation: shake + red flash
- [ ] Check button disabled until all cells filled

### Layout and Responsiveness
- [ ] Desktop/tablet: 2-column layout (media left, question right)
- [ ] Mobile portrait: stacked layout (media top, question bottom)
- [ ] Header bar: title + assignment counter + timer
- [ ] Bottom nav: Back button + dot indicators + Check button
- [ ] Progress bar: phase name + fraction + fill animation
- [ ] All text readable without zooming on target devices

---

## 2. Content Readiness

### Video Assets
- [ ] Video 1: Grandma Juliaa (Italy) -- recorded, received, compressed
- [ ] Video 2: Grandma Vera + Grandpa Tolia (Poltava) -- recorded, received, compressed
- [ ] Video 3: Aunt Katiia/cousins (Poltava) -- recorded, received, compressed
- [ ] All videos compressed to <10MB (ffmpeg -crf 28)
- [ ] Poster images extracted from each video
- [ ] VTT subtitle files created for Ukrainian videos (Assignments 6, 9)
- [ ] All videos tested in the app on target device

**DEADLINE: Videos must be received by April 3 (Friday)**

### Riddle and Puzzle Content
- [x] 20 intake riddles written and in config (10 word, 10 number)
- [x] All 20 answers verified correct
- [x] All 12 assignment prompts written and in config
- [x] All 12 assignment answers verified correct
- [x] Multi-step assignments have all intermediate answers verified
- [x] Assignment 11 progressive hints written (30s, 60s, 90s)
- [x] Assignment 9 cousin name letter counts verified (6+7+6+7+6=32)
- [x] Assignment 9 family count verified (6 people)
- [ ] All hint text reviewed for age-appropriateness
- [ ] Success messages reviewed for engagement quality

### Illustration Assets
- [ ] 20 Easter illustrations for riddle card flips (bunny, chick, egg variants, etc.)
- [ ] Winner/celebration image for Assignment 12
- [ ] App icon/header image

---

## 3. Physical Preparation

### Locks
- [ ] Combination lock purchased and tested
- [ ] Combination lock set to 18-38-18
- [ ] Combination lock opened successfully 3 times to verify
- [ ] Letter/word lock purchased and tested
- [ ] Letter lock set to SHED
- [ ] Letter lock opened successfully 3 times to verify

### Eggs
- [ ] 20 plastic eggs obtained
- [ ] 10 number slips printed: 23, 37, 42, 56, 64, 71, 85, 92, 47, 87
- [ ] 10 word slips printed: WACKY, GOOFY, ZIPPY, SILLY, BUBBY, NINJA, BANJO, YUMMY, FUNKY, JELLY
- [ ] Each slip placed in an egg (one per egg)
- [ ] Spare set of slips printed (backup)

### Treasure
- [ ] Easter gifts/chocolate purchased
- [ ] Gifts placed in shed (or designated locked location)
- [ ] Both locks attached and locked
- [ ] Verified locks can be opened with correct codes while on the shed

### Hiding
- [ ] 20 hiding spots planned (mix of easy and moderate difficulty)
- [ ] Eggs hidden on Easter morning (before kids wake)
- [ ] Count verified: all 20 are findable
- [ ] No eggs in dangerous or inaccessible locations

---

## 4. Testing

### Full Playthrough
- [ ] Complete end-to-end playthrough with ALL correct answers
- [ ] Complete playthrough entering WRONG answers first, then correct -- verify recovery
- [ ] Complete playthrough on target device (tablet/iPad) in the actual environment
- [ ] Playthrough timed: verify 60 minutes is sufficient

### Edge Case Testing
- [ ] Timer expiry: let timer reach 0:00 -- verify soft timeout
- [ ] Continue after timeout: press "Keep going" -- verify gameplay resumes
- [ ] Browser close/reopen: close mid-Phase 2, reopen -- verify state restored
- [ ] Tab backgrounding: background tab for 5 minutes -- verify timer is correct on return
- [ ] Rapid input: tap/type very quickly -- verify no duplicate submissions or state corruption
- [ ] Back navigation: after completing Assignment 7, navigate back to 1 -- verify read-only review
- [ ] Video failure: rename a video file -- verify fallback text appears and assignment is completable

### Device Testing
- [ ] iPad (primary target): full playthrough
- [ ] Desktop Chrome: full playthrough
- [ ] Android tablet: basic smoke test
- [ ] Mobile phone (portrait): verify layout stacks correctly
- [ ] Test with device at 20% battery: verify no performance issues

### Answer Verification Matrix

| Assignment | Input | Expected Answer | Verified |
|-----------|-------|----------------|----------|
| Intake W1 | Chip tap | GOOFY | [ ] |
| Intake W2 | Chip tap | NINJA | [ ] |
| Intake W3 | Chip tap | BANJO | [ ] |
| Intake W4 | Chip tap | YUMMY | [ ] |
| Intake W5 | Chip tap | JELLY | [ ] |
| Intake W6 | Chip tap | WACKY | [ ] |
| Intake W7 | Chip tap | ZIPPY | [ ] |
| Intake W8 | Chip tap | SILLY | [ ] |
| Intake W9 | Chip tap | BUBBY | [ ] |
| Intake W10 | Chip tap | FUNKY | [ ] |
| Intake N1 | Number | 23 | [ ] |
| Intake N2 | Number | 37 | [ ] |
| Intake N3 | Number | 42 | [ ] |
| Intake N4 | Number | 56 | [ ] |
| Intake N5 | Number | 64 | [ ] |
| Intake N6 | Number | 71 | [ ] |
| Intake N7 | Number | 85 | [ ] |
| Intake N8 | Number | 92 | [ ] |
| Intake N9 | Number | 47 | [ ] |
| Intake N10 | Number | 87 | [ ] |
| A1 Step 1 | Number | 604 | [ ] |
| A1 Step 2 | Number | 10 | [ ] |
| A1 Step 3 | Number | 1 | [ ] |
| A2 | Number | 8 | [ ] |
| A3 | Number | 3 | [ ] |
| A4 | Letter | S | [ ] |
| A5 | Letter | H | [ ] |
| A6 | Letter | E | [ ] |
| A7 Step 1 | Number | 4 | [ ] |
| A7 Step 2 | Letter | D | [ ] |
| A8 Step 1 | Number | 12 | [ ] |
| A8 Step 2 | Number | 5 | [ ] |
| A8 Step 3 | Number | 18 | [ ] |
| A9 Row 1 | Number | 6 | [ ] |
| A9 Row 2 | Number | 7 | [ ] |
| A9 Row 3 | Number | 6 | [ ] |
| A9 Row 4 | Number | 7 | [ ] |
| A9 Row 5 | Number | 6 | [ ] |
| A9 Final | Number | 38 | [ ] |
| A10 | Number | 18 | [ ] |
| A11 | Word (drag) | SHED | [ ] |
| A12 | None | N/A | [ ] |

---

## 5. Morning-Of Runbook (April 5)

### Before Kids Wake (6:00-7:00 AM)

1. [ ] Hide 20 eggs in the yard
2. [ ] Walk the yard and count all 20 -- confirm findable
3. [ ] Verify locks on shed are locked and functional
4. [ ] Open app on tablet/laptop
5. [ ] Clear localStorage (fresh start): open DevTools > Application > Clear Storage
6. [ ] Verify app shows 60:00 timer + START button
7. [ ] Verify all 3 videos play (scrub through each quickly)
8. [ ] Plug in device (keep charged throughout)
9. [ ] Set up table with space for egg slips + device
10. [ ] Position camera/phone for photos
11. [ ] Have backup device ready (phone with app loaded) in case primary device fails

### When Kids Are Ready (7:00-8:00 AM)

12. [ ] Announce the egg hunt: "20 eggs in the yard!"
13. [ ] Let kids hunt (15 minutes max)
14. [ ] Verify all 20 found
15. [ ] Bring kids inside to table
16. [ ] "Open all eggs and spread the slips out!"
17. [ ] Once slips are spread: "Ready? When I press START, you have 60 minutes!"
18. [ ] Press START
19. [ ] Step back and let them play

### During Game (Observer Mode)

20. [ ] Take photos during key moments (video puzzles, Code Board reveals)
21. [ ] If kids are genuinely stuck for 3+ minutes: gently suggest they re-read the riddle
22. [ ] If video won't play: app has fallback text, read it aloud if needed
23. [ ] Do NOT give answers -- let the hints in the app do their job

### Victory

24. [ ] When "RUN TO THE SHED!" appears: run with them
25. [ ] Help with combination lock if it is physically tricky to dial
26. [ ] Capture video of them opening the treasure
27. [ ] Celebrate!

---

## 6. Rollback Plan

If the app is broken on Easter morning and cannot be fixed quickly:

### Option A: Paper Fallback
Print all 12 assignment prompts on paper. Parent reads them aloud, kids solve verbally. Skip the Code Board animation but still arrive at 18-38-18 and SHED. Takes 20-30 minutes.

### Option B: Last Known Good Version
If a recent code change broke things:
- `git stash` or `git checkout` to the last working commit
- Rebuild and serve
- Accept missing features in exchange for a working core loop

### Option C: Direct Reveal
If all else fails:
- Run the egg hunt as-is (still fun)
- Give the kids the codes verbally with a simplified verbal puzzle chain
- They still get to open the locks and find the treasure
- The physical experience is preserved even if the digital layer fails

**The treasure hunt happens regardless. The app enhances it; it does not gate it.**
