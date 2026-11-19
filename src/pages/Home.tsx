import { Link } from 'react-router-dom'
import { useContent } from '../content/ContentContext'
import { useProgress } from '../progress/ProgressContext'

export default function Home() {
  const { modules } = useContent()
  const { status } = useProgress()
  const total = modules.length
  const pct = total ? Math.round((status.completedCount / total) * 100) : 0

  return (
    <>
      <section className="hero">
        <h1>Security training that respects your time</h1>
        <p className="lead">
          Most attacks on companies don't start with clever code. They start with a convincing email, a
          friendly phone call or a tempting offer to someone at work. You're the best defence, and these
          short modules show you how, using real incidents.
        </p>
        <div className="progress-card">
          <div className="progress-row">
            <strong>{status.completedCount} of {total} complete</strong>
            <span className="muted">{pct}%</span>
          </div>
          <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Training progress">
            <div className="bar-fill" style={{ width: `${pct}%` }} />
          </div>
          {status.allComplete && (
            <Link to="/certificate" className="button primary">Get your certificate</Link>
          )}
        </div>
      </section>

      <ol className="module-list">
        {modules.map((m) => {
          const s = status.modules.find((x) => x.moduleId === m.id)
          return (
            <li key={m.id} className={`module-card${s?.complete ? ' is-done' : ''}`}>
              <Link to={`/module/${m.id}`} className="module-link">
                <span className="module-num" aria-hidden="true">{m.order}</span>
                <span className="module-body">
                  <span className="module-title">{m.title}</span>
                  <span className="module-meta">
                    {m.minutes} min · {m.story.headline}
                  </span>
                </span>
                {s?.complete ? (
                  <span className="badge done">Done</span>
                ) : s?.started ? (
                  <span className="badge">In progress</span>
                ) : null}
              </Link>
            </li>
          )
        })}
      </ol>
    </>
  )
}
