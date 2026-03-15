import type { Segment } from '../types/segment.ts'
import type { Workout } from '../types/workout.ts'
import { getGeneratedSegmentName } from './workout-domain.ts'

/**
 * Placeholder contract for the Timer Generator.
 * Future: consumes workout and segment structure to produce runnable timers
 * (e.g. EMOM countdowns, AMRAP duration, For Time cap).
 */

export type TimerSegmentInfo = {
  segmentId: string
  segmentName: string
  segmentType: string
  /** Total duration in seconds when derivable (e.g. EMOM interval * rounds). */
  durationSeconds?: number
  /** Interval in seconds for EMOM-style segments. */
  intervalSeconds?: number
  /** Time cap in seconds for For Time segments. */
  timeCapSeconds?: number
  /** Tabata: work interval in seconds. */
  workSeconds?: number
  /** Tabata: rest interval in seconds. */
  restSeconds?: number
  /** Round count (EMOM, Tabata). */
  rounds?: number
}

export type TimerGeneratorResult = {
  status: 'placeholder' | 'ready' | 'error'
  workoutId: string
  workoutName: string
  segments: TimerSegmentInfo[]
  message?: string
}

/**
 * Returns segment structure and duration references for a workout.
 * Used by WorkoutTimer for runnable timers. EMOM duration = intervalSeconds * rounds.
 */
export function getTimerStructure(workout: Workout): TimerGeneratorResult {
  const segments: TimerSegmentInfo[] = workout.segments.map((seg: Segment) => {
    const durationSeconds =
      seg.segmentType === 'emom' && seg.intervalSeconds != null && seg.rounds != null
        ? seg.intervalSeconds * seg.rounds
        : seg.segmentType === 'tabata' &&
            seg.workSeconds != null &&
            seg.restSeconds != null &&
            seg.rounds != null
          ? seg.rounds * (seg.workSeconds + seg.restSeconds)
          : seg.durationSeconds
    const segmentName =
      seg.segmentType === 'deathBy' ||
      seg.segmentType === 'chipper' ||
      seg.segmentType === 'tabata'
        ? getGeneratedSegmentName(seg)
        : seg.name
    return {
      segmentId: seg.id,
      segmentName,
      segmentType: seg.segmentType,
      durationSeconds,
      intervalSeconds: seg.intervalSeconds,
      timeCapSeconds: seg.timeCapSeconds,
      workSeconds: seg.workSeconds,
      restSeconds: seg.restSeconds,
      rounds: seg.rounds,
    }
  })

  return {
    status: 'placeholder',
    workoutId: workout.id,
    workoutName: workout.name,
    segments,
    message: 'Timer execution not implemented; structure is available for future integration.',
  }
}
