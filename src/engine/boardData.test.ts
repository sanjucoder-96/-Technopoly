import { describe, it, expect } from 'vitest'
import { BOARD, PROPERTIES, PROPERTIES_BY_ID, COLOR_GROUP_MEMBERS } from './boardData'

// These tests pin the values transcribed from page 2 of the Technopoly rules PDF
// (Monopoly India Edition reference board). If someone changes boardData.ts
// away from the document values, these tests break loudly.

describe('board data — matches the rules-document reference board', () => {
  it('has exactly 40 spaces', () => {
    expect(BOARD.length).toBe(40)
  })
  it('has exactly 22 locations, 4 railways, 2 utilities', () => {
    expect(PROPERTIES.filter(p => p.type === 'property').length).toBe(22)
    expect(PROPERTIES.filter(p => p.type === 'railway').length).toBe(4)
    expect(PROPERTIES.filter(p => p.type === 'utility').length).toBe(2)
  })
  it('income tax is at index 4 and super tax at index 38, per the board image', () => {
    expect(BOARD[4].type).toBe('tax')
    expect(BOARD[4].taxAmount).toBe(200)
    expect(BOARD[38].type).toBe('tax')
    expect(BOARD[38].taxAmount).toBe(100)
  })
  it('GO / Jail / Free Parking / Go To Jail are at the four corners', () => {
    expect(BOARD[0].type).toBe('go')
    expect(BOARD[10].type).toBe('jail')
    expect(BOARD[20].type).toBe('freeparking')
    expect(BOARD[30].type).toBe('gotojail')
  })
  it('Chest at 2, 17, 33 and Chance at 7, 22, 36', () => {
    for (const i of [2, 17, 33]) expect(BOARD[i].type).toBe('chest')
    for (const i of [7, 22, 36]) expect(BOARD[i].type).toBe('chance')
  })
})

describe('property names come from the Code Clash master list; prices from the reference board', () => {
  const cases: [string, string, number][] = [
    ['loc-0',  'Zoho',                       100],
    ['loc-1',  'Freshworks',                 100],
    ['loc-2',  'Postman',                    120],
    ['loc-3',  'BrowserStack',               120],
    ['loc-4',  'Razorpay',                   120],
    ['loc-5',  'Hasura',                     160],
    ['loc-6',  'Chargebee',                  160],
    ['loc-7',  'Mphasis',                    160],
    ['loc-8',  'Persistent',                 180],
    ['loc-9',  'Mindtree',                   180],
    ['loc-10', 'L&T Technology Services',    180],
    ['loc-11', 'Accenture',                  240],
    ['loc-12', 'Cognizant',                  240],
    ['loc-13', 'Infosys',                    240],
    ['loc-14', 'Wipro',                      260],
    ['loc-15', 'HCLTech',                    260],
    ['loc-16', 'Tech Mahindra',              260],
    ['loc-17', 'Oracle',                     340],
    ['loc-18', 'Salesforce',                 340],
    ['loc-19', 'IBM',                        340],
    ['loc-20', 'Microsoft',                  360],
    ['loc-21', 'TCS',                        360],
    ['rail-0', 'GOOGLE DATA CENTER',         200],
    ['rail-1', 'MICROSOFT DATA CENTER',      200],
    ['rail-2', 'NVIDIA DATA CENTER',         200],
    ['rail-3', 'AMAZON DATA CENTER',         200],
    ['util-0', 'CPU CORE',                   150],
    ['util-1', 'DATA FLOW',                  150]
  ]
  for (const [id, name, price] of cases) {
    it(`${id} → "${name}" at ₹${price}`, () => {
      const p = PROPERTIES_BY_ID[id]
      expect(p.name).toBe(name)
      expect(p.price).toBe(price)
    })
  }
})

describe('color groups', () => {
  it('has the sizes on the reference board', () => {
    expect(COLOR_GROUP_MEMBERS.brown.length).toBe(2)
    expect(COLOR_GROUP_MEMBERS.skyblue.length).toBe(3)
    expect(COLOR_GROUP_MEMBERS.pink.length).toBe(3)
    expect(COLOR_GROUP_MEMBERS.orange.length).toBe(3)
    expect(COLOR_GROUP_MEMBERS.red.length).toBe(3)
    expect(COLOR_GROUP_MEMBERS.yellow.length).toBe(3)
    expect(COLOR_GROUP_MEMBERS.green.length).toBe(3)
    expect(COLOR_GROUP_MEMBERS.blue.length).toBe(2)
    expect(COLOR_GROUP_MEMBERS.railway.length).toBe(4)
    expect(COLOR_GROUP_MEMBERS.utility.length).toBe(2)
  })
})
