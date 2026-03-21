# Research: Workout Segment Repetition Generation

**Feature**: [spec.md](./spec.md)  
**Date**: 2026-03-11

---

## R1 — Source of truth for `rounds`

**Context**: `Segment` already has optional `rounds` for EMOM (and similar) timing. Repetition generation also needs a round count equal to sequence length.

**Decision**: Use **one** `rounds` value:

- If `segment.rounds` is **already defined** (e.g. EMOM, For Time with rounds, Tabata—though Tabata is out of scope for rep UI), the repetition generator **MUST** use **`segment.rounds`** as the sequence length. The UI **does not** introduce a second conflicting “rounds” field for those types.
- If `segment.rounds` is **absent** (typical **Custom** segment, and **Chipper**), the repetition generator **MAY** expose a **rounds** control that **writes** `segment.rounds` for the purpose of generation **or** stores rounds only inside `repScheme`—**preferred**: write **`segment.rounds`** when the segment has no timer-defined rounds so timer and preview stay aligned if rounds are later reused.

**Rationale**: Avoids `repScheme.rounds !== segment.rounds` bugs and matches user mental model (“rounds” = number of rounds in the segment).

**Alternatives considered**

- Separate `repScheme.rounds` always → rejected: duplicates EMOM rounds and confuses totals.
- Always require user to set EMOM rounds first → accepted implicitly; rep UI reads that value as read-only label + uses it for sequence length.

---

## R2 — Where the generated sequence lives

**Context**: `AssignedExercise` today has a single `repetitions?: number`, not an array per round.

**Decision (v1)**:

- Store **`repSequence: number[]`** on **`Segment`** (canonical).
- Optionally mirror **round 1** or **last round** into `repetitions` for backward compatibility with board/timer that only show a single number—**implementation choice** in tasks: either (a) show full preview only in builder and keep `repetitions` as “display default” = `repSequence[0]`, or (b) extend board later. Spec requires preview in builder; board/timer updates can be a follow-up task.

**Rationale**: One sequence shared by all sets/reps exercises in the segment; no N× duplication.

**Alternatives considered**

- `repetitionsByRound[]` on each `AssignedExercise` → rejected for v1 (heavy, redundant).
- Only mutate `repetitions` without array → cannot represent per-round progression.

---

## R3 — Pyramid even `rounds` UX

**Context**: Spec forbids silent parity correction.

**Decision**: **Prevent** even values in the rounds control when pattern is `pyramid`:

- Use step=2 on a range/slider, or skip even numbers on +/- buttons, or clamp focus to nearest odd only when **increment/decrement** (not silent on load). Initial default for pyramid: **odd** (e.g. 5).

**Rationale**: Meets “no auto-correction” while staying usable.

**Alternatives considered**

- Snap on blur to nearest odd → rejected: violates “no silent parity change” interpretation.
- Show error message → rejected for pyramid; prevention is cleaner.

---

## R4 — Blur-only correction vs React controlled inputs

**Decision**: Keep **raw string or number state** while focused if needed; on **blur**, run correction and commit to `Segment` / `repScheme` fields used by preview. Do not overwrite user typing mid-keystroke.

**Rationale**: Matches UX requirement.

---

## R5 — Mixed exercises (sets/reps + metric) in one segment

**Decision**: `repSequence` still generates; **applies** only to sets/reps assignments. Metric exercises **ignore** `repSequence` for prescription. Totals: `sum(sequence) * count(setsRepsExercises)` (spec FR-RG-008).

---

## Resolved list

| Topic | Status |
|-------|--------|
| Rounds vs EMOM `rounds` | Resolved (single source) |
| Sequence storage | Resolved (`Segment.repSequence`) |
| Pyramid parity | Resolved (UI prevention) |
| Blur-only correction | Resolved |
| Mixed prescriptions | Resolved |
