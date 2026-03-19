import type { Segment } from './segment.ts'

export type Workout = {
  id: string
  name: string
  segments: Segment[]
  /** Calendar: date the workout is scheduled for (YYYY-MM-DD, local date). */
  scheduledDate?: string
  /** Calendar: set when the user has completed the workout (ISO date or datetime). */
  completedAt?: string
}
