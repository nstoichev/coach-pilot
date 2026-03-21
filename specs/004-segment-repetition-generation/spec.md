# Feature Specification: Workout Segment Repetition Generation

**Feature Branch**: `004-segment-repetition-generation`  
**Status**: Draft  
**Related**: [002 Fitness Workout Builder](../002-fitness-workout-spec/spec.md) (segments, assigned exercises, builder UI)

---

## Overview

This feature adds a **repetition generation** system for exercises within a workout **segment**. From a small set of user inputs, the system produces an **integer-only** sequence of repetitions—one value per **round**—that applies **consistently to all exercises** in the segment that use the sets/reps prescription path.

**Goals**

- Keep the UI simple; do not expose formulas or “step math” to the user.
- Ensure **all generated repetitions are integers**; **never** fractional reps.
- Avoid invalid configurations by **auto-correcting** user input instead of showing validation errors (with one **strict** exception: pyramid mode + odd `rounds`).
- Apply corrections only on **blur** (focus loss), **not** on every keystroke.
- Show a **preview** of the generated reps per round (strongly recommended).

**Non-goals**

- Timer behavior, live countdown validation, or real-time correction while typing.
- Replacing existing `segmentType` (EMOM, AMRAP, Custom, etc.); this feature **extends** segment metadata and builder UX.
- Changing metric-based prescription (calories, distance, custom text, etc.).

---

## Scope: Which Segments

**In scope**: Any segment where the builder **shows per-exercise reps** for sets/reps exercises (prescription stack visible with reps).

**Out of scope** (no repetition generation UI for these segment types in v1):

- **Death by** (reps are implicit per round).
- **Tabata** (prescription stack hidden; no per-exercise reps).
- Segments where assigned exercises are **metric-only** or reps UI is not shown.

---

## User Stories

### US1 — Configure repetition pattern (P1)

As a user building a segment, I can choose a repetition pattern (**linear**, **pyramid**, or **fixed**) and enter a small number of fields so the app can generate reps per round for all sets/reps exercises in that segment.

**Independent test**: Open an in-scope segment with at least one sets/reps exercise; open repetition generation; choose fixed, set rounds and reps; on blur, see a preview of constant reps per round.

### US2 — Silent correction on blur (P1)

As a user, I can type values freely; when I leave a field (**blur**), the system adjusts values if needed so the sequence is valid (integer steps, minimum progression), **without** error toasts or blocking messages—for **linear** and **fixed** modes.

**Independent test**: Linear mode with rounds and start/end that do not divide evenly; after blur, `end` (or derived peak) updates and preview matches the normative algorithm.

### US3 — Preview and totals (P1)

As a user, I see a **round-by-round preview** (e.g. Round 1: 10, Round 2: 17, …) and can infer total reps per exercise and for the segment (sum × exercise count).

**Independent test**: After any blur correction, preview length equals `rounds` and all values are integers.

### US4 — Pyramid strict rounds (P2)

As a user, when I choose **pyramid**, I **cannot** select an **even** number of rounds (UI prevention). The system does **not** auto-correct even→odd; parity is a hard rule.

**Independent test**: Pyramid selected; rounds control never lands on an even number (or equivalent prevention).

---

## Segment Configuration (Conceptual Model)

Each segment may carry an optional **repetition scheme** (names are indicative; see [data-model.md](./data-model.md)):

| Field | Description |
|--------|-------------|
| `pattern` | `"linear"` \| `"pyramid"` \| `"fixed"` |
| `rounds` | `number` — length of the generated sequence |

**Linear**

- `start?: number`
- `end?: number`

**Pyramid**

- `start?: number`
- `peak?: number`

**Fixed**

- `reps?: number`

**Derived (stored or computed after blur)**

- `sequence: number[]` — length **must** equal `rounds`; all integers.

---

## Validation Strategy (Core Principle)

- **Do not block** the user with errors for **linear** or **fixed** modes.
- **Auto-correct** invalid combinations on **blur** only.
- **No** correction on every keystroke.
- **Pyramid**: `rounds` **must** be **odd**. **No auto-correction** of parity—**prevent** even `rounds` in the UI (or equivalent hard rule).

---

## Algorithms (Normative)

### Shared: Rounds and indices

- Let `rounds` be an integer ≥ 1.
- Sequence length = `rounds`.
- Linear indexing for building arrays uses round index `0 … rounds-1` unless stated otherwise.

### LINEAR mode

**Goal**: Evenly spaced **integer** repetitions from `start` to `end` across `rounds`.

Let:

- `steps = rounds - 1`  
  - If `rounds === 1`, there is a single round: sequence `[start]` (or corrected `start` as per product; see edge cases).
- `diff = end - start`
- `step = diff / steps` (when `steps > 0`)

**Integer step constraint**

Ideal case: `steps > 0` and `diff % steps === 0` → use exact integer `step = diff / steps`, sequence: `start + i * step` for `i = 0…rounds-1`.

**Auto-correction (MANDATORY) when invalid** (`steps > 0` and `diff % steps !== 0`):

```
step = Math.round(diff / steps)
end = start + step * steps
```

Then generate: `start + i * step` for `i = 0…rounds-1`.

