import { useMemo } from 'react'
import { getExerciseDeleteGuardMessage } from '../../services/index.ts'
import { useWorkoutBuilder } from '../../store/index.ts'
import type { Exercise } from '../../types/exercise.ts'
import * as tw from '../../ui/tw.ts'
import { ExerciseForm } from './ExerciseForm.tsx'
import { ExerciseListItem } from './ExerciseListItem.tsx'

const createDraftExercise = (): Exercise => ({
  id: `exercise-${crypto.randomUUID()}`,
  name: '',
  type: [],
  prescription: {
    mode: 'sets-reps',
  },
  equipment: [],
  muscles: {
    primary: [],
    stabilizing: [],
  },
})

export const ExerciseDatabase = () => {
  const { state, actions } = useWorkoutBuilder()
  const selectedExercise = useMemo(
    () => state.exercises.find((exercise) => exercise.id === state.selectedExerciseId),
    [state.exercises, state.selectedExerciseId],
  )

  const exerciseErrors = useMemo(
    () => state.validationErrors.filter((error) => error.field.startsWith('exercises.')),
    [state.validationErrors],
  )

  const submitLabel = selectedExercise ? 'Save Exercise' : 'Add Exercise'

  const saveExercise = (draft: Exercise) => {
    if (selectedExercise) {
      actions.updateExercise(draft)
      return
    }

    actions.addExercise(draft)
    actions.selectExercise(undefined)
  }

  return (
    <section className={tw.exerciseDatabaseGrid}>
      <ExerciseForm
        key={selectedExercise?.id ?? 'new-exercise'}
        initialDraft={selectedExercise ?? createDraftExercise()}
        onSubmit={saveExercise}
        onCancel={() => actions.selectExercise(undefined)}
        submitLabel={submitLabel}
      />

      <section className={tw.panel}>
        <div className={tw.panelHeader}>
          <div>
            <p className={tw.eyebrow}>Exercise Database</p>
            <h2 className={tw.panelTitle}>Mock database records</h2>
          </div>
          <button
            type="button"
            className={tw.secondaryButton}
            onClick={() => actions.selectExercise(undefined)}
          >
            New Exercise
          </button>
        </div>

        <p className={tw.mutedText}>
          This is an in-memory mock database for now. Use it to create and edit exercise records
          before a real backend is added.
        </p>

        {state.deleteGuardMessage ? (
          <p className={tw.warningText}>{state.deleteGuardMessage}</p>
        ) : null}

        <div className={tw.segmentList}>
          {state.exercises.map((exercise) => {
            const deleteMessage = getExerciseDeleteGuardMessage(state.workoutDraft, exercise.id)

            return (
              <ExerciseListItem
                key={exercise.id}
                exercise={exercise}
                isSelected={state.selectedExerciseId === exercise.id}
                deleteMessage={deleteMessage}
                onEdit={() => actions.selectExercise(exercise.id)}
                onDelete={() => actions.removeExercise(exercise.id)}
              />
            )
          })}
        </div>

        {exerciseErrors.length > 0 ? (
          <ul className={tw.validationList}>
            {exerciseErrors.map((error) => (
              <li
                key={`${error.field}-${error.message}`}
                className={tw.validationListItem}
              >
                <strong>{error.field}</strong>: {error.message}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </section>
  )
}
