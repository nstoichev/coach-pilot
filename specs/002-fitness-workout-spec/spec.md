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
- **Place in the app**: Workout Builder (create/edit workouts and segments, search and assign exercises, set optional sets/reps or metric targets); exercise data is available through a lightweight search experience backed by a mock database in phase 1. Placeholders are set for Timer Generator, Fatigue System, and workout auto-generation. The Calendar feature (see `specs/003-workout-calendar/spec.md`) will attach workouts to dates and provide a calendar view and execution entry point.

---

## User Scenarios & Testing *(mandatory)*

User stories represent **independent user journeys** that provide value even if implemented alone. Stories are ordered by priority.

---

### User Story 1 — Build a Structured Workout (Priority: P1)

As a coach or trainee, I can create a workout, add multiple segments, and add exercises to each segment so I can plan complete sessions in one place.

**Why this priority**: Workout creation is the core business value for phase 1; without this, the product does not provide practical planning utility.

**Independent Test**: Can be fully tested by creating a workout with at least two segments and multiple exercises, then saving and reloading it with structure intact.

**Acceptance Scenarios**:

1. **Given** an empty workout builder, **When** the user clicks add segment, **Then** the user must first choose a segment template such as Custom, EMOM, AMRAP, For Time, Death by, Chipper, or Tabata before the segment is added.
2. **Given** a segment exists, **When** the user focuses the exercise search field, **Then** the first 10 available exercises are shown and can be filtered by typing.
3. **Given** a segment exists, **When** the user selects a search result, **Then** the exercise is added to that segment and the user can define either optional sets/repetitions or metric targets depending on the exercise type.
4. **Given** the user selects an EMOM segment template, **When** the segment is created, **Then** it starts with default parameters of interval `1:00` and sets `10`, and the total measurable time is shown.
5. **Given** a measurable segment type such as EMOM, AMRAP, or For Time, **When** the user edits its timing parameters, **Then** the UI updates the total segment time when it can be calculated.
6. **Given** a workout has segments and exercises, **When** the user reorders items, **Then** the new order is preserved and reflected immediately.
7. **Given** a sets/reps exercise is assigned to an EMOM, AMRAP, For Time, Death by, Chipper, or Tabata segment, **When** the user views the exercise prescription, **Then** the Sets range slider is not shown (segment structure or format provides the sets role). **Given** the same exercise type in a Custom segment, **When** the user views the prescription, **Then** the Sets range slider is shown. **Given** a sets/reps exercise is assigned to a **Death by** segment, **When** the user views the prescription, **Then** the Reps range slider and Max-reps toggle MUST NOT be shown, because the format is strict (reps = round number: 1, 2, 3…). **Given** a **Chipper** segment, **When** the user views the prescription, **Then** only Reps (and optional Max-reps) are shown; Sets are not shown (one pass through the list). **Given** a **Tabata** segment, **When** the user views the prescription, **Then** no sets or reps options are shown (exercises are listed only; one exercise per round). The number of exercises MUST NOT exceed the number of rounds; the UI MUST prevent adding more exercises than rounds and validation MUST report an error if exercises exceed rounds.
8. **Given** a metric exercise that supports advanced metrics (e.g. Row), **When** the user views the prescription, **Then** an \"Advanced settings\" button is shown at the bottom; **When** the user clicks it, **Then** optional range sliders for speed and watts (or other declared advanced metrics) are revealed; **When** the user clicks again, **Then** the advanced sliders are hidden.
9. **Given** segment cards in the builder, **When** a segment has at least one exercise assigned, **Then** the card MUST display an active/success visual state (e.g. border or accent) so the user can see it is complete. **When** a segment has no exercises, **Then** the card MUST display a distinct incomplete/warning visual state so the user can see it still needs exercises before the workout can be completed.

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

