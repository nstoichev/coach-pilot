# Data Model: Fitness Workout Builder Foundation

## Overview

This feature centers on a reusable Workout -> Segment -> Assigned Exercise -> Exercise domain model with supporting concepts for Equipment, Muscle Group, and working-weight metadata. The model must remain strict enough to support future Timer Generator, Fatigue System, and workout auto-generation modules.

---

## Entity: Exercise

**Purpose**: Represents a reusable physical movement definition stored in the Exercise Database.

### Core Fields

- `id`: unique string identifier
- `name`: display name for the exercise
- `type`: one or more training-type tags
- `equipment`: optional list of equipment names or refs
- `muscles`: optional primary and stabilizing muscle groups
- `workingWeight`: optional workload descriptor
- `prescription`: assignment style for the exercise (`sets-reps` or metric-based)

### Supporting Structures

- `type` values: `strength`, `crossfit`, `mobility`
- `muscles.primary`: list of primary muscle groups
- `muscles.stabilizing`: list of stabilizing muscle groups
- `workingWeight.mode`: `weight` or `repMax`
- `workingWeight.value`: numeric value tied to the selected mode
- metric-based exercises can expose metric options such as `calories`, `distance`, `speed`, or `time`

### Validation Rules

- `id` is required and unique within the Exercise Database
- `name` is required and cannot be blank
- `type` must contain at least one allowed training-type value
- `equipment` entries, when present, should be trimmed and non-empty
- `workingWeight.value` must be positive when `workingWeight` is supplied

---

## Entity: Segment

**Purpose**: Represents an ordered workout block inside a workout draft.

### Core Fields

- `id`: unique string identifier
- `name`: display name for the segment
- `exercises`: ordered list of exercise assignments

### Exercise Assignment Fields

- `id`: unique assignment identifier
- `exerciseId`: id of the reusable source exercise
- `exercise`: embedded exercise snapshot/reference used by the UI
- `sets`: optional numeric set count
- `repetitions`: optional numeric rep count
- `metricTarget.type`: optional metric kind for metric-based exercises
- `metricTarget.value`: optional numeric metric value

### Optional Future-Ready Fields

- `segmentType`: optional category such as `emom`, `amrap`, `forTime`, `strength`
- `duration`: optional numeric duration metadata
- `restInterval`: optional rest metadata

### Validation Rules

- `id` is required and unique within its parent workout
- `name` is required
- `exercises` may be empty during editing but should be validated before a final save if the workflow requires non-empty segments
- `sets`, when provided, must be greater than zero
- `repetitions`, when provided, must be greater than zero
- metric-based exercises must use a supported metric target instead of sets/repetitions
- exercise ordering must be stable after insert, remove, and reorder actions

---

## Entity: Workout

**Purpose**: Represents a complete training session assembled in the Workout Builder.

### Core Fields

- `id`: unique string identifier
- `name`: display name for the workout
- `segments`: ordered list of segments
- `restBetweenSegments`: optional workout-level rest value in minutes

### Validation Rules

- `id` is required
- `name` is required
- `segments` order must be preserved
- `restBetweenSegments`, when present, must be zero or greater
- workouts cannot contain broken references to missing exercises

---

## Supporting Concept: Equipment

**Purpose**: Represents the gear required by an exercise or derived for a workout.

### Fields

- `name`: equipment label
- `sourceExerciseIds`: optional derived list of related exercise IDs

### Usage

- supports future equipment aggregation
- supports validation and coaching awareness for facility constraints

---

## Supporting Concept: Muscle Group

**Purpose**: Represents a muscle category used for movement targeting and future fatigue calculations.

### Fields

- `name`: muscle group label
- `role`: `primary` or `stabilizing`

### Usage

- supports programming logic and the Fatigue System

---

## Relationships

- One `Workout` has many ordered `Segment` items
- One `Segment` has many ordered exercise assignments
- One exercise assignment refers to one reusable `Exercise`
- One `Exercise` may be used in many segments across many workouts
- One `Exercise` may reference many equipment items and muscle groups

---

## State Model Notes

The UI needs a centralized builder state that combines:

- exercise records in the mock exercise database / source data
- current workout draft
- validation errors and warnings
- selected exercise / editing targets

This state is application-level state, not part of the persisted domain record itself.

---

## State Transitions

### Exercise transitions

- create -> available in Exercise Database
- edit -> updated everywhere the reusable record is referenced
- delete -> removed only when safe, or blocked with guidance if referenced

### Segment transitions

- add -> inserted into workout order
- rename -> reflected immediately in the workout draft
- reorder -> new order persisted in draft state
- remove -> segment deleted and draft revalidated
- assign exercise via search -> exercise assignment inserted into the selected segment
- update assigned sets/reps -> assignment updated without changing the underlying source exercise
- update assigned metric target -> metric-based assignment updated without changing the underlying source exercise

### Workout transitions

- create -> empty draft initialized
- edit -> metadata and segment changes reflected in centralized state
- validate -> builder checks name, structure, and exercise references

---

## Example Shape Notes

The example EMOM workout in `spec.md` demonstrates the intended nested structure:

- workout metadata at top level
- ordered segments
- per-segment exercise assignments with optional sets/repetitions or metric targets
- future-ready timing metadata

The implementation may internally normalize some references, but the domain contract exposed to the application must remain compatible with the specification.
