import type { RepSchemeConfig, RepSchemePattern, Segment } from '../types/segment.ts'

export type BuildRepSequenceResult =
  | { ok: true; sequence: number[]; config: RepSchemeConfig }
  | { ok: false; reason: 'pyramid_even_rounds' | 'invalid_rounds' | 'missing_fields' }

function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, Math.round(n)))
}

function correctLinearEnd(start: number, end: number, rounds: number): { start: number; end: number } {
  const steps = rounds - 1
  if (steps <= 0) {
    return { start, end: start }
  }
  let diff = end - start
  if (Math.abs(diff) < steps) {
    const step = diff >= 0 ? 1 : -1
    return { start, end: start + step * steps }
  }
  if (diff % steps !== 0) {
    const step = Math.round(diff / steps)
    return { start, end: start + step * steps }
  }
  return { start, end }
}

function correctPyramidPeak(start: number, peak: number, rounds: number): { start: number; peak: number } {
  const mid = Math.floor(rounds / 2)
  const steps = mid
  if (steps <= 0) {
    return { start, peak: start }
  }
  let diff = peak - start
  if (Math.abs(diff) < steps) {
    const step = diff >= 0 ? 1 : -1
    return { start, peak: start + step * steps }
  }
  if (diff % steps !== 0) {
    const step = Math.round(diff / steps)
    return { start, peak: start + step * steps }
  }
  return { start, peak }
}

/**
 * Coerces integers and applies normative linear / pyramid / fixed corrections from spec 004.
 *
 * **T011 / input coercion**: Non-finite or missing numerics use safe defaults before correction
 * (`start`/`end`/`peak`/`reps`/`rounds`); no user-facing errors. Empty UI strings should be
 * converted to fallbacks in the caller before building `RepSchemeConfig`.
 */
export function correctRepSchemeConfig(config: RepSchemeConfig): RepSchemeConfig {
  const pattern = config.pattern
  let rounds = clampInt(Number(config.rounds), 1, 50)

  if (pattern === 'fixed') {
    let reps = Math.round(Number(config.reps ?? 10))
    if (!Number.isFinite(reps) || reps < 1) reps = 1
    return { pattern, rounds, reps }
  }

  let start = Math.round(Number(config.start ?? 10))
  if (!Number.isFinite(start)) start = 10

  if (pattern === 'linear') {
    let end = Math.round(Number(config.end ?? start))
    if (!Number.isFinite(end)) end = start
    if (rounds <= 1) {
      return { pattern, rounds, start, end: start }
    }
    const { start: s, end: e } = correctLinearEnd(start, end, rounds)
    return { pattern, rounds, start: s, end: e }
  }

  if (pattern === 'pyramid') {
    let peak = Math.round(Number(config.peak ?? start + 1))
    if (!Number.isFinite(peak)) peak = start + 1
    if (rounds % 2 === 0) {
      return { pattern, rounds, start, peak }
    }
    if (rounds <= 1) {
      return { pattern, rounds, start, peak: start }
    }
    const { start: s, peak: p } = correctPyramidPeak(start, peak, rounds)
    return { pattern, rounds, start: s, peak: p }
  }

  return { pattern, rounds, start }
}

function buildLinearSequence(start: number, end: number, rounds: number): number[] {
  if (rounds <= 1) return [start]
  const steps = rounds - 1
  const diff = end - start
  const step = diff / steps
  return Array.from({ length: rounds }, (_, i) => start + i * step)
}

function buildPyramidSequence(start: number, peak: number, rounds: number): number[] {
  const mid = Math.floor(rounds / 2)
  const steps = mid
  if (steps <= 0) return [start]
  const diff = peak - start
  const step = diff / steps
  const ascending: number[] = []
  for (let i = 0; i <= mid; i += 1) {
    ascending.push(start + i * step)
  }
  const descending: number[] = []
  for (let i = mid - 1; i >= 0; i -= 1) {
    descending.push(start + i * step)
  }
  return [...ascending, ...descending]
}

