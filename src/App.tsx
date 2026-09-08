import { useEffect } from 'react'
import { useGame } from './store/gameStore'
import { SetupScreen } from './screens/SetupScreen'
import { Dashboard } from './screens/Dashboard'
import { EndScreen } from './screens/EndScreen'
import { QuestionScreen } from './screens/QuestionScreen'
import { LandingSelectorScreen } from './screens/LandingSelectorScreen'
import { PropertiesScreen } from './screens/PropertiesScreen'
import { ToastLayer } from './ui/Toasts'
import { ResumePrompt } from './ui/ResumePrompt'

export function App() {
  const game = useGame(s => s.game)
  const view = useGame(s => s.view)
  const tick = useGame(s => s.timerTick)

  useEffect(() => {
    const id = setInterval(() => tick(), 500)
    return () => clearInterval(id)
  }, [tick])

  return (
    <div className="min-h-screen">
      <ResumePrompt />
      {!game && <SetupScreen />}
      {game && game.phase === 'ended' && <EndScreen />}
      {game && game.phase !== 'ended' && game.pendingQuestion && <QuestionScreen />}
      {game && game.phase !== 'ended' && !game.pendingQuestion && view === 'landing_select' && <LandingSelectorScreen />}
      {game && game.phase !== 'ended' && !game.pendingQuestion && view === 'properties' && <PropertiesScreen />}
      {game && game.phase !== 'ended' && !game.pendingQuestion && view === 'dashboard' && <Dashboard />}
      <ToastLayer />
    </div>
  )
}
