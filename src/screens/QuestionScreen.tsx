import { useEffect, useMemo, useState } from 'react'
import { useGame, PROPERTIES_BY_ID } from '../store/gameStore'
import type { PendingQuestion } from '../engine/types'
import { TeamBadge, fmtTime, money } from '../ui/primitives'

// Full-page dedicated question experience. Renders whenever
// game.pendingQuestion is present. The team selects their own answer, the
// website validates, then continues the intent.
export function QuestionScreen() {
  const game = useGame(s => s.game)!
  const pending = game.pendingQuestion!
  const resolve = useGame(s => s.resolvePendingQuestion)
  const cancel = useGame(s => s.cancelPendingQuestion)

  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    setSelected(null); setSubmitted(false); setTimedOut(false)
  }, [pending.question.id])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [])

  const remainingMs = Math.max(0, pending.startedAtMs + pending.timeLimitMs - now)
  const criticalTimer = remainingMs < 5_000 && !submitted

  useEffect(() => {
    if (submitted) return
    if (remainingMs <= 0 && !timedOut) {
      setTimedOut(true); setSubmitted(true)
    }
  }, [remainingMs, submitted, timedOut])

  const correct = selected != null && selected === pending.question.correctIndex && !timedOut

  const submit = () => {
    if (submitted || selected == null) return
    setSubmitted(true)
  }

  const continueFlow = () => resolve(correct)

  const property = 'propertyId' in pending.intent ? PROPERTIES_BY_ID[(pending.intent as { propertyId: string }).propertyId] : null

  const contextTitle = useMemo(() => intentTitle(pending), [pending])

  const diffColor = {
    easy:        'bg-emerald-100 text-emerald-800 border-emerald-300',
    medium:      'bg-amber-100 text-amber-800 border-amber-300',
    medium_hard: 'bg-orange-100 text-orange-800 border-orange-300',
    hard:        'bg-rose-100 text-rose-800 border-rose-300'
  }[pending.difficulty]

  return (
    <div className="min-h-screen surface flex flex-col">
      {/* Top strip */}
      <div className="bg-white border-b border-canvas-400">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teamA-500 to-teamB-500 grid place-items-center font-black text-white text-sm">Tp</div>
          <div className="text-sm font-bold tracking-tight">TECHNOPOLY</div>
          <div className="text-xs uppercase tracking-widest text-ink-100 hidden sm:block">Question</div>
          <div className="flex-1" />
          <TeamBadge team={pending.team} name={game.teams[pending.team].name} large />
          <div className={`num text-2xl font-black tabular-nums px-3 py-1 rounded-lg border
            ${criticalTimer ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-canvas-100 border-canvas-500 text-ink-400'}`}>
            {fmtTime(remainingMs)}
          </div>
        </div>
      </div>

      {/* Question body */}
      <div className="flex-1 grid place-items-center py-8 px-4">
        <div className="w-full max-w-4xl animate-flyup">
          <div className="text-center mb-6">
            <div className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border ${diffColor}`}>
              {pending.difficulty} · {pending.question.category ?? 'General'}
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-widest text-ink-100">{contextTitle}</div>
            {property && <div className="text-2xl font-black text-ink-500 mt-1">{property.name}</div>}
          </div>

          <div className="card p-8 shadow-pop">
            <QuestionBody question={pending.question} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
              {pending.question.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i)
                const isSelected = selected === i
                const isCorrect = i === pending.question.correctIndex
                const revealed = submitted
                const style = revealed
                  ? (isCorrect
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                      : isSelected
                        ? 'border-rose-400 bg-rose-50 text-rose-900'
                        : 'border-canvas-500 bg-white text-ink-100 opacity-60')
                  : (isSelected
                      ? 'border-teamA-500 bg-teamA-50 text-teamA-700 shadow-ring'
                      : 'border-canvas-500 bg-white text-ink-300 hover:border-teamA-300 hover:bg-canvas-100')
                return (
                  <button key={i} disabled={submitted}
                    onClick={() => setSelected(i)}
                    className={`text-left border rounded-xl px-5 py-4 flex items-center gap-3 transition-all ${style}`}>
                    <span className={`grid place-items-center w-9 h-9 rounded-lg font-bold text-base shrink-0 border
                      ${revealed && isCorrect ? 'bg-emerald-500 text-white border-emerald-600'
                        : revealed && isSelected ? 'bg-rose-500 text-white border-rose-600'
                        : isSelected ? 'bg-teamA-500 text-white border-teamA-600'
                        : 'bg-canvas-200 text-ink-300 border-canvas-500'}`}>{letter}</span>
                    <span className="text-base md:text-lg font-medium">{opt}</span>
                    {revealed && isCorrect && <span className="ml-auto text-emerald-700 text-xs font-bold">Correct</span>}
                    {revealed && isSelected && !isCorrect && <span className="ml-auto text-rose-700 text-xs font-bold">Your answer</span>}
                  </button>
                )
              })}
            </div>

            {!submitted && (
              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="text-xs text-ink-100">
                  {selected == null ? 'Select an answer.' : 'Click Submit when ready.'}
                </div>
                <div className="flex gap-2">
                  <button className="btn" onClick={cancel}>Cancel</button>
                  <button className="btn btn-primary btn-lg" onClick={submit} disabled={selected == null}>Submit answer</button>
                </div>
              </div>
            )}

            {submitted && (
              <div className={`mt-6 p-4 rounded-xl border-2 flex items-start gap-3 animate-celebrate
                ${correct ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'}`}>
                <div className={`w-10 h-10 grid place-items-center rounded-full font-black text-white text-lg
                  ${correct ? 'bg-emerald-500' : 'bg-rose-500'}`}>{correct ? '✓' : '✕'}</div>
                <div className="flex-1">
                  <div className={`text-lg font-black ${correct ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {correct ? 'Correct!' : (timedOut ? 'Time out — marked incorrect.' : 'Incorrect.')}
                  </div>
                  <div className="text-sm text-ink-300 mt-1">
                    Correct answer: <b>{String.fromCharCode(65 + pending.question.correctIndex)}. {pending.question.options[pending.question.correctIndex]}</b>
                  </div>
                  {pending.question.explanation && (
                    <div className="text-xs text-ink-100 mt-2 italic">{pending.question.explanation}</div>
                  )}
                  <div className="text-xs text-ink-100 mt-2">{consequenceHint(pending, correct, game)}</div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={continueFlow}>Continue →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function intentTitle(p: PendingQuestion): string {
  switch (p.intent.kind) {
    case 'purchase': return 'Property purchase'
    case 'build_house': return 'Build house'
    case 'build_hotel': return 'Build hotel'
    case 'rent': return 'Rent — correct answer escapes 50%'
    case 'chance': return 'CHANCE card'
    case 'jail_exit': return 'Code Hunt exit'
    case 'auction_award': return `Auction award — winning bid ${money(p.intent.winningBid)}`
    case 'challenge_attack': return 'Challenge — attacker'
    case 'challenge_defend': return 'Challenge — defender'
  }
}

function consequenceHint(p: PendingQuestion, correct: boolean, game: import('../engine/types').Game): string {
  const intent = p.intent
  switch (intent.kind) {
    case 'purchase':
      return correct ? `You will purchase the property.` : `Purchase declined; property remains unowned.`
    case 'build_house':
      return correct ? `House will be built.` : `House not built.`
    case 'build_hotel':
      return correct ? `Hotel will be built.` : `Hotel not built.`
    case 'rent':
      return correct
        ? `You'll pay ${Math.round(game.config.rentEscapeFractionOnCorrect * 100)}% of the rent.`
        : `You'll pay the full rent.`
    case 'chance':
      return correct ? `A CHANCE card will be drawn and applied.` : `No card drawn.`
    case 'jail_exit':
      return correct ? `Free exit from Code Hunt.` : `Pay ₹${game.config.jailFee} and exit Code Hunt.`
    case 'auction_award':
      return correct ? `The property transfers to you and ${money(intent.winningBid)} is charged.` : (
        game.config.auctionQuestionFailPolicy === 'transfer_and_charge' ? `Property transfers and ${money(intent.winningBid)} is charged (per rule).` :
        game.config.auctionQuestionFailPolicy === 'transfer_no_charge' ? `Property transfers without payment (per rule).` :
        `Property stays unowned (per rule).`
      )
    case 'challenge_attack':
      return correct ? `Defender must now answer.` : `Challenge fails.`
    case 'challenge_defend':
      return correct ? `Successful defence — property stays.` : `Property transfers to the attacker.`
  }
}

function QuestionBody({ question }: { question: import('../engine/types').Question }) {
  const { question: text, code } = question

  if (!code) {
    return (
      <div className="text-2xl md:text-3xl font-bold text-ink-500 leading-snug text-center whitespace-pre-line">
        {text}
      </div>
    )
  }

  // Code questions: keep the prompt above the block, left-aligned to line up
  // with the code, and a touch smaller so prompt + code fit comfortably.
  return (
    <div className="space-y-4">
      {text && (
        <div className="text-lg md:text-2xl font-bold text-ink-500 leading-snug text-left whitespace-pre-line">
          {text}
        </div>
      )}
      <pre className="bg-slate-50 border border-slate-200 border-l-[3px] border-l-indigo-400 rounded-xl px-5 py-4 text-sm md:text-base leading-relaxed font-mono text-slate-800 text-left overflow-x-auto whitespace-pre [tab-size:2]" tabIndex={0} aria-label="Code listing">{code}</pre>
    </div>
  )
}
