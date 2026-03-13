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
- `name`: display name; for predefined types (emom, amrap, forTime) this is generated from parameters (e.g. "EMOM 10", "E2:30Om 10", "AMRAP 10:30", "For Time"); only `custom` segments have a user-editable name
- `segmentType`: segment template (`custom`, `emom`, `amrap`, `forTime`)
- `exercises`: ordered list of exercise assignments

### Exercise Assignment Fields

- `id`: unique assignment identifier
- `exerciseId`: id of the reusable source exercise
- `exercise`: embedded exercise snapshot/reference used by the UI
- `sets`: optional numeric set count
- `repetitions`: optional numeric rep count
- `isMaxRepetitions`: optional flag indicating reps are \"max\" until the end of the segment time
- `metricTarget.type`: optional metric kind for metric-based exercises
- `metricTarget.value`: optional numeric metric value
- `metricTarget.isMax`: optional flag indicating that this is a \"max\" effort target (e.g. max calories or max distance until the end of the segment time)

### Type-Specific Fields

- `intervalSeconds`: optional timing interval for EMOM-style segments
- `rounds`: optional set or round count for EMOM-style segments
- `durationSeconds`: optional fixed duration for AMRAP-style segments; UI range slider 1–30 min in 30 s steps
- `timeCapSeconds`: optional cap for For Time-style segments; UI range slider 1–60 min in 30 s steps
- `restInterval`: optional per-segment rest value (minutes); UI uses a range slider 0–10 min in 15 s steps

### Validation Rules

- `id` is required and unique within its parent workout
- `name` is required
- `segmentType` is required and must be one of the supported templates
- `exercises` may be empty during editing but should be validated before a final save if the workflow requires non-empty segments
- `sets`, when provided, must be non-negative (0–10 in current UI range slider)
- `repetitions`, when provided, must be greater than zero (1–50 in current UI range slider) unless `isMaxRepetitions` is true
- metric-based exercises must use a supported metric target; metric value uses type-specific range sliders (e.g. calories 0–500 step 5, distance 0–10000 m step 100, time 0–60 min in 15 s steps). For calories and distance, `metricTarget.isMax` may be true, indicating \"max\" effort until the segment time ends, in which case the value slider is hidden.
- assigned-exercise list item layout: exercise title and actions on top; sets, reps, or measure + value (with optional Max toggle) stacked below
- EMOM segments require `intervalSeconds` and `rounds`
- EMOM interval editing is constrained to 15-second steps with a maximum of 10 minutes in the current UI
- EMOM sets (rounds) are edited via a range control from 1 to 50, step 1, default 10; the sets control is displayed below the interval in the segment editor
- AMRAP segments require `durationSeconds`; duration is edited via range slider 1–30 min, 30 s steps
- For Time segments require `timeCapSeconds`; time cap is edited via range slider 1–60 min, 30 s steps
- `restInterval`, when present, must be zero or greater
- exercise ordering must be stable after insert, remove, and reorder actions
- generated name rules: EMOM with 1:00 interval → "EMOM {rounds}"; EMOM with other interval → "E{mm:ss}Om {rounds}"; AMRAP → "AMRAP {duration mm:ss}"; For Time → "For Time" (no dynamic time in title)

---

## Entity: Workout

**Purpose**: Represents a complete training session assembled in the Workout Builder.

### Core Fields

- `id`: unique string identifier
- `name`: display name for the workout
- `segments`: ordered list of segments

### Validation Rules

- `id` is required
- `name` is required
- `segments` order must be preserved
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
- add via template modal -> inserted with default values for the selected segment type
- rename -> reflected immediately in the workout draft
- reorder -> new order persisted in draft state
- update segment timing -> total measurable time updates for predefined segment types
- update segment rest -> rest is stored on that segment instead of globally on the workout
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
