import { useMemo, useState } from 'react'
import { useGame, canCoverDeficit, PROPERTIES, canMortgage } from '../store/gameStore'
import type { TeamId } from '../engine/types'
import { Modal, TeamBadge, money } from './primitives'

// Small banner shown at the top of the dashboard whenever any team's cash
// is negative but the game hasn't ended — the GM must raise funds by
// mortgaging (or trading) before continuing normal play.
export function RaiseFundsBanner({ onOpen }: { onOpen: (team: TeamId) => void }) {
  const game = useGame(s => s.game)!
  const teams = (['A', 'B'] as TeamId[]).map(t => ({
    id: t,
    ...canCoverDeficit(game, t),
    cash: game.teams[t].cash,
    name: game.teams[t].name
  })).filter(x => x.deficit > 0)
  if (teams.length === 0) return null
  return (
    <div className="space-y-2">
      {teams.map(t => (
        <div key={t.id}
          className={`card p-4 border-2 flex items-center justify-between gap-3
            ${t.covered ? 'border-amber-300 bg-amber-50' : 'border-rose-400 bg-rose-50'}`}>
          <div className="flex items-center gap-3">
            <div className="text-2xl">{t.covered ? '⚠' : '💥'}</div>
            <div>
              <div className="text-sm font-bold text-ink-500">
                <TeamBadge team={t.id} name={t.name} /> — cash is <span className="num text-rose-700">−{money(t.deficit)}</span>
              </div>
              <div className="text-xs text-ink-200 mt-0.5">
                {t.covered
                  ? <>Available to raise by mortgaging: <b className="num">{money(t.mortgageAvailable)}</b>. Mortgage now to clear the deficit and continue.</>
                  : <>Mortgage-able assets total only <b className="num">{money(t.mortgageAvailable)}</b> — cannot cover the deficit. Team will be declared bankrupt on the next required check.</>}
              </div>
            </div>
          </div>
          <button className="btn btn-warn btn-lg" onClick={() => onOpen(t.id)}>Raise funds →</button>
        </div>
      ))}
    </div>
  )
}

export function RaiseFundsModal({ open, team, onClose }: { open: boolean; team: TeamId | null; onClose: () => void }) {
  const game = useGame(s => s.game)
  const doMortgage = useGame(s => s.mortgage)
  const sellHouseFn = useGame(s => s.sellHouse)
  const sellHotelFn = useGame(s => s.sellHotel)
  const declareBankruptcy = useGame(s => s.declareBankruptcy)
  const [confirmBankrupt, setConfirmBankrupt] = useState(false)

  const eligible = useMemo(() => {
    if (!game || !team) return []
    return PROPERTIES.filter(p => canMortgage(game, team, p.id).ok)
  }, [game, team])

  if (!open || !team || !game) return null
  const t = game.teams[team]
  const deficit = t.cash < 0 ? -t.cash : 0
  const cover = canCoverDeficit(game, team)

  return (
    <Modal open={open} onClose={onClose} title="Raise funds — mortgage to cover the deficit" wide
      footer={<>
        <button className="btn" onClick={onClose}>Close</button>
        {!cover.covered && !confirmBankrupt && (
          <button className="btn btn-danger" onClick={() => setConfirmBankrupt(true)}>Declare bankruptcy</button>
        )}
        {confirmBankrupt && (
          <button className="btn btn-danger" onClick={() => { declareBankruptcy(team); onClose() }}>
            Confirm bankruptcy — {t.name} loses
          </button>
        )}
      </>}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Stat label="Team" v={t.name} />
        <Stat label="Cash deficit" v={`−${money(deficit)}`} tone="bad" />
        <Stat label="Mortgage-able total" v={money(cover.mortgageAvailable)} tone={cover.covered ? 'ok' : 'bad'} />
      </div>

      {!cover.covered && (
        <div className="mb-3 p-3 rounded-lg bg-rose-100 border border-rose-300 text-xs text-rose-900">
          Even mortgaging every eligible property leaves <b>{money(deficit - cover.mortgageAvailable)}</b> short. The team will be declared bankrupt when confirmed.
        </div>
      )}

      {t.cash < 0 && eligible.length > 0 && (
        <>
          <div className="text-xs uppercase tracking-widest text-ink-100 mb-2">Mortgageable properties</div>
          <div className="max-h-72 overflow-auto pr-1 space-y-1">
            {eligible.map(p => {
              const payout = Math.round(p.price * game.config.mortgageFraction)
              return (
                <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg border border-canvas-500 bg-white">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-ink-500">{p.name}</div>
                    <div className="text-[11px] text-ink-100 capitalize">{p.type} · {p.colorGroup}</div>
                  </div>
                  <div className="num text-sm text-ink-500">+{money(payout)}</div>
                  <button className="btn btn-warn" onClick={() => doMortgage(p.id)}>Mortgage</button>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Housed properties that block mortgaging until the buildings are sold */}
      {(() => {
        const blocked = PROPERTIES.filter(p => {
          const s = game.properties[p.id]
          return s.ownerTeam === team && (s.houses > 0 || s.hotel)
        })
        if (blocked.length === 0) return null
        return (
          <>
            <div className="text-xs uppercase tracking-widest text-ink-100 mb-2 mt-4">Sell buildings first to unlock mortgage</div>
            <div className="max-h-40 overflow-auto pr-1 space-y-1">
              {blocked.map(p => {
                const s = game.properties[p.id]
                const cost = p.housePrice ?? 0
                const refund = Math.round(cost * game.config.mortgageFraction)
                return (
                  <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg border border-canvas-500 bg-white">
                    <div className="flex-1">
                      <div className="text-sm font-bold text-ink-500">{p.name}</div>
                      <div className="text-[11px] text-ink-100 capitalize">
                        {s.hotel ? '🏨 Hotel' : `🏠 × ${s.houses}`} · {p.colorGroup}
                      </div>
                    </div>
                    <div className="num text-sm text-ink-500">+{money(refund)}</div>
                    {s.hotel
                      ? <button className="btn" onClick={() => sellHotelFn(p.id)}>Sell hotel</button>
                      : <button className="btn" onClick={() => sellHouseFn(p.id)}>Sell a house</button>}
                  </div>
                )
              })}
            </div>
          </>
        )
      })()}
    </Modal>
  )
}

function Stat({ label, v, tone }: { label: string; v: string; tone?: 'ok' | 'bad' }) {
  const cls = tone === 'ok' ? 'text-emerald-700' : tone === 'bad' ? 'text-rose-700' : 'text-ink-500'
  return (
    <div className="rounded-lg border border-canvas-500 bg-white p-3">
      <div className="text-[10px] uppercase tracking-widest text-ink-100">{label}</div>
      <div className={`num font-bold text-lg ${cls}`}>{v}</div>
    </div>
  )
}
