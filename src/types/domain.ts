export const TRAINING_TYPES = ['strength', 'crossfit', 'mobility'] as const

export type TrainingType = (typeof TRAINING_TYPES)[number]

export type ExerciseType = TrainingType[]

export const EXERCISE_METRICS = ['calories', 'distance', 'speed', 'time'] as const

export type ExerciseMetric = (typeof EXERCISE_METRICS)[number]

/** Advanced metric sliders (speed, watts) shown in "Advanced settings" to avoid UI overload. */
export const ADVANCED_METRIC_KEYS = ['speed', 'watts'] as const
export type AdvancedMetricKey = (typeof ADVANCED_METRIC_KEYS)[number]

export type ExercisePrescription =
  | {
      mode: 'sets-reps'
    }
  | {
      mode: 'metric'
      metricOptions: ExerciseMetric[]
      /** When set, an "Advanced settings" section exposes these optional sliders (e.g. speed, watts). */
      advancedMetrics?: readonly AdvancedMetricKey[]
    }

export type MetricTarget = {
  type: ExerciseMetric
  value: number
  isMax?: boolean
  /** Optional; used when exercise has advancedMetrics (e.g. Row). */
  speed?: number
  /** Optional; used when exercise has advancedMetrics (e.g. Row). */
  watts?: number
}

export const SEGMENT_TYPES = ['custom', 'emom', 'amrap', 'forTime', 'deathBy', 'chipper', 'tabata'] as const

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
