import './App.css'
import { useWorkoutBuilder } from './store/index.ts'
import { WorkoutBuilder } from './components/workout-builder/index.ts'
import { WorkoutBoard } from './components/workout-builder/WorkoutBoard.tsx'

function App() {
  const { state, actions } = useWorkoutBuilder()

  if (state.showWorkoutBoard && state.workoutBoardSnapshot) {
    return (
      <div className="page-shell">
        <WorkoutBoard
          workout={state.workoutBoardSnapshot}
          onBackToBuild={actions.hideWorkoutBoard}
        />
      </div>
    )
  }

  return (
    <div className="page-shell">
      <WorkoutBuilder />
    </div>
  )
}
export default App
