import { useState } from 'react'
import { useGame, wealthBreakdown, canPurchase, BOARD, PROPERTIES_BY_ID } from '../store/gameStore'
import { TopNav } from '../ui/TopNav'
import { EventLog } from '../ui/EventLog'
import { AuctionModal } from '../ui/AuctionModal'
import { TradeModal } from '../ui/TradeModal'
import { ChallengeModal } from '../ui/ChallengeModal'
import { WealthModal } from '../ui/WealthModal'
import { RaiseFundsBanner, RaiseFundsModal } from '../ui/RaiseFunds'
import { money, TeamBadge } from '../ui/primitives'
import type { TeamId } from '../engine/types'
import { calculateRent } from '../engine/engine'

export function Dashboard() {
  const game = useGame(s => s.game)!
  const auction = useGame(s => s.auction)
  const setView = useGame(s => s.setView)
  const auctionStart = useGame(s => s.auctionStart)
  const requestPurchase = useGame(s => s.requestPurchase)
  const requestRent = useGame(s => s.requestRent)
  const payTax = useGame(s => s.payTax)
  const sendJail = useGame(s => s.sendToJail)
  const requestChance = useGame(s => s.requestChance)
  const drawChest = useGame(s => s.drawChestNow)
  const applyCard = useGame(s => s.applyCard)
  const requestJailExit = useGame(s => s.requestJailExit)
  const useJailCard = useGame(s => s.useJailCard)

  const [openAuction, setOpenAuction] = useState(false)
  const [openTrade, setOpenTrade] = useState(false)
  const [openChallenge, setOpenChallenge] = useState(false)
  const [wealthTeam, setWealthTeam] = useState<TeamId | null>(null)
  const [raiseTeam, setRaiseTeam] = useState<TeamId | null>(null)

  return (
    <div className="min-h-screen surface flex flex-col">
      <TopNav />

      <div className="max-w-7xl mx-auto w-full px-6 py-6 space-y-6">
        {/* Raise-funds banner (only when a team has cash < 0) */}
        <RaiseFundsBanner onOpen={setRaiseTeam} />

        {/* Wealth section — full-width, cash prominent */}
        <WealthSection onOpenBreakdown={setWealthTeam} />

        {/* Landing / action panel */}
        <LandingCard
          onOpenAuction={(pid) => { auctionStart(pid, game.currentTurn); setOpenAuction(true) }}
          onOpenTrade={() => setOpenTrade(true)}
          onOpenChallenge={() => setOpenChallenge(true)}
          onGoLanding={() => setView('landing_select')}
          onGoProperties={() => setView('properties')}
          onPurchase={requestPurchase}
          onRent={requestRent}
          onTax={payTax}
          onSendJail={sendJail}
          onChest={() => {
            const card = drawChest()
            applyCard(card)
          }}
          onChance={requestChance}
          onJailExit={requestJailExit}
          onUseJailCard={useJailCard}
        />

        {/* Event log */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink-100">Live event feed</h3>
            <span className="text-[10px] text-ink-100 num">{game.events.length} events</span>
          </div>
          <EventLog />
        </div>
      </div>

      <AuctionModal open={openAuction || (!!auction && !auction.finished)} onClose={() => setOpenAuction(false)} />
      <TradeModal open={openTrade} onClose={() => setOpenTrade(false)} />
      <ChallengeModal open={openChallenge} onClose={() => setOpenChallenge(false)} />
      <WealthModal open={wealthTeam !== null} team={wealthTeam} onClose={() => setWealthTeam(null)} />
      <RaiseFundsModal open={raiseTeam !== null} team={raiseTeam} onClose={() => setRaiseTeam(null)} />
    </div>
  )
}

function WealthSection({ onOpenBreakdown }: { onOpenBreakdown: (team: TeamId) => void }) {
  const game = useGame(s => s.game)!
  const wA = wealthBreakdown(game, 'A')
  const wB = wealthBreakdown(game, 'B')
  return (
    <section className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-ink-100">Team wealth</h3>
        <div className="text-[10px] text-ink-100">Cash is the number that decides what you can pay right now.</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamWealthCard team="A" onBreakdown={() => onOpenBreakdown('A')} />
        <TeamWealthCard team="B" onBreakdown={() => onOpenBreakdown('B')} />
      </div>
      <div className="mt-4 text-[10px] text-ink-100">
        Property Wealth = 50% of property purchase price · House Wealth = 50% of house investment · Mortgaged properties contribute 0.
      </div>
      {/* debug row — hide */}
      {false && <div className="hidden">{wA.total} {wB.total}</div>}
    </section>
  )
}

function TeamWealthCard({ team, onBreakdown }: { team: TeamId; onBreakdown: () => void }) {
  const game = useGame(s => s.game)!
  const isCurrent = game.currentTurn === team
  const t = game.teams[team]
  const w = wealthBreakdown(game, team)
  const tint = team === 'A' ? 'team-a-strong' : 'team-b-strong'
  return (
    <div className={`rounded-2xl border-2 ${tint} p-5 relative`}>
      {isCurrent && (
        <span className={`absolute -top-3 right-4 chip text-[10px] font-bold uppercase
          ${team === 'A' ? 'bg-teamA-500 text-white border-teamA-600' : 'bg-teamB-500 text-white border-teamB-600'}`}>
          On the clock
        </span>
      )}
      <div className="flex items-center justify-between">
        <TeamBadge team={team} name={t.name} large />
        <div className="flex gap-1">
          {t.bankrupt && <span className="chip bg-rose-100 text-rose-800 border-rose-300">Bankrupt</span>}
          {t.jail.inJail && <span className="chip bg-amber-100 text-amber-800 border-amber-300">In Jail</span>}
          <button className="text-[11px] text-ink-100 hover:text-ink-500" onClick={onBreakdown}>Breakdown →</button>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[10px] uppercase tracking-widest text-ink-100">Cash</div>
        <div className="num font-black text-5xl md:text-6xl text-ink-500 leading-none mt-1">{money(w.cash)}</div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <MiniStat label="Property wealth" v={money(w.propertyValue)} />
        <MiniStat label="House wealth" v={money(w.houseValue)} />
        <MiniStat label="Total wealth" v={money(w.total)} strong />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
        <MiniStat label="Properties" v={`${w.eligibleProperties.length + w.mortgagedProperties.length}`} tiny />
        <MiniStat label="Mortgaged" v={`${w.mortgagedProperties.length}`} tiny />
        <MiniStat label="Challenges left" v={`${game.config.maxChallenges - t.challengesUsed}`} tiny />
      </div>
    </div>
  )
}

function MiniStat({ label, v, strong, tiny }: { label: string; v: string; strong?: boolean; tiny?: boolean }) {
  return (
    <div className={`rounded-xl border ${strong ? 'border-teamA-200 bg-teamA-50' : 'border-canvas-500 bg-white'} p-3`}>
      <div className="text-[10px] uppercase tracking-widest text-ink-100">{label}</div>
      <div className={`num font-bold ${tiny ? 'text-base' : 'text-xl'} ${strong ? 'text-teamA-700' : 'text-ink-500'}`}>{v}</div>
    </div>
  )
}

function LandingCard({
  onOpenAuction, onOpenTrade, onOpenChallenge, onGoLanding, onGoProperties,
  onPurchase, onRent, onTax, onSendJail, onChest, onChance, onJailExit, onUseJailCard
}: {
  onOpenAuction: (pid: string) => void
  onOpenTrade: () => void
  onOpenChallenge: () => void
  onGoLanding: () => void
  onGoProperties: () => void
  onPurchase: (pid: string) => void
  onRent: (pid: string) => void
  onTax: (team: TeamId, amount: number, label: string) => void
  onSendJail: (team: TeamId, reason: string) => void
  onChest: () => void
  onChance: () => void
  onJailExit: (team: TeamId) => void
  onUseJailCard: (team: TeamId) => void
}) {
  const game = useGame(s => s.game)!
  const team = game.currentTurn
  const t = game.teams[team]
  const landing = game.landing
  const space = landing ? BOARD[landing.spaceIndex] : null

  if (!landing || !space) {
    return (
      <section className="card p-6 text-center">
        <div className="text-lg font-bold text-ink-500 mb-1">{t.name} — ready to roll</div>
        <div className="text-sm text-ink-100 mb-4">Roll the physical dice, move the token, then confirm where it landed.</div>
        <button className="btn btn-primary btn-lg" onClick={onGoLanding}>Select landing space →</button>
      </section>
    )
  }

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <TeamBadge team={team} name={t.name} large />
          <span className="text-ink-100 text-xs">landed on</span>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-ink-100">#{space.index}</div>
            <div className="font-black text-xl text-ink-500">{space.name}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={onGoLanding}>Change space</button>
          <button className="btn" onClick={onGoProperties}>Manage properties</button>
        </div>
      </div>

      {space.type === 'go' && <Note>Salary automatically credited when a full lap completes. Nothing to do here.</Note>}
      {space.type === 'freeparking' && <Note>Free Parking. No effect. End the turn.</Note>}

      {space.type === 'gotojail' && (
        <ActionRow label="Go To Jail">
          <button className="btn btn-danger btn-lg" onClick={() => onSendJail(team, 'Landed on Go To Jail')}>Send to Jail</button>
        </ActionRow>
      )}

      {space.type === 'jail' && (
        <>
          {!t.jail.inJail && <Note>{t.name} is just visiting Jail. No action needed.</Note>}
          {t.jail.inJail && (
            <ActionRow label={`${t.name} is in Jail`}>
              <button className="btn btn-primary btn-lg" onClick={() => onJailExit(team)}>Ask jail question</button>
              {t.heldCards.some(c => c.title.toLowerCase().includes('jail')) && (
                <button className="btn btn-lg" onClick={() => onUseJailCard(team)}>Use "Get Out of Jail Free"</button>
              )}
            </ActionRow>
          )}
        </>
      )}

      {space.type === 'tax' && (
        <ActionRow label={`${space.name} — pay ${money(space.taxAmount ?? game.config.incomeTax)}`}>
          <div className="text-xs text-ink-100">
            Cash: <span className="num text-ink-500">{money(t.cash)}</span>
          </div>
          <button className="btn btn-danger btn-lg" onClick={() => onTax(team, space.taxAmount ?? game.config.incomeTax, space.name)}>
            Pay {money(space.taxAmount ?? game.config.incomeTax)}
          </button>
        </ActionRow>
      )}

      {space.type === 'chest' && (
        <ActionRow label="Chest — draw a card (no question)">
          <button className="btn btn-primary btn-lg" onClick={onChest}>Draw Chest card</button>
        </ActionRow>
      )}

      {space.type === 'chance' && (
        <ActionRow label="Chance — answer a question, then draw a card">
          <button className="btn btn-primary btn-lg" onClick={onChance}>Begin Chance question</button>
        </ActionRow>
      )}

      {(space.type === 'property' || space.type === 'railway' || space.type === 'utility') && space.propertyId && (
        <PropertyLandingFlow
          propertyId={space.propertyId}
          onPurchase={onPurchase}
          onRent={onRent}
          onAuction={onOpenAuction}
        />
      )}

      <div className="mt-6 border-t border-canvas-400 pt-4 flex flex-wrap gap-2">
        <button className="btn" onClick={onOpenTrade}>⇄ Trade</button>
        <button className="btn" onClick={onOpenChallenge}>⚔ Challenge</button>
      </div>
    </section>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-canvas-500 bg-canvas-100 px-4 py-3 text-sm text-ink-200">{children}</div>
}

function ActionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-canvas-500 bg-canvas-100 p-4">
      <div className="text-[11px] uppercase tracking-widest text-ink-100 mb-2">{label}</div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

function PropertyLandingFlow({ propertyId, onPurchase, onRent, onAuction }:
  { propertyId: string; onPurchase: (pid: string) => void; onRent: (pid: string) => void; onAuction: (pid: string) => void }) {
  const game = useGame(s => s.game)!
  const team = game.currentTurn
  const def = PROPERTIES_BY_ID[propertyId]
  const st = game.properties[propertyId]
  const buyCheck = canPurchase(game, team, propertyId)
  const rent = calculateRent(game, propertyId)

  if (!st.ownerTeam) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-xl border border-canvas-500 bg-canvas-100 p-4">
          <div className="text-[11px] uppercase tracking-widest text-ink-100">Unowned property</div>
          <div className="mt-1 flex items-baseline gap-3 flex-wrap">
            <span className="text-lg font-black text-ink-500">{def.name}</span>
            <span className="chip capitalize">{def.type}</span>
            <span className="chip capitalize">{def.colorGroup}</span>
            <span className="chip capitalize">Q: {def.questionLevel}</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <Kv label="Price" v={money(def.price)} />
            <Kv label="Team cash" v={money(game.teams[team].cash)} />
            <Kv label="Difference" v={buyCheck.deficit ? `−${money(buyCheck.deficit)}` : money(game.teams[team].cash - def.price)} tone={buyCheck.deficit ? 'bad' : 'ok'} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button className="btn btn-primary btn-lg" disabled={!buyCheck.canBuy}
            onClick={() => onPurchase(propertyId)}>Buy — answer question</button>
          <button className="btn btn-warn btn-lg" onClick={() => onAuction(propertyId)}>Send to auction</button>
          {!buyCheck.canBuy && <div className="text-xs text-rose-700">{buyCheck.reason}</div>}
        </div>
      </div>
    )
  }

  if (st.ownerTeam === team) {
    return (
      <div className="rounded-xl border border-canvas-500 bg-canvas-100 p-4">
        <div className="text-[11px] uppercase tracking-widest text-ink-100">You own this</div>
        <div className="mt-1 flex items-baseline gap-3 flex-wrap">
          <span className="text-lg font-black text-ink-500">{def.name}</span>
          <span className="text-sm text-ink-100">No rent to pay. Consider building via Properties.</span>
        </div>
      </div>
    )
  }

  const owner = st.ownerTeam
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 rounded-xl border border-canvas-500 bg-canvas-100 p-4">
        <div className="text-[11px] uppercase tracking-widest text-ink-100">Opponent property — rent owed</div>
        <div className="mt-1 flex items-baseline gap-3 flex-wrap">
          <span className="text-lg font-black text-ink-500">{def.name}</span>
          <span className="text-sm">Owned by <TeamBadge team={owner} name={game.teams[owner].name} /></span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <Kv label="Full rent" v={st.mortgaged ? money(0) : money(rent)} />
          <Kv label="If correct (½)" v={st.mortgaged ? money(0) : money(Math.round(rent * game.config.rentEscapeFractionOnCorrect))} tone="ok" />
          <Kv label="If wrong (full)" v={st.mortgaged ? money(0) : money(rent)} tone="bad" />
        </div>
        {st.mortgaged && <div className="mt-2 text-xs text-amber-700">Property is mortgaged — no rent collected.</div>}
      </div>
      <div className="flex flex-col gap-2">
        <button className="btn btn-primary btn-lg" disabled={st.mortgaged || rent === 0} onClick={() => onRent(propertyId)}>
          Answer rent question →
        </button>
      </div>
    </div>
  )
}

function Kv({ label, v, tone }: { label: string; v: string; tone?: 'ok' | 'bad' }) {
  const cls = tone === 'ok' ? 'text-emerald-700' : tone === 'bad' ? 'text-rose-700' : 'text-ink-500'
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-ink-100">{label}</div>
      <div className={`num font-bold text-lg ${cls}`}>{v}</div>
    </div>
  )
}
