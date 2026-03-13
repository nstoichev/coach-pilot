---
description: "Task list for Fitness Workout Builder Foundation"
---

# Tasks: Fitness Workout Builder Foundation

Input: Design documents from `/specs/002-fitness-workout-spec/`  
Prerequisites: `spec.md` available, `requirements.md` available, `plan.md` available

Tests: Tests are optional. No explicit TDD requirement appears in the specification, so these tasks prioritize domain correctness, manual validation, linting, and build readiness.

Organization: Tasks are grouped by **user story** so each story can be implemented and validated independently after the shared foundations are complete.

---

# Task Format

`[ID] [P?] [Story] Description`

Elements:

- **[P]** = Can run in parallel (different files, no dependency)
- **[Story]** = User story reference (`[US1]`, `[US2]`, `[US3]`)
- Include **exact file paths**
- Tasks should be **small and concrete**

---

# Path Conventions

The current project is a single React + TypeScript application rooted in `src/`.  
This task list introduces the structure required by the specification:

```text
src/
  components/
  services/
  store/
  types/
```

---

# Phase 1 — Project Setup

Purpose: Create the feature folders and entry points needed to replace the starter app with Coach Pilot foundations.

Tasks:

- [x] T001 Create the workout builder component barrel in `src/components/workout-builder/index.ts`
- [x] T002 Create the exercise database component barrel in `src/components/exercises/index.ts`
- [x] T003 Create the shared services barrel in `src/services/index.ts`
- [x] T004 Create the shared store barrel in `src/store/index.ts`

Checkpoint: Feature folders and import entry points exist.

---

# Phase 2 — Domain Foundations (Blocking)

Purpose: Define the core Workout -> Segment -> Exercise model, validation rules, and centralized state before UI work begins.

No user story UI work should begin until these tasks are complete.

Tasks:

- [x] T005 [P] Expand the exercise contract in `src/types/exercise.ts`
- [x] T006 [P] Create the segment contract in `src/types/segment.ts`
- [x] T007 [P] Create the workout contract in `src/types/workout.ts`
- [x] T008 [P] Create shared domain helper types in `src/types/domain.ts`
- [x] T009 Create workout and exercise validation helpers in `src/services/workout-validation.ts`
- [x] T010 Create ordering and assignment domain helpers in `src/services/workout-domain.ts`
- [x] T011 Create centralized workout builder state and reducer in `src/store/workout-builder-context.tsx`
- [x] T012 Wire the workout builder provider into `src/main.tsx`

Checkpoint: The domain model, validation rules, and shared state are in place and can be consumed by UI components.

---

# Phase 3 — User Story 1 (P1) 🎯 MVP

Goal: Implement the minimum usable Workout Builder for creating workouts, adding segments, assigning exercises through search, setting optional sets/reps, and reordering or removing items.

Independent Test:

Create a workout with at least two segments, search and assign existing exercises to each segment, optionally define sets/reps, reorder segments and exercises, and confirm the resulting structure remains valid in the UI.

Tasks:

- [x] T013 [P] [US1] Create the workout builder container in `src/components/workout-builder/WorkoutBuilder.tsx`
- [x] T014 [P] [US1] Create the workout details form in `src/components/workout-builder/WorkoutDetailsForm.tsx`
- [x] T015 [P] [US1] Create the segment list UI in `src/components/workout-builder/SegmentList.tsx`
- [x] T016 [P] [US1] Create the segment editor UI in `src/components/workout-builder/SegmentEditor.tsx`
- [x] T017 [US1] Implement workout and segment actions in `src/store/workout-builder-context.tsx`
- [x] T018 [US1] Create the segment exercise search picker and empty-state flow in `src/components/workout-builder/SegmentExercisePicker.tsx`
- [x] T019 [US1] Replace the starter app with the Workout Builder shell in `src/App.tsx`

Checkpoint: User Story 1 is functional and delivers the MVP.

---

# Phase 4 — User Story 2 (P2)

Goal: Add a hidden mock exercise source so users can search, reuse, and safely manage exercise records without exposing a heavy Exercise Database module in the main UX.

Independent Test:

Create several exercises in the mock source, edit one, delete one that is not referenced, and verify referenced exercises remain searchable/selectable and protected from invalid deletion paths.

Tasks:

- [x] T020 [P] [US2] Create the mock exercise source container in `src/components/exercises/ExerciseDatabase.tsx`
- [x] T021 [P] [US2] Create the exercise create/edit form in `src/components/exercises/ExerciseForm.tsx`
- [x] T022 [P] [US2] Create the exercise list item actions UI in `src/components/exercises/ExerciseListItem.tsx`
- [x] T023 [US2] Implement exercise CRUD actions and reference guards in `src/store/workout-builder-context.tsx`
- [x] T024 [US2] Extend exercise validation messages and delete safeguards in `src/services/workout-validation.ts`
- [x] T025 [US2] Connect mock exercise source selection into segment assignment search in `src/components/workout-builder/SegmentExercisePicker.tsx`

