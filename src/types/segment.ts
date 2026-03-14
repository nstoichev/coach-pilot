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

export type Segment = {
  id: string
  name: string
  exercises: AssignedExercise[]
  segmentType: SegmentType
  durationSeconds?: number
  intervalSeconds?: number
  rounds?: number
  timeCapSeconds?: number
  restInterval?: number
}
