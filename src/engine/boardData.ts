// Board data for Technopoly — CODE CLASH edition.
//
// Sources of truth (in order of precedence):
//   1. "Technopoly Code Clash — Master Board Mapping" PDF — provides the
//      NAMES for every property, special space, railway ("data center"), and
//      utility. It also confirms the price stays fixed at each board
//      position: "Purchase prices preserved; mortgage values excluded."
//   2. The original Technopoly rules PDF board image — fixes the physical
//      board LAYOUT (which position each color group / tax / chest lives at)
//      and the price at each position.
//
// So each entry below is (Code Clash name, color from master list, price
// from the reference board). Since the master list itself says prices are
// preserved, the price at each board position is unchanged from the original
// Monopoly India Edition reference — every rename is in-place.
//
// WHAT IS NOT IN EITHER DOCUMENT:
//   • Per-property BASE RENT ("X" in the rules formula). Defaults below use
//     the standard printed rent values for the reference board's cards; every
//     value is editable in Settings.
//   • Per-property QUESTION LEVEL — defaults derived by price tier; editable
//     per-property in Settings.
//   • House / hotel prices — not spelled out in either PDF. Defaults follow
//     the reference board's tiered pricing; editable.

import type { BoardSpace, PropertyDef, ColorGroup, QuestionLevel } from './types'

interface RawLoc {
  name: string
  colorGroup: ColorGroup
  price: number         // from document board image
  baseRent: number      // NOT in document; editable default
  housePrice: number    // NOT in document; editable default
  qLevel: QuestionLevel // NOT in document; editable default derived from price
}

// 22 locations, renamed per the Code Clash master list. Prices at each board
// position preserved from the reference board (master list: "Purchase prices
// preserved").
const LOCATIONS: RawLoc[] = [
  // brown (2 locations, price 60)
  { name: 'Zoho',                     colorGroup: 'brown',   price: 60,  baseRent: 2,  housePrice: 50,  qLevel: 'easy' },
  { name: 'Freshworks',               colorGroup: 'brown',   price: 60,  baseRent: 4,  housePrice: 50,  qLevel: 'easy' },
  // sky blue (3 locations, 100/100/120)
  { name: 'Postman',                  colorGroup: 'skyblue', price: 100, baseRent: 6,  housePrice: 50,  qLevel: 'easy' },
  { name: 'BrowserStack',             colorGroup: 'skyblue', price: 100, baseRent: 6,  housePrice: 50,  qLevel: 'easy' },
  { name: 'Razorpay',                 colorGroup: 'skyblue', price: 120, baseRent: 8,  housePrice: 50,  qLevel: 'easy' },
  // pink (3, 140/140/160)
  { name: 'Hasura',                   colorGroup: 'pink',    price: 140, baseRent: 10, housePrice: 100, qLevel: 'medium' },
  { name: 'Chargebee',                colorGroup: 'pink',    price: 140, baseRent: 10, housePrice: 100, qLevel: 'medium' },
  { name: 'Mphasis',                  colorGroup: 'pink',    price: 160, baseRent: 12, housePrice: 100, qLevel: 'medium' },
  // orange (3, 180/180/200)
  { name: 'Persistent',               colorGroup: 'orange',  price: 180, baseRent: 14, housePrice: 100, qLevel: 'medium' },
  { name: 'Mindtree',                 colorGroup: 'orange',  price: 180, baseRent: 14, housePrice: 100, qLevel: 'medium' },
  { name: 'L&T Technology Services',  colorGroup: 'orange',  price: 200, baseRent: 16, housePrice: 100, qLevel: 'medium' },
  // red (3, 220/220/240)
  { name: 'Accenture',                colorGroup: 'red',     price: 220, baseRent: 18, housePrice: 150, qLevel: 'medium' },
  { name: 'Cognizant',                colorGroup: 'red',     price: 220, baseRent: 18, housePrice: 150, qLevel: 'medium' },
  { name: 'Infosys',                  colorGroup: 'red',     price: 240, baseRent: 20, housePrice: 150, qLevel: 'medium' },
  // yellow (3, 260/260/280)
  { name: 'Wipro',                    colorGroup: 'yellow',  price: 260, baseRent: 22, housePrice: 150, qLevel: 'hard' },
  { name: 'HCLTech',                  colorGroup: 'yellow',  price: 260, baseRent: 22, housePrice: 150, qLevel: 'hard' },
  { name: 'Tech Mahindra',            colorGroup: 'yellow',  price: 280, baseRent: 24, housePrice: 150, qLevel: 'hard' },
  // green (3, 300/300/320)
  { name: 'Oracle',                   colorGroup: 'green',   price: 300, baseRent: 26, housePrice: 200, qLevel: 'hard' },
  { name: 'Salesforce',               colorGroup: 'green',   price: 300, baseRent: 26, housePrice: 200, qLevel: 'hard' },
  { name: 'IBM',                      colorGroup: 'green',   price: 320, baseRent: 28, housePrice: 200, qLevel: 'hard' },
  // dark blue (2, 350/400)
  { name: 'Microsoft',                colorGroup: 'blue',    price: 350, baseRent: 35, housePrice: 200, qLevel: 'hard' },
  { name: 'TCS',                      colorGroup: 'blue',    price: 400, baseRent: 50, housePrice: 200, qLevel: 'hard' }
]

