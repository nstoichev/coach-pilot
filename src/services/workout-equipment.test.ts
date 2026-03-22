import { describe, expect, it } from 'vitest'
import type { Exercise } from '../types/exercise.ts'
import type { Segment } from '../types/segment.ts'
import type { Workout } from '../types/workout.ts'
import { getWorkoutRequiredEquipment } from './workout-equipment.ts'

const baseExercise: Pick<Exercise, 'id' | 'name' | 'type' | 'prescription'> = {
  id: 'e1',
  name: 'Lift',
  type: ['strength'],
  prescription: 'sets-reps',
}

function workoutWithSegments(segments: Segment[]): Workout {
  return { id: 'w1', name: 'W', segments }
}

function segmentWithExercises(
  id: string,
  exercises: { id: string; exercise: Exercise }[],
): Segment {
  return {
    id,
    name: 'S',
    segmentType: 'custom',
    exercises: exercises.map((e) => ({
      id: e.id,
      exerciseId: e.exercise.id,
      exercise: e.exercise,
    })),
  }
}

describe('getWorkoutRequiredEquipment', () => {
  it('returns empty array when no equipment', () => {
    const w = workoutWithSegments([
      segmentWithExercises('s1', [
        { id: 'a1', exercise: { ...baseExercise, id: 'e1' } },
      ]),
    ])
    expect(getWorkoutRequiredEquipment(w)).toEqual([])
  })

  it('trims and drops blank entries', () => {
    const w = workoutWithSegments([
      segmentWithExercises('s1', [
        {
          id: 'a1',
          exercise: {
            ...baseExercise,
            id: 'e1',
            equipment: ['  barbell  ', '', '  ', 'rack'],
          },
        },
      ]),
    ])
    expect(getWorkoutRequiredEquipment(w)).toEqual(['barbell', 'rack'])
  })

  it('dedupes case-insensitively keeping first-seen casing', () => {
    const w = workoutWithSegments([
      segmentWithExercises('s1', [
        {
          id: 'a1',
          exercise: {
            ...baseExercise,
            id: 'e1',
            equipment: ['Barbell', 'barbell', 'RACK', 'rack'],
          },
        },
      ]),
    ])
    expect(getWorkoutRequiredEquipment(w)).toEqual(['Barbell', 'RACK'])
  })

  it('merges across segments and sorts case-insensitively', () => {
    const w = workoutWithSegments([
      segmentWithExercises('s1', [
        {
          id: 'a1',
          exercise: {
            ...baseExercise,
            id: 'e1',
            name: 'A',
            equipment: ['zebra'],
          },
        },
      ]),
      segmentWithExercises('s2', [
        {
          id: 'a2',
          exercise: {
            ...baseExercise,
            id: 'e2',
            name: 'B',
            equipment: ['apple', 'zebra'],
          },
        },
      ]),
    ])
    expect(getWorkoutRequiredEquipment(w)).toEqual(['apple', 'zebra'])
  })
})
