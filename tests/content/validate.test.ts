import { describe, expect, it } from 'vitest'
import { validateContent } from '../../src/content/validate'
import { makeEmail, makeModule, makeScenario } from '../fixtures'

const has = (problems: string[], ...parts: string[]) =>
  problems.some((p) => parts.every((part) => p.includes(part)))

describe('validateContent', () => {
  it('accepts valid content', () => {
    expect(validateContent([makeModule()], [makeEmail()])).toEqual([])
  })

  it('flags a story with no sources', () => {
    const m = makeModule({ id: 'm-x' })
    m.story.sources = []
    expect(has(validateContent([m], [makeEmail()]), 'm-x', 'no sources')).toBe(true)
  })

  it('flags correctIndex out of range', () => {
    const m = makeModule()
    m.quiz[0].correctIndex = 5
    expect(has(validateContent([m], [makeEmail()]), 'correctIndex')).toBe(true)
  })

  it('requires 3–5 quiz questions', () => {
    const two = makeModule()
    two.quiz = two.quiz.slice(0, 2)
    const six = makeModule()
    six.quiz = [...six.quiz, ...six.quiz].map((q, i) => ({ ...q, id: `z${i}` }))
    expect(has(validateContent([two], [makeEmail()]), '3–5 questions')).toBe(true)
    expect(has(validateContent([six], [makeEmail()]), '3–5 questions')).toBe(true)
  })

  it('requires red flags on phishing emails', () => {
    expect(has(validateContent([makeModule()], [makeEmail({ redFlags: [] })]), 'e1', 'red flags')).toBe(true)
  })

  it('requires whySafe on safe emails', () => {
    const safe = makeEmail({ isPhishing: false, redFlags: [] })
    expect(has(validateContent([makeModule()], [safe]), 'whySafe')).toBe(true)
  })

  it('flags inbox practice referencing an unknown email', () => {
    const m = makeModule({ practice: { kind: 'inbox', emailIds: ['nope'] } })
    expect(has(validateContent([m], [makeEmail()]), 'unknown email', 'nope')).toBe(true)
  })

  it('flags scenario choices pointing at a missing step', () => {
    const s = makeScenario()
    s.steps[0].choices[0].next = 'zzz'
    const m = makeModule({ practice: { kind: 'scenario', scenario: s } })
    expect(has(validateContent([m], [makeEmail()]), 'missing step', 'zzz')).toBe(true)
  })

  it('flags a scenario whose startId is missing', () => {
    const m = makeModule({ practice: { kind: 'scenario', scenario: makeScenario({ startId: 'q' }) } })
    expect(has(validateContent([m], [makeEmail()]), 'missing step', 'q')).toBe(true)
  })

  it('requires fictional .example sender domains', () => {
    const e = makeEmail({ fromAddress: 'it@realbank.com' })
    expect(has(validateContent([makeModule()], [e]), 'fictional domain')).toBe(true)
  })

  it('flags duplicate module ids and question ids', () => {
    expect(has(validateContent([makeModule(), makeModule()], [makeEmail()]), 'duplicate', 'm-test')).toBe(true)
    const m = makeModule()
    m.quiz[1].id = m.quiz[0].id
    expect(has(validateContent([m], [makeEmail()]), 'duplicate', 'q0')).toBe(true)
  })
})

describe('validateContent body links', () => {
  it('requires URLs inside email bodies to use .example domains', () => {
    const e = makeEmail({ body: ['Go to https://www.realbank.com/login now'] })
    expect(has(validateContent([makeModule()], [e]), 'e1', 'link', 'fictional domain')).toBe(true)
  })
})