**Direction** (derived, no user control):

- `start < end` → ascending  
- `start > end` → descending  
- `start === end` → flat (all rounds same)

**Minimum progression constraint**

If `steps > 0` and `Math.abs(diff) < steps`:

```
step = (diff >= 0) ? 1 : -1
end = start + step * steps
```

Then generate as above.

**Examples**

- `rounds = 5`, `start = 10`, `end = 30`, `steps = 4`, `diff = 20`, `diff % steps === 0` → `10, 15, 20, 25, 30`.
- `rounds = 4`, `start = 10`, `end = 30` → `step = round(20/3) = 7`, `end = 31` → `10, 17, 24, 31`.
- `rounds = 5`, `start = 10`, `end = 12` → `|diff| < steps` → `step = 1`, `end = 14` → `10, 11, 12, 13, 14`.

### PYRAMID mode

**Goal**: Symmetric progression: increase from `start` → `peak`, then decrease back to `start`.

**Constraint (STRICT)**

- `rounds` **must** be **odd**.  
- **No** auto-correction of parity—UI **must prevent** even `rounds`.

Let:

- `mid = floor(rounds / 2)` — index of peak round (0-based)
- `steps = mid` — number of steps from start to peak
- `diff = peak - start`
- When `steps > 0`: `step = diff / steps`

Same integer divisibility rule as linear; when invalid:

```
step = Math.round(diff / steps)
peak = start + step * steps
```

**Sequence generation**

- `ascending`: `start + i * step` for `i = 0…mid` (inclusive) → length `mid + 1`
- `descending`: mirror of ascending **excluding** the peak value → `i = mid-1 … 0` mapped to values
- `final = ascending + descending` → length `rounds`

**Example**

- `rounds = 5`, `start = 10`, `peak = 30`, `mid = 2`, `steps = 2`, `diff = 20`, `step = 10` → `10, 20, 30, 20, 10`.

### FIXED mode

**Goal**: Same repetitions every round.

- `sequence[i] = reps` for all `i` in `0…rounds-1`.

---

## Totals

- **Per exercise (sets/reps)**: `totalReps = sum(sequence)`.
- **Segment**: `totalRepsSegment = sum(sequence) * count(setsRepsExercisesInSegment)` (definition may be refined if mixed prescription types exist; see data model).

---

## UX Guidelines

1. Do not show formulas or internal `step` math to the user.
2. No error messages for invalid linear/fixed combinations; **interpret intent** and **adjust silently** on blur.
3. Corrections **only** on **blur** / focus loss (not on `change` for correction).
4. **Strongly recommended**: show **preview** of generated reps by round after blur.
5. Pyramid: enforce **odd** `rounds` only via **prevention** (not silent bump).

---

## Functional Requirements

- **FR-RG-001**: The system SHALL support repetition patterns `linear`, `pyramid`, and `fixed` for in-scope segments only.
- **FR-RG-002**: Generated values SHALL be integers only; fractional reps SHALL NOT appear in stored `sequence` or preview.
- **FR-RG-003**: For **linear** and **fixed**, the system SHALL auto-correct inputs on **blur** per the normative rules; it SHALL NOT require user-facing error messages for those corrections.
- **FR-RG-004**: For **pyramid**, `rounds` SHALL be odd; the UI SHALL prevent even `rounds` (no silent parity correction).
- **FR-RG-005**: Correction logic SHALL NOT run on every keystroke for fields that drive `sequence`.
- **FR-RG-006**: The system SHALL show a per-round **preview** of the generated sequence after applicable blur (recommended; treat as SHOULD for MVP if product gates scope).
- **FR-RG-007**: When `segment.rounds` already exists for timing (e.g. EMOM, For Time), repetition generation **round count** SHALL use that same `rounds` value (single source of truth—see [research.md](./research.md)).
- **FR-RG-008**: The generated `sequence` SHALL apply to all **sets/reps** exercises in the segment consistently unless a future story explicitly allows per-exercise override.

---

## Edge Cases

| Case | Expected behavior |
|------|-------------------|
| `rounds === 1` | Single-element sequence; linear/pyramid degenerate to `[start]` or `[reps]` for fixed. |
| `start === end` (linear) | Flat sequence all equal to `start`. |
| `steps === 0` (only when `rounds === 1`) | No division by zero; sequence length 1. |
| Negative progression | Allowed; `step` sign follows `diff`. |
| Pyramid + even rounds | **Prevented** in UI; no auto-fix. |
| Segment with no sets/reps exercises | Preview may show sequence; “apply” to exercises is no-op or hidden until at least one sets/reps exercise exists (product choice; document in implementation). |

---

## Success Criteria

- Given in-scope segment and pattern, after blur, `sequence.length === rounds` and all integers.
- Linear examples in this spec match implementation outputs.
- Pyramid rejects/prevents even `rounds` without silent parity change.
- Fixed mode produces constant arrays.
- No user-facing error spam for linear/fixed correction paths.

---

## Dependencies

- Workout builder segment model and UI ([002](../002-fitness-workout-spec/spec.md)).
- Clarified in [research.md](./research.md): storage of `sequence` on `Segment` vs per `AssignedExercise`.
