import type { Exercise } from '../types/exercise.ts'
import {
  EXERCISE_METRICS,
  TRAINING_TYPES,
  type ValidationError,
  type ValidationResult,
} from '../types/domain.ts'
import type { AssignedExercise, Segment } from '../types/segment.ts'
import type { Workout } from '../types/workout.ts'

const buildResult = <T>(value: T, errors: ValidationError[]): ValidationResult<T> => ({
  isValid: errors.length === 0,
  errors,
  value,
})

const hasText = (value: string) => value.trim().length > 0

export const validateExercise = (exercise: Exercise): ValidationResult<Exercise> => {
  const errors: ValidationError[] = []

  if (!hasText(exercise.id)) {
    errors.push({ field: 'id', message: 'Exercise id is required.' })
  }

  if (!hasText(exercise.name)) {
    errors.push({ field: 'name', message: 'Exercise name is required.' })
  }

  if (exercise.type.length === 0) {
    errors.push({ field: 'type', message: 'Select at least one exercise type.' })
  }

  if (exercise.type.some((type) => !TRAINING_TYPES.includes(type))) {
    errors.push({ field: 'type', message: 'Exercise type contains an unsupported value.' })
  }

  if (exercise.equipment?.some((item) => !hasText(item))) {
    errors.push({ field: 'equipment', message: 'Equipment entries cannot be blank.' })
  }

  if (exercise.muscles) {
    if (exercise.muscles.primary.some((item) => !hasText(item))) {
      errors.push({ field: 'muscles.primary', message: 'Primary muscles cannot contain blank values.' })
    }

    if (exercise.muscles.stabilizing.some((item) => !hasText(item))) {
      errors.push({
        field: 'muscles.stabilizing',
        message: 'Stabilizing muscles cannot contain blank values.',
      })
    }
  }

  if (exercise.workingWeight && exercise.workingWeight.value <= 0) {
    errors.push({
      field: 'workingWeight.value',
      message: 'Working weight must be greater than zero.',
    })
  }

  if (exercise.prescription.mode === 'metric' && exercise.prescription.metricOptions.length === 0) {
    errors.push({
      field: 'prescription.metricOptions',
      message: 'Metric-based exercises must define at least one metric option.',
    })
  }

  if (
    exercise.prescription.mode === 'metric' &&
    exercise.prescription.metricOptions.some((metric) => !EXERCISE_METRICS.includes(metric))
  ) {
    errors.push({
      field: 'prescription.metricOptions',
      message: 'Exercise metric options contain an unsupported value.',
    })
  }

  return buildResult(exercise, errors)
}

export const validateSegment = (segment: Segment): ValidationResult<Segment> => {
  const errors: ValidationError[] = []

  if (!hasText(segment.id)) {
    errors.push({ field: 'id', message: 'Segment id is required.' })
  }

  if (!hasText(segment.name)) {
    errors.push({ field: 'name', message: 'Segment name is required.' })
  }

  if (segment.restInterval !== undefined && segment.restInterval < 0) {
    errors.push({ field: 'restInterval', message: 'Segment rest interval cannot be negative.' })
  }

  if (segment.durationSeconds !== undefined && segment.durationSeconds <= 0) {
    errors.push({
      field: 'durationSeconds',
      message: 'Segment duration must be greater than zero.',
    })
  }

  if (segment.intervalSeconds !== undefined && segment.intervalSeconds <= 0) {
    errors.push({
      field: 'intervalSeconds',
      message: 'Segment interval must be greater than zero.',
    })
  }

  if (segment.rounds !== undefined && segment.rounds <= 0) {
    errors.push({
      field: 'rounds',
      message: 'Segment rounds must be greater than zero.',
    })
  }

  if (segment.timeCapSeconds !== undefined && segment.timeCapSeconds <= 0) {
    errors.push({
      field: 'timeCapSeconds',
      message: 'Time cap must be greater than zero.',
    })
  }

  if (segment.segmentType === 'emom') {
    if (!segment.intervalSeconds) {
      errors.push({
        field: 'intervalSeconds',
        message: 'EMOM segments require an interval.',
      })
    }

    if (!segment.rounds) {
      errors.push({
        field: 'rounds',
        message: 'EMOM segments require a set count.',
      })
    }
  }

  if (segment.segmentType === 'amrap' && !segment.durationSeconds) {
    errors.push({
      field: 'durationSeconds',
      message: 'AMRAP segments require a duration.',
    })
  }

  if (segment.segmentType === 'forTime' && !segment.timeCapSeconds) {
    errors.push({
      field: 'timeCapSeconds',
      message: 'For Time segments require a time cap.',
    })
  }

  if (segment.exercises.length === 0) {
    errors.push({
      field: 'exercises',
      message: 'Segment must have at least one exercise.',
    })
  }

  segment.exercises.forEach((assignedExercise, index) => {
    const exerciseResult = validateExercise(assignedExercise.exercise)
    exerciseResult.errors.forEach((error) => {
      errors.push({
        field: `exercises.${index}.${error.field}`,
        message: error.message,
      })
    })

    if (assignedExercise.sets !== undefined && assignedExercise.sets < 0) {
      errors.push({
        field: `exercises.${index}.sets`,
        message: 'Sets cannot be negative.',
      })
    }

    if (assignedExercise.repetitions !== undefined && assignedExercise.repetitions <= 0) {
      errors.push({
        field: `exercises.${index}.repetitions`,
        message: 'Repetitions must be greater than zero when provided.',
      })
    }
  })

  return buildResult(segment, errors)
}

