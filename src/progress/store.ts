export type ProgressKind = 'started' | 'practiceDone' | 'quizScored'

/** score is a ratio 0..1, only on quizScored. Same shape a v2 backend would store per user. */
export interface ProgressEvent { moduleId: string; kind: ProgressKind; score?: number; timestamp: string }

export interface ProgressStore {
  load(): ProgressEvent[]
  append(e: ProgressEvent): void
  clear(): void
}

const KINDS: ProgressKind[] = ['started', 'practiceDone', 'quizScored']

function isEvent(x: unknown): x is ProgressEvent {
  if (typeof x !== 'object' || x === null) return false
  const e = x as Record<string, unknown>
  return (
    typeof e.moduleId === 'string' &&
    typeof e.timestamp === 'string' &&
    KINDS.includes(e.kind as ProgressKind) &&
    (e.score === undefined || (typeof e.score === 'number' && e.score >= 0 && e.score <= 1))
  )
}

export class MemoryProgressStore implements ProgressStore {
  private events: ProgressEvent[] = []
  load() { return [...this.events] }
  append(e: ProgressEvent) { this.events.push(e) }
  clear() { this.events = [] }
}

/** localStorage-backed; every access is guarded so blocked or corrupt storage never breaks the app. */
export class LocalProgressStore implements ProgressStore {
  private storage: Storage | undefined
  private key: string
  private events: ProgressEvent[]

  constructor(storage?: Storage, key = 'threatwise.progress.v1') {
    this.key = key
    try {
      this.storage = storage ?? window.localStorage
    } catch {
      this.storage = undefined
    }
    this.events = this.read()
  }

  private read(): ProgressEvent[] {
    try {
      const raw = this.storage?.getItem(this.key)
      if (!raw) return []
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter(isEvent) : []
    } catch {
      return []
    }
  }

  private write() {
    try {
      this.storage?.setItem(this.key, JSON.stringify(this.events))
    } catch {
      /* progress just isn't remembered */
    }
  }

  load() { return [...this.events] }
  append(e: ProgressEvent) { this.events.push(e); this.write() }
  clear() {
    this.events = []
    try { this.storage?.removeItem(this.key) } catch { /* ignore */ }
  }
}
