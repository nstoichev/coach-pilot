import { useState, useCallback } from 'react'
import type { Workout } from '../../types/workout.ts'
import {
  getBoardSegmentTitle,
  getBoardExerciseLine,
  getBoardRepSequenceSummary,
  getBoardRestLine,
  isWorkoutTimeMeasurable,
} from '../../services/workout-board-format.ts'
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

  return (
    <main className="board-shell">
      <header className="board-header">
        <div className="board-header-title-block">
          <h1 className="board-title" title={boardWorkoutTitle}>
            {boardWorkoutTitle}
          </h1>
        </div>
        <div className="board-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onBackToBuild}
          >
            Back to build
          </button>
          {timeMeasurable && !timerRunning && (
            <button
              type="button"
              className="primary-button"
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

      <section className="board-content">
        {workout.segments.map((segment, index) => {
          const isLastSegment = index === workout.segments.length - 1
          const repSeqSummary = getBoardRepSequenceSummary(segment)
          return (
            <div key={segment.id} className="board-segment-wrapper">
              <div
                className={`board-segment${currentPhase?.phaseType === 'work' && currentPhase.segmentId === segment.id ? ' board-segment-active' : ''}`}
              >
                <h2 className="board-segment-title">
                  {getBoardSegmentTitle(segment)}
                </h2>
                {repSeqSummary ? (
                  <p className="board-rep-sequence-line">{repSeqSummary}</p>
                ) : null}
                <ul
                  className={`board-exercise-list${repSeqSummary ? ' board-exercise-list--rep-sequence' : ''}`}
                >
                  {segment.exercises.map((assigned) => (
                    <li key={assigned.id} className="board-exercise-line">
                      {getBoardExerciseLine(assigned, segment)}
                    </li>
                  ))}
                </ul>
              </div>
              {!isLastSegment && getBoardRestLine(segment) && (
                <div
                  className={`board-rest-separator${currentPhase?.phaseType === 'rest' && currentPhase.segmentId === segment.id ? ' board-rest-separator-active' : ''}`}
                  aria-label="Rest period"
                >
                  {getBoardRestLine(segment)}
                </div>
              )}
            </div>
          )
        })}
      </section>
    </main>
  )
}
