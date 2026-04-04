# Easter 2026 Egg Hunt — Master Plan v2

> **Builds on:** `zss1980/easter-puzzle` (React 19 + TypeScript + Vite + react-dnd)
> **Last year:** 5 jigsaw puzzles → hint words → 5-char code `231WC` → scrollable selectors → one-shot SUBMIT
> **This year:** 12 mixed-type assignments → progressive code reveal → two locks (number + word)

---

## Final Codes

| Lock | Type | Code | Entry Method |
|------|------|------|-------------|
| Lock 1 | Combination (physical lock on shed) | **18 – 38 – 18** | Three 2-digit scrollable selectors |
| Lock 2 | Word (letter lock on shed) | **SHED** | Four letter scrollable selectors |

---

## Egg Contents (20 plastic eggs, hidden Sunday morning)

Each egg has ONE slip of paper — either a number or a word. No pairing between them.

| Egg Type | Count | Contents |
|----------|-------|----------|
| Number eggs | 10 | 23, 37, 42, 56, 64, 71, 85, 92, 47, 87 |
| Word eggs | 10 | WACKY, GOOFY, ZIPPY, SILLY, BUBBY, NINJA, BANJO, YUMMY, FUNKY, JELLY |

The numbers and words are independent raw materials — different puzzles use them in different ways.

---

## Phase 0 — Egg Registration (20 Mini-Riddles)

After collecting all 20 eggs, kids open them and spread the slips on the table. The app shows 20 riddle cards. For each riddle, kids figure out which egg slip matches, then enter it. Card lights up green when correct.

**UI:** Grid of 20 cards (scrollable on mobile). Each card shows a riddle, an input, and ✅ when solved. Progress bar: "14/20 eggs registered." All 20 must be solved before the 12 main assignments unlock.

### Word Egg Riddles (10)

| # | Riddle | Answer |
|---|--------|--------|
| W1 | "Who is Mickey Mouse's tall, clumsy best friend? He trips a lot and laughs funny!" | **GOOFY** |
| W2 | "A warrior dressed in black who moves in silence and throws stars..." | **NINJA** |
| W3 | "What stringed instrument does Kermit the Frog play while singing on a log?" | **BANJO** |
| W4 | "What do you say when food tastes SO good you want more?" | **YUMMY** |
| W5 | "What wiggly, jiggly treat comes in a bowl and wobbles when you poke it?" | **JELLY** |
| W6 | "What word means totally crazy, wild, and out there? '___ Races' is a cartoon!" | **WACKY** |
| W7 | "If something is super-duper fast — like a hummingbird — it's really ___!" | **ZIPPY** |
| W8 | "What's the opposite of serious? Making funny faces and giggling is being ___" | **SILLY** |
| W9 | "What's a sweet nickname that sounds like 'baby' but cuter? Rhymes with 'hubby'" | **BUBBY** |
| W10 | "What word describes a groovy beat that makes you want to dance? '___ town'" | **FUNKY** |

### Number Egg Riddles (10)

| # | Riddle | Type | Answer |
|---|--------|------|--------|
| N1 | "What is 15 + 8?" | Simple math (girl) | **23** |
| N2 | "Your normal body temperature in Celsius — when you're healthy, not sick!" | Fun fact | **37** |
| N3 | "What is 6 × 7?" | Math (girl can try) | **42** |
| N4 | "What is 8 × 7?" | Math (boy) | **56** |
| N5 | "How many squares on a chess board? 8 rows × 8 columns!" | Fun fact + math | **64** |
| N6 | "What is 100 – 29?" | Math (boy) | **71** |
| N7 | "What is 17 × 5?" | Math (boy, harder) | **85** |
| N8 | "What is 46 + 46?" | Math (girl can try) | **92** |
| N9 | "What is 50 – 3?" | Simple math (girl) | **47** |
| N10 | "A piano has 88 keys. Subtract 1. What do you get?" | Fun fact + math | **87** |

