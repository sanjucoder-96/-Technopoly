// Board data for Technopoly.
//
// Source of truth: the attached Technopoly rules PDF, page 2 ("Example Board")
// which shows the physical reference board — Monopoly India Edition. The note
// on that page reads:
//
//   "Board Style and Corresponding Tags may change as required for the
//    round alignment. Basic Structure and Correspondence remains same."
//
// So the property NAMES, PRICES, COLORS, LAYOUT are taken directly from the
// board image (page 2 of the PDF). Every property, its color group, its price
// and its board position below matches that image exactly.
//
// WHAT IS NOT IN THE DOCUMENT:
//   • Per-property BASE RENT ("X" in the rules formula) — the rules text says
//     "Per card rent: decided by the card itself" but the card values are not
//     legible in the PDF. Defaults below use the standard Monopoly India
//     Edition printed values for those exact cards (the physical cards on the
//     reference board). The Game Master can edit any of them in Settings.
//   • Per-property QUESTION LEVEL — the rules refer to "the level of the
//     property" and "same level of question", but no explicit mapping is
//     given. Defaults below are derived by price tier as an aid; the GM can
//     override each property's level in Settings.
//   • House / hotel prices — not in the rules text. Defaults use the standard
//     printed values for those color groups; editable.
//
// If a value cannot be derived from the document, it is exposed in Settings
// and marked in the code as an editable, GM-owned default.

import type { BoardSpace, PropertyDef, ColorGroup, QuestionLevel } from './types'

interface RawLoc {
  name: string
  colorGroup: ColorGroup
  price: number         // from document board image
  baseRent: number      // NOT in document; editable default
  housePrice: number    // NOT in document; editable default
  qLevel: QuestionLevel // NOT in document; editable default derived from price
}

// 22 locations, transcribed directly from page 2 of the PDF (Monopoly India
// Edition board), grouped by color.
const LOCATIONS: RawLoc[] = [
  // brown (2 locations, price 60)
  { name: 'Guwahati',       colorGroup: 'brown',   price: 60,  baseRent: 2,  housePrice: 50,  qLevel: 'easy' },
  { name: 'Bhubaneshwar',   colorGroup: 'brown',   price: 60,  baseRent: 4,  housePrice: 50,  qLevel: 'easy' },
  // sky blue (3 locations — priced 100/100/120 per board image)
  { name: 'Panaji (Goa)',   colorGroup: 'skyblue', price: 100, baseRent: 6,  housePrice: 50,  qLevel: 'easy' },
  { name: 'Agra',           colorGroup: 'skyblue', price: 100, baseRent: 6,  housePrice: 50,  qLevel: 'easy' },
  { name: 'Vadodara',       colorGroup: 'skyblue', price: 120, baseRent: 8,  housePrice: 50,  qLevel: 'easy' },
  // pink (3, 140/140/160)
  { name: 'Ludhiana',       colorGroup: 'pink',    price: 140, baseRent: 10, housePrice: 100, qLevel: 'medium' },
  { name: 'Bhopal',         colorGroup: 'pink',    price: 140, baseRent: 10, housePrice: 100, qLevel: 'medium' },
  { name: 'Patna',          colorGroup: 'pink',    price: 160, baseRent: 12, housePrice: 100, qLevel: 'medium' },
  // orange (3, 180/180/200)
  { name: 'Indore',         colorGroup: 'orange',  price: 180, baseRent: 14, housePrice: 100, qLevel: 'medium' },
  { name: 'Nagpur',         colorGroup: 'orange',  price: 180, baseRent: 14, housePrice: 100, qLevel: 'medium' },
  { name: 'Kochi',          colorGroup: 'orange',  price: 200, baseRent: 16, housePrice: 100, qLevel: 'medium' },
  // red (3, 220/220/240)
  { name: 'Lucknow',        colorGroup: 'red',     price: 220, baseRent: 18, housePrice: 150, qLevel: 'medium' },
  { name: 'Chandigarh',     colorGroup: 'red',     price: 220, baseRent: 18, housePrice: 150, qLevel: 'medium' },
  { name: 'Jaipur',         colorGroup: 'red',     price: 240, baseRent: 20, housePrice: 150, qLevel: 'medium' },
  // yellow (3, 260/260/280)
  { name: 'Pune',           colorGroup: 'yellow',  price: 260, baseRent: 22, housePrice: 150, qLevel: 'hard' },
  { name: 'Hyderabad',      colorGroup: 'yellow',  price: 260, baseRent: 22, housePrice: 150, qLevel: 'hard' },
  { name: 'Ahmedabad',      colorGroup: 'yellow',  price: 280, baseRent: 24, housePrice: 150, qLevel: 'hard' },
  // green (3, 300/300/320)
  { name: 'Kolkata',        colorGroup: 'green',   price: 300, baseRent: 26, housePrice: 200, qLevel: 'hard' },
  { name: 'Chennai',        colorGroup: 'green',   price: 300, baseRent: 26, housePrice: 200, qLevel: 'hard' },
  { name: 'Bengaluru',      colorGroup: 'green',   price: 320, baseRent: 28, housePrice: 200, qLevel: 'hard' },
  // dark blue (2, 350/400)
  { name: 'Delhi',          colorGroup: 'blue',    price: 350, baseRent: 35, housePrice: 200, qLevel: 'hard' },
  { name: 'Mumbai',         colorGroup: 'blue',    price: 400, baseRent: 50, housePrice: 200, qLevel: 'hard' }
]

