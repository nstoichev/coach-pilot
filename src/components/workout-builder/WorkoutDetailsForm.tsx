import { cn } from '../../ui/cn.ts'
import * as tw from '../../ui/tw.ts'
import { ScheduleDatePicker } from './ScheduleDatePicker.tsx'

type WorkoutDetailsFormProps = {
  workoutName: string
  scheduledDate: string
  scheduledDateMin: string
  onScheduledDateChange: (date: string) => void
  onWorkoutNameChange: (name: string) => void
  onAddSegment: () => void
  /** Opens the same-style modal as Add segment / Add exercise. */
  onOpenLoadWorkout?: () => void
}

export const WorkoutDetailsForm = ({
  workoutName,
  scheduledDate,
  scheduledDateMin,
  onScheduledDateChange,
  onWorkoutNameChange,
  onAddSegment,
  onOpenLoadWorkout,
}: WorkoutDetailsFormProps) => (
  <section className={tw.panel}>
    <div className={tw.panelHeader}>
      <div>
        <h2 className={tw.panelTitle}>Build your workout</h2>
      </div>
    </div>

    <div className={cn(tw.formGrid, tw.formGridWorkoutDetails)}>
      <label className={tw.field}>
        <span className={tw.fieldSpanLabel}>Date</span>
        <ScheduleDatePicker
          value={scheduledDate}
          min={scheduledDateMin}
          onChange={onScheduledDateChange}
          ariaLabel="Date (today or future)"
        />
      </label>
      <label className={tw.field}>
        <span className={tw.fieldSpanLabel}>Name</span>
        <input
          className={tw.fieldInput}
          value={workoutName}
          onChange={(event) => onWorkoutNameChange(event.target.value)}
          placeholder="Lower Body Strength"
        />
      </label>
    </div>

    <div className={tw.panelAddSegmentRow}>
      <button
        className={tw.panelAddSegmentButton}
        onClick={onAddSegment}
        type="button"
      >
        Add Segment
      </button>
      {onOpenLoadWorkout ? (
        <button
          type="button"
          className={tw.panelLoadWorkoutButton}
          onClick={onOpenLoadWorkout}
        >
          Load template
        </button>
      ) : null}
    </div>
  </section>
)
