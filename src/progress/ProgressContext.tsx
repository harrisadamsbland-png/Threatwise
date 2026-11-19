import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ProgressEvent, ProgressStore } from './store'
import { summarize, type ProgressSummary } from './summary'

interface ProgressValue {
  events: ProgressEvent[]
  status: ProgressSummary
  record(e: Omit<ProgressEvent, 'timestamp'>): void
  reset(): void
}

const Ctx = createContext<ProgressValue | null>(null)

export function ProgressProvider({ store, moduleIds, children }: { store: ProgressStore; moduleIds: string[]; children: ReactNode }) {
  const [events, setEvents] = useState(() => store.load())
  const record = useCallback(
    (e: Omit<ProgressEvent, 'timestamp'>) => {
      store.append({ ...e, timestamp: new Date().toISOString() })
      setEvents(store.load())
    },
    [store],
  )
  const reset = useCallback(() => {
    store.clear()
    setEvents([])
  }, [store])
  const status = useMemo(() => summarize(events, moduleIds), [events, moduleIds])
  const value = useMemo(() => ({ events, status, record, reset }), [events, status, record, reset])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgress(): ProgressValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useProgress must be used inside ProgressProvider')
  return v
}