**Implementation (Phase 5)**: Placeholder contracts exist in `timer-generator.ts`, `fatigue-system.ts`, and `workout-generator.ts`; they consume the workout domain and return stub results. Segment types are documented as ready for timer/EMOM consumption. CrossFit-style EMOM mock workout data is provided in `mock-workouts.ts`. The builder shell surfaces an "Extension points" panel that confirms the draft is consumable by the Timer Generator (segment count reported).

---

### User Story 4 — Workout Board and Timer (Priority: P4)

As a coach or trainee, when I finish building a workout I can click "Done" to see a clean Workout Board and, when the workout is time-measurable, start a smart timer; For Time segments require me to click "Stop" when I finish the effort.

**Why this priority**: Completes the builder flow with a clear done action and a runnable view (board + timer) without leaving the app.

**Independent Test**: Build a workout with two or more time-measurable segments (e.g. AMRAP 1:00, rest 0:15, AMRAP 1:00, rest 0:15, For Time 2:00 cap), click Done, see the board, click Start. Confirm the timer shows a single counter only (no "Not set" at start, no "elapsed / total"); that it shows "Work: 1:00" countdown, then "Rest: 0:15" countdown, then the next work and rest, then "Work: 2:00" count-up with Stop button; that clicking Stop or reaching the cap shows "Finish" and then workout complete. For EMOM (e.g. E0:15MOM 3), confirm the timer shows **one countdown per interval** (e.g. "Work: 0:15" three times), not one long total countdown; rest runs only after all EMOM rounds complete.

**Acceptance Scenarios**:

1. **Given** the builder is displayed, **When** the user looks for a completion action, **Then** a "Done" button is visible (e.g. bottom of build flow or in workout details area). The button is **disabled** when there are any validation errors for workout name or segments (same rules as "Current builder status"), or when **any segment has no exercises assigned**. It is **enabled** only when the workout is structurally valid and every segment has at least one exercise.
2. **Given** the user clicks Done, **When** the workout is valid, **Then** the builder view is replaced (or overlaid) by the **Workout Board** showing the same workout in a simple, CrossFit-style layout.
3. **Given** the Workout Board is displayed, **Then** for each segment the board shows: a segment header (e.g. "AMRAP 3`", "EMOM 10`", "For Time", "Death by Burpees", "Chipper (30:00 cap)"); below it, one line per exercise (e.g. "8 KB Swing", "Max cal Row", "5 Front Squats"); after each segment, "Rest: X" when rest > 0 (minutes). No editing controls; minimal, board-style presentation.
4. **Given** the Workout Board is displayed, **Then** a "Start" button is shown only when the workout is **time-measurable** (at least one segment of type EMOM, AMRAP, For Time, Death by, or Chipper with the required timing/configuration). If the workout has only Custom segments or no time-measurable segment, the workout is valid but **not time-measurable**—Start is hidden or disabled.
5. **Given** the user clicks Start, **Then** the workout timer starts immediately with the first time-measurable segment. The timer MUST display a **single** counter (no "elapsed / total" or "Not set" at start). It MUST automatically advance through every segment and rest in order; see **Workout Timer — Detailed Behavior** below.
6. **Given** the Workout Board is displayed, **Then** the board provides a way to return to the builder (e.g. "Back to build" or "Edit workout") so the user can change the workout and click Done again.
7. **Given** the timer is running and the current phase is a **work** segment (EMOM, AMRAP, For Time, Death by, or Chipper), **Then** the UI shows the label **"Work: M:SS"** (e.g. "Work: 1:00") and a single countdown (for EMOM/AMRAP/Death by) or count-up (for For Time and Chipper). The target or cap MUST NOT be shown as a second number next to the counter.
8. **Given** the timer is running and the current phase is **rest** (after a segment that has rest), **Then** the UI shows the label **"Rest: M:SS"** and a single countdown to zero; when it reaches zero the timer MUST automatically switch to the next segment.
9. **Given** the current segment is **For Time** or **Chipper**, **Then** the timer counts **up** from 0:00 toward the time cap. The UI MUST show a **"Stop"** button so the user can finish early. When the user clicks Stop OR the time cap is reached, the timer MUST show **"Finish"** for that segment and then automatically advance (to rest, if any, or to the next segment, or to workout complete). Chipper uses the same stopwatch behavior as For Time (one long list of movements; user chips away until done or cap).
10. **Given** the current segment is **Death by**, **Then** the timer shows a **1:00** countdown per round (like a simple EMOM). Each round the user must complete the prescribed reps (round 1 = 1 rep, round 2 = 2 reps, etc.) within the minute. The UI MUST show a **"Stop"** button; the user stops when they cannot complete the round in time (or choose to end). When the user clicks Stop, the segment ends and the timer advances to rest (if any) or the next segment. The round in which the user stops does **not** count toward performance (e.g. 6 full rounds then stop in round 7 → performance = 6 rounds). Performance/round recording is for future use; this phase only defines timer and Stop behavior.
11. **Given** the timer has run through all segments and optional rest phases, **Then** the UI shows a **workout complete** state (e.g. "Workout complete") and a way to exit the timer or return to the board.