// 4 data centers (replace the railways), all ₹200.
const RAILWAYS: Omit<RawLoc, 'housePrice'>[] = [
  { name: 'GOOGLE DATA CENTER',    colorGroup: 'railway', price: 200, baseRent: 25, qLevel: 'medium' },
  { name: 'MICROSOFT DATA CENTER', colorGroup: 'railway', price: 200, baseRent: 25, qLevel: 'medium' },
  { name: 'NVIDIA DATA CENTER',    colorGroup: 'railway', price: 200, baseRent: 25, qLevel: 'medium' },
  { name: 'AMAZON DATA CENTER',    colorGroup: 'railway', price: 200, baseRent: 25, qLevel: 'medium' }
]

// 2 utilities, both ₹150 — renamed per master list.
const UTILITIES: Omit<RawLoc, 'housePrice'>[] = [
  { name: 'CPU CORE',  colorGroup: 'utility', price: 150, baseRent: 10, qLevel: 'easy' },
  { name: 'DATA FLOW', colorGroup: 'utility', price: 150, baseRent: 10, qLevel: 'easy' }
]

// Board order (index → space), matching the PDF page 2 layout exactly:
// bottom row: GO → GUWAHATI → CHEST → BHUBANESHWAR → INCOME TAX → CHENNAI RS
//             → PANAJI → CHANCE → AGRA → VADODARA
// left col:   JAIL → LUDHIANA → ELECTRIC → BHOPAL → PATNA → HOWRAH RS
//             → INDORE → CHEST → NAGPUR → KOCHI
// top row:    FREE PARK → LUCKNOW → CHANCE → CHANDIGARH → JAIPUR → NEW DELHI RS
//             → PUNE → HYDERABAD → WATER WORKS → AHMEDABAD
// right col:  GO TO JAIL → KOLKATA → CHENNAI → CHEST → BENGALURU → CHH.SHIVAJI
//             → CHANCE → DELHI → SUPER TAX → MUMBAI

interface Slot { kind: 'go' | 'chest' | 'chance' | 'tax' | 'jail' | 'gotojail' | 'freeparking' | 'loc' | 'rail' | 'util'; ref?: number; tax?: number; taxName?: string }
const LAYOUT: Slot[] = [
  { kind: 'go' },                                                    // 0  GO
  { kind: 'loc', ref: 0 },                                            // 1  Zoho
  { kind: 'chest' },                                                  // 2  CODE CHEST
  { kind: 'loc', ref: 1 },                                            // 3  Freshworks
  { kind: 'tax', tax: 200, taxName: 'INCOME TAX' },                  // 4
  { kind: 'rail', ref: 0 },                                           // 5  GOOGLE DATA CENTER
  { kind: 'loc', ref: 2 },                                            // 6  Postman
  { kind: 'chance' },                                                 // 7  CHANCE
  { kind: 'loc', ref: 3 },                                            // 8  BrowserStack
  { kind: 'loc', ref: 4 },                                            // 9  Razorpay
  { kind: 'jail' },                                                   // 10 IN CODE HUNT
  { kind: 'loc', ref: 5 },                                            // 11 Hasura
  { kind: 'util', ref: 0 },                                           // 12 CPU CORE
  { kind: 'loc', ref: 6 },                                            // 13 Chargebee
  { kind: 'loc', ref: 7 },                                            // 14 Mphasis
  { kind: 'rail', ref: 1 },                                           // 15 MICROSOFT DATA CENTER
  { kind: 'loc', ref: 8 },                                            // 16 Persistent
  { kind: 'chest' },                                                  // 17 CODE CHEST
  { kind: 'loc', ref: 9 },                                            // 18 Mindtree
  { kind: 'loc', ref: 10 },                                           // 19 L&T Technology Services
  { kind: 'freeparking' },                                            // 20 FREE SERVER
  { kind: 'loc', ref: 11 },                                           // 21 Accenture
  { kind: 'chance' },                                                 // 22 CHANCE
  { kind: 'loc', ref: 12 },                                           // 23 Cognizant
  { kind: 'loc', ref: 13 },                                           // 24 Infosys
  { kind: 'rail', ref: 2 },                                           // 25 NVIDIA DATA CENTER
  { kind: 'loc', ref: 14 },                                           // 26 Wipro
  { kind: 'loc', ref: 15 },                                           // 27 HCLTech
  { kind: 'util', ref: 1 },                                           // 28 DATA FLOW
  { kind: 'loc', ref: 16 },                                           // 29 Tech Mahindra
  { kind: 'gotojail' },                                               // 30 GO TO CODE HUNT
  { kind: 'loc', ref: 17 },                                           // 31 Oracle
  { kind: 'loc', ref: 18 },                                           // 32 Salesforce
  { kind: 'chest' },                                                  // 33 CODE CHEST
  { kind: 'loc', ref: 19 },                                           // 34 IBM
  { kind: 'rail', ref: 3 },                                           // 35 AMAZON DATA CENTER
  { kind: 'chance' },                                                 // 36 CHANCE
  { kind: 'loc', ref: 20 },                                           // 37 Microsoft
  { kind: 'tax', tax: 100, taxName: 'SUPER TAX' },                    // 38
  { kind: 'loc', ref: 21 }                                            // 39 TCS
]

