import { useMemo, useState } from 'react'
import { cn } from '../../ui/cn.ts'
import * as tw from '../../ui/tw.ts'
import type { ExerciseMetric } from '../../types/domain.ts'
import {
  formatSecondsAsClock,
  getGeneratedSegmentName,
  getSegmentEstimatedDurationSeconds,
  isSegmentRepGenActive,
} from '../../services/index.ts'
import type { Exercise } from '../../types/exercise.ts'
import type { AssignedExercise, Segment } from '../../types/segment.ts'
import { SegmentedControl } from '../SegmentedControl.tsx'
import { ToggleSwitch } from '../ToggleSwitch.tsx'
import {
  IconArrowDown,
  IconArrowDownSmall,
  IconArrowUp,
  IconArrowUpSmall,
  IconTrashSmall,
} from '../icons.tsx'
import { ADVANCED_METRIC_RANGES, METRIC_RANGES } from '../../services/metric-ranges.ts'
import { SegmentExercisePicker } from './SegmentExercisePicker.tsx'
import { SegmentRepGenerationPanel } from './SegmentRepGenerationPanel.tsx'

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
  const segmentCardClass = cn(
    tw.segmentCardBase,
    isSelected && tw.segmentCardSelected,
    hasExercises ? tw.segmentCardHasExercises : tw.segmentCardEmpty,
  )

  return (
    <article className={segmentCardClass} onClick={onSelect}>
      <div className={tw.segmentCardHeader}>
        <div className={tw.segmentCardHeaderLeft}>
          <span className={tw.segmentTypeBadge}>
            {segment.segmentType === 'deathBy'
              ? 'Death by'
              : segment.segmentType === 'chipper'
                ? 'Chipper'
                : segment.segmentType === 'tabata'
                  ? 'Tabata'
                  : segment.segmentType}
          </span>
          {segment.segmentType === 'custom' ? (
            <div className={tw.segmentNameField}>
              <input
                className={tw.fieldInput}
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
            <span className={tw.segmentGeneratedName}>
              E<span className={tw.emomInterval}>{formatSecondsAsClock(segment.intervalSeconds ?? 60)}</span>OM {segment.rounds ?? 10}
            </span>
          ) : (
            <span className={tw.segmentGeneratedName}>{displayName}</span>
          )}
        </div>

        <div className={tw.builderSegmentedActionGroup} onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            className={tw.builderSegmentedActionFace}
            aria-label="Move segment up"
            onClick={onMoveUp}
          >
            <IconArrowUp />
          </button>
          <button
            type="button"
            className={tw.builderSegmentedActionFace}
            aria-label="Move segment down"
            onClick={onMoveDown}
          >
            <IconArrowDown />
          </button>
          <button
            type="button"
            className={tw.builderSegmentedActionFace}
            aria-label="Remove segment"
            onClick={onRemove}
          >
            <IconTrashSmall />
          </button>
        </div>
      </div>

      <div className={tw.segmentCardBody} onClick={(event) => event.stopPropagation()}>
        {segment.segmentType === 'emom' ? (
          <div className={tw.segmentConfigStack}>
            <label className={tw.field}>
              <span>Interval {formatSecondsAsClock(segment.intervalSeconds ?? 60)}</span>
              <input
                className={tw.rangeSlider}
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

            <label className={tw.field}>
              <span>Sets {segment.rounds ?? EMOM_ROUNDS_DEFAULT}</span>
              <input
                className={tw.rangeSlider}
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
          <div className={tw.segmentConfigStack}>
            <label className={tw.field}>
              <span>
                Duration {formatSecondsAsClock(segment.durationSeconds ?? AMRAP_DURATION_DEFAULT_SECONDS)}
              </span>
              <input
                className={tw.rangeSlider}
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
          <div className={tw.segmentConfigStack}>
            <label className={tw.field}>
              <span>
                Time cap {formatSecondsAsClock(segment.timeCapSeconds ?? TIMECAP_DEFAULT_SECONDS)}
              </span>
              <input
                className={tw.rangeSlider}
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
            <label className={tw.field}>
              <span>Rounds {segment.rounds ?? FORTIME_ROUNDS_DEFAULT}</span>
              <input
                className={tw.rangeSlider}
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
          <div className={tw.segmentConfigStack}>
            <label className={tw.field}>
              <span>
                Time cap {formatSecondsAsClock(segment.timeCapSeconds ?? TIMECAP_DEFAULT_SECONDS)}
              </span>
              <input
                className={tw.rangeSlider}
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
          <div className={tw.segmentConfigStack}>
            <label className={tw.field}>
              <span>Work {formatSecondsAsClock(segment.workSeconds ?? 20)}</span>
              <input
                className={tw.rangeSlider}
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
            <label className={tw.field}>
              <span>Rest {formatSecondsAsClock(segment.restSeconds ?? 10)}</span>
              <input
                className={tw.rangeSlider}
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
            <label className={tw.field}>
              <span>Rounds {segment.rounds ?? TABATA_ROUNDS_DEFAULT}</span>
              <input
                className={tw.rangeSlider}
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
          <div className={tw.segmentConfigGrid}>
            <label className={tw.field}>
              <span>
                Rest after segment {formatSecondsAsClock(restMinutesToSeconds(segment.restInterval ?? 0))}
              </span>
              <input
                className={tw.rangeSlider}
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

        <SegmentRepGenerationPanel segment={segment} onCommit={handleSegmentChange} />

        <div className={tw.segmentAddExerciseRow} onClick={(event) => event.stopPropagation()}>
          {segment.segmentType === 'tabata' &&
          segment.exercises.length >= (segment.rounds ?? TABATA_ROUNDS_DEFAULT) ? (
            <p className={tw.mutedText}>
              Max {segment.rounds ?? TABATA_ROUNDS_DEFAULT} exercises (one per round).
            </p>
          ) : (
            <button
              type="button"
              className={tw.segmentAddExerciseButton}
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
          <ul className={tw.exerciseList}>
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
              const rawMetricValue = assignedExercise.metricTarget?.value ?? metricRange.min
              const metricValue =
                metricType === 'custom'
                  ? rawMetricValue
                  : Math.min(metricRange.max, Math.max(metricRange.min, rawMetricValue))
              const customText = assignedExercise.metricTarget?.customText ?? ''
              const isMaxAllowed = metricType === 'calories' || metricType === 'distance'
              const isMax = assignedExercise.metricTarget?.isMax ?? false
              const isCustomMeasure = metricType === 'custom'

              return (
                <li
                  key={`${segment.id}-${assignedExercise.id}-${index}`}
                  className={tw.exerciseListItemStacked}
                >
                  <div className={tw.exerciseItemHeader}>
                    <div className={tw.exerciseItemTitle}>
                      <strong>{assignedExercise.exercise.name}</strong>
                    </div>
                    <div className={tw.builderSegmentedActionGroup}>
                      <button
                        type="button"
                        className={tw.builderSegmentedActionFace}
                        aria-label="Move exercise up"
                        onClick={() => onMoveExerciseUp(index)}
                      >
                        <IconArrowUpSmall />
                      </button>
                      <button
                        type="button"
                        className={tw.builderSegmentedActionFace}
                        aria-label="Move exercise down"
                        onClick={() => onMoveExerciseDown(index)}
                      >
                        <IconArrowDownSmall />
                      </button>
                      <button
                        type="button"
                        className={tw.builderSegmentedActionFace}
                        aria-label="Remove exercise"
                        onClick={() => onRemoveExercise(index)}
                      >
                        <IconTrashSmall />
                      </button>
                    </div>
                  </div>

                  {segment.segmentType !== 'deathBy' &&
                  segment.segmentType !== 'tabata' &&
                  !(isSegmentRepGenActive(segment) && isSetsReps) && (
                  <div className={tw.prescriptionStack}>
                        {isSetsReps ? (
                          <>
                            {segment.segmentType === 'custom' && !assignedExercise.isMaxRepetitions ? (
                              <label className={tw.field}>
                                <span>
                                  Sets {assignedExercise.sets ?? 0}
                                </span>
                                <input
                                  className={tw.rangeSlider}
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
                        <div className={tw.field}>
                          <div className={tw.fieldLabelRow}>
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
                              className={tw.rangeSlider}
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
                        <div className={tw.field}>
                          <span>Measure</span>
                          <SegmentedControl<ExerciseMetric>
                            name={`measure-${assignedExercise.id}`}
                            value={metricType}
                            options={metricOptions.map((metric) => ({
                              value: metric,
                              label: metric === 'custom' ? 'Custom' : metric,
                            }))}
                            onChange={(metric) =>
                              onUpdateAssignedExercise({
                                ...assignedExercise,
                                sets: undefined,
                                repetitions: undefined,
                                metricTarget:
                                  metric === 'custom'
                                    ? {
                                        type: 'custom',
                                        value: 0,
                                        customText:
                                          assignedExercise.metricTarget?.type === 'custom'
                                            ? assignedExercise.metricTarget.customText ?? ''
                                            : '',
                                        speed: assignedExercise.metricTarget?.speed,
                                        watts: assignedExercise.metricTarget?.watts,
                                      }
                                    : {
                                        type: metric,
                                        value: METRIC_RANGES[metric].min,
                                      },
                              })
                            }
                            ariaLabel="Metric type"
                            className={cn(tw.segmentedControlWrap, 'w-full')}
                          />
                        </div>
                        <div className={tw.field}>
                          {isCustomMeasure ? (
                            <>
                              <span>Custom value</span>
                              <input
                                className={tw.fieldInput}
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
                              <div className={tw.fieldLabelRow}>
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
                                  className={tw.rangeSlider}
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
                          <div className={tw.advancedSettingsBlock}>
                            <button
                              type="button"
                              className={tw.advancedSettingsTrigger}
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
                              <div className={tw.segmentConfigStack}>
                                {assignedExercise.exercise.prescription.advancedMetrics?.includes('speed') ? (
                                  <label className={tw.field}>
                                    <span>
                                      Speed {assignedExercise.metricTarget?.speed ?? 0} km/h
                                    </span>
                                    <input
                                      className={tw.rangeSlider}
                                      max={ADVANCED_METRIC_RANGES.speed.max}
                                      min={ADVANCED_METRIC_RANGES.speed.min}
                                      step={ADVANCED_METRIC_RANGES.speed.step}
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
                                  <label className={tw.field}>
                                    <span>
                                      Watts {assignedExercise.metricTarget?.watts ?? 0} W
                                    </span>
                                    <input
                                      className={tw.rangeSlider}
                                      max={ADVANCED_METRIC_RANGES.watts.max}
                                      min={ADVANCED_METRIC_RANGES.watts.min}
                                      step={ADVANCED_METRIC_RANGES.watts.step}
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

        <div className={tw.segmentFooter}>
          <span className={tw.mutedText}>
            Total time:{' '}
            {estimatedDuration !== undefined ? formatSecondsAsClock(estimatedDuration) : 'Not measurable'}
          </span>
        </div>
      </div>

      {isExerciseModalOpen ? (
        <div
          className={tw.modalOverlay}
          role="presentation"
          onClick={() => setIsExerciseModalOpen(false)}
        >
          <div
            aria-modal="true"
            className={tw.modalPanel}
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={tw.panelHeader}>
              <div>
                <p className={tw.eyebrow}>Segment Exercise</p>
                <h2 className={tw.panelTitle}>Add exercise</h2>
              </div>
              <button
                type="button"
                className={tw.secondaryButton}
                onClick={() => setIsExerciseModalOpen(false)}
              >
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
