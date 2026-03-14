import type { Workout } from '../types/workout.ts'

/**
 * Placeholder contract for the Fatigue System.
 * Future: consumes workout and exercise metadata to estimate fatigue,
 * suggest scaling, or drive auto-generation constraints.
 */

export type FatigueEstimate = {
  status: 'placeholder' | 'estimated' | 'error'
  workoutId: string
  /** Placeholder: no actual fatigue score computed yet. */
  score?: number
  message?: string
}

/**
 * Placeholder: accepts a workout and returns a stub result.
 * Does not compute fatigue yet.
 */
export function estimateWorkoutFatigue(workout: Workout): FatigueEstimate {
  return {
    status: 'placeholder',
    workoutId: workout.id,
    message: 'Fatigue estimation not implemented; workout metadata is available for future integration.',
  }
}
