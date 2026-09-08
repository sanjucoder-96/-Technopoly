import { useGame, wealthBreakdown } from '../store/gameStore'
import { money, TeamBadge, fmtTime } from '../ui/primitives'
import { exportReport } from '../lib/exportReport'
import { EventLog } from '../ui/EventLog'
import type { TeamId } from '../engine/types'

export function EndScreen() {
  const game = useGame(s => s.game)!
  const resetGame = useGame(s => s.resetGame)

  const wA = wealthBreakdown(game, 'A')
  const wB = wealthBreakdown(game, 'B')
  const winner = game.winner

  return (
    <div className="min-h-screen surface">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-widest text-ink-100">Game over</div>
          <div className="text-6xl mt-2">🏆</div>
          {winner === 'tie'
            ? <div className="text-3xl font-black mt-2 text-ink-500">It's a tie!</div>
            : winner
              ? <div className="text-3xl font-black mt-2 text-ink-500">{game.teams[winner].name} wins</div>
              : <div className="text-3xl font-black mt-2 text-ink-500">Game ended</div>}
          <div className="mt-2 text-xs text-ink-100">
            Reason: {game.endedReason} · Duration: {fmtTime(game.timer.elapsedMs)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['A','B'] as TeamId[]).map(id => {
            const w = id === 'A' ? wA : wB
            const isWinner = winner === id
            return (
              <div key={id} className={`card p-5 ${id === 'A' ? 'team-a-strong' : 'team-b-strong'} border-2 relative ${isWinner ? 'ring-2 ring-amber-400' : ''}`}>
                {isWinner && <span className="absolute -top-3 right-4 chip bg-amber-500 text-white border-amber-600 text-[10px] font-bold uppercase">Winner</span>}
                <TeamBadge team={id} name={game.teams[id].name} large />
                <div className="mt-3 text-[10px] uppercase tracking-widest text-ink-100">Cash</div>
                <div className="num text-4xl font-black text-ink-500">{money(w.cash)}</div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <Stat label="Property wealth" v={money(w.propertyValue)} />
                  <Stat label="House wealth" v={money(w.houseValue)} />
                  <Stat label="Total wealth" v={money(w.total)} strong />
                </div>
                <div className="mt-3 text-xs text-ink-100">
                  {w.eligibleProperties.length} eligible properties · {w.mortgagedProperties.length} mortgaged
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex gap-2 justify-center">
          <button className="btn btn-primary btn-lg" onClick={() => exportReport(game)}>Download game report (JSON)</button>
          <button className="btn" onClick={() => { if (confirm('Return to Setup and start a new game?')) resetGame() }}>Start new game</button>
        </div>

        <section className="card p-4 mt-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-ink-100 mb-3">Full event history</h3>
          <EventLog />
        </section>
      </div>
    </div>
  )
}

function Stat({ label, v, strong }: { label: string; v: string; strong?: boolean }) {
  return (
    <div className={`rounded-lg border p-2 ${strong ? 'border-teamA-200 bg-teamA-50' : 'border-canvas-500 bg-white'}`}>
      <div className="text-[9px] uppercase tracking-widest text-ink-100">{label}</div>
      <div className={`num font-bold ${strong ? 'text-teamA-700' : 'text-ink-500'}`}>{v}</div>
    </div>
  )
}
