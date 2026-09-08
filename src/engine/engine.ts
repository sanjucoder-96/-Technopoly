// Pure game-engine functions. Zero React / DOM here.
// All state mutations happen through these helpers so the Zustand store
// stays a thin transport layer and the rules stay testable in isolation.

import { BOARD, BOARD_INDEX_TO_PROPERTY, COLOR_GROUP_MEMBERS, PROPERTIES, PROPERTIES_BY_ID } from './boardData'
import { DEFAULT_CHANCE_DECK, DEFAULT_CHEST_DECK } from './cards'
import { DEFAULT_CONFIG } from './config'
import { DEFAULT_QUESTIONS } from './questionsData'
import { logEvent, nextEventId } from './engineLogger'
import type {
  Card, Config, Game, GameEvent, HeldCard, PropertyDef, PropertyState, Question,
  Team, TeamId, TimerState
} from './types'

// --------------------------------------------------------------------------
// IDs / utils
// --------------------------------------------------------------------------
export const otherTeam = (t: TeamId): TeamId => (t === 'A' ? 'B' : 'A')
export { logEvent, nextEventId }

export function timerElapsedMs(t: TimerState, now: number = Date.now()): number {
  return t.elapsedMs + (t.running && t.startedAtMs != null ? now - t.startedAtMs : 0)
}
export function timerRemainingMs(g: Game, now: number = Date.now()): number {
  return Math.max(0, g.config.gameDurationMs - timerElapsedMs(g.timer, now))
}

// --------------------------------------------------------------------------
// Factories
// --------------------------------------------------------------------------
export function makeTeam(id: TeamId, name: string, startingMoney: number): Team {
  return {
    id,
    name,
    cash: startingMoney,
    jail: { inJail: false },
    position: 0,
    challengesUsed: 0,
    challengesUsedThisTurn: 0,
    heldCards: [],
    bankrupt: false
  }
}

export function makeInitialPropertyStates(): Record<string, PropertyState> {
  const out: Record<string, PropertyState> = {}
  for (const p of PROPERTIES) {
    out[p.id] = {
      id: p.id, ownerTeam: null, houses: 0, hotel: false, mortgaged: false, houseInvestment: 0
    }
  }
  return out
}

export function createGame(opts: {
  teamAName: string
  teamBName: string
  config?: Partial<Config>
  startingTeam?: TeamId
  chestDeck?: Card[]
  chanceDeck?: Card[]
  questions?: Question[]
}): Game {
  const config: Config = { ...DEFAULT_CONFIG, ...(opts.config ?? {}) }
  const now = Date.now()
  const startingTeam: TeamId = opts.startingTeam ?? (Math.random() < 0.5 ? 'A' : 'B')
  const game: Game = {
    version: 1,
    createdAt: now,
    currentTurn: startingTeam,
    turnNumber: 1,
    phase: 'ready_to_roll',
    teams: {
      A: makeTeam('A', opts.teamAName || 'Team A', config.startingMoney),
      B: makeTeam('B', opts.teamBName || 'Team B', config.startingMoney)
    },
    properties: makeInitialPropertyStates(),
    timer: { running: false, startedAtMs: null, elapsedMs: 0 },
    config,
    events: [],
    chestDeck: (opts.chestDeck ?? DEFAULT_CHEST_DECK).map(c => ({ ...c })),
    chanceDeck: (opts.chanceDeck ?? DEFAULT_CHANCE_DECK).map(c => ({ ...c })),
    questions: (opts.questions ?? DEFAULT_QUESTIONS).map(q => ({ ...q, options: [...q.options] })),
    askedQuestions: [],
    pendingQuestion: null
  }
  logEvent(game, { type: 'game_start', message: `Game started. ${game.teams[startingTeam].name} goes first.` })
  return game
}


// --------------------------------------------------------------------------
// Wealth
// --------------------------------------------------------------------------
export interface WealthBreakdown {
  cash: number
  propertyValue: number     // 0.5 * sum(price) over ELIGIBLE (non-mortgaged) props
  houseValue: number        // 0.5 * total house investment on eligible props
  mortgagedValue: number    // 0 (documented for transparency)
  total: number
  eligibleProperties: { id: string; name: string; price: number; contribution: number }[]
  mortgagedProperties: { id: string; name: string; price: number }[]
  houses: { id: string; name: string; investment: number; contribution: number }[]
}

// Rules doc:
// "Total Wealth = Cash + 0.5 * (Sum of properties values (excluding mortgaged))
//               + 0.5 * (Corresponding values of the houses) + 0 * (Mortgaged)"
export function wealthBreakdown(g: Game, team: TeamId): WealthBreakdown {
  const cash = g.teams[team].cash
  const eligibleProperties: WealthBreakdown['eligibleProperties'] = []
  const mortgagedProperties: WealthBreakdown['mortgagedProperties'] = []
  const houses: WealthBreakdown['houses'] = []
  let propertyValue = 0
  let houseValue = 0
  for (const p of PROPERTIES) {
    const st = g.properties[p.id]
    if (st.ownerTeam !== team) continue
    if (st.mortgaged) {
      mortgagedProperties.push({ id: p.id, name: p.name, price: p.price })
      continue
    }
    const contrib = 0.5 * p.price
    propertyValue += contrib
    eligibleProperties.push({ id: p.id, name: p.name, price: p.price, contribution: contrib })
    if (st.houseInvestment > 0) {
      const hContrib = 0.5 * st.houseInvestment
      houseValue += hContrib
      houses.push({ id: p.id, name: p.name, investment: st.houseInvestment, contribution: hContrib })
    }
  }
  return {
    cash,
    propertyValue,
    houseValue,
    mortgagedValue: 0,
    total: cash + propertyValue + houseValue,
    eligibleProperties, mortgagedProperties, houses
  }
}

