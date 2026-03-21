# Contract: Repetition generation (pure functions)

**Feature**: [spec.md](../spec.md)  
**Consumers**: Workout builder (`SegmentEditor` or dedicated subcomponent), tests.

---

## Purpose

Define a **small, deterministic API** for:

1. Applying **blur-time corrections** to user inputs (linear / pyramid peak / fixed reps).
2. Building **`repSequence: number[]`** from corrected config.

No I/O, no React dependencies.

---

## Suggested module surface

**Module** (indicative path): `src/services/repetition-generation.ts`

### Types

```ts
export type RepSchemePattern = 'linear' | 'pyramid' | 'fixed'

export type RepSchemeConfig = {
  pattern: RepSchemePattern
  rounds: number
  start?: number
  end?: number
  peak?: number
  reps?: number
}

export type BuildRepSequenceResult =
  | { ok: true; sequence: number[]; config: RepSchemeConfig }
  | { ok: false; reason: 'pyramid_even_rounds' | 'invalid_rounds' | 'missing_fields' }
```

### Functions

#### `correctRepSchemeConfig(config: RepSchemeConfig): RepSchemeConfig`

- **Input**: Raw config as the user left it on blur (numbers may be non-integers from UI—coerce to integers first per product rules).
- **Output**: Config with **linear** `end` corrected per spec; **pyramid** `peak` corrected per spec; **fixed** `reps` valid integer.
- **Side effects**: none.
- **Note**: For **pyramid**, if `rounds` is even, either caller must not invoke this or function returns unchanged / `buildRepSequence` returns `ok: false`—align with UI prevention.

#### `buildRepSequence(config: RepSchemeConfig): BuildRepSequenceResult`

- **Precondition**: `rounds >= 1`.
- **Postcondition** (success): `sequence.length === rounds`, all integers, algorithms match [spec.md](../spec.md).
- **Pyramid**: if `rounds % 2 === 0`, return `{ ok: false, reason: 'pyramid_even_rounds' }`.

---

## Test obligations (recommended)

| Case | Expected |
|------|-----------|
| Linear 5 / 10→30 | `10,15,20,25,30` |
| Linear 4 / 10→30 | `10,17,24,31` |
| Linear 5 / 10→12 | `10,11,12,13,14` |
| Fixed 4 / reps 15 | `15,15,15,15` |
| Pyramid 5 / start 10 peak 30 | `10,20,30,20,10` |
| Pyramid rounds=4 | `ok: false` |

---

## Versioning

- **v1**: Single shared `repSequence` on segment; no per-exercise override.
