export type Exercise = {
  id: string
  name: string
  type: "strength" | "crossfit" | "mobility"
  equipment?: string[]
  muscles?: string[]
}

export type Segment = {
  id: string
  name: string
  exercises: Exercise[]
}

export type Workout = {
  id: string
  name: string
  segments: Segment[]
  restBetweenSegments?: number // minutes
}