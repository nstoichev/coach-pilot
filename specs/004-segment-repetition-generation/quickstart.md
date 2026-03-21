# Quickstart: Workout Segment Repetition Generation

**Feature**: [spec.md](./spec.md)

Manual checks for builder UX and pure generation behavior after implementation.

---

## Prerequisites

- App running locally (`npm run dev`).
- A workout with an **in-scope** segment (Custom or segment that shows reps for sets/reps exercises).
- At least one **sets/reps** exercise assigned.

---

## Linear mode

1. Open repetition generation; choose **linear**.
2. Set `rounds = 5`, `start = 10`, `end = 30`.
3. Tab out / blur all fields.
4. **Expect** preview: `10, 15, 20, 25, 30`.
5. Change `end = 30`, `rounds = 4` (keep start 10), blur.
6. **Expect** corrected end and preview: `10, 17, 24, 31` (per spec).
7. Set `rounds = 5`, `start = 10`, `end = 12`, blur.
8. **Expect** expanded progression: `10, 11, 12, 13, 14`.

**Blur checklist**

- [ ] Typing invalid combo does **not** rewrite values mid-keystroke.
- [ ] Blur applies correction and updates preview once.

---

## Fixed mode

1. Choose **fixed**; `rounds = 4`, `reps = 15`, blur.
2. **Expect** preview: `15, 15, 15, 15`.

---

## Pyramid mode

1. Choose **pyramid**; confirm **rounds** control **cannot** be set to an even number (or equivalent prevention).
2. Set `rounds = 5`, `start = 10`, `peak = 30`, blur.
3. **Expect** preview: `10, 20, 30, 20, 10`.

---

## EMOM / segment with existing `rounds`

1. Create EMOM (or segment with fixed `rounds` from template).
2. Open repetition generation.
3. **Expect** sequence length to match **segment `rounds`** (no second conflicting rounds field).

---

## Sequence preview (compact)

1. After blur, **expect** a single line of dash-separated reps (e.g. `10-15-20-25-30`), not per-round labels.
2. Per-exercise and segment-wide totals are still computed in code for future use; the builder UI does not show them.

---

## Regression

- **Death by** / **Tabata**: repetition generation block **not shown**.
- Metric exercise only: generation may be hidden or no-op for metric rows.

---

## Implementation verification (Phase 7)

- [ ] `npm run build` passes (TypeScript + Vite).
- [ ] After a successful blur with preview, sets/reps exercises show **repetitions** = round 1 value (`repSequence[0]`) unless **Max reps** is enabled for that row.
- [ ] Workout validation does **not** fail for normal linear/fixed corrected values; only clearly invalid `repSequence` entries (non-integers, negative) should surface an error.
