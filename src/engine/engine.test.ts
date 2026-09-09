import { describe, it, expect } from 'vitest'
import {
  createGame, purchase, mortgage, unmortgage, buildHouse, buildHotel, sellHouse,
  calculateRent, ownsCompleteColorSet, collectRent, wealthBreakdown,
  startAuction, placeBid, finishAuction, awardAuctionWithQuestion, canExecuteTrade, executeTrade,
  canChallenge, resolveChallenge, sendToJail, attemptJailExit, applyCard,
  setLandingSpace, endTurn, endGame, checkTimeExpiry, checkBankruptcy, PROPERTIES_BY_ID
} from './engine'
import type { Game, TeamId } from './types'

function newGame(): Game {
  return createGame({ teamAName: 'Alpha', teamBName: 'Beta', startingTeam: 'A' })
}
function grant(g: Game, team: TeamId, propertyIds: string[]) {
  for (const id of propertyIds) g.properties[id].ownerTeam = team
}
// find a full color set (green: loc-17, loc-18, loc-19)
const GREEN = ['loc-17', 'loc-18', 'loc-19']
const BLUE = ['loc-20', 'loc-21']

describe('financials — cash vs property wealth (segregation)', () => {
  it('start: cash=1500, property wealth=0, total=1500', () => {
    const g = newGame()
    const w = wealthBreakdownForA(g)
    expect(g.teams.A.cash).toBe(1500)
    expect(w.cash).toBe(1500)
    expect(w.propertyValue).toBe(0)
    expect(w.total).toBe(1500)
  })
  it('after purchasing a ₹200 property: cash=1300, property wealth=100, total=1400', () => {
    // Force the property price to 200 for this scenario.
    const g = newGame()
    const propertyId = 'loc-10' // L&T Technology Services (₹200 per reference board)
    expect(PROPERTIES_BY_ID[propertyId].price).toBe(200)
    purchase(g, 'A', propertyId, true)
    const w = wealthBreakdownForA(g)
    expect(g.teams.A.cash).toBe(1300)
    expect(w.cash).toBe(1300)
    expect(w.propertyValue).toBe(100)
    expect(w.total).toBe(1400)
  })
})

function wealthBreakdownForA(g: Game) {
  return wealthBreakdown(g, 'A')
}

describe('property purchase', () => {
  it('deducts price on correct question and assigns owner', () => {
    const g = newGame()
    const def = PROPERTIES_BY_ID['loc-0']
    const before = g.teams.A.cash
    const { purchased } = purchase(g, 'A', 'loc-0', true)
    expect(purchased).toBe(true)
    expect(g.teams.A.cash).toBe(before - def.price)
    expect(g.properties['loc-0'].ownerTeam).toBe('A')
  })
  it('does not deduct on incorrect question', () => {
    const g = newGame()
    const before = g.teams.A.cash
    const { purchased } = purchase(g, 'A', 'loc-0', false)
    expect(purchased).toBe(false)
    expect(g.teams.A.cash).toBe(before)
    expect(g.properties['loc-0'].ownerTeam).toBeNull()
  })
  it('rejects buy without cash', () => {
    const g = newGame()
    g.teams.A.cash = 5
    expect(() => purchase(g, 'A', 'loc-21', true)).toThrow()
  })
})

