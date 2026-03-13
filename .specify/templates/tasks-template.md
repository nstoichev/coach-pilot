---
description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

Input: Design documents from `/specs/[###-feature-name]/`  
Prerequisites: `plan.md`, `spec.md`, optional `research.md`, `data-model.md`

Tests: Tests are optional. Prioritize tests for **core domain logic** rather than UI.

Organization: Tasks are grouped by **user story** so that each story can be implemented and validated independently.

---

# Task Format

`[ID] [P?] [Story] Description`

Elements:

- **[P]** = Can run in parallel (different files, no dependency)
- **[Story]** = User story reference (US1, US2, US3)
- Include **exact file paths**
- Tasks should be **small and concrete**

Example:

- **T012 [P] [US1]** Create Exercise type in src/types/exercise.ts

---

# Path Conventions

The project uses a **single React application structure**.

```
src/

domain/
features/
components/
hooks/
types/
utils/

tests/
```

Paths referenced in tasks should follow this structure.

---

# Phase 1 — Project Setup

Purpose: Ensure the feature can integrate into the existing project structure.

Tasks:

- [ ] T001 Create feature directory in `src/features/[feature-name]/`
- [ ] T002 Define shared types in `src/types/`
- [ ] T003 [P] Add placeholder test directory in `tests/unit/[feature-name]/`
- [ ] T004 Ensure linting and formatting pass

Checkpoint: Feature scaffolding ready.

---

# Phase 2 — Domain Foundations (Blocking)

Purpose: Implement or extend **domain entities and logic** required by the feature.

⚠️ No UI work should begin until these tasks are complete.

Example tasks:

- [ ] T005 Define domain types in `src/domain/`
- [ ] T006 Implement core domain functions
- [ ] T007 Add validation logic for new entities
- [ ] T008 [P] Write unit tests for domain logic

Checkpoint: Domain logic implemented and testable independently.

---

# Phase 3 — User Story 1 (P1) 🎯 MVP

Goal: Implement the **minimum usable feature**.

Independent Test:

Describe how the user can verify this story works without relying on other stories.

---

## Domain Tasks

- [ ] T010 [P] [US1] Extend domain types if needed
- [ ] T011 [US1] Implement core feature logic in `src/domain/`

---

## Feature Logic

- [ ] T012 [US1] Create feature hook in `src/hooks/use[Feature].ts`
- [ ] T013 [US1] Implement feature logic in `src/features/[feature-name]/`

---

## UI Implementation

- [ ] T014 [P] [US1] Create UI component in `src/components/[feature]/`
- [ ] T015 [US1] Connect component to feature hook
- [ ] T016 [US1] Add basic user interaction handling

Checkpoint: User Story 1 fully functional.

---

# Phase 4 — User Story 2 (P2)

Goal: Add additional capability to the feature.

Independent Test:

Explain how the feature works independently.

---

## Implementation Tasks

- [ ] T020 [P] [US2] Extend domain logic if required
- [ ] T021 [US2] Extend feature hook logic
- [ ] T022 [US2] Extend UI components
- [ ] T023 [US2] Ensure compatibility with existing workflow

Checkpoint: US1 + US2 both functional.

---

# Phase 5 — User Story 3 (P3)

Goal: Implement optional or advanced behavior.

---

## Implementation Tasks

- [ ] T030 [P] [US3] Add additional domain logic
- [ ] T031 [US3] Extend feature hook
- [ ] T032 [US3] Extend UI components

Checkpoint: All user stories functional.

---

# Final Phase — Polish

Purpose: Improvements that affect the whole feature.

Tasks:

- [ ] T100 [P] Code cleanup
- [ ] T101 Improve TypeScript types
- [ ] T102 Add missing unit tests
- [ ] T103 Update documentation
- [ ] T104 Verify quickstart guide

---

# Dependencies & Execution Order

Phase dependencies:

Setup
↓
Domain Foundations
↓
User Story 1 (MVP)
↓
User Story 2
↓
User Story 3
↓
Polish


Rules:

- Domain logic must exist before UI implementation
- Hooks must exist before UI components use them
- Each user story must be independently testable

---

# Parallel Execution Opportunities

Tasks marked `[P]` can run simultaneously.

Examples:

Parallel domain tasks:

- Create Exercise type in `src/types/exercise.ts`
- Create Segment type in `src/types/segment.ts`
- Create Workout type in `src/types/workout.ts`

Parallel UI tasks:

- Create SegmentEditor component
- Create ExerciseSelector component
- Create WorkoutView component


---

# Implementation Strategy

## MVP First

1. Complete Setup
2. Complete Domain Foundations
3. Implement User Story 1
4. Validate independently

Stop here if MVP is achieved.

---

## Incremental Delivery

Add additional user stories one by one.

Each story must:

- deliver usable functionality
- not break existing behavior

---

# Notes

Guidelines:

- Prefer **small tasks**
- Avoid vague descriptions
- Avoid multiple tasks editing the same file
- Ensure tasks reference exact paths
- Ensure user stories remain independent

Recommended commit pattern:

task: implement exercise type
task: add workout builder hook
task: add segment editor UI

