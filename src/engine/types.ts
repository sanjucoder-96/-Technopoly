// Domain types for Technopoly (physical board — this app is Game Master control).
// Source of truth: the attached Technopoly rules document.

export type TeamId = 'A' | 'B'

export type QuestionLevel = 'easy' | 'medium' | 'medium_hard' | 'hard'

export type ColorGroup =
  | 'brown'
  | 'skyblue'
  | 'pink'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'railway'
  | 'utility'

export type SpaceType =
  | 'go'
  | 'property'    // location (color group)
  | 'railway'
  | 'utility'
  | 'chest'
  | 'chance'
  | 'tax'         // Income tax / Super tax
  | 'jail'        // visiting + lock
  | 'gotojail'
  | 'freeparking'

// A single board space. All 40 exist. Property/Railway/Utility spaces carry a propertyId.
export interface BoardSpace {
  index: number             // 0..39
  name: string
  type: SpaceType
  propertyId?: string       // for property/railway/utility
  taxAmount?: number        // for tax spaces
}

// Master definition for a purchasable asset.
export interface PropertyDef {
  id: string
  name: string
  type: 'property' | 'railway' | 'utility'
  colorGroup: ColorGroup
  price: number
  baseRent: number          // "X" in the rules; rent scheme derives from this
  questionLevel: QuestionLevel
  housePrice?: number       // cost per house build (only for `property` type)
  boardIndex: number
}

// Runtime state of a property during a game.
export interface PropertyState {
  id: string
  ownerTeam: TeamId | null
  houses: 0 | 1 | 2
  hotel: boolean
  mortgaged: boolean
  // Track total money spent on houses/hotel so mortgage-of-house recovery is exact.
  houseInvestment: number
}

// Card in a deck (Chest / Chance). Effects are simple + tagged.
export type CardEffect =
  | { kind: 'money'; delta: number }                            // add/remove cash from drawing team
  | { kind: 'money_opponent'; delta: number }                    // add/remove cash from opponent
  | { kind: 'salary' }                                           // grants a salary (₹200 by default)
  | { kind: 'gotojail' }                                         // send drawing team to jail
  | { kind: 'get_out_of_jail' }                                  // "keep this card" – tradeable
  | { kind: 'move_to_go' }                                       // move to start (no salary auto-applied)
  | { kind: 'repairs'; perHouse: number; perHotel: number }      // pay for each house / hotel owned
  | { kind: 'text_only'; note: string }                          // pure narrative — GM will apply manually

export interface Card {
  id: string
  deck: 'chest' | 'chance'
  title: string
  description: string
  effect: CardEffect
}

// Ownership of a "Get Out Of Jail Free" card.
export interface HeldCard {
  cardId: string
  title: string
  ownerTeam: TeamId
}

// Question bank ----------------------------------------------------------
export type QuestionCategory = string

export interface Question {
  id: string
  question: string
  code?: string
  options: string[]              // typically 4
  correctIndex: number           // 0-based index into options
  difficulty: QuestionLevel
  category?: QuestionCategory
  explanation?: string
}

// A question asked during the game — recorded for audit and to prevent
// immediate repetition.
export type QuestionContext =
  | { kind: 'purchase'; propertyId: string }
  | { kind: 'build_house'; propertyId: string }
  | { kind: 'build_hotel'; propertyId: string }
  | { kind: 'challenge_attack'; propertyId: string }
  | { kind: 'challenge_defend'; propertyId: string }
  | { kind: 'chance' }
  | { kind: 'jail_exit' }

export interface AskedQuestion {
  id: string
  questionId: string
  team: TeamId
  context: QuestionContext
  difficulty: QuestionLevel
  correct: boolean
  ts: number
}

export type TeamJailState =
  | { inJail: false }
  | { inJail: true; enteredTurn: number }

export interface Team {
  id: TeamId
  name: string
  cash: number
  jail: TeamJailState
  // Tokens on the physical board — the app tracks position ONLY for salary detection
  // (crossing GO). The GM enters the landing space each turn; we derive lap crossings.
  position: number          // 0..39, starts at 0 (GO)
  challengesUsed: number    // total challenges this whole game (cap 3)
  challengesUsedThisTurn: number
  heldCards: HeldCard[]
  bankrupt: boolean
}

// A pending question — set on the game state when any workflow requires one.
// The App renders the full-page QuestionScreen while this is present.
export interface PendingQuestion {
  question: Question
  team: TeamId
  difficulty: QuestionLevel
  context: QuestionContext
  startedAtMs: number
  timeLimitMs: number
  // Payload passed to whatever action the question was raised for.
  intent: QuestionIntent
}