---

### Workout Timer — Detailed Behavior

The workout timer is a **single continuous flow**: a series of work and rest phases in segment order. There is exactly **one** visible counter at any time. The timer MUST NOT show "Not set" or an empty state when Start is clicked; the first phase MUST appear immediately.

**Phases and display**

- **Work phase (EMOM)**: EMOM is shown as **one countdown per interval**, not one long countdown for the whole segment. For example, "E0:15MOM 3" means three intervals of 15 seconds each. The timer shows **"Work: 0:15"** and counts down 0:14 … 0:00, then immediately starts the next interval with the same **"Work: 0:15"** countdown, and so on until all rounds are done. The board keeps highlighting the same EMOM segment for every interval. Rest (if any) runs only after all EMOM intervals are complete. This supports future features (e.g. sounds) so the user can complete the exercises in each interval without having to watch the screen.
- **Work phase (AMRAP)**: Label **"Work: M:SS"** (e.g. "Work: 1:00") with the segment duration. The counter **counts down** (e.g. 0:59, 0:58 … 0:00). When it reaches 0:00, the timer automatically moves to the rest phase (if the segment has rest) or to the next segment.
- **Work phase (For Time)**: Label **"Work: M:SS"** (e.g. "Work: 2:00" for the time cap). The counter **counts up** from 0:00 (0:01, 0:02 …) toward the time cap. The UI MUST show a **"Stop"** button. When the user clicks **Stop**, or when the count reaches the time cap, the phase ends and the UI shows **"Finish"**; then the timer automatically advances to rest (if any) or the next segment.
- **Work phase (Chipper)**: A long list of movements performed once each (user "chips away" at the list). Timer behavior is the same as **For Time**: stopwatch (count up from 0:00 toward the time cap). Label **"Work: M:SS"** (time cap). The UI MUST show a **"Stop"** button. When the user clicks **Stop**, or when the count reaches the time cap, the phase ends and the UI shows **"Finish"**; then the timer automatically advances to rest (if any) or the next segment. Exercises in Chipper have **reps only** (no sets); one pass through the list.
- **Work phase (Tabata)**: A specific interval protocol: work seconds / rest seconds for N rounds (default 20 s work / 10 s rest × 8). User can set work and rest from 10–60 s and rounds. The timer shows alternating **"Work: M:SS"** (countdown) and **"Rest: M:SS"** (countdown) for each round; after all rounds, segment rest (if any) runs, then the next segment. Exercises have no sets or reps (one exercise per round); the number of exercises MUST NOT exceed the number of rounds.
- **Work phase (Death by)**: Reps increase every minute until failure (progressive overload with a built-in breaking point). There are **no** configurable sets, rounds, or intervals—duration depends on performance. The timer is always a **1:00 countdown** per round (like a minimal EMOM). Each round: Minute 1 = 1 rep, Minute 2 = 2 reps, … until the user cannot complete the round within the minute. The UI MUST show **"Work: 1:00"** and a **"Stop"** button. When the countdown reaches 0:00, the next round starts automatically (same segment, same 1:00 countdown). When the user clicks **Stop**, the segment ends and the timer advances to rest (if any) or the next segment. The round in which the user stops does **not** count (e.g. user completes 6 full rounds and stops during round 7 → completed rounds = 6). Future: performance data may record completed rounds; this phase only specifies timer and Stop behavior.
- **Rest phase**: Label **"Rest: M:SS"** (e.g. "Rest: 0:15"). The counter **counts down** to 0:00. When it reaches 0:00, the timer automatically moves to the next segment’s work phase.
- **Workout complete**: When all segments (and their rest phases) have been completed, the UI shows a clear **workout complete** state and options to exit or return to the board.

