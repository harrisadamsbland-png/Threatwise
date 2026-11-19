import { describe, expect, it } from 'vitest'
import { PASS_RATIO, scoreInbox, scoreQuiz } from '../src/scoring'
import { makeEmail, makeModule } from './fixtures'

describe('scoring', () => {
  it('pass ratio is 0.7', () => expect(PASS_RATIO).toBe(0.7))

  it('scores a quiz as a ratio, unanswered counts as wrong', () => {
    const qs = [...makeModule().quiz, { ...makeModule().quiz[0], id: 'q9' }]
    expect(scoreQuiz(qs, [0, 0, 0, 1])).toBe(0.75)
    expect(scoreQuiz(qs, [0, null, 0, 0])).toBe(0.75)
  })

  it('scores the inbox and lists missed emails', () => {
    const emails = [makeEmail({ id: 'a' }), makeEmail({ id: 'b', isPhishing: false }), makeEmail({ id: 'c' })]
    expect(scoreInbox(emails, { a: true, b: true })).toEqual({ correct: 1, total: 3, missed: ['b', 'c'] })
  })
})
