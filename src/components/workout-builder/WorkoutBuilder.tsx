import { useMemo } from 'react'
import { useWorkoutBuilder } from '../../store/index.ts'
import { SegmentList } from './SegmentList.tsx'
import { WorkoutDetailsForm } from './WorkoutDetailsForm.tsx'

export const WorkoutBuilder = () => {
  const { state, actions } = useWorkoutBuilder()

  const workoutErrors = useMemo(
    () =>
      state.validationErrors.filter(
        (error) =>
          error.field === 'name' ||
          error.field === 'restBetweenSegments' ||
          error.field.startsWith('segments.'),
      ),
    [state.validationErrors],
  )

  return (
    <main className="builder-shell">
      <section className="hero-card">
        <p className="eyebrow">Coach Pilot</p>
        <h1>Workout Builder MVP</h1>
        <p>
          Build workouts from reusable exercises, organize them into segments, and validate the
          structure before moving on to the Exercise Database phase.
        </p>
      </section>

      <WorkoutDetailsForm
        workoutName={state.workoutDraft.name}
        restBetweenSegments={state.workoutDraft.restBetweenSegments}
        segmentCount={state.workoutDraft.segments.length}
        onWorkoutNameChange={actions.setWorkoutName}
        onRestBetweenSegmentsChange={actions.setRestBetweenSegments}
        onAddSegment={actions.addSegment}
      />

      <SegmentList
        segments={state.workoutDraft.segments}
        availableExercises={state.exercises}
        selectedSegmentId={state.selectedSegmentId}
        onSelectSegment={actions.selectSegment}
        onUpdateSegment={actions.updateSegment}
        onRemoveSegment={actions.removeSegment}
        onReorderSegments={actions.reorderSegments}
        onAssignExercise={actions.assignExerciseToSegment}
        onRemoveExercise={actions.removeExerciseFromSegment}
        onUpdateAssignedExercise={actions.updateAssignedExercise}
        onReorderExercises={actions.reorderSegmentExercises}
      />

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Validation</p>
            <h2>Current builder status</h2>
          </div>
        </div>

        {workoutErrors.length === 0 ? (
          <p className="success-text">Workout draft is structurally valid.</p>
        ) : (
          <ul className="validation-list">
            {workoutErrors.map((error) => (
              <li key={`${error.field}-${error.message}`}>
                <strong>{error.field}</strong>: {error.message}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
