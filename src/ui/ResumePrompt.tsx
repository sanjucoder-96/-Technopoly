import { useEffect, useState } from 'react'
import { useGame } from '../store/gameStore'

export function ResumePrompt() {
  const game = useGame(s => s.game)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (game) {
      const timer = setTimeout(() => setDismissed(true), 4000)
      return () => clearTimeout(timer)
    }
  }, [game])

  if (!game || dismissed) return null

  return (
    <div className="fixed z-40 top-3 left-1/2 -translate-x-1/2 card px-4 py-2 text-xs animate-flyup">
      <span className="text-ink-100">Resumed game:</span>{' '}
      <span className="font-semibold text-ink-500">{game.teams.A.name}</span>
      <span className="text-ink-100"> vs </span>
      <span className="font-semibold text-ink-500">{game.teams.B.name}</span>
      <button className="ml-3 text-ink-100 hover:text-ink-500" onClick={() => setDismissed(true)}>✕</button>
    </div>
  )
}
