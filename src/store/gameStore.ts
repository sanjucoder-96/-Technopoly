import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Card, Config, Game, GameEvent, PendingQuestion, PropertyDef, Question, QuestionContext, QuestionIntent, TeamId } from '../engine/types'
import { pickQuestion, recordAnswer } from '../engine/questionEngine'
import {
  applyCard, awardAuctionWithQuestion, buildHotel, buildHouse,
  canBuildHotel, canBuildHouse, canChallenge, canCoverDeficit, canExecuteTrade, canMortgage,
  canPurchase, checkBankruptcy, checkTimeExpiry, collectRent, correctCashEvent,
  createGame, drawRandomCard, endGame, endTurn, executeTrade, finishAuction,
  logEvent, mortgage, otherTeam, pauseTimer, pay, payTax, placeBid, purchase,
  resetTimer, resolveChallenge, sellHotel, sellHouse, sendToJail, setLandingSpace,
  startAuction, startTimer, timerElapsedMs, timerRemainingMs, unmortgage,
  validateBid, wealthBreakdown, attemptJailExit,
  BOARD, PROPERTIES, PROPERTIES_BY_ID
} from '../engine/engine'
import type { Auction, TradePayload, WealthBreakdown } from '../engine/engine'
import { DEFAULT_CHANCE_DECK, DEFAULT_CHEST_DECK } from '../engine/cards'
import { DEFAULT_CONFIG } from '../engine/config'

interface Toast {
  id: string
  kind: 'info' | 'success' | 'warn' | 'error'
  title: string
  message?: string
  ts: number
}

interface AuctionUI extends Auction { name: string }

interface Store {
  game: Game | null
  auction: AuctionUI | null
  toasts: Toast[]
  view: 'dashboard' | 'landing_select' | 'properties'

  // Setup / lifecycle
  newGame: (opts: { teamAName: string; teamBName: string; config?: Partial<Config>; startingTeam?: TeamId; chestDeck?: Card[]; chanceDeck?: Card[]; questions?: Question[] }) => void
  loadDemo: () => void
  resetGame: () => void
  setView: (v: Store['view']) => void

  // Timer
  timerStart: () => void
  timerPause: () => void
  timerReset: () => void
  timerTick: () => void

  // Turn
  landOn: (spaceIndex: number) => void
  markLandingResolved: () => void
  endTurn: () => void

  // Property flows — these open a pendingQuestion when a question is required.
  requestPurchase: (propertyId: string) => void
  requestBuildHouse: (propertyId: string) => void
  requestBuildHotel: (propertyId: string) => void
  requestRent: (propertyId: string) => void

  // Direct helpers (no question)
  mortgage: (propertyId: string) => void
  unmortgage: (propertyId: string) => void
  sellHouse: (propertyId: string) => void
  sellHotel: (propertyId: string) => void

  // Auction
  auctionStart: (propertyId: string, initiator: TeamId) => void
  auctionBid: (team: TeamId, amount: number) => void
  auctionFinish: () => void
  auctionCancel: () => void
  validateAuctionBid: (team: TeamId, amount: number) => { ok: boolean; reason?: string }

  // Trade
  trade: (aGives: TradePayload, bGives: TradePayload) => void

  // Challenge
  requestChallenge: (attacker: TeamId, propertyId: string) => void

  // Chest / Chance
  drawChestNow: () => Card
  requestChance: () => void
  applyCard: (card: Card, team?: TeamId) => string
  dismissLastCard: () => void

  // Jail
  requestJailExit: (team: TeamId) => void
  useJailCard: (team: TeamId) => void
  sendToJail: (team: TeamId, reason: string) => void

  // Tax
  payTax: (team: TeamId, amount: number, label: string) => void

  // Config
  updateConfig: (patch: Partial<Config>) => void
  updateDecks: (chest: Card[], chance: Card[]) => void
  updateQuestions: (questions: Question[]) => void

  // Wealth (derived)
  wealth: (team: TeamId) => WealthBreakdown | null

  // Question resolution — called by QuestionScreen after team answers.
  resolvePendingQuestion: (correct: boolean) => void
  cancelPendingQuestion: () => void

  // Notes/history
  correctCashEvent: (eventId: string, note: string) => void
  addCustomEvent: (message: string) => void

  // Toast helpers
  toast: (t: Omit<Toast, 'id' | 'ts'>) => void
  dismissToast: (id: string) => void

