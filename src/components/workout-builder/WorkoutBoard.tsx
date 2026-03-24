import { useState, useCallback } from 'react'
import type { Workout } from '../../types/workout.ts'
import {
  getBoardSegmentTitle,
  getBoardExerciseLine,
  getBoardRepSequenceSummary,
  getBoardRestLine,
  isWorkoutTimeMeasurable,
} from '../../services/workout-board-format.ts'
import { getWorkoutRequiredEquipment } from '../../services/workout-equipment.ts'
import { cn } from '../../ui/cn.ts'
import * as tw from '../../ui/tw.ts'
import { WorkoutTimer, type TimerPhaseInfo } from './WorkoutTimer.tsx'

type WorkoutBoardProps = {
  workout: Workout
  onBackToBuild: () => void
}

export function WorkoutBoard({ workout, onBackToBuild }: WorkoutBoardProps) {
  const [timerRunning, setTimerRunning] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<TimerPhaseInfo | null>(null)
  const [completedSegmentIds, setCompletedSegmentIds] = useState(() => new Set<string>())
  const timeMeasurable = isWorkoutTimeMeasurable(workout)

  const handlePhaseChange = useCallback((info: TimerPhaseInfo | null) => {
    setCurrentPhase(info)
  }, [])

  const handleCompletedSegmentsChange = useCallback((ids: Set<string>) => {
    setCompletedSegmentIds(new Set(ids))
  }, [])

  const stopTimer = useCallback(() => {
    setTimerRunning(false)
    setCurrentPhase(null)
    setCompletedSegmentIds(new Set())
  }, [])

  const boardWorkoutTitle = workout.name.trim() || 'Untitled workout'
  const requiredEquipment = getWorkoutRequiredEquipment(workout)
  const showStartBar = timeMeasurable && !timerRunning

  return (
    <main
      className={cn(
        tw.boardMainLayout,
        'w-full',
        timerRunning && tw.boardMainWithTimerDock,
        showStartBar && tw.boardMainWithTimerStart,
      )}
    >
      <header className={cn(tw.boardHeader, tw.boardOrderHeader)}>
        <div className={tw.boardHeaderTitleBlock}>
          <h1 className={tw.boardTitle} title={boardWorkoutTitle}>
            {boardWorkoutTitle}
          </h1>
        </div>
        <div className={tw.boardActions}>
          <button
            type="button"
            className={tw.outlineActionButton}
            onClick={onBackToBuild}
          >
            Back to build
          </button>
        </div>
      </header>

      <section className={tw.boardContent}>
        {workout.segments.map((segment, index) => {
          const isLastSegment = index === workout.segments.length - 1
          const repSeqSummary = getBoardRepSequenceSummary(segment)
          const workHighlight =
            currentPhase?.phaseType === 'work' && currentPhase.segmentId === segment.id
          const restHighlight =
            currentPhase?.phaseType === 'rest' && currentPhase.segmentId === segment.id
          const segmentCompleted =
            timerRunning &&
            completedSegmentIds.has(segment.id) &&
            !workHighlight &&
            !restHighlight
          return (
            <div key={segment.id} className={tw.boardSegmentWrapper}>
              <div
                className={cn(
                  tw.boardSegment,
                  segmentCompleted && tw.boardSegmentCompleted,
                )}
              >
                <h2 className={tw.boardSegmentTitle}>
                  {getBoardSegmentTitle(segment)}
                </h2>
                {repSeqSummary ? (
                  <p className={tw.boardRepSequenceLine}>{repSeqSummary}</p>
                ) : null}
                <ul className={tw.boardExerciseList}>
                  {segment.exercises.map((assigned) => (
                    <li
                      key={assigned.id}
                      className={
                        repSeqSummary ? tw.boardExerciseLineWithRepBullet : tw.boardExerciseLine
                      }
                    >
                      {getBoardExerciseLine(assigned, segment)}
                    </li>
                  ))}
                </ul>
              </div>
              {!isLastSegment && getBoardRestLine(segment) && (
                <div className={tw.boardRestSeparator} aria-label="Rest period">
                  {getBoardRestLine(segment)}
                </div>
              )}
            </div>
          )
        })}
      </section>

      {!timerRunning && requiredEquipment.length > 0 ? (
        <section
          className={cn(tw.boardEquipmentSection, tw.boardOrderEquipment)}
          aria-label="Equipment required"
        >
          <h2 className={tw.boardEquipmentTitle}>Equipment required</h2>
          <ul className={tw.boardEquipmentList}>
            {requiredEquipment.map((item) => (
              <li key={item} className={tw.boardEquipmentItem}>
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {showStartBar ? (
        <footer className={tw.boardTimerStartBar} aria-label="Start workout">
          <div className={tw.boardTimerStartStack}>
            <button
              type="button"
              className={tw.boardTimerStartButton}
              onClick={() => setTimerRunning(true)}
            >
              Start
            </button>
          </div>
        </footer>
      ) : null}

      {timerRunning ? (
        <div
          className={cn(
            tw.boardTimerDock,
            currentPhase === null
              ? tw.boardTimerDockPhaseNeutral
              : currentPhase.phaseType === 'work'
                ? tw.boardTimerDockPhaseWork
                : tw.boardTimerDockPhaseRest,
          )}
        >
          <WorkoutTimer
            workout={workout}
            embedded
            onStopTimer={stopTimer}
            onBackToBuild={onBackToBuild}
            onPhaseChange={handlePhaseChange}
            onCompletedSegmentsChange={handleCompletedSegmentsChange}
          />
        </div>
      ) : null}
    </main>
  )
}
