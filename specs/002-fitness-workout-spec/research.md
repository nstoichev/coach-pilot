# Research: Fitness Workout Builder Foundation

## Decision 1: Use React Context + `useReducer` for phase-1 state

**Decision**: Manage workout draft state and exercise records with a shared React Context provider backed by `useReducer`.

**Rationale**:

- The repo already uses React only and does not include Zustand or Redux.
- The constitution explicitly prefers simple React patterns before extra libraries.
- The Workout Builder and Exercise Database need one shared source of truth for creation, editing, assignment, and deletion workflows.

**Alternatives considered**:

- **Local component state only**: Rejected because workout and exercise data would be duplicated across components.
- **Zustand or Redux**: Rejected for phase 1 because they add dependency and architecture overhead too early.

---

## Decision 2: Represent training type combinations as an array of tags

**Decision**: Model exercise training type as one or more values chosen from strength, crossfit, and mobility.

**Rationale**:

- The feature spec explicitly allows combinations.
- An array of tags is easier to extend and avoids awkward compound string literals.
- This supports future generator and fatigue logic without changing the core contract.

**Alternatives considered**:

- **Single union value only**: Rejected because it cannot represent combinations.
- **Custom nested classification object**: Rejected because it adds complexity without current value.

---

## Decision 3: Keep deterministic workout logic in services

**Decision**: Put validation, assignment, ordering, and future aggregation logic in `src/services/`.

**Rationale**:

- The constitution requires business logic outside UI components.
- Service modules can be reused by multiple UI surfaces and later test suites.
- Deterministic logic is easier to verify in isolation than component-embedded logic.

**Alternatives considered**:

- **Inline logic inside React components**: Rejected because it couples UI to domain rules.
- **Separate `domain/` tree immediately**: Rejected for now because the existing repo already started with `src/types/`; `src/services/` keeps the implementation simpler in phase 1.

---

## Decision 4: Use mock data and in-memory draft persistence in phase 1

**Decision**: Keep phase-1 storage local to the running application and use mock exercise/workout data where needed.

**Rationale**:

- The constitution allows mock data and local JSON during early development.
- The specification does not require real backend persistence yet.
- This keeps implementation focused on the domain model and builder flows first.

**Alternatives considered**:

- **Immediate Supabase integration**: Rejected because it would slow delivery of the static workout builder.
- **Browser persistence as a hard requirement**: Rejected because the spec only needs phase-1 functionality, not durable sync.

---

## Decision 5: Treat UI contracts as first-class design artifacts

**Decision**: Document component responsibilities, user actions, validation behavior, and shared-state expectations in `contracts/ui-contracts.md`.

**Rationale**:

- This project is a web application, so the primary exposed interface is the UI and its internal contract between state, services, and components.
- Explicit contracts reduce ambiguity when implementing tasks in parallel.

**Alternatives considered**:

- **No contracts document**: Rejected because future implementation steps would need to infer UI/state behavior from prose alone.

---

## Decision 6: Workout Board — aggregated equipment list

**Decision**: Derive a single **“Equipment required”** list on the Workout Board from all assigned exercises’ `equipment` arrays. **Normalize** each entry with **trim**; drop empty strings. **Deduplicate** using **case-insensitive** comparison; when two entries differ only by case, **keep the first occurrence’s casing** (stable traversal: segments in order, exercises in order within each segment). **Sort** the final labels with **`localeCompare`** using **`sensitivity: 'base'`** so display order is predictable and case-insensitive. When the aggregated list is **empty**, **omit** the entire equipment block (minimal board; no “None” placeholder).

**Rationale**:

- Matches constitution guidance for **deterministic, testable** aggregation and the domain concept of workout-level required equipment.
- Case-insensitive dedupe avoids duplicate lines such as “Barbell” and “barbell” from mock or user data.
- Omitting the section when empty keeps the board clean for bodyweight-only workouts.

**Alternatives considered**:

- **Case-sensitive dedupe**: Rejected for noisy duplicate lines from inconsistent casing.
- **Always show the section with “No equipment listed”**: Rejected in favor of a sparser layout; screen readers skip the block when there is nothing to gather.
- **Per-segment equipment**: Rejected for this slice; a single workout-level list matches the user story (“list on the bottom below the segments”).
