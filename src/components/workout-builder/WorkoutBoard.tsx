import { useState } from 'react'
import type { Workout } from '../../types/workout.ts'
import {
  getBoardSegmentTitle,
  getBoardExerciseLine,
  getBoardRestLine,
  isWorkoutTimeMeasurable,
} from '../../services/workout-board-format.ts'
import { WorkoutTimer } from './WorkoutTimer.tsx'

type WorkoutBoardProps = {
  workout: Workout
  onBackToBuild: () => void
}

export function WorkoutBoard({ workout, onBackToBuild }: WorkoutBoardProps) {
  const [timerRunning, setTimerRunning] = useState(false)
  const timeMeasurable = isWorkoutTimeMeasurable(workout)

  if (timerRunning) {
    return (
      <WorkoutTimer
        workout={workout}
        onStopTimer={() => setTimerRunning(false)}
        onBackToBuild={onBackToBuild}
      />
    )
  }

  return (
    <main className="board-shell">
      <header className="board-header">
        <h1 className="board-title">{workout.name}</h1>
        <div className="board-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onBackToBuild}
          >
            Back to build
          </button>
          {timeMeasurable && (
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

      <section className="board-content">
        {workout.segments.map((segment) => (
          <div key={segment.id} className="board-segment-wrapper">
            <div className="board-segment">
              <h2 className="board-segment-title">
                {getBoardSegmentTitle(segment)}
              </h2>
              <ul className="board-exercise-list">
                {segment.exercises.map((assigned) => (
                  <li key={assigned.id} className="board-exercise-line">
                    {getBoardExerciseLine(assigned)}
                  </li>
                ))}
              </ul>
            </div>
            {getBoardRestLine(segment) && (
              <div className="board-rest-separator" aria-label="Rest period">
                {getBoardRestLine(segment)}
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  )
}
