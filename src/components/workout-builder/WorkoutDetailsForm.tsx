type WorkoutDetailsFormProps = {
  workoutName: string
  restBetweenSegments?: number
  segmentCount: number
  onWorkoutNameChange: (name: string) => void
  onRestBetweenSegmentsChange: (minutes?: number) => void
  onAddSegment: () => void
}

export const WorkoutDetailsForm = ({
  workoutName,
  restBetweenSegments,
  segmentCount,
  onWorkoutNameChange,
  onRestBetweenSegmentsChange,
  onAddSegment,
}: WorkoutDetailsFormProps) => (
  <section className="panel">
    <div className="panel-header">
      <div>
        <p className="eyebrow">Workout Details</p>
        <h2>Build your workout</h2>
      </div>
      <button className="primary-button" onClick={onAddSegment} type="button">
        Add Segment
      </button>
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

      <label className="field">
        <span>Rest Between Segments (minutes)</span>
        <input
          min={0}
          type="number"
          value={restBetweenSegments ?? ''}
          onChange={(event) => {
            const value = event.target.value
            onRestBetweenSegmentsChange(value === '' ? undefined : Number(value))
          }}
          placeholder="Optional"
        />
      </label>
    </div>

    <p className="muted-text">
      {segmentCount === 0
        ? 'Start by adding your first segment.'
        : `${segmentCount} segment${segmentCount === 1 ? '' : 's'} in this workout.`}
    </p>
  </section>
)
