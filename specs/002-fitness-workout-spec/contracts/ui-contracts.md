# UI Contracts: Fitness Workout Builder Foundation

## Purpose

This document defines the interface contracts between the Workout Builder UI, Exercise Database UI, centralized state, and deterministic service modules.

---

## Design system compliance

All surfaces described in these contracts MUST follow **`.specify/memory/constitution.md`** — **UI styling system (Tailwind + semantic tokens)**:

- **Surfaces** (backgrounds, panels, cards): use only **semantic tokens** from `tailwind.config.js` (e.g. `surface-*`, `text-*`, `border-*`).
- **Interactive controls**: MUST define **hover** and **active** states, use **`duration-200`** + **`ease-in-out`** transitions, and provide **immediate visual feedback** (including disabled/loading/success/error affordances).
- **Validation and status feedback**: errors and warnings use **danger** tokens; success and OK paths use **success** tokens; muted copy uses **text-muted** (or equivalent token).
- **No** inline `style` for presentation, **no** hardcoded hex/rgb/hsl in components, **no** default Tailwind palette utilities (`gray-*`, `blue-*`, etc.).

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

---

## Contract 6: Workout Board — Equipment required

**Responsibilities**:

- After the user clicks **Done**, the **Workout Board** shows a read-only workout layout. Below the segment list (the main `boardContent` section), when the workout has at least one non-empty equipment label after aggregation, show a block titled **“Equipment required”** listing all required gear.

**Inputs**:

- Workout snapshot passed to `WorkoutBoard` (same as today).
- Aggregated list from `getWorkoutRequiredEquipment(workout)` in `src/services/workout-equipment.ts`.

**Outputs**:

- Visual list (e.g. unordered list) of equipment strings, one per line, **sorted** and **deduplicated** per `research.md` Decision 6.
- When the aggregated list is **empty**, **render nothing** for this block (no heading, no empty state).

**Rules**:

- Board must **not** compute aggregation inline; it calls the service helper (domain logic in `src/services/`).
- Styling must use **semantic Tailwind tokens** via `src/ui/tw.ts` (e.g. panel/border/text tokens consistent with other board sections). No hardcoded colors or default palette utilities in components.
- Timer embed and header actions are unchanged; equipment block appears **below** segments, still inside the board shell flow.
