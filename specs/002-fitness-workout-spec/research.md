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