export const validateWorkout = (
  workout: Workout,
  availableExercises: Exercise[],
): ValidationResult<Workout> => {
  const errors: ValidationError[] = []
  const knownExerciseIds = new Set(availableExercises.map((exercise) => exercise.id))

  if (!hasText(workout.id)) {
    errors.push({ field: 'id', message: 'Workout id is required.' })
  }

  if (!hasText(workout.name)) {
    errors.push({ field: 'name', message: 'Workout name is required.' })
  }

  workout.segments.forEach((segment, segmentIndex) => {
    const segmentResult = validateSegment(segment)
    segmentResult.errors.forEach((error) => {
      errors.push({
        field: `segments.${segmentIndex}.${error.field}`,
        message: error.message,
      })
    })

    segment.exercises.forEach((assignedExercise, exerciseIndex) => {
      if (!knownExerciseIds.has(assignedExercise.exerciseId)) {
        errors.push({
          field: `segments.${segmentIndex}.exercises.${exerciseIndex}.id`,
          message: 'Exercise must exist in the Exercise Database before assignment.',
        })
      }
    })
  })

  return buildResult(workout, errors)
}

export const isExerciseReferencedInWorkout = (
  workout: Workout,
  exerciseId: string,
): boolean =>
  workout.segments.some((segment) =>
    segment.exercises.some((assignedExercise) => assignedExercise.exerciseId === exerciseId),
  )

export const getExerciseDeleteGuardMessage = (
  workout: Workout,
  exerciseId: string,
): string | null =>
  isExerciseReferencedInWorkout(workout, exerciseId)
    ? 'This exercise is already used in the current workout and cannot be deleted yet.'
    : null

export const canAssignExerciseToSegment = (
  exerciseId: string,
  availableExercises: Exercise[],
): boolean => knownExerciseIds(availableExercises).has(exerciseId)

export const validateAssignedExercise = (
  assignedExercise: AssignedExercise,
): ValidationResult<AssignedExercise> => {
  const errors: ValidationError[] = []

  if (assignedExercise.exercise.prescription.mode === 'sets-reps') {
    if (assignedExercise.sets !== undefined && assignedExercise.sets < 0) {
      errors.push({
        field: 'sets',
        message: 'Sets cannot be negative.',
      })
    }

    if (
      assignedExercise.repetitions !== undefined &&
      assignedExercise.repetitions <= 0 &&
      !assignedExercise.isMaxRepetitions
    ) {
      errors.push({
        field: 'repetitions',
        message: 'Repetitions must be greater than zero when provided unless using max reps.',
      })
    }
  }

  if (assignedExercise.exercise.prescription.mode === 'metric') {
    if (!assignedExercise.metricTarget) {
      errors.push({
        field: 'metricTarget',
        message: 'Select a metric and value for metric-based exercises.',
      })
    } else {
      if (
        !assignedExercise.exercise.prescription.metricOptions.includes(
          assignedExercise.metricTarget.type,
        )
      ) {
        errors.push({
          field: 'metricTarget.type',
          message: 'Selected metric is not supported for this exercise.',
        })
      }

      if (assignedExercise.metricTarget.value <= 0) {
        errors.push({
          field: 'metricTarget.value',
          message: 'Metric value must be greater than zero.',
        })
      }
    }
  }

  return buildResult(assignedExercise, errors)
}

export const findExerciseValidationErrors = (exercises: Exercise[]): ValidationError[] =>
  exercises.flatMap((exercise, index) => {
    const errors = validateExercise(exercise).errors.map((error) => ({
      field: `exercises.${index}.${error.field}`,
      message: error.message,
    }))

    const duplicateIdCount = exercises.filter((item) => item.id === exercise.id).length

    if (duplicateIdCount > 1) {
      errors.push({
        field: `exercises.${index}.id`,
        message: 'Exercise id must be unique within the Exercise Database.',
      })
    }

    return errors
  })

const knownExerciseIds = (availableExercises: Exercise[]) =>
  new Set(availableExercises.map((exercise) => exercise.id))