  // Bankruptcy manual
  declareBankruptcy: (team: TeamId) => void

  // End game manual
  endGameManual: () => void
}

const STORAGE_KEY = 'technopoly-gm-state-v2'

const cloneGame = (g: Game): Game => JSON.parse(JSON.stringify(g)) as Game

function withGame(g: Game | null, fn: (draft: Game) => void): Game | null {
  if (!g) return g
  const draft = cloneGame(g)
  fn(draft)
  return draft
}

// Build a PendingQuestion for a given intent + difficulty, using the question
// bank. Returns null if no matching question exists.
function makePending(g: Game, intent: QuestionIntent, difficulty: Game['config']['challengeQuestionLevel'], team: TeamId, context: QuestionContext): PendingQuestion | null {
  const question = pickQuestion(g, { difficulty })
  if (!question) return null
  return {
    question,
    team,
    difficulty,
    context,
    startedAtMs: Date.now(),
    timeLimitMs: (g.config.questionTimeLimits[difficulty] ?? g.config.questionTimeSeconds) * 1000,
    intent
  }
}

export const useGame = create<Store>()(
  persist(
    (set, get) => ({
      game: null,
      auction: null,
      toasts: [],
      view: 'dashboard',

      newGame: (opts) => {
        const game = createGame(opts)
        set({ game, auction: null, view: 'dashboard' })
        get().toast({ kind: 'success', title: 'Game created', message: `${game.teams.A.name} vs ${game.teams.B.name}` })
      },

      loadDemo: () => {
        const g = createGame({ teamAName: 'Nova Labs', teamBName: 'Kernel Panic' })
        g.teams.A.cash = 1120
        g.teams.B.cash = 940
        g.properties['loc-2'].ownerTeam = 'A'
        g.properties['loc-3'].ownerTeam = 'A'
        g.properties['loc-4'].ownerTeam = 'A'
        g.properties['loc-2'].houses = 1
        g.properties['loc-2'].houseInvestment = 50
        g.properties['loc-8'].ownerTeam = 'B'
        g.properties['loc-9'].ownerTeam = 'B'
        g.properties['loc-10'].ownerTeam = 'B'
        g.properties['rail-0'].ownerTeam = 'A'
        g.properties['rail-1'].ownerTeam = 'B'
        g.properties['util-0'].ownerTeam = 'B'
        logEvent(g, { type: 'note', message: 'Demo state seeded.' })
        set({ game: g, auction: null, view: 'dashboard' })
      },

      resetGame: () => set({ game: null, auction: null, toasts: [], view: 'dashboard' }),
      setView: (v) => set({ view: v }),

      timerStart: () => set({ game: withGame(get().game, startTimer) }),
      timerPause: () => set({ game: withGame(get().game, pauseTimer) }),
      timerReset: () => set({ game: withGame(get().game, resetTimer) }),
      timerTick: () => {
        const g = get().game
        if (!g || g.phase === 'ended') return
        if (timerRemainingMs(g) <= 0) {
          set({ game: withGame(g, checkTimeExpiry) })
          get().toast({ kind: 'warn', title: 'Time is up', message: 'Game has ended.' })
        } else {
          set({})
        }
      },

      landOn: (spaceIndex) => {
        const g = get().game
        if (!g) return
        set({ game: withGame(g, (d) => { setLandingSpace(d, d.currentTurn, spaceIndex) }), view: 'dashboard' })
      },
      markLandingResolved: () => set({ game: withGame(get().game, (d) => { if (d.landing) d.landing.resolved = true }) }),
      endTurn: () => set({ game: withGame(get().game, (d) => { endTurn(d); d.lastDrawnCard = null }) }),

      requestPurchase: (propertyId) => {
        const g = get().game; if (!g) return
        const def = PROPERTIES_BY_ID[propertyId]
        set({ game: withGame(g, (d) => {
          d.pendingQuestion = makePending(d, { kind: 'purchase', propertyId }, def.questionLevel, d.currentTurn, { kind: 'purchase', propertyId })
        }) })
      },
      requestBuildHouse: (propertyId) => {
        const g = get().game; if (!g) return
        const def = PROPERTIES_BY_ID[propertyId]
        set({ game: withGame(g, (d) => {
          d.pendingQuestion = makePending(d, { kind: 'build_house', propertyId }, def.questionLevel, d.currentTurn, { kind: 'build_house', propertyId })
        }) })
      },
      requestBuildHotel: (propertyId) => {
        const g = get().game; if (!g) return
        const def = PROPERTIES_BY_ID[propertyId]
        set({ game: withGame(g, (d) => {
          d.pendingQuestion = makePending(d, { kind: 'build_hotel', propertyId }, def.questionLevel, d.currentTurn, { kind: 'build_hotel', propertyId })
        }) })
      },
      requestRent: (propertyId) => {
        const g = get().game; if (!g) return
        const def = PROPERTIES_BY_ID[propertyId]
        const payingTeam = g.currentTurn
        set({ game: withGame(g, (d) => {
          d.pendingQuestion = makePending(d, { kind: 'rent', propertyId, payingTeam }, def.questionLevel, payingTeam, { kind: 'purchase', propertyId })
        }) })
      },
      requestChance: () => {
        const g = get().game; if (!g) return
        set({ game: withGame(g, (d) => {
          d.pendingQuestion = makePending(d, { kind: 'chance' }, 'medium', d.currentTurn, { kind: 'chance' })
        }) })
      },
      requestJailExit: (team) => {
        const g = get().game; if (!g) return
        set({ game: withGame(g, (d) => {
          d.pendingQuestion = makePending(d, { kind: 'jail_exit', team }, 'medium', team, { kind: 'jail_exit' })
        }) })
      },
      useJailCard: (team) => {
        set({ game: withGame(get().game, (d) => { attemptJailExit(d, team, { correct: false, useCard: true }) }) })
      },
      sendToJail: (team, reason) => set({ game: withGame(get().game, (d) => { sendToJail(d, team, reason) }) }),
      requestChallenge: (attacker, propertyId) => {
        const g = get().game; if (!g) return
        const def = PROPERTIES_BY_ID[propertyId]
        set({ game: withGame(g, (d) => {
          d.pendingQuestion = makePending(d, { kind: 'challenge_attack', propertyId, attacker }, def.questionLevel, attacker, { kind: 'challenge_attack', propertyId })
        }) })
      },

      mortgage: (propertyId) => {
        const g = get().game; if (!g) return
        // Mortgaging is done on behalf of the property's owner — not the team
        // on the clock. This lets the Raise Funds workflow mortgage a deficit
        // team's assets even during the other team's turn.
        const owner = g.properties[propertyId]?.ownerTeam
        if (!owner) { get().toast({ kind: 'error', title: 'Mortgage failed', message: 'Property is unowned.' }); return }
        try { set({ game: withGame(g, (d) => { mortgage(d, owner, propertyId) }) }); get().toast({ kind: 'info', title: 'Mortgaged', message: PROPERTIES_BY_ID[propertyId]?.name }) }
        catch (e: unknown) { get().toast({ kind: 'error', title: 'Mortgage failed', message: (e as Error).message }) }
      },
      unmortgage: (propertyId) => {
        const g = get().game; if (!g) return
        const owner = g.properties[propertyId]?.ownerTeam
        if (!owner) { get().toast({ kind: 'error', title: 'Unmortgage failed', message: 'Property is unowned.' }); return }
        try { set({ game: withGame(g, (d) => { unmortgage(d, owner, propertyId) }) }); get().toast({ kind: 'success', title: 'Unmortgaged', message: PROPERTIES_BY_ID[propertyId]?.name }) }
        catch (e: unknown) { get().toast({ kind: 'error', title: 'Unmortgage failed', message: (e as Error).message }) }
      },
      sellHouse: (propertyId) => {
        const g = get().game; if (!g) return
        const owner = g.properties[propertyId]?.ownerTeam
        if (!owner) { get().toast({ kind: 'error', title: 'Sell failed', message: 'Property is unowned.' }); return }
        try { set({ game: withGame(g, (d) => { sellHouse(d, owner, propertyId) }) }); get().toast({ kind: 'info', title: 'Sold house' }) }
        catch (e: unknown) { get().toast({ kind: 'error', title: 'Sell failed', message: (e as Error).message }) }
      },
      sellHotel: (propertyId) => {
        const g = get().game; if (!g) return
        const owner = g.properties[propertyId]?.ownerTeam
        if (!owner) { get().toast({ kind: 'error', title: 'Sell failed', message: 'Property is unowned.' }); return }
        try { set({ game: withGame(g, (d) => { sellHotel(d, owner, propertyId) }) }); get().toast({ kind: 'info', title: 'Sold hotel' }) }
        catch (e: unknown) { get().toast({ kind: 'error', title: 'Sell failed', message: (e as Error).message }) }
      },

      auctionStart: (propertyId, initiator) => {
        const g = get().game; if (!g) return
        let a: Auction | null = null
        set({ game: withGame(g, (d) => { a = startAuction(d, propertyId, initiator) }) })
        if (a) set({ auction: { ...(a as Auction), name: PROPERTIES_BY_ID[propertyId]!.name } })
      },
      auctionBid: (team, amount) => {
        const g = get().game; const a = get().auction; if (!g || !a) return
        try {
          let next: Auction | null = null
          set({ game: withGame(g, (d) => { next = placeBid(d, a, team, amount) }) })
          if (next) set({ auction: { ...(next as Auction), name: a.name } })
        } catch (e: unknown) {
          get().toast({ kind: 'error', title: 'Bid rejected', message: (e as Error).message })
        }
      },
      auctionFinish: () => {
        const g = get().game; const a = get().auction; if (!g || !a) return
        let next: Auction | null = null
        set({ game: withGame(g, (d) => { next = finishAuction(d, a) }) })
        if (next) {
          set({ auction: { ...(next as Auction), name: a.name } })
          const done = next as Auction
          // If a winner was declared (not suspended), open the property question.
          if (done.currentBidder && !done.suspended) {
            const def = PROPERTIES_BY_ID[done.propertyId]
            set({ game: withGame(get().game, (d) => {
              d.pendingQuestion = makePending(d, {
                kind: 'auction_award',
                propertyId: done.propertyId,
                winningTeam: done.currentBidder!,
                winningBid: done.currentBid
              }, def.questionLevel, done.currentBidder!, { kind: 'purchase', propertyId: done.propertyId })
            }) })
          }
        }
      },
      auctionCancel: () => set({ auction: null }),
      validateAuctionBid: (team, amount) => {
        const g = get().game; const a = get().auction
        if (!g || !a) return { ok: false, reason: 'No auction.' }
        return validateBid(g, a, team, amount)
      },

      trade: (aGives, bGives) => {
        const g = get().game; if (!g) return
        const check = canExecuteTrade(g, aGives, bGives)
        if (!check.ok) { get().toast({ kind: 'error', title: 'Trade invalid', message: check.reason }); return }
        set({ game: withGame(g, (d) => { executeTrade(d, aGives, bGives) }) })
        get().toast({ kind: 'success', title: 'Trade completed' })
      },

      drawChestNow: () => {
        const g = get().game!; const card = drawRandomCard(g.chestDeck)
        set({ game: withGame(g, (d) => {
          logEvent(d, { type: 'chest_drawn', team: d.currentTurn, cardId: card.id, message: `Chest drawn: ${card.title} — ${card.description}` })
          d.lastDrawnCard = { card, team: d.currentTurn, ts: Date.now() }
        }) })
        return card
      },
      applyCard: (card, team) => {
        const g = get().game!; let summary = ''
        set({ game: withGame(g, (d) => { summary = applyCard(d, team ?? d.currentTurn, card) }) })
        get().toast({ kind: 'info', title: card.title, message: summary })
        return summary
      },
      dismissLastCard: () => set({ game: withGame(get().game, (d) => { d.lastDrawnCard = null }) }),
      addCustomEvent: (message) => set({ game: withGame(get().game, (d) => { logEvent(d, { type: 'note', team: d.currentTurn, message }) }) }),

      payTax: (team, amount, label) => set({ game: withGame(get().game, (d) => { payTax(d, team, amount, label) }) }),

      updateConfig: (patch) => set({ game: withGame(get().game, (d) => { d.config = { ...d.config, ...patch }; logEvent(d, { type: 'note', message: 'Config updated by GM.' }) }) }),
      updateDecks: (chest, chance) => set({ game: withGame(get().game, (d) => { d.chestDeck = chest; d.chanceDeck = chance; logEvent(d, { type: 'note', message: 'Card decks updated by GM.' }) }) }),
      updateQuestions: (questions) => set({ game: withGame(get().game, (d) => { d.questions = questions; logEvent(d, { type: 'note', message: `Question bank updated (${questions.length} questions).` }) }) }),

      wealth: (team) => {
        const g = get().game; if (!g) return null; return wealthBreakdown(g, team)
      },

      resolvePendingQuestion: (correct) => {
        const g = get().game; if (!g || !g.pendingQuestion) return
        const pending = g.pendingQuestion
        const intent = pending.intent

        set({ game: withGame(g, (d) => {
          if (!d.pendingQuestion) return
          const q = d.pendingQuestion.question
          recordAnswer(d, { question: q, team: d.pendingQuestion.team, context: d.pendingQuestion.context, correct })
          // Apply intent-specific consequences.
          switch (intent.kind) {
            case 'purchase':
              purchase(d, d.currentTurn, intent.propertyId, correct)
              break
            case 'build_house':
              buildHouse(d, d.currentTurn, intent.propertyId, correct)
              break
            case 'build_hotel':
              buildHotel(d, d.currentTurn, intent.propertyId, correct)
              break
            case 'rent':
              collectRent(d, intent.payingTeam, intent.propertyId, { correct })
              break
            case 'chance':
              if (correct) {
                const card = drawRandomCard(d.chanceDeck)
                logEvent(d, { type: 'chance_drawn', team: d.currentTurn, cardId: card.id, message: `Chance drawn: ${card.title} — ${card.description}` })
                applyCard(d, d.currentTurn, card)
                d.lastDrawnCard = { card, team: d.currentTurn, ts: Date.now() }
              } else {
                logEvent(d, { type: 'chance_drawn', team: d.currentTurn, message: 'Chance question failed — no card drawn.' })
              }
              break
            case 'jail_exit':
              attemptJailExit(d, intent.team, { correct })
              break
            case 'auction_award':
              awardAuctionWithQuestion(d, { propertyId: intent.propertyId, winningTeam: intent.winningTeam, winningBid: intent.winningBid, correct })
              break
            case 'challenge_attack':
              if (correct) {
                // Move to defender question
                const def = PROPERTIES_BY_ID[intent.propertyId]
                const defender = otherTeam(intent.attacker)
                d.pendingQuestion = makePending(d, { kind: 'challenge_defend', propertyId: intent.propertyId, attacker: intent.attacker, defender }, def.questionLevel, defender, { kind: 'challenge_defend', propertyId: intent.propertyId })
                return
              } else {
                resolveChallenge(d, intent.attacker, intent.propertyId, { attackerCorrect: false })
              }
              break
            case 'challenge_defend':
              resolveChallenge(d, intent.attacker, intent.propertyId, { attackerCorrect: true, defenderCorrect: correct })
              break
          }
          d.pendingQuestion = null
        }) })

        // Close auction UI if it was awarded (either transferred or refused).
        if (intent.kind === 'auction_award') set({ auction: null })
      },
      cancelPendingQuestion: () => set({ game: withGame(get().game, (d) => { d.pendingQuestion = null }) }),

      correctCashEvent: (eventId, note) => {
        try { set({ game: withGame(get().game, (d) => { correctCashEvent(d, eventId, note) }) }); get().toast({ kind: 'info', title: 'Correction applied' }) }
        catch (e: unknown) { get().toast({ kind: 'error', title: 'Correction failed', message: (e as Error).message }) }
      },

      toast: (t) => set(s => ({ toasts: [...s.toasts, { ...t, id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ts: Date.now() }] })),
      dismissToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

      declareBankruptcy: (team) => {
        set({ game: withGame(get().game, (d) => { d.teams[team].cash = -1; checkBankruptcy(d, team) }) })
      },
      endGameManual: () => set({ game: withGame(get().game, (d) => endGame(d, 'manual')) })
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 2,
      partialize: (s) => ({ game: s.game, auction: s.auction, view: s.view }) as unknown as Store
    }
  )
)

export { BOARD, PROPERTIES, PROPERTIES_BY_ID, DEFAULT_CHANCE_DECK, DEFAULT_CHEST_DECK, DEFAULT_CONFIG }
export type { PropertyDef, Card, GameEvent, Config, Question }
export { otherTeam, timerElapsedMs, timerRemainingMs, canPurchase, canMortgage, canBuildHouse, canBuildHotel, canChallenge, canExecuteTrade, canCoverDeficit, wealthBreakdown, pay }