### Intake UX Details

- **Input for words:** Tappable chips showing the 10 word slips at the bottom — kid taps the matching word
- **Input for numbers:** Number keypad
- **Wrong answer:** Gentle shake + "Try again!" (no penalty, unlimited)
- **Order:** Kids solve the 20 riddles in ANY order (not sequential)
- **Fun detail:** Each solved card flips to reveal a tiny Easter illustration (bunny, chick, egg, flower...)
- **Transition:** All 20 done → confetti burst → "All eggs collected! Now the REAL challenge begins..." → main assignments unlock

---

## Reveal Strategy — 5 Phases

```
PHASE 0 — Egg Registration    (20 mini-riddles)   → register all egg contents
PHASE 1 — Digit Discovery     (Assignments 1–3)   → digits 1, 8, 3
PHASE 2 — Letter Discovery    (Assignments 4–7)   → letters S, H, E, D
PHASE 3 — Assembly Challenges (Assignments 8–10)  → numbers 18, 38, 18
PHASE 4 — Unlock!             (Assignments 11–12) → word SHED + go find treasure
```

Each main assignment unlocks sequentially. The app shows a **Code Board** at the top with empty slots filling in as kids solve puzzles.

---

## The 12 Assignments

### ✏️ ASSIGNMENT 1 · "The Great Egg Sum"
| | |
|---|---|
| **Type** | Math exercise |
| **For** | Both kids (girl adds, boy checks) |
| **Reveals** | Digit **1** |
| **App component** | Three sequential number inputs |

**Puzzle:**
> "Add ALL your egg numbers together: 23 + 37 + 42 + 56 + 64 + 71 + 85 + 92 + 47 + 87 = ?"

Answer: **604**

> "Add the digits: 6 + 0 + 4 = ?"

Answer: **10**

> "One more time: 1 + 0 = ?"

Answer: **1**

**Code Board update:** Digit `1` flies to the board.

---

### 🎹 ASSIGNMENT 2 · "The Scale Explorer"
| | |
|---|---|
| **Type** | Piano challenge |
| **For** | Boy (RCM Grade 8) |
| **Reveals** | Digit **8** |
| **App component** | Number input + piano keyboard animation |

**Puzzle:**
> "Go to the piano! Play a C major scale from Middle C up to the next C."
> "C – D – E – F – G – A – B – C"
> "How many keys did you press in total?"

Answer: **8**

**Bonus text:** *"The octave comes from Latin 'octo' = eight. Too easy for Grade 8!"*

---

### 🎬 ASSIGNMENT 3 · "Grandma Juliaa's Video Question"
| | |
|---|---|
| **Type** | 📹 VIDEO question from grandma in Italy |
| **For** | Girl (7yo) — letter hunting |
| **Reveals** | Digit **3** |
| **App component** | Embedded video player + number input |

**Pre-recorded video from Grandma Juliaa (in English or Ukrainian):**
> "Ciao, my darlings! I have a question for you. Look at all your funny egg words — WACKY, GOOFY, NINJA, and all the others. How many of those words have the letter **N** hiding inside them? Count carefully!"

**Solution:**
- NINJA ✓ · BANJO ✓ · FUNKY ✓ · (all others: no N)

Answer: **3**

---

### 📖 ASSIGNMENT 4 · "The Ssssnake Poem"
| | |
|---|---|
| **Type** | Poem — girl reads aloud |
| **For** | Girl (7yo) reads to everyone |
| **Reveals** | Letter **S** |
| **App component** | Animated poem display + single letter input |

**Poem (appears line by line with animation):**
> *I slither and hiss upon the ground,*
> *I have no legs yet move around,*
> *I shed my skin when I need space —*
> *Now name the creature! Solve this case!*

> "What creature is it? Type the FIRST letter!"

Answer: **S** (Snake)

**Easter egg within the Easter egg:** The word "shed" in line 3 foreshadows the final answer — they won't notice until Assignment 11.

---

