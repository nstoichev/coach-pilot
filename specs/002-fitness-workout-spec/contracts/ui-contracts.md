# UI Contracts: Fitness Workout Builder Foundation

## Purpose

This document defines the interface contracts between the Workout Builder UI, Exercise Database UI, centralized state, and deterministic service modules.

---

## Contract 1: Workout Builder Surface

**Responsibilities**:

- create a workout draft
- edit workout name
- add, remove, and reorder segments
- display segment-level validation state

**Inputs**:

- current workout draft
- builder actions for create, rename, remove, reorder
- validation messages

**Outputs**:

- state actions for workout and segment updates
- user-visible validation feedback

**Rules**:

- must not mutate domain data directly
- must route all structural updates through centralized state actions

---

## Contract 2: Segment Exercise Assignment Surface

**Responsibilities**:

- list exercises available from the Exercise Database
- assign an exercise to a segment
- remove or reorder exercises within a segment
- handle the empty exercise database state

**Inputs**:

- available exercises
- target segment ID
- assignment and reorder actions

**Outputs**:

- assignment actions
- validation or empty-state messaging

**Rules**:

- cannot assign an exercise that does not exist
- must display guidance when no exercise records are available

---

## Contract 3: Exercise Database Surface

**Responsibilities**:

- create new exercise records
- edit existing exercise records
- delete exercise records when allowed
- show fields for type, equipment, muscle groups, and working weight

**Inputs**:

- exercise list
- create, edit, and delete actions
- validation messages

**Outputs**:

- updated exercise records in centralized state
- delete-blocking feedback when exercises are referenced by workouts

**Rules**:

- exercise IDs must remain unique
- blank names and invalid type selections must be blocked

---

## Contract 4: Validation Service Boundary

**Responsibilities**:

- validate exercise records
- validate workout and segment structure
- detect broken exercise references
- provide deterministic error messages

**Inputs**:

- exercise records
- workout draft
- segment edits

**Outputs**:

- validation results
- error or warning messages keyed to the relevant entity

**Rules**:

- validation must remain deterministic
- validation must be reusable by multiple UI components

---

## Contract 5: Future Module Placeholders

**Responsibilities**:

- accept workout and exercise metadata from the shared domain model
- avoid forcing domain redesign later

**Placeholder modules**:

- Timer Generator
- Fatigue System
- Workout Generator

**Rules**:

- placeholder services must consume the same Workout -> Segment -> Exercise structure
- phase-1 UI should expose future readiness without implementing full advanced behavior
