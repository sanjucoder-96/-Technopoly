import { useState } from 'react'
import { useGame, PROPERTIES, canChallenge, otherTeam, PROPERTIES_BY_ID } from '../store/gameStore'
import { Modal, TeamBadge } from './primitives'

export function ChallengeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const game = useGame(s => s.game)!
  const requestChallenge = useGame(s => s.requestChallenge)
  const [propertyId, setPropertyId] = useState<string>('')

  const attacker = game.currentTurn
  const defender = otherTeam(attacker)

  const opponentProps = PROPERTIES.filter(p => {
    const s = game.properties[p.id]
    return s.ownerTeam === defender && !s.mortgaged && s.houses === 0 && !s.hotel
  })

  const start = () => {
    const c = canChallenge(game, attacker, propertyId)
    if (!c.ok) return
    requestChallenge(attacker, propertyId)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Challenge" wide
      footer={<>
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary btn-lg" disabled={!propertyId} onClick={start}>Begin challenge →</button>
      </>}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-xl">⚔️</div>
        <TeamBadge team={attacker} name={game.teams[attacker].name} large />
        <span className="text-ink-100">vs</span>
        <TeamBadge team={defender} name={game.teams[defender].name} large />
        <span className="ml-auto chip">Challenges used: {game.teams[attacker].challengesUsed}/{game.config.maxChallenges}</span>
      </div>
      <div className="text-sm text-ink-100 mb-2">Choose an eligible opponent property (no houses/hotel, unmortgaged):</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-auto pr-1">
        {opponentProps.length === 0 && <div className="text-xs text-ink-100 col-span-2">No eligible properties to challenge.</div>}
        {opponentProps.map(p => (
          <label key={p.id} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors
            ${propertyId === p.id ? 'border-teamA-500 bg-teamA-50' : 'border-canvas-500 bg-white hover:bg-canvas-100'}`}>
            <input type="radio" name="prop" checked={propertyId === p.id} onChange={() => setPropertyId(p.id)} />
            <span className="text-sm font-bold text-ink-500">{p.name}</span>
            <span className="text-[10px] text-ink-100 ml-auto capitalize">Q: {PROPERTIES_BY_ID[p.id].questionLevel}</span>
          </label>
        ))}
      </div>
    </Modal>
  )
}
