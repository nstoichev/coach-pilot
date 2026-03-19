# Implementation Plan: Workout Calendar and Scheduling

**Branch**: `003-workout-calendar`  
**Date**: 2026-03-11  
**Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-workout-calendar/spec.md`

---

## Summary

This feature adds calendar and scheduling to Coach Pilot. Each workout is attached to a calendar date; creation is restricted to today and future dates. A date picker is shown above (or beside) the workout name in the builder. Users can execute any scheduled workout from the calendar regardless of date. A dedicated calendar page shows which days have workouts and which are completed (e.g. checkmark).

The implementation extends the existing Workout model (or adds a scheduling layer), adds a calendar UI and date-picker in the builder, and introduces a calendar page with scheduled/completed indicators. Execution reuses the existing workout board and timer flow.

---

## Technical Context

- **Stack**: Same as 002 (TypeScript, React, Vite). No new language or framework.
- **Storage**: Extend in-memory/context state for phase 1; workout records include `scheduledDate` (date-only) and optional `completedAt` (or equivalent) for completion state. Persistence (e.g. Supabase) can be added later.
- **Dependencies**: Consider a small date utility (e.g. date-fns or native Intl) for “today” and past-date checks; calendar UI can be custom or a lightweight calendar component.
- **Target**: Web (desktop first); calendar must be usable on small screens for future mobile.

---

## Constitution Check

- **Domain First**: Workout remains the core entity; we add a scheduling aspect (date, completion) without replacing the Workout → Segment → Exercise model. Pass.
- **Simplicity**: Date picker and calendar are straightforward UI additions; logic for “past vs today” is simple and testable. Pass.
- **Modularity**: Calendar/scheduling can be a separate module (store slice, services, components) that consumes the existing workout domain. Pass.
- **Deterministic logic**: “Is this date in the past?” and “Does this day have a workout?” are deterministic and testable. Pass.

---

## Architecture Approach

- **Domain**: Add `scheduledDate` (and completion state) to the workout or to a thin “schedule” wrapper used by the app. “Today” is derived from local date for validation.
- **State**: Extend existing workout builder / app state to hold scheduled date and completion; or add a small calendar/schedule store that references workout IDs and dates.
- **UI**: (1) Date picker in builder above workout name; (2) Calendar page with month view and indicators; (3) Entry from calendar to open and execute a workout (reuse board + timer).
- **Execution**: No date check when starting a workout; only creation/editing of the scheduled date is restricted to today and future.

---

## Project Structure (additions for 003)

```text
specs/003-workout-calendar/
  spec.md
  plan.md
  tasks.md
  checklists/
    requirements.md
```

**Source** (extend existing):

- `src/` – Add or extend types for `scheduledDate` and completion; add calendar components and date-picker; add calendar page and routing or view switch.
- Reuse `src/components/workout-builder/`, `WorkoutBoard`, `WorkoutTimer` for execution.

---

## Out of Scope for This Plan

- Multi-timezone support; “today” is single timezone (user local).
- Multiple workouts per day (can be added later).
- Full persistence backend (calendar can work with in-memory state first).
