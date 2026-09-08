// Question selection and history — pure functions.
//
// Contract: `pickQuestion` selects a random question matching the required
// difficulty (and optionally category), avoiding recently-used ones. If the
// filtered pool is exhausted, we relax the recency constraint before giving up.
// `recordAnswer` appends to askedQuestions.

import type { AskedQuestion, Game, Question, QuestionCategory, QuestionContext, QuestionLevel, TeamId } from './types'
import { logEvent, nextEventId } from './engineLogger'

export interface PickOptions {
  difficulty: QuestionLevel
  category?: QuestionCategory
}

export function pickQuestion(g: Game, opts: PickOptions): Question | null {
  const bank = g.questions
  if (!bank || bank.length === 0) return null
  const usedIds = new Set(g.askedQuestions.map(a => a.questionId))

  const byLevel = bank.filter(q => q.difficulty === opts.difficulty)
  if (byLevel.length === 0) return null

  const primary = opts.category
    ? byLevel.filter(q => q.category === opts.category)
    : byLevel

  const pool = primary.length > 0 ? primary : byLevel
  const fresh = pool.filter(q => !usedIds.has(q.id))
  const candidates = fresh.length > 0 ? fresh : pool
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export function recordAnswer(g: Game, opts: {
  question: Question
  team: TeamId
  context: QuestionContext
  correct: boolean
}): AskedQuestion {
  const asked: AskedQuestion = {
    id: nextEventId(),
    questionId: opts.question.id,
    team: opts.team,
    context: opts.context,
    difficulty: opts.question.difficulty,
    correct: opts.correct,
    ts: Date.now()
  }
  g.askedQuestions.push(asked)
  logEvent(g, {
    type: 'question_asked',
    team: opts.team,
    message: `${g.teams[opts.team].name} — ${opts.question.difficulty} question ${opts.correct ? 'answered correctly' : 'answered incorrectly'} (${describeContext(opts.context)}).`
  })
  return asked
}

function describeContext(c: QuestionContext): string {
  switch (c.kind) {
    case 'purchase': return 'purchase'
    case 'build_house': return 'build house'
    case 'build_hotel': return 'build hotel'
    case 'challenge_attack': return 'challenge attack'
    case 'challenge_defend': return 'challenge defence'
    case 'chance': return 'chance'
    case 'jail_exit': return 'jail exit'
  }
}
