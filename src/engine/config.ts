import type { Config } from './types'

// Defaults come straight from the attached Technopoly document.
// Anything unclear in the doc is exposed here as a configurable value.
export const DEFAULT_CONFIG: Config = {
  startingMoney: 1500,          // rules: "Initial Money : 1500"
  gameDurationMs: 75 * 60_000,  // rules: "Total Game Time : 1: 15 Mins"
  salary: 200,                  // rules: "contributes 200 as the cash into your wealth as salary"
  jailFee: 50,                  // rules: "have to pay 50 and come out of the jail"
  auctionMinBid: 20,            // rules: "Min Bid : 20"
  maxChallenges: 3,             // rules: "Max Challenges: 3"
  maxChallengesPerTurn: 1,      // rules: "Per turn only one challenge"
  rentMultiplierSet: 1.5,       // rules: "complete color owned by the same team : then Rent becomes 1.5*X"
  rentMultiplierHouse1: 2,      // rules: "First House: 2*X rent"
  rentMultiplierHouse2: 3,      // rules: "Second House: 3*X rent"
  rentMultiplierHotel: 5,       // rules: "Hotel: 5*X"
  mortgageFraction: 0.5,        // rules: "mortgage of property is exactly half of the price"
  incomeTax: 200,               // sensible default; editable
  superTax: 100,                // sensible default; editable
  challengeQuestionLevel: 'hard', // "challenging question" — default hard; editable
  questionTimeSeconds: 30,        // per-question countdown; editable
  rentEscapeFractionOnCorrect: 0.5, // house rule: correct answer → pay 50% rent
  auctionQuestionFailPolicy: 'unowned' // safest default; editable
}
