# Feature Specification: Workout Calendar and Scheduling

**Feature Branch**: `003-workout-calendar`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: User description: "We need to add a calendar to the Specifications. Each workout is attached to a specific day. User cannot create or add workouts for past days. Date picker above workout name. User can execute any scheduled workout from calendar anytime. Calendar page with scheduled and completed indicators."

---

## Feature Overview

This feature adds **calendar and scheduling** to the Coach Pilot fitness application. Workouts are attached to a specific date; creation is restricted to today and future dates, while **execution** (starting the workout and timer) is allowed for any scheduled workout regardless of date. A dedicated calendar page shows which days have workouts and whether they are completed.

- **Problem**: Users need to plan which workout to do on which day and see at a glance what is scheduled and what is done.
- **Interaction**: User picks a date when creating or editing a workout; the app blocks creating workouts for past dates. From the calendar, the user can open and execute any scheduled workout (past, today, or future). The calendar displays clear indicators for “has workout” and “workout completed.”
- **Place in the app**: Date picker in or above the workout builder; calendar page as a primary view; execution entry point from calendar (and optionally from builder).

---

## User Scenarios & Testing *(mandatory)*

User stories are ordered by priority and are independently testable.

---

### User Story 1 — Schedule a Workout for a Date (Priority: P1)

As a user, I can attach every workout I create to a specific day so that my plan is visible on the calendar and I do not accidentally schedule work in the past.

**Why this priority**: Scheduling is the core of the calendar feature; without a date, the calendar has nothing to show.

**Independent Test**: Create a new workout, choose a date (today or a future date) via a date picker above the workout name, complete the workout, and confirm it appears on the calendar on that date. Attempt to select a past date and confirm the system does not allow creating or saving a workout for that day.

**Acceptance Scenarios**:

1. **Given** the user is creating or editing a workout, **When** they look at the workout form, **Then** they see a date picker (or equivalent) above or beside the workout name, and the selected date is the day to which the workout is attached.
2. **Given** the date picker is shown, **When** the user tries to select a date in the past, **Then** the system prevents selection of past dates (e.g. past dates disabled or invalid).
3. **Given** the user has not selected a date (or the date is invalid), **When** they try to save or finalize the workout, **Then** the system requires a valid date (today or future) and blocks saving until it is set.
4. **Given** the user selects today or a future date, **When** they save the workout, **Then** the workout is stored attached to that date and appears on the calendar on that day.

---

### User Story 2 — Execute Any Scheduled Workout from the Calendar (Priority: P2)

As a user, I can start (execute) any workout that appears on my calendar regardless of whether its date is in the past, today, or the future, so I can do a missed workout later or do a future workout early.

**Why this priority**: Execution flexibility is the main behavioral rule; creation is restricted by date, but execution is not.

**Independent Test**: Create a workout for a past date (using data or a test scenario where that workout already exists) and a workout for a future date. From the calendar, open each and start the workout (e.g. run the timer). Confirm both can be executed. Also confirm that a workout scheduled for “today” can be executed.

**Acceptance Scenarios**:

1. **Given** the user is on the calendar (or a list tied to the calendar), **When** they open a workout that is scheduled for a past day, **Then** they can start (execute) that workout (e.g. open board and start timer) without restriction.
2. **Given** the user is on the calendar, **When** they open a workout scheduled for a future day, **Then** they can start (execute) that workout without restriction.
3. **Given** the user has started a workout from the calendar, **When** they complete or exit the workout, **Then** the experience is the same as executing from the builder (e.g. timer, board, done state).
4. **Given** execution is allowed for any scheduled workout, **When** the user has not yet created a workout for a day, **Then** the only restriction is on **creating** or **assigning** a new workout to a past date; execution does not create new schedules.

---

### User Story 3 — View Calendar with Scheduled and Completed Indicators (Priority: P3)

As a user, I can open a calendar page and see at a glance which days have a workout and which of those workouts I have completed (e.g. checkmark or other clear indication).

**Why this priority**: The calendar view is the main place to see the plan and progress; it depends on scheduling (US1) and supports execution (US2).

**Independent Test**: Add workouts to several dates (today and future). Mark at least one as completed. Open the calendar page and confirm days with workouts show an indicator, and days with completed workouts show a distinct indicator (e.g. checkmark). Days with no workout show no (or a neutral) state.