**Example flows**

Workout: AMRAP 1:00 → rest 0:15 → AMRAP 1:00 → rest 0:15 → For Time (2:00 cap).

1. Start → **"Work: 1:00"** countdown 0:59 … 0:00.  
2. → **"Rest: 0:15"** countdown 0:14 … 0:00.  
3. → **"Work: 1:00"** countdown 0:59 … 0:00.  
4. → **"Rest: 0:15"** countdown 0:14 … 0:00.  
5. → **"Work: 2:00"** count-up 0:00, 0:01 … with **Stop** button. User clicks Stop or time cap reached → **"Finish"** → workout complete.

Workout: E0:15MOM 3 (3 rounds, 15 s interval) → rest 0:15.

1. Start → **"Work: 0:15"** countdown 0:14 … 0:00.  
2. → **"Work: 0:15"** countdown 0:14 … 0:00 (round 2).  
3. → **"Work: 0:15"** countdown 0:14 … 0:00 (round 3).  
4. → **"Rest: 0:15"** countdown 0:14 … 0:00 → next segment or workout complete.

Workout: Death by Burpees (single exercise) or Death by Burpees + Kettlebell Swings.

1. Start → **"Work: 1:00"** countdown 0:59 … 0:00 (round 1: 1 rep).  
2. → **"Work: 1:00"** countdown 0:59 … 0:00 (round 2: 2 reps).  
3. … continues until user clicks **Stop** (e.g. after round 6, user stops in round 7 → completed rounds = 6).  
4. → rest (if any) or next segment or workout complete.

**Rules**

- One counter only: never show "elapsed / total" or two numbers; never show "Not set" after Start.
- Segment order: process segments in workout order; after each work phase, run that segment’s rest (if rest > 0), then the next segment.
- Rest is stored in minutes in the data model; the timer MUST convert to seconds for countdown (e.g. 0.25 min → 15 s).
- Custom segments have no built-in duration; they are skipped for timer purposes (only EMOM, AMRAP, For Time, Chipper, Tabata, and Death by with required config are run).
- Death by has no fixed duration (rounds depend on performance); the timer runs 1:00 per round until the user clicks Stop. Completed rounds are not persisted in this phase (future performance data).

---

## Edge Cases

