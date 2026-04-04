# ADR-003: Assignment Component Architecture

## Status
Accepted

## Context
12 assignments span 7+ puzzle types: math, piano, video question, poem riddle, chain logic, name table, anagram, finale. Each has different inputs, media, and step counts. Need a consistent pattern without over-abstraction.

## Decision

### Base Pattern
All assignments use `AssignmentLayout` wrapper which provides:
- 2-column layout (media left, question right) on desktop
- Stacked layout on mobile
- Consistent header with assignment number and title
- Bottom nav integration

### Assignment Types → Component Mapping

| Type | Component Pattern | Input |
|------|------------------|-------|
| `single_answer` | Prompt + CharacterInput | number or letter |
| `multi_step_math` | Sequential steps, advance on correct | CharacterInput per step |
| `video_question` | MediaPlayer + prompt after video | CharacterInput |
| `poem_riddle` | Animated poem lines + prompt | single CharacterInput |
| `chain_logic` | Animated strip + prompt | CharacterInput |
| `video_table_math` | MediaPlayer + interactive table + followup | table inputs + final |
| `anagram` | DnD letter tiles + progressive hints | drag-and-drop |
| `finale` | Celebration screen, confetti | none (auto) |

### Shared Behaviors (handled by AssignmentLayout/hooks)
- Wrong answer: shake animation + encouraging message
- Correct answer: success animation + code board update
- All assignments read config from `easter-2026-config.json` via `useGameConfig` hook
- Progressive hints via `HintSystem` component (timer-based unlock)

## Consequences
- Each assignment is a focused component ~50-150 lines
- Shared components handle all common UX patterns
- Config-driven content makes riddle text easy to update
- New assignment types can be added without modifying shared infra
