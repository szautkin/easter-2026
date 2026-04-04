---
name: Easter 2026 — Project Context
description: Core facts about the Easter 2026 app: tech stack, design system tokens, known bugs found at pre-launch review
type: project
---

Easter 2026 is a family Easter egg hunt game app. A child navigates a multi-step puzzle hunt (word lock + number lock + egg key), ultimately opening a physical yellow chest.

**Tech stack:** React + TypeScript, Tailwind CSS v4.2, Vite 8, canvas-confetti, react-dnd (HTML5 + Touch backends)

**Go-live date:** 2026-04-02

**Why:** Personal family project — the audience is young children (estimated age 5–9), so touch targets, haptics, and emotional delight are all load-bearing UX concerns, not nice-to-haves.

**How to apply:** Prioritise child-appropriate interaction patterns. Assume mobile-first (likely an iPad or parent's phone). Any new animations or interactions should feel magical, not overwhelming.

---

**Design token summary (from `src/index.css`):**
- `--color-blue-primary: #1B4F8A` — primary brand, nav, buttons, headings
- `--color-blue-light: #85B7EB` — borders, secondary accents
- `--color-blue-tint: #EFF6FF` — page background, answer section bg
- `--color-yellow-accent: #FCD34D` — CTA buttons, revealed letter tiles, key moments
- `--color-yellow-tint: #FFFBEB` — riddle box bg, subtle highlight
- `--color-success: #22C55E` — solved/unlocked states
- `--color-error: #EF4444` — wrong answer, locked-forever screen
- `--font-display: "Fredoka"` (with Nunito fallback)

**Animations defined in CSS:**
- `animate-shake` (0.5s) — wrong answer, last-chance warning
- `animate-flip` (0.6s) — card flip
- `animate-pop` (0.3s, spring cubic-bezier) — entrance reveal
- `animate-float` (3s infinite) — ambient decoration, hub emojis
- `animate-pulse-soft` (2s infinite) — subtle breath on urgent states

---

**Known bugs found in pre-launch review (2026-04-01):**

1. **CRITICAL: Fredoka font not loaded.** `index.html` has no Google Fonts link. System font will render instead, killing the Easter aesthetic.
2. **CRITICAL: `border-3` not a valid TW v4 utility.** In TW v4 `border-3` resolves via spacing scale to 0.75rem = 12px. Affects: HubPage CTA button, A11 success tiles, A12 finale tiles. Should be `border-[3px]`.
3. **CountdownTimer dead colour branch.** Both the warning and non-warning states resolve to `text-yellow-accent`. Normal state should be `text-blue-primary` to distinguish it from the warning signal.

**How to apply:** Before suggesting any new TW classes, verify they exist in v4's scale. Prefer `border-[Npx]` over `border-N` for non-standard widths. Always check that `index.html` loads any fonts referenced in CSS.
