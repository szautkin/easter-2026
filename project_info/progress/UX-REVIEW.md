# UX Review — Easter 2026 — Pre-Go-Live Audit
**Reviewed:** 2026-04-01
**Reviewer:** The Experience Crafter
**Scope:** Visual polish and UX quality review for go-live on 2026-04-02

---

## Summary

The app is largely solid. The token system is coherent, animations are purposeful, and the component structure is clean. There are **3 MUST-FIX issues** that could cause visible rendering problems or broken interactions on launch day, and **6 NICE-TO-HAVE** items that would meaningfully raise the quality bar given the time available.

---

## MUST-FIX Issues

---

### [MUST-FIX 1] Font "Fredoka" is not loaded — system fallback will render instead

**File:** `index.html`

**Problem:** `index.css` declares `--font-display: "Fredoka", "Nunito", system-ui, sans-serif` and `html { font-family: var(--font-display) }`, but `index.html` has no Google Fonts `<link>` tag. There is no `preconnect` to `fonts.googleapis.com` or `fonts.gstatic.com` either. The browser will silently fall through to `system-ui` (San Francisco on iOS, Roboto on Android), and the whole playful-Easter aesthetic collapses.

**Fix:** Add to `<head>` in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;700;800&display=swap"
  rel="stylesheet"
/>
```

The `display=swap` parameter is critical — it ensures text renders in the fallback font immediately, then swaps when Fredoka loads, so kids never stare at invisible text.

**Estimated fix time:** 2 minutes.

---

### [MUST-FIX 2] `border-3` is not a valid Tailwind v4 utility — borders will be 12px thick

**Files:** `HubPage.tsx` (line 215), `A12_GrandFinale.tsx` (line 68), `A11_ShedReveal.tsx` (line 80)

**Problem:** Tailwind v4 does not define a `border-3` step in its border-width scale (unlike v3 which hard-coded `3px`). In v4 the `border-{n}` utilities map to `calc(var(--spacing) * n)` = `calc(0.25rem * 3)` = **12px**. The affected elements are: the "OPEN THE YELLOW CHEST" CTA button, the word-lock letter tiles in the finale, and the word-lock success tiles in the shed reveal. All three will render with grotesquely thick borders and broken layouts on the child's screen.

**Fix:** Replace all three instances with the arbitrary value `border-[3px]`:

In `HubPage.tsx` line 215, change:
```
border-3 border-blue-primary
```
to:
```
border-[3px] border-blue-primary
```

In `A12_GrandFinale.tsx` line 68, change:
```
border-3 border-blue-primary
```
to:
```
border-[3px] border-blue-primary
```

In `A11_ShedReveal.tsx` line 80, change:
```
border-3 border-blue-primary shadow-lg
```
to:
```
border-[3px] border-blue-primary shadow-lg
```

**Estimated fix time:** 5 minutes (three targeted edits, then verify in browser).

---

### [MUST-FIX 3] CountdownTimer color logic has a dead branch — the non-warning state never applies its colour rule

**File:** `CountdownTimer.tsx` lines 22–29

**Problem:** The `cn()` call applies color classes in this order:
1. `isUrgent` → `text-error animate-pulse-soft`
2. `isWarning && !isUrgent` → `text-yellow-accent`
3. `!isWarning` → `text-yellow-accent`

Both branches 2 and 3 resolve to `text-yellow-accent`, so the timer is always yellow-accented (or red when urgent). The `!isWarning` guard was presumably meant to apply a neutral/calm colour during normal time, making it feel distinct from the warning state. As-is, the timer is permanently yellow, which dilutes the warning signal — yellow stops meaning "caution" if it's always yellow.

**Fix:** Give the normal state a distinct, calm colour. `text-blue-primary` reads as informational and matches the nav chrome:

```tsx
<div
  className={cn(
    'flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xl font-bold transition-colors',
    isUrgent && 'text-error animate-pulse-soft',
    isWarning && !isUrgent && 'text-yellow-accent',
    !isWarning && 'text-blue-primary',   // calm, informational state
  )}
