import { createContext, useContext, type Dispatch } from 'react'
import { mockExerciseDatabase } from '../services/mock-exercise-database.ts'
import {
  assignExerciseToSegment,
  getGeneratedSegmentName,
  removeExerciseFromSegment,
  reorderSegmentExercises,
  reorderSegments,
  replaceSegment,
  updateAssignedExercise,
} from '../services/workout-domain.ts'
import {
  findExerciseValidationErrors,
  getExerciseDeleteGuardMessage,
  validateWorkout,
} from '../services/workout-validation.ts'
import type { ValidationError } from '../types/domain.ts'
import type { Exercise } from '../types/exercise.ts'
import type { AssignedExercise, Segment } from '../types/segment.ts'
import type { Workout } from '../types/workout.ts'
import type { SegmentType } from '../types/domain.ts'

export type WorkoutBuilderState = {
  exercises: Exercise[]
  workoutDraft: Workout
  validationErrors: ValidationError[]
  deleteGuardMessage?: string
  selectedSegmentId?: string
  selectedExerciseId?: string
  /** When true, show Workout Board instead of builder (set when user clicks Done). */
  showWorkoutBoard: boolean
  /** Snapshot of workout when Done was clicked; used by Workout Board. */
  workoutBoardSnapshot: Workout | null
}

export type WorkoutBuilderAction =
  | { type: 'set_workout_name'; payload: string }
  | { type: 'add_segment'; payload?: Segment }
  | { type: 'update_segment'; payload: Segment }
  | { type: 'remove_segment'; payload: string }
  | { type: 'reorder_segments'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'add_exercise'; payload: Exercise }
  | { type: 'update_exercise'; payload: Exercise }
  | { type: 'remove_exercise'; payload: string }
  | {
      type: 'assign_exercise_to_segment'
      payload: { segmentId: string; exerciseId: string }
    }
  | {
      type: 'remove_exercise_from_segment'
      payload: { segmentId: string; exerciseIndex: number }
    }
  | {
      type: 'update_assigned_exercise'
      payload: { segmentId: string; assignedExercise: AssignedExercise }
    }
  | {
      type: 'reorder_segment_exercises'
      payload: { segmentId: string; fromIndex: number; toIndex: number }
    }
  | { type: 'select_segment'; payload?: string }
  | { type: 'select_exercise'; payload?: string }
  | { type: 'show_workout_board'; payload: Workout }
  | { type: 'hide_workout_board' }
  | { type: 'load_workout'; payload: Workout }

export type WorkoutBuilderContextValue = {
  state: WorkoutBuilderState
  dispatch: Dispatch<WorkoutBuilderAction>
}

