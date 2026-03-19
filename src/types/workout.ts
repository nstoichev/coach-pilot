import type { Segment } from './segment.ts'

export type Workout = {
  id: string
  name: string
  segments: Segment[]
  /** Calendar scheduling day in local YYYY-MM-DD format. */
  scheduledDate?: string
  /** Optional completion timestamp/flag carrier for future calendar indicators. */
  completedAt?: string
}
