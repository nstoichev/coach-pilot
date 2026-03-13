# Implementation Plan: Fitness Workout Builder Foundation

**Branch**: `002-fitness-workout-spec`  
**Date**: 2026-03-13  
**Spec**: `/specs/002-fitness-workout-spec/spec.md`  

**Input**: Feature specification from `/specs/002-fitness-workout-spec/spec.md`

---

## Summary

This feature replaces the Vite starter app with the first usable Coach Pilot experience: a static Workout Builder backed by an Exercise Database and a strict Workout -> Segment -> Exercise domain model. The implementation affects the core workout data layer, introduces centralized state for workout drafting and exercise reuse, and adds modular placeholder services for future Timer Generator, Fatigue System, and workout auto-generation features.

It directly modifies and extends Exercise, Segment, and Workout logic, and it introduces deterministic validation and ordering helpers. The plan avoids premature complexity by using a simple React state architecture for phase 1 while preserving extension points for later modules.

---

## Technical Context

Language: TypeScript 5.9  
Framework: React 19  
Build Tool: Vite 7  

Primary Dependencies:

- React
- React DOM
- Existing TypeScript / ESLint / Vite toolchain

Storage Strategy:

Phase 1 (MVP):

- Centralized local state using React Context plus `useReducer`
- Mock exercise data and in-memory workout drafting

Phase 2:

- Supabase + PostgreSQL persistence
- User profile support for Fatigue System and auto-generation

Target Platform:

- Modern web browsers
- Desktop first
- Mobile supported after layout hardening

Performance Goals:

- Workout builder interactions should feel instantaneous during segment and exercise edits
- Domain validation and reorder operations should complete without noticeable lag for workouts of normal coaching size

Constraints:

- No authentication required in MVP
- Single-user local prototype is acceptable in phase 1
- Current repository still contains starter Vite UI and only a partial `src/types/exercise.ts`
- No dedicated test runner is configured yet; build and lint remain the required automated checks for this phase

---

## Constitution Check

Verify that the implementation respects the project constitution.

**Checklist**:

- **Domain integrity**: Pass. The plan centers all work on the Workout -> Segment -> Exercise model and adds Equipment and Muscle Group support through shared types.
- **Logic separation**: Pass. Validation, ordering, and future timer/fatigue logic live in `src/services/` and shared state lives in `src/store/`, not inside UI components.
- **Modularity**: Pass. Workout Builder, Exercise Database, Timer Generator, and Fatigue System are treated as separate modules with explicit boundaries.
- **Deterministic behavior**: Pass. Segment ordering, exercise assignment validation, and future timer/fatigue contracts are designed as deterministic functions and service contracts.

No constitution violations are introduced by this plan.

---

## Architecture Approach

The feature fits into the system as the foundational module that all future workout intelligence will build on.

Typical architecture layers:

- **Domain layer**: Shared type contracts for Exercise, Segment, Workout, Equipment, Muscle Group, and supporting metadata
- **Application layer**: Centralized workout builder state, data transformations, validation rules, assignment logic, and future service placeholders
- **UI layer**: React components for workout creation, segment editing, exercise management, and future feature placeholders

Example flow:

User action  
↓  
React component  
↓  
Context action / reducer dispatch  
↓  
Domain validation + ordering helpers  
↓  
Updated workout state  
↓  
UI rerender

Key architectural decisions:

- Keep the source of truth in shared state rather than local component copies
- Use `src/types/` for canonical contracts because the repo already started there
- Use `src/services/` for deterministic logic and future module boundaries
- Use `src/store/` for centralized state because the project has no external state library installed and the constitution prefers simple patterns first

---

## Project Structure

## Documentation (feature)

`specs/002-fitness-workout-spec/`

- `plan.md`
- `research.md`
- `data-model.md`
- `quickstart.md`
- `contracts/`
- `tasks.md`

---

## Source Code

```text
src/
  components/
    exercises/
    workout-builder/
  services/
    fatigue-system.ts
    mock-workouts.ts
    timer-generator.ts
    workout-domain.ts
    workout-generator.ts
    workout-validation.ts
  store/
    workout-builder-context.tsx
  types/
    domain.ts
    exercise.ts
    segment.ts
    workout.ts
  App.tsx
  App.css
  index.css
  main.tsx
```

Explanation:

`components/`  
UI surfaces for Workout Builder and Exercise Database interactions.

`services/`  
Deterministic logic, validation, data transformations, and future module placeholders.

`store/`  
Centralized local state for exercises, workouts, validation state, and UI actions.

`types/`  
Canonical TypeScript contracts that represent the source of truth.

---

## Data Model Impact

This feature:

- expands the existing `Exercise` entity beyond its current partial shape
- introduces dedicated `Segment` and `Workout` module files
- adds supporting concepts for Equipment, Muscle Groups, training-type combinations, and working-weight metadata
- adds relationships between reusable Exercise records and ordered workout segments

Planned entity impact:

Workout
- owns ordered `segments`
- stores workout-level metadata such as `name`

Segment
- belongs to one Workout draft
- stores `name`, segment-specific timing and rest metadata, and ordered exercise references or embedded exercise snapshots depending on state shape

Exercise
- acts as the reusable source-of-truth record
- stores `name`, training `type`, `equipment`, `muscles`, and optional `workingWeight`

Equipment / Muscle Group
- support aggregation and future fatigue / programming logic

---

## Testing Strategy

Focus on **domain logic tests** first when a test runner is introduced.

Priority test areas:

- workout transformations
- segment and exercise reorder behavior
- exercise assignment validation
- equipment aggregation
- future timer metadata compatibility

Phase-1 validation approach:

- manual verification using the scenarios in `quickstart.md`
- `npm run lint`
- `npm run build`

UI tests remain optional during early development.

---

## Complexity Tracking

| Decision | Why Needed | Simpler Alternative Rejected |
|----------|-------------|------------------------------|
| React Context + `useReducer` for shared state | The builder and exercise database need one source of truth without adding a new dependency | Local component state would duplicate data and break cross-component coordination |
| Service placeholders for timer, fatigue, and generator modules | Future systems need stable extension points now so the domain model does not need a redesign later | Waiting to define boundaries would make later features more invasive |
