import { PASS_RATIO } from '../scoring'
import type { ProgressEvent } from './store'

export interface ModuleStatus {
  moduleId: string
  started: boolean
  practiceDone: boolean
  bestScore: number | null
  complete: boolean
}

export interface ProgressSummary {
  modules: ModuleStatus[]
  completedCount: number
  allComplete: boolean
  completedAt: string | null
}

export function summarize(events: ProgressEvent[], moduleIds: string[]): ProgressSummary {
  const byId = new Map<string, ModuleStatus>()
  const completedTs = new Map<string, string>()
  for (const id of moduleIds) {
    byId.set(id, { moduleId: id, started: false, practiceDone: false, bestScore: null, complete: false })
  }
  for (const e of events) {
    const m = byId.get(e.moduleId)
    if (!m) continue
    if (e.kind === 'started') m.started = true
    if (e.kind === 'practiceDone') m.practiceDone = true
    if (e.kind === 'quizScored' && e.score !== undefined) {
      m.started = true
      m.bestScore = Math.max(m.bestScore ?? 0, e.score)
      if (e.score >= PASS_RATIO && !m.complete) {
        m.complete = true
        completedTs.set(m.moduleId, e.timestamp)
      }
    }
  }
  const modules = [...byId.values()]
  const completedCount = modules.filter((m) => m.complete).length
  const allComplete = modules.length > 0 && completedCount === modules.length
  const completedAt = allComplete ? [...completedTs.values()].reduce((a, b) => (a > b ? a : b)) : null
  return { modules, completedCount, allComplete, completedAt }
}
