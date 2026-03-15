import { useEffect, useRef, useState, useMemo } from 'react'
import type { Workout } from '../../types/workout.ts'
import { getTimerStructure } from '../../services/timer-generator.ts'
import { formatSecondsAsClock } from '../../services/workout-domain.ts'

export type TimerPhaseInfo = { phaseType: 'work' | 'rest'; segmentId: string }

type WorkoutTimerProps = {
  workout: Workout
  onStopTimer: () => void
  onBackToBuild: () => void
  /** When true, render as a compact strip (timer above board). */
  embedded?: boolean
  /** Called when the current phase changes (for board highlighting). */
  onPhaseChange?: (info: TimerPhaseInfo) => void
}

type WorkPhase = {
  type: 'work'
  segmentId: string
  segmentName: string
  durationSeconds?: number
  timeCapSeconds?: number
  isForTime: boolean
  /** Death by: 1:00 countdown per round, repeat until user stops; no fixed round count. */
  isDeathBy?: boolean
}

type RestPhase = {
  type: 'rest'
  restSeconds: number
  /** Segment id that this rest follows (for board highlighting). */
  afterSegmentId: string
}

type TimerPhase = WorkPhase | RestPhase

/** How long to show "Finish" before advancing to next phase (ms). */
const FINISH_DISPLAY_MS = 1200

function buildPhases(workout: Workout): TimerPhase[] {
  const structure = getTimerStructure(workout)
  const phases: TimerPhase[] = []

  for (const seg of structure.segments) {
    const workoutSegment = workout.segments.find((s) => s.id === seg.segmentId)

    // EMOM: one work phase per round, each with interval duration (user sees each interval countdown)
    if (
      seg.segmentType === 'emom' &&
      seg.intervalSeconds != null &&
      seg.intervalSeconds > 0 &&
      workoutSegment?.rounds != null &&
      workoutSegment.rounds > 0
    ) {
      const rounds = workoutSegment.rounds
      const intervalSeconds = seg.intervalSeconds
      for (let r = 0; r < rounds; r++) {
        phases.push({
          type: 'work',
          segmentId: seg.segmentId,
          segmentName: seg.segmentName,
          durationSeconds: intervalSeconds,
          timeCapSeconds: undefined,
          isForTime: false,
        })
      }
      const restMinutes = workoutSegment.restInterval ?? 0
      const restSeconds = Math.round(restMinutes * 60)
      if (restSeconds > 0) {
        phases.push({ type: 'rest', restSeconds, afterSegmentId: seg.segmentId })
      }
      continue
    }

    // Death by: one work phase, 60s per round, repeat until user stops (handled in timer tick)
    if (seg.segmentType === 'deathBy' && workoutSegment && workoutSegment.exercises.length > 0) {
      phases.push({
        type: 'work',
        segmentId: seg.segmentId,
        segmentName: seg.segmentName,
        durationSeconds: 60,
        timeCapSeconds: undefined,
        isForTime: false,
        isDeathBy: true,
      })
      const restMinutes = workoutSegment.restInterval ?? 0
      const restSeconds = Math.round(restMinutes * 60)
      if (restSeconds > 0) {
        phases.push({ type: 'rest', restSeconds, afterSegmentId: seg.segmentId })
      }
      continue
    }

    // Tabata: alternating work/rest per round (e.g. 20s work, 10s rest × 8)
    if (
      seg.segmentType === 'tabata' &&
      seg.workSeconds != null &&
      seg.restSeconds != null &&
      (seg.rounds ?? 0) > 0
    ) {
      const rounds = seg.rounds ?? 8
      const workSec = seg.workSeconds
      const restSec = seg.restSeconds
      for (let r = 0; r < rounds; r++) {
        phases.push({
          type: 'work',
          segmentId: seg.segmentId,
          segmentName: seg.segmentName,
          durationSeconds: workSec,
          timeCapSeconds: undefined,
          isForTime: false,
        })
        phases.push({ type: 'rest', restSeconds: restSec, afterSegmentId: seg.segmentId })
      }
      const restMinutes = workoutSegment?.restInterval ?? 0
      const segmentRestSec = Math.round(restMinutes * 60)
      if (segmentRestSec > 0) {
        phases.push({ type: 'rest', restSeconds: segmentRestSec, afterSegmentId: seg.segmentId })
      }
      continue
    }

    const hasDuration = seg.durationSeconds != null && seg.durationSeconds > 0
    const hasCap = seg.timeCapSeconds != null && seg.timeCapSeconds > 0
    if (!hasDuration && !hasCap) continue

    phases.push({
      type: 'work',
      segmentId: seg.segmentId,
      segmentName: seg.segmentName,
      durationSeconds: seg.durationSeconds,
      timeCapSeconds: seg.timeCapSeconds,
      isForTime: seg.segmentType === 'forTime' || seg.segmentType === 'chipper',
    })

    const restMinutes = workoutSegment?.restInterval ?? 0
    const restSeconds = Math.round(restMinutes * 60)
    if (restSeconds > 0) {
      phases.push({ type: 'rest', restSeconds, afterSegmentId: seg.segmentId })
    }
  }

  return phases
}

