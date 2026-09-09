import { useEffect, useRef, useState } from 'react'
import { useGame, timerRemainingMs, timerElapsedMs } from '../store/gameStore'
import { fmtTime, TeamBadge, money } from './primitives'
import { exportReport } from '../lib/exportReport'
import { SettingsModal } from './SettingsModal'
import { ChallengeModal } from './ChallengeModal'
import { TradeModal } from './TradeModal'

// Simplified top navigation:
//   Primary row : brand · tabs · current team · timer · Start/Pause · End turn · ⋯
//   Menu (⋯)   : Trade · Challenge · Export · Settings · End game · New
//   Progress   : thin bar + elapsed + cash
export function TopNav() {
  const game = useGame(s => s.game)!
  const view = useGame(s => s.view)
  const setView = useGame(s => s.setView)
  const endTurn = useGame(s => s.endTurn)
  const resetGame = useGame(s => s.resetGame)
  const endGameManual = useGame(s => s.endGameManual)
  const startTimer = useGame(s => s.timerStart)
  const pauseTimer = useGame(s => s.timerPause)

  const [openMenu, setOpenMenu] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)
  const [openChallenge, setOpenChallenge] = useState(false)
  const [openTrade, setOpenTrade] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Local tick so the top-bar timer updates every 500ms even though the
  // Zustand game object reference doesn't change on the store's tick.
  const [, force] = useState(0)
  useEffect(() => {
    const id = setInterval(() => force(n => n + 1), 500)
    return () => clearInterval(id)
  }, [])

  // Close ⋯ menu on outside click / Escape.
  useEffect(() => {
    if (!openMenu) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenMenu(false) }
    document.addEventListener('mousedown', onClick)
    window.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); window.removeEventListener('keydown', onKey) }
  }, [openMenu])

  const remaining = timerRemainingMs(game)
  const critical = remaining <= 60_000
  const warning = remaining <= 5 * 60_000
  const t = game.teams[game.currentTurn]

  const Tab = ({ id, label }: { id: typeof view; label: string }) => (
    <button onClick={() => setView(id)}
      className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors
        ${view === id ? 'bg-white border-canvas-500 text-ink-500 shadow-card' : 'bg-transparent border-transparent text-ink-100 hover:bg-canvas-300'}`}>
      {label}
    </button>
  )

  const MenuItem = ({ icon, label, onClick, danger }: { icon: string; label: string; onClick: () => void; danger?: boolean }) => (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-canvas-200 rounded-md
        ${danger ? 'text-rose-700' : 'text-ink-300'}`}
      onClick={() => { setOpenMenu(false); onClick() }}>
      <span className="w-5 text-center">{icon}</span>
      <span>{label}</span>
    </button>
  )

  return (
    <>
    <div className="bg-white border-b border-canvas-400 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teamA-500 to-teamB-500 grid place-items-center font-black text-sm text-white shadow-card">Tp</div>
        <div className="min-w-0 hidden sm:block">
          <div className="text-sm font-extrabold tracking-tight leading-none">TECHNOPOLY</div>
          <div className="text-[9px] uppercase tracking-widest text-ink-100">GM Console</div>
        </div>

        <div className="ml-2 flex gap-1">
          <Tab id="dashboard" label="Live event" />
          <Tab id="landing_select" label="Landing" />
          <Tab id="properties" label="Properties" />
        </div>

        <div className="flex-1" />

        <div className="hidden lg:flex items-center gap-2 text-xs mr-1">
          <span className="text-ink-100">Turn <b className="text-ink-500 num">{game.turnNumber}</b></span>
          <TeamBadge team={game.currentTurn} name={t.name} />
        </div>

        <div className={`num text-xl font-black tabular-nums px-3 py-1 rounded-lg border
          ${critical ? 'bg-rose-50 border-rose-300 text-rose-700' : warning ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-canvas-100 border-canvas-500 text-ink-400'}`}>
          {fmtTime(remaining)}
        </div>
        {!game.timer.running
          ? <button className="btn btn-success" onClick={startTimer}>▶</button>
          : <button className="btn btn-warn" onClick={pauseTimer}>⏸</button>}

        <button className="btn btn-primary btn-lg" onClick={endTurn}>End turn ▶</button>

        <div className="relative" ref={menuRef}>
          <button
            className={`btn btn-ghost text-lg leading-none ${openMenu ? 'bg-canvas-300' : ''}`}
            aria-label="More actions"
            aria-expanded={openMenu}
            onClick={() => setOpenMenu(v => !v)}>
            ⋯
          </button>
          {openMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 card p-1.5 shadow-pop z-40">
              <MenuItem icon="⇄" label="Trade" onClick={() => setOpenTrade(true)} />
              <MenuItem icon="⚔" label="Challenge" onClick={() => setOpenChallenge(true)} />
              <div className="divider my-1" />
              <MenuItem icon="⬇" label="Export game report" onClick={() => exportReport(game)} />
              <MenuItem icon="⚙" label="Settings & rules" onClick={() => setOpenSettings(true)} />
              <div className="divider my-1" />
              <MenuItem icon="🏁" label="End game (declare winner)" danger
                onClick={() => { if (confirm('End the game manually? Wealth is calculated now.')) endGameManual() }} />
              <MenuItem icon="↺" label="New game (discard current)" danger
                onClick={() => { if (confirm('Discard this game and return to setup?')) resetGame() }} />
            </div>
          )}
        </div>
      </div>

      {/* Progress + elapsed strip */}
      <div className="max-w-7xl mx-auto px-4 pb-2">
        <div className="h-1 bg-canvas-300 rounded-full overflow-hidden">
          <div className={`h-full ${critical ? 'bg-rose-500' : warning ? 'bg-amber-500' : 'bg-gradient-to-r from-teamA-500 to-teamB-500'}`}
            style={{ width: `${Math.min(100, (timerElapsedMs(game.timer) / game.config.gameDurationMs) * 100)}%` }} />
        </div>
        <div className="text-[10px] text-ink-100 mt-1 flex items-center justify-between">
          <span>{fmtTime(timerElapsedMs(game.timer))} elapsed · {Math.round(game.config.gameDurationMs / 60000)} min game</span>
          <span className="lg:hidden flex items-center gap-1">Turn <b className="num text-ink-500">{game.turnNumber}</b> · <TeamBadge team={game.currentTurn} name={t.name} /></span>
          <span>Cash: <b className="num text-ink-500">{money(t.cash)}</b></span>
        </div>
      </div>
    </div>
    <SettingsModal open={openSettings} onClose={() => setOpenSettings(false)} />
    <ChallengeModal open={openChallenge} onClose={() => setOpenChallenge(false)} />
    <TradeModal open={openTrade} onClose={() => setOpenTrade(false)} />
    </>
  )
}
