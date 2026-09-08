import { useMemo, useState } from 'react'
import { useGame, PROPERTIES_BY_ID } from '../store/gameStore'
import type { EventType, TeamId } from '../engine/types'
import { money, TeamBadge } from './primitives'

const ICONS: Partial<Record<EventType, string>> = {
  game_start: '🚀', game_end: '🏁', turn_start: '▶', turn_end: '⏭',
  landing: '📍', purchase: '🏢', purchase_failed: '✕', auction_started: '🔨', auction_bid: '💬',
  auction_won: '🔨', auction_suspended: '—', rent: '💰', salary: '💵', tax: '🧾',
  chest_drawn: '📦', chance_drawn: '🎲', card_applied: '🃏',
  jail_enter: '🔒', jail_exit: '🔓', jail_pay: '💸',
  mortgage: '📉', unmortgage: '📈',
  build_house: '🏠', build_hotel: '🏨', sell_house: '🏚', sell_hotel: '🏚',
  trade: '⇄', challenge_start: '⚔', challenge_result: '⚔',
  bankrupt: '💥', correction: '✎', question_asked: '❓', note: '•'
}

export function EventLog({ compact = false }: { compact?: boolean }) {
  const events = useGame(s => s.game?.events ?? [])
  const game = useGame(s => s.game!)
  const correct = useGame(s => s.correctCashEvent)
  const [teamFilter, setTeamFilter] = useState<'all' | TeamId>('all')
  const [text, setText] = useState('')

  const rows = useMemo(() => {
    return [...events].reverse().filter(e => {
      if (teamFilter !== 'all' && e.team !== teamFilter && e.otherTeam !== teamFilter) return false
      if (text && !e.message.toLowerCase().includes(text.toLowerCase())) return false
      return true
    })
  }, [events, teamFilter, text])

  return (
    <div>
      {!compact && (
        <div className="flex flex-wrap items-center justify-end gap-2 mb-3">
          <select
            value={teamFilter}
            onChange={e => setTeamFilter(e.target.value as 'all' | TeamId)}
            className="bg-white border border-canvas-500 rounded-md text-xs px-2 py-1"
          >
            <option value="all">All teams</option>
            <option value="A">{game.teams.A.name}</option>
            <option value="B">{game.teams.B.name}</option>
          </select>
          <input
            placeholder="Search…"
            value={text}
            onChange={e => setText(e.target.value)}
            className="bg-white border border-canvas-500 rounded-md text-xs px-2 py-1 w-40"
          />
        </div>
      )}
      <div className={`space-y-1 overflow-auto ${compact ? 'max-h-56' : 'max-h-[520px]'} pr-1`}>
        {rows.length === 0 && <div className="text-xs text-ink-100 py-4 text-center">No events yet.</div>}
        {rows.map(e => (
          <div key={e.id} className="text-xs flex items-start gap-2 py-1.5 border-b border-canvas-400 last:border-b-0">
            <span className="w-5 text-center opacity-70">{ICONS[e.type] || '•'}</span>
            <div className="flex-1">
              <div className="text-ink-500">{e.message}</div>
              <div className="text-[10px] text-ink-100 flex items-center gap-2 mt-0.5 flex-wrap">
                <time>{new Date(e.ts).toLocaleTimeString()}</time>
                {e.team && <TeamBadge team={e.team} name={game.teams[e.team].name} />}
                {e.propertyId && <span>{PROPERTIES_BY_ID[e.propertyId]?.name}</span>}
                {e.amount != null && <span className="num text-ink-300">{money(e.amount, { sign: true })}</span>}
              </div>
            </div>
            {!compact && e.amount != null && ['purchase','rent','salary','tax','auction_won','mortgage','unmortgage','build_house','build_hotel','jail_pay','card_applied'].includes(e.type) && (
              <button
                title="Correct this cash entry"
                className="text-[10px] text-ink-100 hover:text-rose-600"
                onClick={() => {
                  const note = prompt('Reason for correction?')
                  if (note) correct(e.id, note)
                }}
              >↩</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
