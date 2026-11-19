import { expect, it } from 'vitest'
import { INBOX_EMAILS } from '../../src/content/inbox'
import { MODULES } from '../../src/content/modules'
import { validateContent } from '../../src/content/validate'

it('shipped content passes validation', () => {
  expect(validateContent(MODULES, INBOX_EMAILS)).toEqual([])
})

it('ships 7 modules ordered 1..7, each 5–10 minutes', () => {
  expect(MODULES).toHaveLength(7)
  expect(MODULES.map((m) => m.order)).toEqual([1, 2, 3, 4, 5, 6, 7])
  for (const m of MODULES) expect(m.minutes >= 5 && m.minutes <= 10).toBe(true)
})

it('pretend inbox has 10 emails with a mix of phishing and safe', () => {
  expect(INBOX_EMAILS).toHaveLength(10)
  const phish = INBOX_EMAILS.filter((e) => e.isPhishing).length
  expect(phish).toBeGreaterThanOrEqual(5)
  expect(phish).toBeLessThanOrEqual(7)
})

it('content avoids shaming language', () => {
  const text = JSON.stringify([MODULES, INBOX_EMAILS]).toLowerCase().replaceAll('no blame', '')
  for (const word of ['fired', 'your fault', 'stupid', 'blame you for being careless']) {
    expect(text.includes(word), word).toBe(false)
  }
})

it('every quiz allows one wrong answer and still passes', async () => {
  const { PASS_RATIO } = await import('../../src/scoring')
  for (const m of MODULES) {
    const n = m.quiz.length
    expect((n - 1) / n >= PASS_RATIO, `${m.id} has ${n} questions`).toBe(true)
  }
})