export const BOARD: BoardSpace[] = []
export const PROPERTIES: PropertyDef[] = []
const propIdFor = (kind: 'loc' | 'rail' | 'util', ref: number) => `${kind}-${ref}`

LAYOUT.forEach((slot, idx) => {
  switch (slot.kind) {
    // Code Clash renames: Community Chest → CODE CHEST, Jail → IN CODE HUNT,
    // Go To Jail → GO TO CODE HUNT, Free Parking → FREE SERVER. CHANCE,
    // INCOME TAX, SUPER TAX, GO keep their names.
    case 'go':          BOARD.push({ index: idx, name: 'GO',                type: 'go' }); break
    case 'jail':        BOARD.push({ index: idx, name: 'IN CODE HUNT',      type: 'jail' }); break
    case 'gotojail':    BOARD.push({ index: idx, name: 'GO TO CODE HUNT',   type: 'gotojail' }); break
    case 'freeparking': BOARD.push({ index: idx, name: 'FREE SERVER',       type: 'freeparking' }); break
    case 'chest':       BOARD.push({ index: idx, name: 'CODE CHEST',        type: 'chest' }); break
    case 'chance':      BOARD.push({ index: idx, name: 'CHANCE',            type: 'chance' }); break
    case 'tax':         BOARD.push({ index: idx, name: slot.taxName!,       type: 'tax', taxAmount: slot.tax }); break
    case 'loc': {
      const r = LOCATIONS[slot.ref!]
      const id = propIdFor('loc', slot.ref!)
      BOARD.push({ index: idx, name: r.name, type: 'property', propertyId: id })
      PROPERTIES.push({
        id, name: r.name, type: 'property', colorGroup: r.colorGroup,
        price: r.price, baseRent: r.baseRent, questionLevel: r.qLevel,
        housePrice: r.housePrice, boardIndex: idx
      })
      break
    }
    case 'rail': {
      const r = RAILWAYS[slot.ref!]
      const id = propIdFor('rail', slot.ref!)
      BOARD.push({ index: idx, name: r.name, type: 'railway', propertyId: id })
      PROPERTIES.push({
        id, name: r.name, type: 'railway', colorGroup: 'railway',
        price: r.price, baseRent: r.baseRent, questionLevel: r.qLevel, boardIndex: idx
      })
      break
    }
    case 'util': {
      const r = UTILITIES[slot.ref!]
      const id = propIdFor('util', slot.ref!)
      BOARD.push({ index: idx, name: r.name, type: 'utility', propertyId: id })
      PROPERTIES.push({
        id, name: r.name, type: 'utility', colorGroup: 'utility',
        price: r.price, baseRent: r.baseRent, questionLevel: r.qLevel, boardIndex: idx
      })
      break
    }
  }
})

export const PROPERTIES_BY_ID: Record<string, PropertyDef> =
  Object.fromEntries(PROPERTIES.map(p => [p.id, p]))

export const BOARD_INDEX_TO_PROPERTY: Record<number, PropertyDef | undefined> =
  Object.fromEntries(PROPERTIES.map(p => [p.boardIndex, p]))

export const COLOR_GROUP_MEMBERS: Record<ColorGroup, string[]> = (() => {
  const map: Partial<Record<ColorGroup, string[]>> = {}
  for (const p of PROPERTIES) {
    (map[p.colorGroup] ??= []).push(p.id)
  }
  return map as Record<ColorGroup, string[]>
})()

if (BOARD.length !== 40) {
  // eslint-disable-next-line no-console
  console.error('Technopoly board must be 40 spaces, got', BOARD.length)
}