// The intent tells the resolver what to do when the question is answered.
export type QuestionIntent =
  | { kind: 'purchase'; propertyId: string }
  | { kind: 'build_house'; propertyId: string }
  | { kind: 'build_hotel'; propertyId: string }
  | { kind: 'rent'; propertyId: string; payingTeam: TeamId }
  | { kind: 'chance' }
  | { kind: 'jail_exit'; team: TeamId }
  | { kind: 'auction_award'; propertyId: string; winningTeam: TeamId; winningBid: number }
  | { kind: 'challenge_attack'; propertyId: string; attacker: TeamId }
  | { kind: 'challenge_defend'; propertyId: string; attacker: TeamId; defender: TeamId }

// A single recorded transaction / event.
export type EventType =
  | 'game_start'
  | 'game_end'
  | 'turn_start'
  | 'turn_end'
  | 'landing'
  | 'purchase'
  | 'purchase_failed'
  | 'auction_started'
  | 'auction_bid'
  | 'auction_won'
  | 'auction_suspended'
  | 'rent'
  | 'salary'
  | 'tax'
  | 'chest_drawn'
  | 'chance_drawn'
  | 'card_applied'
  | 'jail_enter'
  | 'jail_exit'
  | 'jail_pay'
  | 'mortgage'
  | 'unmortgage'
  | 'build_house'
  | 'build_hotel'
  | 'sell_house'
  | 'sell_hotel'
  | 'trade'
  | 'challenge_start'
  | 'challenge_result'
  | 'bankrupt'
  | 'correction'
  | 'question_asked'
  | 'note'

export interface GameEvent {
  id: string
  ts: number                // wall-clock ms
  gameTimeMs: number        // ms elapsed of game timer
  team?: TeamId
  otherTeam?: TeamId
  type: EventType
  amount?: number
  propertyId?: string
  cardId?: string
  message: string
}

export interface Config {
  startingMoney: number
  gameDurationMs: number
  salary: number            // for lap around board
  jailFee: number
  auctionMinBid: number
  maxChallenges: number
  maxChallengesPerTurn: number
  rentMultiplierSet: number      // complete color set (no houses)
  rentMultiplierHouse1: number
  rentMultiplierHouse2: number
  rentMultiplierHotel: number
  mortgageFraction: number       // mortgage payout = fraction * price; unmortgage costs same
  incomeTax: number
  superTax: number
  challengeQuestionLevel: QuestionLevel
  // Per-question countdown timer, in seconds (fallback if per-difficulty not set).
  questionTimeSeconds: number
  // Per-difficulty question timers in seconds. Takes precedence over questionTimeSeconds.
  questionTimeLimits: Record<QuestionLevel, number>
  // The active team that lands on an opponent's property answers a question.
  // Correct → this fraction of the calculated rent is paid.
  // Incorrect → the full calculated rent is paid.
  rentEscapeFractionOnCorrect: number
  // Consequence of the auction winner failing the property question.
  // 'unowned' — the property remains unowned, no cash charged (default).
  // 'transfer_no_charge' — property transfers to the winner but no cash charged.
  // 'transfer_and_charge' — property transfers AND the bid is still charged.
  auctionQuestionFailPolicy: 'unowned' | 'transfer_no_charge' | 'transfer_and_charge'
}

export interface TimerState {
  running: boolean
  startedAtMs: number | null      // wall-clock ms when last resumed
  elapsedMs: number               // accumulated elapsed ms while paused
}

export type Phase =
  | 'setup'
  | 'ready_to_roll'
  | 'awaiting_landing'
  | 'action_in_progress'
  | 'ended'

export interface Game {
  version: 1
  createdAt: number
  currentTurn: TeamId
  turnNumber: number
  phase: Phase
  teams: Record<TeamId, Team>
  properties: Record<string, PropertyState>
  timer: TimerState
  config: Config
  events: GameEvent[]
  chestDeck: Card[]
  chanceDeck: Card[]
  questions: Question[]
  askedQuestions: AskedQuestion[]
  pendingQuestion: PendingQuestion | null
  lastDrawnCard?: { card: Card; team: TeamId; ts: number } | null
  landing?: {
    spaceIndex: number
    resolved: boolean
  }
  winner?: TeamId | 'tie'
  endedReason?: 'time' | 'bankruptcy' | 'manual'
}
