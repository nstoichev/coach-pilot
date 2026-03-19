import { useMemo, useState } from 'react'
import type { ExerciseMetric } from '../../types/domain.ts'
import {
  formatSecondsAsClock,
  getGeneratedSegmentName,
  getSegmentEstimatedDurationSeconds,
} from '../../services/index.ts'
import type { Exercise } from '../../types/exercise.ts'
import type { AssignedExercise, Segment } from '../../types/segment.ts'
import { ToggleSwitch } from '../ToggleSwitch.tsx'
import {
  IconArrowDown,
  IconArrowDownSmall,
  IconArrowUp,
  IconArrowUpSmall,
  IconXSmall,
} from '../icons.tsx'
import { SegmentExercisePicker } from './SegmentExercisePicker.tsx'

type SegmentEditorProps = {
  segment: Segment
  availableExercises: Exercise[]
  isSelected: boolean
  isLastSegment?: boolean
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

const FORTIME_ROUNDS_MIN = 1
const FORTIME_ROUNDS_MAX = 30
const FORTIME_ROUNDS_DEFAULT = 1

const TABATA_WORK_MIN = 10
const TABATA_WORK_MAX = 60
const TABATA_REST_MIN = 10
const TABATA_REST_MAX = 60
const TABATA_ROUNDS_MIN = 4
const TABATA_ROUNDS_MAX = 20
const TABATA_ROUNDS_DEFAULT = 8

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
  custom: { min: 0, max: 1, step: 1, unit: '' },
}

const ADVANCED_RANGES: Record<string, { min: number; max: number; step: number; unit: string }> = {
  speed: { min: 0, max: 50, step: 1, unit: 'km/h' },
  watts: { min: 0, max: 500, step: 10, unit: 'W' },
}

