# Easter 2026 Egg Hunt

## Project Overview
Interactive Easter egg hunt web app for kids (ages 7-12). 20 intake riddles + 12 main assignments → progressive code reveal → two physical locks (18-38-18 + SHED) → treasure in the shed.

## Tech Stack
- React 19 + TypeScript + Vite 6
- Tailwind CSS 4 (using `@import "tailwindcss"` and `@theme`)
- Zustand (state management with localStorage persistence)
- react-dnd (drag-and-drop for word scramble)
- Framer Motion (animations)
- Lucide React (icons)
- canvas-confetti (celebrations)

## Project Structure
```
frontend/src/
├── App.tsx                    # Main shell: header, code board, router, progress
├── types.ts                   # All TypeScript interfaces
├── store/gameStore.ts         # Zustand store with persist middleware
├── hooks/useGameConfig.ts     # Config access hooks
├── config/easter-2026-config.json  # ALL game content
├── lib/utils.ts               # cn(), formatTime(), normalizeAnswer()
├── components/
│   ├── shared/                # Reusable: CharacterInput, MediaPlayer, etc.
│   ├── assignments/           # A01-A12 assignment components
│   ├── CodeBoard.tsx          # Lock code display
│   ├── CountdownTimer.tsx     # 60min countdown
│   ├── ProgressBar.tsx        # Phase + completion tracking
│   ├── EggIntake.tsx          # Phase 0: 20 riddle cards
│   ├── RiddleCard.tsx         # Single intake riddle
│   └── AssignmentRouter.tsx   # Phase/assignment switching
```

## Key Patterns
- Path alias: `@/` → `./src/`
- All game content is config-driven via `easter-2026-config.json`
- State persists to localStorage via Zustand persist middleware
- Assignments lazy-loaded via React.lazy
- Custom Tailwind theme with `--color-blue-primary`, `--color-yellow-accent`, etc.

## Commands
```bash
cd frontend
npm run dev    # Dev server
npm run build  # Production build
npx tsc --noEmit  # Type check
```

## Documentation
- `project_info/` — user stories, ADRs, progress, agent assignments
- `dev_info/` — game design plan, config JSON
