import type { Segment } from '../types/segment.ts'
import type { Workout } from '../types/workout.ts'

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
        : seg.durationSeconds
    return {
      segmentId: seg.id,
      segmentName: seg.name,
      segmentType: seg.segmentType,
      durationSeconds,
      intervalSeconds: seg.intervalSeconds,
      timeCapSeconds: seg.timeCapSeconds,
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