describe('rent', () => {
  it('base rent when incomplete set', () => {
    const g = newGame()
    grant(g, 'A', ['loc-17'])
    expect(calculateRent(g, 'loc-17')).toBe(PROPERTIES_BY_ID['loc-17'].baseRent)
  })
  it('1.5x rent when complete set (no houses)', () => {
    const g = newGame()
    grant(g, 'A', GREEN)
    expect(ownsCompleteColorSet(g, 'A', 'green')).toBe(true)
    const x = PROPERTIES_BY_ID['loc-17'].baseRent
    expect(calculateRent(g, 'loc-17')).toBe(1.5 * x)
  })
  it('house/hotel multipliers', () => {
    const g = newGame()
    grant(g, 'A', GREEN)
    g.teams.A.cash = 10000
    buildHouse(g, 'A', 'loc-17', true)
    const x = PROPERTIES_BY_ID['loc-17'].baseRent
    expect(calculateRent(g, 'loc-17')).toBe(2 * x)
    buildHouse(g, 'A', 'loc-17', true)
    expect(calculateRent(g, 'loc-17')).toBe(3 * x)
    buildHotel(g, 'A', 'loc-17', true)
    expect(calculateRent(g, 'loc-17')).toBe(5 * x)
  })
  it('mortgaged property has zero rent', () => {
    const g = newGame()
    grant(g, 'A', ['loc-0'])
    mortgage(g, 'A', 'loc-0')
    expect(calculateRent(g, 'loc-0')).toBe(0)
  })
  it('collect rent — correct answer pays only 50% of full rent', () => {
    const g = newGame()
    grant(g, 'A', ['loc-0'])
    const aBefore = g.teams.A.cash, bBefore = g.teams.B.cash
    const { paid, fullRent, escaped } = collectRent(g, 'B', 'loc-0', { correct: true })
    const rent = PROPERTIES_BY_ID['loc-0'].baseRent
    expect(fullRent).toBe(rent)
    expect(paid).toBe(Math.round(rent * 0.5))
    expect(escaped).toBe(rent - paid)
    expect(g.teams.A.cash).toBe(aBefore + paid)
    expect(g.teams.B.cash).toBe(bBefore - paid)
  })
  it('collect rent — incorrect answer pays the full rent', () => {
    const g = newGame()
    grant(g, 'A', ['loc-0'])
    const aBefore = g.teams.A.cash, bBefore = g.teams.B.cash
    const { paid, escaped } = collectRent(g, 'B', 'loc-0', { correct: false })
    const rent = PROPERTIES_BY_ID['loc-0'].baseRent
    expect(paid).toBe(rent)
    expect(escaped).toBe(0)
    expect(g.teams.A.cash).toBe(aBefore + rent)
    expect(g.teams.B.cash).toBe(bBefore - rent)
  })
})

describe('mortgage', () => {
  it('mortgage payout is half price', () => {
    const g = newGame()
    grant(g, 'A', ['loc-2'])
    const before = g.teams.A.cash
    mortgage(g, 'A', 'loc-2')
    expect(g.teams.A.cash).toBe(before + Math.round(PROPERTIES_BY_ID['loc-2'].price * 0.5))
    expect(g.properties['loc-2'].mortgaged).toBe(true)
  })
  it('cannot mortgage if any color-set property has houses', () => {
    const g = newGame()
    grant(g, 'A', GREEN)
    g.teams.A.cash = 10000
    buildHouse(g, 'A', 'loc-17', true)
    expect(() => mortgage(g, 'A', 'loc-18')).toThrow()
  })
  it('unmortgage costs the same as payout', () => {
    const g = newGame()
    grant(g, 'A', ['loc-2'])
    mortgage(g, 'A', 'loc-2')
    const before = g.teams.A.cash
    unmortgage(g, 'A', 'loc-2')
    expect(g.teams.A.cash).toBe(before - Math.round(PROPERTIES_BY_ID['loc-2'].price * 0.5))
  })
})

describe('wealth', () => {
  it('formula excludes mortgaged, includes 0.5 * price + 0.5 * house investment', () => {
    const g = newGame()
    grant(g, 'A', GREEN)
    g.teams.A.cash = 1000
    buildHouse(g, 'A', 'loc-17', true)
    const w = wealthBreakdown(g, 'A')
    const propSum = GREEN.reduce((s, id) => s + PROPERTIES_BY_ID[id].price * 0.5, 0)
    expect(w.propertyValue).toBe(propSum)
    expect(w.houseValue).toBe(0.5 * (PROPERTIES_BY_ID['loc-17'].housePrice ?? 0))
    expect(w.total).toBe(w.cash + w.propertyValue + w.houseValue)
  })
  it('mortgaged property contributes 0', () => {
    const g = newGame()
    grant(g, 'A', ['loc-2'])
    mortgage(g, 'A', 'loc-2')
    const w = wealthBreakdown(g, 'A')
    expect(w.mortgagedValue).toBe(0)
    expect(w.eligibleProperties).toHaveLength(0)
  })
})

