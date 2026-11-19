import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../content/ContentContext'
import { useProgress } from '../progress/ProgressContext'

function formatDate(iso: string | null): string {
  const d = iso ? new Date(iso) : new Date()
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

export default function CertificatePage() {
  const { modules } = useContent()
  const { status } = useProgress()
  const [name, setName] = useState('')

  if (!status.allComplete) {
    const remaining = modules.filter((m) => !status.modules.find((s) => s.moduleId === m.id)?.complete)
    return (
      <div className="card">
        <h1>Almost there</h1>
        <p>Finish these modules first to unlock your certificate:</p>
        <ul>
          {remaining.map((m) => (
            <li key={m.id}><Link to={`/module/${m.id}`}>{m.title}</Link></li>
          ))}
        </ul>
      </div>
    )
  }

  const trimmed = name.trim()

  return (
    <>
      <div className="no-print">
        <h1>Your certificate</h1>
        <p>Well done. Type your name as you'd like it to appear, then print or save it as a PDF.</p>
        <div className="field">
          <label htmlFor="cert-name-input">Your name</label>
          <input id="cert-name-input" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div className="button-row">
          <button className="button primary" disabled={!trimmed} onClick={() => window.print()}>Print certificate</button>
          <Link to="/" className="button">Back to modules</Link>
        </div>
      </div>

      <section className="certificate" aria-label="Certificate">
        <p className="cert-title">Certificate of completion</p>
        <h2>Threatwise Security Awareness</h2>
        <p>This certifies that</p>
        <p className="cert-name">{trimmed || 'Your name'}</p>
        <p>completed all {modules.length} modules of security awareness training, including phishing, impersonation, deepfakes, bribery approaches, MFA safety and reporting.</p>
        <p className="muted">Completed {formatDate(status.completedAt)}</p>
      </section>
    </>
  )
}