function getInitialCounter(phase: TimerPhase | undefined): { remaining: number; elapsed: number } {
  if (!phase) return { remaining: 0, elapsed: 0 }
  if (phase.type === 'rest') return { remaining: phase.restSeconds, elapsed: 0 }
  if (phase.isForTime) return { remaining: 0, elapsed: 0 }
  return { remaining: phase.durationSeconds ?? 0, elapsed: 0 }
}

export function WorkoutTimer({
  workout,
  onStopTimer,
  onBackToBuild,
  embedded = false,
  onPhaseChange,
}: WorkoutTimerProps) {
  const phases = useMemo(() => buildPhases(workout), [workout])
  const firstCounter = useMemo(() => getInitialCounter(phases[0]), [phases])
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(() => firstCounter.remaining)
  const [elapsedSeconds, setElapsedSeconds] = useState(() => firstCounter.elapsed)
  const [showingFinish, setShowingFinish] = useState(false)
  const phaseIndexRef = useRef(phaseIndex)
  const remainingSecondsRef = useRef(remainingSeconds)
  const elapsedSecondsRef = useRef(elapsedSeconds)

  phaseIndexRef.current = phaseIndex
  remainingSecondsRef.current = remainingSeconds
  elapsedSecondsRef.current = elapsedSeconds

  const currentPhase = phases[phaseIndex]
  const isComplete = phaseIndex >= phases.length

  // Notify parent of current phase for board highlighting (work = red segment, rest = green rest card)
  useEffect(() => {
    if (!onPhaseChange || !currentPhase) return
    if (currentPhase.type === 'work') {
      onPhaseChange({ phaseType: 'work', segmentId: currentPhase.segmentId })
    } else {
      onPhaseChange({ phaseType: 'rest', segmentId: currentPhase.afterSegmentId })
    }
  }, [phaseIndex, currentPhase, onPhaseChange])

  // When phase index changes, initialize counter for the new phase (no "Not set")
  useEffect(() => {
    const p = phases[phaseIndex]
    if (!p) return
    const { remaining, elapsed } = getInitialCounter(p)
    setRemainingSeconds(remaining)
    setElapsedSeconds(elapsed)
    setShowingFinish(false)
    remainingSecondsRef.current = remaining
    elapsedSecondsRef.current = elapsed
  }, [phaseIndex, phases])

  // Single interval: read phase and counters from refs so rest phase always sees correct remainingSeconds (avoids sync/closure issues).
  useEffect(() => {
    if (!currentPhase || showingFinish) return

    const intervalId = setInterval(() => {
      const idx = phaseIndexRef.current
      const phase = phases[idx]
      if (!phase) return

      const applyNextPhase = () => {
        const nextIdx = idx + 1
        const nextPhase = phases[nextIdx]
        const { remaining, elapsed } = getInitialCounter(nextPhase)
        setPhaseIndex((i) => i + 1)
        setRemainingSeconds(remaining)
        setElapsedSeconds(elapsed)
        remainingSecondsRef.current = remaining
        elapsedSecondsRef.current = elapsed
      }

      if (phase.type === 'rest') {
        const r = remainingSecondsRef.current
        if (r <= 1) {
          applyNextPhase()
          return
        }
        const next = r - 1
        remainingSecondsRef.current = next
        setRemainingSeconds(next)
        return
      }

      if (phase.isForTime) {
        const cap = phase.timeCapSeconds ?? 0
        const e = elapsedSecondsRef.current
        const next = e + 1
        elapsedSecondsRef.current = next
        setElapsedSeconds(next)
        if (cap > 0 && next >= cap) setShowingFinish(true)
        return
      }

      // Death by: 1:00 countdown per round; when 0, reset to 60 (next round), don't advance phase
      if (phase.isDeathBy) {
        const r = remainingSecondsRef.current
        if (r <= 1) {
          remainingSecondsRef.current = 60
          setRemainingSeconds(60)
          return
        }
        const next = r - 1
        remainingSecondsRef.current = next
        setRemainingSeconds(next)
        return
      }

      // Work phase (countdown): same pattern as rest
      const r = remainingSecondsRef.current
      if (r <= 1) {
        applyNextPhase()
        return
      }
      const next = r - 1
      remainingSecondsRef.current = next
      setRemainingSeconds(next)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [phaseIndex, phases, currentPhase, showingFinish])

  // After showing "Finish", advance to next phase or complete
  useEffect(() => {
    if (!showingFinish) return
    const timeoutId = setTimeout(() => {
      setShowingFinish(false)
      setPhaseIndex((i) => i + 1)
    }, FINISH_DISPLAY_MS)
    return () => clearTimeout(timeoutId)
  }, [showingFinish])

  function handleForTimeStop() {
    setShowingFinish(true)
  }

  function handleDeathByStop() {
    const nextIdx = phaseIndex + 1
    const nextPhase = phases[nextIdx]
    const { remaining, elapsed } = getInitialCounter(nextPhase)
    setPhaseIndex((i) => i + 1)
    setRemainingSeconds(remaining)
    setElapsedSeconds(elapsed)
    remainingSecondsRef.current = remaining
    elapsedSecondsRef.current = elapsed
  }

  if (phases.length === 0) {
    return (
      <main className="board-shell">
        <p className="muted-text">No time-measurable segments.</p>
        <button type="button" className="primary-button" onClick={onStopTimer}>
          Back to board
        </button>
      </main>
    )
  }

  if (isComplete && !embedded) {
    return (
      <main className="board-shell">
        <h2 className="board-title">Workout complete</h2>
        <div className="board-actions">
          <button type="button" className="secondary-button" onClick={onBackToBuild}>
            Back to build
          </button>
          <button type="button" className="primary-button" onClick={onStopTimer}>
            Back to board
          </button>
        </div>
      </main>
    )
  }

  const phase = isComplete ? null : currentPhase!
  const isWork = phase?.type === 'work'
  const isRest = phase?.type === 'rest'
  const isForTime = isWork && phase?.isForTime
  const isDeathBy = isWork && phase?.isDeathBy

  const label =
    isComplete
      ? 'Workout complete'
      : isRest
        ? `Rest: ${formatSecondsAsClock(phase!.restSeconds)}`
        : isForTime
          ? `Work: ${formatSecondsAsClock(phase!.timeCapSeconds ?? 0)}`
          : `Work: ${formatSecondsAsClock(phase!.durationSeconds ?? 0)}`

  const counterValue =
    isRest
      ? remainingSeconds
      : isForTime
        ? elapsedSeconds
        : remainingSeconds

  const displayTime = formatSecondsAsClock(counterValue)

  const timerContent = (
    <>
      <header className={`timer-strip-header ${isRest ? 'timer-strip-rest' : 'timer-strip-work'}`}>
        <h2 className="timer-strip-label">{label}</h2>
        {!embedded && (
          <button
            type="button"
            className="secondary-button"
            onClick={onBackToBuild}
          >
            Back to build
          </button>
        )}
      </header>
      <div className="timer-display">
        {isComplete ? (
          <p className="timer-time timer-finish">Done</p>
        ) : showingFinish ? (
          <p className="timer-time timer-finish">Finish</p>
        ) : (
          <p className="timer-time">{displayTime}</p>
        )}
      </div>
      {isWork && (isForTime || isDeathBy) && !showingFinish && (
        <div className="timer-actions">
          <button
            type="button"
            className="primary-button timer-stop-button"
            onClick={isDeathBy ? handleDeathByStop : handleForTimeStop}
          >
            Stop
          </button>
        </div>
      )}
      <button
        type="button"
        className="secondary-button"
        onClick={onStopTimer}
      >
        {embedded ? 'Exit timer' : 'Back to board'}
      </button>
    </>
  )

  if (embedded) {
    return <section className="timer-strip">{timerContent}</section>
  }

  return (
    <main className="board-shell timer-view">
      {timerContent}
    </main>
  )
}
