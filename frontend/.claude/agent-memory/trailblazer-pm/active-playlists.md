---
name: Active Playlists
description: The two active game paths and which assignment IDs they contain -- critical for understanding what's actually in the game
type: project
---

The game has two paths that players complete from the hub:

- WORD_PATH: [15, 13, 14, 4, 11] -- "The Upside Down", "The Vanishing Trick", "The Mystery Fight", "The Hidden Letter" (Snake), "The Secret Place" (SHED reveal)
- NUMBER_PATH: [101, 102, 104, 105, 106, 103, 107] -- Six progressive disclosure digit puzzles + Number Lock Assembly

After both paths complete, the Finale (A12) unlocks.

Original assignments A1-A10 (including piano, family video, multi-step math) are in config but NOT reachable through normal gameplay. They were replaced during the restructure from linear to hub-and-spoke navigation.

**Why:** Understanding which assignments are live vs dead code is critical for prioritizing testing and content work.
**How to apply:** Only test/fix assignments in the active playlists. Do not spend time on A1-A10 unless they are re-added to a path.
