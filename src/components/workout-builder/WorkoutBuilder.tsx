import { useMemo, useState } from 'react'
import { useWorkoutBuilder } from '../../store/index.ts'
import { getTimerStructure } from '../../services/timer-generator.ts'
import { SegmentList } from './SegmentList.tsx'
import { SegmentTypeModal } from './SegmentTypeModal.tsx'
import { WorkoutDetailsForm } from './WorkoutDetailsForm.tsx'

export const WorkoutBuilder = () => {
  const { state, actions } = useWorkoutBuilder()
  const [isSegmentTypeModalOpen, setIsSegmentTypeModalOpen] = useState(false)

  const workoutErrors = useMemo(
    () =>
      state.validationErrors.filter(
        (error) =>
          error.field === 'name' ||
          error.field.startsWith('segments.'),
      ),
    [state.validationErrors],
  )

  const timerStructure = useMemo(
    () => getTimerStructure(state.workoutDraft),
    [state.workoutDraft],
  )

  return (
    <main className="builder-shell">
      <WorkoutDetailsForm
        workoutName={state.workoutDraft.name}
        segmentCount={state.workoutDraft.segments.length}
        onWorkoutNameChange={actions.setWorkoutName}
        onAddSegment={() => setIsSegmentTypeModalOpen(true)}
      />

      <SegmentTypeModal
        isOpen={isSegmentTypeModalOpen}
        onClose={() => setIsSegmentTypeModalOpen(false)}
        onSelectSegmentType={(segmentType) => {
          actions.addSegmentByType(segmentType)
          setIsSegmentTypeModalOpen(false)
        }}
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

      <div className="builder-done-row">
        <button
          type="button"
          className="primary-button builder-done-button"
          disabled={workoutErrors.length > 0}
          onClick={() => actions.showWorkoutBoard(JSON.parse(JSON.stringify(state.workoutDraft)))}
        >
          Done
        </button>
      </div>

      <section className="panel future-features-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Future features</p>
            <h2>Extension points</h2>
          </div>
        </div>
        <p className="muted-text">
          The workout domain is ready for Timer Generator, Fatigue System, and workout
          auto-generation. Placeholder contracts consume this draft; timer structure
          reports {timerStructure.segments.length} segment{timerStructure.segments.length === 1 ? '' : 's'}.
        </p>
      </section>
    </main>
  )
}
