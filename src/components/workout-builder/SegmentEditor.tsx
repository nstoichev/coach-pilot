import { useMemo } from 'react'
import type { ExerciseMetric } from '../../types/domain.ts'
import {
  formatSecondsAsClock,
  getGeneratedSegmentName,
  getSegmentEstimatedDurationSeconds,
} from '../../services/index.ts'
import type { Exercise } from '../../types/exercise.ts'
import type { AssignedExercise, Segment } from '../../types/segment.ts'
import { SegmentExercisePicker } from './SegmentExercisePicker.tsx'

type SegmentEditorProps = {
  segment: Segment
  availableExercises: Exercise[]
  isSelected: boolean
  onNameChange: (segment: Segment) => void
  onSelect: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onAssignExercise: (exerciseId: string) => void
  onRemoveExercise: (exerciseIndex: number) => void
  onUpdateAssignedExercise: (assignedExercise: AssignedExercise) => void
  onMoveExerciseUp: (exerciseIndex: number) => void
  onMoveExerciseDown: (exerciseIndex: number) => void
}

const EMOM_INTERVAL_MIN_SECONDS = 15
const EMOM_INTERVAL_MAX_SECONDS = 600
const EMOM_INTERVAL_STEP_SECONDS = 15

const EMOM_ROUNDS_MIN = 1
const EMOM_ROUNDS_MAX = 50
const EMOM_ROUNDS_DEFAULT = 10

const REST_MIN_MINUTES = 0
const REST_MAX_MINUTES = 10
const REST_STEP_MINUTES = 0.25 // 15 seconds

const AMRAP_DURATION_MIN_SECONDS = 60 // 1 min
const AMRAP_DURATION_MAX_SECONDS = 1800 // 30 min
const AMRAP_DURATION_STEP_SECONDS = 30
const AMRAP_DURATION_DEFAULT_SECONDS = 600 // 10 min

const TIMECAP_MIN_SECONDS = 60 // 1 min
const TIMECAP_MAX_SECONDS = 3600 // 60 min
const TIMECAP_STEP_SECONDS = 30
const TIMECAP_DEFAULT_SECONDS = 900 // 15 min

const restMinutesToSeconds = (minutes: number): number =>
  Math.round(minutes * 60)

// Assigned exercise prescription sliders
const ASSIGNED_SETS_MIN = 0
const ASSIGNED_SETS_MAX = 10
const ASSIGNED_REPS_MIN = 1
const ASSIGNED_REPS_MAX = 50

const METRIC_RANGES: Record<
  ExerciseMetric,
  { min: number; max: number; step: number; unit: string }
> = {
  calories: { min: 0, max: 500, step: 5, unit: 'kcal' },
  distance: { min: 0, max: 10000, step: 100, unit: 'm' },
  speed: { min: 0, max: 50, step: 1, unit: 'km/h' },
  time: { min: 0, max: 3600, step: 15, unit: 's' },
}

function formatMetricValue(metric: ExerciseMetric, value: number): string {
  if (metric === 'time') {
    return formatSecondsAsClock(value)
  }
  return `${value} ${METRIC_RANGES[metric].unit}`
}

