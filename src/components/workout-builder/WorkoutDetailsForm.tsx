import type { Workout } from '../../types/workout.ts'

type WorkoutDetailsFormProps = {
  workoutName: string
  segmentCount: number
  onWorkoutNameChange: (name: string) => void
  onAddSegment: () => void
  /** Optional: list of sample workouts for "Load sample" dropdown (e.g. Death by, EMOM). */
  sampleWorkouts?: Array<{ label: string; workout: Workout }>
  onLoadSample?: (workout: Workout) => void
}

export const WorkoutDetailsForm = ({
  workoutName,
  segmentCount,
  onWorkoutNameChange,
  onAddSegment,
  sampleWorkouts = [],
  onLoadSample,
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
      {sampleWorkouts.length > 0 && onLoadSample && (
        <label className="field">
          <span>Load sample</span>
          <select
            aria-label="Load sample workout"
            value=""
            onChange={(event) => {
              const idx = Number(event.target.value)
              if (!Number.isNaN(idx) && idx >= 0 && sampleWorkouts[idx]) {
                onLoadSample(sampleWorkouts[idx].workout)
              }
            }}
          >
            <option value="">— Choose a sample —</option>
            {sampleWorkouts.map((s, i) => (
              <option key={s.workout.id} value={i}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      )}
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
