import type { AssignedExercise, Segment } from '../types/segment.ts'
import type { Workout } from '../types/workout.ts'
import {
  formatSecondsAsClock,
  getSegmentEstimatedDurationSeconds,
} from './workout-domain.ts'

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
    case 'custom':
    default:
      return segment.name
  }
}

/**
 * One line per exercise for the board, e.g. "8 KB Swing", "Max cal Row", "5 Front Squats".
 */
export function getBoardExerciseLine(assigned: AssignedExercise): string {
  const name = assigned.exercise.name
  if (assigned.metricTarget) {
    const { type, value, isMax } = assigned.metricTarget
    const abbrev = type === 'calories' ? 'cal' : type === 'distance' ? 'm' : type === 'time' ? 'min' : type
    if (isMax) {
      return `Max ${value} ${abbrev} ${name}`
    }
    return `${value} ${abbrev} ${name}`
  }
  if (assigned.isMaxRepetitions) {
    return `Max reps ${name}`
  }
  const sets = assigned.sets ?? 0
  const reps = assigned.repetitions ?? 0
  if (sets > 0 && reps > 0) {
    return `${sets}×${reps} ${name}`
  }
  if (reps > 0) {
    return `${reps} ${name}`
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
 * Whether the workout has at least one time-measurable segment (EMOM, AMRAP, or For Time with timing).
 */
export function isWorkoutTimeMeasurable(workout: Workout): boolean {
  return workout.segments.some((seg) => {
    const duration = getSegmentEstimatedDurationSeconds(seg)
    return duration !== undefined && duration > 0
  })
}
