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

function deathBySegment(
  id: string,
  exercises: AssignedExercise[],
  restInterval?: number,
): Segment {
  const seg: Segment = {
    id,
    name: 'Death by',
    exercises,
    segmentType: 'deathBy',
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

/** Death by Burpees: 1 rep min 1, 2 reps min 2, … until failure; Stop ends segment. */
export const mockWorkoutDeathByBurpees: Workout = (() => {
  const segment = deathBySegment(
    'segment-mock-deathby-burpees',
    [assigned('ae-db-1', 'exercise-burpee-over-bar')],
    0,
  )
  return {
    id: 'workout-mock-deathby-burpees',
    name: 'Death by Burpees',
    segments: [segment],
  }
})()

/** Death by Burpees + Kettlebell Swings: two exercises, reps increase each round. */
export const mockWorkoutDeathByBurpeesAndSwings: Workout = (() => {
  const segment = deathBySegment(
    'segment-mock-deathby-burpees-swings',
    [
      assigned('ae-db-2a', 'exercise-burpee-over-bar'),
      assigned('ae-db-2b', 'exercise-kettlebell-swing'),
    ],
    0, // no rest in sample; add rest in builder if you add more segments
  )
  return {
    id: 'workout-mock-deathby-burpees-swings',
    name: 'Death by Burpees + Kettlebell Swings',
    segments: [segment],
  }
})()

/** Sample workout list for placeholder consumers. */
export const mockWorkouts: Workout[] = [
  mockWorkoutEmom10,
  mockWorkoutDeathByBurpees,
  mockWorkoutDeathByBurpeesAndSwings,
]