const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`

export const createEmptySegment = (): Segment => ({
  id: createId('segment'),
  name: 'Custom',
  exercises: [],
  segmentType: 'custom',
})

export const createSegmentTemplate = (segmentType: SegmentType): Segment => {
  const baseSegment = {
    id: createId('segment'),
    exercises: [],
    segmentType,
  }

  switch (segmentType) {
    case 'emom': {
      const seg = {
        ...baseSegment,
        name: 'EMOM',
        intervalSeconds: 60,
        rounds: 10,
      }
      return { ...seg, name: getGeneratedSegmentName(seg) }
    }
    case 'amrap': {
      const seg = {
        ...baseSegment,
        name: 'AMRAP',
        durationSeconds: 600,
      }
      return { ...seg, name: getGeneratedSegmentName(seg) }
    }
    case 'forTime': {
      const seg = {
        ...baseSegment,
        name: 'For Time',
        timeCapSeconds: 900,
        rounds: 1,
      }
      return { ...seg, name: getGeneratedSegmentName(seg) }
    }
    case 'deathBy': {
      const seg = {
        ...baseSegment,
        name: 'Death by',
      }
      return { ...seg, name: getGeneratedSegmentName(seg) }
    }
    case 'custom':
    default:
      return {
        ...baseSegment,
        name: 'Custom',
      }
  }
}

export const createEmptyWorkout = (): Workout => ({
  id: createId('workout'),
  name: 'New Workout',
  segments: [],
})

export const initialWorkoutBuilderState: WorkoutBuilderState = {
  exercises: mockExerciseDatabase,
  workoutDraft: createEmptyWorkout(),
  validationErrors: [],
  showWorkoutBoard: false,
  workoutBoardSnapshot: null,
}

export const withValidation = (state: WorkoutBuilderState): WorkoutBuilderState => {
  const exerciseErrors = findExerciseValidationErrors(state.exercises)
  const workoutResult = validateWorkout(state.workoutDraft, state.exercises)

  return {
    ...state,
    deleteGuardMessage: undefined,
    validationErrors: [...exerciseErrors, ...workoutResult.errors],
  }
}

export const workoutBuilderReducer = (
  state: WorkoutBuilderState,
  action: WorkoutBuilderAction,
): WorkoutBuilderState => {
  switch (action.type) {
    case 'set_workout_name':
      return withValidation({
        ...state,
        workoutDraft: {
          ...state.workoutDraft,
          name: action.payload,
        },
      })

    case 'add_segment':
      return withValidation({
        ...state,
        workoutDraft: {
          ...state.workoutDraft,
          segments: [...state.workoutDraft.segments, action.payload ?? createEmptySegment()],
        },
      })

    case 'update_segment':
      return withValidation({
        ...state,
        workoutDraft: replaceSegment(state.workoutDraft, action.payload),
      })

    case 'remove_segment':
      return withValidation({
        ...state,
        selectedSegmentId:
          state.selectedSegmentId === action.payload ? undefined : state.selectedSegmentId,
        workoutDraft: {
          ...state.workoutDraft,
          segments: state.workoutDraft.segments.filter((segment) => segment.id !== action.payload),
        },
      })

    case 'reorder_segments':
      return withValidation({
        ...state,
        workoutDraft: reorderSegments(
          state.workoutDraft,
          action.payload.fromIndex,
          action.payload.toIndex,
        ),
      })

    case 'add_exercise':
      return withValidation({
        ...state,
        exercises: [...state.exercises, action.payload],
      })

    case 'update_exercise':
      return withValidation({
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id === action.payload.id ? action.payload : exercise,
        ),
        workoutDraft: {
          ...state.workoutDraft,
          segments: state.workoutDraft.segments.map((segment) => ({
            ...segment,
            exercises: segment.exercises.map((assignedExercise) =>
              assignedExercise.exerciseId === action.payload.id
                ? {
                    ...assignedExercise,
                    exercise: action.payload,
                  }
                : assignedExercise,
            ),
          })),
        },
      })

    case 'remove_exercise':
      if (getExerciseDeleteGuardMessage(state.workoutDraft, action.payload)) {
        return {
          ...state,
          deleteGuardMessage: getExerciseDeleteGuardMessage(state.workoutDraft, action.payload) ?? undefined,
        }
      }

      return withValidation({
        ...state,
        deleteGuardMessage: undefined,
        selectedExerciseId:
          state.selectedExerciseId === action.payload ? undefined : state.selectedExerciseId,
        exercises: state.exercises.filter((exercise) => exercise.id !== action.payload),
      })

    case 'assign_exercise_to_segment': {
      const updatedSegment = state.workoutDraft.segments.find(
        (segment) => segment.id === action.payload.segmentId,
      )

      if (!updatedSegment) {
        return state
      }

      return withValidation({
        ...state,
        workoutDraft: replaceSegment(
          state.workoutDraft,
          assignExerciseToSegment(updatedSegment, action.payload.exerciseId, state.exercises),
        ),
      })
    }

    case 'remove_exercise_from_segment': {
      const updatedSegment = state.workoutDraft.segments.find(
        (segment) => segment.id === action.payload.segmentId,
      )

      if (!updatedSegment) {
        return state
      }

      return withValidation({
        ...state,
        workoutDraft: replaceSegment(
          state.workoutDraft,
          removeExerciseFromSegment(updatedSegment, action.payload.exerciseIndex),
        ),
      })
    }

    case 'update_assigned_exercise': {
      const updatedSegment = state.workoutDraft.segments.find(
        (segment) => segment.id === action.payload.segmentId,
      )

      if (!updatedSegment) {
        return state
      }

      return withValidation({
        ...state,
        workoutDraft: replaceSegment(
          state.workoutDraft,
          updateAssignedExercise(updatedSegment, action.payload.assignedExercise),
        ),
      })
    }

    case 'reorder_segment_exercises': {
      const updatedSegment = state.workoutDraft.segments.find(
        (segment) => segment.id === action.payload.segmentId,
      )

      if (!updatedSegment) {
        return state
      }

      return withValidation({
        ...state,
        workoutDraft: replaceSegment(
          state.workoutDraft,
          reorderSegmentExercises(
            updatedSegment,
            action.payload.fromIndex,
            action.payload.toIndex,
          ),
        ),
      })
    }

    case 'select_segment':
      return {
        ...state,
        deleteGuardMessage: undefined,
        selectedSegmentId: action.payload,
      }

    case 'select_exercise':
      return {
        ...state,
        deleteGuardMessage: undefined,
        selectedExerciseId: action.payload,
      }

    case 'show_workout_board':
      return {
        ...state,
        showWorkoutBoard: true,
        workoutBoardSnapshot: action.payload,
      }

    case 'hide_workout_board':
      return {
        ...state,
        showWorkoutBoard: false,
        workoutBoardSnapshot: null,
      }

    case 'load_workout': {
      const w = action.payload
      const draft: Workout = {
        ...w,
        id: createId('workout'),
        segments: w.segments.map((seg) => ({
          ...seg,
          id: createId('segment'),
          exercises: seg.exercises.map((ae) => {
            const ex = state.exercises.find((e) => e.id === ae.exerciseId)
            return {
              ...ae,
              id: createId('assigned-exercise'),
              exercise: ex ?? ae.exercise,
            }
          }),
        })),
      }
      return withValidation({
        ...state,
        workoutDraft: draft,
        selectedSegmentId: draft.segments[0]?.id,
      })
    }

    default:
      return state
  }
}

export const WorkoutBuilderContext = createContext<WorkoutBuilderContextValue | null>(null)

export const useWorkoutBuilderContext = () => {
  const context = useContext(WorkoutBuilderContext)

  if (!context) {
    throw new Error('useWorkoutBuilderContext must be used within WorkoutBuilderProvider.')
  }

  return context
}

export const useWorkoutBuilder = () => {
  const { state, dispatch } = useWorkoutBuilderContext()

  return {
    state,
    actions: {
      setWorkoutName: (name: string) =>
        dispatch({ type: 'set_workout_name', payload: name }),
      addSegment: () => {
        const segment = createSegmentTemplate('custom')
        dispatch({ type: 'add_segment', payload: segment })
        dispatch({ type: 'select_segment', payload: segment.id })
      },
      addSegmentByType: (segmentType: SegmentType) => {
        const segment = createSegmentTemplate(segmentType)
        dispatch({ type: 'add_segment', payload: segment })
        dispatch({ type: 'select_segment', payload: segment.id })
      },
      updateSegment: (segment: Segment) =>
        dispatch({ type: 'update_segment', payload: segment }),
      removeSegment: (segmentId: string) =>
        dispatch({ type: 'remove_segment', payload: segmentId }),
      reorderSegments: (fromIndex: number, toIndex: number) =>
        dispatch({
          type: 'reorder_segments',
          payload: { fromIndex, toIndex },
        }),
      assignExerciseToSegment: (segmentId: string, exerciseId: string) =>
        dispatch({
          type: 'assign_exercise_to_segment',
          payload: { segmentId, exerciseId },
        }),
      removeExerciseFromSegment: (segmentId: string, exerciseIndex: number) =>
        dispatch({
          type: 'remove_exercise_from_segment',
          payload: { segmentId, exerciseIndex },
        }),
      updateAssignedExercise: (
        segmentId: string,
        assignedExercise: AssignedExercise,
      ) =>
        dispatch({
          type: 'update_assigned_exercise',
          payload: { segmentId, assignedExercise },
        }),
      reorderSegmentExercises: (
        segmentId: string,
        fromIndex: number,
        toIndex: number,
      ) =>
        dispatch({
          type: 'reorder_segment_exercises',
          payload: { segmentId, fromIndex, toIndex },
        }),
      selectSegment: (segmentId?: string) =>
        dispatch({ type: 'select_segment', payload: segmentId }),
      selectExercise: (exerciseId?: string) =>
        dispatch({ type: 'select_exercise', payload: exerciseId }),
      showWorkoutBoard: (workout: Workout) =>
        dispatch({ type: 'show_workout_board', payload: workout }),
      hideWorkoutBoard: () =>
        dispatch({ type: 'hide_workout_board' }),
      loadWorkout: (workout: Workout) =>
        dispatch({ type: 'load_workout', payload: workout }),
      addExercise: (exercise: Exercise) =>
        dispatch({ type: 'add_exercise', payload: exercise }),
      updateExercise: (exercise: Exercise) =>
        dispatch({ type: 'update_exercise', payload: exercise }),
      removeExercise: (exerciseId: string) =>
        dispatch({ type: 'remove_exercise', payload: exerciseId }),
    },
  }
}
