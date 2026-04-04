---
name: Config Integrity — Assignments & Answers
description: Verified answer math, ID-to-playlist mapping, and lock codes as of 2026-04-01 pre-launch review
type: project
---

Config file: `src/config/easter-2026-config.json`

**Lock codes (verified correct):**
- Number lock: `18 – 38 – 18` (config: `codes.numberLock.values: [18, 38, 18]`)
- Word lock: `SHED` (config: `codes.wordLock.value: "SHED"`)

**All playlist IDs confirmed present in config as of 2026-04-01:**
- Word path IDs: 4, 11, 13, 14, 15
- Number path IDs: 101, 102, 103, 104, 105, 106, 107
- Finale ID: 12

**Math chains verified:**
- Egg Sum (id 1): 604 → 10 → 1 (digit 1) — CORRECT
- Piano scale (id 2): 8 keys — CORRECT
- N-count (id 3): NINJA, BANJO, FUNKY = 3 — CORRECT
- Semitones (id 8): 12+5+1 = 18 — CORRECT
- Cousin calc (id 9): 32 cousins + 6 family = 38 — CORRECT
- Mirror riddle (id 10): third number = 18 — CORRECT

**Known hardcode:** `NumberLockAssembly.tsx` hardcodes digit display `[1,8,3,8,1,8]` in JSX — not read from config. A config value change would require a code change too.

**Why:** Verified during final go/no-go review before Easter 2026-04-05.
**How to apply:** If lock codes change in config, also update `NumberLockAssembly.tsx` hardcoded display.
