import { render } from '@testing-library/react'
import App from '../src/App'
import type { InboxEmail, TrainingModule } from '../src/content/types'
import { MemoryProgressStore, type ProgressEvent } from '../src/progress/store'
import { makeEmail, makeModule } from './fixtures'

export const fixtureModules = (): TrainingModule[] => [
  makeModule({ id: 'm-b', order: 2, title: 'Second module', minutes: 8 }),
  makeModule({ id: 'm-a', order: 1, title: 'First module', minutes: 5 }),
]

export function renderApp(opts: { route?: string; events?: ProgressEvent[]; modules?: TrainingModule[]; emails?: InboxEmail[] } = {}) {
  window.location.hash = opts.route ?? '#/'
  const store = new MemoryProgressStore()
  for (const e of opts.events ?? []) store.append(e)
  const utils = render(<App store={store} modules={opts.modules ?? fixtureModules()} emails={opts.emails ?? [makeEmail()]} />)
  return { ...utils, store }
}

export const passed = (moduleId: string, t = '2026-03-01T10:00:00.000Z'): ProgressEvent =>
  ({ moduleId, kind: 'quizScored', score: 1, timestamp: t })
