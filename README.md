# Easter Egg Hunt

A config-driven Easter egg hunt web app for kids. Two physical locks, progressive video/riddle puzzles, drag-and-drop challenges, and a real treasure at the end.

Built with React 19, TypeScript, Tailwind CSS 4, and Zustand.

## How It Works

Kids collect 20 plastic eggs containing number and word slips. The app guides them through puzzles to discover two lock codes:

- **Word Lock** (4 letters) — solved through progressive disclosure: video clue → magic word from eggs → poem riddle → guess the letter
- **Number Lock** (3 pairs) — same format for digits, then drag pairs into correct order

When both locks are cracked, kids run to the physical location and open the treasure!

## Game Flow

```
START → Hub Page (3 locks displayed)
         ├── Word Lock Path (5 assignments → spells a word → returns to hub)
         ├── Number Lock Path (7 assignments → forms a combination → returns to hub)
         └── Both done → OPEN THE TREASURE! → Finale
```

### Progressive Disclosure Assignments

Each puzzle has layers that unlock progressively — kids must try before getting hints:

1. **Video Clue** — a cryptic video (YouTube, Google Drive, or local file)
2. **Magic Word Gate** — solve a riddle, type the answer from egg word slips (unlimited attempts)
3. **Poem Riddle** — a 4-line verse that makes the answer clearer
4. **Answer Input** — always visible, kids can guess at any layer

3 wrong guesses on the final answer = locked forever (with a dramatic skull screen).

### Drag-and-Drop Challenges

- **Word Lock**: drag letters into the correct order to spell the word
- **Number Lock**: drag number pairs into the correct combination order

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` — add `?mode=master` for debug controls.

## Customization

Everything is config-driven. Edit `frontend/src/config/easter-2026-config.json`:

### Lock Codes

```json
"codes": {
  "numberLock": { "values": [18, 38, 18] },
  "wordLock": { "value": "SHED" }
}
```

Change these to match your physical locks.

### Egg Contents

```json
"eggs": {
  "numbers": [23, 37, 42, 56, 64, 71, 85, 92, 47, 87],
  "words": ["WACKY", "GOOFY", "ZIPPY", "SILLY", "BUBBY", "NINJA", "BANJO", "YUMMY", "FUNKY", "JELLY"]
}
```

Print these on slips, put one in each egg. Words are used as magic keys in puzzles; numbers are used in riddles.

### Videos

Each assignment's `video.src` accepts:
- **YouTube**: any URL format (`/watch?v=`, `/shorts/`, `/embed/`, `youtu.be/`)
- **Google Drive**: share link (`/file/d/{id}/view`)
- **Local file**: path relative to `public/` (e.g., `/videos/clue1.mp4`)
- **Empty string**: shows fallback text instead

### Assignment Playlists

Edit `frontend/src/store/gameStore.ts`:

```typescript
const WORD_PATH = [15, 13, 14, 4, 11]    // assignment IDs in play order
const NUMBER_PATH = [101, 102, 104, 105, 106, 103, 107]
```

### Adding New Assignments

Add to the `assignments` array in config with a unique ID. Supported types:
- `progressive_disclosure` — video → magic word → poem → answer
- `shed_reveal` — video + drag letters into word order
- `number_lock_assembly` — drag number pairs into combination order
- `finale` — victory/celebration screen

### Timer

```json
"timer": {
  "durationSeconds": 3600,
  "warningAtSeconds": 600,
  "urgentAtSeconds": 300,
  "softTimeout": true
}
```

Soft timeout means kids can continue without the timer after it expires.

### Master Mode

Add `?mode=master` to the URL. The debug panel lets you:
- Jump to any phase or assignment
- Complete entire paths instantly
- Solve the current assignment
- Reset the game

## Egg Word / Number Riddle Reference

### Word Egg Riddles (used as magic keys)

| Word | Riddle |
|------|--------|
| WACKY | "What word means totally crazy, wild, and out there? '___ Races' is a cartoon!" |
| GOOFY | "Who is Mickey Mouse's tall, clumsy best friend?" |
| ZIPPY | "If something is super-duper fast — like a hummingbird — it's really ___!" |
| SILLY | "What's the opposite of serious? Making funny faces and giggling is being ___" |
| BUBBY | "What's a sweet nickname that sounds like 'baby' but cuter? Rhymes with 'hubby'" |
| NINJA | "A warrior dressed in black who moves in silence and throws stars..." |
| BANJO | "What stringed instrument does Kermit the Frog play while singing on a log?" |
| YUMMY | "What do you say when food tastes SO good you want more?" |
| FUNKY | "What word describes a groovy beat that makes you want to dance? '___ town'" |
| JELLY | "What wiggly, jiggly treat comes in a bowl and wobbles when you poke it?" |

### Number Egg Riddles

| Number | Riddle |
|--------|--------|
| 23 | "What is 15 + 8?" |
| 37 | "Your normal body temperature in Celsius" |
| 42 | "What is 6 x 7?" |
| 56 | "What is 8 x 7?" |
| 64 | "How many squares on a chess board? 8 rows x 8 columns!" |
| 71 | "What is 100 - 29?" |
| 85 | "What is 17 x 5?" |
| 92 | "What is 46 + 46?" |
| 47 | "What is 50 - 3?" |
| 87 | "A piano has 88 keys. Subtract 1." |

## Physical Setup

### The Treasure Chest

- **DIY craft box** from a dollar store (Dollarama, Dollar Tree, etc.)
- Decorate with colourful bedding/tissue paper inside
- Add a flexible stick mirror for extra fun
- Fill with **chocolate eggs**, **gift cards**, and small prizes

### The Three Locks

The game has three physical locks on the chest:

1. **Key Lock** — a padlock with a physical key hidden inside one of the eggs. Two decoy keys in other eggs (only one fits). Kids find the right key by trying all three.
2. **Word Lock** — a letter combination lock (e.g., 4-dial). Set to the word code from the app (default: SHED). The word lock guards the key lock's key — kids must solve the word lock first to access the key.
3. **Number Lock** — a dial combination lock. Set to the number code from the app (default: 18-38-18).

### The Eggs

- **20 plastic eggs** total
- **10 eggs** with number slips: `23, 37, 42, 56, 64, 71, 85, 92, 47, 87`
- **10 eggs** with word slips: `WACKY, GOOFY, ZIPPY, SILLY, BUBBY, NINJA, BANJO, YUMMY, FUNKY, JELLY`
- **3 eggs** also contain keys (1 real + 2 decoys)
- Hide eggs in the yard/house — mix easy and moderate hiding spots

### How It All Connects

```
Kids find eggs → collect slips + 3 keys
         ↓
App: Word Path → discover S, H, E, D → spell SHED
         ↓
Open WORD LOCK with "SHED" → reveals the key lock area
         ↓
Try 3 keys → one fits the KEY LOCK
         ↓
App: Number Path → discover 1, 8, 3, 8, 1, 8 → order pairs → 18-38-18
         ↓
Open NUMBER LOCK with 18-38-18
         ↓
TREASURE CHEST OPENS! 🎁🍫🎉
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| State | Zustand with persist middleware |
| DnD | react-dnd (HTML5 + Touch backends) |
| Icons | Lucide React |
| Confetti | canvas-confetti |

## Deploy

```bash
cd frontend
npm run build
# Upload dist/ to any static host (Vercel, Netlify, nginx, etc.)
```

The app is a static SPA with zero backend dependencies. Videos are loaded via iframe embeds (YouTube/GDrive) or from `public/videos/`.

## License

MIT
