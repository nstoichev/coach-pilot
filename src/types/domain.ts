export const TRAINING_TYPES = ['strength', 'crossfit', 'mobility'] as const

export type TrainingType = (typeof TRAINING_TYPES)[number]

export type ExerciseType = TrainingType[]

export const SEGMENT_TYPES = ['emom', 'amrap', 'forTime', 'strength'] as const

export type SegmentType = (typeof SEGMENT_TYPES)[number]

export type MuscleRole = 'primary' | 'stabilizing'

export type MuscleGroup = {
  name: string
  role: MuscleRole
}

export type ExerciseMuscles = {
  primary: string[]
  stabilizing: string[]
}

export type WorkingWeightMode = 'weight' | 'repMax'

export type WorkingWeight = {
  mode: WorkingWeightMode
  value: number
}

export type EquipmentRequirement = {
  name: string
  sourceExerciseIds?: string[]
}

export type ValidationError = {
  field: string
  message: string
}

export type ValidationResult<T> = {
  isValid: boolean
  errors: ValidationError[]
  value: T
}
