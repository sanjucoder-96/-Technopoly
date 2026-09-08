import { useMemo, useState } from 'react'
import { useGame, PROPERTIES, DEFAULT_CONFIG } from '../store/gameStore'
import { money } from '../ui/primitives'

export function SetupScreen() {
  const newGame = useGame(s => s.newGame)
  const loadDemo = useGame(s => s.loadDemo)

  const [teamA, setTeamA] = useState('Team A')
  const [teamB, setTeamB] = useState('Team B')
  const [startingMoney, setStartingMoney] = useState(DEFAULT_CONFIG.startingMoney)
  const [duration, setDuration] = useState(Math.round(DEFAULT_CONFIG.gameDurationMs / 60000))
  const [salary, setSalary] = useState(DEFAULT_CONFIG.salary)
  const [jailFee, setJailFee] = useState(DEFAULT_CONFIG.jailFee)
  const [auctionMin, setAuctionMin] = useState(DEFAULT_CONFIG.auctionMinBid)
  const [incomeTax, setIncomeTax] = useState(DEFAULT_CONFIG.incomeTax)
  const [superTax, setSuperTax] = useState(DEFAULT_CONFIG.superTax)
  const [maxChallenges, setMaxChallenges] = useState(DEFAULT_CONFIG.maxChallenges)
  const [questionSeconds, setQuestionSeconds] = useState(DEFAULT_CONFIG.questionTimeSeconds)
  const [startingTeam, setStartingTeam] = useState<'coin' | 'A' | 'B'>('coin')

  const board = useMemo(() => ({
    total: 40,
    locs: PROPERTIES.filter(p => p.type === 'property').length,
    rails: PROPERTIES.filter(p => p.type === 'railway').length,
    utils: PROPERTIES.filter(p => p.type === 'utility').length
  }), [])

  const start = () => {
    newGame({
      teamAName: teamA.trim() || 'Team A',
      teamBName: teamB.trim() || 'Team B',
      startingTeam: startingTeam === 'coin' ? undefined : startingTeam,
      config: {
        startingMoney,
        gameDurationMs: duration * 60_000,
        salary,
        jailFee,
        auctionMinBid: auctionMin,
        incomeTax,
        superTax,
        maxChallenges,
        questionTimeSeconds: questionSeconds
      }
    })
  }

  return (
    <div className="min-h-screen surface">
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-24">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teamA-500 to-teamB-500 grid place-items-center font-black text-white shadow-pop">Tp</div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">TECHNOPOLY</h1>
            <div className="text-xs uppercase tracking-widest text-ink-100">Game Master Console — Offline</div>
          </div>
        </div>
        <p className="text-ink-200 mt-2 max-w-2xl">
          Set up the two teams. The physical board, dice and tokens belong to the players — this app displays questions, tracks money, ownership, wealth, rent, auctions, trades, challenges and the timer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
          <TeamCard label="Team A" tone="a" name={teamA} onChange={setTeamA} />
          <TeamCard label="Team B" tone="b" name={teamB} onChange={setTeamB} />
        </div>

        <div className="card p-5 mt-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-ink-100 mb-4">Rules & Economy</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <NumField label="Starting money" value={startingMoney} onChange={setStartingMoney} step={50} />
            <NumField label="Game duration (min)" value={duration} onChange={setDuration} step={5} min={1} />
            <NumField label="Salary (per lap)" value={salary} onChange={setSalary} step={50} />
            <NumField label="Jail fee" value={jailFee} onChange={setJailFee} step={10} />
            <NumField label="Auction min bid" value={auctionMin} onChange={setAuctionMin} step={5} />
            <NumField label="Income tax" value={incomeTax} onChange={setIncomeTax} step={10} />
            <NumField label="Super tax" value={superTax} onChange={setSuperTax} step={10} />
            <NumField label="Max challenges" value={maxChallenges} onChange={setMaxChallenges} step={1} min={0} />
            <NumField label="Question time (sec)" value={questionSeconds} onChange={setQuestionSeconds} step={5} min={5} />
          </div>

          <div className="mt-4">
            <div className="text-[10px] uppercase tracking-widest text-ink-100 mb-1">Starting team</div>
            <div className="flex gap-2">
              {(['coin', 'A', 'B'] as const).map(v => (
                <button key={v} className={`btn ${startingTeam === v ? 'btn-primary' : ''}`} onClick={() => setStartingTeam(v)}>
                  {v === 'coin' ? 'Coin toss' : `Team ${v}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5 mt-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-ink-100 mb-3">Board summary (from the rules document)</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
            <Item label="Total spaces" v={board.total.toString()} />
            <Item label="Locations" v={`${board.locs}`} />
            <Item label="Railways" v={`${board.rails}`} />
            <Item label="Utilities" v={`${board.utils}`} />
            <Item label="Chest / Chance / Tax / Jail / Free" v="3 / 3 / 2 / 1+1 / 1" />
          </div>
          <div className="mt-3 text-xs text-ink-100">
            Every property price, rent and card is editable from the in-game <b>Settings</b> panel.
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="text-xs text-ink-100">
            You'll start with {money(startingMoney)} per team. Game runs for {duration} minutes.
          </div>
          <div className="flex gap-2">
            <button className="btn" onClick={loadDemo}>Load demo game</button>
            <button className="btn btn-primary btn-lg" onClick={start}>Start game ▶</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamCard({ label, tone, name, onChange }: { label: string; tone: 'a' | 'b'; name: string; onChange: (v: string) => void }) {
  return (
    <div className={`card p-5 ${tone === 'a' ? 'team-a-tint' : 'team-b-tint'} border-2`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2.5 h-2.5 rounded-full ${tone === 'a' ? 'bg-teamA-500' : 'bg-teamB-500'}`} />
        <div className="text-[11px] uppercase tracking-widest text-ink-100 font-semibold">{label}</div>
      </div>
      <input
        value={name}
        onChange={e => onChange(e.target.value)}
        placeholder={label}
        className="w-full bg-white border border-canvas-500 rounded-lg px-3 py-2 text-lg font-bold outline-none focus:border-teamA-400"
      />
    </div>
  )
}

function NumField({ label, value, onChange, step = 1, min = 0 }: { label: string; value: number; onChange: (n: number) => void; step?: number; min?: number }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-widest text-ink-100 mb-1">{label}</div>
      <input
        type="number"
        value={value}
        min={min}
        step={step}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full bg-white border border-canvas-500 rounded-lg px-3 py-2 num outline-none focus:border-teamA-400"
      />
    </label>
  )
}

function Item({ label, v }: { label: string; v: string }) {
  return (
    <div className="card p-3">
      <div className="text-[10px] uppercase tracking-widest text-ink-100">{label}</div>
      <div className="text-sm font-bold text-ink-400">{v}</div>
    </div>
  )
}
