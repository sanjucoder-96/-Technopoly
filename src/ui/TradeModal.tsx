import { useMemo, useState } from 'react'
import { useGame, PROPERTIES, PROPERTIES_BY_ID, canExecuteTrade } from '../store/gameStore'
import type { Game, TeamId } from '../engine/types'
import { Modal, TeamBadge, money } from './primitives'

type Side = { cash: number; propertyIds: string[]; cardIds: string[] }

export function TradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const game = useGame(s => s.game)!
  const trade = useGame(s => s.trade)

  const [a, setA] = useState<Side>({ cash: 0, propertyIds: [], cardIds: [] })
  const [b, setB] = useState<Side>({ cash: 0, propertyIds: [], cardIds: [] })
  const [confirm, setConfirm] = useState(false)

  const teamProps = (t: TeamId) => PROPERTIES.filter(p => game.properties[p.id].ownerTeam === t)
  const teamCards = (t: TeamId) => game.teams[t].heldCards

  const check = useMemo(() => canExecuteTrade(game, a, b), [game, a, b])

  const toggle = (side: 'A' | 'B', kind: 'p' | 'c', id: string) => {
    const set = side === 'A' ? a : b
    const setter = side === 'A' ? setA : setB
    const list = kind === 'p' ? set.propertyIds : set.cardIds
    const next = list.includes(id) ? list.filter(x => x !== id) : [...list, id]
    setter({ ...set, ...(kind === 'p' ? { propertyIds: next } : { cardIds: next }) })
  }

  const reset = () => { setA({ cash: 0, propertyIds: [], cardIds: [] }); setB({ cash: 0, propertyIds: [], cardIds: [] }); setConfirm(false) }

  const isEmpty = a.cash === 0 && a.propertyIds.length === 0 && a.cardIds.length === 0 && b.cash === 0 && b.propertyIds.length === 0 && b.cardIds.length === 0

  return (
    <Modal open={open} onClose={() => { reset(); onClose() }} title="Trade" wide
      footer={<>
        <button className="btn" onClick={() => { reset(); onClose() }}>Cancel</button>
        {!confirm ? (
          <button className="btn btn-primary btn-lg" disabled={!check.ok || isEmpty} onClick={() => setConfirm(true)}>Review trade</button>
        ) : (
          <button className="btn btn-success btn-lg" onClick={() => { trade(a, b); reset(); onClose() }}>Confirm & execute</button>
        )}
      </>}>
      {!confirm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TradeSide sideLabel="Team A gives" tone="a" teamId="A" side={a} setSide={setA}
            props={teamProps('A')} propState={game.properties} cards={teamCards('A')} toggle={(k, id) => toggle('A', k, id)}
            teams={game.teams} />
          <TradeSide sideLabel="Team B gives" tone="b" teamId="B" side={b} setSide={setB}
            props={teamProps('B')} propState={game.properties} cards={teamCards('B')} toggle={(k, id) => toggle('B', k, id)}
            teams={game.teams} />
        </div>
      ) : (
        <TradeReview a={a} b={b} game={game} />
      )}
      {!check.ok && !isEmpty && <div className="mt-3 text-xs text-rose-700">{check.reason}</div>}
    </Modal>
  )
}

function TradeSide({
  sideLabel, tone, teamId, side, setSide, props, propState, cards, toggle, teams
}: {
  sideLabel: string; tone: 'a' | 'b'; teamId: TeamId; side: Side; setSide: (s: Side) => void;
  props: ReturnType<typeof PROPERTIES.filter>; propState: Record<string, { houses: number; hotel: boolean; mortgaged: boolean; ownerTeam: TeamId | null }>;
  cards: { cardId: string; title: string }[];
  toggle: (kind: 'p' | 'c', id: string) => void;
  teams: Record<TeamId, { cash: number; name: string }>
}) {
  return (
    <div className={`card p-4 ${tone === 'a' ? 'team-a-tint' : 'team-b-tint'} border-2`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-widest text-ink-100">{sideLabel}</div>
        <TeamBadge team={teamId} name={teams[teamId].name} large />
      </div>
      <label className="block mb-3">
        <div className="text-[10px] uppercase tracking-widest text-ink-100 mb-1">Cash (max {money(teams[teamId].cash)})</div>
        <input type="number" min={0} max={teams[teamId].cash} value={side.cash}
          onChange={e => setSide({ ...side, cash: Math.max(0, Math.min(teams[teamId].cash, Number(e.target.value))) })}
          className="w-full bg-white border border-canvas-500 rounded-md px-3 py-2 num" />
      </label>
      <div className="text-[10px] uppercase tracking-widest text-ink-100 mb-1">Properties</div>
      <div className="max-h-40 overflow-auto pr-1 space-y-1 mb-3">
        {props.length === 0 && <div className="text-xs text-ink-100">No properties.</div>}
        {props.map(p => {
          const s = propState[p.id]
          const disabled = s.houses > 0 || s.hotel
          const selected = side.propertyIds.includes(p.id)
          return (
            <label key={p.id} className={`flex items-center gap-2 text-xs p-2 rounded ${disabled ? 'opacity-50' : 'hover:bg-canvas-100 cursor-pointer'}`}>
              <input type="checkbox" checked={selected} disabled={disabled} onChange={() => toggle('p', p.id)} />
              <span className="flex-1 text-ink-500">{p.name}</span>
              {s.mortgaged && <span className="chip bg-amber-50 border-amber-300 text-amber-800">Mortgaged</span>}
              {disabled && <span className="text-[10px] text-rose-700">Has buildings</span>}
              <span className="num text-ink-100">{money(p.price)}</span>
            </label>
          )
        })}
      </div>
      <div className="text-[10px] uppercase tracking-widest text-ink-100 mb-1">Get Out of Jail cards</div>
      <div className="space-y-1">
        {cards.length === 0 && <div className="text-xs text-ink-100">None.</div>}
        {cards.map(c => (
          <label key={c.cardId} className="flex items-center gap-2 text-xs p-2 rounded hover:bg-canvas-100 cursor-pointer">
            <input type="checkbox" checked={side.cardIds.includes(c.cardId)} onChange={() => toggle('c', c.cardId)} />
            <span className="flex-1 text-ink-500">{c.title}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function TradeReview({ a, b, game }: { a: Side; b: Side; game: Game }) {
  const line = (side: Side) => {
    const parts: string[] = []
    if (side.cash > 0) parts.push(money(side.cash))
    parts.push(...side.propertyIds.map(id => PROPERTIES_BY_ID[id].name))
    parts.push(...side.cardIds.map(id => game.teams.A.heldCards.concat(game.teams.B.heldCards).find(c => c.cardId === id)?.title ?? id))
    return parts.length ? parts.join(', ') : '(nothing)'
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-2">
          <TeamBadge team="A" name={game.teams.A.name} large />
          <span className="text-ink-100">gives</span>
        </div>
        <div className="font-semibold text-ink-500">{line(a)}</div>
      </div>
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-2">
          <TeamBadge team="B" name={game.teams.B.name} large />
          <span className="text-ink-100">gives</span>
        </div>
        <div className="font-semibold text-ink-500">{line(b)}</div>
      </div>
    </div>
  )
}
