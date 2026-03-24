import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { Workout } from '../../types/workout.ts'
import { getTimerStructure } from '../../services/timer-generator.ts'
import { formatSecondsAsClock } from '../../services/workout-domain.ts'
import { cn } from '../../ui/cn.ts'
import * as tw from '../../ui/tw.ts'

function TimerPauseIcon() {
  return (
    <svg
      className="h-8 w-8 shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  )
}

function TimerPlayIcon() {
  return (
    <svg
      className="h-8 w-8 shrink-0 pl-0.5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function TimerStopIcon() {
  return (
    <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 6h12v12H6V6z" />
    </svg>
  )
}

function TimerRestartIcon() {
  return (
    <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.65 6.35A7.95 7.95 0 0 0 12 4C7.58 4 4.01 7.58 4.01 12S7.58 20 12 20c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  )
}

const TIMER_VIEWBOX_SIZE = 120
const TIMER_STROKE_WIDTH = 8
const TIMER_RADIUS = (TIMER_VIEWBOX_SIZE - TIMER_STROKE_WIDTH) / 2
const FULL_CIRCLE_DEGREES = 359.999
const EPSILON = 0.0001

type TimerRingSegment =
  | { type: 'none' }
  | { type: 'full' }
  | { type: 'arc'; startAngle: number; sweepAngle: number }

function clamp01(value: number): number {
  if (value <= 0) return 0
  if (value >= 1) return 1
  return value
}

function polarToCartesian(angleDegrees: number) {
  const radians = ((angleDegrees - 90) * Math.PI) / 180
  const center = TIMER_VIEWBOX_SIZE / 2
  return {
    x: center + TIMER_RADIUS * Math.cos(radians),
    y: center + TIMER_RADIUS * Math.sin(radians),
  }
}

function describeArc(startAngle: number, sweepAngle: number): string {
  const safeSweep = Math.min(Math.max(sweepAngle, 0), FULL_CIRCLE_DEGREES)
  const start = polarToCartesian(startAngle)
  const end = polarToCartesian(startAngle + safeSweep)
  const largeArcFlag = safeSweep > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${TIMER_RADIUS} ${TIMER_RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
}

function getCountdownRing(totalSeconds: number, remainingSeconds: number, tickProgress: number): TimerRingSegment {
  if (totalSeconds <= 0) return { type: 'none' }
  const animatedRemaining = Math.max(remainingSeconds - tickProgress, 0)
  const completion = clamp01((totalSeconds - animatedRemaining) / totalSeconds)
  if (completion <= EPSILON) return { type: 'none' }
  if (completion >= 1 - EPSILON) return { type: 'full' }
  return { type: 'arc', startAngle: 0, sweepAngle: FULL_CIRCLE_DEGREES * completion }
}

function getStopwatchRing(elapsedSeconds: number, tickProgress: number): TimerRingSegment {
  const animatedElapsed = Math.max(elapsedSeconds + tickProgress, 0)
  const cycleNumber = Math.floor(animatedElapsed)
  const cycleProgress = animatedElapsed - cycleNumber
  const isFillCycle = cycleNumber % 2 === 0

  if (isFillCycle) {
    if (cycleProgress <= EPSILON) return { type: 'none' }
    return { type: 'arc', startAngle: 0, sweepAngle: FULL_CIRCLE_DEGREES * cycleProgress }
  }

  const remainingSweep = 1 - cycleProgress
  if (remainingSweep <= EPSILON) return { type: 'none' }
  if (remainingSweep >= 1 - EPSILON) return { type: 'full' }
  return {
    type: 'arc',
    startAngle: FULL_CIRCLE_DEGREES * cycleProgress,
    sweepAngle: FULL_CIRCLE_DEGREES * remainingSweep,
  }
}

type TimerCircleProps = {
  displayText: string
  valueClassName: string
  roundText: string | null
  embedded: boolean
  progressToneClassName: string
  ring: TimerRingSegment
}

function TimerCircle({
  displayText,
  valueClassName,
  roundText,
  embedded,
  progressToneClassName,
  ring,
}: TimerCircleProps) {
  const center = TIMER_VIEWBOX_SIZE / 2
  const progressArcPath =
    ring.type === 'arc' ? describeArc(ring.startAngle, ring.sweepAngle) : null

  return (
    <div className={cn(tw.timerCircle, embedded && tw.timerCircleEmbedded)}>
      <svg
        className={tw.timerCircleSvg}
        viewBox={`0 0 ${TIMER_VIEWBOX_SIZE} ${TIMER_VIEWBOX_SIZE}`}
        aria-hidden
      >
        <circle
          className={tw.timerCircleTrack}
          cx={center}
          cy={center}
          r={TIMER_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={TIMER_STROKE_WIDTH}
        />
        {ring.type === 'full' ? (
          <circle
            className={progressToneClassName}
            cx={center}
            cy={center}
            r={TIMER_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={TIMER_STROKE_WIDTH}
            strokeLinecap="round"
          />
        ) : progressArcPath ? (
          <path
            className={progressToneClassName}
            d={progressArcPath}
            fill="none"
            stroke="currentColor"
            strokeWidth={TIMER_STROKE_WIDTH}
            strokeLinecap="round"
          />
        ) : null}
      </svg>
      <div className={cn(tw.timerCircleInner, embedded && tw.timerCircleInnerEmbedded)}>
        {roundText ? <p className={tw.timerRoundLine}>{roundText}</p> : null}
        <p className={valueClassName}>{displayText}</p>
      </div>
    </div>
  )
}

export type TimerPhaseInfo = { phaseType: 'work' | 'rest'; segmentId: string }

export type WorkoutTimerHandle = {
  /** Completes the current user-action phase (For Time / Chipper / Death by). */
  performDone: () => void
}

type WorkoutTimerProps = {
  workout: Workout
  onStopTimer: () => void
  onBackToBuild: () => void
  /** When true, render as a compact strip (timer above board). */
  embedded?: boolean
  /** Called when the current phase changes; `null` when workout is complete (dock neutral). */
  onPhaseChange?: (info: TimerPhaseInfo | null) => void
  /**
   * Embedded only: segment ids whose timer phases are fully in the past (gray on board).
   */
  onCompletedSegmentsChange?: (segmentIds: Set<string>) => void
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
  /** 1-based round within segment (EMOM, Tabata work). */
  roundNumber?: number
  totalRounds?: number
}

type RestPhase = {
  type: 'rest'
  restSeconds: number
  /** Segment id that this rest follows (for board highlighting). */
  afterSegmentId: string
  /** Tabata intra-round rest: show same round as preceding work. */
  roundNumber?: number
  totalRounds?: number
  isTabataIntraRest?: boolean
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
          roundNumber: r + 1,
          totalRounds: rounds,
        })
      }
      const restMinutes = workoutSegment.restInterval ?? 0
      const restSeconds = Math.round(restMinutes * 60)
      if (restSeconds > 0) {
        phases.push({ type: 'rest', restSeconds, afterSegmentId: seg.segmentId })
      }
      continue
    }

    // Death by: one work phase, 60s per round, repeat until user taps Done
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
          roundNumber: r + 1,
          totalRounds: rounds,
        })
        phases.push({
          type: 'rest',
          restSeconds: restSec,
          afterSegmentId: seg.segmentId,
          roundNumber: r + 1,
          totalRounds: rounds,
          isTabataIntraRest: true,
        })
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

