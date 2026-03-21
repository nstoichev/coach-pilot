import { useMemo, useState } from 'react'
import { useWorkoutBuilder } from '../../store/index.ts'
import { getTodayLocalDateString } from '../../services/schedule-utils.ts'
import { mockWorkouts } from '../../services/mock-workouts.ts'
import { LoadWorkoutModal } from './LoadWorkoutModal.tsx'
import { SegmentList } from './SegmentList.tsx'
import { SegmentTypeModal } from './SegmentTypeModal.tsx'
import { WorkoutDetailsForm } from './WorkoutDetailsForm.tsx'

const SAMPLE_WORKOUTS = mockWorkouts.map((workout) => ({
  label: workout.name,
  workout,
}))

export const WorkoutBuilder = () => {
  const { state, actions } = useWorkoutBuilder()
  const [isSegmentTypeModalOpen, setIsSegmentTypeModalOpen] = useState(false)
  const [isLoadWorkoutModalOpen, setIsLoadWorkoutModalOpen] = useState(false)
  const today = useMemo(() => getTodayLocalDateString(), [])

  const workoutErrors = useMemo(
    () =>
      state.validationErrors.filter(
        (error) =>
          error.field === 'name' ||
          error.field === 'scheduledDate' ||
          error.field.startsWith('segments.'),
      ),
    [state.validationErrors],
  )

  const hasAtLeastOneExerciseInAnySegment = state.workoutDraft.segments.some(
    (seg) => seg.exercises.length > 0,
  )

  return (
    <main className="builder-shell">
      <WorkoutDetailsForm
        workoutName={state.workoutDraft.name}
        scheduledDate={state.workoutDraft.scheduledDate ?? ''}
        scheduledDateMin={today}
        onScheduledDateChange={actions.setScheduledDate}
        onWorkoutNameChange={actions.setWorkoutName}
        onAddSegment={() => setIsSegmentTypeModalOpen(true)}
        onOpenLoadWorkout={
          SAMPLE_WORKOUTS.length > 0 ? () => setIsLoadWorkoutModalOpen(true) : undefined
        }
      />

      <LoadWorkoutModal
        isOpen={isLoadWorkoutModalOpen}
        onClose={() => setIsLoadWorkoutModalOpen(false)}
        samples={SAMPLE_WORKOUTS}
        onSelectWorkout={(workout) => {
          actions.loadWorkout(workout)
          setIsLoadWorkoutModalOpen(false)
        }}
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

      <section className="panel builder-status-panel">
        {workoutErrors.length === 0 ? (
          <p className="success-text builder-status-message">Workout draft is structurally valid.</p>
        ) : (
          <ul className="validation-list builder-status-message">
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
          disabled={workoutErrors.length > 0 || !hasAtLeastOneExerciseInAnySegment}
          onClick={() => actions.showWorkoutBoard(JSON.parse(JSON.stringify(state.workoutDraft)))}
        >
          Done
        </button>
      </div>

    </main>
  )
}
