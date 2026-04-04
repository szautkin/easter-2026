# Scope Definition -- Easter 2026 Egg Hunt

**Date:** April 1, 2026
**Go-Live:** April 5, 2026 (Easter Sunday)
**Remaining dev time:** ~3 working days (April 2-4)

---

## Scope Philosophy

Every feature decision filters through one question: **Does this protect or threaten Go-Live on Easter morning?**

The kids do not care about animation polish. They care about:
1. The puzzles working
2. The codes being right
3. The locks opening
4. The treasure being there

Everything else is frosting. Ship the cake first.

---

## MUST HAVE (v1 -- Ships April 5)

These are non-negotiable. If any of these are missing, the experience is broken.

### Core Game Loop
| Feature | Justification |
|---------|---------------|
| Phase 0: 20 riddle card grid with correct answer validation | Gate to the rest of the game |
| Word chip selector for word riddles | Kids cannot type GOOFY on a number pad |
| Number input for number riddles | Core input mechanism |
| 20/20 completion triggers Phase 1 unlock | Phase transition |
| Assignments 1-12 rendering with correct prompts | The puzzles themselves |
| Sequential unlock (N+1 after N) | Pacing and narrative structure |
| Answer validation for all 32 interactions | The game does not work without this |
| Multi-step assignments (1, 7, 8, 9) | 4 of 12 assignments use this pattern |
| Code Board with empty/filled slot display | Progressive reveal is the core mechanic |
| Code Board updates on assignment completion | Players must see their progress |
| Assignment 12 finale screen with both codes | The payoff -- they need the codes! |

### Timer
| Feature | Justification |
|---------|---------------|
| 60:00 countdown from START press | Creates urgency, defines the experience |
| Wall-clock based timing (survives tab switch) | Kids will switch tabs, guaranteed |
| Soft timeout at 0:00 with "keep going" option | Cannot punish children on Easter |
| Timer stops on Assignment 12 completion | Victory moment |

### State Persistence
| Feature | Justification |
|---------|---------------|
| localStorage save after each solved interaction | Browser WILL crash, tab WILL close |
| Resume from last completed state on reload | Kids cannot re-solve 15 riddles |

### Video Integration
| Feature | Justification |
|---------|---------------|
| Video player with play/pause | 3 assignments require video |
| Fallback text when video fails | Game must not be blocked by media issues |

### Responsive Layout
| Feature | Justification |
|---------|---------------|
| Readable and functional on iPad/tablet | Primary device for the event |
| Readable and functional on desktop Chrome | Backup device |

---

## SHOULD HAVE (v1 -- Include if time allows)

These make the experience better but are not deal-breakers if missing.

| Feature | Value | Risk if Cut | Effort |
|---------|-------|-------------|--------|
| Card flip animation on riddle solve | Delight | Kids see checkmark instead of illustration | 2h |
| Code Board "fly-in" reveal animation | Excitement | Values just appear (still functional) | 3h |
| Confetti burst on Phase 0 completion | Celebration moment | Text transition only | 1h |
| Assignment 11 drag-and-drop for SHED | Interactive fun | Replace with text input | 3h |
| Progressive hints on Assignment 11 (30s/60s/90s) | Prevents getting stuck | Parent gives verbal hints | 1h |
| Timer warning state (red pulse at 10:00) | Urgency | Timer stays same color | 30m |
| Timer urgent state ("Hurry up!" at 5:00) | Excitement | No banner, just color | 30m |
| Dot indicators in bottom nav | Navigation clarity | Just Back/Check buttons | 1h |
| Progress bar with phase label | Progress awareness | Kids ask parent how far they are | 1h |
| Video autoplay on assignment load | Seamless flow | Kids tap play button | 30m |
| VTT subtitles for Ukrainian videos | Comprehension | Parent translates verbally | 1h |
| Wrong answer shake animation | Polish | Input just clears | 30m |
| Correct answer yellow flash | Polish | Success message is enough | 30m |
| Poster images for videos | Professional feel | Black rectangle before play | 30m |
| Custom video controls (rewind/replay) | Convenience | Browser default controls | 1h |

---

## COULD HAVE (Post-launch or v1.1)

Nice ideas that are explicitly out of scope for Go-Live.