// --------------------------------------------------------------------------
// Rent
// --------------------------------------------------------------------------
export function ownsCompleteColorSet(g: Game, team: TeamId, groupId: PropertyDef['colorGroup']): boolean {
  const ids = COLOR_GROUP_MEMBERS[groupId] ?? []
  if (ids.length === 0) return false
  return ids.every(id => g.properties[id].ownerTeam === team && !g.properties[id].mortgaged)
}

export function calculateRent(g: Game, propertyId: string): number {
  const def = PROPERTIES_BY_ID[propertyId]
  const st = g.properties[propertyId]
  if (!def || !st || st.ownerTeam == null || st.mortgaged) return 0
  const X = def.baseRent
  const { rentMultiplierSet, rentMultiplierHouse1, rentMultiplierHouse2, rentMultiplierHotel } = g.config
  const hasSet = ownsCompleteColorSet(g, st.ownerTeam, def.colorGroup)
  if (def.type === 'property') {
    if (st.hotel) return X * rentMultiplierHotel
    if (st.houses === 2) return X * rentMultiplierHouse2
    if (st.houses === 1) return X * rentMultiplierHouse1
    return hasSet ? X * rentMultiplierSet : X
  }
  // railways & utilities: rent is X per card, 1.5X when whole set owned.
  return hasSet ? X * rentMultiplierSet : X
}

// --------------------------------------------------------------------------
// Bankruptcy detection
// --------------------------------------------------------------------------
export function checkBankruptcy(g: Game, team: TeamId): void {
  const t = g.teams[team]
  if (t.bankrupt) return
  if (t.cash < 0) {
    t.bankrupt = true
    logEvent(g, { type: 'bankrupt', team, message: `${t.name} is BANKRUPT.` })
    endGame(g, 'bankruptcy', otherTeam(team))
  }
}

// --------------------------------------------------------------------------
// Transactions
// --------------------------------------------------------------------------
interface TxMeta {
  type: GameEvent['type']
  propertyId?: string
  cardId?: string
  message: string
}
export function pay(g: Game, from: TeamId, to: TeamId | 'bank', amount: number, meta: TxMeta): void {
  if (amount <= 0) return
  g.teams[from].cash -= amount
  if (to !== 'bank') g.teams[to].cash += amount
  logEvent(g, { type: meta.type, team: from, otherTeam: to !== 'bank' ? to : undefined, amount, propertyId: meta.propertyId, cardId: meta.cardId, message: meta.message })
  checkBankruptcy(g, from)
}

export function credit(g: Game, to: TeamId, amount: number, meta: TxMeta): void {
  if (amount <= 0) return
  g.teams[to].cash += amount
  logEvent(g, { type: meta.type, team: to, amount, propertyId: meta.propertyId, cardId: meta.cardId, message: meta.message })
}

// --------------------------------------------------------------------------
// Landing & movement
// --------------------------------------------------------------------------
// The GM enters the space the token landed on. We compare vs previous position
// to detect lap completion (crossing GO). If the destination equals current, we
// consider it "no movement" (e.g. staying in Jail) and don't award salary.
export function setLandingSpace(g: Game, team: TeamId, spaceIndex: number): { crossedGo: boolean } {
  const t = g.teams[team]
  const prev = t.position
  // Forward movement wraps past GO when the destination index is lower than the
  // previous one, or when landing exactly on GO from anywhere else.
  const passedGo = (spaceIndex < prev) || (spaceIndex === 0 && prev !== 0)
  if (passedGo && !t.jail.inJail) {
    credit(g, team, g.config.salary, { type: 'salary', message: `${t.name} completed a lap and received salary of ₹${g.config.salary}.` })
  }
  t.position = spaceIndex
  g.landing = { spaceIndex, resolved: false }
  g.phase = 'awaiting_landing'
  const space = BOARD[spaceIndex]
  logEvent(g, { type: 'landing', team, message: `${t.name} landed on ${space.name} (#${spaceIndex}).` })
  return { crossedGo: passedGo }
}

// --------------------------------------------------------------------------
// Purchase
// --------------------------------------------------------------------------
export interface PurchaseAttempt { canBuy: boolean; reason?: string; deficit?: number }
export function canPurchase(g: Game, team: TeamId, propertyId: string): PurchaseAttempt {
  const def = PROPERTIES_BY_ID[propertyId]
  const st = g.properties[propertyId]
  if (!def || !st) return { canBuy: false, reason: 'Invalid property.' }
  if (st.ownerTeam) return { canBuy: false, reason: 'Property already owned.' }
  const cash = g.teams[team].cash
  if (cash < def.price) return { canBuy: false, reason: 'Insufficient cash.', deficit: def.price - cash }
  return { canBuy: true }
}

