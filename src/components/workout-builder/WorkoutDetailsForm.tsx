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
  <section className="panel">
    <div className="panel-header">
      <div>
        <h2>Build your workout</h2>
      </div>
    </div>

    <div className="form-grid form-grid--workout-details">
      <label className="field">
        <span>Date</span>
        <ScheduleDatePicker
          value={scheduledDate}
          min={scheduledDateMin}
          onChange={onScheduledDateChange}
          ariaLabel="Date (today or future)"
        />
      </label>
      <label className="field">
        <span>Name</span>
        <input
          value={workoutName}
          onChange={(event) => onWorkoutNameChange(event.target.value)}
          placeholder="Lower Body Strength"
        />
      </label>
    </div>

    <div className="panel-add-segment-row">
      <button className="primary-button panel-add-segment-button" onClick={onAddSegment} type="button">
        Add Segment
      </button>
      {onOpenLoadWorkout ? (
        <button
          type="button"
          className="secondary-button panel-load-workout-button"
          onClick={onOpenLoadWorkout}
        >
          Load template
        </button>
      ) : null}
    </div>
  </section>
)
