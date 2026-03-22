# Implementation Plan: Workout Segment Repetition Generation

**Branch**: `004-segment-repetition-generation`  
**Date**: 2026-03-11  
**Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-segment-repetition-generation/spec.md`

---

## Summary

Add **repetition generation** to workout segments: users choose `linear`, `pyramid`, or `fixed` patterns with minimal inputs; on **blur**, the system **auto-corrects** (linear/fixed) to produce an **integer** `sequence` of length `rounds`, with a **per-round preview** and totals. **Pyramid** requires **odd** `rounds` with **no parity auto-correction**—UI prevents even values.

Implementation lives in a **pure TypeScript** module (deterministic generation + correction) consumed by the builder (`SegmentEditor` or successor). Domain fields extend `Segment` (and optionally mirror to assigned exercises later). See [research.md](./research.md) for rounds source-of-truth and storage.

---

## Technical Context

- **Language/Version**: TypeScript 5.x, React 19, Vite 7 (same stack as 002/003).
- **Primary Dependencies**: None required beyond existing app; optional tests via project test runner if added later.
- **Storage**: In-memory workout draft (builder store) first; same `Workout` → `Segment` tree as 002.
- **Testing**: Unit tests for `buildRepSequence` / `applyLinearCorrections` style functions (recommended); manual quickstart in [quickstart.md](./quickstart.md).
- **Target Platform**: Web (desktop first).
- **Project Type**: Single SPA (coach-pilot).
- **Performance Goals**: Trivial (O(rounds)); rounds bounded by existing segment UI (e.g. ≤ 50).
- **Constraints**: Corrections **on blur only**; no fractional reps; pyramid odd-rounds strict. **UI**: Preview/totals and repetition panel MUST use **Tailwind + semantic tokens** from `tailwind.config.js` only (see `.specify/memory/constitution.md`).
- **Scale/Scope**: One segment panel section + generator service; no backend required for v1.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Domain First**: Generation and correction logic in `src/services/` (or `src/domain/`), not inside presentational components. Pass.
- **Simplicity**: Prefer pure functions + local component state for dirty fields; avoid new global state unless needed. Pass.
- **Modular Feature Design**: Repetition generation is a small module with a clear API (see [contracts/](./contracts/repetition-generation.contract.md)). Pass.
- **Deterministic Logic**: Same inputs → same `sequence` after blur; fully testable. Pass.
- **Progressive Complexity**: Builds on existing Segment / AssignedExercise model without replacing `segmentType`. Pass.

**Post-design re-check**: [data-model.md](./data-model.md) and [research.md](./research.md) preserve a single `rounds` source when `segment.rounds` exists; no unresolved NEEDS CLARIFICATION. Pass.

- **UI styling system**: Builder UI for repetition generation MUST comply with the constitution (semantic tokens, interaction rules). Pass.

---

## Architecture Approach

- **Domain**: Optional `repScheme` + `repSequence` on `Segment` (see data model). `repSequence` is the canonical per-round reps for **shared** application to all sets/reps exercises in the segment.
- **Services**: `repetition-generation.ts` — `correctRepSchemeOnBlur`, `buildRepSequence` (names indicative).
- **UI**: Segment editor subsection (in-scope segments only): pattern toggle, fields, preview list; `onBlur` handlers call service and write back corrected numbers + `repSequence`.
- **Validation**: Workout validation should **not** spam errors for linear/fixed auto-correction; pyramid even rounds prevented in UI (optional defensive check in service returns no sequence or leaves previous—implementation choice documented in tasks).

---

## Project Structure (this feature)

```text
specs/004-segment-repetition-generation/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── repetition-generation.contract.md
└── tasks.md              # created by /speckit.tasks (not this plan)
```

### Source code (anticipated)

```text
src/
├── services/
│   └── repetition-generation.ts    # pure generation + blur correction
├── components/workout-builder/
│   └── SegmentEditor.tsx           # UI + onBlur (or extracted subcomponent)
└── types/
    └── segment.ts                  # extend Segment type
```

**Structure decision**: Single SPA under `src/`; no new package.

---

## Out of Scope (this plan)

- Timer integration using per-round reps (future).
- Per-exercise divergent sequences (v1: one sequence per segment).
- Metric prescriptions and Death by / Tabata (excluded by spec scope).

---

## Complexity Tracking

None; no constitution violations required.
