# Tasks: Workout Calendar and Scheduling

**Input**: Design documents from `specs/003-workout-calendar/`  
**Prerequisites**: spec.md, plan.md. Builds on existing workout builder (002) and domain.

**Organization**: Tasks are grouped by user story for independent implementation and testing.

---

## Format

- `[ID] [P?] [Story?] Description` with exact file paths where applicable.
- **[P]**: Can run in parallel when files and dependencies allow.
- **[US1], [US2], [US3]**: User story reference.

---

## Phase 1 — Domain and State (Blocking)

**Purpose**: Add scheduling and completion to the domain and app state so calendar and builder can consume them.

Tasks:

- [ ] T001 [P] Extend Workout type or add Schedule type with `scheduledDate` (date-only) and completion state in `src/types/workout.ts` (or new `src/types/schedule.ts`).
- [ ] T002 Add validation or helper: “is date in the past?” (local date) in `src/services/` (e.g. `workout-domain.ts` or `schedule-utils.ts`).
- [ ] T003 Extend workout builder store (or add calendar store) to hold and update `scheduledDate` and completion; ensure new workouts require a valid date (today or future) before save in `src/store/`.

**Checkpoint**: Domain and state support scheduled date and completion; past-date check available.

---

## Phase 2 — User Story 1: Schedule a Workout for a Date (P1)

**Goal**: User can attach a workout to a date via a date picker; past dates are blocked for creation/save.

**Independent Test**: Create a workout, pick today or a future date, save; try to pick a past date and confirm it is disabled or blocked.

Tasks:

- [ ] T004 [US1] Add date picker UI above (or beside) workout name in builder in `src/components/workout-builder/WorkoutDetailsForm.tsx` (or equivalent).
- [ ] T005 [US1] Wire date picker to state: set `scheduledDate` on the workout/schedule; disable or reject past dates in the picker and on save in `src/store/` and relevant components.
- [ ] T006 [US1] Enforce “valid date required” before saving a new or edited workout (e.g. disable Done or Save until date is set and not in past) in `src/components/workout-builder/` and validation.

**Checkpoint**: Every saved workout has a date (today or future); no workouts can be created for past days.

---

## Phase 3 — User Story 2: Execute Any Scheduled Workout (P2)

**Goal**: User can open and start any scheduled workout from the calendar regardless of its date.

Tasks:

- [ ] T007 [US2] From calendar (or list), open a workout by ID and load it into the execution flow (board + timer) in `src/App.tsx` or router and `src/components/workout-builder/WorkoutBoard.tsx`.
- [ ] T008 [US2] Ensure no date check is applied when starting the timer or showing the board; execution is always allowed for any scheduled workout.

**Checkpoint**: Workouts scheduled in the past or future can be started and run like today’s workouts.

---

## Phase 4 — User Story 3: Calendar Page and Indicators (P3)

**Goal**: Calendar page shows which days have workouts and which are completed (e.g. checkmark).

Tasks:

- [ ] T009 [US3] Add calendar page or view: month-style calendar with navigation in `src/components/calendar/` (or under existing structure).
- [ ] T010 [US3] For each day, show an indicator if at least one workout is scheduled; show a distinct indicator (e.g. checkmark) if the workout for that day is completed, using completion state from state/store.
- [ ] T011 [US3] Allow opening a scheduled workout from the calendar (e.g. click day or indicator) to view or execute it; wire to existing board/timer flow.
- [ ] T012 [US3] Persist completion state so that after a user completes a workout, the calendar shows “completed” when they return (in-memory or later persistence).

**Checkpoint**: User can open the calendar, see scheduled vs completed, and open/execute any workout.

---

## Phase 5 — Polish and Integration

**Purpose**: Navigation to calendar, default date (e.g. today), and any spec/plan/doc updates.

Tasks:

- [ ] T013 Add navigation to the calendar page from the main app (e.g. nav link or tab) in `src/App.tsx` or layout.
- [ ] T014 When creating a new workout, default `scheduledDate` to today so the date picker is pre-filled.
- [ ] T015 Update spec or data-model notes if any entity names or rules change during implementation.

**Checkpoint**: Calendar is reachable from the app; new workouts default to today; docs aligned.

---

## Dependencies

- Phase 1 must be done before Phase 2, 3, 4.
- Phase 2 (US1) can be done before or in parallel with Phase 3/4 once T001–T003 are done.
- Phase 3 and 4 can be parallelized by different files where possible (e.g. execution flow vs calendar UI).
