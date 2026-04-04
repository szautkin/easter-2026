# US-003: Video Integration (Grandparent Video Questions)

## As a player (child, age 7-12)
## I want to watch video messages from my grandparents and family asking me puzzle questions
## So that the hunt feels personal, connected to family abroad, and emotionally meaningful

---

## Overview

Three of the 12 main assignments feature pre-recorded video messages from family members in Italy and Ukraine. The videos serve a dual purpose: they deliver puzzle questions AND create an emotional family connection that makes the Easter experience memorable beyond the game mechanics.

**Video assignments:**
- Assignment 3: Grandma Juliaa (Italy) -- "How many egg words contain the letter N?"
- Assignment 6: Grandma Vera + Grandpa Tolia (Poltava, Ukraine) -- "What letter do Easter and Eggs start with?"
- Assignment 9: Aunt Katiia or cousins (Poltava, Ukraine) -- "Count letters in cousin names and add them up!"

---

## Acceptance Criteria

### Video Playback

- [ ] AC-001: Video player renders in the media area (left column on desktop, top section on mobile)
- [ ] AC-002: Video autoplays when the assignment loads (muted initially if browser blocks autoplay -- show prominent play button)
- [ ] AC-003: Custom controls overlay: Rewind 10s, Play/Pause toggle, Replay (restart from 0), styled as circular buttons
- [ ] AC-004: Video plays from bundled local files (`public/videos/`), no external streaming dependency
- [ ] AC-005: After video ends, the question panel on the right becomes interactive (answer input enables)
- [ ] AC-006: Player can replay the video at any time, even after answering
- [ ] AC-007: Video poster image displays before playback starts

### Subtitle Support

- [ ] AC-008: Ukrainian-language videos (Assignments 6, 9) display VTT subtitle tracks
- [ ] AC-009: Subtitles are enabled by default for Ukrainian videos
- [ ] AC-010: Subtitle text is large enough to read on mobile (minimum 16px equivalent)

### Fallback Behavior

- [ ] AC-011: If video file fails to load (corrupt, missing, format issue), a fallback text overlay appears with the question text from `config.assignments[].video.fallbackText`
- [ ] AC-012: Fallback text is displayed over a static poster image if available
- [ ] AC-013: If no poster image exists, fallback shows text on a themed background
- [ ] AC-014: Fallback mode still enables the question input (game is not blocked by video failure)

### Assignment-Specific Behavior

- [ ] AC-015: Assignment 3 -- After video, input is a single number field. Answer: 3
- [ ] AC-016: Assignment 6 -- After video, input is a single letter field. Answer: E
- [ ] AC-017: Assignment 9 -- After video, an interactive name-letter counting table appears. Each cousin name has an input field for letter count. After all 5 are correct (6+7+6+7+6=32), a final addition step appears (32+6=38). Answer: 38

### Performance

- [ ] AC-018: Videos compressed to under 10MB each via ffmpeg (`-crf 28 -preset slow`)
- [ ] AC-019: Videos do not auto-download until the assignment is reached (lazy loading)
- [ ] AC-020: Video playback is smooth on target devices (iPad, mid-range Android tablet, desktop Chrome)

---

## Technical Notes

- **Video source paths:** Defined in `config.assignments[].video.src` -- relative paths like `/assets/videos/grandma_juliaa.mp4`
- **Storage:** Videos bundled in `public/videos/` directory, served as static assets by Vite
- **Compression:** `ffmpeg -i input.mov -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k output.mp4`
- **Subtitles:** WebVTT format (.vtt files), referenced in `config.assignments[].video.subtitles`
- **Component:** `VideoPlayer.tsx` (or `MediaPlayer.tsx` shared component) handles playback, controls, fallback
- **Autoplay policy:** Modern browsers block autoplay with sound. Implementation should attempt autoplay, and if blocked, show a large centered Play button overlay. After first user interaction, subsequent videos can autoplay.
- **Assignment 9 special case:** This is `video_table_math` type -- combines video player with an interactive counting table. The table rows come from `config.assignments[8].table.rows[]`

---

## Dependencies

| Dependency | Type | Status |
|-----------|------|--------|
| Video from Grandma Juliaa (Italy) | Asset | NOT YET RECORDED |
| Video from Grandma Vera + Grandpa Tolia (Poltava) | Asset | NOT YET RECORDED |
| Video from Aunt Katiia or cousins (Poltava) | Asset | NOT YET RECORDED |
| VTT subtitle files for Ukrainian videos | Asset | Needed after video recording |
| `VideoPlayer.tsx` / `MediaPlayer.tsx` component | Code | Needed |
| Poster images for each video | Asset | Needed |
| `ffmpeg` compression pipeline | Tooling | Available |
| Fallback text in config | Data | Done |

---

## CRITICAL RISK: Video Asset Availability

**Status: RED -- BLOCKER potential**

Today is April 1. Easter is April 5. The plan states video recording deadline is "April 5 at latest" -- this is the same day as the event. This is unacceptable for Go-Live confidence.

**Revised deadline:** Videos must be received by **April 3 (Friday)** to allow time for:
- Compression and format conversion (1 hour)
- Subtitle creation for Ukrainian videos (1 hour)
- Integration testing in the app (1 hour)
- Buffer for re-recording if quality is poor

**Mitigation:** Fallback text mode (AC-011 through AC-014) MUST be implemented and tested independently of video availability. If videos are not received by April 3, the app ships with fallback text and videos are added as a hot-patch if they arrive April 4.

---

## Video Recording Specifications (for family)

| Video | Who | Language | Duration | Content |
|-------|-----|----------|----------|---------|
| 1 | Grandma Juliaa | English or Ukrainian | 30-45s | Greet kids by name, ask about counting egg words with letter N, blow a kiss |
| 2 | Grandma Vera + Grandpa Tolia | Ukrainian (subtitled) | 30-45s | Say "Khristos Voskres!", ask about Easter/Eggs starting letter, wave |
| 3 | Aunt Katiia or cousins | Ukrainian (subtitled) | 30-45s | Greet kids, ask to count letters in cousin names and add family count, cheer |

**Recording instructions:**
- Landscape orientation
- Good lighting (near a window)
- Quiet background
- Send via WhatsApp or Telegram

---

## Test Scenarios

1. **Happy path (with video):** Video plays, ends, question input enables, correct answer accepted
2. **Happy path (fallback):** Video file missing -- fallback text displays, question input still works
3. **Autoplay blocked:** Browser blocks autoplay -- large Play button appears, tapping it starts video
4. **Replay:** After answering correctly, tap Replay -- video plays again from start
5. **Rewind:** During video, tap Rewind -- video jumps back 10 seconds
6. **Subtitles (Assignment 6):** Ukrainian video plays with English subtitles visible by default
7. **Assignment 9 table:** After video, fill in name letter counts: verify 6+7+6+7+6=32, then 32+6=38
8. **Assignment 9 wrong table entry:** Enter 5 for "Andrii" (correct is 6) -- verify rejection at table level
9. **Mobile layout:** Video stacks above question on portrait phone -- verify both are visible without excessive scrolling
10. **Large video file:** Test with an uncompressed video -- verify the app still functions (may be slow but should not crash)
