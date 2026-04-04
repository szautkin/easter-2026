---
name: Design System — Theme Tokens & Patterns
description: Tailwind/Shadcn token conventions and component patterns confirmed in codebase
type: project
---

**Theme tokens in use (all confirmed, no hard-coded hex found):**
- `bg-blue-primary` / `text-blue-primary` — primary brand color
- `bg-blue-tint` — light background tint (used on page bg and inner cards)
- `text-blue-light` / `border-blue-light` — subtle/muted blue
- `bg-yellow-accent` / `text-yellow-accent` — accent/highlight (letter tiles, CTA buttons)
- `bg-yellow-tint` — soft yellow background for riddle cards
- `bg-success` / `text-success` — correct/complete states
- `text-error` / `bg-error` — wrong answer states
- `text-text-secondary` / `text-text-primary` — body text hierarchy
- `shadow-card` / `shadow-card-hover` — elevation utilities

**Component patterns:**
- Rounded corners: `rounded-2xl` for cards, `rounded-xl` for buttons, `rounded-lg` for inputs
- Button pattern: `px-8-10 py-3-4 rounded-xl font-bold text-lg bg-blue-primary text-white hover:bg-blue-primary/90 shadow-card transition-all hover:scale-105 active:scale-95`
- CTA (treasure/unlock): `bg-yellow-accent text-blue-primary border-2 border-blue-primary`
- Card: `bg-white rounded-2xl shadow-card p-5`

**Animations:** `animate-float`, `animate-pop`, `animate-shake`, `animate-pulse-soft` — custom utilities defined elsewhere

**Touch DnD:** Both `A11_ShedReveal` and `NumberLockAssembly` use `isTouchDevice` guard to switch `react-dnd` backend. Pattern: `isTouchDevice ? TouchBackend : HTML5Backend`.

**Layout:** `min-h-dvh` (not `min-h-screen`) used for iOS dynamic viewport safety.

**Why:** Audit confirmed zero hex values; these are the canonical tokens to use.
**How to apply:** Never introduce hex colors. Always map to one of the tokens above or request a new theme extension.
