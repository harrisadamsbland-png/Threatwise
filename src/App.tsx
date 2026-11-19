import { useMemo } from 'react'
import { HashRouter, Link, Route, Routes } from 'react-router-dom'
import { ContentContext } from './content/ContentContext'
import { INBOX_EMAILS } from './content/inbox'
import { MODULES } from './content/modules'
import type { InboxEmail, TrainingModule } from './content/types'
import CertificatePage from './pages/CertificatePage'
import Home from './pages/Home'
import ModulePage from './pages/ModulePage'
import { ProgressProvider } from './progress/ProgressContext'
import { LocalProgressStore, type ProgressStore } from './progress/store'

interface Props { store?: ProgressStore; modules?: TrainingModule[]; emails?: InboxEmail[] }

export default function App({ store, modules = MODULES, emails = INBOX_EMAILS }: Props) {
  const progressStore = useMemo(() => store ?? new LocalProgressStore(), [store])
  const sorted = useMemo(() => [...modules].sort((a, b) => a.order - b.order), [modules])
  const moduleIds = useMemo(() => sorted.map((m) => m.id), [sorted])
  const content = useMemo(() => ({ modules: sorted, emails }), [sorted, emails])

  return (
    <ContentContext.Provider value={content}>
      <ProgressProvider store={progressStore} moduleIds={moduleIds}>
        <HashRouter>
          <header className="site-header no-print">
            <Link to="/" className="brand">
              <span className="brand-mark" aria-hidden="true">◆</span> Threatwise
            </Link>
          </header>
          <main className="page">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/module/:id" element={<ModulePage />} />
              <Route path="/certificate" element={<CertificatePage />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </HashRouter>
      </ProgressProvider>
    </ContentContext.Provider>
  )
}