// 4 railways, all M200 per the board image.
const RAILWAYS: Omit<RawLoc, 'housePrice'>[] = [
  { name: 'Chennai Central Railway Station',       colorGroup: 'railway', price: 200, baseRent: 25, qLevel: 'medium' },
  { name: 'Howrah Railway Station',                colorGroup: 'railway', price: 200, baseRent: 25, qLevel: 'medium' },
  { name: 'New Delhi Railway Station',             colorGroup: 'railway', price: 200, baseRent: 25, qLevel: 'medium' },
  { name: 'Chhatrapati Shivaji Terminus (VT)',     colorGroup: 'railway', price: 200, baseRent: 25, qLevel: 'medium' }
]

// 2 utilities, both M150 per the board image.
const UTILITIES: Omit<RawLoc, 'housePrice'>[] = [
  { name: 'Electric Company', colorGroup: 'utility', price: 150, baseRent: 10, qLevel: 'easy' },
  { name: 'Water Works',      colorGroup: 'utility', price: 150, baseRent: 10, qLevel: 'easy' }
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
  { kind: 'go' },                                                    // 0
  { kind: 'loc', ref: 0 },                                            // 1  Guwahati
  { kind: 'chest' },                                                  // 2
  { kind: 'loc', ref: 1 },                                            // 3  Bhubaneshwar
  { kind: 'tax', tax: 200, taxName: 'Income Tax' },                  // 4
  { kind: 'rail', ref: 0 },                                           // 5  Chennai Central RS
  { kind: 'loc', ref: 2 },                                            // 6  Panaji (Goa)
  { kind: 'chance' },                                                 // 7
  { kind: 'loc', ref: 3 },                                            // 8  Agra
  { kind: 'loc', ref: 4 },                                            // 9  Vadodara
  { kind: 'jail' },                                                   // 10
  { kind: 'loc', ref: 5 },                                            // 11 Ludhiana
  { kind: 'util', ref: 0 },                                           // 12 Electric Company
  { kind: 'loc', ref: 6 },                                            // 13 Bhopal
  { kind: 'loc', ref: 7 },                                            // 14 Patna
  { kind: 'rail', ref: 1 },                                           // 15 Howrah RS
  { kind: 'loc', ref: 8 },                                            // 16 Indore
  { kind: 'chest' },                                                  // 17
  { kind: 'loc', ref: 9 },                                            // 18 Nagpur
  { kind: 'loc', ref: 10 },                                           // 19 Kochi
  { kind: 'freeparking' },                                            // 20
  { kind: 'loc', ref: 11 },                                           // 21 Lucknow
  { kind: 'chance' },                                                 // 22
  { kind: 'loc', ref: 12 },                                           // 23 Chandigarh
  { kind: 'loc', ref: 13 },                                           // 24 Jaipur
  { kind: 'rail', ref: 2 },                                           // 25 New Delhi RS
  { kind: 'loc', ref: 14 },                                           // 26 Pune
  { kind: 'loc', ref: 15 },                                           // 27 Hyderabad
  { kind: 'util', ref: 1 },                                           // 28 Water Works
  { kind: 'loc', ref: 16 },                                           // 29 Ahmedabad
  { kind: 'gotojail' },                                               // 30
  { kind: 'loc', ref: 17 },                                           // 31 Kolkata
  { kind: 'loc', ref: 18 },                                           // 32 Chennai
  { kind: 'chest' },                                                  // 33
  { kind: 'loc', ref: 19 },                                           // 34 Bengaluru
  { kind: 'rail', ref: 3 },                                           // 35 Chhatrapati Shivaji Terminus
  { kind: 'chance' },                                                 // 36
  { kind: 'loc', ref: 20 },                                           // 37 Delhi
  { kind: 'tax', tax: 100, taxName: 'Super Tax' },                    // 38
  { kind: 'loc', ref: 21 }                                            // 39 Mumbai
]

export const BOARD: BoardSpace[] = []
export const PROPERTIES: PropertyDef[] = []
const propIdFor = (kind: 'loc' | 'rail' | 'util', ref: number) => `${kind}-${ref}`

LAYOUT.forEach((slot, idx) => {
  switch (slot.kind) {
    case 'go':          BOARD.push({ index: idx, name: 'GO / Start',       type: 'go' }); break
    case 'jail':        BOARD.push({ index: idx, name: 'Jail',             type: 'jail' }); break
    case 'gotojail':    BOARD.push({ index: idx, name: 'Go To Jail',       type: 'gotojail' }); break
    case 'freeparking': BOARD.push({ index: idx, name: 'Free Parking',     type: 'freeparking' }); break
    case 'chest':       BOARD.push({ index: idx, name: 'Chest',            type: 'chest' }); break
    case 'chance':      BOARD.push({ index: idx, name: 'Chance',           type: 'chance' }); break
    case 'tax':         BOARD.push({ index: idx, name: slot.taxName!,      type: 'tax', taxAmount: slot.tax }); break
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
