import { useMemo, useState } from 'react'
import { useGame, PROPERTIES_BY_ID, wealthBreakdown } from '../store/gameStore'
import type { TeamId } from '../engine/types'
import { Modal, TeamBadge, money } from './primitives'

export function AuctionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const auction = useGame(s => s.auction)
  const game = useGame(s => s.game)!
  const bid = useGame(s => s.auctionBid)
  const finish = useGame(s => s.auctionFinish)
  const cancel = useGame(s => s.auctionCancel)
  const validate = useGame(s => s.validateAuctionBid)

  const [amount, setAmount] = useState<number>(game.config.auctionMinBid)

  const wealth = useMemo(() => ({
    A: wealthBreakdown(game, 'A').total,
    B: wealthBreakdown(game, 'B').total
  }), [game])

  if (!open || !auction) return null

  const def = PROPERTIES_BY_ID[auction.propertyId]
  const minNext = Math.max(game.config.auctionMinBid, auction.currentBid + 1)
  const check = validate(auction.activeTurn, amount)

  return (
    <Modal open={open} onClose={onClose} title={`Auction — ${def.name}`} wide
      footer={
        <>
          {!auction.finished && (
            <>
              <button className="btn" onClick={() => { cancel(); onClose() }}>Cancel auction</button>
              <button className="btn btn-warn" onClick={() => { finish() }}>End & award</button>
            </>
          )}
          {auction.finished && <button className="btn btn-primary" onClick={() => { cancel(); onClose() }}>Close</button>}
        </>
      }>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-[10px] uppercase tracking-widest text-ink-100">Property</div>
          <div className="text-xl font-bold text-ink-500">{def.name}</div>
          <div className="text-xs text-ink-100 capitalize">{def.type} · {def.colorGroup}</div>
          <div className="mt-2 num text-2xl font-black text-ink-500">{money(def.price)}</div>
          <div className="text-[10px] text-ink-100">List price · Question level {def.questionLevel}</div>
        </div>
        <div className="card p-4">
          <div className="text-[10px] uppercase tracking-widest text-ink-100">Current bid</div>
          <div className="num text-3xl font-black text-ink-500">{money(auction.currentBid)}</div>
          <div className="mt-2">
            {auction.currentBidder
              ? <TeamBadge team={auction.currentBidder} name={game.teams[auction.currentBidder].name} />
              : <span className="text-xs text-ink-100">No bids yet.</span>}
          </div>
        </div>
        <div className="card p-4">
          <div className="text-[10px] uppercase tracking-widest text-ink-100">Next to bid</div>
          {!auction.finished ? (
            <>
              <TeamBadge team={auction.activeTurn} name={game.teams[auction.activeTurn].name} large />
              <div className="mt-1 text-xs text-ink-100">Min next bid: <span className="num text-ink-500">{money(minNext)}</span></div>
            </>
          ) : auction.suspended ? (
            <div className="text-amber-800 font-bold">Suspended — unpurchased.</div>
          ) : (
            <div className="text-emerald-700 font-bold">Won by {game.teams[auction.currentBidder!].name}. A property question will now be asked.</div>
          )}
        </div>
      </div>

      {!auction.finished && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {(['A','B'] as TeamId[]).map(t => (
            <div key={t} className={`card p-4 ${t === 'A' ? 'team-a-tint' : 'team-b-tint'} border-2`}>
              <div className="flex items-center justify-between">
                <TeamBadge team={t} name={game.teams[t].name} large />
                <span className="text-xs text-ink-100">Wealth: <span className="num text-ink-500">{money(wealth[t])}</span></span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="number"
                  className="flex-1 bg-white border border-canvas-500 rounded-md px-3 py-2 num"
                  value={amount}
                  min={minNext}
                  onChange={e => setAmount(Number(e.target.value))}
                />
                <button
                  className={`btn btn-lg ${t === 'A' ? 'btn-primary' : 'bg-teamB-500 border-teamB-600 text-white hover:bg-teamB-400'}`}
                  disabled={t !== auction.activeTurn}
                  onClick={() => bid(t, amount)}
                  title={t !== auction.activeTurn ? 'Not this team\'s turn to bid' : ''}
                >
                  {t === auction.activeTurn ? `Bid ${money(amount)}` : 'Waiting…'}
                </button>
              </div>
              {t === auction.activeTurn && !check.ok && amount >= minNext && (
                <div className="mt-2 text-xs text-rose-700">{check.reason}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
