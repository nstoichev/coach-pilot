import { useWorkoutBuilder } from './store/index.ts'
import * as tw from './ui/tw.ts'
import { WorkoutBuilder } from './components/workout-builder/index.ts'
import { WorkoutBoard } from './components/workout-builder/WorkoutBoard.tsx'

function App() {
  const { state, actions } = useWorkoutBuilder()

  if (state.showWorkoutBoard && state.workoutBoardSnapshot) {
    return (
      <div className={tw.pageShell}>
        <WorkoutBoard
          workout={state.workoutBoardSnapshot}
          onBackToBuild={actions.hideWorkoutBoard}
        />
      </div>
    )
  }

  return (
    <div className={tw.pageShell}>
      <WorkoutBuilder />
    </div>
  )
}
export default App