describe('auction', () => {
  it('rejects bid below min', () => {
    const g = newGame()
    const a = startAuction(g, 'loc-0', 'A')
    expect(() => placeBid(g, a, 'A', 5)).toThrow()
  })
  it('rejects bid above wealth', () => {
    const g = newGame()
    g.teams.A.cash = 50
    const a = startAuction(g, 'loc-0', 'A')
    expect(() => placeBid(g, a, 'A', 5000)).toThrow()
  })
  it('finishAuction declares a winner but defers transfer to the question', () => {
    const g = newGame()
    let a = startAuction(g, 'loc-0', 'A')
    a = placeBid(g, a, 'A', 30)
    const before = g.teams.A.cash
    a = finishAuction(g, a)
    // At this point, ownership NOT yet transferred and cash NOT yet debited.
    expect(g.properties['loc-0'].ownerTeam).toBeNull()
    expect(g.teams.A.cash).toBe(before)
    expect(a.finished).toBe(true)
    expect(a.currentBidder).toBe('A')
    expect(a.currentBid).toBe(30)
  })
  it('no bidders → auction suspended', () => {
    const g = newGame()
    let a = startAuction(g, 'loc-0', 'A')
    a = finishAuction(g, a)
    expect(a.suspended).toBe(true)
    expect(g.properties['loc-0'].ownerTeam).toBeNull()
  })
  it('awardAuctionWithQuestion — correct: property transfers, bid charged', () => {
    const g = newGame()
    let a = startAuction(g, 'loc-0', 'A')
    a = placeBid(g, a, 'A', 25)
    finishAuction(g, a)
    const before = g.teams.A.cash
    const r = awardAuctionWithQuestion(g, { propertyId: 'loc-0', winningTeam: 'A', winningBid: 25, correct: true })
    expect(r.transferred).toBe(true)
    expect(r.charged).toBe(25)
    expect(g.teams.A.cash).toBe(before - 25)
    expect(g.properties['loc-0'].ownerTeam).toBe('A')
  })
  it('awardAuctionWithQuestion — incorrect + unowned policy: property stays unowned, no charge', () => {
    const g = newGame()
    let a = startAuction(g, 'loc-0', 'A')
    a = placeBid(g, a, 'A', 25)
    finishAuction(g, a)
    const before = g.teams.A.cash
    g.config.auctionQuestionFailPolicy = 'unowned'
    const r = awardAuctionWithQuestion(g, { propertyId: 'loc-0', winningTeam: 'A', winningBid: 25, correct: false })
    expect(r.transferred).toBe(false)
    expect(g.teams.A.cash).toBe(before)
    expect(g.properties['loc-0'].ownerTeam).toBeNull()
  })
  it('awardAuctionWithQuestion — incorrect + transfer_no_charge policy', () => {
    const g = newGame()
    let a = startAuction(g, 'loc-0', 'A')
    a = placeBid(g, a, 'A', 25)
    finishAuction(g, a)
    const before = g.teams.A.cash
    g.config.auctionQuestionFailPolicy = 'transfer_no_charge'
    const r = awardAuctionWithQuestion(g, { propertyId: 'loc-0', winningTeam: 'A', winningBid: 25, correct: false })
    expect(r.transferred).toBe(true)
    expect(g.teams.A.cash).toBe(before)
    expect(g.properties['loc-0'].ownerTeam).toBe('A')
  })
})

