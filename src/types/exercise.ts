import type {
  ExerciseMuscles,
  ExercisePrescription,
  ExerciseType,
  WorkingWeight,
} from './domain.ts'

export type Exercise = {
  id: string
  name: string
  type: ExerciseType
  prescription: ExercisePrescription
  equipment?: string[]
  muscles?: ExerciseMuscles
  workingWeight?: WorkingWeight
}