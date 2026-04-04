# GO-LIVE READINESS ASSESSMENT

**Date:** April 4, 2026 (Friday evening)
**Go-Live:** April 5, 2026 (Easter Sunday morning)
**Assessor:** Trailblazer PM

---

## OVERALL STATUS: YELLOW -- GO WITH MITIGATIONS

The core game loop is architecturally sound and code-reviewed. All blocking code issues (B1-B6 from Code Review #2) are resolved. The critical risk is **video content delivery** -- 9 of 11 videos depend on external services (YouTube/Google Drive), and 3 family videos have not been recorded or received. Fallback text exists for every video, which is the safety net.

---

## 1. CONTENT COMPLETENESS

### Video Assets

| # | Assignment | Video Source | Status |
|---|-----------|-------------|--------|
| 1 | A3 -- Grandma Juliaa | `/assets/videos/grandma_juliaa.mp4` (local) | RED -- File missing. `public/videos/` directory is empty. No local video files exist. |
| 2 | A6 -- Grandma Vera | `/assets/videos/grandma_vera_grandpa_tolia.mp4` (local) | RED -- File missing. Same as above. |
| 3 | A9 -- Aunt Katiia | `/assets/videos/aunt_katiia.mp4` (local) | RED -- File missing. Same as above. |
| 4 | A4 -- Snake (YouTube) | `youtube.com/watch?v=oEJgw7fJpo8` | GREEN -- Public YouTube, should work. Needs verify. |
| 5 | A11 -- Shed (YouTube) | `youtube.com/shorts/urfPGZRlL80` | GREEN -- Public YouTube, should work. Needs verify. |
| 6 | A13 -- Hat/Magic (GDrive) | `drive.google.com/file/d/1JcZv4j...` | YELLOW -- GDrive embed. Sharing permissions must be "Anyone with the link." |
| 7 | A14 -- Elephant (GDrive) | `drive.google.com/file/d/1ueq81d...` | YELLOW -- Same risk. |
| 8 | A15 -- Demogorgon (GDrive) | `drive.google.com/file/d/1o97S8L...` | YELLOW -- Same risk. |
| 9 | A101 -- Mystery Digit (GDrive) | `drive.google.com/file/d/1tUmZ77...` | YELLOW -- Same risk. |
| 10 | A102 -- Hidden Number (GDrive) | `drive.google.com/file/d/1iFuNa6...` | YELLOW -- Same risk. |
| 11 | A103 -- Secret Code (GDrive) | `drive.google.com/file/d/1bYLq7T...` | YELLOW -- Same risk. |
| 12 | A104 -- Shadow Clue (GDrive) | `drive.google.com/file/d/1a0K3D6...` | YELLOW -- Same risk. |
| 13 | A105 -- Lost Fragment (GDrive) | `drive.google.com/file/d/1VBVjGH...` | YELLOW -- Same risk. |
| 14 | A106 -- Last Piece (GDrive) | `drive.google.com/file/d/1TsVB9j...` | YELLOW -- Same risk. |

**Summary:** 0 of 3 local family videos present. 8 GDrive videos untested for sharing permissions. 2 YouTube videos likely fine.

**CRITICAL NOTE:** Assignments 3, 6, and 9 reference local `.mp4` files that DO NOT EXIST on disk. The `public/videos/` directory is empty. These assignments are on the ORIGINAL path (ids 3, 6, 9) but are NOT in the active playlists (see below). However, if the original path is somehow activated, these will break.

### Active Playlists vs Config

The game store defines two active paths:

- **WORD_PATH:** `[15, 13, 14, 4, 11]` -- Demogorgon, Hat/Magic, Elephant, Snake+Poem, Shed Reveal
- **NUMBER_PATH:** `[101, 102, 104, 105, 106, 103, 107]` -- Six progressive disclosure puzzles + Number Lock Assembly

Assignments 1-3, 5-10 from the original design are NOT in either active path. They exist in config but are unreachable in normal gameplay. This means:
- The 3 missing local family videos (A3, A6, A9) are NOT in the active game flow -- GREEN
- The piano assignments (A2, A8) requiring physical piano access are NOT in the active flow -- GREEN
- All active assignments use YouTube or GDrive videos (or no video) -- this is the live risk

### Fallback Text Coverage

| Assignment | Has fallbackText? | Quality |
|-----------|-------------------|---------|
| A4 (Snake video) | YES | Good -- describes what to look for |
| A11 (Shed video) | YES | Minimal -- "Something small sits in the backyard" |
| A13 (Hat/Magic) | YES | Good -- describes the trick |
| A14 (Elephant) | YES | Good -- describes fighting |
| A15 (Demogorgon) | YES | Good -- describes Stranger Things reference |
| A101 | Weak | Generic "Watch the video for your first clue..." |
| A102 | Weak | Generic "Watch the video for your clue..." |
| A103 | YES | Good -- describes grandma with portraits |
| A104 | Weak | Generic "Watch the video for your clue..." |
| A105 | Weak | Generic "Watch the video for your clue..." |
| A106 | Weak | Generic "Watch the video for your clue..." |

**Risk:** 5 of 11 active video clues have GENERIC fallback text that gives the player nothing to work with. If the video fails for these, the child has only the poem riddle as a clue. The poems are strong enough to solve without the video for most assignments, but A101/A102/A104/A105/A106 are weaker.

### Poster Images

ALL poster fields for GDrive/YouTube videos are empty strings (`"poster": ""`). This means no preview image before the video loads -- players see a black rectangle until the iframe loads. Cosmetic, not blocking.

---

## 2. CODE HEALTH -- GREEN

All 6 blocking issues from Code Review #2 are resolved:
- [x] B1: Zustand persist migration (v2 with VALID_PHASES check)
- [x] B2: Timer totalElapsed bug (pauseTimer before solveAssignment)
- [x] B3: 16 dead files removed
- [x] B4: Hardcoded answer spoilers removed from HubPage
- [x] B5: handleOpenTreasure replaced with startFinale action
- [x] B6: NumberLockAssembly reads from config

Architecture audit HIGH items:
- [x] OPT-1: App.tsx timer subscription fixed (now uses boolean selector)
- [ ] DRY-2: Duplicate sparkle functions -- LOW RISK, cosmetic

Additional:
- [x] ErrorBoundary wraps individual assignments in AssignmentRouter (ARCH-4 from audit)
- [x] Store migration properly resets unrecognized phases to 'idle'

---

## 3. PHYSICAL PREP STATUS -- ACTION REQUIRED TONIGHT

### Must Do Tonight (April 4)
- [ ] Print 10 number slips: 23, 37, 42, 56, 64, 71, 85, 92, 47, 87
- [ ] Print 10 word slips: WACKY, GOOFY, ZIPPY, SILLY, BUBBY, NINJA, BANJO, YUMMY, FUNKY, JELLY
- [ ] Place one slip in each of 20 plastic eggs
- [ ] Print spare set of slips (backup)
- [ ] Set combination lock to 18-38-18 and verify 3x
- [ ] Set letter lock to SHED and verify 3x
- [ ] Place Easter gifts/chocolate in shed
- [ ] Attach both locks to shed and lock them
- [ ] Verify both locks open with correct codes while attached
- [ ] Plan 20 hiding spots (mix of easy/moderate)

### Must Do Easter Morning (before kids wake)
- [ ] Hide 20 eggs
- [ ] Walk yard, count all 20, confirm findable
- [ ] Verify shed locks are still locked

---

## 4. TESTING GAPS -- RED

### Not Yet Tested
- [ ] Full end-to-end playthrough on target device (iPad)
- [ ] Full playthrough with ALL correct answers through both paths
- [ ] Full playthrough with WRONG answers to verify recovery
- [ ] Timer expiry (let it hit 0:00) -- verify soft timeout
- [ ] "Continue Without Timer" flow
- [ ] Browser close/reopen mid-game -- verify state restore
- [ ] Tab backgrounding for 5+ minutes -- verify timer accuracy
- [ ] Back navigation to completed assignments -- verify read-only
- [ ] ALL 8 Google Drive videos actually play in the embedded iframe
- [ ] Both YouTube videos play in embedded iframe
- [ ] Every single answer in the verification matrix (20 intake + 30+ assignment inputs)
- [ ] Number Lock Assembly drag-and-drop on touch device
- [ ] Shed Reveal (A11) drag-and-drop on touch device
- [ ] Answer: does the WORD_PATH complete correctly and set `wordPathComplete: true`?
- [ ] Answer: does the NUMBER_PATH complete correctly and set `numberPathComplete: true`?
- [ ] Answer: does completing BOTH paths enable the Grand Finale (A12)?
- [ ] Progressive disclosure lockout (3 wrong attempts) -- can the player recover?
- [ ] Magic word gates -- do they accept the correct egg words?

### Must-Test Tonight (critical path)
1. **GDrive sharing permissions** -- Open each of the 8 GDrive links in an incognito browser window. If ANY shows "You need access", fix permissions NOW.
2. **One full playthrough** -- WORD_PATH then NUMBER_PATH then Finale. Takes ~30-40 min. This is non-negotiable.
3. **Touch drag-and-drop** -- Test A11 (SHED) and A107 (Number Lock) on iPad/tablet. These use react-dnd with TouchBackend -- this is the riskiest interaction pattern.
4. **localStorage clear + fresh start** -- After testing, clear localStorage and verify the app shows idle state with 60:00 timer.

---

## 5. FALLBACK PLAN IF GDRIVE VIDEOS DON'T WORK

### Scenario: GDrive iframe shows "Unable to play" or access denied

**Impact:** 8 of the 12 active assignments start with a GDrive video clue. If the videos fail:
- The `MediaPlayer` component renders the GDrive iframe but does NOT have error detection for iframes (there is no `onError` for iframe content failures). The player sees a broken/blank iframe.
- The player must rely on the poem riddle (3rd layer) plus the fallback text.

**Immediate Mitigation (do tonight):**
1. Test all 8 GDrive links in incognito. Fix any permission issues.
2. Consider adding `<link rel="preconnect" href="https://drive.google.com">` to `index.html` (per Code Review S2).

**Morning-of Fallback:**
- If a video doesn't load during gameplay: tell the child "Skip the video, the poem has all the clues you need."
- The progressive disclosure design means the poem riddle layer is always available as the 3rd layer. The child just needs to solve the magic word gate (2nd layer) to reach it.
- All answers are solvable from the poem alone.

**Nuclear Option:**
- If multiple GDrive videos fail: switch to "read aloud" mode. Parent reads the fallback text and poem aloud. Child answers verbally. This preserves the game flow.

### Scenario: No internet at all

The app itself is bundled (config is a static import, not fetched). But YouTube and GDrive iframes require internet.
- All poem riddles, math puzzles, and magic word gates work offline.
- Only the video clue layers break.
- Fallback text is bundled in config and available offline.

---

## 6. MORNING-OF RUNBOOK (Easter Sunday, April 5)

### Phase 1: Setup (6:00-6:30 AM)

1. Open the app on iPad/laptop
2. Clear localStorage: DevTools > Application > Storage > Clear site data
3. Verify: app shows 60:00 timer with START button
4. Quick smoke test: press START, enter hub, tap Word Path, verify first assignment loads
5. Press back, return to hub -- RESET THE GAME (clear localStorage again)
6. Verify WiFi is strong and stable
7. Quick-check 2 GDrive videos load (just check iframe appears)
8. Plug device in to power
9. Have backup device loaded with the app (phone as fallback)
10. Print this runbook and keep it handy

### Phase 2: Physical Setup (6:30-7:00 AM)

11. Hide 20 eggs in the yard
12. Walk the yard and COUNT all 20
13. Verify both locks on shed are locked and functional
14. Set up table for device + egg slips
15. Position camera/phone for photos

### Phase 3: Game Time (when kids are ready)

16. "20 eggs hidden in the yard -- GO!"
17. Let kids hunt (15 min max, help if stuck after 10)
18. Once all 20 found: "Open all eggs, spread the slips out!"
19. "Ready? When I press START, you have 60 minutes!"
20. Press START

### Phase 4: Observer Mode

21. Do NOT give answers. The app has hints and progressive disclosure.
22. If video doesn't load: "Skip it, read the poem instead"
23. If genuinely stuck 5+ minutes: "Re-read the riddle carefully"
24. Take photos at key moments (Code Board reveals, lock openings)
25. If app crashes: refresh browser. State should restore from localStorage.
26. If state is corrupted: open DevTools console, type `localStorage.clear()`, refresh. Start over.

### Phase 5: Finale

27. When "RUN TO THE SHED!" appears -- run with them!
28. Help with combination lock if physically tricky (18-38-18)
29. Help with letter lock if needed (SHED)
30. Capture video of them opening the treasure
31. Celebrate!

### Emergency Contacts (problems with the app)
- Combination code: **18-38-18**
- Word code: **SHED**
- If all digital fails: do the egg hunt, give codes verbally with simplified riddles, still open the treasure. **The physical experience is the real product.**

---

## 7. RISK REGISTER

| ID | Risk | Severity | Likelihood | Mitigation |
|----|------|----------|-----------|------------|
| R1 | GDrive videos blocked/slow on game day | RED | MEDIUM | Test tonight in incognito. Poems are solvable without video. |
| R2 | Family videos (A3, A6, A9) never recorded | YELLOW | N/A | These assignments are NOT in the active playlists. No impact. |
| R3 | Touch drag-and-drop broken on iPad | RED | LOW | Test A11 + A107 on iPad tonight. TouchBackend is included. |
| R4 | WiFi drops during gameplay | YELLOW | LOW | App is bundled. Only videos need internet. Fallback text is offline. |
| R5 | Timer accuracy after tab backgrounding | YELLOW | LOW | Timer uses wall-clock (Date.now() - startedAt). Should be accurate. Test. |
| R6 | Child opens DevTools and sees answers | GREEN | LOW | Spoilers removed from JSX (B4 fixed). Config still has answers but requires deeper digging. |
| R7 | Stale localStorage from previous testing | GREEN | MEDIUM | Morning runbook step 2: clear localStorage. |
| R8 | Progressive disclosure lockout (3 wrong attempts) | YELLOW | MEDIUM | Lockout is by design. Verify the "locked" screen has a path to continue. |
| R9 | Number Lock Assembly -- hardcoded digits [1,8,3,8,1,8] vs config | YELLOW | LOW | TS-4 from audit -- digits are hardcoded but correct. Works for launch. |
| R10 | 5 generic fallback texts provide no useful clue | YELLOW | MEDIUM | If video fails for A101/102/104/105/106, parent reads poem aloud. |

---

## 8. GO/NO-GO DECISION CRITERIA

### GO if:
- [x] All blocking code issues resolved (B1-B6)
- [ ] At least 1 full playthrough completed on target device
- [ ] All 8 GDrive videos verified accessible in incognito
- [ ] Both drag-and-drop assignments work on touch device
- [ ] Physical prep complete (eggs, locks, treasure)
- [ ] localStorage cleared on game-day device

### NO-GO (fallback to paper) if:
- More than 3 GDrive videos are inaccessible AND cannot be fixed
- Drag-and-drop is fundamentally broken on iPad AND no alternative device available
- Build is broken (TypeScript errors, Vite build failure)

---

## 9. TONIGHT'S PRIORITY CHECKLIST (April 4, in order)

1. **TEST GDRIVE VIDEOS** -- Open all 8 links in incognito browser. Fix permissions if needed.
2. **FULL PLAYTHROUGH** -- Word Path (5 assignments) then Number Path (7 assignments) then Finale. On target device.
3. **TOUCH TEST** -- Drag-and-drop A11 + A107 on iPad.
4. **PHYSICAL PREP** -- Print slips, stuff eggs, set locks, stock shed.
5. **IMPROVE FALLBACK TEXT** -- Replace the 5 generic "Watch the video for your clue..." with meaningful hints. (Optional but recommended -- 10 min.)
6. **BUILD VERIFY** -- Run `npm run build` and serve the production build. Test on that.
7. **PREP BACKUP DEVICE** -- Load the app on a phone as fallback.

---

*The treasure hunt happens regardless. The app enhances it; it does not gate it.*
