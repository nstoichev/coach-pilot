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
- **[Story]** = User story reference (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
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

Goal: Implement the minimum usable Workout Builder for creating workouts, adding predefined segment types through a selection modal, assigning exercises through search, setting optional sets/reps or metric targets, and reordering or removing items.

Independent Test:

Create a workout with at least two segments, add one through the segment-type modal as EMOM and confirm it starts with interval `1:00` and sets `10`, adjust the interval with the slider up to `10:00` in `0:15` steps, adjust sets with the range slider (1–50, default 10) below the interval, set per-segment rest with the 0–10 min slider, search and assign existing exercises to each segment, define either optional sets/reps or metric targets depending on the exercise, update measurable segment timing, and confirm reordering remains valid in the UI.

Tasks:

- [x] T013 [P] [US1] Create the workout builder container in `src/components/workout-builder/WorkoutBuilder.tsx`
- [x] T014 [P] [US1] Create the workout details form and segment-type modal entry point in `src/components/workout-builder/WorkoutDetailsForm.tsx`
- [x] T015 [P] [US1] Create the segment list UI in `src/components/workout-builder/SegmentList.tsx`
- [x] T016 [P] [US1] Create the segment editor UI with type-specific timing controls (EMOM interval and sets range sliders, sets below interval), per-segment rest slider, and footer total-time display in `src/components/workout-builder/SegmentEditor.tsx`
- [x] T017 [US1] Implement workout and segment actions with predefined segment defaults in `src/store/workout-builder-store.ts`
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

- [x] T026 [P] [US3] Create the Timer Generator placeholder contract in `src/services/timer-generator.ts`
- [x] T027 [P] [US3] Create the Fatigue System placeholder contract in `src/services/fatigue-system.ts`
- [x] T028 [P] [US3] Create the workout auto-generation placeholder contract in `src/services/workout-generator.ts`
- [x] T029 [US3] Extend segment metadata for future EMOM and timer support in `src/types/segment.ts`
- [x] T030 [US3] Add CrossFit-style EMOM mock workout data in `src/services/mock-workouts.ts`
- [x] T031 [US3] Surface future-feature placeholders in the builder shell in `src/components/workout-builder/WorkoutBuilder.tsx`

Checkpoint: User Story 3 is functional as a future-ready extension layer.

---

# Phase 6 — User Story 4: Workout Board and Timer (P4)

Goal: User can click Done (when valid), see the Workout Board in CrossFit-style layout, and start a smart timer that runs as a single continuous flow (work → rest → next segment) with one counter at a time; For Time shows Stop and Finish; Death by shows 1:00 countdown per round until user stops.

Independent Test: See spec **Workout Timer — Detailed Behavior**. Build a workout with two+ time-measurable segments (e.g. AMRAP 1:00, rest 0:15, AMRAP 1:00, rest 0:15, For Time 2:00 cap), click Done, Start. Confirm single counter only (no "Not set", no "elapsed / total"); "Work: M:SS" countdown then "Rest: M:SS" countdown; auto-advance to next segment; For Time count-up with Stop; "Finish" then workout complete. For Death by: add a Death by segment with one or more exercises, no interval/rounds/sets; board shows "Death by …"; Start runs 1:00 countdown per round; Stop ends segment and advances; round when stopped does not count (future: completed rounds).

Tasks:

- [x] T037 [US4] Add "Done" button to the builder shell; wire to existing validation so it is disabled when `state.validationErrors` (workout name or segments) has any error in `src/components/workout-builder/WorkoutBuilder.tsx` (or a dedicated bar component used by it). Button visible in builder view only.
- [x] T038 [US4] Introduce app/shell state or route to switch between "builder" and "board" view (e.g. `showWorkoutBoard: boolean` in state or context, set true when Done is clicked) in `src/App.tsx` and/or `src/store/workout-builder-store.ts` (or new slice for UI mode).
- [x] T039 [US4] Create WorkoutBoard component: accepts the current workout (finalized snapshot when Done was clicked), renders CrossFit-style layout (segment header, exercise lines, Rest: X) in `src/components/workout-builder/WorkoutBoard.tsx`.
- [x] T040 [US4] Implement board formatting helpers: segment title line (e.g. "AMRAP 3`", "EMOM 10`", "For Time") and one line per exercise (e.g. "8 KB Swing", "Max cal Row", "5 Front Squats") in `src/services/workout-domain.ts` or `src/services/workout-board-format.ts`.
- [x] T041 [US4] On Workout Board, add "Start" button; show/enable only when workout is time-measurable (at least one segment is EMOM, AMRAP, or For Time with required timing) in `src/components/workout-builder/WorkoutBoard.tsx`; reuse or extend `getSegmentEstimatedDurationSeconds` / timer-generator to determine "time-measurable".
- [x] T042 [US4] Implement timer execution: when Start is clicked, run the smart timer from the segment structure (use or extend `getTimerStructure`). For EMOM/AMRAP, advance automatically; for For Time, show "Stop" and wait for user click in `src/services/timer-generator.ts` (extend) and/or `src/components/workout-builder/WorkoutTimer.tsx` (new) and state for timer run (current segment, elapsed, running, stopped).
- [x] T043 [US4] On Workout Board, add "Back to build" (or "Edit workout") that clears board view and returns to builder; same files as T038 and WorkoutBoard.
- [x] T044 [US4] When workout has any For Time segment, timer UI must display "Stop" (or equivalent) and record completion on user action; same files as T042.
- [x] T045 [US4] Add validation rule: any segment with zero exercises must produce a validation error (e.g. "Segment must have at least one exercise") so Done stays disabled. Implement in `src/services/workout-validation.ts` (e.g. in `validateSegment` or `validateWorkout`); ensure `WorkoutBuilder` Done button remains gated by `state.validationErrors` (already includes segment-level errors).
- [x] T046 [US4] Apply distinct segment card visual states: segments with no exercises use incomplete/warning styling; segments with at least one exercise use active/success styling. Add CSS classes (e.g. `segment-card-empty`, `segment-card-has-exercises`) in `src/App.css` and apply them in `src/components/workout-builder/SegmentEditor.tsx` (or segment list) based on `segment.exercises.length`.
- [x] T047 [US4] Align workout timer with spec **Workout Timer — Detailed Behavior**: single continuous flow; one counter only (no "Not set" on start, no "elapsed / total" display); labels "Work: M:SS" and "Rest: M:SS"; work phases count down (EMOM/AMRAP) or count up (For Time); rest phases count down; auto-advance through all segments and rest in order; For Time shows Stop button and "Finish" on completion; workout complete when all phases done. Rest in minutes converted to seconds. Implement in `src/components/workout-builder/WorkoutTimer.tsx` and any timer/segment sequencing logic.
- [x] T048 [US4] EMOM timer per-interval countdown: in `buildPhases` in `src/components/workout-builder/WorkoutTimer.tsx`, expand EMOM segments into one work phase per round, each with `durationSeconds = intervalSeconds` (from timer structure / workout segment), so the user sees a countdown per interval (e.g. "E0:15MOM 3" → three "Work: 0:15" countdowns). Rest after the segment runs only after all EMOM rounds complete. Document in spec **Workout Timer — Detailed Behavior** (EMOM bullet and example).
- [ ] T049 [US4] Add **Death by** segment type: add `deathBy` to `SEGMENT_TYPES` in `src/types/domain.ts`. No new segment fields required (no interval/rounds/sets; performance-dependent).
- [ ] T050 [US4] Death by in builder: add "Death by" option to segment type modal in `src/components/workout-builder/SegmentTypeModal.tsx`; when selected, create segment with `segmentType: 'deathBy'` and no `intervalSeconds`, `rounds`, `durationSeconds`, or `timeCapSeconds` in `src/store/workout-builder-store.ts`. In `src/components/workout-builder/SegmentEditor.tsx`, for Death by segments hide interval, rounds, duration, time cap, and per-segment rest sliders (or show rest only—per spec, rest after segment is still allowed). Hide Sets slider for exercises in Death by (same as EMOM/AMRAP/For Time) in `src/components/workout-builder/SegmentEditor.tsx`.
- [ ] T051 [US4] Death by generated name and board: in `src/services/workout-domain.ts`, add `deathBy` case to `getGeneratedSegmentName` returning "Death by {exercise names}" (e.g. "Death by Burpees" or "Death by Burpees + Kettlebell Swings"). In `src/services/workout-board-format.ts`, add `deathBy` case to `getBoardSegmentTitle` with same format. In `src/services/workout-board-format.ts`, extend `isWorkoutTimeMeasurable` so workouts with at least one `deathBy` segment (with at least one exercise) are time-measurable. In `src/services/workout-domain.ts`, `getSegmentEstimatedDurationSeconds` for `deathBy` returns `undefined` (no fixed duration).
- [ ] T052 [US4] Timer structure for Death by: in `src/services/timer-generator.ts`, include Death by segments in `getTimerStructure` (e.g. `segmentType: 'deathBy'`, no fixed `durationSeconds`). In `src/components/workout-builder/WorkoutTimer.tsx`, in `buildPhases`, emit a single work phase for each Death by segment with fixed 60 s duration and a flag (e.g. `isDeathBy: true`) so the timer can treat it as repeat-until-stop.
- [ ] T053 [US4] Death by timer behavior: in `src/components/workout-builder/WorkoutTimer.tsx`, for Death by work phases run 1:00 countdown; when countdown reaches 0, do not advance to next phase—increment round (UI optional) and reset countdown to 60 s (same segment). Show **Stop** button; when user clicks Stop, advance to rest (if segment has rest) or next segment. Do not persist completed rounds in this phase (future performance data). Ensure phase transition and label show "Work: 1:00".
- [x] T054 [US4] Death by: hide Reps slider and Max-reps toggle for exercises in Death by segments (reps = round number 1, 2, 3…). In `src/components/workout-builder/SegmentEditor.tsx`, when `segment.segmentType === 'deathBy'` and exercise is sets-reps, do not render the Reps field or Max toggle; show a short note (e.g. "Reps = round number (1, 2, 3…). No rep slider for Death by."). Document in spec (FR-020b) and data-model.

Checkpoint: User can complete flow: build → Done (disabled when invalid) → board → Start (if time-measurable) → timer runs as continuous series (Work → Rest → next segment); single counter; EMOM per-interval countdown; For Time Stop/Finish; **Death by** 1:00 countdown per round with Stop (no sets/rounds/interval in builder); workout complete. Segment cards show empty vs complete state.

Dependencies: Phase 5 complete (timer-generator contract and validation already exist). No new persistence required for this phase (board shows current draft; optional: snapshot draft on Done for board so edits do not change board until Done again).

---

# Phase 6c — Chipper segment (US4)

Purpose: Add **Chipper** segment type—long list of movements performed once each (user "chips away"); timer is a stopwatch like For Time (count up to time cap, Stop button, Finish). Exercises have reps only (no sets).

Independent Test: Add a Chipper segment from the segment-type modal; set time cap; add exercises with reps only (no Sets slider); click Done → board shows "Chipper (M:SS cap)" and exercise lines; Start → timer counts up, Stop shows Finish, then advance.

Tasks:

- [x] T057 [US4] Add **Chipper** segment type: add `chipper` to `SEGMENT_TYPES` in `src/types/domain.ts`. In `src/store/workout-builder-store.ts`, add `createSegmentTemplate('chipper')` with `timeCapSeconds` (e.g. 1800), no rounds. In `src/components/workout-builder/SegmentTypeModal.tsx`, add "Chipper" option.
- [x] T058 [US4] Chipper in builder and board: in `src/components/workout-builder/SegmentEditor.tsx`, for Chipper show time cap slider only (no Rounds); show type badge "Chipper". In `src/services/workout-domain.ts`, add `chipper` case to `getGeneratedSegmentName` ("Chipper" or "Chipper (M:SS cap)") and `getSegmentEstimatedDurationSeconds` (return `timeCapSeconds`). In `src/services/workout-board-format.ts`, add `chipper` to `getBoardSegmentTitle`; `isWorkoutTimeMeasurable` already includes chipper via duration. Hide Sets for exercises in Chipper (same as other predefined types—already hidden when segment type is not Custom).
- [x] T059 [US4] Chipper timer: in `src/services/timer-generator.ts`, use `getGeneratedSegmentName` for chipper segment name. In `src/components/workout-builder/WorkoutTimer.tsx`, in `buildPhases` set `isForTime: seg.segmentType === 'forTime' || seg.segmentType === 'chipper'` so Chipper uses count-up, time cap, and Stop/Finish like For Time.

Checkpoint: User can add Chipper segment, set time cap, add exercises (reps only), see board and run timer (stopwatch + Stop/Finish).

---

# Phase 6d — Tabata segment (US4)

Purpose: Add **Tabata** segment type—20 s work / 10 s rest × 8 rounds by default; user can set work and rest 10–60 s and rounds. Exercises have no sets or reps; number of exercises must not exceed rounds. Timer alternates work countdown and rest countdown per round.

Independent Test: Add a Tabata segment; set work 20 s, rest 10 s, 8 rounds; add up to 8 exercises (no sets/reps); click Done → board shows "Tabata 0:20/0:10 × 8"; Start → timer shows Work 0:20 countdown, Rest 0:10 countdown, repeated for 8 rounds, then segment rest or next segment. Reduce rounds to 4 and confirm "Add exercise" is disabled when 4 exercises are present; validation errors if exercises > rounds.

Tasks:

- [x] T060 [US4] Add **Tabata** segment type: add `tabata` to `SEGMENT_TYPES` in `src/types/domain.ts`. Add `workSeconds` and `restSeconds` to Segment in `src/types/segment.ts`. In `src/store/workout-builder-store.ts`, add `createSegmentTemplate('tabata')` with `workSeconds: 20`, `restSeconds: 10`, `rounds: 8`. In `src/components/workout-builder/SegmentTypeModal.tsx`, add "Tabata" option.
- [x] T061 [US4] Tabata in builder: in `src/components/workout-builder/SegmentEditor.tsx`, add Tabata config (Work 10–60 s, Rest 10–60 s, Rounds e.g. 4–20 default 8); show type badge "Tabata"; hide prescription-stack for tabata (`segment.segmentType !== 'tabata'`). Cap exercises: disable "Add exercise" when `segment.segmentType === 'tabata'` and `segment.exercises.length >= (segment.rounds ?? 8)`; show "Max N exercises (one per round)" when at cap. In `src/services/workout-validation.ts`, add Tabata validation: workSeconds 10–60, restSeconds 10–60, rounds ≥ 1, and **exercises.length ≤ rounds**.
- [x] T062 [US4] Tabata domain, board, timer: in `src/services/workout-domain.ts`, add `tabata` to `getGeneratedSegmentName` ("Tabata {work}/{rest} × {rounds}") and `getSegmentEstimatedDurationSeconds` (rounds * (workSeconds + restSeconds)). In `src/services/workout-board-format.ts`, add `getBoardSegmentTitle` for tabata. In `src/services/timer-generator.ts`, add workSeconds, restSeconds, rounds to TimerSegmentInfo and map for tabata; duration = rounds * (work + rest). In `src/components/workout-builder/WorkoutTimer.tsx`, in `buildPhases` add Tabata block: for each round push work phase (duration workSeconds) and rest phase (restSeconds); then segment rest if any.

Checkpoint: User can add Tabata segment, set work/rest/rounds, add up to N exercises (N = rounds), see board and run timer (alternating work/rest per round).

---

# Phase 6e — Add segment modal: search (US1)

Purpose: Change the "Add segment" modal to use the same method and logic as "Add exercise": search input with options listed below; user can type to filter and click to select a segment format.

Independent Test: Click "Add segment"; modal shows search input and list of segment types (e.g. EMOM, AMRAP, Tabata, …). Type "tabata" → list filters to Tabata; click Tabata → segment added and modal closes. Type "em" → list shows EMOM; select to add. Empty search shows all formats (up to 10).

Tasks:

- [x] T063 [US1] Replace segment-type grid with search-and-select in `src/components/workout-builder/SegmentTypeModal.tsx`: add search input (placeholder e.g. "Search segment format (e.g. Tabata, EMOM)"), filter segment options by query (title, type, optional search terms); show filtered options in a list below using same classes as exercise picker (`search-picker`, `search-input`, `search-results`, `search-result-item`). On option click, call `onSelectSegmentType` and close modal. Auto-focus search when modal opens; clear query on open. Document in spec FR-013.

Checkpoint: Add segment modal uses search + list; user can search and select a format like Add exercise.

---

# Final Phase — Polish

Purpose: Finish presentation, documentation, and shared exports needed across the whole feature.

Tasks:

- [x] T032 [P] Update the main application layout and builder styles in `src/App.css`
- [ ] T033 [P] Update global styling defaults for the Coach Pilot shell in `src/index.css`
- [ ] T034 [P] Document architecture, data flow, and extension guidance in `README.md`
- [x] T035 Update workout builder exports in `src/components/workout-builder/index.ts`
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
6. User Story 4 (Workout Board and Timer) — must be done before continuing with other work
7. Polish

Story dependency graph:

`Setup -> Foundations -> US1 -> US2 -> US3 -> US4 -> Polish`

Rules:

- Domain model and validation must exist before UI integration.
- Centralized state must exist before builder and exercise-management components are wired.
- User Story 1 is the recommended MVP scope.
- User Story 2 depends on the shared state from Foundations and benefits from the builder shell in User Story 1.
- User Story 3 depends on the finalized domain model from Foundations and the builder structure from User Story 1.
- User Story 4 (Workout Board and Timer) depends on Phase 5 (timer-generator contract and validation); must be completed before Polish or next features.

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

Parallel User Story 4 tasks (where independent):

- T039 `src/components/workout-builder/WorkoutBoard.tsx`
- T040 `src/services/workout-domain.ts` or `src/services/workout-board-format.ts`

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
3. Complete Phase 6 (Done, Board, Timer) before Polish or next features.
4. Finish with Polish for styles, docs, and export cleanup.

Each story should add usable value without breaking previous flows.

---

# Related feature: Segment repetition generation (004)

**Workout Segment Repetition Generation** extends the builder with optional `repScheme` / `repSequence` on segments (linear, pyramid, fixed; blur-time correction; preview; totals). Implementation tasks live in a separate list:

- **`specs/004-segment-repetition-generation/tasks.md`** (T001–T020) and **`specs/004-segment-repetition-generation/spec.md`**
- **Code touchpoints (post–Phase 7):** `src/services/repetition-generation.ts`, `src/components/workout-builder/SegmentRepGenerationPanel.tsx`, `applyRepSequenceToSetsRepsRepetitions` in `src/services/workout-domain.ts`, non-blocking validation policy for `repSequence` in `src/services/workout-validation.ts`

Do not duplicate 004 tasks here; extend the builder via the 004 task list.

---

# Notes

- All tasks follow the required checklist format: checkbox, task ID, optional `[P]`, required `[US#]` in story phases, and an exact file path.
- Because `plan.md` is not available yet, these tasks are derived from `spec.md`, the project constitution, the current `src/` structure, and the existing React/Vite setup in `package.json`.
- No extension hooks were found in `.specify/extensions.yml`.
