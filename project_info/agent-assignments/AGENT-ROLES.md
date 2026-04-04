# Agent Roles & Assignments

## How Agents Discover Their Work
1. Read this file for role overview
2. Check `project_info/user-stories/` for feature requirements
3. Check `project_info/progress/` for current status
4. Check `project_info/adr/` for architectural decisions
5. Read `dev_info/easter-2026-config.json` for game content/config
6. Read `dev_info/easter-2026-plan-v2.md` for full game design

## Agent Registry

### trailblazer-pm
**Role:** Product Manager / Scope Guardian
**Owns:** User stories, game loop design, scope control, go-live readiness
**Files:** `project_info/user-stories/`, `project_info/GAME-LOOP.md`, `project_info/SCOPE.md`, `project_info/GO-LIVE-CHECKLIST.md`
**When invoked:** Feature proposals, scope questions, launch readiness checks

### architect-schema-guardian
**Role:** Type System & State Machine Architect
**Owns:** TypeScript interfaces, Zustand store design, state transitions
**Files:** `frontend/src/types.ts`, `frontend/src/store/`, `project_info/adr/ADR-002-*.md`
**When invoked:** Starting new features that need type definitions, state bugs, schema changes

### ux-experience-crafter
**Role:** Design System & Theme Lead
**Owns:** Tailwind config, color palette, animations, haptic/visual feedback patterns
**Files:** `frontend/tailwind.config.ts`, `frontend/src/index.css`, shadcn theme tokens
**When invoked:** Theming, animation design, interaction feedback, visual polish

### frontend-ui-craftsman
**Role:** Component Builder & Test Writer
**Owns:** React components, forms, Playwright E2E tests, Vitest unit tests
**Files:** `frontend/src/components/`, `frontend/src/__tests__/`
**When invoked:** Building new components, writing tests, fixing UI bugs

### react-feature-engine
**Role:** Interactive Feature Specialist
**Owns:** Complex interactive components, animations, drag-and-drop, performance
**Files:** Assignment components, shared interactive components
**When invoked:** Building assignment puzzles, DnD word scramble, confetti, transitions

### react-typescript-lead
**Role:** Code Reviewer & Quality Gate
**Owns:** Type safety audits, render optimization, architecture review
**Files:** Reviews all `frontend/src/` changes
**When invoked:** After code is written — reviews for type safety, performance, patterns

### springboard-workflow-architect
**Role:** Cross-Team Quality Coordinator
**Owns:** Overall consistency, Tailwind/shadcn compliance, family-focus filter
**Files:** Reviews all changes holistically
**When invoked:** PR reviews, feature proposals, design handoffs, hard-coded style detection

## Workflow
1. **PM defines** → user stories + acceptance criteria
2. **Architect designs** → types + state machine
3. **UX crafts** → theme + design tokens + animation specs
4. **Builders implement** → components using types + theme
5. **Reviewers gate** → code review + quality audit
6. **PM verifies** → acceptance criteria met, scope maintained
