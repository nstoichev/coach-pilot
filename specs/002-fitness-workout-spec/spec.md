# Feature Specification: Fitness Workout Builder Foundation

**Feature Branch**: `002-fitness-workout-spec`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: User description: "I want you to generate a full project specification for a React + TypeScript fitness application. The specification should be detailed and include the data models, components, and high-level architecture. Focus on the first phase: building the exercise object and workout builder. Include placeholders and plans for future features like stamina tracking, workout auto-generation, and workout timers."

---

## Feature Overview

This feature establishes the **Workout Builder** and exercise data foundation for the Coach Pilot fitness application. It solves the problem of planning and reusing structured workouts made of segments and exercises, and it defines the domain model that later features (Timer Generator, Fatigue System, equipment aggregation) will consume.

- **Problem**: Users need to create, edit, and reuse workouts built from segments and exercises without duplicate or inconsistent data.
- **Interaction**: The feature defines and stores Workout, Segment, and Exercise entities and ensures workouts stay consistent and consumable by the timer generator, fatigue engine, and equipment calculator.
- **Place in the app**: Workout Builder (create/edit workouts and segments, search and assign exercises, set optional sets/reps or metric targets); exercise data is available through a lightweight search experience backed by a mock database in phase 1. Placeholders are set for Timer Generator, Fatigue System, and workout auto-generation.

---

## User Scenarios & Testing *(mandatory)*

User stories represent **independent user journeys** that provide value even if implemented alone. Stories are ordered by priority.

---

### User Story 1 — Build a Structured Workout (Priority: P1)

As a coach or trainee, I can create a workout, add multiple segments, and add exercises to each segment so I can plan complete sessions in one place.

**Why this priority**: Workout creation is the core business value for phase 1; without this, the product does not provide practical planning utility.

**Independent Test**: Can be fully tested by creating a workout with at least two segments and multiple exercises, then saving and reloading it with structure intact.

**Acceptance Scenarios**:

1. **Given** an empty workout builder, **When** the user creates a workout and adds segments, **Then** each segment appears in order and can be named.
2. **Given** a segment exists, **When** the user focuses the exercise search field, **Then** the first 10 available exercises are shown and can be filtered by typing.
3. **Given** a segment exists, **When** the user selects a search result, **Then** the exercise is added to that segment and the user can define either optional sets/repetitions or metric targets depending on the exercise type.
4. **Given** a workout has segments and exercises, **When** the user reorders items, **Then** the new order is preserved and reflected immediately.

---

### User Story 2 — Manage Exercise Database (Priority: P2)

As a coach or trainee, I can use a lightweight search-based exercise source so workouts can be composed from accurate exercise definitions without exposing a heavy management UI during normal workout building.

**Why this priority**: The Workout Builder depends on reliable exercise data, but the UX should remain focused and low-friction. A hidden or background exercise source keeps the workout flow simple while still enabling reuse and future integrations.

**Independent Test**: Can be fully tested by creating an exercise, editing its metadata, using it in a segment, and confirming deletion behavior follows defined constraints.

**Acceptance Scenarios**:

1. **Given** the exercise source contains records, **When** the user searches from within a segment, **Then** matching exercises become selectable without showing the full management module.
2. **Given** an exercise exists, **When** its optional fields (equipment, muscles, working weight) are updated in the background data source, **Then** the changes are visible wherever the exercise is referenced.
3. **Given** an exercise is referenced by a segment, **When** the system attempts to remove it from the source data, **Then** the system prevents accidental invalid workout state and prompts corrective action.

---

### User Story 3 — Prepare for Timer, Fatigue, and Extension (Priority: P3)

As a product team member, I can define placeholder capabilities for the Fatigue System, workout auto-generation, and the Timer Generator so those modules can be added without reworking core workout data.

**Why this priority**: Future readiness protects delivery speed and reduces redesign risk while keeping current implementation scoped to the static workout builder and Exercise Database.