export function purchase(g: Game, team: TeamId, propertyId: string, questionCorrect: boolean): { purchased: boolean } {
  const def = PROPERTIES_BY_ID[propertyId]
  const st = g.properties[propertyId]
  if (!def || !st) throw new Error('Invalid property.')
  if (st.ownerTeam) throw new Error('Already owned.')
  if (!questionCorrect) {
    logEvent(g, { type: 'purchase_failed', team, propertyId, message: `${g.teams[team].name} failed the question for ${def.name}. Property remains unowned.` })
    return { purchased: false }
  }
  if (g.teams[team].cash < def.price) throw new Error('Insufficient cash.')
  pay(g, team, 'bank', def.price, { type: 'purchase', propertyId, message: `${g.teams[team].name} purchased ${def.name} for ₹${def.price}.` })
  st.ownerTeam = team
  return { purchased: true }
}

// --------------------------------------------------------------------------
// Mortgage
// --------------------------------------------------------------------------
export interface MortgageCheck { ok: boolean; reason?: string }
export function canMortgage(g: Game, team: TeamId, propertyId: string): MortgageCheck {
  const def = PROPERTIES_BY_ID[propertyId]
  const st = g.properties[propertyId]
  if (!def || !st) return { ok: false, reason: 'Invalid property.' }
  if (st.ownerTeam !== team) return { ok: false, reason: 'You do not own this property.' }
  if (st.mortgaged) return { ok: false, reason: 'Already mortgaged.' }
  // Rules: complete color set must not contain any house. If houses exist they
  // must be sold first.
  const groupIds = COLOR_GROUP_MEMBERS[def.colorGroup]
  for (const id of groupIds) {
    const s = g.properties[id]
    if (s.houses > 0 || s.hotel) return { ok: false, reason: 'Sell all houses/hotels in this color set first.' }
  }
  return { ok: true }
}

export function mortgage(g: Game, team: TeamId, propertyId: string): void {
  const check = canMortgage(g, team, propertyId)
  if (!check.ok) throw new Error(check.reason || 'Cannot mortgage.')
  const def = PROPERTIES_BY_ID[propertyId]
  const payout = Math.round(def.price * g.config.mortgageFraction)
  const st = g.properties[propertyId]
  st.mortgaged = true
  credit(g, team, payout, { type: 'mortgage', propertyId, message: `${g.teams[team].name} mortgaged ${def.name} for ₹${payout}.` })
}

export function unmortgage(g: Game, team: TeamId, propertyId: string): void {
  const def = PROPERTIES_BY_ID[propertyId]
  const st = g.properties[propertyId]
  if (!def || !st) throw new Error('Invalid property.')
  if (st.ownerTeam !== team) throw new Error('You do not own this property.')
  if (!st.mortgaged) throw new Error('Not mortgaged.')
  const cost = Math.round(def.price * g.config.mortgageFraction)
  if (g.teams[team].cash < cost) throw new Error(`Insufficient cash: need ₹${cost}.`)
  pay(g, team, 'bank', cost, { type: 'unmortgage', propertyId, message: `${g.teams[team].name} unmortgaged ${def.name} for ₹${cost}.` })
  st.mortgaged = false
  // Houses are not restored automatically per the rules.
}

// --------------------------------------------------------------------------
// Houses / Hotel
// --------------------------------------------------------------------------
export interface BuildCheck { ok: boolean; reason?: string; cost?: number }
export function canBuildHouse(g: Game, team: TeamId, propertyId: string): BuildCheck {
  const def = PROPERTIES_BY_ID[propertyId]
  const st = g.properties[propertyId]
  if (!def || !st) return { ok: false, reason: 'Invalid property.' }
  if (def.type !== 'property') return { ok: false, reason: 'Only locations support houses.' }
  if (st.ownerTeam !== team) return { ok: false, reason: 'You do not own this property.' }
  if (st.mortgaged) return { ok: false, reason: 'Cannot build on a mortgaged property.' }
  if (!ownsCompleteColorSet(g, team, def.colorGroup)) return { ok: false, reason: 'You must own the complete color set (unmortgaged).' }
  if (st.hotel) return { ok: false, reason: 'A hotel already stands here.' }
  if (st.houses >= 2) return { ok: false, reason: 'Two houses already stand here. Build a hotel instead.' }
  const cost = def.housePrice ?? 0
  if (g.teams[team].cash < cost) return { ok: false, reason: 'Insufficient cash.' }
  return { ok: true, cost }
}

export function canBuildHotel(g: Game, team: TeamId, propertyId: string): BuildCheck {
  const def = PROPERTIES_BY_ID[propertyId]
  const st = g.properties[propertyId]
  if (!def || !st) return { ok: false, reason: 'Invalid property.' }
  if (def.type !== 'property') return { ok: false, reason: 'Only locations support hotels.' }
  if (st.ownerTeam !== team) return { ok: false, reason: 'You do not own this property.' }
  if (st.mortgaged) return { ok: false, reason: 'Cannot build on a mortgaged property.' }
  if (!ownsCompleteColorSet(g, team, def.colorGroup)) return { ok: false, reason: 'You must own the complete color set.' }
  if (st.hotel) return { ok: false, reason: 'Hotel already built.' }
  if (st.houses !== 2) return { ok: false, reason: 'Need 2 houses before building a hotel.' }
  // Rules: "After two houses a team can replace the two houses with a hotel."
  // Hotel cost is one more building step; we default to housePrice (editable).
  const cost = def.housePrice ?? 0
  if (g.teams[team].cash < cost) return { ok: false, reason: 'Insufficient cash.' }
  return { ok: true, cost }
}

