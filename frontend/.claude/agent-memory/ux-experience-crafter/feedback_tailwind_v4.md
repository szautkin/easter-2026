---
name: Tailwind v4 — border-N utility behaviour
description: In TW v4, border-{N} uses the spacing scale (0.25rem × N), NOT pixel values. border-3 = 12px, not 3px.
type: feedback
---

In Tailwind v4 (this project uses v4.2.2), `border-{N}` utilities map to `calc(var(--spacing) * N)` where `--spacing: 0.25rem`. This means:
- `border-3` = 0.75rem = **12px** (not 3px as in TW v3)
- `border-4` = 1rem = **16px** (not 4px)

**Why:** TW v4 unified the utility generation around the spacing scale. The old TW v3 border-width scale (0, 1, 2, 4, 8) no longer exists as a separate named scale.

**How to apply:** Always use arbitrary values for non-standard border widths: `border-[3px]`, `border-[2px]` etc. `border-2` (0.5rem = 8px) and `border-4` (1rem = 16px) are valid but represent much thicker borders than their v3 equivalents. When reviewing code that uses `border-N`, verify the rendered pixel value is intentional.
