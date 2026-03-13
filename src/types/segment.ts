import type { MetricTarget } from './domain.ts'
import type { Exercise } from './exercise.ts'
import type { SegmentType } from './domain.ts'

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
