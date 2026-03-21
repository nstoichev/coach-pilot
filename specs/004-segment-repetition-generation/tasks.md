# Tasks: Workout Segment Repetition Generation

**Input**: Design documents from `specs/004-segment-repetition-generation/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [data-model.md](./data-model.md), [contracts/repetition-generation.contract.md](./contracts/repetition-generation.contract.md), [research.md](./research.md)

**Organization**: Tasks are grouped by user story for independent implementation and testing.

---

## Format

- `[ID] [P?] [Story?] Description` with exact file paths where applicable.
- **[P]**: Can run in parallel when files and dependencies allow.
- **[US1]–[US4]**: User story reference from [spec.md](./spec.md).

---

## Phase 1 — Setup (shared)

**Purpose**: No new npm dependencies required; confirm alignment with existing builder stack.

Tasks:

- [X] T001 Confirm no new packages are required for v1 (pure TS + existing React); document in PR notes if tests are added later in `package.json`.

**Checkpoint**: Ready to extend domain types.

---

## Phase 2 — Foundational (blocking)

**Purpose**: Types and pure generation service MUST exist before UI wiring.

Tasks:

- [X] T002 [P] Add `RepSchemePattern`, `RepSchemeConfig`, and extend `Segment` with optional `repScheme` and `repSequence` in `src/types/segment.ts` (or `src/types/domain.ts` if shared enums live there—keep a single source of truth).
- [X] T003 Implement `correctRepSchemeConfig` and `buildRepSequence` per [spec.md](./spec.md) algorithms (linear end/peak correction, minimum progression, fixed constant, pyramid mirror sequence) in `src/services/repetition-generation.ts`.
- [X] T004 [P] Re-export repetition-generation symbols from `src/services/index.ts` if the project uses a barrel file for imports.

**Checkpoint**: `buildRepSequence` returns integer arrays matching spec examples; pyramid with even `rounds` returns `{ ok: false, reason: 'pyramid_even_rounds' }` per [contracts/repetition-generation.contract.md](./contracts/repetition-generation.contract.md).

---

## Phase 3 — User Story 1: Configure repetition pattern (P1)

**Goal**: User can choose linear / pyramid / fixed and enter fields; segment persists `repScheme` for in-scope segments only.

**Independent test**: Custom segment + sets/reps exercise → repetition section visible → select fixed, set values, segment draft contains `repScheme`.

Tasks:

- [X] T005 [US1] Add helper `segmentSupportsRepetitionGeneration(segment: Segment): boolean` in `src/services/repetition-generation.ts` (or `src/services/workout-domain.ts`) implementing scope rules from [spec.md](./spec.md) (exclude deathBy, tabata, metric-only stacks).
- [X] T006 [US1] When `segment.rounds` is defined (e.g. EMOM, For Time), bind repetition **sequence length** to that value—read-only rounds display + no duplicate rounds input—in `src/components/workout-builder/SegmentEditor.tsx` (or extracted `SegmentRepGenerationPanel.tsx` under `src/components/workout-builder/`).
- [X] T007 [US1] Render repetition-generation UI (pattern selector + mode-specific fields) only when `segmentSupportsRepetitionGeneration` is true in `src/components/workout-builder/SegmentEditor.tsx` (or `src/components/workout-builder/SegmentRepGenerationPanel.tsx`).
- [X] T008 [US1] Persist `repScheme` on the segment via existing `onUpdateSegment` / store path when user commits fields (initial commit can occur on first blur or explicit “Apply”—minimum: after blur per spec) in `src/components/workout-builder/SegmentEditor.tsx`.

**Checkpoint**: In-scope segments show config UI; out-of-scope segments do not.

---

## Phase 4 — User Story 2: Silent correction on blur (P1)

**Goal**: Linear/fixed (and pyramid peak) values auto-correct on **blur** only; no correction on every keystroke.

**Independent test**: Linear uneven divide → blur → `end` updates and `repSequence` matches normative example; typing does not snap values mid-edit.

Tasks:

- [X] T009 [US2] Use local React state for editable numeric/text fields while focused; sync to `repScheme` + run `correctRepSchemeConfig` + `buildRepSequence` only `onBlur` in `src/components/workout-builder/SegmentEditor.tsx` (or `src/components/workout-builder/SegmentRepGenerationPanel.tsx`).
- [X] T010 [US2] For **custom** segments without `segment.rounds`, add controlled `rounds` input that writes `segment.rounds` (and `repScheme.rounds`) per [research.md](./research.md) on blur in `src/components/workout-builder/SegmentEditor.tsx`.
- [X] T011 [US2] Coerce user input to safe integers before correction (empty → sensible defaults or skip build until required fields present—document behavior; no user-facing error spam) in `src/services/repetition-generation.ts` or blur handlers in `src/components/workout-builder/SegmentEditor.tsx`.

**Checkpoint**: Blur triggers correction; keystroke does not.

---

## Phase 5 — User Story 3: Preview and totals (P1)

**Goal**: After successful generation, show Round 1…N list and totals (`sum(sequence)` and × sets-reps exercise count).

**Independent test**: Any corrected config → preview length === `rounds`; totals match manual sum.

Tasks:

- [X] T012 [US3] Render read-only preview list (e.g. “Round *n*: *reps*”) from `segment.repSequence` when `buildRepSequence` succeeds in `src/components/workout-builder/SegmentEditor.tsx` (or `src/components/workout-builder/SegmentRepGenerationPanel.tsx`).
- [X] T013 [US3] Compute and display `totalRepsPerExercise` and `segmentTotalReps` per [spec.md](./spec.md) using `segment.exercises` filtered to `prescription.mode === 'sets-reps'` in `src/components/workout-builder/SegmentEditor.tsx` (or helper in `src/services/repetition-generation.ts`).
- [X] T014 [P] [US3] Add minimal styles for preview/totals (contrast, spacing) in `src/App.css`.

**Checkpoint**: User sees preview + totals without exposed formulas.

---

## Phase 6 — User Story 4: Pyramid strict odd rounds (P2)

**Goal**: Pyramid mode cannot select even `rounds`; no silent even→odd correction.

**Independent test**: Pyramid + rounds control never commits an even value; service remains defensive.

Tasks:

- [X] T015 [US4] Implement odd-only `rounds` control for pyramid (e.g. range step 2, or +/- skips evens) when pattern is pyramid in `src/components/workout-builder/SegmentEditor.tsx` (or `src/components/workout-builder/SegmentRepGenerationPanel.tsx`).
- [X] T016 [US4] Ensure `buildRepSequence` rejects even `rounds` for pyramid with `{ ok: false }` and UI leaves preview empty or shows last valid state—no toast (align with spec) in `src/services/repetition-generation.ts` and `src/components/workout-builder/SegmentEditor.tsx`.

**Checkpoint**: Even rounds impossible or never persisted for pyramid.

---

## Phase 7 — Polish and integration

**Purpose**: Validation alignment, optional materialization, docs.

Tasks:

- [X] T017 Adjust `src/services/workout-validation.ts` so rep-generation does not add blocking errors for linear/fixed auto-correction paths; optional defensive checks only.
- [X] T018 Optional v1: set each sets/reps assigned exercise `repetitions` to `repSequence[0]` (or leave unchanged—pick one and document) when `repSequence` updates, in blur handler or `src/services/workout-domain.ts`.
- [X] T019 Update `specs/002-fitness-workout-spec/tasks.md` with a cross-reference row or note pointing implementers to `specs/004-segment-repetition-generation/tasks.md` for rep-generation work (if 002 tasks file tracks cross-feature work).
- [X] T020 Run through `specs/004-segment-repetition-generation/quickstart.md` manually after implementation and fix gaps.

**Checkpoint**: Feature matches [spec.md](./spec.md); quickstart passes.

---

## Dependencies

```text
Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Phase 6 (US4) → Phase 7
```

- **US2** depends on **US1** (UI + persistence exist).
- **US3** depends on **US2** (`repSequence` populated after blur).
- **US4** can follow **US3** or be parallelized after **US2** if pyramid UI is isolated.

---

## Parallel execution examples

- **After Phase 2**: T005 can follow T003; T004 parallel with T003 if barrel file has no circular dependency.
- **Phase 5**: T014 [P] can run alongside T012–T013 if CSS is separate from logic edits.

---

## Implementation strategy

- **MVP (P1)**: Complete Phases 1–5 (US1–US3) for Custom + EMOM-style `rounds` binding + preview/totals.
- **Next**: Phase 6 (US4 pyramid parity UX).
- **Polish**: Phase 7 validation + optional `repetitions` mirror + cross-links.

---

## Suggested MVP scope

Phases **1–5** only: types, pure service, in-scope UI, blur correction, preview/totals.

**Total task count**: 20 (T001–T020)

**By story**: US1: 4 tasks (T005–T008); US2: 3 (T009–T011); US3: 3 (T012–T014); US4: 2 (T015–T016); Setup 1; Foundational 3; Polish 4.
