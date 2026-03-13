# Quickstart: Fitness Workout Builder Foundation

## Goal

Manually validate the phase-1 Workout Builder and Exercise Database flows described in the specification.

---

## Prerequisites

- install dependencies with `npm install`
- run the app with `npm run dev`
- use a browser with the local Vite app open

---

## Scenario 1: Create a Workout Draft

1. Open the app.
2. Create a new workout named `EMOM Engine Builder`.
3. Add two segments.
4. Rename the segments.
5. Confirm the workout name and segment names appear immediately.

Expected result:

- the workout draft is created
- segments appear in order
- no validation errors appear for valid names

---

## Scenario 2: Create Exercises in the Exercise Database

1. Open the Exercise Database UI.
2. Create at least three exercises with different training types.
3. Add optional equipment and muscle metadata to at least one exercise.
4. Edit one exercise and confirm the changes save.

Expected result:

- all valid exercise records appear in the list
- invalid or blank inputs are blocked with clear feedback

---

## Scenario 3: Assign Exercises to Segments

1. Return to the Workout Builder.
2. Add saved exercises to each segment.
3. Attempt to assign an exercise when the database is empty or an invalid selection is made.

Expected result:

- valid exercises are added to the selected segment
- invalid assignment is blocked
- the UI shows clear empty-state or validation guidance

---

## Scenario 4: Reorder and Remove Items

1. Reorder segments in the workout.
2. Reorder exercises inside a segment.
3. Remove one exercise from a segment.
4. Remove one segment.

Expected result:

- ordering updates immediately and remains stable
- removal actions do not create broken state

---

## Scenario 5: Exercise Delete Guard

1. Use an exercise in at least one segment.
2. Attempt to delete that exercise from the Exercise Database.

Expected result:

- the app either blocks deletion or guides the user through corrective action
- the workout structure remains valid

---

## Scenario 6: Future-Ready EMOM Data

1. Load or create a workout that matches the EMOM example structure from `spec.md`.
2. Confirm the workout includes segment structure and enough metadata for future timer logic.

Expected result:

- the workout shape is compatible with Timer Generator and Fatigue System placeholder services

---

## Validation Commands

- `npm run lint`
- `npm run build`

Both commands should complete successfully before implementation is considered ready for review.