export function buildHouse(g: Game, team: TeamId, propertyId: string, questionCorrect: boolean): { built: boolean } {
  const check = canBuildHouse(g, team, propertyId)
  if (!check.ok) throw new Error(check.reason || 'Cannot build.')
  if (!questionCorrect) {
    logEvent(g, { type: 'note', team, propertyId, message: `${g.teams[team].name} failed the question — house not built on ${PROPERTIES_BY_ID[propertyId].name}.` })
    return { built: false }
  }
  const def = PROPERTIES_BY_ID[propertyId]
  const cost = check.cost!
  const st = g.properties[propertyId]
  pay(g, team, 'bank', cost, { type: 'build_house', propertyId, message: `${g.teams[team].name} built a house on ${def.name} for ₹${cost}.` })
  st.houses = (st.houses + 1) as 0 | 1 | 2
  st.houseInvestment += cost
  return { built: true }
}

export function buildHotel(g: Game, team: TeamId, propertyId: string, questionCorrect: boolean): { built: boolean } {
  const check = canBuildHotel(g, team, propertyId)
  if (!check.ok) throw new Error(check.reason || 'Cannot build hotel.')
  if (!questionCorrect) {
    logEvent(g, { type: 'note', team, propertyId, message: `${g.teams[team].name} failed the question — hotel not built on ${PROPERTIES_BY_ID[propertyId].name}.` })
    return { built: false }
  }
  const def = PROPERTIES_BY_ID[propertyId]
  const cost = check.cost!
  const st = g.properties[propertyId]
  pay(g, team, 'bank', cost, { type: 'build_hotel', propertyId, message: `${g.teams[team].name} built a hotel on ${def.name} for ₹${cost}.` })
  // Rules: hotel REPLACES the two houses. We keep the total invested (used for
  // half-refund on mortgage recovery).
  st.houses = 0
  st.hotel = true
  st.houseInvestment += cost
  return { built: true }
}

export function sellHouse(g: Game, team: TeamId, propertyId: string): void {
  const def = PROPERTIES_BY_ID[propertyId]
  const st = g.properties[propertyId]
  if (!def || !st) throw new Error('Invalid property.')
  if (st.ownerTeam !== team) throw new Error('You do not own this property.')
  if (st.hotel) throw new Error('Sell the hotel first.')
  if (st.houses === 0) throw new Error('No houses to sell.')
  const cost = def.housePrice ?? 0
  const refund = Math.round(cost * g.config.mortgageFraction) // rules: "if a house was built for 100, removing that house will contribute only 50"
  credit(g, team, refund, { type: 'sell_house', propertyId, message: `${g.teams[team].name} sold a house on ${def.name} for ₹${refund}.` })
  st.houses = (st.houses - 1) as 0 | 1 | 2
  st.houseInvestment = Math.max(0, st.houseInvestment - cost)
}

export function sellHotel(g: Game, team: TeamId, propertyId: string): void {
  const def = PROPERTIES_BY_ID[propertyId]
  const st = g.properties[propertyId]
  if (!def || !st) throw new Error('Invalid property.')
  if (st.ownerTeam !== team) throw new Error('You do not own this property.')
  if (!st.hotel) throw new Error('No hotel to sell.')
  const cost = def.housePrice ?? 0
  const refund = Math.round(cost * g.config.mortgageFraction)
  credit(g, team, refund, { type: 'sell_hotel', propertyId, message: `${g.teams[team].name} sold the hotel on ${def.name} for ₹${refund}.` })
  st.hotel = false
  st.houses = 2 // hotel "reverts" to the two houses it replaced (they remain until sold)
  st.houseInvestment = Math.max(0, st.houseInvestment - cost)
}

// --------------------------------------------------------------------------
// Rent collection
// --------------------------------------------------------------------------
// Rent collection now depends on whether the paying team answered the
// property's question correctly (house rule): correct → pay a fraction of the
// full rent (default 50%); incorrect → pay full rent.
export function collectRent(g: Game, payingTeam: TeamId, propertyId: string, opts: { correct: boolean }): { paid: number; fullRent: number; escaped: number } {
  const fullRent = calculateRent(g, propertyId)
  const st = g.properties[propertyId]
  if (!st.ownerTeam || st.ownerTeam === payingTeam || st.mortgaged || fullRent === 0) {
    return { paid: 0, fullRent, escaped: 0 }
  }
  const owner = st.ownerTeam
  const def = PROPERTIES_BY_ID[propertyId]
  const fraction = opts.correct ? g.config.rentEscapeFractionOnCorrect : 1
  const paid = Math.round(fullRent * fraction)
  const escaped = fullRent - paid
  const msg = opts.correct
    ? `${g.teams[payingTeam].name} answered correctly and paid ₹${paid} rent to ${g.teams[owner].name} for ${def.name} (escaped ₹${escaped}).`
    : `${g.teams[payingTeam].name} answered incorrectly and paid full rent ₹${paid} to ${g.teams[owner].name} for ${def.name}.`
  pay(g, payingTeam, owner, paid, { type: 'rent', propertyId, message: msg })
  return { paid, fullRent, escaped }
}

