import type { Exercise } from '../types/exercise.ts'
import type { AssignedExercise, Segment } from '../types/segment.ts'
import type { Workout } from '../types/workout.ts'
import { canAssignExerciseToSegment } from './workout-validation.ts'

export const reorderList = <T>(items: T[], fromIndex: number, toIndex: number): T[] => {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length ||
    fromIndex === toIndex
  ) {
    return items
  }

  const reordered = [...items]
  const [movedItem] = reordered.splice(fromIndex, 1)
  reordered.splice(toIndex, 0, movedItem)
  return reordered
}

export const reorderSegments = (workout: Workout, fromIndex: number, toIndex: number): Workout => ({
  ...workout,
  segments: reorderList(workout.segments, fromIndex, toIndex),
})

export const reorderSegmentExercises = (
  segment: Segment,
  fromIndex: number,
  toIndex: number,
): Segment => ({
  ...segment,
  exercises: reorderList(segment.exercises, fromIndex, toIndex),
})

export const assignExerciseToSegment = (
  segment: Segment,
  exerciseId: string,
  availableExercises: Exercise[],
): Segment => {
  if (!canAssignExerciseToSegment(exerciseId, availableExercises)) {
    return segment
  }

  const exercise = availableExercises.find((item) => item.id === exerciseId)

  if (!exercise) {
    return segment
  }

  const assignedExercise: AssignedExercise = {
    id: `assigned-exercise-${crypto.randomUUID()}`,
    exerciseId: exercise.id,
    exercise,
  }

  return {
    ...segment,
    exercises: [...segment.exercises, assignedExercise],
  }
}

export const removeExerciseFromSegment = (segment: Segment, exerciseIndex: number): Segment => {
  if (exerciseIndex < 0 || exerciseIndex >= segment.exercises.length) {
    return segment
  }

  return {
    ...segment,
    exercises: segment.exercises.filter((_, index) => index !== exerciseIndex),
  }
}

export const updateAssignedExercise = (
  segment: Segment,
  updatedAssignedExercise: AssignedExercise,
): Segment => ({
  ...segment,
  exercises: segment.exercises.map((assignedExercise) =>
    assignedExercise.id === updatedAssignedExercise.id ? updatedAssignedExercise : assignedExercise,
  ),
})

export const syncExerciseReferencesInSegment = (
  segment: Segment,
  updatedExercise: Exercise,
): Segment => ({
  ...segment,
  exercises: segment.exercises.map((assignedExercise) =>
    assignedExercise.exerciseId === updatedExercise.id
      ? {
          ...assignedExercise,
          exercise: updatedExercise,
        }
      : assignedExercise,
  ),
})

export const replaceSegment = (workout: Workout, updatedSegment: Segment): Workout => ({
  ...workout,
  segments: workout.segments.map((segment) =>
    segment.id === updatedSegment.id ? updatedSegment : segment,
  ),
})

export const getSegmentEstimatedDurationSeconds = (
  segment: Segment,
): number | undefined => {
  switch (segment.segmentType) {
    case 'emom':
      return segment.intervalSeconds && segment.rounds
        ? segment.intervalSeconds * segment.rounds
        : undefined
    case 'amrap':
      return segment.durationSeconds
    case 'forTime':
      return segment.timeCapSeconds
    default:
      return undefined
  }
}

/** Generated display name for predefined segment types; custom segments use their stored name. */
export const getGeneratedSegmentName = (segment: Segment): string => {
  switch (segment.segmentType) {
    case 'emom': {
      const interval = segment.intervalSeconds ?? 60
      const rounds = segment.rounds ?? 10
      if (interval === 60) {
        return `EMOM ${rounds}`
      }
      return `E${formatSecondsAsClock(interval)}Om ${rounds}`
    }
    case 'amrap': {
      const duration = segment.durationSeconds ?? 600
      return `AMRAP ${formatSecondsAsClock(duration)}`
    }
    case 'forTime':
      return 'For Time'
    case 'custom':
    default:
      return segment.name
  }
}

export const formatSecondsAsClock = (totalSeconds?: number): string => {
  if (!totalSeconds || totalSeconds <= 0) {
    return 'Not set'
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export const parseClockInput = (value: string): number | undefined => {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return undefined
  }

  if (/^\d+$/.test(trimmedValue)) {
    return Number(trimmedValue)
  }

  const [minutesPart, secondsPart] = trimmedValue.split(':')

  if (!minutesPart || secondsPart === undefined) {
    return undefined
  }

  const minutes = Number(minutesPart)
  const seconds = Number(secondsPart)

  if (
    Number.isNaN(minutes) ||
    Number.isNaN(seconds) ||
    minutes < 0 ||
    seconds < 0 ||
    seconds >= 60
  ) {
    return undefined
  }

  return minutes * 60 + seconds
}
