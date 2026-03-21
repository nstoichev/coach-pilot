import type { Workout } from '../types/workout.ts'
import type { AssignedExercise, Segment } from '../types/segment.ts'
import { mockExerciseDatabase } from './mock-exercise-database.ts'
import { getGeneratedSegmentName } from './workout-domain.ts'

/**
 * Girl / Hero-style benchmark workouts for “Load sample”.
 *
 * Builder limitations (domain is still segment + assigned exercises):
 * - Fran / Diane / Annie: “Reps per round” encodes the prescribed ladder for all sets/reps
 *   movements in that segment. Classic execution alternates movements within each tier;
 *   the builder treats them as sharing the same per-round rep sequence.
 * - Helen: one For Time segment with rounds = 3; run / swing / pull-up reps differ (no single
 *   shared rep ladder)—static reps + metric run per assignment.
 * - Murph: chipper order (run → pull/push/squat → run). Partitioning “Cindy” style in the middle
 *   is not modeled—totals match the benchmark prescription.
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

function forTimeSegment(
  id: string,
  exercises: AssignedExercise[],
  timeCapSeconds: number,
  rounds: number,
  opts?: Pick<Segment, 'repGenerationEnabled' | 'repScheme' | 'repSequence'>,
): Segment {
  const seg: Segment = {
    id,
    name: 'For Time',
    exercises,
    segmentType: 'forTime',
    timeCapSeconds,
    rounds,
    ...opts,
  }
  return { ...seg, name: getGeneratedSegmentName(seg) }
}

function amrapSegment(
  id: string,
  durationSeconds: number,
  exercises: AssignedExercise[],
): Segment {
  const seg: Segment = {
    id,
    name: 'AMRAP',
    exercises,
    segmentType: 'amrap',
    durationSeconds,
  }
  return { ...seg, name: getGeneratedSegmentName(seg) }
}

function chipperSegment(
  id: string,
  timeCapSeconds: number,
  exercises: AssignedExercise[],
): Segment {
  const seg: Segment = {
    id,
    name: 'Chipper',
    exercises,
    segmentType: 'chipper',
    timeCapSeconds,
  }
  return { ...seg, name: getGeneratedSegmentName(seg) }
}

/** 21-15-9 Thrusters + Pull-ups */
export const mockWorkoutFran: Workout = {
  id: 'workout-fran',
  name: 'Fran',
  segments: [
    forTimeSegment(
      'segment-fran',
      [
        assigned('ae-fran-1', 'exercise-thrusters', { repetitions: 21 }),
        assigned('ae-fran-2', 'exercise-pull-ups', { repetitions: 21 }),
      ],
      30 * 60,
      3,
      {
        repGenerationEnabled: true,
        repScheme: { pattern: 'linear', rounds: 3, start: 21, end: 9 },
        repSequence: [21, 15, 9],
      },
    ),
  ],
}

/** AMRAP 20: 5-10-15 Cindy */
export const mockWorkoutCindy: Workout = {
  id: 'workout-cindy',
  name: 'Cindy',
  segments: [
    amrapSegment('segment-cindy', 20 * 60, [
      assigned('ae-cindy-1', 'exercise-pull-ups', { repetitions: 5 }),
      assigned('ae-cindy-2', 'exercise-push-ups', { repetitions: 10 }),
      assigned('ae-cindy-3', 'exercise-air-squats', { repetitions: 15 }),
    ]),
  ],
}

/** 3 rounds: 400 m run, 21 KB swings, 12 pull-ups */
export const mockWorkoutHelen: Workout = {
  id: 'workout-helen',
  name: 'Helen',
  segments: [
    forTimeSegment('segment-helen', [
      assigned('ae-helen-1', 'exercise-run', {
        metricTarget: { type: 'distance', value: 400 },
      }),
      assigned('ae-helen-2', 'exercise-kettlebell-swing', { repetitions: 21 }),
      assigned('ae-helen-3', 'exercise-pull-ups', { repetitions: 12 }),
    ], 30 * 60, 3),
  ],
}

/** 30 Clean & Jerks for time */
export const mockWorkoutGrace: Workout = {
  id: 'workout-grace',
  name: 'Grace',
  segments: [
    forTimeSegment(
      'segment-grace',
      [assigned('ae-grace-1', 'exercise-clean-jerk', { repetitions: 30 })],
      30 * 60,
      1,
    ),
  ],
}

/** 21-15-9 Deadlifts + Handstand push-ups */
export const mockWorkoutDiane: Workout = {
  id: 'workout-diane',
  name: 'Diane',
  segments: [
    forTimeSegment(
      'segment-diane',
      [
        assigned('ae-diane-1', 'exercise-deadlift', { repetitions: 21 }),
        assigned('ae-diane-2', 'exercise-handstand-push-ups', { repetitions: 21 }),
      ],
      30 * 60,
      3,
      {
        repGenerationEnabled: true,
        repScheme: { pattern: 'linear', rounds: 3, start: 21, end: 9 },
        repSequence: [21, 15, 9],
      },
    ),
  ],
}

/** 50-40-30-20-10 Double-unders + Sit-ups */
export const mockWorkoutAnnie: Workout = {
  id: 'workout-annie',
  name: 'Annie',
  segments: [
    forTimeSegment(
      'segment-annie',
      [
        assigned('ae-annie-1', 'exercise-double-unders', { repetitions: 50 }),
        assigned('ae-annie-2', 'exercise-sit-ups', { repetitions: 50 }),
      ],
      30 * 60,
      5,
      {
        repGenerationEnabled: true,
        repScheme: { pattern: 'linear', rounds: 5, start: 50, end: 10 },
        repSequence: [50, 40, 30, 20, 10],
      },
    ),
  ],
}

/** 150 Wall Balls for time */
export const mockWorkoutKaren: Workout = {
  id: 'workout-karen',
  name: 'Karen',
  segments: [
    forTimeSegment(
      'segment-karen',
      [assigned('ae-karen-1', 'exercise-wall-ball', { repetitions: 150 })],
      45 * 60,
      1,
    ),
  ],
}

/** 1 mile run – 100/200/300 – 1 mile run (chipper) */
export const mockWorkoutMurph: Workout = {
  id: 'workout-murph',
  name: 'Murph',
  segments: [
    chipperSegment(
      'segment-murph',
      90 * 60,
      [
        assigned('ae-murph-1', 'exercise-run', {
          metricTarget: { type: 'distance', value: 1609 },
        }),
        assigned('ae-murph-2', 'exercise-pull-ups', { repetitions: 100 }),
        assigned('ae-murph-3', 'exercise-push-ups', { repetitions: 200 }),
        assigned('ae-murph-4', 'exercise-squat', { repetitions: 300 }),
        assigned('ae-murph-5', 'exercise-run', {
          metricTarget: { type: 'distance', value: 1609 },
        }),
      ],
    ),
  ],
}

/** Ordered list for Load sample dropdown and consumers. */
export const mockWorkouts: Workout[] = [
  mockWorkoutFran,
  mockWorkoutCindy,
  mockWorkoutHelen,
  mockWorkoutGrace,
  mockWorkoutDiane,
  mockWorkoutAnnie,
  mockWorkoutKaren,
  mockWorkoutMurph,
]