// --------------------------------------------------------------------------
// Trade
// --------------------------------------------------------------------------
export interface TradePayload {
  cash: number                  // >= 0
  propertyIds: string[]
  cardIds: string[]             // Get-Out-Of-Jail cards owned by that team
}
export interface TradeCheck { ok: boolean; reason?: string }
export function canExecuteTrade(g: Game, aGives: TradePayload, bGives: TradePayload): TradeCheck {
  if (aGives.cash < 0 || bGives.cash < 0) return { ok: false, reason: 'Cash must be non-negative.' }
  if (g.teams.A.cash < aGives.cash) return { ok: false, reason: 'Team A does not have enough cash.' }
  if (g.teams.B.cash < bGives.cash) return { ok: false, reason: 'Team B does not have enough cash.' }
  for (const pid of aGives.propertyIds) if (g.properties[pid]?.ownerTeam !== 'A') return { ok: false, reason: `Team A does not own ${pid}.` }
  for (const pid of bGives.propertyIds) if (g.properties[pid]?.ownerTeam !== 'B') return { ok: false, reason: `Team B does not own ${pid}.` }
  for (const cid of aGives.cardIds) if (!g.teams.A.heldCards.find(c => c.cardId === cid)) return { ok: false, reason: `Team A does not hold card ${cid}.` }
  for (const cid of bGives.cardIds) if (!g.teams.B.heldCards.find(c => c.cardId === cid)) return { ok: false, reason: `Team B does not hold card ${cid}.` }
  // A traded property must not have houses on it — houses stay attached to the
  // color-set structure; rules aren't explicit but Monopoly-standard: sell first.
  for (const pid of [...aGives.propertyIds, ...bGives.propertyIds]) {
    const s = g.properties[pid]
    if (s?.houses || s?.hotel) return { ok: false, reason: 'Sell houses/hotels before trading a property.' }
  }
  return { ok: true }
}

export function executeTrade(g: Game, aGives: TradePayload, bGives: TradePayload): void {
  const check = canExecuteTrade(g, aGives, bGives)
  if (!check.ok) throw new Error(check.reason || 'Invalid trade.')
  // Cash
  g.teams.A.cash -= aGives.cash - bGives.cash
  g.teams.B.cash -= bGives.cash - aGives.cash
  // Properties
  for (const pid of aGives.propertyIds) g.properties[pid].ownerTeam = 'B'
  for (const pid of bGives.propertyIds) g.properties[pid].ownerTeam = 'A'
  // Cards
  const moveCard = (from: TeamId, to: TeamId, id: string) => {
    const i = g.teams[from].heldCards.findIndex(c => c.cardId === id)
    if (i >= 0) {
      const c = g.teams[from].heldCards.splice(i, 1)[0]
      c.ownerTeam = to
      g.teams[to].heldCards.push(c)
    }
  }
  aGives.cardIds.forEach(id => moveCard('A', 'B', id))
  bGives.cardIds.forEach(id => moveCard('B', 'A', id))
  const summary = describeTrade(aGives, bGives, g)
  logEvent(g, { type: 'trade', team: 'A', otherTeam: 'B', message: `Trade completed. ${summary}` })
}

export function describeTrade(aGives: TradePayload, bGives: TradePayload, g: Game): string {
  const nameOf = (pid: string) => PROPERTIES_BY_ID[pid]?.name ?? pid
  const side = (payload: TradePayload) => {
    const parts: string[] = []
    if (payload.cash > 0) parts.push(`₹${payload.cash}`)
    parts.push(...payload.propertyIds.map(nameOf))
    parts.push(...payload.cardIds.map(cid => g.teams.A.heldCards.concat(g.teams.B.heldCards).find(c => c.cardId === cid)?.title ?? cid))
    return parts.length ? parts.join(', ') : '(nothing)'
  }
  return `Team A gives: ${side(aGives)} | Team B gives: ${side(bGives)}`
}

// --------------------------------------------------------------------------
// Auction
// --------------------------------------------------------------------------
export interface Auction {
  propertyId: string
  currentBid: number
  currentBidder: TeamId | null
  activeTurn: TeamId          // whose turn it is to bid (starts with initiating team)
  finished: boolean
  suspended: boolean
}
export function startAuction(g: Game, propertyId: string, initiatingTeam: TeamId): Auction {
  const def = PROPERTIES_BY_ID[propertyId]
  if (!def) throw new Error('Invalid property.')
  logEvent(g, { type: 'auction_started', team: initiatingTeam, propertyId, message: `Auction started for ${def.name}.` })
  return { propertyId, currentBid: 0, currentBidder: null, activeTurn: initiatingTeam, finished: false, suspended: false }
}

