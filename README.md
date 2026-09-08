# Technopoly — Offline Game Master Console

A production-quality, **offline** web application that lets one Game Master run
a full Technopoly event from a single laptop. It replaces the manual
bookkeeping — money, ownership, wealth, rent, auctions, trades, mortgages,
challenges, chests, chances, jail, tax, salary, timer and history — while the
players use the physical board, dice, tokens and cards.

- **Offline-first:** No backend, no accounts, no network required after build.
- **Persistent:** Auto-saves to `localStorage` after every action; refresh-safe.
- **Rules-faithful:** Behaviour follows the attached Technopoly rules document.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # emits ./dist (static, deployable anywhere)
npm run preview    # serve the built site
npm test           # 35 engine unit tests
```

The build ships as pure static assets (`./dist`). Copy it to a USB stick and
open `index.html` from a laptop with no internet — everything works.

## What it covers (from the rules document)

- Board: 40 spaces (22 locations + 4 railways + 2 utilities + 3 chest + 3 chance + 2 tax + jail + go-to-jail + free parking + GO).
- Starting money: `₹1500` (editable).
- Salary on lap: `₹200` (editable, auto-credited on board wrap).
- Property purchase (question → correct = buy; incorrect = stays unowned).
- Auction (min bid `₹20`, wealth cap, suspend if no valid bid).
- Trade (cash + properties + Get-Out-of-Jail cards; both sides preview + confirm).
- Mortgage at half price; unmortgage at half price; houses must be sold first.
- Houses / Hotel with question gates and correct rent multipliers
  (`X · 1.5 · 2 · 3 · 5`).
- Rent auto-calculated from state (owner / mortgage / set / houses / hotel).
- Challenge: max 3 total, 1 per turn; attacker Q → defender Q → transfer/deny.
- Chest deck (no question): random draw + typed effects.
- Chance deck: question first; correct → draw a positive card.
- Jail: enter from Go-To-Jail space or Chest card; exit by correct answer,
  `₹50` fine, or a held "Get Out of Jail Free" card.
- Tax (Income Tax `₹200`, Super Tax `₹100`, all editable).
- Final wealth: `Cash + 0.5·Σ(property price, non-mortgaged) + 0.5·Σ(house investment) + 0·mortgaged`.
- Bankruptcy ends the game with the opponent as winner.
- Timer (default `1:15:00`) ends the game and picks the wealth winner.

## Architecture

```
src/
  engine/            Pure game logic (no React). All rules live here.
    types.ts           Domain types.
    boardData.ts       40-space board + property definitions.
    cards.ts           Default Chest & Chance decks (editable in-app).
    config.ts          Default rule config (editable in-app).
    engine.ts          Pure functions: purchase, rent, wealth, auction, trade,
                       challenge, mortgage, houses, cards, jail, tax, timer.
    engine.test.ts     35 unit tests.
  store/
    gameStore.ts     Zustand store; wraps engine functions; persists to localStorage.
  ui/                Reusable presentational components + modals.
    primitives.tsx     Money, TeamBadge, Modal, Section, StatTile, EmptyState, etc.
    TimerBar.tsx       Countdown with start/pause/reset + urgency states.
    TeamPanel.tsx      Team cash + wealth + counts + "on the clock" indicator.
    BoardSelector.tsx  Fast picker for the landing space.
    LandingPanel.tsx   Automatic action flow for the landed space.
    PropertyCard.tsx   Compact property tile with color bar + state.
    PropertyGridPanel.tsx  Filterable property grid.
    EventLog.tsx       Timestamped, filterable event feed + cash correction.
    AuctionModal.tsx   Live auction interface with validation.
    TradeModal.tsx     Two-sided trade builder + confirm/review.
    ChallengeModal.tsx Attack → defend → resolve flow.
    CardModal.tsx      Chest / Chance draw+apply.
    JailModal.tsx      Correct / incorrect / use card.
    ManagePropertyModal.tsx  Mortgage / unmortgage / build / sell.
    SettingsModal.tsx  Rule + deck configuration (JSON-editable).
    WealthModal.tsx    Transparent formula breakdown.
    Toasts.tsx         Ephemeral event feedback.
    ResumePrompt.tsx   Notifies GM on rehydrated session.
  screens/
    SetupScreen.tsx    Team names + rule presets + start.
    Dashboard.tsx      Main GM console.
    EndScreen.tsx      Winner, wealth breakdown, export, history.
  lib/
    exportReport.ts    JSON download of the full game record.
  App.tsx              Screen router + timer heartbeat.
  main.tsx             React entry.
  index.css            Tailwind + design tokens + component classes.
