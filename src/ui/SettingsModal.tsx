import { useState } from 'react'
import { useGame } from '../store/gameStore'
import { Modal } from './primitives'

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const game = useGame(s => s.game)
  const update = useGame(s => s.updateConfig)
  const updateDecks = useGame(s => s.updateDecks)
  const updateQuestions = useGame(s => s.updateQuestions)

  const [tab, setTab] = useState<'rules' | 'decks' | 'questions'>('rules')
  const [cfg, setCfg] = useState(game?.config)
  const [chestJson, setChestJson] = useState(game ? JSON.stringify(game.chestDeck, null, 2) : '[]')
  const [chanceJson, setChanceJson] = useState(game ? JSON.stringify(game.chanceDeck, null, 2) : '[]')
  const [questionsJson, setQuestionsJson] = useState(game ? JSON.stringify(game.questions, null, 2) : '[]')
  const [err, setErr] = useState<string | null>(null)

  if (!open || !game || !cfg) return null

  const save = () => {
    setErr(null)
    try {
      const chest = JSON.parse(chestJson)
      const chance = JSON.parse(chanceJson)
      const qs = JSON.parse(questionsJson)
      update(cfg)
      updateDecks(chest, chance)
      updateQuestions(qs)
      onClose()
    } catch (e: unknown) {
      setErr('Invalid JSON: ' + (e as Error).message)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Settings & rules configuration" wide
      footer={<>
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={save}>Save</button>
      </>}>
      <div className="flex gap-1 mb-4">
        {(['rules', 'decks', 'questions'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors capitalize
              ${tab === t ? 'border-teamA-500 bg-teamA-50 text-teamA-700' : 'border-canvas-500 bg-white text-ink-100 hover:bg-canvas-100'}`}>
            {t === 'rules' ? 'Rules & economy' : t === 'decks' ? `Chest & Chance decks` : `Questions (${game.questions.length})`}
          </button>
        ))}
      </div>
      <div className={tab === 'rules' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}>
        {tab === 'rules' && <>
        <div>
          <div className="text-xs uppercase tracking-widest text-ink-100 mb-2">Economy</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['startingMoney', 'Starting money'],
              ['salary', 'Salary (per lap)'],
              ['jailFee', 'Jail fee'],
              ['auctionMinBid', 'Auction min bid'],
              ['incomeTax', 'Income tax'],
              ['superTax', 'Super tax'],
              ['maxChallenges', 'Max challenges'],
              ['maxChallengesPerTurn', 'Per turn'],
              ['questionTimeSeconds', 'Question time (sec)']
            ].map(([k, label]) => (
              <label key={k} className="block">
                <div className="text-[10px] uppercase tracking-widest text-ink-100 mb-1">{label}</div>
                <input type="number" value={(cfg as any)[k]}
                  onChange={e => setCfg({ ...cfg, [k]: Number(e.target.value) } as typeof cfg)}
                  className="w-full bg-white border border-canvas-500 rounded-md px-2 py-1 num" />
              </label>
            ))}
            <label className="block col-span-2">
              <div className="text-[10px] uppercase tracking-widest text-ink-100 mb-1">Game duration (ms)</div>
              <input type="number" value={cfg.gameDurationMs}
                onChange={e => setCfg({ ...cfg, gameDurationMs: Number(e.target.value) })}
                className="w-full bg-white border border-canvas-500 rounded-md px-2 py-1 num" />
            </label>
            <label className="block col-span-2">
              <div className="text-[10px] uppercase tracking-widest text-ink-100 mb-1">Auction question fail policy</div>
              <select value={cfg.auctionQuestionFailPolicy}
                onChange={e => setCfg({ ...cfg, auctionQuestionFailPolicy: e.target.value as typeof cfg.auctionQuestionFailPolicy })}
                className="w-full bg-white border border-canvas-500 rounded-md px-2 py-1 text-sm">
                <option value="unowned">Property stays unowned (safest)</option>
                <option value="transfer_no_charge">Property transfers, no charge</option>
                <option value="transfer_and_charge">Property transfers, bid charged</option>
              </select>
            </label>
          </div>
          <div className="text-xs uppercase tracking-widest text-ink-100 mt-4 mb-2">Rent multipliers</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['rentMultiplierSet', 'Full set'],
              ['rentMultiplierHouse1', '1 house'],
              ['rentMultiplierHouse2', '2 houses'],
              ['rentMultiplierHotel', 'Hotel'],
              ['mortgageFraction', 'Mortgage frac.'],
              ['rentEscapeFractionOnCorrect', 'Rent × on correct']
            ].map(([k, label]) => (
              <label key={k} className="block">
                <div className="text-[10px] uppercase tracking-widest text-ink-100 mb-1">{label}</div>
                <input type="number" step="0.1" value={(cfg as any)[k]}
                  onChange={e => setCfg({ ...cfg, [k]: Number(e.target.value) } as typeof cfg)}
                  className="w-full bg-white border border-canvas-500 rounded-md px-2 py-1 num" />
              </label>
            ))}
          </div>
        </div>
        </>}
        {tab === 'decks' && (
        <div>
          <div className="text-xs text-amber-800 mb-3 p-3 bg-amber-50 border border-amber-300 rounded-md">
            The Technopoly rules PDF does not enumerate Chest / Chance card contents. Replace these TEMPLATE cards with your physical deck's actual card texts and effects.
          </div>
          <div className="text-xs uppercase tracking-widest text-ink-100 mb-2">Chest deck (JSON)</div>
          <textarea rows={14} className="w-full bg-canvas-100 border border-canvas-500 rounded-md p-2 font-mono text-[11px]"
            value={chestJson} onChange={e => setChestJson(e.target.value)} />
          <div className="text-xs uppercase tracking-widest text-ink-100 mt-3 mb-2">Chance deck (JSON)</div>
          <textarea rows={14} className="w-full bg-canvas-100 border border-canvas-500 rounded-md p-2 font-mono text-[11px]"
            value={chanceJson} onChange={e => setChanceJson(e.target.value)} />
        </div>
        )}
        {tab === 'questions' && (
        <div>
          <div className="text-xs text-ink-200 mb-3 p-3 bg-teamA-50 border border-teamA-300 rounded-md">
            Question bank. Each entry: <code className="text-teamA-700">{'{ id, question, options[], correctIndex, difficulty, category, explanation? }'}</code>. Difficulty is one of <code>easy</code> / <code>medium</code> / <code>hard</code>. Category is optional (e.g. <code>DSA</code>, <code>C</code>, <code>General</code>).
          </div>
          <textarea rows={22} className="w-full bg-canvas-100 border border-canvas-500 rounded-md p-2 font-mono text-[11px]"
            value={questionsJson} onChange={e => setQuestionsJson(e.target.value)} />
        </div>
        )}
        {err && <div className="mt-2 text-xs text-rose-700">{err}</div>}
      </div>
    </Modal>
  )
}
