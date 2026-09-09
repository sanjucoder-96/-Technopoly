import { useMemo, useState } from 'react'
import { useGame, BOARD, PROPERTIES_BY_ID } from '../store/gameStore'
import { money, TeamBadge } from '../ui/primitives'
import { TopNav } from '../ui/TopNav'

const TYPE_LABEL: Record<string, string> = {
  go: 'GO', property: 'Property', railway: 'Data Center', utility: 'Utility',
  chest: 'Code Chest', chance: 'Chance', tax: 'Tax',
  jail: 'Code Hunt', gotojail: 'Go To Code Hunt', freeparking: 'Free Server'
}

const TYPE_COLOR: Record<string, string> = {
  go:          'bg-emerald-50 text-emerald-800 border-emerald-300',
  property:    'bg-canvas-100 text-ink-300 border-canvas-500',
  railway:     'bg-slate-100 text-slate-700 border-slate-300',
  utility:     'bg-teal-50 text-teal-800 border-teal-300',
  chest:       'bg-amber-50 text-amber-800 border-amber-300',
  chance:      'bg-violet-50 text-violet-800 border-violet-300',
  tax:         'bg-rose-50 text-rose-800 border-rose-300',
  jail:        'bg-orange-50 text-orange-800 border-orange-300',
  gotojail:    'bg-rose-100 text-rose-900 border-rose-400',
  freeparking: 'bg-sky-50 text-sky-800 border-sky-300'
}

const COLOR_BAR: Record<string, string> = {
  brown:   'bg-amber-900',
  skyblue: 'bg-sky-400',
  pink:    'bg-pink-400',
  orange:  'bg-orange-400',
  red:     'bg-red-500',
  yellow:  'bg-yellow-400',
  green:   'bg-emerald-500',
  blue:    'bg-indigo-500',
  railway: 'bg-slate-600',
  utility: 'bg-teal-500'
}

export function LandingSelectorScreen() {
  const game = useGame(s => s.game)!
  const landOn = useGame(s => s.landOn)
  const setView = useGame(s => s.setView)
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<number | null>(null)

  const filtered = useMemo(() => BOARD.filter(b => b.name.toLowerCase().includes(q.toLowerCase())), [q])

  const confirm = () => {
    if (selected == null) return
    landOn(selected)
    setView('dashboard')
  }

  return (
    <div className="min-h-screen surface flex flex-col">
      <TopNav />
      <div className="max-w-7xl mx-auto w-full px-6 pt-6 pb-24 flex-1">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-ink-100">Turn {game.turnNumber}</div>
            <h2 className="text-2xl font-black text-ink-500">Select landing space for <TeamBadge team={game.currentTurn} name={game.teams[game.currentTurn].name} large className="ml-1 align-middle" /></h2>
            <div className="text-sm text-ink-100 mt-0.5">The team physically rolled the dice — pick the space their token landed on.</div>
          </div>
          <div className="flex gap-2">
            <input placeholder="Search space…" value={q} onChange={e => setQ(e.target.value)}
              className="bg-white border border-canvas-500 rounded-lg px-3 py-2 text-sm w-56" />
            <button className="btn" onClick={() => setView('dashboard')}>Cancel</button>
            <button className="btn btn-primary btn-lg" disabled={selected == null} onClick={confirm}>Confirm landing →</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(b => {
            const isSelected = selected === b.index
            const p = b.propertyId ? PROPERTIES_BY_ID[b.propertyId] : null
            const owner = b.propertyId ? game.properties[b.propertyId]?.ownerTeam : null
            return (
              <button key={b.index}
                onClick={() => setSelected(b.index)}
                className={`text-left rounded-xl border overflow-hidden bg-white transition-all
                  ${isSelected ? 'border-teamA-500 shadow-ring scale-[1.01]' : 'border-canvas-500 hover:border-teamA-300 hover:shadow-card'}`}>
                {p && <div className={`h-1.5 ${COLOR_BAR[p.colorGroup]}`} />}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold border ${TYPE_COLOR[b.type]}`}>
                      {TYPE_LABEL[b.type]}
                    </span>
                    <span className="text-[10px] text-ink-100 num">#{b.index}</span>
                  </div>
                  <div className="text-sm font-bold text-ink-500 leading-tight">{b.name}</div>
                  <div className="flex items-center gap-1.5 mt-2 min-h-[20px]">
                    {p && <span className="text-[11px] text-ink-200 num">{money(p.price)}</span>}
                    {owner && <TeamBadge team={owner} />}
                    {b.taxAmount && <span className="text-[11px] text-rose-700 num">−{money(b.taxAmount)}</span>}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
