import { useMemo, useReducer, type PropsWithChildren } from 'react'
import {
  initialWorkoutBuilderState,
  withValidation,
  WorkoutBuilderContext,
  workoutBuilderReducer,
} from './workout-builder-store.ts'

export const WorkoutBuilderProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(
    workoutBuilderReducer,
    initialWorkoutBuilderState,
    withValidation,
  )

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  )

  return <WorkoutBuilderContext.Provider value={value}>{children}</WorkoutBuilderContext.Provider>
}
