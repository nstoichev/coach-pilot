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
  const timeMeasurable = isWorkoutTimeMeasurable(workout)

  const handlePhaseChange = useCallback((info: TimerPhaseInfo) => {
    setCurrentPhase(info)
  }, [])

  const boardWorkoutTitle = workout.name.trim() || 'Untitled workout'
  const requiredEquipment = getWorkoutRequiredEquipment(workout)

  return (
    <main className={tw.boardShell}>
      <header className={tw.boardHeader}>
        <div className={tw.boardHeaderTitleBlock}>
          <h1 className={tw.boardTitle} title={boardWorkoutTitle}>
            {boardWorkoutTitle}
          </h1>
        </div>
        <div className={tw.boardActions}>
          <button
            type="button"
            className={tw.secondaryButton}
            onClick={onBackToBuild}
          >
            Back to build
          </button>
          {timeMeasurable && !timerRunning && (
            <button
              type="button"
              className={tw.primaryButton}
              onClick={() => setTimerRunning(true)}
            >
              Start
            </button>
          )}
        </div>
      </header>

      {timerRunning && (
        <WorkoutTimer
          workout={workout}
          embedded
          onStopTimer={() => {
            setTimerRunning(false)
            setCurrentPhase(null)
          }}
          onBackToBuild={onBackToBuild}
          onPhaseChange={handlePhaseChange}
        />
      )}

      <section className={tw.boardContent}>
        {workout.segments.map((segment, index) => {
          const isLastSegment = index === workout.segments.length - 1
          const repSeqSummary = getBoardRepSequenceSummary(segment)
          const workHighlight =
            currentPhase?.phaseType === 'work' && currentPhase.segmentId === segment.id
          const restHighlight =
            currentPhase?.phaseType === 'rest' && currentPhase.segmentId === segment.id
          return (
            <div key={segment.id} className={tw.boardSegmentWrapper}>
              <div
                className={cn(tw.boardSegment, workHighlight && tw.boardSegmentActive)}
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
                <div
                  className={cn(
                    tw.boardRestSeparator,
                    restHighlight && tw.boardRestSeparatorActive,
                  )}
                  aria-label="Rest period"
                >
                  {getBoardRestLine(segment)}
                </div>
              )}
            </div>
          )
        })}
      </section>

      {requiredEquipment.length > 0 ? (
        <section className={tw.boardEquipmentSection} aria-label="Equipment required">
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
    </main>
  )
}