```

The engine is the source of truth. All state changes go through pure
functions in `engine.ts`. The store is a thin adapter that snapshots a
draft, mutates it via the engine, and re-persists the whole game.

## Design intent

- Feels like a *live event console*, not an admin dashboard.
- Team A / Team B have distinct color identities (blue / orange) that carry
  through every panel, badge, card, tint and modal.
- All money is displayed with grouped digits (`en-IN`) and tabular numerals so
  columns stay aligned.
- Progressive disclosure: the landing space determines the action flow the GM
  sees; secondary actions (Trade, Challenge, Manage) are always one click away.
- Every destructive action asks for confirmation.
- Timer becomes visibly urgent under 5 min and critical under 1 min.

## Source-of-truth audit (post-review)

The full 7 pages of the Technopoly PDF were rendered as PNGs (via `pdfjs-dist`,
in `scratchpad/render.mjs`) and each was read into the audit. Findings:

| Item | Status | Source |
|---|---|---|
| **22 property names** (Guwahati, Bhubaneshwar, Panaji, Agra, Vadodara, Ludhiana, Bhopal, Patna, Indore, Nagpur, Kochi, Lucknow, Chandigarh, Jaipur, Pune, Hyderabad, Ahmedabad, Kolkata, Chennai, Bengaluru, Delhi, Mumbai) | ✓ From document | Board image, page 2 |
| **22 property prices** (60/60 / 100/100/120 / 140/140/160 / 180/180/200 / 220/220/240 / 260/260/280 / 300/300/320 / 350/400) | ✓ From document | Board image, page 2 |
| **8 color groups** (brown 2, sky 3, pink 3, orange 3, red 3, yellow 3, green 3, blue 2) | ✓ From document | Board image, page 2 |
| **4 railways** (Chennai Central, Howrah, New Delhi, Chhatrapati Shivaji Terminus) all at ₹200 | ✓ From document | Board image, page 2 |
| **2 utilities** (Electric Company, Water Works) both at ₹150 | ✓ From document | Board image, page 2 |
| **Board layout** — 40 spaces including exact positions of tax, chest, chance, jail, GO | ✓ From document | Board image, page 2 |
| **Income Tax ₹200 · Super Tax ₹100** | ✓ From document | Board image, page 2 |
| **Salary ₹200** | ✓ From document (text overrides board image's ₹150 per the "tags may change" note) | Rules text, page 5 |
| **Starting money ₹1,500 · Jail fee ₹50 · Auction min bid ₹20 · Rent multipliers (×1.5, ×2, ×3, ×5) · Mortgage 50% · Max challenges 3 (1/turn) · Timer 1:15:00 · Wealth formula** | ✓ From document | Rules text |
| **Per-property base rent (the "X" in the rules formula)** | ⚠ NOT specified in document. The rules text says "Per card rent : decided by the card itself" but the individual card values are not text-extractable from the PDF. Defaults are the standard Monopoly India Edition printed values for those exact cards; all editable in Settings. | Locally-authored default |
| **Per-property question level** | ⚠ NOT specified in document. Rules refer to "level of the property"; defaults derived from price tier (cheap→easy, mid→medium, expensive→hard). Editable per-property. | Locally-authored default |
| **House / hotel prices** | ⚠ NOT specified in document. Defaults follow standard tiered pricing (50/100/150/200 per color group). Editable in Settings. | Locally-authored default |
| **Chest card contents** | ⚠ NOT in document. Rules say only "may contain positive/negative impact… teams must abide by the instruction the card has." Ships with 6 clearly-labelled **TEMPLATE** cards showing the effect shapes the engine supports. GM must edit these to match the physical Chest deck. | Locally-authored templates |
| **Chance card contents** | ⚠ NOT in document. Rules say only "All cards provide a positive effect to wealth." Ships with 4 **TEMPLATE** cards. GM must edit to match the physical Chance deck. | Locally-authored templates |
| **Question bank** | ⚠ NOT in document. Cover art references DSA (Arrays, Linked Lists, Stacks, Queues, Trees, Graphs) and C (Variables, Pointers, Functions, Arrays, Structures, File Handling), so the theme is CS/programming. 45 questions authored across `DSA`, `C`, `General` × `easy / medium / hard`. Fully editable JSON in Settings; a Question History is recorded. | Locally-authored default |

Anything that could not be recovered from the document is marked in code as
`LOCALLY-AUTHORED DEFAULT` and exposed for GM editing in `Settings ⚙`.

## Question flow (added)

Every action that the rules require a question for now displays the actual
question on the laptop:

- Property purchase → `easy / medium / hard` question tuned to the property.
- House build → medium.
- Hotel build → hard.
- Challenge attack → configurable difficulty (default hard).
- Challenge defence → same difficulty.
- Chance draw → medium.
- Jail exit → medium.

Flow: **display question + team + property + difficulty → REVEAL ANSWER
(correct option highlighted) → CORRECT / WRONG → engine applies rule**.
Questions are picked by `pickQuestion(game, { difficulty, category })` which
filters, avoids recently-used entries, and falls back gracefully. Every asked
question is recorded to `askedQuestions` and surfaced as a `question_asked`
event in the log.

## Rules-document ambiguities & how they are handled

Everything ambiguous is exposed as an **editable config value** and defaulted
to a sensible interpretation.

| Ambiguity | Default | Where |
|---|---|---|
| Total number of properties per color set | Standard Monopoly-style 2/3/3/3/3/3/3/2 (grid | boardData.ts |
| Property prices & rents (not spelled out) | Monopoly-scaled to `₹1500` starting money | boardData.ts |
| "Challenging question" level | `hard` | config.ts (`challengeQuestionLevel`) |
| Question level required for houses / hotels | House: medium, Hotel: hard (GM prompt) | ManagePropertyModal |
| Hotel cost | Same as house cost per property; investment tracked | canBuildHotel / buildHotel |
| Refund when selling a house | Half of the house cost (matches document's example: "built for 100 … 50") | sellHouse / sellHotel |
| Tax amounts | Income `₹200`, Super `₹100` | config.ts |
| Card contents (image-only in the rules) | 10 Chest + 9 Chance sensible defaults | cards.ts (JSON-editable) |
| Trading of properties with houses | Disallowed — sell first (rules unclear; standard practice) | canExecuteTrade |
| Jail "next turn" question | GM handles via Jail modal — correct = free, incorrect = fee, or use card | JailModal / attemptJailExit |
| "Bank corruption" as bankruptcy trigger | Any cash going below zero after a payment triggers bankruptcy → opponent wins | checkBankruptcy |
| Time expiry | Timer expiry auto-ends the game; wealth winner declared | checkTimeExpiry / endGame |

The GM can change any of these live from **Settings** (⚙ in the top bar).

## Tests & build

```
$ npm test
✓ 35 tests passing (property purchase, rent, mortgage, wealth, auction,
  trade, challenge, jail, cards, turn, timer, bankruptcy, color set).

$ npm run build
✓ built in ~2.5s   dist/index.html + dist/assets/*   ~72KB gzip JS.
```

## Offline / recovery

- All state (game, auction, decks, config, events) is persisted via
  `zustand/middleware/persist` to `localStorage` under `technopoly-gm-state-v1`.
- Refreshing the browser resumes the exact game — timer, position, ownership,
  history included.
- No external HTTP calls at runtime. The only remote resource used at all is
  the optional Google Fonts stylesheet in `src/index.css`; when offline the
  system font stack takes over automatically (no visible degradation).

## Correction workflow

Every cash-affecting event in the log has a subtle `↩` action. Clicking it
asks for a reason and reverses just the money movement, logging a new
`correction` event. The rest of the history stays immutable so disputes at
a live event have an audit trail.

## Known limitations

- Chest / Chance card art is not reproduced from the PDF (those pages are
  image-only). Card **titles, descriptions and typed effects** are seeded
  with sensible defaults and are fully editable from Settings before or
  during a game.
- The GM enters the landing space manually per turn — the app never tries to
  detect physical dice or token position, per the design brief.
