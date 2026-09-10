import { describe, it, expect } from 'vitest'
import { createGame } from './engine'
import { pickQuestion, recordAnswer } from './questionEngine'
import { DEFAULT_QUESTIONS } from './questionsData'
import type { Game } from './types'

function g(): Game { return createGame({ teamAName: 'A', teamBName: 'B', startingTeam: 'A' }) }

describe('question engine', () => {
  it('question bank has entries at every documented difficulty', () => {
    for (const level of ['easy', 'medium', 'medium_hard', 'hard'] as const) {
      const found = DEFAULT_QUESTIONS.filter(q => q.difficulty === level)
      expect(found.length).toBeGreaterThan(0)
    }
  })

  it('every default question has valid options and a correctIndex within range', () => {
    for (const q of DEFAULT_QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(2)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(q.options.length)
    }
  })

  it('pickQuestion returns a question matching the requested difficulty', () => {
    const gm = g()
    for (const level of ['easy', 'medium', 'medium_hard', 'hard'] as const) {
      const q = pickQuestion(gm, { difficulty: level })
      expect(q).not.toBeNull()
      expect(q!.difficulty).toBe(level)
    }
  })

  it('pickQuestion respects category filter when possible', () => {
    const gm = g()
    const q = pickQuestion(gm, { difficulty: 'medium', category: 'C-Basics' })
    expect(q).not.toBeNull()
    expect(q!.category).toBe('C-Basics')
  })

  it('pickQuestion avoids used questions until the pool is exhausted', () => {
    const gm = g()
    const seen = new Set<string>()
    const easy = DEFAULT_QUESTIONS.filter(q => q.difficulty === 'easy')
    for (let i = 0; i < easy.length; i++) {
      const q = pickQuestion(gm, { difficulty: 'easy' })
      expect(q).not.toBeNull()
      expect(seen.has(q!.id)).toBe(false)
      seen.add(q!.id)
      recordAnswer(gm, { question: q!, team: 'A', context: { kind: 'purchase', propertyId: 'loc-0' }, correct: true })
    }
    // Now the pool is exhausted; next pick relaxes the recency guard and returns one anyway.
    const q = pickQuestion(gm, { difficulty: 'easy' })
    expect(q).not.toBeNull()
  })

  it('recordAnswer stores an askedQuestion entry and emits an event', () => {
    const gm = g()
    const q = pickQuestion(gm, { difficulty: 'easy' })!
    const before = gm.events.length
    recordAnswer(gm, { question: q, team: 'A', context: { kind: 'purchase', propertyId: 'loc-0' }, correct: true })
    expect(gm.askedQuestions.length).toBe(1)
    expect(gm.askedQuestions[0].questionId).toBe(q.id)
    expect(gm.askedQuestions[0].correct).toBe(true)
    expect(gm.events.length).toBe(before + 1)
    expect(gm.events[gm.events.length - 1].type).toBe('question_asked')
  })

  it('pickQuestion returns null if the bank is empty', () => {
    const gm = g()
    gm.questions = []
    expect(pickQuestion(gm, { difficulty: 'easy' })).toBeNull()
  })

  it('pickQuestion returns null if no question matches the requested difficulty', () => {
    const gm = g()
    gm.questions = gm.questions.filter(q => q.difficulty !== 'hard')
    expect(pickQuestion(gm, { difficulty: 'hard' })).toBeNull()
  })

  it('pickQuestion falls back to any-category if category is empty', () => {
    const gm = g()
    // Force a filter that yields no matches for a category+difficulty combo
    const q = pickQuestion(gm, { difficulty: 'easy', category: 'DSA-Arrays' })
    expect(q).not.toBeNull()
  })
})