describe('trade', () => {
  it('rejects if a party lacks the asset', () => {
    const g = newGame()
    grant(g, 'A', ['loc-0'])
    const bad = canExecuteTrade(g, { cash: 0, propertyIds: ['loc-0'], cardIds: [] }, { cash: 0, propertyIds: ['loc-1'], cardIds: [] })
    expect(bad.ok).toBe(false)
  })
  it('transfers assets and cash', () => {
    const g = newGame()
    grant(g, 'A', ['loc-0'])
    grant(g, 'B', ['loc-1'])
    const before = { a: g.teams.A.cash, b: g.teams.B.cash }
    executeTrade(g, { cash: 100, propertyIds: ['loc-0'], cardIds: [] }, { cash: 50, propertyIds: ['loc-1'], cardIds: [] })
    expect(g.properties['loc-0'].ownerTeam).toBe('B')
    expect(g.properties['loc-1'].ownerTeam).toBe('A')
    expect(g.teams.A.cash).toBe(before.a - 100 + 50)
    expect(g.teams.B.cash).toBe(before.b - 50 + 100)
  })
  it('rejects trade of any property in a color set that has any houses', () => {
    // Grant Team A the whole green set and build a house on one of them.
    const g = newGame()
    const GREEN = ['loc-17', 'loc-18', 'loc-19']
    grant(g, 'A', GREEN)
    g.teams.A.cash = 10000
    // build house on green-first via engine helper
    // (using canBuildHouse-safe path)
    buildHouse(g, 'A', 'loc-17', true)
    // Try to trade a DIFFERENT green property that itself has no houses.
    const check = canExecuteTrade(g, { cash: 0, propertyIds: ['loc-18'], cardIds: [] }, { cash: 100, propertyIds: [], cardIds: [] })
    expect(check.ok).toBe(false)
    expect(check.reason?.toLowerCase()).toContain('set')
  })
  it('allows trading once every house in the color set is removed', () => {
    const g = newGame()
    const GREEN = ['loc-17', 'loc-18', 'loc-19']
    grant(g, 'A', GREEN)
    grant(g, 'B', ['loc-0'])
    g.teams.A.cash = 10000
    buildHouse(g, 'A', 'loc-17', true)
    // Not allowed while any house is on the set.
    expect(canExecuteTrade(g, { cash: 0, propertyIds: ['loc-18'], cardIds: [] }, { cash: 0, propertyIds: ['loc-0'], cardIds: [] }).ok).toBe(false)
    // Remove the house.
    sellHouse(g, 'A', 'loc-17')
    expect(canExecuteTrade(g, { cash: 0, propertyIds: ['loc-18'], cardIds: [] }, { cash: 0, propertyIds: ['loc-0'], cardIds: [] }).ok).toBe(true)
  })
})

describe('challenge', () => {
  it('enforces per-turn and total caps', () => {
    const g = newGame()
    g.teams.A.challengesUsed = 3
    grant(g, 'B', ['loc-0'])
    expect(canChallenge(g, 'A', 'loc-0').ok).toBe(false)
  })
  it('attacker fails → no transfer', () => {
    const g = newGame()
    grant(g, 'B', ['loc-0'])
    const r = resolveChallenge(g, 'A', 'loc-0', { attackerCorrect: false })
    expect(r.transferred).toBe(false)
    expect(g.properties['loc-0'].ownerTeam).toBe('B')
  })
  it('defender fails → transfer', () => {
    const g = newGame()
    grant(g, 'B', ['loc-0'])
    const r = resolveChallenge(g, 'A', 'loc-0', { attackerCorrect: true, defenderCorrect: false })
    expect(r.transferred).toBe(true)
    expect(g.properties['loc-0'].ownerTeam).toBe('A')
  })
  it('defender defends → no transfer', () => {
    const g = newGame()
    grant(g, 'B', ['loc-0'])
    const r = resolveChallenge(g, 'A', 'loc-0', { attackerCorrect: true, defenderCorrect: true })
    expect(r.transferred).toBe(false)
    expect(g.properties['loc-0'].ownerTeam).toBe('B')
  })
})

describe('jail', () => {
  it('sends to jail and pays fee on failed exit', () => {
    const g = newGame()
    sendToJail(g, 'A', 'test')
    const before = g.teams.A.cash
    const r = attemptJailExit(g, 'A', { correct: false })
    expect(r.freed).toBe(true)
    expect(g.teams.A.cash).toBe(before - g.config.jailFee)
  })
  it('correct answer exits free', () => {
    const g = newGame()
    sendToJail(g, 'A', 'test')
    const before = g.teams.A.cash
    attemptJailExit(g, 'A', { correct: true })
    expect(g.teams.A.cash).toBe(before)
  })
})

