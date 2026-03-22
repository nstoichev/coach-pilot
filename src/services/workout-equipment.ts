import type { Workout } from '../types/workout.ts'

/**
 * Unique equipment labels for the workout, sorted for stable display.
 * Traversal order: segments in workout order, exercises per segment in order.
 * First-seen casing is kept when merging case-insensitive duplicates.
 */
export function getWorkoutRequiredEquipment(workout: Workout): string[] {
  const byLower = new Map<string, string>()
  for (const segment of workout.segments) {
    for (const assigned of segment.exercises) {
      const items = assigned.exercise.equipment
      if (!items?.length) continue
      for (const raw of items) {
        const trimmed = raw.trim()
        if (!trimmed) continue
        const lower = trimmed.toLowerCase()
        if (!byLower.has(lower)) {
          byLower.set(lower, trimmed)
        }
      }
    }
  }
  return [...byLower.values()].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  )
}
