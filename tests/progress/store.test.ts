import { describe, expect, it } from 'vitest'
import { LocalProgressStore, MemoryProgressStore, type ProgressEvent } from '../../src/progress/store'

class FakeStorage implements Storage {
  data = new Map<string, string>()
  get length() { return this.data.size }
  clear() { this.data.clear() }
  getItem(k: string) { return this.data.get(k) ?? null }
  key(i: number) { return [...this.data.keys()][i] ?? null }
  removeItem(k: string) { this.data.delete(k) }
  setItem(k: string, v: string) { this.data.set(k, v) }
}

const throwing = {
  getItem() { throw new Error('blocked') },
  setItem() { throw new Error('blocked') },
  removeItem() { throw new Error('blocked') },
} as unknown as Storage

const ev: ProgressEvent = { moduleId: 'm1', kind: 'quizScored', score: 0.8, timestamp: '2026-01-01T00:00:00.000Z' }

describe('LocalProgressStore', () => {
  it('round-trips events through storage', () => {
    const s = new FakeStorage()
    new LocalProgressStore(s).append(ev)
    expect(new LocalProgressStore(s).load()).toEqual([ev])
  })

  it('keeps working when storage throws', () => {
    const store = new LocalProgressStore(throwing)
    expect(store.load()).toEqual([])
    expect(() => store.append(ev)).not.toThrow()
    expect(store.load()).toEqual([ev])
    expect(() => store.clear()).not.toThrow()
  })

  it.each([['not json'], ['{"foo":1}'], ['null']])('ignores corrupt data %s', (raw) => {
    const s = new FakeStorage()
    s.setItem('threatwise.progress.v1', raw)
    expect(new LocalProgressStore(s).load()).toEqual([])
  })

  it('drops malformed events but keeps good ones', () => {
    const s = new FakeStorage()
    s.setItem('threatwise.progress.v1', JSON.stringify([ev, { moduleId: 1 }, { moduleId: 'm2', kind: 'bogus', timestamp: 'x' }, null]))
    expect(new LocalProgressStore(s).load()).toEqual([ev])
  })

  it('clear empties storage', () => {
    const s = new FakeStorage()
    const store = new LocalProgressStore(s)
    store.append(ev)
    store.clear()
    expect(new LocalProgressStore(s).load()).toEqual([])
  })
})

describe('MemoryProgressStore', () => {
  it('stores and clears', () => {
    const m = new MemoryProgressStore()
    m.append(ev)
    expect(m.load()).toEqual([ev])
    m.clear()
    expect(m.load()).toEqual([])
  })
})