**Independent Test**: Can be fully tested by verifying that workout and exercise records store enough metadata for the Timer Generator, Fatigue System, and equipment aggregation, and that placeholder modules can consume the domain model.

**Acceptance Scenarios**:

1. **Given** a completed workout definition, **When** the Timer Generator or Fatigue System request workout or exercise metadata, **Then** required baseline data is available through the domain model.
2. **Given** a CrossFit-style workout with EMOM segments, **When** timer or generator placeholders process it, **Then** they can identify segment structure and duration references.

---

## Edge Cases

- Segment has zero exercises: how does the system treat empty segments on save or when generating timers?
- Exercise requires equipment not present in gym: how is this surfaced to the user or to the equipment calculator?
- Timer generation fails due to incompatible segment type: how does the system behave when a segment cannot produce a valid timer?
- Duplicate exercises inside a segment: is this allowed, and how does fatigue calculation treat them?
- Extremely long workouts: are there limits or performance expectations?
- User adds an exercise to a segment before any exercises exist in the Exercise Database: system must block or guide user to create exercises first.
- User deletes or edits an exercise that is already used in one or more saved workouts: system must preserve workout structure or prompt corrective action.
- Segment or exercise reordering with only one item in the list: behavior must remain predictable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creation and editing of workouts and segments through the UI (create, edit, view, remove workouts; add, remove, reorder segments and exercises).
- **FR-002**: System MUST store the resulting data in the domain model (Workout, Segment, Exercise, and related Equipment and Muscle Group concepts as the source of truth).
- **FR-003**: System MUST validate user input before saving (e.g. prevent assigning non-existent exercises to segments; require necessary fields; provide clear feedback).
- **FR-004**: System MUST keep the workout structure consistent (ordered segments, ordered exercises per segment, no broken references).
- **FR-005**: System MUST expose the data so other systems can consume it (e.g. Timer Generator, Fatigue System, equipment calculator).
- **FR-006**: System MUST model exercises with identity, name, type (strength, crossfit, mobility, or combinations), and optional equipment, muscle targets (primary and stabilizing), and working-weight or rep-max information.
- **FR-007**: System MUST model segments with identity, name, and an ordered list of assigned exercises, where each assignment can store either optional sets/repetitions or metric targets depending on the exercise type.
- **FR-008**: System MUST model workouts with identity, name, ordered segments, and optional rest-between-segments (e.g. in minutes).
- **FR-009**: Users MUST be able to search exercises from within the segment flow; focusing the search field MUST show the first 10 available exercises and typing MUST filter the available exercise list.
- **FR-010**: Exercise records MUST remain the single source of truth for workout-building flows, even when surfaced through a lightweight search-first UX backed by a mock database in phase 1.
- **FR-011**: System MUST allow strength-style assigned exercises inside a segment to store optional sets and optional repetitions without requiring those values for time-based or duration-based scenarios.
- **FR-012**: System MUST allow metric-style exercises (for example row, bike, or run) to store metric targets such as calories, distance, speed, or similar measures instead of sets/repetitions.
- **FR-013**: System MUST support extension points so the Timer Generator, Fatigue System, and workout auto-generation can be added later without reworking core workout data.

### Assumptions

- Workout Builder and Exercise Database are single-user for this phase; collaboration and sharing are out of scope.
- EMOM and other segment types are represented as structured metadata and examples; active timer execution is a later phase.
- Data persistence is required for workouts and exercises; multi-device sync is not required in this phase.
- User authentication and profile management exist outside this feature scope.

## Domain Entities

Define only **conceptual entities**, not implementation details.

### Exercise

Represents a physical movement. Attributes may include: name; type (strength, conditioning, mobility, or combinations); movement pattern; involved muscles (primary and stabilizing); required equipment; optional working weight or rep-max; and a prescription mode that determines whether the movement uses sets/repetitions or metric targets.