describe('cards', () => {
  it('money card adjusts cash', () => {
    const g = newGame()
    const before = g.teams.A.cash
    applyCard(g, 'A', { id: 't1', deck: 'chest', title: 't', description: 't', effect: { kind: 'money', delta: 50 } })
    expect(g.teams.A.cash).toBe(before + 50)
  })
  it('gotojail card jails team', () => {
    const g = newGame()
    applyCard(g, 'A', { id: 't2', deck: 'chest', title: 't', description: 't', effect: { kind: 'gotojail' } })
    expect(g.teams.A.jail.inJail).toBe(true)
  })
  it('get-out-of-jail card is retained', () => {
    const g = newGame()
    applyCard(g, 'A', { id: 't3', deck: 'chest', title: 'Get Out of Jail', description: 't', effect: { kind: 'get_out_of_jail' } })
    expect(g.teams.A.heldCards.length).toBe(1)
  })
})

describe('turn & timer & bankruptcy', () => {
  it('endTurn swaps active team', () => {
    const g = newGame()
    expect(g.currentTurn).toBe('A')
    endTurn(g)
    expect(g.currentTurn).toBe('B')
  })
  it('lap around board awards salary', () => {
    const g = newGame()
    // Move A to space 30, then to space 5 (wraps past 0 → salary)
    setLandingSpace(g, 'A', 30)
    const before = g.teams.A.cash
    setLandingSpace(g, 'A', 5)
    expect(g.teams.A.cash).toBe(before + g.config.salary)
  })
  it('cash < 0 with mortgageable properties → NOT bankrupt yet', () => {
    const g = newGame()
    grant(g, 'A', ['loc-21']) // TCS ₹400
    g.teams.A.cash = -50 // ₹50 deficit, ₹200 mortgage available
    checkBankruptcy(g, 'A')
    expect(g.teams.A.bankrupt).toBe(false)
    expect(g.phase).not.toBe('ended')
  })
  it('cash < 0 with no mortgageable property → bankrupt and game ends', () => {
    const g = newGame()
    g.teams.A.cash = -1
    checkBankruptcy(g, 'A')
    expect(g.teams.A.bankrupt).toBe(true)
    expect(g.phase).toBe('ended')
    expect(g.winner).toBe('B')
  })
  it('cash < 0 with insufficient mortgage total → bankrupt', () => {
    const g = newGame()
    grant(g, 'A', ['loc-0']) // Zoho ₹60 → ₹30 payout
    g.teams.A.cash = -100 // deficit > available
    checkBankruptcy(g, 'A')
    expect(g.teams.A.bankrupt).toBe(true)
  })
  it('bankruptcy ends the game with opponent as winner (manual endGame)', () => {
    const g = newGame()
    endGame(g, 'bankruptcy', 'B')
    expect(g.phase).toBe('ended')
    expect(g.winner).toBe('B')
  })
  it('time expiry ends game and picks wealth winner', () => {
    const g = newGame()
    g.teams.A.cash = 3000
    g.teams.B.cash = 1000
    // Force elapsedMs past duration
    g.timer.elapsedMs = g.config.gameDurationMs + 1000
    checkTimeExpiry(g)
    expect(g.phase).toBe('ended')
    expect(g.winner).toBe('A')
  })
})

describe('color set + development', () => {
  it('cannot build without complete set', () => {
    const g = newGame()
    grant(g, 'A', ['loc-17'])
    expect(() => buildHouse(g, 'A', 'loc-17', true)).toThrow()
  })
  it('cannot build on mortgaged property', () => {
    const g = newGame()
    grant(g, 'A', GREEN)
    mortgage(g, 'A', 'loc-17')
    expect(() => buildHouse(g, 'A', 'loc-17', true)).toThrow()
  })
})

describe('blue set rent (2-property set works)', () => {
  it('1.5x rent applies with 2-property complete set', () => {
    const g = newGame()
    grant(g, 'A', BLUE)
    const x = PROPERTIES_BY_ID['loc-20'].baseRent
    expect(calculateRent(g, 'loc-20')).toBe(1.5 * x)
  })
})