/**
 * Builds `repSequence` from a config (internally re-corrects). **T016**: pyramid + even `rounds` returns
 * `{ ok: false, reason: 'pyramid_even_rounds' }` — never fabricates a sequence; UI should keep last valid
 * `repSequence` when commit is aborted.
 */
export function buildRepSequence(config: RepSchemeConfig): BuildRepSequenceResult {
  const corrected = correctRepSchemeConfig(config)
  const rounds = corrected.rounds

  if (!Number.isFinite(rounds) || rounds < 1) {
    return { ok: false, reason: 'invalid_rounds' }
  }

  if (corrected.pattern === 'pyramid' && rounds % 2 === 0) {
    return { ok: false, reason: 'pyramid_even_rounds' }
  }

  switch (corrected.pattern) {
    case 'fixed': {
      const reps = corrected.reps
      if (reps === undefined) return { ok: false, reason: 'missing_fields' }
      return {
        ok: true,
        config: corrected,
        sequence: Array.from({ length: rounds }, () => reps),
      }
    }
    case 'linear': {
      const { start, end } = corrected
      if (start === undefined || end === undefined) return { ok: false, reason: 'missing_fields' }
      return {
        ok: true,
        config: corrected,
        sequence: buildLinearSequence(start, end, rounds),
      }
    }
    case 'pyramid': {
      const { start, peak } = corrected
      if (start === undefined || peak === undefined) return { ok: false, reason: 'missing_fields' }
      return {
        ok: true,
        config: corrected,
        sequence: buildPyramidSequence(start, peak, rounds),
      }
    }
  }
}

/** Nearest odd in [1, 49] for pyramid draft defaults (caller should surface UX when adjusting). */
export function nearestOddRounds(rounds: number): number {
  const r = clampInt(rounds, 1, 49)
  if (r % 2 === 1) return r
  return r - 1 >= 1 ? r - 1 : r + 1
}

export function defaultRepSchemeForPattern(pattern: RepSchemePattern, rounds: number): RepSchemeConfig {
  const r = clampInt(rounds, 1, 50)
  switch (pattern) {
    case 'linear':
      return { pattern: 'linear', rounds: r, start: 10, end: 10 }
    case 'pyramid':
      return { pattern: 'pyramid', rounds: r, start: 10, peak: 20 }
    case 'fixed':
      return { pattern: 'fixed', rounds: r, reps: 10 }
  }
}

/**
 * Whether reps-per-round mode is active for UI (checkbox on, or legacy segment with `repScheme` / sequence).
 * Explicit `repGenerationEnabled: false` always turns it off.
 */
export function isSegmentRepGenActive(segment: Segment): boolean {
  if (segment.repGenerationEnabled === false) return false
  if (segment.repGenerationEnabled === true) return true
  return Boolean(segment.repScheme || (segment.repSequence && segment.repSequence.length > 0))
}

/** In-scope for repetition UI: not Death by / Tabata, and at least one sets-reps exercise. */
export function segmentSupportsRepetitionGeneration(segment: Segment): boolean {
  if (segment.segmentType === 'deathBy' || segment.segmentType === 'tabata') {
    return false
  }
  return segment.exercises.some((a) => a.exercise.prescription.mode === 'sets-reps')
}

export function countSetsRepsExercises(segment: Segment): number {
  return segment.exercises.filter((a) => a.exercise.prescription.mode === 'sets-reps').length
}

/** Sum of reps across rounds (one sets/reps exercise). */
export function totalRepsPerExercise(repSequence: number[]): number {
  return repSequence.reduce((sum, n) => sum + n, 0)
}

/** Total reps if every sets/reps exercise in the segment follows the same sequence. */
export function segmentTotalReps(segment: Segment, repSequence: number[]): number {
  return totalRepsPerExercise(repSequence) * countSetsRepsExercises(segment)
}

/** True when segment rounds are owned by timing UI (EMOM / For Time), not rep-gen only. */
export function segmentHasTimingLockedRounds(segment: Segment): boolean {
  return segment.segmentType === 'emom' || segment.segmentType === 'forTime'
}
