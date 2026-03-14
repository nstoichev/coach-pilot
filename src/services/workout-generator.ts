import type { Workout } from '../types/workout.ts'

/**
 * Placeholder contract for workout auto-generation.
 * Future: accepts constraints (duration, equipment, focus) and returns
 * generated workouts using the same Workout domain model.
 */

export type WorkoutGeneratorConstraints = {
  /** Target total duration in seconds (optional). */
  targetDurationSeconds?: number
  /** Equipment available (optional). */
  equipmentFilter?: string[]
  /** Segment types to include (optional). */
  segmentTypes?: string[]
}

export type WorkoutGeneratorResult = {
  status: 'placeholder' | 'generated' | 'error'
  workout?: Workout
  message?: string
}

/**
 * Placeholder: does not generate workouts yet.
 * Returns a stub indicating the contract is ready for future implementation.
 */
export function generateWorkout(_constraints: WorkoutGeneratorConstraints): WorkoutGeneratorResult {
  return {
    status: 'placeholder',
    message: 'Workout auto-generation not implemented; constraints contract is ready for future integration.',
  }
}
