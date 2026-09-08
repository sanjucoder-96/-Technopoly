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

describe('property names and prices come from page 2 of the PDF', () => {
  const cases: [string, string, number][] = [
    ['loc-0',  'Guwahati',                              60],
    ['loc-1',  'Bhubaneshwar',                          60],
    ['loc-2',  'Panaji (Goa)',                          100],
    ['loc-3',  'Agra',                                  100],
    ['loc-4',  'Vadodara',                              120],
    ['loc-5',  'Ludhiana',                              140],
    ['loc-6',  'Bhopal',                                140],
    ['loc-7',  'Patna',                                 160],
    ['loc-8',  'Indore',                                180],
    ['loc-9',  'Nagpur',                                180],
    ['loc-10', 'Kochi',                                 200],
    ['loc-11', 'Lucknow',                               220],
    ['loc-12', 'Chandigarh',                            220],
    ['loc-13', 'Jaipur',                                240],
    ['loc-14', 'Pune',                                  260],
    ['loc-15', 'Hyderabad',                             260],
    ['loc-16', 'Ahmedabad',                             280],
    ['loc-17', 'Kolkata',                               300],
    ['loc-18', 'Chennai',                               300],
    ['loc-19', 'Bengaluru',                             320],
    ['loc-20', 'Delhi',                                 350],
    ['loc-21', 'Mumbai',                                400],
    ['rail-0', 'Chennai Central Railway Station',       200],
    ['rail-1', 'Howrah Railway Station',                200],
    ['rail-2', 'New Delhi Railway Station',             200],
    ['rail-3', 'Chhatrapati Shivaji Terminus (VT)',     200],
    ['util-0', 'Electric Company',                      150],
    ['util-1', 'Water Works',                           150]
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