| Feature | Why Deferred |
|---------|-------------|
| Sound effects (correct ding, wrong buzz, unlock click, fanfare) | Adds complexity, needs audio files, risk of annoying bugs |
| Easter illustration collection (20 unique art pieces) | Need artist/assets; placeholder checkmarks work fine |
| Piano keyboard SVG animation (Assignments 2, 8) | Visual enhancement only; text prompt is sufficient |
| Animated alphabet strip (Assignment 5) | Text display works fine |
| Poem line-by-line animation (Assignments 4, 10) | Full poem display works fine |
| Bunny emoji at progress bar leading edge | Pure polish |
| Assignment-specific success animations | Text messages are enough |
| Encouraging messages rotating on wrong answer | Single message works fine |
| Hint auto-reveal after 3 wrong attempts | Manual hint button is simpler |
| Back navigation to review completed assignments | Focus on forward progress only |
| Landscape-specific optimizations | Portrait/desktop work fine for an hour |

---

## WON'T HAVE (This Release -- Do Not Build)

These have been considered and explicitly rejected for Go-Live.

| Feature | Why Rejected |
|---------|-------------|
| Leaderboard / scoring system | Only 2 players (siblings), not competitive |
| Social sharing / screenshot export | Zero value for a family event; adds complexity |
| Bonus rounds / extra puzzles | 32 interactions in 60 minutes is already a lot |
| Multiplayer / separate devices | Kids share one device at the table |
| Admin panel for puzzle editing | Config JSON is sufficient; only one "admin" (Dad) |
| Account system / login | Single-use app for one family on one morning |
| Analytics / tracking | Adds no value to the experience |
| Accessibility (screen reader, high contrast) | Players are known; no accessibility needs identified |
| Internationalization / multi-language | Fixed audience; Ukrainian content handled by subtitles |
| PWA / offline mode | Device will have WiFi; app serves from localhost or LAN |
| Dark mode | Easter theme is light; event is in the morning |
| Tutorial / onboarding flow | Parent explains in person |
| Undo/redo on answers | Unlimited retries covers this |
| Easter egg counter in UI (how many physical eggs found) | Physical counting is part of the fun; app does not need it |

---

## Scope Change Protocol

For any proposed change between now and April 5:

### To add a Must-Have:
Something is missing from the core game loop. Immediately assess:
1. Can it be built in under 2 hours?
2. Does it block any existing Must-Have?
3. What gets bumped from the schedule?

### To promote a Should-Have to Must-Have:
1. Document why it became critical (was it always critical and miscategorized?)
2. Identify what Should-Have gets demoted to Could-Have to make room
3. Verify it can be completed AND tested before April 4 end of day

### To add a new feature:
1. Default classification: WON'T HAVE
2. To override, the proposer must answer:
   - What breaks without this?
   - How long to build and test?
   - What existing work is delayed?
3. If the answer to "what breaks" is "nothing breaks, it would just be nice" -- it is COULD HAVE at best

### Freeze Date
**April 4, 6:00 PM** -- No code changes after this time. Only critical bug fixes (answer validation wrong, app crash) permitted after freeze. Any fix after freeze must be reviewed on the target device before accepting.

---

## Current Risk Assessment

| Risk | Level | Notes |
|------|-------|-------|
| Video assets not received | RED | Deadline April 3. Fallback text is the mitigation. |
| Core game loop incomplete | YELLOW | 4 days. Prioritize Must-Haves only. |
| Assignment 11 drag-and-drop complexity | YELLOW | If react-dnd integration takes too long, fall back to text input for SHED |
| Assignment 9 table UI complexity | YELLOW | Interactive table is the most complex single component. Simplify to sequential inputs if needed. |
| Testing time insufficient | YELLOW | Full playthrough takes 30 min. Need at least 2 full playthroughs before Go-Live. |
| Lock hardware failure | GREEN | Bought and tested Saturday night |
| Weather for outdoor hunt | GREEN | Indoor backup plan exists |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-01 | Soft timeout instead of hard game-over | Last year's game-over made kids cry. Never again. |
| 2026-04-01 | Video fallback text is a Must-Have | Cannot let Go-Live depend on family in 2 time zones recording video on time |
| 2026-04-01 | Assignment 11 drag-and-drop is Should-Have, not Must-Have | Text input "SHED" achieves the same result with zero react-dnd risk |
| 2026-04-01 | No sound effects for v1 | Audio bugs are disproportionately annoying and hard to debug on mobile |
| 2026-04-01 | No admin panel | Dad edits JSON. This is fine for a 1-event app. |
| 2026-04-01 | Code freeze April 4 6:00 PM | Gives a full evening + morning for final testing on actual device |