// A bid is valid iff amount >= minBid (or above current bid) AND within
// bidding team's *total wealth* (per rules).
export interface BidCheck { ok: boolean; reason?: string }
export function validateBid(g: Game, a: Auction, team: TeamId, amount: number): BidCheck {
  if (a.finished || a.suspended) return { ok: false, reason: 'Auction is closed.' }
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, reason: 'Bid must be positive.' }
  const min = Math.max(g.config.auctionMinBid, a.currentBid + 1)
  if (amount < min) return { ok: false, reason: `Bid must be at least ₹${min}.` }
  const wealth = wealthBreakdown(g, team).total
  if (amount > wealth) return { ok: false, reason: `Bid exceeds ${g.teams[team].name}'s total wealth (₹${Math.floor(wealth)}).` }
  return { ok: true }
}
export function placeBid(g: Game, a: Auction, team: TeamId, amount: number): Auction {
  const v = validateBid(g, a, team, amount)
  if (!v.ok) throw new Error(v.reason || 'Invalid bid.')
  const next: Auction = { ...a, currentBid: amount, currentBidder: team, activeTurn: otherTeam(team) }
  logEvent(g, { type: 'auction_bid', team, propertyId: a.propertyId, amount, message: `${g.teams[team].name} bid ₹${amount} for ${PROPERTIES_BY_ID[a.propertyId].name}.` })
  return next
}
// Finish auction — declares a winner but DOES NOT transfer ownership or
// charge cash. The winner must first answer a question of the property's
// difficulty (see `awardAuctionWithQuestion`).
export function finishAuction(g: Game, a: Auction): Auction {
  if (a.finished || a.suspended) return a
  if (a.currentBidder && a.currentBid >= g.config.auctionMinBid) {
    const def = PROPERTIES_BY_ID[a.propertyId]
    logEvent(g, { type: 'auction_won', team: a.currentBidder, propertyId: a.propertyId, amount: a.currentBid, message: `${g.teams[a.currentBidder].name} is the high bidder for ${def.name} at ₹${a.currentBid}. Awaiting property question.` })
    return { ...a, finished: true }
  }
  logEvent(g, { type: 'auction_suspended', propertyId: a.propertyId, message: `Auction suspended for ${PROPERTIES_BY_ID[a.propertyId].name}. Property remains unowned.` })
  return { ...a, suspended: true, finished: true }
}

// Resolve the auction winner's property question.
export function awardAuctionWithQuestion(g: Game, opts: { propertyId: string; winningTeam: TeamId; winningBid: number; correct: boolean }): { transferred: boolean; charged: number } {
  const def = PROPERTIES_BY_ID[opts.propertyId]
  if (!def) throw new Error('Invalid property.')
  if (opts.correct) {
    pay(g, opts.winningTeam, 'bank', opts.winningBid, { type: 'auction_won', propertyId: opts.propertyId, message: `${g.teams[opts.winningTeam].name} answered correctly and won ${def.name} at auction for ₹${opts.winningBid}.` })
    g.properties[opts.propertyId].ownerTeam = opts.winningTeam
    return { transferred: true, charged: opts.winningBid }
  }
  // Failed the question. Apply configured policy.
  switch (g.config.auctionQuestionFailPolicy) {
    case 'transfer_and_charge':
      pay(g, opts.winningTeam, 'bank', opts.winningBid, { type: 'auction_won', propertyId: opts.propertyId, message: `${g.teams[opts.winningTeam].name} failed the property question but per rule takes ${def.name} at ₹${opts.winningBid}.` })
      g.properties[opts.propertyId].ownerTeam = opts.winningTeam
      return { transferred: true, charged: opts.winningBid }
    case 'transfer_no_charge':
      g.properties[opts.propertyId].ownerTeam = opts.winningTeam
      logEvent(g, { type: 'auction_won', team: opts.winningTeam, propertyId: opts.propertyId, message: `${g.teams[opts.winningTeam].name} failed the question — takes ${def.name} without payment (per rule).` })
      return { transferred: true, charged: 0 }
    case 'unowned':
    default:
      logEvent(g, { type: 'auction_suspended', team: opts.winningTeam, propertyId: opts.propertyId, message: `${g.teams[opts.winningTeam].name} failed the auction question. ${def.name} remains unowned.` })
      return { transferred: false, charged: 0 }
  }
}

// --------------------------------------------------------------------------
// Challenge
// --------------------------------------------------------------------------
export interface ChallengeCheck { ok: boolean; reason?: string }
export function canChallenge(g: Game, attacker: TeamId, propertyId: string): ChallengeCheck {
  const t = g.teams[attacker]
  if (t.challengesUsed >= g.config.maxChallenges) return { ok: false, reason: 'Max challenges reached for the game.' }
  if (t.challengesUsedThisTurn >= g.config.maxChallengesPerTurn) return { ok: false, reason: 'Only one challenge per turn.' }
  const st = g.properties[propertyId]
  if (!st?.ownerTeam || st.ownerTeam === attacker) return { ok: false, reason: 'Not an opponent property.' }
  if (st.mortgaged) return { ok: false, reason: 'Cannot challenge mortgaged property.' }
  // Rules: "particular card that has no houses, just a single card"
  if (st.houses > 0 || st.hotel) return { ok: false, reason: 'Property must have no houses/hotel.' }
  return { ok: true }
}