### Segment

Represents a block of a workout. Examples: AMRAP, EMOM, For Time, Strength Sets. Attributes may include: segment type; duration; rest interval; ordered list of assigned exercises.

### Assigned Exercise

Represents an exercise placed into a segment. Attributes may include: linked exercise record; optional sets; optional repetitions; optional metric targets such as calories, distance, or speed; order within the segment.

### Workout

Represents a complete training session. Attributes may include: ordered segments; total duration; optional rest between segments; required equipment (derived); generated timers (later phase).

### Equipment

Represents gear required for an exercise or workout. The domain model must support listing and aggregating equipment from exercises and segments.

### Muscle Group

Represents muscle involvement (primary and stabilizing). The domain model must support muscle targets for exercises so the Fatigue System and programming logic can consume them.

---

## Non-Functional Requirements

**Performance**: UI interactions for building and editing workouts and exercises should feel instantaneous.

**Scalability**: The data model must support hundreds of exercises and many workouts without degradation.

**Maintainability**: Business logic for validation, ordering, and domain rules must not live inside UI components; the plan will define separation of domain, feature, and UI layers.

---

## Example Workout Data (CrossFit-Style EMOM)

The following illustrates the domain structure. Implementations will follow the constitution’s data model (e.g. strict types for Exercise, Segment, Workout).

```json
{
  "id": "wod-1001",
  "name": "EMOM Engine Builder",
  "restBetweenSegments": 2,
  "segments": [
    {
      "id": "seg-1",
      "name": "EMOM 12 - Lower Body Push",
      "exercises": [
        {
          "id": "assigned-1",
          "exerciseId": "ex-101",
          "sets": 5,
          "repetitions": 3,
          "exercise": {
            "id": "ex-101",
            "name": "Front Squat",
            "type": ["strength", "crossfit"],
            "equipment": ["barbell", "rack"],
            "muscles": {
              "primary": ["quadriceps", "glutes"],
              "stabilizing": ["core", "erectors"]
            },
            "workingWeight": {
              "mode": "weight",
              "value": 70
            }
          }
        },
        {
          "id": "assigned-2",
          "exerciseId": "ex-102",
          "exercise": {
            "id": "ex-102",
            "name": "Burpee Over Bar",
            "type": ["crossfit"],
            "equipment": ["barbell"],
            "muscles": {
              "primary": ["chest", "shoulders"],
              "stabilizing": ["core"]
            },
            "workingWeight": {
              "mode": "repMax",
              "value": 15
            }
          }
        }
      ]
    },
    {
      "id": "seg-2",
      "name": "EMOM 10 - Pull and Carry",
      "exercises": [
        {
          "id": "assigned-3",
          "exerciseId": "ex-103",
          "repetitions": 15,
          "exercise": {
            "id": "ex-103",
            "name": "Kettlebell Swing",
            "type": ["crossfit", "strength"],
            "equipment": ["kettlebell"],
            "muscles": {
              "primary": ["hamstrings", "glutes"],
              "stabilizing": ["core", "lats"]
            },
            "workingWeight": {
              "mode": "weight",
              "value": 24
            }
          }
        }
      ]
    }
  ]
}
```

## Success Criteria *(mandatory)*

- **SC-001**: User can complete the primary workflow (create a workout with at least two segments and multiple exercises) without errors.
- **SC-002**: Feature integrates with the existing workout domain model (Workout → Segment → Exercise; Equipment and Muscle Group where applicable) and does not introduce parallel structures.
- **SC-003**: Feature does not break future Timer Generator or Fatigue System integration; workout and exercise data remain consumable by those modules.
- **SC-004**: Feature works with at least 10 different exercises in testing; users can create, edit, and reuse exercises and build workouts from them.
- **SC-005**: 90% of pilot users can create a workout with two segments and four exercises in under 5 minutes; invalid exercise assignment is always blocked with clear feedback.
