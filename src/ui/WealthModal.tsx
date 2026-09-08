import { useGame, wealthBreakdown } from '../store/gameStore'
import type { TeamId } from '../engine/types'
import { Modal, money, TeamBadge } from './primitives'

export function WealthModal({ open, team, onClose }: { open: boolean; team: TeamId | null; onClose: () => void }) {
  const game = useGame(s => s.game)
  if (!open || !team || !game) return null
  const w = wealthBreakdown(game, team)
  const t = game.teams[team]

  return (
    <Modal open={open} onClose={onClose} title="Wealth breakdown" wide>
      <div className="flex items-center gap-3 mb-4">
        <TeamBadge team={team} name={t.name} large />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-ink-100 mb-2">Cash — the number that matters right now</div>
          <div className="num text-5xl font-black text-ink-500">{money(w.cash)}</div>
          <div className="mt-4 text-[10px] uppercase tracking-widest text-ink-100 mb-2">Total wealth</div>
          <div className="num text-2xl font-bold text-ink-400">{money(w.total)}</div>
          <div className="mt-4 card p-3">
            <div className="text-[10px] uppercase tracking-widest text-ink-100 mb-2">Formula</div>
            <code className="text-xs text-ink-300 leading-relaxed block whitespace-pre-wrap">
{`Total = Cash
      + 0.5 × Σ(property price, non-mortgaged)
      + 0.5 × Σ(house/hotel investment)
      + 0   × mortgaged properties
Cards do not contribute to wealth.`}
            </code>
            <div className="mt-3 space-y-1 text-sm">
              <Row label="Cash" v={money(w.cash)} />
              <Row label="+ Property × 0.5" v={money(w.propertyValue)} />
              <Row label="+ House × 0.5" v={money(w.houseValue)} />
              <Row label="Mortgaged" v={money(w.mortgagedValue)} />
              <div className="divider my-2" />
              <Row label="Total" v={money(w.total)} strong />
            </div>
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-widest text-ink-100 mb-2">Eligible properties</div>
          <div className="max-h-40 overflow-auto pr-1 space-y-1 text-xs">
            {w.eligibleProperties.length === 0 && <div className="text-ink-100">None.</div>}
            {w.eligibleProperties.map(p => (
              <div key={p.id} className="flex justify-between items-center">
                <span>{p.name}</span>
                <span className="num text-ink-200">{money(p.contribution)}</span>
              </div>
            ))}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-ink-100 mb-2 mt-4">Houses / hotels</div>
          <div className="max-h-32 overflow-auto pr-1 space-y-1 text-xs">
            {w.houses.length === 0 && <div className="text-ink-100">None.</div>}
            {w.houses.map(h => (
              <div key={h.id} className="flex justify-between items-center">
                <span>{h.name} <span className="text-ink-100">(spent {money(h.investment)})</span></span>
                <span className="num text-ink-200">{money(h.contribution)}</span>
              </div>
            ))}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-ink-100 mb-2 mt-4">Mortgaged (0 wealth)</div>
          <div className="max-h-24 overflow-auto pr-1 space-y-1 text-xs">
            {w.mortgagedProperties.length === 0 && <div className="text-ink-100">None.</div>}
            {w.mortgagedProperties.map(p => (
              <div key={p.id} className="flex justify-between items-center">
                <span>{p.name}</span>
                <span className="num text-ink-100 line-through">{money(0.5 * p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

function Row({ label, v, strong = false }: { label: string; v: string; strong?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className={strong ? 'font-bold text-ink-500' : 'text-ink-200'}>{label}</span>
      <span className={`num ${strong ? 'font-black text-lg text-ink-500' : 'text-ink-500'}`}>{v}</span>
    </div>
  )
}
