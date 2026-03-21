import type { AssignedExercise, Segment } from '../types/segment.ts'
import type { Workout } from '../types/workout.ts'
import {
  formatSecondsAsClock,
  getGeneratedSegmentName,
  getSegmentEstimatedDurationSeconds,
} from './workout-domain.ts'
import { isSegmentRepGenActive } from './repetition-generation.ts'

/** When true, board shows `21-15-9` under the title and exercise lines without per-line reps. */
function segmentBoardRepSequenceLine(segment: Segment): string | null {
  if (!isSegmentRepGenActive(segment)) return null
  const seq = segment.repSequence
  if (!seq?.length) return null
  return seq.join('-')
}

/** Summary line for the board (e.g. `21-15-9`) when reps-per-round generation is active. */
export function getBoardRepSequenceSummary(segment: Segment): string | null {
  return segmentBoardRepSequenceLine(segment)
}

/**
 * Board-style segment title with exact durations (no rounding).
 * e.g. "AMRAP 1:30", "EMOM 10", "E1:30OM 10", "For Time (15:00)".
 */
export function getBoardSegmentTitle(segment: Segment): string {
  switch (segment.segmentType) {
    case 'emom': {
      const interval = segment.intervalSeconds ?? 60
      const rounds = segment.rounds ?? 10
      if (interval === 60) {
        return `EMOM ${rounds}`
      }
      return `E${formatSecondsAsClock(interval)}OM ${rounds}`
    }
    case 'amrap': {
      const duration = segment.durationSeconds ?? 600
      return `AMRAP ${formatSecondsAsClock(duration)}`
    }
    case 'forTime': {
      const rounds = segment.rounds ?? 1
      const cap = segment.timeCapSeconds
      const capStr = cap != null ? ` (${formatSecondsAsClock(cap)} cap)` : ''
      return rounds === 1 ? `For Time${capStr}` : `For Time ${rounds}${capStr}`
    }
    case 'deathBy':
      return getGeneratedSegmentName(segment)
    case 'chipper': {
      const cap = segment.timeCapSeconds
      const capStr = cap != null && cap > 0 ? ` (${formatSecondsAsClock(cap)} cap)` : ''
      return `Chipper${capStr}`
    }
    case 'tabata':
      return getGeneratedSegmentName(segment)
    case 'custom':
    default:
      return segment.name
  }
}

/**
 * One line per exercise for the board.
 *
 * For metric targets, show the metric amount (e.g. calories) before the exercise name.
 * For sets/reps, show reps before the exercise name (e.g. "4 - Front Squat").
 *
 * Death by is strict: reps are never shown on the board.
 *
 * When repetition generation is on and `repSequence` is set, the sequence is shown once
 * under the segment title; each sets/reps exercise is listed by name only (no `21 -` prefix).
 */
export function getBoardExerciseLine(
  assigned: AssignedExercise,
  segment: Segment,
): string {
  const name = assigned.exercise.name

  // Death by: never show reps/sets values on the board.
  if (segment.segmentType === 'deathBy') {
    return name
  }

  const repSeqLine = segmentBoardRepSequenceLine(segment)
  if (
    repSeqLine &&
    assigned.exercise.prescription.mode === 'sets-reps' &&
    !assigned.metricTarget &&
    !assigned.isMaxRepetitions
  ) {
    return name
  }

  if (assigned.metricTarget) {
    const { type, value, isMax, customText } = assigned.metricTarget
    if (type === 'custom' && customText?.trim()) {
      return `${customText.trim()} - ${name}`
    }
    const abbrev = type === 'calories' ? 'cal' : type === 'distance' ? 'm' : type === 'time' ? 'min' : type
    if (isMax) {
      return `Max ${value} ${abbrev} - ${name}`
    }
    return `${value} ${abbrev} - ${name}`
  }

  if (assigned.isMaxRepetitions) {
    return `Max reps - ${name}`
  }

  // For sets/reps: show reps when present.
  if (assigned.repetitions != null) {
    return `${assigned.repetitions} - ${name}`
  }

  return name
}

/**
 * Rest line for board: "Rest: M:SS" when rest > 0 (exact duration, no rounding).
 */
/** Rest interval is stored in minutes (from builder slider); convert to seconds for display. */
export function getBoardRestLine(segment: Segment): string | null {
  const restMinutes = segment.restInterval ?? 0
  if (restMinutes <= 0) return null
  const restSeconds = Math.round(restMinutes * 60)
  return `Rest: ${formatSecondsAsClock(restSeconds)}`
}

/**
 * Whether the workout has at least one time-measurable segment (EMOM, AMRAP, For Time, or Death by with exercises).
 */
export function isWorkoutTimeMeasurable(workout: Workout): boolean {
  return workout.segments.some((seg) => {
    if (seg.segmentType === 'deathBy') {
      return seg.exercises.length > 0
    }
    const duration = getSegmentEstimatedDurationSeconds(seg)
    return duration !== undefined && duration > 0
  })
}