/** Latest phase index that belongs to each segment (work or rest tied to that segment). */
function lastPhaseIndexBySegment(phases: TimerPhase[]): Map<string, number> {
  const map = new Map<string, number>()
  phases.forEach((p, i) => {
    const id = p.type === 'work' ? p.segmentId : p.afterSegmentId
    const prev = map.get(id) ?? -1
    if (i > prev) map.set(id, i)
  })
  return map
}

function getInitialCounter(phase: TimerPhase | undefined): { remaining: number; elapsed: number } {
  if (!phase) return { remaining: 0, elapsed: 0 }
  if (phase.type === 'rest') return { remaining: phase.restSeconds, elapsed: 0 }
  if (phase.isForTime) return { remaining: 0, elapsed: 0 }
  return { remaining: phase.durationSeconds ?? 0, elapsed: 0 }
}

function roundLineText(
  phase: TimerPhase | undefined,
  deathByRound: number,
): string | null {
  if (!phase) return null
  if (phase.type === 'work' && phase.isDeathBy) {
    return `Round ${deathByRound}`
  }
  if (phase.type === 'work' && phase.roundNumber != null && phase.totalRounds != null) {
    return `Round ${phase.roundNumber} / ${phase.totalRounds}`
  }
  if (
    phase.type === 'rest' &&
    phase.isTabataIntraRest &&
    phase.roundNumber != null &&
    phase.totalRounds != null
  ) {
    return `Round ${phase.roundNumber} / ${phase.totalRounds} · Rest`
  }
  return null
}