**Acceptance Scenarios**:

1. **Given** the user opens the calendar page, **When** the page loads, **Then** they see a calendar (e.g. month view) and can navigate between periods (e.g. months).
2. **Given** a day has at least one scheduled workout, **When** the user views that day on the calendar, **Then** the day shows a clear indication that a workout is scheduled (e.g. dot, color, or label).
3. **Given** a day has a scheduled workout and that workout has been completed, **When** the user views that day on the calendar, **Then** the day shows a distinct indication of completion (e.g. checkmark or different style) so it is easy to tell “scheduled” vs “completed.”
4. **Given** a day has no scheduled workout, **When** the user views the calendar, **Then** that day either shows no special indicator or a neutral state, and the user can still create a workout for today or future dates from the appropriate flow.

---

### Edge Cases

- **Timezone**: “Today” and “past” are determined using the user’s local date (or a defined timezone); past dates remain disabled for creation regardless of time of day.
- **Multiple workouts per day**: The calendar indicates that the day “has a workout”; if multiple workouts exist for the same day, the UI may show one indicator per day or aggregate (e.g. “1 workout” or “2 workouts”); completion may be per workout or per day depending on product choice.
- **Completion definition**: “Completed” is defined as the user having marked the workout as done or having reached the end of the workout flow (e.g. workout complete state); the exact trigger is product-defined but must be consistent so the calendar can show the completed state.
- **No workouts yet**: Calendar page is still visible; empty or minimal state is shown until the user creates at least one scheduled workout.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST store, for each workout, the calendar date (day) to which it is attached.
- **FR-002**: The system MUST prevent the user from creating or assigning a workout to a date that is in the past (before “today” in the user’s date context).
- **FR-003**: The system MUST allow the user to select the workout date via a date picker (or equivalent control) visible above or next to the workout name when creating or editing a workout.
- **FR-004**: The system MUST require a valid date (today or future) before a new workout can be saved or considered scheduled.
- **FR-005**: The system MUST allow the user to start (execute) any existing scheduled workout from the calendar or an equivalent entry point, regardless of whether the workout’s date is in the past, today, or the future.
- **FR-006**: The system MUST provide a dedicated calendar page that displays a calendar (e.g. by month) and allows navigation between periods.
- **FR-007**: The system MUST show a clear indication on the calendar for each day that has at least one scheduled workout.
- **FR-008**: The system MUST show a distinct indication (e.g. checkmark or different style) for days where the scheduled workout has been completed, so users can distinguish “scheduled” from “completed.”
- **FR-009**: The system MUST support opening a scheduled workout from the calendar (e.g. by clicking the day or an indicator) so the user can view or execute it.
- **FR-010**: Completion state MUST be persisted so that the calendar can reliably show completed vs not completed across sessions.

### Key Entities

- **Workout (existing)**: Extended or linked to a calendar date; remains the core entity for structure (segments, exercises, etc.).
- **Scheduled workout / Workout schedule**: Represents the assignment of a workout to a specific calendar date; may be the workout itself with a date field or a separate schedule record linking workout + date.
- **Completion state**: Represents whether a scheduled workout has been completed (e.g. a flag or record per workout per date) so the calendar can show “completed” vs “scheduled.”

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can attach a workout to a chosen date (today or future) and see it on the calendar in a single, clear flow.
- **SC-002**: Users cannot create or save a workout for a past date; 100% of new or edited workouts have a date that is today or in the future.
- **SC-003**: Users can start and run any scheduled workout from the calendar regardless of its date (past, today, or future), with no extra blocking steps.
- **SC-004**: Users can open the calendar page and, within one view, distinguish days with no workout, days with a scheduled workout, and days with a completed workout.
- **SC-005**: Completion state is visible on the calendar after the user completes a workout and returns to the calendar view.

---

## Assumptions

- “Today” and “past” are based on the user’s local date (or a single configured timezone); no multi-timezone calendar is required for this feature.
- One workout per date is the default model; multiple workouts per day may be supported later and are out of scope unless explicitly added.
- Completion is tracked per workout instance (or per workout per date); the exact data model is left to the implementation plan.
- The calendar page is a primary navigation destination; the builder may remain accessible from the calendar (e.g. “Add workout” for today or a future date).