>
```

**Estimated fix time:** 2 minutes.

---

## NICE-TO-HAVE Items

---

### [NICE-TO-HAVE 1] No `prefers-reduced-motion` override anywhere in the codebase

**File:** `index.css`

**Problem:** The app uses `animate-shake`, `animate-float`, `animate-pop`, `animate-pulse-soft`, and canvas-confetti. No `@media (prefers-reduced-motion: reduce)` block exists. This is an accessibility gap and also an App Store / Play Store compliance item.

**Fix:** Add to the bottom of `index.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This single block disables all CSS animations for users who opt out, without touching any component code. The canvas-confetti in `Confetti.tsx` would still fire — if time allows, wrap the `requestAnimationFrame` loop with `window.matchMedia('(prefers-reduced-motion: reduce)').matches` guard.

**Estimated fix time:** 5 minutes for CSS block; 10 minutes to also cover Confetti.

---

### [NICE-TO-HAVE 2] Video iframes have no loading skeleton — kids see a black box while the iframe initialises

**File:** `MediaPlayer.tsx` (Google Drive and YouTube branches, lines 89–120)

**Problem:** The Google Drive and YouTube code paths render a raw `<iframe>` with `bg-black` behind it. On a slow mobile connection, children stare at a black rectangle for several seconds with no feedback. The native `<video>` path has a `poster` prop and an `onError` fallback, but iframes have neither.

**Fix:** Wrap each iframe in a relative container with an animated shimmer overlay that hides once the iframe fires its `onLoad` event:

```tsx
const [iframeLoaded, setIframeLoaded] = useState(false)

// Inside the iframe wrapper div, add:
{!iframeLoaded && (
  <div className="absolute inset-0 bg-blue-tint animate-pulse-soft flex items-center justify-center rounded-2xl">
    <span className="text-4xl">🎬</span>
  </div>
)}
<iframe
  ...
  onLoad={() => setIframeLoaded(true)}
/>
```

The `animate-pulse-soft` token already exists in the theme — no new animation needed.

**Estimated fix time:** 10 minutes.

---

### [NICE-TO-HAVE 3] Grand Finale celebration is underweight — the victory screen undersells the moment

**File:** `A12_GrandFinale.tsx`

**Problem:** The finale shows: title, number lock display, word lock tiles, instruction box, time elapsed, four floating emojis. The confetti fires. But the emotional arc of "you did it!" relies entirely on canvas-confetti, which renders offscreen. The on-page components themselves are static — they pop in with `animate-pop` but then sit still. For a child who just solved a multi-step puzzle, the screen needs to feel alive for longer than the initial entrance.

**Suggestions (pick one or two, ~10 min total):**

1. Add `animate-float` to the celebration emoji row — it already exists in the token set:
   ```tsx
   // Change each span to stagger the float
   <span className="animate-float" style={{ animationDelay: '0s' }}>🐰</span>
   <span className="animate-float" style={{ animationDelay: '0.4s' }}>🎁</span>
   <span className="animate-float" style={{ animationDelay: '0.8s' }}>🍫</span>
   <span className="animate-float" style={{ animationDelay: '1.2s' }}>🏆</span>
   ```
   (The current code applies `animate-float` to the entire `<div>`, making all four move in lockstep. Staggering individual elements creates depth.)

2. Add a second confetti burst at the 2-second mark using a delayed `useEffect` with a fresh short-duration call. The current burst fires at mount and trails off — a second wave at the reveal moment reinforces the two-phase structure (`showFull` becoming true).

3. Increase the `Confetti` `duration` prop from `6000` to `8000` — the current 6 seconds ends before a slow reader finishes reading the instruction block.

**Estimated fix time:** 5–10 minutes depending on scope.

---

### [NICE-TO-HAVE 4] `CharacterInput` boxes are 56×64px — borderline for small children's fingers

**File:** `CharacterInput.tsx` line 89

**Problem:** Each character input box is `w-14 h-16` = 56px × 64px. The WCAG 2.5.5 recommended touch target minimum is 44×44px, so these technically pass. However, for children aged roughly 5–9 (the implied audience), motor precision is lower than adults. The current size is workable but snug when four boxes are side-by-side on a 375px iPhone SE viewport. At 4 boxes × 56px + 3 gaps × 8px = 248px, there's comfortable room to go to `w-16 h-16` (64×64px) which gives more forgiveness without overflowing.

**Fix:** In `CharacterInput.tsx` line 89, change `w-14 h-16` to `w-16 h-16`:
```tsx
'w-16 h-16 text-center text-3xl font-bold rounded-xl border-2 outline-none transition-all duration-200 font-mono',
```

4 boxes × 64px + 3 gaps × 8px = 280px — still fits within a 375px screen with padding.