export function resolveChallenge(g: Game, attacker: TeamId, propertyId: string, opts: { attackerCorrect: boolean; defenderCorrect?: boolean }): { transferred: boolean } {
  const check = canChallenge(g, attacker, propertyId)
  if (!check.ok) throw new Error(check.reason || 'Cannot challenge.')
  const t = g.teams[attacker]
  t.challengesUsed += 1
  t.challengesUsedThisTurn += 1
  logEvent(g, { type: 'challenge_start', team: attacker, propertyId, message: `${t.name} challenges for ${PROPERTIES_BY_ID[propertyId].name}.` })
  if (!opts.attackerCorrect) {
    logEvent(g, { type: 'challenge_result', team: attacker, propertyId, message: `${t.name} failed the challenge question. Challenge ends.` })
    return { transferred: false }
  }
  const defender = otherTeam(attacker)
  if (opts.defenderCorrect) {
    logEvent(g, { type: 'challenge_result', team: attacker, otherTeam: defender, propertyId, message: `${g.teams[defender].name} successfully defended ${PROPERTIES_BY_ID[propertyId].name}.` })
    return { transferred: false }
  }
  g.properties[propertyId].ownerTeam = attacker
  logEvent(g, { type: 'challenge_result', team: attacker, otherTeam: defender, propertyId, message: `${t.name} captured ${PROPERTIES_BY_ID[propertyId].name} from ${g.teams[defender].name}.` })
  return { transferred: true }
}

// --------------------------------------------------------------------------
// Cards / Chest / Chance
// --------------------------------------------------------------------------
export function drawRandomCard<T extends Card>(deck: T[]): T {
  return deck[Math.floor(Math.random() * deck.length)]
}

// Apply a chest/chance card's effect. Returns a message summary.
export function applyCard(g: Game, team: TeamId, card: Card): string {
  const eff = card.effect
  const t = g.teams[team]
  const opp = otherTeam(team)
  switch (eff.kind) {
    case 'money': {
      if (eff.delta >= 0) credit(g, team, eff.delta, { type: 'card_applied', cardId: card.id, message: `${card.title}: ${t.name} received ₹${eff.delta}.` })
      else pay(g, team, 'bank', -eff.delta, { type: 'card_applied', cardId: card.id, message: `${card.title}: ${t.name} paid ₹${-eff.delta}.` })
      return `${t.name} ${eff.delta >= 0 ? 'received' : 'paid'} ₹${Math.abs(eff.delta)}.`
    }
    case 'money_opponent': {
      if (eff.delta >= 0) pay(g, team, opp, eff.delta, { type: 'card_applied', cardId: card.id, message: `${card.title}: ${t.name} paid ₹${eff.delta} to ${g.teams[opp].name}.` })
      else pay(g, opp, team, -eff.delta, { type: 'card_applied', cardId: card.id, message: `${card.title}: ${g.teams[opp].name} paid ₹${-eff.delta} to ${t.name}.` })
      return `${eff.delta >= 0 ? t.name + ' paid' : g.teams[opp].name + ' paid'} ₹${Math.abs(eff.delta)}.`
    }
    case 'salary': {
      credit(g, team, g.config.salary, { type: 'card_applied', cardId: card.id, message: `${card.title}: ${t.name} received ₹${g.config.salary} salary.` })
      return `${t.name} received salary ₹${g.config.salary}.`
    }
    case 'gotojail': {
      sendToJail(g, team, `Chest card: ${card.title}`)
      return `${t.name} sent to Jail.`
    }
    case 'get_out_of_jail': {
      const held: HeldCard = { cardId: card.id, title: card.title, ownerTeam: team }
      t.heldCards.push(held)
      logEvent(g, { type: 'card_applied', team, cardId: card.id, message: `${t.name} kept "${card.title}".` })
      return `${t.name} kept "${card.title}".`
    }
    case 'move_to_go': {
      t.position = 0
      logEvent(g, { type: 'card_applied', team, cardId: card.id, message: `${card.title}: ${t.name} moved to GO.` })
      return `${t.name} moved to GO.`
    }
    case 'repairs': {
      let houses = 0, hotels = 0
      for (const p of PROPERTIES) {
        const s = g.properties[p.id]
        if (s.ownerTeam !== team) continue
        houses += s.houses; if (s.hotel) hotels += 1
      }
      const total = houses * eff.perHouse + hotels * eff.perHotel
      if (total > 0) pay(g, team, 'bank', total, { type: 'card_applied', cardId: card.id, message: `${card.title}: ${t.name} paid ₹${total} for repairs.` })
      else logEvent(g, { type: 'card_applied', team, cardId: card.id, message: `${card.title}: ${t.name} has nothing to repair.` })
      return `Paid ₹${total}.`
    }
    case 'text_only': {
      logEvent(g, { type: 'card_applied', team, cardId: card.id, message: `${card.title}: ${eff.note}` })
      return eff.note
    }
  }
}

