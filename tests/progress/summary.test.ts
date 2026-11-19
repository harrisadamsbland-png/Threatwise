import { describe, expect, it } from 'vitest'
import type { ProgressEvent } from '../../src/progress/store'
import { summarize } from '../../src/progress/summary'

const quiz = (moduleId: string, score: number, t: string): ProgressEvent => ({ moduleId, kind: 'quizScored', score, timestamp: t })
const ids = ['m1', 'm2']

describe('summarize', () => {
  it('starts with nothing complete', () => {
    const s = summarize([], ids)
    expect(s.completedCount).toBe(0)
    expect(s.allComplete).toBe(false)
    expect(s.completedAt).toBeNull()
    expect(s.modules.map((m) => m.complete)).toEqual([false, false])
  })

  it('passing score at or above 0.7 completes a module', () => {
    expect(summarize([quiz('m1', 0.8, '1')], ids).modules[0].complete).toBe(true)
    expect(summarize([quiz('m1', 0.7, '1')], ids).modules[0].complete).toBe(true)
    expect(summarize([quiz('m1', 0.6, '1')], ids).modules[0].complete).toBe(false)
  })

  it('keeps the best score when a retake is lower', () => {
    const m = summarize([quiz('m1', 0.9, '1'), quiz('m1', 0.4, '2')], ids).modules[0]
    expect(m.bestScore).toBe(0.9)
    expect(m.complete).toBe(true)
  })

  it('tracks started and practiceDone', () => {
    const m = summarize([
      { moduleId: 'm2', kind: 'started', timestamp: '1' },
      { moduleId: 'm2', kind: 'practiceDone', timestamp: '2' },
    ], ids).modules[1]
    expect(m.started).toBe(true)
    expect(m.practiceDone).toBe(true)
    expect(m.bestScore).toBeNull()
  })

  it('ignores unknown modules', () => {
    const s = summarize([quiz('zzz', 1, '1')], ids)
    expect(s.completedCount).toBe(0)
    expect(s.modules).toHaveLength(2)
  })

  it('reports allComplete and when the last module was completed, in any order', () => {
    const s = summarize([
      quiz('m2', 1, '2026-01-01T00:00:00.000Z'),
      quiz('m1', 0.5, '2026-01-02T00:00:00.000Z'),
      quiz('m1', 0.8, '2026-01-03T00:00:00.000Z'),
      quiz('m2', 1, '2026-01-04T00:00:00.000Z'),
    ], ids)
    expect(s.allComplete).toBe(true)
    expect(s.completedCount).toBe(2)
    expect(s.completedAt).toBe('2026-01-03T00:00:00.000Z')
  })
})
