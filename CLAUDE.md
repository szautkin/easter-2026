# Easter Egg Hunt

## Project Overview
Config-driven Easter egg hunt web app for kids (ages 7-12). Hub-and-spoke game with two lock paths (word lock + number lock). Progressive disclosure assignments with video clues, magic word gates, and poem riddles. Drag-and-drop letter/number ordering. Physical treasure hunt finale.

## Tech Stack
- React 19 + TypeScript + Vite 6
- Tailwind CSS 4 (`@import "tailwindcss"` with `@theme` tokens)
- Zustand (state with localStorage persistence + migration)
- react-dnd (drag-and-drop with touch support)
- Lucide React (icons)
- canvas-confetti (celebrations)

## Project Structure
```
frontend/src/
├── App.tsx                          # Shell: header, hub/path routing, timer
├── types.ts                         # All TypeScript interfaces
├── store/gameStore.ts               # Zustand store, path playlists, state machine
├── hooks/useGameConfig.ts           # Config access
├── config/easter-2026-config.json   # ALL game content (customize this!)
├── lib/utils.ts                     # cn(), formatTime(), fireSparkle()
├── components/
│   ├── HubPage.tsx                  # Hub with 3 locks + 2 path tiles
│   ├── AssignmentRouter.tsx         # Routes to assignment components
│   ├── ErrorBoundary.tsx            # Per-assignment crash recovery
│   ├── CountdownTimer.tsx           # 60min countdown
│   ├── ProgressBar.tsx              # Path progress tracking
│   ├── MasterPanel.tsx              # Debug/test panel (?mode=master)
│   ├── CodeBoard.tsx                # Lock code display
│   ├── shared/
│   │   ├── CharacterInput.tsx       # Per-character input cells
│   │   ├── MediaPlayer.tsx          # Video (local, YouTube, Google Drive)
│   │   ├── DraggableItem.tsx        # Reusable DnD tile
│   │   ├── AnimatedLines.tsx        # Staggered poem reveal (memoized)
│   │   └── Confetti.tsx             # Celebration animation
│   └── assignments/
│       ├── ProgressiveDisclosureAssignment.tsx  # Video → magic word → poem → answer
│       ├── A11_ShedReveal.tsx       # Word lock: drag letters into order
│       ├── A12_GrandFinale.tsx      # Victory screen
│       └── NumberLockAssembly.tsx   # Number lock: drag pairs into order
```

## Commands
```bash
cd frontend
npm install    # Install dependencies
npm run dev    # Dev server (http://localhost:5173)
npm run build  # Production build (output: dist/)
```

## Key Patterns
- Path alias: `@/` → `./src/`
- All game content in `easter-2026-config.json` — edit to customize
- Hub-and-spoke: idle → hub → word_path/number_path → hub → complete
- Master mode: add `?mode=master` to URL for debug controls
- localStorage persistence with v2 migration
