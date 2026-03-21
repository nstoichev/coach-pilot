# Coach Pilot – Project Constitution

This document defines the engineering principles that guide the development of the Coach Pilot fitness application.

All specifications, plans, and tasks MUST align with this constitution.

---

## Core Principles

### I. Domain First Architecture

The core of the system is the **Workout Domain Model**.

The following entities are considered fundamental and must remain clearly defined and stable:

- Exercise
- Segment
- Workout
- Equipment
- Muscle Group

All new features must integrate with these domain entities rather than introducing parallel structures.

Requirements:

- Domain objects must be defined as **TypeScript types or interfaces**
- Business logic must live outside UI components
- UI should consume domain logic, not implement it

---

### II. Simplicity Over Cleverness

The system must favor **clarity and maintainability** over complex abstractions.

Guidelines:

- Prefer simple React patterns (`useState`, `useReducer`)
- Avoid premature optimization
- Avoid unnecessary libraries
- Prefer readable code over compact code

A future developer should be able to understand the system quickly.

---

### III. Modular Feature Design

Features must be implemented as **independent modules** whenever possible.

Examples:

- Workout Builder
- Exercise Database
- Timer Generator
- Fatigue System
- Calendar / Scheduling
- Segment repetition generation (per-round rep sequences in the builder)

Modules must:

- Have clearly defined inputs/outputs
- Avoid tight coupling with other modules
- Expose small, predictable APIs

This allows the application to evolve without large refactors.

---

### IV. Deterministic Logic

Core workout logic must be **deterministic and testable**.

Examples of deterministic systems:

- Timer generation
- Equipment aggregation
- Fatigue calculation

Requirements:

- Logic must be implemented in pure functions when possible
- Core algorithms should be testable without UI
- Avoid hidden side effects

---

### V. Progressive Complexity

The application will evolve through **layers of complexity**.

Development order:

1. Static workout builder
2. Exercise database
3. Timer generation
4. Calendar and scheduling (workouts attached to dates; calendar view and execution)
4a. Segment repetition generation (linear / pyramid / fixed; extends Segment; see `specs/004-segment-repetition-generation/`)
5. Equipment aggregation
6. Fatigue calculation
7. Adaptive training features

Features should not be implemented before their prerequisite systems exist.

---

## Technical Standards

### Frontend

- React
- TypeScript
- Vite

Rules:

- Components should remain small and focused
- Shared logic belongs in hooks or utility modules
- Avoid deeply nested component trees

---

### Data Model

Core entities must be represented with **strict TypeScript types**.

Examples:

- `Exercise`
- `WorkoutSegment`
- `Workout`
- `Equipment`
- `MuscleGroup`

These types represent the **source of truth for the application**.

---

### Backend

Backend will use:

- Supabase
- PostgreSQL

During early development:

- Mock data or local JSON may be used
- API integration can be introduced incrementally

---

## Development Workflow

The project follows a **spec-driven development workflow**.

Feature development should follow this order:

1. Spec (`spec.md`)
2. Plan (`plan.md`)
3. Tasks (`tasks.md`)
4. Implementation

This ensures AI agents and developers follow the same process.

---

## Testing Philosophy

Testing focuses on **core business logic**.

Priority areas:

- Timer generation
- Fatigue calculation
- Equipment aggregation
- Workout data transformations

UI testing is optional during early development.

---

## Governance

This constitution acts as the **engineering contract** of the project.

All specs, plans, and implementations should align with these principles.

Changes to this document must include:

- Version update
- Date
- Short description of the change

---

Version: 0.2.0  
Ratified: 2026-03-11
