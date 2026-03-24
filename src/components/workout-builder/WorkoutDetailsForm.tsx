import { cn } from '../../ui/cn.ts'
import * as tw from '../../ui/tw.ts'
import { ScheduleDatePicker } from './ScheduleDatePicker.tsx'

type WorkoutDetailsFormProps = {
  workoutName: string
  scheduledDate: string
  scheduledDateMin: string
  onScheduledDateChange: (date: string) => void
  onWorkoutNameChange: (name: string) => void
  /** Opens the same-style modal as Add segment / Add exercise. */
  onOpenLoadWorkout?: () => void
}

export const WorkoutDetailsForm = ({
  workoutName,
  scheduledDate,
  scheduledDateMin,
  onScheduledDateChange,
  onWorkoutNameChange,
  onOpenLoadWorkout,
}: WorkoutDetailsFormProps) => (
  <section className={tw.panel}>
    <div className={tw.panelHeader}>
      <div>
        <h2 className={tw.panelTitle}>Build your workout</h2>
      </div>
      {onOpenLoadWorkout ? (
        <button
          type="button"
          className={tw.secondaryButton}
          onClick={onOpenLoadWorkout}
        >
          Load template
        </button>
      ) : null}
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
  </section>
)
