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
  {
    id: 'exercise-air-squats',
    name: 'Air Squats',
    type: ['crossfit', 'mobility'],
    prescription: { mode: 'sets-reps' },
    equipment: [],
    muscles: {
      primary: ['quadriceps', 'glutes'],
      stabilizing: ['core'],
    },
  },
  {
    id: 'exercise-burpee',
    name: 'Burpee',
    type: ['crossfit'],
    prescription: { mode: 'sets-reps' },
    equipment: [],
    muscles: {
      primary: ['chest', 'legs'],
      stabilizing: ['core', 'shoulders'],
    },
  },
  {
    id: 'exercise-burpee-pull-ups',
    name: 'Burpee Pull-ups',
    type: ['crossfit'],
    prescription: { mode: 'sets-reps' },
    equipment: ['pull-up bar'],
    muscles: {
      primary: ['back', 'chest', 'legs'],
      stabilizing: ['core', 'shoulders'],
    },
  },
  {
    id: 'exercise-clean-jerk',
    name: 'Clean & Jerks',
    type: ['crossfit', 'strength'],
    prescription: { mode: 'sets-reps' },
    equipment: ['barbell'],
    muscles: {
      primary: ['quadriceps', 'shoulders', 'glutes'],
      stabilizing: ['core', 'back'],
    },
    workingWeight: { mode: 'weight', value: 50 },
  },
  {
    id: 'exercise-deadlift',
    name: 'Deadlift',
    type: ['crossfit', 'strength'],
    prescription: { mode: 'sets-reps' },
    equipment: ['barbell'],
    muscles: {
      primary: ['hamstrings', 'glutes', 'back'],
      stabilizing: ['core', 'erectors'],
    },
    workingWeight: { mode: 'weight', value: 100 },
  },
  {
    id: 'exercise-double-unders',
    name: 'Double Unders',
    type: ['crossfit'],
    prescription: { mode: 'sets-reps' },
    equipment: ['jump rope'],
    muscles: {
      primary: ['calves', 'shoulders'],
      stabilizing: ['core'],
    },
  },
  {
    id: 'exercise-handstand-push-ups',
    name: 'Handstand Push-ups',
    type: ['crossfit'],
    prescription: { mode: 'sets-reps' },
    equipment: ['wall'],
    muscles: {
      primary: ['shoulders', 'triceps'],
      stabilizing: ['core'],
    },
  },
  {
    id: 'exercise-hang-power-clean',
    name: 'Hang Power Cleans',
    type: ['crossfit', 'strength'],
    prescription: { mode: 'sets-reps' },
    equipment: ['barbell'],
    muscles: {
      primary: ['glutes', 'hamstrings', 'back'],
      stabilizing: ['core', 'shoulders'],
    },
    workingWeight: { mode: 'weight', value: 50 },
  },
  {
    id: 'exercise-muscle-up',
    name: 'Muscle-ups',
    type: ['crossfit'],
    prescription: { mode: 'sets-reps' },
    equipment: ['rings'],
    muscles: {
      primary: ['lats', 'chest', 'shoulders'],
      stabilizing: ['core', 'triceps'],
    },
  },
  {
    id: 'exercise-pull-ups',
    name: 'Pull-ups',
    type: ['crossfit', 'strength'],
    prescription: { mode: 'sets-reps' },
    equipment: ['pull-up bar'],
    muscles: {
      primary: ['lats', 'biceps'],
      stabilizing: ['core', 'shoulders'],
    },
  },
  {
    id: 'exercise-push-jerk',
    name: 'Push Jerks',
    type: ['crossfit', 'strength'],
    prescription: { mode: 'sets-reps' },
    equipment: ['barbell'],
    muscles: {
      primary: ['shoulders', 'quadriceps', 'glutes'],
      stabilizing: ['core', 'triceps'],
    },
    workingWeight: { mode: 'weight', value: 50 },
  },
  {
    id: 'exercise-push-ups',
    name: 'Push-ups',
    type: ['crossfit', 'strength', 'mobility'],
    prescription: { mode: 'sets-reps' },
    equipment: [],
    muscles: {
      primary: ['chest', 'shoulders', 'triceps'],
      stabilizing: ['core'],
    },
  },
  {
    id: 'exercise-rope-climb',
    name: 'Rope Climb',
    type: ['crossfit'],
    prescription: { mode: 'sets-reps' },
    equipment: ['rope'],
    muscles: {
      primary: ['biceps', 'lats', 'forearms'],
      stabilizing: ['core', 'legs'],
    },
  },
  {
    id: 'exercise-run',
    name: 'Run',
    type: ['crossfit', 'mobility'],
    prescription: {
      mode: 'metric',
      metricOptions: ['calories', 'distance', 'time', 'custom'],
      advancedMetrics: ['speed', 'watts'],
    },
    equipment: ['track'],
    muscles: {
      primary: ['legs'],
      stabilizing: ['core'],
    },
  },
  {
    id: 'exercise-sit-ups',
    name: 'Sit-ups',
    type: ['crossfit', 'mobility'],
    prescription: { mode: 'sets-reps' },
    equipment: [],
    muscles: {
      primary: ['core'],
      stabilizing: ['hip flexors'],
    },
  },
  {
    id: 'exercise-squat',
    name: 'Squats',
    type: ['crossfit', 'strength'],
    prescription: { mode: 'sets-reps' },
    equipment: ['barbell', 'rack'],
    muscles: {
      primary: ['quadriceps', 'glutes'],
      stabilizing: ['core', 'erectors'],
    },
    workingWeight: { mode: 'weight', value: 80 },
  },
  {
    id: 'exercise-thrusters',
    name: 'Thrusters',
    type: ['crossfit', 'strength'],
    prescription: { mode: 'sets-reps' },
    equipment: ['barbell', 'rack'],
    muscles: {
      primary: ['quadriceps', 'shoulders'],
      stabilizing: ['core', 'glutes', 'triceps'],
    },
    workingWeight: { mode: 'weight', value: 40 },
  },
  {
    id: 'exercise-wall-ball',
    name: 'Wall Balls',
    type: ['crossfit'],
    prescription: { mode: 'sets-reps' },
    equipment: ['medicine ball', 'wall'],
    muscles: {
      primary: ['quadriceps', 'shoulders'],
      stabilizing: ['core', 'glutes'],
    },
    workingWeight: { mode: 'weight', value: 9 },
  },
]
