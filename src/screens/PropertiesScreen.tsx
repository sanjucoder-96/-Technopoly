import { useMemo, useState } from 'react'
import { useGame, PROPERTIES, canBuildHotel, canBuildHouse, canMortgage } from '../store/gameStore'
import { money, TeamBadge } from '../ui/primitives'
import { TopNav } from '../ui/TopNav'
import { calculateRent } from '../engine/engine'
import type { TeamId } from '../engine/types'

type Filter = 'all' | TeamId | 'unowned' | 'mortgaged'

const COLOR_BAR: Record<string, string> = {
  brown: 'bg-amber-900', skyblue: 'bg-sky-400', pink: 'bg-pink-400',
  orange: 'bg-orange-400', red: 'bg-red-500', yellow: 'bg-yellow-400',
  green: 'bg-emerald-500', blue: 'bg-indigo-500',
  railway: 'bg-slate-600', utility: 'bg-teal-500'
}

export function PropertiesScreen() {
  const game = useGame(s => s.game)!
  const requestHouse = useGame(s => s.requestBuildHouse)
  const requestHotel = useGame(s => s.requestBuildHotel)
  const doMortgage = useGame(s => s.mortgage)
  const doUnmortgage = useGame(s => s.unmortgage)
  const sellHouse = useGame(s => s.sellHouse)
  const sellHotel = useGame(s => s.sellHotel)

  const [filter, setFilter] = useState<Filter>('all')
  const [q, setQ] = useState('')

  const items = useMemo(() => PROPERTIES.filter(p => {
    const st = game.properties[p.id]
    if (filter === 'A' && st.ownerTeam !== 'A') return false
    if (filter === 'B' && st.ownerTeam !== 'B') return false
    if (filter === 'unowned' && st.ownerTeam) return false
    if (filter === 'mortgaged' && !st.mortgaged) return false
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false
    return true
  }), [game, filter, q])

  const counts = useMemo(() => {
    let a = 0, b = 0, un = 0, m = 0
    for (const p of PROPERTIES) {
      const st = game.properties[p.id]
      if (st.ownerTeam === 'A') a++
      else if (st.ownerTeam === 'B') b++
      else un++
      if (st.mortgaged) m++
    }
    return { a, b, un, m }
  }, [game])

  const F = ({ id, label }: { id: Filter; label: string }) => (
    <button className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors
      ${filter === id ? 'border-teamA-500 bg-teamA-50 text-teamA-700' : 'border-canvas-500 bg-white text-ink-200 hover:bg-canvas-100'}`}
      onClick={() => setFilter(id)}>{label}</button>
  )

  const currentTurn = game.currentTurn

  return (
    <div className="min-h-screen surface flex flex-col">
      <TopNav />
      <div className="max-w-7xl mx-auto w-full px-6 pt-6 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-black text-ink-500">Properties</h2>
            <div className="text-sm text-ink-100">{PROPERTIES.length} total · manage buildings, mortgages, ownership.</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <F id="all" label={`All (${PROPERTIES.length})`} />
            <F id="A" label={`${game.teams.A.name} (${counts.a})`} />
            <F id="B" label={`${game.teams.B.name} (${counts.b})`} />
            <F id="unowned" label={`Unowned (${counts.un})`} />
            <F id="mortgaged" label={`Mortgaged (${counts.m})`} />
            <input placeholder="Search…" value={q} onChange={e => setQ(e.target.value)}
              className="bg-white border border-canvas-500 rounded-md px-3 py-1.5 text-sm w-44" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(p => {
            const st = game.properties[p.id]
            const rent = calculateRent(game, p.id)
            const canH = canBuildHouse(game, currentTurn, p.id)
            const canX = canBuildHotel(game, currentTurn, p.id)
            const canM = canMortgage(game, currentTurn, p.id)
            const owner = st.ownerTeam
            return (
              <div key={p.id}
                className={`card overflow-hidden ${st.mortgaged ? 'opacity-70' : ''}
                  ${owner === 'A' ? 'ring-1 ring-teamA-300' : owner === 'B' ? 'ring-1 ring-teamB-300' : ''}`}>
                <div className={`h-2 ${COLOR_BAR[p.colorGroup]}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-ink-100 capitalize">{p.type} · {p.colorGroup}</div>
                      <div className="text-lg font-bold text-ink-500 leading-tight">{p.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="num text-lg font-black text-ink-500">{money(p.price)}</div>
                      <div className="text-[10px] text-ink-100">List price</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {owner ? <TeamBadge team={owner} /> : <span className="chip">Unowned</span>}
                    {st.mortgaged && <span className="chip bg-amber-50 border-amber-300 text-amber-800">Mortgaged</span>}
                    {st.hotel && <span className="chip bg-yellow-50 border-yellow-300 text-yellow-800">🏨 Hotel</span>}
                    {!st.hotel && st.houses > 0 && <span className="chip bg-emerald-50 border-emerald-300 text-emerald-800">🏠 × {st.houses}</span>}
                    <span className="chip capitalize">Q: {p.questionLevel}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 text-[11px]">
                    <Stat label="Base rent" v={money(p.baseRent)} />
                    <Stat label="Current rent" v={st.mortgaged ? '—' : money(rent)} tone="strong" />
                    <Stat label="House ₹" v={money(p.housePrice ?? 0)} />
                  </div>

                  {owner === currentTurn && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.type === 'property' && (
                        <>
                          <button className="btn text-xs" disabled={!canH.ok} title={canH.reason}
                            onClick={() => requestHouse(p.id)}>+ House</button>
                          <button className="btn text-xs" disabled={!canX.ok} title={canX.reason}
                            onClick={() => requestHotel(p.id)}>+ Hotel</button>
                          {st.houses > 0 && !st.hotel && <button className="btn text-xs" onClick={() => sellHouse(p.id)}>− House</button>}
                          {st.hotel && <button className="btn text-xs" onClick={() => sellHotel(p.id)}>− Hotel</button>}
                        </>
                      )}
                      {!st.mortgaged && <button className="btn text-xs" disabled={!canM.ok} title={canM.reason}
                        onClick={() => doMortgage(p.id)}>Mortgage</button>}
                      {st.mortgaged && <button className="btn text-xs btn-primary"
                        onClick={() => doUnmortgage(p.id)}>Unmortgage</button>}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, v, tone }: { label: string; v: string; tone?: 'strong' }) {
  return (
    <div className={`rounded-lg border p-2 ${tone === 'strong' ? 'bg-teamA-50 border-teamA-200' : 'bg-canvas-100 border-canvas-500'}`}>
      <div className="text-[9px] uppercase tracking-widest text-ink-100">{label}</div>
      <div className={`num font-bold ${tone === 'strong' ? 'text-teamA-700' : 'text-ink-500'}`}>{v}</div>
    </div>
  )
}
