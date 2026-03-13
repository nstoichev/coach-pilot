import type { ExerciseMuscles, ExerciseType, WorkingWeight } from './domain.ts'

export type Exercise = {
  id: string
  name: string
  type: ExerciseType
  equipment?: string[]
  muscles?: ExerciseMuscles
  workingWeight?: WorkingWeight
}