Checkpoint: User Story 2 is functional and exercises act as the shared source of truth.

---

# Phase 5 — User Story 3 (P3)

Goal: Prepare extension points for the Timer Generator, Fatigue System, and workout auto-generation without building full advanced behavior yet.

Independent Test:

Confirm the domain model and mock workout data can describe EMOM-style segments and that placeholder service contracts can consume the same workout structure without UI rewrites.

Tasks:

- [ ] T026 [P] [US3] Create the Timer Generator placeholder contract in `src/services/timer-generator.ts`
- [ ] T027 [P] [US3] Create the Fatigue System placeholder contract in `src/services/fatigue-system.ts`
- [ ] T028 [P] [US3] Create the workout auto-generation placeholder contract in `src/services/workout-generator.ts`
- [ ] T029 [US3] Extend segment metadata for future EMOM and timer support in `src/types/segment.ts`
- [ ] T030 [US3] Add CrossFit-style EMOM mock workout data in `src/services/mock-workouts.ts`
- [ ] T031 [US3] Surface future-feature placeholders in the builder shell in `src/components/workout-builder/WorkoutBuilder.tsx`

Checkpoint: User Story 3 is functional as a future-ready extension layer.

---

# Final Phase — Polish

Purpose: Finish presentation, documentation, and shared exports needed across the whole feature.

Tasks:

- [ ] T032 [P] Update the main application layout and builder styles in `src/App.css`
- [ ] T033 [P] Update global styling defaults for the Coach Pilot shell in `src/index.css`
- [ ] T034 [P] Document architecture, data flow, and extension guidance in `README.md`
- [ ] T035 Update workout builder exports in `src/components/workout-builder/index.ts`
- [ ] T036 Update shared service exports in `src/services/index.ts`

Checkpoint: The feature is documented, styled, and ready for implementation review.

---

# Dependencies & Execution Order

Phase dependencies:

1. Setup
2. Domain Foundations
3. User Story 1 (MVP)
4. User Story 2
5. User Story 3
6. Polish

Story dependency graph:

`Setup -> Foundations -> US1 -> US2 -> US3 -> Polish`

Rules:

- Domain model and validation must exist before UI integration.
- Centralized state must exist before builder and exercise-management components are wired.
- User Story 1 is the recommended MVP scope.
- User Story 2 depends on the shared state from Foundations and benefits from the builder shell in User Story 1.
- User Story 3 depends on the finalized domain model from Foundations and the builder structure from User Story 1.

---

# Parallel Execution Opportunities

Tasks marked `[P]` can run simultaneously.

Parallel foundational tasks:

- T005 `src/types/exercise.ts`
- T006 `src/types/segment.ts`
- T007 `src/types/workout.ts`
- T008 `src/types/domain.ts`

Parallel User Story 1 tasks:

- T013 `src/components/workout-builder/WorkoutBuilder.tsx`
- T014 `src/components/workout-builder/WorkoutDetailsForm.tsx`
- T015 `src/components/workout-builder/SegmentList.tsx`
- T016 `src/components/workout-builder/SegmentEditor.tsx`

Parallel User Story 2 tasks:

- T020 `src/components/exercises/ExerciseDatabase.tsx`
- T021 `src/components/exercises/ExerciseForm.tsx`
- T022 `src/components/exercises/ExerciseListItem.tsx`

Parallel User Story 3 tasks:

- T026 `src/services/timer-generator.ts`
- T027 `src/services/fatigue-system.ts`
- T028 `src/services/workout-generator.ts`

Parallel polish tasks:

- T032 `src/App.css`
- T033 `src/index.css`
- T034 `README.md`

---

# Implementation Strategy

## MVP First

1. Complete Phase 1: Setup
2. Complete Phase 2: Domain Foundations
3. Complete Phase 3: User Story 1
4. Validate the Workout Builder independently

Stop after User Story 1 if a first usable release is needed quickly.

---

## Incremental Delivery

1. Add User Story 2 to make exercises reusable and centrally managed.
2. Add User Story 3 to prepare extension points for timers, fatigue, and generation.
3. Finish with Polish for styles, docs, and export cleanup.

Each story should add usable value without breaking previous flows.

---

# Notes

- All tasks follow the required checklist format: checkbox, task ID, optional `[P]`, required `[US#]` in story phases, and an exact file path.
- Because `plan.md` is not available yet, these tasks are derived from `spec.md`, the project constitution, the current `src/` structure, and the existing React/Vite setup in `package.json`.
- No extension hooks were found in `.specify/extensions.yml`.
