import type { Segment } from './segment.ts'

export type Workout = {
  id: string
  name: string
  segments: Segment[]
}
