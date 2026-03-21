import type { MetricTarget } from './domain.ts'
import type { Exercise } from './exercise.ts'
import type { SegmentType } from './domain.ts'

/**
 * Segment and AssignedExercise are consumed by the Timer Generator, Fatigue System,
 * and workout auto-generation placeholders. EMOM/AMRAP/For Time fields
 * (intervalSeconds, rounds, durationSeconds, timeCapSeconds) provide the structure
 * needed for future timer and generator integration.
 */

export type AssignedExercise = {
  id: string
  exerciseId: string
  exercise: Exercise
  sets?: number
  repetitions?: number
  isMaxRepetitions?: boolean
  metricTarget?: MetricTarget
}

/** Per-round repetition generation pattern (builder). */
export type RepSchemePattern = 'linear' | 'pyramid' | 'fixed'

/** User-facing repetition scheme; may be corrected on blur (linear end, pyramid peak, etc.). */
export type RepSchemeConfig = {
  pattern: RepSchemePattern
  rounds: number
  start?: number
  end?: number
  peak?: number
  reps?: number
}

export type Segment = {
  id: string
  name: string
  exercises: AssignedExercise[]
  segmentType: SegmentType
  durationSeconds?: number
  intervalSeconds?: number
  rounds?: number
  timeCapSeconds?: number
  /** Tabata: work interval in seconds (default 20, range 10–60). */
  workSeconds?: number
  /** Tabata: rest interval in seconds (default 10, range 10–60). */
  restSeconds?: number
  restInterval?: number
  /**
   * When true, builder shows reps-per-round controls and drives sets/reps from `repSequence`.
   * Explicit `false` clears UI even if legacy data existed; omit/false with no scheme = off.
   */
  repGenerationEnabled?: boolean
  /** Last committed repetition-generation inputs (after blur). */
  repScheme?: RepSchemeConfig
  /** Generated integer reps per round; length === repScheme.rounds when build succeeds. */
  repSequence?: number[]
}
