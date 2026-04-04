# ADR-001: Technology Stack

## Status
Accepted

## Context
Building an interactive Easter egg hunt web application for children (ages 7-12). The app must run on tablets (primary) and phones, handle video playback, drag-and-drop interactions, and provide an engaging, responsive experience. Building on prior year's `zss1980/easter-puzzle` repo (React + TypeScript + Vite + react-dnd).

## Decision

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | React 19 + TypeScript | Continuity from last year, strong typing for game state |
| Build | Vite 6 | Fast HMR, native TS support |
| Styling | Tailwind CSS 4 | Utility-first, rapid prototyping, easy theming |
| Components | shadcn/ui | Accessible primitives (inputs, buttons, cards, dialogs) |
| State | Zustand | Lightweight, no boilerplate, persistent middleware for localStorage |
| DnD | react-dnd (HTML5 backend) | Already proven in last year's jigsaw; needed for Assignment 11 word scramble |
| Animation | Framer Motion | Spring animations, gesture support, layout transitions |
| Icons | Lucide React | Tree-shakeable, consistent with shadcn/ui |

## Consequences
- No backend needed — all game logic runs client-side
- Game state persists via localStorage (Zustand persist middleware)
- Videos bundled in `public/videos/` — no CDN needed for family use
- Single-page app deployed as static files (Vercel, Netlify, or local serve)
