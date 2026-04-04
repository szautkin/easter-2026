---
name: Assignments 1-7 Component Patterns
description: Phase 1-2 assignment components (A01-A07) built with shared patterns for answer checking, step progression, and solve flow
type: project
---

Assignments 1-7 (Phase 1 digit discovery + Phase 2 letter discovery) are complete at `src/components/assignments/`.

**Why:** These are the first 7 of 12 interactive puzzles in the Easter 2026 egg hunt app. Each reveals a digit or letter toward the final lock codes (18-38-18 and SHED).

**How to apply:**
- All assignments follow a consistent pattern: useAssignment(id), useGameStore selectors, handleCheck with solveAssignment + revealCode on success, incrementAttempts on failure
- Multi-step assignments (A01, A07) use advanceAssignmentStep from the store and track currentStep
- Video assignments (A03, A06) gate the question behind an onVideoEnd callback from MediaPlayer
- The solved state renders a centered success view with Confetti component
- Error state uses 600ms timeout before clearing the shake animation
- A04 has a subtle "shed" highlight easter egg in the poem (underline with yellow-accent)