// --------------------------------------------------------------------------
// Jail
// --------------------------------------------------------------------------
export function sendToJail(g: Game, team: TeamId, reason: string): void {
  const t = g.teams[team]
  t.jail = { inJail: true, enteredTurn: g.turnNumber }
  t.position = 10 // physical Jail space
  logEvent(g, { type: 'jail_enter', team, message: `${t.name} sent to Jail (${reason}).` })
}
export function attemptJailExit(g: Game, team: TeamId, opts: { correct: boolean; useCard?: boolean }): { freed: boolean; paid: number } {
  const t = g.teams[team]
  if (!t.jail.inJail) return { freed: true, paid: 0 }
  if (opts.useCard) {
    const i = t.heldCards.findIndex(c => c.title.toLowerCase().includes('jail'))
    if (i >= 0) {
      t.heldCards.splice(i, 1)
      t.jail = { inJail: false }
      logEvent(g, { type: 'jail_exit', team, message: `${t.name} used a Get Out of Jail Free card.` })
      return { freed: true, paid: 0 }
    }
  }
  if (opts.correct) {
    t.jail = { inJail: false }
    logEvent(g, { type: 'jail_exit', team, message: `${t.name} answered correctly and exits Jail.` })
    return { freed: true, paid: 0 }
  }
  const fee = g.config.jailFee
  pay(g, team, 'bank', fee, { type: 'jail_pay', message: `${t.name} paid ₹${fee} to leave Jail.` })
  t.jail = { inJail: false }
  logEvent(g, { type: 'jail_exit', team, message: `${t.name} exits Jail after payment.` })
  return { freed: true, paid: fee }
}

// --------------------------------------------------------------------------
// Tax / Go
// --------------------------------------------------------------------------
export function payTax(g: Game, team: TeamId, amount: number, label: string): void {
  pay(g, team, 'bank', amount, { type: 'tax', message: `${g.teams[team].name} paid ${label} of ₹${amount}.` })
}

// --------------------------------------------------------------------------
// Turn control
// --------------------------------------------------------------------------
export function endTurn(g: Game): void {
  if (g.phase === 'ended') return
  logEvent(g, { type: 'turn_end', team: g.currentTurn, message: `${g.teams[g.currentTurn].name}'s turn ended.` })
  g.currentTurn = otherTeam(g.currentTurn)
  g.turnNumber += 1
  g.teams[g.currentTurn].challengesUsedThisTurn = 0
  g.landing = undefined
  g.phase = 'ready_to_roll'
  logEvent(g, { type: 'turn_start', team: g.currentTurn, message: `${g.teams[g.currentTurn].name}'s turn begins.` })
}

// --------------------------------------------------------------------------
// Timer
// --------------------------------------------------------------------------
export function startTimer(g: Game): void {
  if (g.timer.running) return
  g.timer.startedAtMs = Date.now()
  g.timer.running = true
}
export function pauseTimer(g: Game): void {
  if (!g.timer.running) return
  g.timer.elapsedMs = timerElapsedMs(g.timer)
  g.timer.running = false
  g.timer.startedAtMs = null
}
export function resetTimer(g: Game): void {
  g.timer = { running: false, startedAtMs: null, elapsedMs: 0 }
}

// --------------------------------------------------------------------------
// End of game
// --------------------------------------------------------------------------
export function endGame(g: Game, reason: NonNullable<Game['endedReason']>, forcedWinner?: TeamId | 'tie'): void {
  if (g.phase === 'ended') return
  g.phase = 'ended'
  pauseTimer(g)
  g.endedReason = reason
  if (forcedWinner) {
    g.winner = forcedWinner
  } else {
    const a = wealthBreakdown(g, 'A').total
    const b = wealthBreakdown(g, 'B').total
    g.winner = a === b ? 'tie' : (a > b ? 'A' : 'B')
  }
  const label = g.winner === 'tie' ? 'It is a tie.' : `${g.teams[g.winner].name} wins.`
  logEvent(g, { type: 'game_end', message: `Game ended (${reason}). ${label}` })
}

// Called by UI ticker when time expires.
export function checkTimeExpiry(g: Game): void {
  if (g.phase === 'ended') return
  if (timerRemainingMs(g) <= 0) endGame(g, 'time')
}

// --------------------------------------------------------------------------
// Correction / Undo
// --------------------------------------------------------------------------
// A limited correction hook — this reverses a *cash* transaction and marks it.
// We do NOT attempt to auto-reverse arbitrary state changes; that is unsafe.
export function correctCashEvent(g: Game, eventId: string, note: string): void {
  const ev = g.events.find(e => e.id === eventId)
  if (!ev || !ev.amount) throw new Error('Only cash events can be corrected here.')
  if (ev.team) g.teams[ev.team].cash += ev.amount
  if (ev.otherTeam) g.teams[ev.otherTeam].cash -= ev.amount
  logEvent(g, { type: 'correction', team: ev.team, otherTeam: ev.otherTeam, amount: ev.amount, propertyId: ev.propertyId,
    message: `Correction: reversed "${ev.message}". Reason: ${note}` })
}

// --------------------------------------------------------------------------
// Convenience: index lookups re-exported so UI doesn't reach into boardData
// --------------------------------------------------------------------------
export { BOARD, PROPERTIES, PROPERTIES_BY_ID, BOARD_INDEX_TO_PROPERTY, COLOR_GROUP_MEMBERS }
