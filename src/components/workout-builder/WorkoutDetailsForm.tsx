type WorkoutDetailsFormProps = {
  workoutName: string
  segmentCount: number
  onWorkoutNameChange: (name: string) => void
  onAddSegment: () => void
}

export const WorkoutDetailsForm = ({
  workoutName,
  segmentCount,
  onWorkoutNameChange,
  onAddSegment,
}: WorkoutDetailsFormProps) => (
  <section className="panel">
    <div className="panel-header">
      <div>
        <h2>Build your workout</h2>
      </div>
    </div>

    <div className="form-grid">
      <label className="field">
        <span>Workout name</span>
        <input
          value={workoutName}
          onChange={(event) => onWorkoutNameChange(event.target.value)}
          placeholder="Lower Body Strength"
        />
      </label>
    </div>

    <p className="muted-text">
      {segmentCount === 0
        ? 'Start by adding your first segment.'
        : `${segmentCount} segment${segmentCount === 1 ? '' : 's'} in this workout.`}
    </p>

    <div className="panel-add-segment-row">
      <button className="primary-button panel-add-segment-button" onClick={onAddSegment} type="button">
        Add Segment
      </button>
    </div>
  </section>
)