- Segment has zero exercises: the system MUST treat empty segments as invalid for completion—Done is disabled and validation reports an error per segment with no exercises. Segment cards MUST show a distinct visual state (incomplete/warning) when they have no exercises; segments with exercises MUST show an active/success state. Empty segments are not permitted when clicking Done; timer/board flow is only available when every segment has at least one exercise.
- Exercise requires equipment not present in gym: how is this surfaced to the user or to the equipment calculator?
- Timer generation fails due to incompatible segment type: how does the system behave when a segment cannot produce a valid timer?
- Duplicate exercises inside a segment: is this allowed, and how does fatigue calculation treat them?
- Extremely long workouts: are there limits or performance expectations?
- User adds an exercise to a segment before any exercises exist in the Exercise Database: system must block or guide user to create exercises first.
- User deletes or edits an exercise that is already used in one or more saved workouts: system must preserve workout structure or prompt corrective action.
- Segment or exercise reordering with only one item in the list: behavior must remain predictable.
- Workout has only Custom segments: Done is enabled when valid; board is shown; Start is hidden or disabled (not time-measurable).
- Workout has both AMRAP and For Time: Start runs the timer; the timer runs as a continuous series (work → rest → next work → …); For Time shows Stop and Finish.
- Timer must not show "Not set" or a blank counter when Start is clicked: the first work or rest phase must display immediately with the correct label and counter.
- Multiple segments: the timer must automatically advance through every segment and rest in workout order; no manual "next" is required.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creation and editing of workouts and segments through the UI (create, edit, view, remove workouts; add, remove, reorder segments and exercises).
- **FR-002**: System MUST store the resulting data in the domain model (Workout, Segment, Exercise, and related Equipment and Muscle Group concepts as the source of truth).
- **FR-003**: System MUST validate user input before saving (e.g. prevent assigning non-existent exercises to segments; require necessary fields; provide clear feedback). For the workout to be considered valid for completion (Done enabled), **every segment MUST have at least one exercise assigned**; segments with zero exercises MUST be reported as validation errors and MUST block the Done action.
- **FR-004**: System MUST keep the workout structure consistent (ordered segments, ordered exercises per segment, no broken references).
- **FR-005**: System MUST expose the data so other systems can consume it (e.g. Timer Generator, Fatigue System, equipment calculator).
- **FR-006**: System MUST model exercises with identity, name, type (strength, crossfit, mobility, or combinations), and optional equipment, muscle targets (primary and stabilizing), and working-weight or rep-max information.
- **FR-007**: System MUST model segments with identity, name, an explicit segment type (`custom`, `emom`, `amrap`, `forTime`, `deathBy`, `chipper`, or `tabata`), and an ordered list of assigned exercises, where each assignment can store either optional sets/repetitions or metric targets depending on the exercise type.
- **FR-008**: System MUST model workouts with identity, name, and ordered segments, while segment-level rest remains configurable per segment.
- **FR-009**: Users MUST be able to search exercises from within the segment flow; focusing the search field MUST show the first 10 available exercises and typing MUST filter the available exercise list.
- **FR-010**: Exercise records MUST remain the single source of truth for workout-building flows, even when surfaced through a lightweight search-first UX backed by a mock database in phase 1.
- **FR-011**: System MUST allow strength-style assigned exercises inside a segment to store optional sets and optional repetitions without requiring those values for time-based or duration-based scenarios.
- **FR-012**: System MUST allow metric-style exercises (for example row, bike, or run) to store metric targets such as calories, distance, speed, or similar measures instead of sets/repetitions.
- **FR-013**: System MUST open a modal or equivalent selection step before creating a segment so the user can choose the segment template instead of immediately creating a blank segment. The segment-type selection MUST use the same method and logic as "Add exercise": a search input with options listed below; the user can type to search or filter for a specific format (e.g. Tabata, EMOM) and click an option to select it.
- **FR-014**: System MUST apply default parameters for predefined segment templates. At minimum, EMOM MUST default to interval `1:00` and sets `10`; other mock templates MUST provide sensible starter values.
- **FR-015**: System MUST support segment-type-specific parameters such as EMOM interval and sets, AMRAP duration, For Time time cap, Chipper time cap (reps only, no sets), Tabata work/rest/rounds (no sets/reps; exercises ≤ rounds), Death by (no sets/rounds/interval—performance-dependent), and per-segment rest configuration.
- **FR-015a**: For predefined segment types (EMOM, AMRAP, For Time, Death by, Chipper, Tabata), the segment name MUST be generated from the specifications: no user-editable name input. Only Custom segments MUST show a "Segment name" label and editable name field. The segment header MUST show the type badge on the left and action buttons (Move Up, Move Down, Remove) on the right; for predefined types the generated name (e.g. "EMOM 10", "Tabata 0:20/0:10 × 8", "Chipper (30:00 cap)", "Death by Burpees") is displayed next to the badge. Death by has no interval, rounds, or sets controls—the timer is always 1:00 per round until the user stops. Chipper has time cap only (no rounds); exercises have reps only (no sets). Tabata has work (10–60 s), rest (10–60 s), and rounds; exercises have no sets or reps and MUST NOT exceed the number of rounds.
- **FR-016**: System MUST display the total measurable time for segment types whose timing can be derived or explicitly defined, and this summary should appear at the bottom of the segment editor.
- **FR-017**: System MUST provide the EMOM interval through a constrained range control capped at `10:00` with `0:15` steps; the EMOM segment rounds (sets) control MUST appear below the interval and use a range from 1 to 50 with step 1 and default 10.
- **FR-018**: System MUST provide AMRAP duration through a range slider from 1 to 30 minutes in 30 second steps, and For Time time cap through a range slider from 1 to 60 minutes in 30 second steps.
- **FR-019**: System MUST provide per-segment rest through a range control from 0 to 10 minutes in 15 second steps.
- **FR-020**: For each assigned exercise in a segment, the UI MUST show the exercise title and action buttons (reorder, remove) on top, with all prescription options (sets, reps, or measure + value) stacked below.
- **FR-020a**: The Sets range slider MUST be shown only when the segment type is Custom. For EMOM, AMRAP, For Time, Chipper, Tabata, and Death by segments, the Sets slider MUST NOT be shown, because the segment structure (rounds, duration, time cap, single-pass list, work/rest rounds, or performance-dependent rounds) already plays the role of sets. For **Tabata**, the Reps slider and prescription stack MUST NOT be shown; the number of exercises MUST NOT exceed the number of rounds (validation and UI cap).
- **FR-020b**: For **Death by** segments, the Reps range slider and Max-reps toggle MUST NOT be shown for assigned exercises; the format is strict (reps = round number: 1, 2, 3…). The UI MAY show a short note such as "Reps = round number (1, 2, 3…)."
- **FR-021**: Assigned-exercise sets MUST use a range slider from 0 to 10, step 1 (when shown; see FR-020a); reps MUST use a range slider from 1 to 50, step 1. Metric type (calories, distance, speed, time) MUST be chosen via custom-styled radio buttons; metric value MUST use a range slider with type-specific min, max, and step (e.g. calories 0–500 step 5, distance in m, time in seconds with 15 s steps). For calories and distance only, a \"Max\" toggle MUST be available next to the metric value label; when enabled, the metric target is interpreted as \"max\" effort until the segment time ends and the value slider is hidden. For all sets-reps exercises, a \"Max reps\" toggle MUST be available next to the reps label; when enabled, the reps slider is hidden and the assignment is interpreted as \"max reps until the segment time ends\".
- **FR-021a**: For metric exercises that support optional advanced metrics (e.g. Row), speed and similar measures that cannot be structured as a completable target MUST NOT be primary measure options. Such exercises MAY declare `advancedMetrics` (e.g. speed, watts). The UI MUST show an \"Advanced settings\" button at the bottom of the exercise prescription; when clicked, it MUST reveal additional range sliders (e.g. speed, watts) that are hidden by default to avoid overloading the UI. These advanced values are optional and are stored on the assignment when set.
- **FR-022**: System MUST support extension points so the Timer Generator, Fatigue System, and workout auto-generation can be added later without reworking core workout data.
- **FR-023**: The builder MUST show a "Done" button (or equivalent label). The button MUST be **disabled** when the workout has any validation errors for workout name or segments (same rules as "Current builder status"), or when **any segment has zero exercises**. It MUST be **enabled** only when there are no such errors and every segment has at least one exercise assigned.
- **FR-024**: When the user clicks Done, the system MUST display the **Workout Board**: a read-only, CrossFit-style view of the completed workout. The board MUST show, per segment: segment type and timing as a header (e.g. "AMRAP 3`", "Tabata 0:20/0:10 × 8", "Chipper (30:00 cap)", "Death by Burpees"); each assigned exercise on one line, in a short form (e.g. sets/reps like "8 KB Swing", or metric like "Max cal Row"); and segment rest when > 0 (e.g. "Rest: 2" for 2 minutes). Layout MUST be simple and clean, suitable for a whiteboard-style display.
- **FR-025**: The Workout Board MUST show a "Start" button that starts the generated timer. The Start button MUST be shown and enabled only when the workout is **time-measurable** (at least one segment has type EMOM, AMRAP, For Time, Chipper, Tabata, or Death by with the required timing/configuration). If the workout is not time-measurable (e.g. only Custom segments), the Start button MUST be hidden or disabled.
- **FR-026**: The workout timer MUST implement the behavior described in **Workout Timer — Detailed Behavior**. It MUST be a single continuous flow through all time-measurable segments in order. The timer MUST show exactly **one** counter at a time (no "elapsed / total" or dual display). On Start, the first phase MUST appear immediately with no "Not set" or blank state. Work phases (EMOM, AMRAP, Tabata, Death by) use label "Work: M:SS" and **count down**; rest phases (including Tabata intra-round rest) use label "Rest: M:SS" and **count down**; For Time and Chipper use "Work: M:SS" and **count up**, with a **Stop** button and **Finish** on completion (Stop or time cap). Tabata runs alternating work/rest for each round. Death by uses "Work: 1:00" countdown per round and a **Stop** button; when Stop is clicked, the segment ends and the timer advances. The timer MUST automatically advance to the next segment or rest after each phase ends (or after user Stop for For Time, Chipper, and Death by). Rest duration is stored in minutes and MUST be converted to seconds for the countdown.
- **FR-027**: The Workout Board MUST provide a clear way to return to the builder (e.g. "Back to build" or "Edit workout") so the user can edit the workout and click Done again.
- **FR-028**: The builder MUST apply **distinct visual states** to segment cards so the user can see at a glance which segments are complete and which are incomplete: segments **with at least one exercise** MUST use an active/success-style treatment (e.g. border or accent indicating "has exercises"); segments **with no exercises** MUST use a distinct treatment (e.g. warning or incomplete styling) to signal that the segment must have exercises before the workout can be completed. The exact colors or classes are implementation-defined; the requirement is that the two states are clearly distinguishable.