export const WorkoutTimer = forwardRef<WorkoutTimerHandle, WorkoutTimerProps>(
  function WorkoutTimer(
    {
      workout,
      onStopTimer,
      onBackToBuild,
      embedded = false,
      onPhaseChange,
      onCompletedSegmentsChange,
    },
    ref,
  ) {
  const phases = useMemo(() => buildPhases(workout), [workout])
  const firstCounter = useMemo(() => getInitialCounter(phases[0]), [phases])
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(() => firstCounter.remaining)
  const [elapsedSeconds, setElapsedSeconds] = useState(() => firstCounter.elapsed)
  const [showingFinish, setShowingFinish] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [deathByRound, setDeathByRound] = useState(1)
  const [animationNow, setAnimationNow] = useState(0)
  const [tickStartedAtMs, setTickStartedAtMs] = useState(0)
  const phaseIndexRef = useRef(phaseIndex)
  const remainingSecondsRef = useRef(remainingSeconds)
  const elapsedSecondsRef = useRef(elapsedSeconds)

  useEffect(() => {
    phaseIndexRef.current = phaseIndex
  }, [phaseIndex])
  useEffect(() => {
    remainingSecondsRef.current = remainingSeconds
  }, [remainingSeconds])
  useEffect(() => {
    elapsedSecondsRef.current = elapsedSeconds
  }, [elapsedSeconds])

  const currentPhase = phases[phaseIndex]
  const isComplete = phaseIndex >= phases.length

  useEffect(() => {
    if (!currentPhase || showingFinish || isPaused || isComplete) return

    let frameId = 0
    const update = () => {
      setAnimationNow(performance.now())
      frameId = requestAnimationFrame(update)
    }

    frameId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frameId)
  }, [currentPhase, showingFinish, isPaused, isComplete])

  // Notify parent of current phase (dock tint); clear when complete
  useEffect(() => {
    if (!onPhaseChange) return
    if (isComplete || !currentPhase) {
      onPhaseChange(null)
      return
    }
    if (currentPhase.type === 'work') {
      onPhaseChange({ phaseType: 'work', segmentId: currentPhase.segmentId })
    } else {
      onPhaseChange({ phaseType: 'rest', segmentId: currentPhase.afterSegmentId })
    }
  }, [phaseIndex, currentPhase, onPhaseChange, isComplete])

  // When phase index changes, initialize counter for the new phase (no "Not set")
  useEffect(() => {
    const p = phases[phaseIndex]
    if (!p) return
    const { remaining, elapsed } = getInitialCounter(p)
    /* eslint-disable react-hooks/set-state-in-effect -- phase transitions intentionally reset timer state */
    setRemainingSeconds(remaining)
    setElapsedSeconds(elapsed)
    setShowingFinish(false)
    if (p.type === 'work' && p.isDeathBy) {
      setDeathByRound(1)
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    remainingSecondsRef.current = remaining
    elapsedSecondsRef.current = elapsed
    setTickStartedAtMs(performance.now())
  }, [phaseIndex, phases])

  // Single interval: paused = no tick; showingFinish = no tick
  useEffect(() => {
    if (!currentPhase || showingFinish || isPaused || isComplete) return

    const intervalId = setInterval(() => {
      const idx = phaseIndexRef.current
      const phase = phases[idx]
      if (!phase) return

      const applyNextPhase = () => {
        const nextIdx = idx + 1
        const nextPhase = phases[nextIdx]
        const { remaining, elapsed } = getInitialCounter(nextPhase)
        setTickStartedAtMs(performance.now())
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
        setTickStartedAtMs(performance.now())
        remainingSecondsRef.current = next
        setRemainingSeconds(next)
        return
      }

      if (phase.isForTime) {
        const cap = phase.timeCapSeconds ?? 0
        const e = elapsedSecondsRef.current
        const next = e + 1
        setTickStartedAtMs(performance.now())
        elapsedSecondsRef.current = next
        setElapsedSeconds(next)
        if (cap > 0 && next >= cap) setShowingFinish(true)
        return
      }

      // Death by: 1:00 countdown per round; when 0, reset to 60 (next round)
      if (phase.isDeathBy) {
        const r = remainingSecondsRef.current
        if (r <= 1) {
          setTickStartedAtMs(performance.now())
          remainingSecondsRef.current = 60
          setRemainingSeconds(60)
          setDeathByRound((n) => n + 1)
          return
        }
        const next = r - 1
        setTickStartedAtMs(performance.now())
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
      setTickStartedAtMs(performance.now())
      remainingSecondsRef.current = next
      setRemainingSeconds(next)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [phaseIndex, phases, currentPhase, showingFinish, isPaused, isComplete])

  // After showing "Finish", advance to next phase or complete
  useEffect(() => {
    if (!showingFinish) return
    const timeoutId = setTimeout(() => {
      setShowingFinish(false)
      setPhaseIndex((i) => i + 1)
    }, FINISH_DISPLAY_MS)
    return () => clearTimeout(timeoutId)
  }, [showingFinish])

  function handleDoneForTimeOrChipper() {
    setShowingFinish(true)
  }

  function handleDoneForDeathBy() {
    const nextIdx = phaseIndex + 1
    const nextPhase = phases[nextIdx]
    const { remaining, elapsed } = getInitialCounter(nextPhase)
    setPhaseIndex((i) => i + 1)
    setRemainingSeconds(remaining)
    setElapsedSeconds(elapsed)
    remainingSecondsRef.current = remaining
    elapsedSecondsRef.current = elapsed
  }

  function handleTogglePaused() {
    if (isPaused) {
      setTickStartedAtMs(performance.now())
    }
    setIsPaused((paused) => !paused)
  }

  useImperativeHandle(
    ref,
    () => ({
      performDone: () => {
        const idx = phaseIndexRef.current
        const p = phases[idx]
        if (!p || p.type !== 'work') return
        if (p.isDeathBy) {
          const nextIdx = idx + 1
          const nextPhase = phases[nextIdx]
          const { remaining, elapsed } = getInitialCounter(nextPhase)
          setPhaseIndex((i) => i + 1)
          setRemainingSeconds(remaining)
          setElapsedSeconds(elapsed)
          remainingSecondsRef.current = remaining
          elapsedSecondsRef.current = elapsed
        } else if (p.isForTime) {
          setShowingFinish(true)
        }
      },
    }),
    [phases],
  )

  const isUserCompleteWorkPhase =
    !isComplete &&
    currentPhase?.type === 'work' &&
    ((currentPhase.isForTime === true) || (currentPhase.isDeathBy === true))

  const showDoneButton = isUserCompleteWorkPhase && !showingFinish

  useEffect(() => {
    if (!embedded || !onCompletedSegmentsChange) return
    const lastBySeg = lastPhaseIndexBySegment(phases)
    const completed = new Set<string>()
    if (phaseIndex >= phases.length) {
      lastBySeg.forEach((_lastIdx, id) => completed.add(id))
    } else {
      lastBySeg.forEach((lastIdx, id) => {
        if (phaseIndex > lastIdx) completed.add(id)
      })
    }
    onCompletedSegmentsChange(completed)
  }, [embedded, onCompletedSegmentsChange, phaseIndex, phases])

  useEffect(() => {
    if (!embedded || !onCompletedSegmentsChange) return
    return () => onCompletedSegmentsChange(new Set())
  }, [embedded, onCompletedSegmentsChange])

  if (phases.length === 0) {
    return (
      <main className={tw.boardShell}>
        <p className={tw.mutedText}>No time-measurable segments.</p>
        <footer className={tw.timerBottomBar}>
          <button type="button" className={cn(tw.primaryButton, tw.timerBarButton)} onClick={onStopTimer}>
            Back to board
          </button>
        </footer>
      </main>
    )
  }

  if (isComplete && !embedded) {
    return (
      <main className={tw.boardShell}>
        <h2 className={tw.boardTitle}>Workout complete</h2>
        <footer className={tw.timerBottomBar}>
          <button type="button" className={cn(tw.secondaryButton, tw.timerBarButton)} onClick={onBackToBuild}>
            Back to build
          </button>
          <button type="button" className={cn(tw.primaryButton, tw.timerBarButton)} onClick={onStopTimer}>
            Back to board
          </button>
        </footer>
      </main>
    )
  }

  const phase = isComplete ? null : currentPhase!
  const isWork = phase?.type === 'work'
  const isRest = phase?.type === 'rest'
  const isForTime = isWork && phase?.isForTime
  const isDeathBy = isWork && phase?.isDeathBy

  const dockTinted = Boolean(embedded && !isComplete)

  const embeddedDockLabelClass =
    isComplete
      ? tw.timerDockLabelComplete
      : isRest
        ? tw.timerDockLabelRest
        : tw.timerDockLabelWork

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
  const roundText = roundLineText(currentPhase, deathByRound)
  const timerTextClassName =
    isComplete || showingFinish
      ? cn(tw.timerTimeLarge, tw.timerFinish)
      : cn(
          tw.timerTimeLarge,
          dockTinted && isWork && tw.timerDockTimeWork,
          dockTinted && isRest && tw.timerDockTimeRest,
          (!dockTinted || (!isWork && !isRest)) && tw.timerTimeLargeInk,
        )

  const timerDisplayText = isComplete ? 'Done' : showingFinish ? 'Finish' : displayTime
  const tickProgress =
    currentPhase && !showingFinish && !isPaused && !isComplete
      ? clamp01((animationNow - tickStartedAtMs) / 1000)
      : 0
  const totalCountdownSeconds = currentPhase
    ? currentPhase.type === 'rest'
      ? currentPhase.restSeconds
      : currentPhase.isForTime
        ? 0
        : (currentPhase.durationSeconds ?? 0)
    : 0
  const timerRing =
    isComplete || showingFinish
      ? ({ type: 'full' } satisfies TimerRingSegment)
      : isForTime
        ? getStopwatchRing(elapsedSeconds, tickProgress)
        : getCountdownRing(totalCountdownSeconds, remainingSeconds, tickProgress)
  const progressToneClassName =
    isComplete || showingFinish
      ? tw.timerCircleProgressComplete
      : isRest
        ? tw.timerCircleProgressRest
        : tw.timerCircleProgressWork

  const footerBarClass = embedded ? tw.timerBottomBarDocked : tw.timerBottomBar

  const hideStripHeaderForEmbeddedUserComplete =
    embedded && isUserCompleteWorkPhase && !isComplete

  const timerHeaderAndDisplay = hideStripHeaderForEmbeddedUserComplete ? (
    showingFinish ? (
      <TimerCircle
        displayText={timerDisplayText}
        valueClassName={timerTextClassName}
        roundText={roundText}
        embedded={embedded}
        progressToneClassName={progressToneClassName}
        ring={timerRing}
      />
    ) : (
      <div className={tw.timerEmbeddedUserCompleteStack}>
        <TimerCircle
          displayText={timerDisplayText}
          valueClassName={timerTextClassName}
          roundText={roundText}
          embedded={embedded}
          progressToneClassName={progressToneClassName}
          ring={timerRing}
        />
        <button
          type="button"
          className={tw.timerEmbeddedCompleteButton}
          onClick={isDeathBy ? handleDoneForDeathBy : handleDoneForTimeOrChipper}
          aria-label="Complete segment"
        >
          Complete
        </button>
      </div>
    )
  ) : (
    <>
      <header className={embedded ? tw.timerStripHeaderDocked : tw.timerStripHeader}>
        <h2 className={embedded ? embeddedDockLabelClass : isRest ? tw.timerStripLabelRest : tw.timerStripLabelWork}>
          {label}
        </h2>
        {!embedded && (
          <button type="button" className={tw.secondaryButton} onClick={onBackToBuild}>
            Back to build
          </button>
        )}
      </header>
      <TimerCircle
        displayText={timerDisplayText}
        valueClassName={timerTextClassName}
        roundText={roundText}
        embedded={embedded}
        progressToneClassName={progressToneClassName}
        ring={timerRing}
      />
    </>
  )

  const controlFooter = !isComplete ? (
    <footer className={footerBarClass}>
      <div className={tw.timerBarSplitRow}>
        <button
          type="button"
          className={tw.timerBarSplitButton}
          disabled={showingFinish}
          onClick={handleTogglePaused}
          aria-label={isPaused ? 'Play' : 'Pause'}
        >
          {isPaused ? <TimerPlayIcon /> : <TimerPauseIcon />}
          <span className={tw.timerBarSplitCaption}>
            {isPaused ? 'Play' : 'Pause'}
          </span>
        </button>
        <button
          type="button"
          className={tw.timerBarSplitButton}
          onClick={onStopTimer}
          aria-label="Stop sequence"
        >
          <TimerStopIcon />
          <span className={tw.timerBarSplitCaption}>Stop sequence</span>
        </button>
      </div>
      {!embedded && showDoneButton ? (
        <button
          type="button"
          className={cn(tw.primaryButton, tw.timerBarButton, 'w-full')}
          onClick={isDeathBy ? handleDoneForDeathBy : handleDoneForTimeOrChipper}
        >
          Done
        </button>
      ) : null}
    </footer>
  ) : embedded ? (
    <footer className={footerBarClass}>
      <button
        type="button"
        className={
          embedded ? tw.timerBarRestartButtonEmbedded : tw.timerBarRestartButton
        }
        onClick={onStopTimer}
        aria-label="Restart workout"
      >
        <TimerRestartIcon />
        <span
          className={
            embedded ? tw.timerBarRestartCaptionEmbedded : tw.timerBarRestartCaption
          }
        >
          Restart workout
        </span>
      </button>
    </footer>
  ) : null

  if (embedded) {
    return (
      <div className={tw.boardTimerDockInner}>
        <div className={tw.boardTimerDockDisplay}>{timerHeaderAndDisplay}</div>
        <div className={tw.boardTimerDockActions}>{controlFooter}</div>
      </div>
    )
  }

  return (
    <main className={cn(tw.boardShell, tw.timerView)}>
      <section className={tw.timerStrip}>
        {timerHeaderAndDisplay}
        {controlFooter}
      </section>
    </main>
  )
})

WorkoutTimer.displayName = 'WorkoutTimer'
