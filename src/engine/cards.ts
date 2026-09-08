// Chest & Chance decks.
//
// The attached Technopoly rules PDF does NOT list the specific card contents:
//   • Chest: "may contain some negative impact/positive impact that was
//     randomly taken by the team, team must abide by the instruction that the
//     card has." — content NOT enumerated.
//   • Chance: "All the cards provide a positive effect to the wealth of the
//     team." — no specific effects listed.
//
// The physical cards live on the physical deck. So the app ships EMPTY decks
// by default plus a small set of TEMPLATES (clearly labelled) so the Game
// Master can see the effect shapes the engine supports and copy each of their
// actual physical cards into Settings before the game.

import type { Card } from './types'

// TEMPLATES — showing every supported effect shape. Each title is prefixed
// "TEMPLATE:" so a Game Master who forgets to edit them is warned at draw time.
export const DEFAULT_CHEST_DECK: Card[] = [
  { id: 'ch-tmpl-money-plus',   deck: 'chest', title: 'TEMPLATE: Collect from bank',       description: 'Replace with your physical card. Effect: team receives ₹X from the bank.',      effect: { kind: 'money', delta: 50 } },
  { id: 'ch-tmpl-money-minus',  deck: 'chest', title: 'TEMPLATE: Pay bank',                description: 'Replace with your physical card. Effect: team pays ₹X to the bank.',            effect: { kind: 'money', delta: -50 } },
  { id: 'ch-tmpl-opponent',     deck: 'chest', title: 'TEMPLATE: Opponent transaction',    description: 'Replace with your physical card. Effect: opponent pays team ₹X (or vice versa).', effect: { kind: 'money_opponent', delta: -50 } },
  { id: 'ch-tmpl-gotojail',     deck: 'chest', title: 'TEMPLATE: Go to Jail',              description: 'Replace with your physical card. Effect: team is sent directly to Jail.',       effect: { kind: 'gotojail' } },
  { id: 'ch-tmpl-jailfree',     deck: 'chest', title: 'TEMPLATE: Get Out of Jail Free',    description: 'Replace with your physical card. Effect: retain this card; use once.',           effect: { kind: 'get_out_of_jail' } },
  { id: 'ch-tmpl-repairs',      deck: 'chest', title: 'TEMPLATE: Repairs',                 description: 'Replace with your physical card. Effect: pay ₹X per house and ₹Y per hotel owned.', effect: { kind: 'repairs', perHouse: 25, perHotel: 100 } }
]

export const DEFAULT_CHANCE_DECK: Card[] = [
  { id: 'cn-tmpl-money-plus',   deck: 'chance', title: 'TEMPLATE: Collect from bank',       description: 'Replace with your physical card. Effect: team receives ₹X from the bank.',        effect: { kind: 'money', delta: 100 } },
  { id: 'cn-tmpl-opponent-in',  deck: 'chance', title: 'TEMPLATE: Opponent pays you',       description: 'Replace with your physical card. Effect: opponent pays team ₹X.',                  effect: { kind: 'money_opponent', delta: -100 } },
  { id: 'cn-tmpl-jailfree',     deck: 'chance', title: 'TEMPLATE: Get Out of Jail Free',    description: 'Replace with your physical card. Effect: retain this card; use once.',             effect: { kind: 'get_out_of_jail' } },
  { id: 'cn-tmpl-moveto-go',    deck: 'chance', title: 'TEMPLATE: Advance to GO',           description: 'Replace with your physical card. Effect: token moves to GO.',                      effect: { kind: 'move_to_go' } }
]
