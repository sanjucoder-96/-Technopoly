import type { Game } from '../engine/types'
import { PROPERTIES_BY_ID } from '../engine/engine'
import { wealthBreakdown } from '../engine/engine'

export function buildReport(game: Game) {
  const wA = wealthBreakdown(game, 'A')
  const wB = wealthBreakdown(game, 'B')
  return {
    title: 'Technopoly — Final Report',
    generatedAt: new Date().toISOString(),
    createdAt: new Date(game.createdAt).toISOString(),
    durationMs: game.timer.elapsedMs,
    winner: game.winner,
    endedReason: game.endedReason,
    teams: {
      A: {
        name: game.teams.A.name,
        cash: game.teams.A.cash,
        wealthBreakdown: wA,
        heldCards: game.teams.A.heldCards,
        challengesUsed: game.teams.A.challengesUsed,
        bankrupt: game.teams.A.bankrupt
      },
      B: {
        name: game.teams.B.name,
        cash: game.teams.B.cash,
        wealthBreakdown: wB,
        heldCards: game.teams.B.heldCards,
        challengesUsed: game.teams.B.challengesUsed,
        bankrupt: game.teams.B.bankrupt
      }
    },
    properties: Object.values(game.properties).map(s => ({
      id: s.id,
      name: PROPERTIES_BY_ID[s.id]?.name ?? s.id,
      ownerTeam: s.ownerTeam,
      houses: s.houses,
      hotel: s.hotel,
      mortgaged: s.mortgaged,
      houseInvestment: s.houseInvestment
    })),
    events: game.events,
    config: game.config
  }
}

export function exportReport(game: Game) {
  const report = buildReport(game)
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const a = document.createElement('a')
  a.href = url
  a.download = `technopoly-report-${stamp}.json`
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