### Assumptions

- Workout Builder and Exercise Database are single-user for this phase; collaboration and sharing are out of scope.
- EMOM and other segment types are represented as structured metadata and examples. Active timer execution is implemented in this phase for the Workout Board flow (Start/Stop); the Timer Generator placeholder is extended or used to produce the runnable timeline.
- Data persistence is required for workouts and exercises; multi-device sync is not required in this phase.
- User authentication and profile management exist outside this feature scope.

## Domain Entities

Define only **conceptual entities**, not implementation details.

### Exercise

Represents a physical movement. Attributes may include: name; type (strength, conditioning, mobility, or combinations); movement pattern; involved muscles (primary and stabilizing); required equipment; optional working weight or rep-max; and a prescription mode that determines whether the movement uses sets/repetitions or metric targets.

### Segment

Represents a block of a workout. Examples: Custom, AMRAP, EMOM, For Time, and Death by. Attributes may include: segment type; interval; sets or rounds; duration or time cap; rest interval; ordered list of assigned exercises; and derived total measurable time shown in the segment editor (Death by has no fixed duration—rounds depend on performance; no interval/rounds/sets settings).

### Assigned Exercise

Represents an exercise placed into a segment. Attributes may include: linked exercise record; optional sets; optional repetitions; optional metric targets (e.g. calories, distance, time) and optional advanced metric values (e.g. speed, watts) when the exercise supports them; order within the segment.

### Workout

Represents a complete training session. Attributes may include: ordered segments; total duration; required equipment (derived); generated timers (later phase).

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
  "segments": [
    {
      "id": "seg-1",
      "name": "EMOM 12 - Lower Body Push",
      "segmentType": "emom",
      "intervalSeconds": 60,
      "rounds": 10,
      "restInterval": 2,
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
