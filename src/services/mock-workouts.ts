import type { Workout } from '../types/workout.ts'
import type { Segment } from '../types/segment.ts'
import type { AssignedExercise } from '../types/segment.ts'
import { mockExerciseDatabase } from './mock-exercise-database.ts'
import { getGeneratedSegmentName } from './workout-domain.ts'

/**
 * Sample workouts for Timer Generator, Fatigue System, and workout-generator
 * placeholder integration. CrossFit-style EMOM and mixed segment types.
 */

function findExercise(id: string) {
  const ex = mockExerciseDatabase.find((e) => e.id === id)
  if (!ex) throw new Error(`Exercise not found: ${id}`)
  return ex
}

function assigned(
  id: string,
  exerciseId: string,
  overrides: Partial<AssignedExercise> = {},
): AssignedExercise {
  return {
    id,
    exerciseId,
    exercise: findExercise(exerciseId),
    ...overrides,
  }
}

function emomSegment(
  id: string,
  intervalSeconds: number,
  rounds: number,
  exercises: AssignedExercise[],
  restInterval?: number,
): Segment {
  const seg: Segment = {
    id,
    name: 'EMOM',
    exercises,
    segmentType: 'emom',
    intervalSeconds,
    rounds,
    restInterval,
  }
  return { ...seg, name: getGeneratedSegmentName(seg) }
}

/** CrossFit-style EMOM workout: 10 min, 10 rounds, 1 min per round. */
export const mockWorkoutEmom10: Workout = (() => {
  const segment = emomSegment(
    'segment-mock-emom-10',
    60,
    10,
    [
      assigned('ae-1', 'exercise-front-squat', { sets: 5, repetitions: 5 }),
      assigned('ae-2', 'exercise-row', {
        metricTarget: { type: 'calories', value: 15, isMax: false },
      }),
    ],
    0,
  )
  return {
    id: 'workout-mock-emom-10',
    name: 'EMOM 10 CrossFit',
    segments: [segment],
  }
})()

/** Sample workout list for placeholder consumers. */
export const mockWorkouts: Workout[] = [mockWorkoutEmom10]
