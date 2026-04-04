---
name: Known Issues & Post-Launch Backlog
description: Non-blocking issues identified at 2026-04-01 go/no-go review, deferred post-Easter
type: project
---

**1. LOCKED FOREVER skull screen (ProgressiveDisclosureAssignment.tsx, LockedScreen component)**
- Uses dark red palette (`bg-red-950`, `text-red-500`), skull emoji 💀, and "sealed in darkness" copy.
- Fires after 3 wrong attempts on a single letter in progressive disclosure assignments.
- Age-appropriate concern for 7-12 audience; intentionally dramatic but survivable.
- Post-launch: soften to a friendly "scrambled egg" metaphor. Keep mechanical penalty.

**2. Egg Key card accidental dismissal (HubPage.tsx)**
- Tapping the Egg Key card immediately calls `markEggKeyFound()` with no confirmation.
- A child could accidentally dismiss it before physically finding the physical egg key.
- Post-launch: add a confirmation dialog or require a physical code scan.

**3. NumberLockAssembly.tsx hardcoded digit display**
- Line 110: `[1, 8, 3, 8, 1, 8].map(...)` is JSX-hardcoded, not read from config.
- If lock code changes, this JSX must also change.
- Post-launch: read digits from `assignment.digits` (already in config as `assignment 107`).

**Why:** These were reviewed and accepted as non-blockers for Easter 2026-04-05.
**How to apply:** Prioritize for the 2027 rebuild iteration.