**Estimated fix time:** 2 minutes.

---

### [NICE-TO-HAVE 5] `AnimatedLines` poem reveals have no haptic feedback at each line appearance

**File:** `AnimatedLines.tsx`

**Problem:** Each poem line fades in every 800ms. This is a lovely theatrical moment — the riddle revealing itself line by line. On mobile, adding a subtle haptic tap at each line reveal would make the reveal feel tactile and magical, reinforcing the "discovering a secret" emotional tone without requiring any visual change.

**Fix:** Add to the `useEffect` in `AnimatedLines.tsx`:

```tsx
useEffect(() => {
  if (visibleLines >= lines.length) return
  const timer = setTimeout(() => {
    setVisibleLines((v) => v + 1)
    // Subtle haptic tap on each poem line reveal
    if ('vibrate' in navigator) {
      navigator.vibrate(30)  // 30ms: a single soft tap, not intrusive
    }
  }, 800)
  return () => clearTimeout(timer)
}, [visibleLines, lines.length])
```

The 30ms pattern is intentionally minimal — it confirms the reveal without becoming annoying across multiple poem lines. No visual fallback needed since this is purely additive.

**Estimated fix time:** 3 minutes.

---

### [NICE-TO-HAVE 6] The `MagicWordContent` submit button is emoji-only with no accessible label

**File:** `ProgressiveDisclosureAssignment.tsx` line 74–85

**Problem:** The submit button inside `MagicWordContent` renders as `🔑` with no `aria-label`. Screen readers will announce "key emoji" or nothing useful. The input adjacent to it has `aria-label="Magic word"` (good), but the paired button needs a label too.

**Fix:** Add `aria-label` to the button:

```tsx
<button
  onClick={handleSubmit}
  disabled={!input.trim()}
  aria-label="Submit magic word"
  className={...}
>
  🔑
</button>
```

**Estimated fix time:** 1 minute.

---

## What Is Working Well

These do not need changes — noting them so the team knows what to preserve:

- **Token consistency is strong.** All components use `text-blue-primary`, `bg-yellow-accent`, `text-success`, `text-error` correctly. No hardcoded hex values found in component files. The design system is doing its job.
- **`transition-all` is applied consistently** across interactive elements (26 occurrences), giving the UI a polished, responsive feel.
- **iOS zoom prevention is correctly handled.** `font-size: 16px` on inputs in `index.css` and `maximum-scale=1.0` in the viewport meta tag together prevent the iOS auto-zoom on input focus. This is easy to miss and was done right.
- **`-webkit-tap-highlight-color: transparent`** is set globally — removes the grey flash on tap that makes mobile web apps feel cheap.
- **`DraggableItem` touch support** is handled via the `isTouchDevice` flag and `TouchBackend` — the drag-and-drop will work on iPads and phones out of the box.
- **`MediaPlayer` error handling** is solid — the `hasError` state falls back to `video.fallbackText` gracefully.
- **`AnimatedLines` is memoised** with `React.memo` — the poem reveal won't re-render on parent state changes.
- **`LockedScreen`** uses `bg-red-950` and `border-red-600` for genuine dramatic effect. The emotional design of "sealed in darkness" is effective.

---

## Prioritised Fix Order for Tomorrow Morning

| Priority | Issue | File | Time |
|---|---|---|---|
| 1 | Add Google Fonts link for Fredoka | `index.html` | 2 min |
| 2 | Fix `border-3` → `border-[3px]` (3 files) | `HubPage`, `A11`, `A12` | 5 min |
| 3 | Fix CountdownTimer dead colour branch | `CountdownTimer.tsx` | 2 min |
| 4 | Add `prefers-reduced-motion` CSS block | `index.css` | 5 min |
| 5 | Stagger finale emoji floats | `A12_GrandFinale.tsx` | 3 min |
| 6 | Add `aria-label` to magic word submit | `ProgressiveDisclosureAssignment.tsx` | 1 min |
| 7 | Touch target: `w-14` → `w-16` on CharacterInput | `CharacterInput.tsx` | 2 min |
| 8 | Poem line haptics | `AnimatedLines.tsx` | 3 min |
| 9 | iframe loading skeleton | `MediaPlayer.tsx` | 10 min |

Total MUST-FIX: ~9 minutes.
Total NICE-TO-HAVE: ~24 minutes.
**Full list if starting fresh: ~33 minutes.**