export const SegmentEditor = ({
  segment,
  availableExercises,
  isSelected,
  onNameChange,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAssignExercise,
  onRemoveExercise,
  onUpdateAssignedExercise,
  onMoveExerciseUp,
  onMoveExerciseDown,
}: SegmentEditorProps) => {
  const estimatedDuration = useMemo(
    () => getSegmentEstimatedDurationSeconds(segment),
    [segment],
  )

  const handleSegmentChange = (updated: Segment) => {
    const next =
      updated.segmentType === 'custom'
        ? updated
        : { ...updated, name: getGeneratedSegmentName(updated) }
    onNameChange(next)
  }

  const displayName =
    segment.segmentType === 'custom'
      ? segment.name
      : getGeneratedSegmentName(segment)

  return (
    <article
      className={`segment-card${isSelected ? ' segment-card-selected' : ''}`}
      onClick={onSelect}
    >
      <div className="segment-card-header">
        <div className="segment-card-header-left">
          <span className="segment-type-badge">{segment.segmentType}</span>
          {segment.segmentType === 'custom' ? (
            <div className="segment-name-field">
              <input
                aria-label="Segment name"
                value={segment.name}
                onChange={(event) =>
                  onNameChange({
                    ...segment,
                    name: event.target.value,
                  })
                }
                onClick={(event) => event.stopPropagation()}
                placeholder="Segment name"
              />
            </div>
          ) : (
            <span className="segment-generated-name">{displayName}</span>
          )}
        </div>

        <div className="stacked-actions" onClick={(event) => event.stopPropagation()}>
          <button type="button" onClick={onMoveUp}>
            Move Up
          </button>
          <button type="button" onClick={onMoveDown}>
            Move Down
          </button>
          <button type="button" className="danger-button" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>

      <div className="segment-card-body" onClick={(event) => event.stopPropagation()}>
        {segment.segmentType === 'emom' ? (
          <div className="segment-config-stack">
            <label className="field">
              <span>Interval {formatSecondsAsClock(segment.intervalSeconds ?? 60)}</span>
              <input
                className="range-input"
                max={EMOM_INTERVAL_MAX_SECONDS}
                min={EMOM_INTERVAL_MIN_SECONDS}
                step={EMOM_INTERVAL_STEP_SECONDS}
                type="range"
                value={segment.intervalSeconds ?? 60}
                onChange={(event) =>
                  handleSegmentChange({
                    ...segment,
                    intervalSeconds: Number(event.target.value),
                  })
                }
              />
              <small className="field-help">
                {formatSecondsAsClock(EMOM_INTERVAL_MIN_SECONDS)} to{' '}
                {formatSecondsAsClock(EMOM_INTERVAL_MAX_SECONDS)} in 15 second steps
              </small>
            </label>

            <label className="field">
              <span>Sets {segment.rounds ?? EMOM_ROUNDS_DEFAULT}</span>
              <input
                className="range-input"
                max={EMOM_ROUNDS_MAX}
                min={EMOM_ROUNDS_MIN}
                step={1}
                type="range"
                value={segment.rounds ?? EMOM_ROUNDS_DEFAULT}
                onChange={(event) =>
                  handleSegmentChange({
                    ...segment,
                    rounds: Number(event.target.value),
                  })
                }
              />
              <small className="field-help">
                {EMOM_ROUNDS_MIN} to {EMOM_ROUNDS_MAX}, default {EMOM_ROUNDS_DEFAULT}
              </small>
            </label>
          </div>
        ) : null}

        {segment.segmentType === 'amrap' ? (
          <div className="segment-config-stack">
            <label className="field">
              <span>
                Duration {formatSecondsAsClock(segment.durationSeconds ?? AMRAP_DURATION_DEFAULT_SECONDS)}
              </span>
              <input
                className="range-input"
                max={AMRAP_DURATION_MAX_SECONDS}
                min={AMRAP_DURATION_MIN_SECONDS}
                step={AMRAP_DURATION_STEP_SECONDS}
                type="range"
                value={segment.durationSeconds ?? AMRAP_DURATION_DEFAULT_SECONDS}
                onChange={(event) =>
                  handleSegmentChange({
                    ...segment,
                    durationSeconds: Number(event.target.value),
                  })
                }
              />
              <small className="field-help">
                {formatSecondsAsClock(AMRAP_DURATION_MIN_SECONDS)} to{' '}
                {formatSecondsAsClock(AMRAP_DURATION_MAX_SECONDS)} in 30 second steps
              </small>
            </label>
          </div>
        ) : null}

        {segment.segmentType === 'forTime' ? (
          <div className="segment-config-stack">
            <label className="field">
              <span>
                Time cap {formatSecondsAsClock(segment.timeCapSeconds ?? TIMECAP_DEFAULT_SECONDS)}
              </span>
              <input
                className="range-input"
                max={TIMECAP_MAX_SECONDS}
                min={TIMECAP_MIN_SECONDS}
                step={TIMECAP_STEP_SECONDS}
                type="range"
                value={segment.timeCapSeconds ?? TIMECAP_DEFAULT_SECONDS}
                onChange={(event) =>
                  handleSegmentChange({
                    ...segment,
                    timeCapSeconds: Number(event.target.value),
                  })
                }
              />
              <small className="field-help">
                {formatSecondsAsClock(TIMECAP_MIN_SECONDS)} to{' '}
                {formatSecondsAsClock(TIMECAP_MAX_SECONDS)} in 30 second steps
              </small>
            </label>
          </div>
        ) : null}

        <div className="segment-config-grid">
          <label className="field">
            <span>
              Rest after segment {formatSecondsAsClock(restMinutesToSeconds(segment.restInterval ?? 0))}
            </span>
            <input
              className="range-input"
              max={REST_MAX_MINUTES}
              min={REST_MIN_MINUTES}
              step={REST_STEP_MINUTES}
              type="range"
              value={segment.restInterval ?? 0}
              onChange={(event) =>
                handleSegmentChange({
                  ...segment,
                  restInterval: Number(event.target.value),
                })
              }
            />
            <small className="field-help">
              {formatSecondsAsClock(restMinutesToSeconds(REST_MIN_MINUTES))} to{' '}
              {formatSecondsAsClock(restMinutesToSeconds(REST_MAX_MINUTES))} in 15 second steps
            </small>
          </label>
        </div>

        <SegmentExercisePicker
          availableExercises={availableExercises}
          onAssignExercise={onAssignExercise}
        />

        {segment.exercises.length === 0 ? (
          <p className="muted-text">No exercises assigned yet.</p>
        ) : (
          <ul className="exercise-list">
            {segment.exercises.map((assignedExercise, index) => {
              const metricOptions =
                assignedExercise.exercise.prescription.mode === 'metric'
                  ? assignedExercise.exercise.prescription.metricOptions
                  : []
              const isSetsReps =
                assignedExercise.exercise.prescription.mode === 'sets-reps'
              const metricType =
                assignedExercise.metricTarget?.type ?? metricOptions[0] ?? 'distance'
              const metricRange = METRIC_RANGES[metricType]
              const metricValue = assignedExercise.metricTarget?.value ?? metricRange.min
              const isMaxAllowed = metricType === 'calories' || metricType === 'distance'
              const isMax = assignedExercise.metricTarget?.isMax ?? false

              return (
                <li
                  key={`${segment.id}-${assignedExercise.id}-${index}`}
                  className="exercise-list-item exercise-list-item-stacked"
                >
                  <div className="exercise-item-header">
                    <div className="exercise-item-title">
                      <strong>{assignedExercise.exercise.name}</strong>
                      <p>{assignedExercise.exercise.type.join(', ')}</p>
                    </div>
                    <div className="inline-actions">
                      <button type="button" onClick={() => onMoveExerciseUp(index)}>
                        Up
                      </button>
                      <button type="button" onClick={() => onMoveExerciseDown(index)}>
                        Down
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => onRemoveExercise(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="prescription-stack">
                    {isSetsReps ? (
                      <>
                        {!assignedExercise.isMaxRepetitions ? (
                          <label className="field">
                            <span>
                              Sets {assignedExercise.sets ?? 0}
                            </span>
                            <input
                              className="range-input"
                              max={ASSIGNED_SETS_MAX}
                              min={ASSIGNED_SETS_MIN}
                              step={1}
                              type="range"
                              value={assignedExercise.sets ?? 0}
                              onChange={(event) =>
                                onUpdateAssignedExercise({
                                  ...assignedExercise,
                                  sets: Number(event.target.value),
                                  metricTarget: undefined,
                                })
                              }
                            />
                            <small className="field-help">
                              {ASSIGNED_SETS_MIN}–{ASSIGNED_SETS_MAX}
                            </small>
                          </label>
                        ) : null}
                        <label className="field">
                          <div className="field-label-row">
                            <span>
                              Reps{' '}
                              {assignedExercise.isMaxRepetitions
                                ? 'Max'
                                : assignedExercise.repetitions ?? ASSIGNED_REPS_MIN}
                            </span>
                            <label className="max-toggle">
                              <input
                                type="checkbox"
                                checked={assignedExercise.isMaxRepetitions ?? false}
                                onChange={(event) =>
                                  onUpdateAssignedExercise({
                                    ...assignedExercise,
                                    isMaxRepetitions: event.target.checked,
                                  })
                                }
                              />
                              <span className="max-toggle-label">Max</span>
                            </label>
                          </div>

                          {!assignedExercise.isMaxRepetitions ? (
                            <>
                              <input
                                className="range-input"
                                max={ASSIGNED_REPS_MAX}
                                min={ASSIGNED_REPS_MIN}
                                step={1}
                                type="range"
                                value={assignedExercise.repetitions ?? ASSIGNED_REPS_MIN}
                                onChange={(event) =>
                                  onUpdateAssignedExercise({
                                    ...assignedExercise,
                                    repetitions: Number(event.target.value),
                                    metricTarget: undefined,
                                  })
                                }
                              />
                              <small className="field-help">
                                {ASSIGNED_REPS_MIN}–{ASSIGNED_REPS_MAX}
                              </small>
                            </>
                          ) : (
                            <small className="field-help">
                              Max reps until segment time ends
                            </small>
                          )}
                        </label>
                      </>
                    ) : (
                      <>
                        <div className="field">
                          <span>Measure</span>
                          <div className="measure-radio-group" role="radiogroup" aria-label="Metric type">
                            {metricOptions.map((metric) => (
                              <label
                                key={metric}
                                className={`measure-radio-option${metricType === metric ? ' measure-radio-option-selected' : ''}`}
                              >
                                <input
                                  type="radio"
                                  name={`measure-${assignedExercise.id}`}
                                  value={metric}
                                  checked={metricType === metric}
                                  onChange={() =>
                                    onUpdateAssignedExercise({
                                      ...assignedExercise,
                                      sets: undefined,
                                      repetitions: undefined,
                                      metricTarget: {
                                        type: metric,
                                        value: METRIC_RANGES[metric].min,
                                      },
                                    })
                                  }
                                />
                                <span className="measure-radio-label">{metric}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <label className="field">
                          <div className="field-label-row">
                            <span>
                              Value {isMax ? 'Max' : formatMetricValue(metricType, metricValue)}
                            </span>
                            {isMaxAllowed ? (
                              <label className="max-toggle">
                                <input
                                  type="checkbox"
                                  checked={isMax}
                                  onChange={(event) =>
                                    onUpdateAssignedExercise({
                                      ...assignedExercise,
                                      sets: undefined,
                                      repetitions: undefined,
                                      metricTarget: {
                                        type: metricType,
                                        value: isMax
                                          ? metricValue
                                          : metricRange.min,
                                        isMax: event.target.checked,
                                      },
                                    })
                                  }
                                />
                                <span className="max-toggle-label">Max</span>
                              </label>
                            ) : null}
                          </div>

                          {!isMax ? (
                            <>
                              <input
                                className="range-input"
                                max={metricRange.max}
                                min={metricRange.min}
                                step={metricRange.step}
                                type="range"
                                value={metricValue}
                                onChange={(event) =>
                                  onUpdateAssignedExercise({
                                    ...assignedExercise,
                                    sets: undefined,
                                    repetitions: undefined,
                                    metricTarget: {
                                      type: metricType,
                                      value: Number(event.target.value),
                                      isMax: false,
                                    },
                                  })
                                }
                              />
                              <small className="field-help">
                                {formatMetricValue(metricType, metricRange.min)}–{formatMetricValue(metricType, metricRange.max)}
                              </small>
                            </>
                          ) : (
                            <small className="field-help">
                              Max effort until segment time ends
                            </small>
                          )}
                        </label>
                      </>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <div className="segment-footer">
          <span className="muted-text">
            Total time:{' '}
            {estimatedDuration !== undefined ? formatSecondsAsClock(estimatedDuration) : 'Not measurable'}
          </span>
        </div>
      </div>
    </article>
  )
}
