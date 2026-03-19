import type { Exercise } from '../types/exercise.ts'

export const mockExerciseDatabase: Exercise[] = [
  {
    id: 'exercise-front-squat',
    name: 'Front Squat',
    type: ['strength', 'crossfit'],
    prescription: {
      mode: 'sets-reps',
    },
    equipment: ['barbell', 'rack'],
    muscles: {
      primary: ['quadriceps', 'glutes'],
      stabilizing: ['core', 'erectors'],
    },
    workingWeight: {
      mode: 'weight',
      value: 70,
    },
  },
  {
    id: 'exercise-burpee-over-bar',
    name: 'Burpee Over Bar',
    type: ['crossfit'],
    prescription: {
      mode: 'sets-reps',
    },
    equipment: ['barbell'],
    muscles: {
      primary: ['chest', 'shoulders'],
      stabilizing: ['core'],
    },
    workingWeight: {
      mode: 'repMax',
      value: 15,
    },
  },
  {
    id: 'exercise-kettlebell-swing',
    name: 'Kettlebell Swing',
    type: ['crossfit', 'strength'],
    prescription: {
      mode: 'sets-reps',
    },
    equipment: ['kettlebell'],
    muscles: {
      primary: ['hamstrings', 'glutes'],
      stabilizing: ['core', 'lats'],
    },
    workingWeight: {
      mode: 'weight',
      value: 24,
    },
  },
  {
    id: 'exercise-row',
    name: 'Row',
    type: ['crossfit'],
    prescription: {
      mode: 'metric',
      metricOptions: ['calories', 'distance', 'time', 'custom'],
      advancedMetrics: ['speed', 'watts'],
    },
    equipment: ['rower'],
    muscles: {
      primary: ['back', 'legs'],
      stabilizing: ['core'],
    },
  },
]