### 🔗 ASSIGNMENT 5 · "The Alphabet Chain"
| | |
|---|---|
| **Type** | Logic — chains from Assignment 2 |
| **For** | Both kids |
| **Reveals** | Letter **H** |
| **App component** | Animated alphabet strip + letter input |

**Puzzle:**
> "Remember the number from the piano? It was **8**."
> "Now count in the alphabet:"
> "A=1, B=2, C=3, D=4, E=5, F=6, G=7, **?**=8"
> "What letter lives at position 8?"

Answer: **H**

---

### 🎬 ASSIGNMENT 6 · "Grandma Vera & Grandpa Tolia's Video Question"
| | |
|---|---|
| **Type** | 📹 VIDEO question from grandparents in Poltava |
| **For** | Girl (7yo) |
| **Reveals** | Letter **E** |
| **App component** | Embedded video player + letter input |

**Pre-recorded video from Grandma Vera & Grandpa Tolia (in Ukrainian, subtitled):**
> "Христос Воскрес, діточки! (Christ is Risen, children!) Today is a special holiday. In English, this holiday is called... what? And what do bunnies hide for you? Both of those words start with the same letter. What letter is it?"

Answer: **E** (Easter, Eggs)

---

### 👨‍👩‍👧‍👦 ASSIGNMENT 7 · "The Vlad Equation"
| | |
|---|---|
| **Type** | Family trivia + alphabet |
| **For** | Boy leads, girl counts letters |
| **Reveals** | Letter **D** |
| **App component** | Two-step input (number → letter) |

**Puzzle:**
> "Your half-brother's name is **VLAD**."
> "How many letters in VLAD?"

Answer: **4**

> "The 4th letter of the alphabet is...?"
> "A(1) · B(2) · C(3) · **?**(4)"

Answer: **D**

**App fun fact:** *"D as in Daryna, your cousin!"*

---

### 🎹 ASSIGNMENT 8 · "The Semitone Puzzle"
| | |
|---|---|
| **Type** | Piano + math |
| **For** | Boy (RCM Grade 8) |
| **Reveals** | First lock number → **18** |
| **App component** | Multi-step math with piano reference |

