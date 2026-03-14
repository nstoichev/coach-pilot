import { useEffect, useRef, useState } from 'react'
import type { Workout } from '../../types/workout.ts'
import { getTimerStructure } from '../../services/timer-generator.ts'
import type { TimerSegmentInfo } from '../../services/timer-generator.ts'
import { formatSecondsAsClock } from '../../services/workout-domain.ts'

type WorkoutTimerProps = {
  workout: Workout
  onStopTimer: () => void
  onBackToBuild: () => void
}

type Phase = 'segment' | 'rest'

export function WorkoutTimer({ workout, onStopTimer, onBackToBuild }: WorkoutTimerProps) {
  const structure = getTimerStructure(workout)
  const segments = structure.segments.filter(
    (s) => s.durationSeconds != null || s.timeCapSeconds != null,
  )

  const [segmentIndex, setSegmentIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('segment')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [restRemaining, setRestRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentSegment: TimerSegmentInfo | undefined = segments[segmentIndex]
  const isForTime = currentSegment?.segmentType === 'forTime'
  const isResting = phase === 'rest'

  useEffect(() => {
    if (!isRunning || segments.length === 0) return

    tickRef.current = setInterval(() => {
      if (isResting) {
        setRestRemaining((r) => {
          if (r <= 1) {
            setPhase('segment')
            setSegmentIndex((i) => i + 1)
            setElapsedSeconds(0)
            return 0
          }
          return r - 1
        })
        return
      }

      if (isForTime) {
        setElapsedSeconds((e) => e + 1)
        return
      }

      const duration = currentSegment?.durationSeconds ?? 0
      setElapsedSeconds((e) => {
        const next = e + 1
        if (next >= duration) {
          advanceToRestOrNext()
          return 0
        }
        return next
      })
    }, 1000)

    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [isRunning, segmentIndex, phase, isForTime, isResting, segments.length])

  function advanceToRestOrNext() {
    const current = segments[segmentIndex]
    const workoutSegment = current
      ? workout.segments.find((s) => s.id === current.segmentId)
      : undefined
    const restMinutes = workoutSegment?.restInterval ?? 0
    const restSeconds = Math.round(restMinutes * 60)
    if (restSeconds > 0) {
      setPhase('rest')
      setRestRemaining(restSeconds)
    } else {
      setSegmentIndex((i) => i + 1)
      setElapsedSeconds(0)
    }
  }

  function handleForTimeStop() {
    setIsRunning(false)
    advanceToRestOrNext()
    setIsRunning(true)
  }

  if (segments.length === 0) {
    return (
      <main className="board-shell">
        <p className="muted-text">No time-measurable segments.</p>
        <button type="button" className="primary-button" onClick={onStopTimer}>
          Back to board
        </button>
      </main>
    )
  }

  if (segmentIndex >= segments.length) {
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

  const duration = currentSegment?.durationSeconds
  const timeCap = currentSegment?.timeCapSeconds
  const displayTime = isResting
    ? formatSecondsAsClock(restRemaining)
    : isForTime
      ? formatSecondsAsClock(elapsedSeconds)
      : duration != null
        ? `${formatSecondsAsClock(elapsedSeconds)} / ${formatSecondsAsClock(duration)}`
        : '—'

  return (
    <main className="board-shell timer-view">
      <header className="board-header">
        <h1 className="board-title">{currentSegment?.segmentName ?? 'Segment'}</h1>
        <button
          type="button"
          className="secondary-button"
          onClick={onBackToBuild}
        >
          Back to build
        </button>
      </header>

      <div className="timer-display">
        {isResting ? (
          <p className="timer-rest-label">Rest: {displayTime}</p>
        ) : (
          <p className="timer-time">{displayTime}</p>
        )}
      </div>

      {isForTime && !isResting && (
        <div className="timer-actions">
          <button
            type="button"
            className="primary-button timer-stop-button"
            onClick={handleForTimeStop}
          >
            Stop
          </button>
          {timeCap != null && elapsedSeconds >= timeCap && (
            <p className="muted-text">Time cap reached.</p>
          )}
        </div>
      )}

      <button
        type="button"
        className="secondary-button"
        onClick={onStopTimer}
      >
        Exit timer
      </button>
    </main>
  )
}