function formatMetricValue(metric: ExerciseMetric, value: number, customText?: string): string {
  if (metric === 'custom' && customText) return customText
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
  isLastSegment = false,
}: SegmentEditorProps) => {
  const estimatedDuration = useMemo(
    () => getSegmentEstimatedDurationSeconds(segment),
    [segment],
  )
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false)
  const [expandedAdvancedByAssignmentId, setExpandedAdvancedByAssignmentId] = useState<Record<string, boolean>>({})

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

  const hasExercises = segment.exercises.length > 0
  const segmentCardClass = [
    'segment-card',
    isSelected ? 'segment-card-selected' : '',
    hasExercises ? 'segment-card-has-exercises' : 'segment-card-empty',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={segmentCardClass} onClick={onSelect}>
      <div className="segment-card-header">
        <div className="segment-card-header-left">
          <span className="segment-type-badge">
            {segment.segmentType === 'deathBy'
              ? 'Death by'
              : segment.segmentType === 'chipper'
                ? 'Chipper'
                : segment.segmentType === 'tabata'
                  ? 'Tabata'
                  : segment.segmentType}
          </span>
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
          ) : segment.segmentType === 'emom' &&
            (segment.intervalSeconds ?? 60) !== 60 ? (
            <span className="segment-generated-name">
              E<span className="emom-interval">{formatSecondsAsClock(segment.intervalSeconds ?? 60)}</span>OM {segment.rounds ?? 10}
            </span>
          ) : (
            <span className="segment-generated-name">{displayName}</span>
          )}
        </div>

        <div className="stacked-actions" onClick={(event) => event.stopPropagation()}>
          <button type="button" aria-label="Move segment up" onClick={onMoveUp}>
            <IconArrowUp />
          </button>
          <button type="button" aria-label="Move segment down" onClick={onMoveDown}>
            <IconArrowDown />
          </button>
          <button
            type="button"
            className="danger-button"
            aria-label="Remove segment"
            onClick={onRemove}
          >
            <IconXSmall />
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
            </label>
            <label className="field">
              <span>Rounds {segment.rounds ?? FORTIME_ROUNDS_DEFAULT}</span>
              <input
                className="range-input"
                max={FORTIME_ROUNDS_MAX}
                min={FORTIME_ROUNDS_MIN}
                step={1}
                type="range"
                value={segment.rounds ?? FORTIME_ROUNDS_DEFAULT}
                onChange={(event) =>
                  handleSegmentChange({
                    ...segment,
                    rounds: Number(event.target.value),
                  })
                }
              />
            </label>
          </div>
        ) : null}

        {segment.segmentType === 'chipper' ? (
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
            </label>
          </div>
        ) : null}

        {segment.segmentType === 'tabata' ? (
          <div className="segment-config-stack">
            <label className="field">
              <span>Work {formatSecondsAsClock(segment.workSeconds ?? 20)}</span>
              <input
                className="range-input"
                max={TABATA_WORK_MAX}
                min={TABATA_WORK_MIN}
                step={1}
                type="range"
                value={segment.workSeconds ?? 20}
                onChange={(event) =>
                  handleSegmentChange({
                    ...segment,
                    workSeconds: Number(event.target.value),
                  })
                }
              />
            </label>
            <label className="field">
              <span>Rest {formatSecondsAsClock(segment.restSeconds ?? 10)}</span>
              <input
                className="range-input"
                max={TABATA_REST_MAX}
                min={TABATA_REST_MIN}
                step={1}
                type="range"
                value={segment.restSeconds ?? 10}
                onChange={(event) =>
                  handleSegmentChange({
                    ...segment,
                    restSeconds: Number(event.target.value),
                  })
                }
              />
            </label>
            <label className="field">
              <span>Rounds {segment.rounds ?? TABATA_ROUNDS_DEFAULT}</span>
              <input
                className="range-input"
                max={TABATA_ROUNDS_MAX}
                min={TABATA_ROUNDS_MIN}
                step={1}
                type="range"
                value={segment.rounds ?? TABATA_ROUNDS_DEFAULT}
                onChange={(event) =>
                  handleSegmentChange({
                    ...segment,
                    rounds: Number(event.target.value),
                  })
                }
              />
            </label>
          </div>
        ) : null}

        {!isLastSegment ? (
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
            </label>
          </div>
        ) : null}

        <div className="segment-add-exercise-row" onClick={(event) => event.stopPropagation()}>
          {segment.segmentType === 'tabata' &&
          segment.exercises.length >= (segment.rounds ?? TABATA_ROUNDS_DEFAULT) ? (
            <p className="muted-text">
              Max {segment.rounds ?? TABATA_ROUNDS_DEFAULT} exercises (one per round).
            </p>
          ) : (
            <button
              type="button"
              className="primary-button segment-add-exercise-button"
              onClick={() => setIsExerciseModalOpen(true)}
              disabled={
                segment.segmentType === 'tabata' &&
                segment.exercises.length >= (segment.rounds ?? TABATA_ROUNDS_DEFAULT)
              }
            >
              Add exercise
            </button>
          )}
        </div>

        {segment.exercises.length > 0 ? (
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
              const customText = assignedExercise.metricTarget?.customText ?? ''
              const isMaxAllowed = metricType === 'calories' || metricType === 'distance'
              const isMax = assignedExercise.metricTarget?.isMax ?? false
              const isCustomMeasure = metricType === 'custom'

              return (
                <li
                  key={`${segment.id}-${assignedExercise.id}-${index}`}
                  className="exercise-list-item exercise-list-item-stacked"
                >
                  <div className="exercise-item-header">
                    <div className="exercise-item-title">
                      <strong>{assignedExercise.exercise.name}</strong>
                    </div>
                    <div className="inline-actions">
                      <button
                        type="button"
                        aria-label="Move exercise up"
                        onClick={() => onMoveExerciseUp(index)}
                      >
                        <IconArrowUpSmall />
                      </button>
                      <button
                        type="button"
                        aria-label="Move exercise down"
                        onClick={() => onMoveExerciseDown(index)}
                      >
                        <IconArrowDownSmall />
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        aria-label="Remove exercise"
                        onClick={() => onRemoveExercise(index)}
                      >
                        <IconXSmall />
                      </button>
                    </div>
                  </div>

                  {segment.segmentType !== 'deathBy' && segment.segmentType !== 'tabata' && (
                  <div className="prescription-stack">
                        {isSetsReps ? (
                          <>
                            {segment.segmentType === 'custom' && !assignedExercise.isMaxRepetitions ? (
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
                              </label>
                            ) : null}
                        <div className="field">
                          <div className="field-label-row">
                            <span>
                              Reps{' '}
                              {assignedExercise.isMaxRepetitions
                                ? 'Max'
                                : assignedExercise.repetitions ?? ASSIGNED_REPS_MIN}
                            </span>
                            <ToggleSwitch
                              label="Max"
                              checked={assignedExercise.isMaxRepetitions ?? false}
                              onChange={(checked) =>
                                onUpdateAssignedExercise({
                                  ...assignedExercise,
                                  isMaxRepetitions: checked,
                                })
                              }
                            />
                          </div>

                          {!assignedExercise.isMaxRepetitions ? (
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
                          ) : null}
                        </div>
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
                                      metricTarget:
                                        metric === 'custom'
                                          ? {
                                              type: 'custom',
                                              value: 0,
                                              customText: assignedExercise.metricTarget?.type === 'custom' ? assignedExercise.metricTarget.customText ?? '' : '',
                                              speed: assignedExercise.metricTarget?.speed,
                                              watts: assignedExercise.metricTarget?.watts,
                                            }
                                          : {
                                              type: metric,
                                              value: METRIC_RANGES[metric].min,
                                            },
                                    })
                                  }
                                />
                                <span className="measure-radio-label">{metric === 'custom' ? 'Custom' : metric}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="field">
                          {isCustomMeasure ? (
                            <>
                              <span>Custom value</span>
                              <input
                                type="text"
                                value={customText}
                                onChange={(e) =>
                                  onUpdateAssignedExercise({
                                    ...assignedExercise,
                                    sets: undefined,
                                    repetitions: undefined,
                                    metricTarget: {
                                      type: 'custom',
                                      value: 0,
                                      customText: e.target.value,
                                      speed: assignedExercise.metricTarget?.speed,
                                      watts: assignedExercise.metricTarget?.watts,
                                    },
                                  })
                                }
                                placeholder="e.g. 1 mile, 10 km"
                                aria-label="Custom measure (e.g. 1 mile, 10 km)"
                              />
                            </>
                          ) : (
                            <>
                              <div className="field-label-row">
                                <span>
                                  Value {isMax ? 'Max' : formatMetricValue(metricType, metricValue)}
                                </span>
                                {isMaxAllowed ? (
                                  <ToggleSwitch
                                    label="Max"
                                    checked={isMax}
                                    onChange={(checked) =>
                                      onUpdateAssignedExercise({
                                        ...assignedExercise,
                                        sets: undefined,
                                        repetitions: undefined,
                                        metricTarget: {
                                          type: metricType,
                                          value: checked ? metricValue : metricRange.min,
                                          isMax: checked,
                                        },
                                      })
                                    }
                                  />
                                ) : null}
                              </div>

                              {!isMax ? (
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
                              ) : null}
                            </>
                          )}
                        </div>
                        {assignedExercise.exercise.prescription.mode === 'metric' &&
                          assignedExercise.exercise.prescription.advancedMetrics?.length ? (
                          <div className="advanced-settings-block">
                            <button
                              type="button"
                              className="advanced-settings-trigger"
                              onClick={() =>
                                setExpandedAdvancedByAssignmentId((prev) => ({
                                  ...prev,
                                  [assignedExercise.id]: !prev[assignedExercise.id],
                                }))
                              }
                            >
                              {expandedAdvancedByAssignmentId[assignedExercise.id] ? 'Hide advanced settings' : 'Advanced settings'}
                            </button>
                            {expandedAdvancedByAssignmentId[assignedExercise.id] ? (
                              <div className="segment-config-stack">
                                {assignedExercise.exercise.prescription.advancedMetrics?.includes('speed') ? (
                                  <label className="field">
                                    <span>
                                      Speed {assignedExercise.metricTarget?.speed ?? 0} km/h
                                    </span>
                                    <input
                                      className="range-input"
                                      max={ADVANCED_RANGES.speed.max}
                                      min={ADVANCED_RANGES.speed.min}
                                      step={ADVANCED_RANGES.speed.step}
                                      type="range"
                                      value={assignedExercise.metricTarget?.speed ?? 0}
                                      onChange={(event) =>
                                        onUpdateAssignedExercise({
                                          ...assignedExercise,
                                          metricTarget: {
                                            ...(assignedExercise.metricTarget ?? {}),
                                            type: metricType,
                                            value: metricValue,
                                            isMax: isMax ?? false,
                                            speed: Number(event.target.value),
                                          },
                                        })
                                      }
                                    />
                                  </label>
                                ) : null}
                                {assignedExercise.exercise.prescription.advancedMetrics?.includes('watts') ? (
                                  <label className="field">
                                    <span>
                                      Watts {assignedExercise.metricTarget?.watts ?? 0} W
                                    </span>
                                    <input
                                      className="range-input"
                                      max={ADVANCED_RANGES.watts.max}
                                      min={ADVANCED_RANGES.watts.min}
                                      step={ADVANCED_RANGES.watts.step}
                                      type="range"
                                      value={assignedExercise.metricTarget?.watts ?? 0}
                                      onChange={(event) =>
                                        onUpdateAssignedExercise({
                                          ...assignedExercise,
                                          metricTarget: {
                                            ...(assignedExercise.metricTarget ?? {}),
                                            type: metricType,
                                            value: metricValue,
                                            isMax: isMax ?? false,
                                            watts: Number(event.target.value),
                                          },
                                        })
                                      }
                                    />
                                  </label>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                  )}
                </li>
              )
            })}
          </ul>
        ) : null}

        <div className="segment-footer">
          <span className="muted-text">
            Total time:{' '}
            {estimatedDuration !== undefined ? formatSecondsAsClock(estimatedDuration) : 'Not measurable'}
          </span>
        </div>
      </div>

      {isExerciseModalOpen ? (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={() => setIsExerciseModalOpen(false)}
        >
          <div
            aria-modal="true"
            className="modal-panel"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-header">
              <div>
                <p className="eyebrow">Segment Exercise</p>
                <h2>Add exercise</h2>
              </div>
              <button type="button" onClick={() => setIsExerciseModalOpen(false)}>
                Close
              </button>
            </div>

            <SegmentExercisePicker
              availableExercises={availableExercises}
              autoFocus
              onAssignExercise={(exerciseId) => {
                onAssignExercise(exerciseId)
                setIsExerciseModalOpen(false)
              }}
            />
          </div>
        </div>
      ) : null}
    </article>
  )
}