**Puzzle:**
> "Back to the piano! How many semitones in one octave?"
> (C→C#→D→D#→E→F→F#→G→G#→A→A#→B→C)

Answer: **12**

> "Now: how many semitones from C to F?"
> (C→C#→D→D#→E→F)

Answer: **5**

> "Add those together: 12 + 5 = 17"
> "Now add your very first digit (from Assignment 1): 17 + **1** = ?"

Answer: **18**

> 🎉 "**18** is the FIRST number of the combination lock!"

---

### 🎬 ASSIGNMENT 9 · "The Cousin Calculator — Video Edition"
| | |
|---|---|
| **Type** | 📹 VIDEO from Aunt Katiia or cousin + math |
| **For** | Both kids |
| **Reveals** | Second lock number → **38** |
| **App component** | Video player + interactive name-letter counter + final addition |

**Pre-recorded video from Aunt Katiia (or one of the cousins in Poltava):**
> "Привіт! (Hi!) Can you count how many letters are in each cousin's name? Andrii, Svyatik, Katiia, Nastiia, Daryna. Write down the numbers and add them all up! Then... add the number of your aunts and uncles and grandparents too!"

**Interactive counter in app:**

| Name | Letters |
|------|---------|
| Andrii | 6 |
| Svyatik | 7 |
| Katiia | 6 |
| Nastiia | 7 |
| Daryna | 6 |
| **Subtotal** | **32** |

> "Now add the family count: Aunt Katiia + Aunt Lida + Uncle Oleksandr + Aunt Natalia + Grandma Vera + Grandpa Tolia = **6**"

> "32 + 6 = ?"

Answer: **38**

> 🎉 "**38** is the SECOND number of the combination lock!"

---

### 🪞 ASSIGNMENT 10 · "The Mirror Riddle"
| | |
|---|---|
| **Type** | Riddle |
| **For** | Girl (7yo) |
| **Reveals** | Third lock number → **18** |
| **App component** | Riddle display + number input |

**Riddle:**
> *I am a number, not too small,*
> *I start the lock, and I end it all.*
> *The first and last are just the same —*
> *Can you guess my secret name?*

> "The FIRST number of the lock was **18**."
> "What is the THIRD and last number?"

Answer: **18**

> 🎉 The app shows all three numbers sliding into lock: **18 – 38 – 18**

---

### 🔤 ASSIGNMENT 11 · "The Word Scramble"
| | |
|---|---|
| **Type** | Anagram — drag & drop letters |
| **For** | Both kids |
| **Reveals** | Word code → **SHED** |
| **App component** | Draggable letter tiles (reuse react-dnd from last year's jigsaw!) |

**Puzzle:**
> "You've collected four letters: **S · H · E · D**"
> "Drag them into the right order to make a word!"

**Progressive hints (unlock after 30s, 60s, 90s):**
1. 🏡 "It's a small building in the backyard"
2. 🐍 "The snake in your poem does this with its skin"
3. 🧰 "Dad keeps tools in this!"

Answer: **SHED**

---

### 🏆 ASSIGNMENT 12 · "The Grand Unlock!"
| | |
|---|---|
| **Type** | Victory — go find the treasure! |
| **For** | Both kids RUN |
| **Reveals** | TREASURE |
| **App component** | Confetti + celebration screen |

**Screen:**
> 🎊 **YOU CRACKED BOTH CODES!** 🎊
>
> 🔢 Combination lock: **18 – 38 – 18**
> 🔤 Word lock: **SHED**
>
> **RUN TO THE SHED!** 🏃‍♂️🏃‍♀️
>
> Use the combination on the lock and claim your Easter treasure! 🐰🎁🍫

**App:** Confetti explosion, timer stops, triumphant sound, winner image (like last year's `winners.png`).

---

## Design Spec

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Blue primary | `#1B4F8A` | Header bar, filled code cells, primary buttons, active borders |
| Blue light | `#85B7EB` | Dashed empty slots, placeholder text |
| Blue tint | `#EFF6FF` | Code board background, progress track, light surfaces |
| Yellow accent | `#FCD34D` | Timer digits, progress fill, solved code cells, current dot |
| Yellow tint | `#FFFBEB` | Question highlight box background |
| White | `#FFFFFF` | Main surface, input cells, cards |
| Dark text | `var(--color-text-primary)` | Headings, filled input text |
| Muted text | `var(--color-text-secondary)` | Descriptions, labels |

### UI Framework
- **React 19 + TypeScript + Vite** (same as last year)
- **Tailwind CSS** for utility styling
- **shadcn/ui** for input components, buttons, cards, dialogs
- **react-dnd** (already installed) for drag & drop in word scramble

### Layout — Desktop / Tablet (Primary Target)

```
┌─────────────────────────────────────────────────────┐
│ [EASTER 2026]    Assignment 3 of 12      [⏱ 47:23] │  ← Header bar (blue primary)
├─────────────────────────────────────────────────────┤
│  LOCK 1  [1][8]–[?][?]–[?][?]   LOCK 2 [S][?][?][?]│  ← Code board (blue tint bg)
├────────────────────┬────────────────────────────────┤
│                    │                                │
│   ┌────────────┐   │  ASSIGNMENT 3                  │
│   │            │   │  Grandma Juliaa's video        │
│   │   VIDEO    │   │  question                      │
│   │  PLAYER    │   │                                │
│   │            │   │  Watch the video from Grandma  │
│   └────────────┘   │  Juliaa in Italy...            │
│                    │                                │
│  [⏪] [⏸] [▶] [↺] │  ┌─ yellow box ─────────────┐  │
│                    │  │ How many egg words contain │  │
│                    │  │ the letter N?              │  │
│                    │  └───────────────────────────┘  │
├────────────────────┴────────────────────────────────┤
│              Enter your answer                       │
│                   [ 3 ]                              │  ← Input cells (per character)
│             single digit answer                      │
├─────────────────────────────────────────────────────┤
│  Phase 1 — digit discovery              3/12  🐰    │  ← Progress bar
├─────────────────────────────────────────────────────┤
│  [← Back]      ● ● ◉ ○ ○ ○           [Check ✓]    │  ← Bottom nav
└─────────────────────────────────────────────────────┘
```

### Layout — Mobile (Portrait)
Same zones, stacked vertically:
```
┌──────────────────────┐
│ Header + timer       │
├──────────────────────┤
│ Code board (compact) │
├──────────────────────┤
│ VIDEO PLAYER         │
│ [⏪] [⏸] [▶] [↺]    │
├──────────────────────┤
│ Question / task text  │
├──────────────────────┤
│ Input cells          │
├──────────────────────┤
│ Progress 🐰         │
├──────────────────────┤
│ [← Back] [Check ✓]  │
└──────────────────────┘
```

### Media Area (Left Side)
- **Video player:** HTML5 `<video>` with custom controls overlay
- **Controls:** Rewind (⏪ jump back 10s), Play/Pause toggle, Replay (↺ restart from 0), styled as circular buttons
- **Supports:** `.mp4` video, `.jpg/.png` images, audio (future)
- **Auto-behavior:** Video autoplays on assignment load; question box appears AFTER video ends
- **Fallback:** If video fails, show static image with text overlay from `config.video.fallbackText`

### Input Cells
- One cell per expected character (number or letter)
- **Filled:** White bg, 2px solid blue primary border, large mono font
- **Empty:** Light bg `#F8FAFC`, 1.5px dashed blue light border, underscore placeholder
- **Active (focused):** Blue primary border + subtle blue glow
- **Correct animation:** Cell bg flashes yellow briefly, then settles
- **Wrong animation:** Gentle horizontal shake, red flash, resets
- Cell count adapts per assignment (1 cell for single digit, 4 cells for SHED, 3 cells for 604, etc.)

### Navigation (Bottom Bar)
- **Back button:** Outline style, goes to previous completed assignment (review only)
- **Dot indicators:** Filled blue = completed, yellow ring = current, light blue = upcoming
- **Check button:** Blue primary filled, submits current answer
- **Disabled state:** Check grays out until all input cells filled

### Progress Bar
- Track: blue tint `#EFF6FF`
- Fill: yellow accent `#FCD34D`
- Label: phase name + fraction (e.g. "Phase 1 — digit discovery 3/12")
- Bunny emoji sits at the leading edge of the fill (nice-to-have for v1)

### Video Assets Plan
Record short messages from family, receive via WhatsApp/Telegram, compress for web.

| # | From | Content | Used In |
|---|------|---------|---------|
| 1 | Grandma Juliaa (Italy) | "How many egg words have letter N?" | Assignment 3 |
| 2 | Grandma Vera + Grandpa Tolia (Poltava) | "Христос Воскрес! What letter do Easter and Eggs start with?" | Assignment 6 |
| 3 | Aunt Katiia or cousins (Poltava) | "Count letters in each cousin's name and add them up!" | Assignment 9 |
| + | Any additional family messages | Greeting, encouragement, celebration | Intro / finale |

**Tech:** Bundled in `public/videos/`, compressed to <10MB each via `ffmpeg -crf 28 -preset slow`. VTT subtitles for Ukrainian-language videos.

---

## App Architecture — Building on Last Year's Repo

### Existing Components to Reuse
| Component | Last Year | This Year |
|-----------|-----------|-----------|
| `CountdownTimer.tsx` | 59:59, top-right | **60:00**, integrated into header bar |
| `ScrollableSelector.tsx` | 5 selectors (3 digit, 2 letter) | Reuse for final code entry if needed |
| `JigsawPuzzle.tsx` + `PuzzleTray.tsx` | Main game mechanic | Remove (replaced by new puzzle types) |
| `react-dnd` | Puzzle pieces | **Reuse** for Assignment 11 letter tiles |
| Dark theme + gold accents | App.css | **Replace** — blue/yellow/white with Tailwind |

### New Components to Build

```
frontend/src/
├── App.tsx                          ← rewrite: assignment routing + code board
├── config/
│   └── easter-2026-config.json     ← ALL puzzle content, answers, riddles, codes
├── hooks/
│   └── useGameConfig.ts            ← loads + validates config, typed access
├── components/
│   ├── CountdownTimer.tsx           ← modify: 60:00, driven by config.timer
│   ├── ScrollableSelector.tsx       ← reuse as-is for final code entry
│   ├── CodeBoard.tsx                ← NEW: shows discovered digits/letters
│   ├── AssignmentRouter.tsx         ← NEW: sequential unlock logic, reads config
│   ├── VideoPlayer.tsx              ← NEW: plays pre-recorded grandparent videos
│   ├── EggIntake.tsx                ← NEW: Phase 0 — 20 riddle cards grid
│   ├── RiddleCard.tsx               ← NEW: single riddle card (flip animation)
│   ├── assignments/
│   │   ├── A01_EggSum.tsx           ← multi-step number input
│   │   ├── A02_ScaleExplorer.tsx    ← number input + piano animation
│   │   ├── A03_VideoLetterN.tsx     ← video + interactive word checklist
│   │   ├── A04_SnakePoem.tsx        ← animated poem + letter input
│   │   ├── A05_AlphabetChain.tsx    ← alphabet strip + letter input
│   │   ├── A06_VideoEaster.tsx      ← video + letter input
│   │   ├── A07_VladEquation.tsx     ← two-step family trivia
│   │   ├── A08_SemitonePuzzle.tsx   ← multi-step piano math
│   │   ├── A09_CousinCalc.tsx       ← video + interactive table + addition
│   │   ├── A10_MirrorRiddle.tsx     ← riddle display + number input
│   │   ├── A11_WordScramble.tsx     ← drag & drop letters (react-dnd)
│   │   └── A12_GrandFinale.tsx      ← celebration + confetti
│   └── shared/
│       ├── CharacterInput.tsx       ← per-character input cells (auto-focus, validation)
│       ├── MediaPlayer.tsx          ← video/image/audio with custom controls
│       ├── QuestionPanel.tsx        ← right-side question display + yellow highlight box
│       ├── HintSystem.tsx           ← progressive hints with timers
│       ├── Confetti.tsx             ← victory animation
│       └── AssignmentLayout.tsx     ← 2-column layout wrapper (media left, question right)
├── assets/
│   ├── videos/                       ← grandparent video files
│   │   ├── grandma_juliaa.mp4
│   │   ├── grandma_vera_grandpa_tolia.mp4
│   │   └── aunt_katiia.mp4
│   ├── winner_2026.png
│   └── gameOver.png
└── types.ts                          ← Assignment, CodeState interfaces
```

### Video Question Feature

**Recording instructions for family:**

| Video | Who | Language | Duration | What to say |
|-------|-----|----------|----------|------------|
| 1 | Grandma Juliaa (Italy) | English or Ukrainian | 30-45s | Ask about counting egg words with letter N |
| 2 | Grandma Vera + Grandpa Tolia (Poltava) | Ukrainian (add subtitles) | 30-45s | Say "Христос Воскрес!" + ask about Easter/Eggs starting letter |
| 3 | Aunt Katiia or cousins (Poltava) | Ukrainian (add subtitles) | 30-45s | Ask kids to count letters in cousin names + add family members |

**Tech:** See Media Area in Design Spec above. Videos go in `public/videos/`, compressed via `ffmpeg -crf 28 -preset slow`. VTT subtitles for Ukrainian content.

---

## Dev Task List (Priority Order)

### Sprint 1 — Foundation + Design System (Day 1-2)
| # | Task | Est. |
|---|------|------|
| 1 | Branch the existing repo: `git checkout -b easter-2026` | 5m |
| 2 | Install Tailwind CSS + shadcn/ui, configure `tailwind.config.ts` with blue/yellow/white theme | 1h |
| 3 | Create `easter-2026-config.json` + `useGameConfig.ts` hook with TypeScript types | 1h |
| 4 | Build `AssignmentLayout.tsx` — 2-column (media left / question right), responsive stacking on mobile | 1h |
| 5 | Build `CharacterInput.tsx` — per-character cells, auto-advance focus, number/letter modes | 1h |
| 6 | Build `MediaPlayer.tsx` — video/image with custom controls (rewind, play/pause, replay) | 1.5h |
| 7 | Build `CodeBoard.tsx` — lock slots with filled/empty states, blue/yellow theme | 1h |
| 8 | Build `AssignmentRouter.tsx` — state machine: phase0 → phase1-4, localStorage persistence | 1.5h |
| 9 | Rewrite `App.tsx` — header bar + timer + router + code board + progress bar + bottom nav | 1.5h |

### Sprint 2 — Phase 0: Egg Intake (Day 2)
| # | Task | Est. |
|---|------|------|
| 10 | `RiddleCard.tsx` — single card: riddle text, input, correct/wrong animation, flip-to-illustration | 1.5h |
| 11 | `EggIntake.tsx` — 20-card grid, progress bar, word chip selector at bottom, any-order solving | 1.5h |
| 12 | Transition animation: all 20 done → confetti → "Now the REAL challenge begins" → Phase 1 | 30m |

### Sprint 3 — Assignments 1-7 (Day 2-3)
| # | Task | Est. |
|---|------|------|
| 13 | `A01_EggSum.tsx` — three-step math using `CharacterInput` for each answer | 45m |
| 14 | `A02_ScaleExplorer.tsx` — `AssignmentLayout` with piano SVG in media slot | 1h |
| 15 | `A03_VideoLetterN.tsx` — `MediaPlayer` with video + word checklist on right | 1h |
| 16 | `A04_SnakePoem.tsx` — poem display in media area + letter input | 45m |
| 17 | `A05_AlphabetChain.tsx` — animated alphabet strip in media + letter input | 30m |
| 18 | `A06_VideoEaster.tsx` — `MediaPlayer` with video + letter input | 30m |
| 19 | `A07_VladEquation.tsx` — two-step family trivia | 30m |

### Sprint 4 — Assignments 8-12 (Day 3-4)
| # | Task | Est. |
|---|------|------|
| 20 | `A08_SemitonePuzzle.tsx` — piano keyboard SVG in media + multi-step math | 45m |
| 21 | `A09_CousinCalc.tsx` — `MediaPlayer` video + interactive name table | 1.5h |
| 22 | `A10_MirrorRiddle.tsx` — riddle poem in media + number input | 30m |
| 23 | `A11_WordScramble.tsx` — draggable letter tiles (react-dnd) + progressive hints | 1.5h |
| 24 | `A12_GrandFinale.tsx` — confetti, celebration, final code display | 1h |

### Sprint 5 — Polish (Day 4-5)
| # | Task | Est. |
|---|------|------|
| 25 | Tailwind theme polish — consistent blue/yellow/white across all states | 1h |
| 26 | Wrong-answer handling — shake animation, encouraging messages from config | 1h |
| 27 | Sound effects — correct ding, wrong buzz, unlock click, celebration fanfare | 1h |
| 28 | Mobile responsive — test stacked layout on actual tablet | 1h |
| 29 | End-to-end test with all correct AND incorrect answers | 1h |

### Sprint 6 — Video & Physical Prep (parallel, start early!)
| # | Task | Est. |
|---|------|------|
| 30 | Record & edit grandparent videos (coordinate with Italy + Ukraine) | 2-3 days lead time |
| 31 | Compress videos with ffmpeg (`-crf 28`), add subtitle `.vtt` files | 1h |
| 32 | Print and cut 20 egg slips (10 numbers, 10 words) | 30m |
| 33 | Buy combo lock, set to 18-38-18; buy/make letter lock for SHED | 30m |
| 34 | Fill eggs, hide Saturday night, test app one final time | 30m |

---

## Timer Behavior (1 Hour)

| Event | Behavior |
|-------|----------|
| App loads | Timer shows `60:00` with START button |
| START pressed | Timer counts down, Phase 0 (egg registration) begins |
| All 20 eggs registered | Transition to Phase 1 — timer continues |
| Assignment solved | Timer continues (no pause) |
| 10 minutes left | Timer turns red, gentle pulse animation |
| 5 minutes left | "Hurry up!" message appears |
| Timer hits 00:00 | Gentle "time's up" screen (NOT harsh game-over like last year) — show how far they got and offer to continue without timer |

**Change from last year:** No hard game-over on wrong answer. Kids get unlimited attempts with encouraging hints. The timer creates urgency but doesn't punish.

---

## Key Differences from Last Year

| Aspect | 2025 | 2026 |
|--------|------|------|
| Egg registration | N/A — no eggs | 20 mini-riddles to enter each egg's content |
| Puzzle types | Only jigsaw | 7+ types (math, piano, poem, video, riddle, anagram, word chips) |
| Number of puzzles | 5 | 20 intake riddles + 12 main assignments = 32 total interactions |
| Code complexity | 5 chars (231WC) | Two separate locks (18-38-18 + SHED) |
| Family involvement | None | 3 video questions from Italy + Ukraine |
| Wrong answer | Instant game over | Unlimited retries with hints |
| Timer | 59:59 | 60:00 with soft timeout |
| Code entry | After all puzzles | Progressive reveal throughout |
| Theme | Dark with gold | Easter pastels + dark accents |

---

## Easter Eggs Within Easter Eggs 🥚

1. **Snake poem** says "I **shed** my skin" — foreshadows SHED
2. Grandma Vera says **"Христос Воскрес!"** — kids learn the Easter greeting
3. Assignment 9 uses **every cousin's real name** — personal connection
4. **Digital root** (Assignment 1) — sneaky math education
5. **Semitones** (Assignment 8) — reinforces RCM theory
6. D revealed via **Vlad**, then app says "D as in **Daryna**!"
7. **Italian "Ciao"** from Grandma Juliaa — multicultural flair
8. Intake riddle N10: **"Piano has 88 keys minus 1"** — boy will love knowing this
9. Intake riddle W3: **Kermit plays banjo** — nostalgic Muppets reference
10. Each solved riddle card **flips to a mini Easter illustration** — 20 collectible art pieces

---

## Video Recording Script Guide (Send to Family)

### For Grandma Juliaa (Italy):
> "Record a 30-second video. Start by saying hi to the kids by name. Then say: 'I have a puzzle for you! Look at all your funny egg words. How many of those words have the letter N hiding inside? Count very carefully!' End by blowing a kiss."

### For Grandma Vera & Grandpa Tolia (Poltava):
> "Record a 30-second video. Start by saying 'Христос Воскрес, діточки!' Then say (can be in Ukrainian): 'Today is a special holiday. In English it's called... what? And what do bunnies hide for you to find? Both words start with the same letter — which one?' End by waving."

### For Aunt Katiia or Cousins (Poltava):
> "Record a 30-second video. Say hi, then say: 'Can you count how many letters are in each cousin's name? Andrii, Svyatik, Katiia, Nastiia, Daryna. Add them all up! Then add all the aunts, uncles, and grandparents too!' End by cheering."

**Technical notes for recorders:**
- Landscape orientation
- Good lighting (near a window)
- Quiet background
- Send via WhatsApp/Telegram (will be compressed enough)
- Deadline: **1 week before Easter** (April 5 at latest)
