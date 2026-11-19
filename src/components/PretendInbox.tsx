import { useEffect, useRef, useState } from 'react'
import type { InboxEmail } from '../content/types'
import { scoreInbox } from '../scoring'

type Result = ReturnType<typeof scoreInbox>

interface Props {
  emails: InboxEmail[]
  onDone(result: Result): void
}

const URL_RE = /((?:https?|hxxps?):\/\/[^\s]+)/g

/** Practice content must never produce a live link, so URLs render as inert text. */
function InertText({ text }: { text: string }) {
  return (
    <>
      {text.split(URL_RE).map((part, i) =>
        i % 2 === 1 ? <span key={i} className="fake-link" title="Links are disabled in practice">{part}</span> : part,
      )}
    </>
  )
}

export default function PretendInbox({ emails, onDone }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [verdicts, setVerdicts] = useState<Record<string, boolean>>({})
  const [result, setResult] = useState<Result | null>(null)
  const open = emails.find((e) => e.id === openId)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const resultRef = useRef<HTMLParagraphElement>(null)
  const itemRefs = useRef(new Map<string, HTMLButtonElement>())
  const lastOpened = useRef<string | null>(null)

  useEffect(() => {
    if (openId) {
      lastOpened.current = openId
      headingRef.current?.focus()
    } else if (lastOpened.current) {
      itemRefs.current.get(lastOpened.current)?.focus()
    }
  }, [openId])

  useEffect(() => {
    if (result) resultRef.current?.focus()
  }, [result])
  const allJudged = emails.every((e) => e.id in verdicts)

  if (result) {
    return (
      <div>
        <p className="result" ref={resultRef} tabIndex={-1}>{result.correct} of {result.total} right</p>
        <p className="muted">Here's what to look for in each one.</p>
        {emails.map((e) => {
          const said = verdicts[e.id]
          const wrong = said !== e.isPhishing
          return (
            <section key={e.id} className={`review-item${wrong ? ' is-wrong' : ''}`}>
              <h3>{e.subject}</h3>
              <p className="muted">{e.fromName} &lt;{e.fromAddress}&gt;</p>
              <p>
                <strong>{e.isPhishing ? 'Phishing' : 'Safe'}</strong>
                {wrong && ` — You said ${said ? 'phishing — it was safe' : 'safe — it was phishing'}.`}
              </p>
              {e.isPhishing ? (
                <ul className="flag-list">
                  {e.redFlags.map((f) => (
                    <li key={f.label}><strong>{f.label}</strong>: <span>{f.explanation}</span></li>
                  ))}
                </ul>
              ) : (
                <p>{e.whySafe}</p>
              )}
            </section>
          )
        })}
        <div className="button-row">
          <button className="button primary" onClick={() => onDone(result)}>Continue to quiz</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p>
        This is a practice inbox at <strong>Northwind Office Co.</strong> Open each email and decide:
        phishing, or safe? Nothing here is real and links don't work.
      </p>
      <p className="muted">{Object.keys(verdicts).length} of {emails.length} judged</p>
      <div className={`inbox${open ? ' has-open' : ''}`}>
        <ul className="inbox-list">
          {emails.map((e) => (
            <li key={e.id}>
              <button
                ref={(el) => { if (el) itemRefs.current.set(e.id, el); else itemRefs.current.delete(e.id) }}
                className={`inbox-item${e.id === openId ? ' is-open' : ''}`}
                onClick={() => setOpenId(e.id)}
              >
                <span className="inbox-from">
                  <span>{e.fromName}</span>
                  {e.id in verdicts && (
                    <span className={`verdict-tag ${verdicts[e.id] ? 'phish' : 'safe'}`}>
                      {verdicts[e.id] ? 'Phishing' : 'Safe'}
                    </span>
                  )}
                </span>
                <span className="inbox-subject">{e.subject}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="email-view">
          {open ? (
            <>
              <button className="button back-to-inbox" onClick={() => setOpenId(null)}>← Back to inbox</button>
              <div className="email-head">
                <h3 ref={headingRef} tabIndex={-1}>{open.subject}</h3>
                <p><strong>{open.fromName}</strong></p>
                <p className="muted">{open.fromAddress}</p>
              </div>
              <div className="email-body">
                {open.body.map((p, i) => <p key={i}><InertText text={p} /></p>)}
                {open.attachment && <p><span className="attachment">📎 {open.attachment}</span></p>}
              </div>
              <div className="button-row">
                <button
                  className={`button${verdicts[open.id] === true ? ' is-chosen' : ''}`}
                  aria-pressed={verdicts[open.id] === true}
                  onClick={() => setVerdicts((v) => ({ ...v, [open.id]: true }))}
                >Phishing</button>
                <button
                  className={`button${verdicts[open.id] === false ? ' is-chosen' : ''}`}
                  aria-pressed={verdicts[open.id] === false}
                  onClick={() => setVerdicts((v) => ({ ...v, [open.id]: false }))}
                >Looks safe</button>
              </div>
            </>
          ) : (
            <p className="inbox-empty">Pick an email to read it.</p>
          )}
        </div>
      </div>
      <div className="button-row">
        <button className="button primary" disabled={!allJudged} onClick={() => setResult(scoreInbox(emails, verdicts))}>
          Check my answers
        </button>
      </div>
    </div>
  )
}
