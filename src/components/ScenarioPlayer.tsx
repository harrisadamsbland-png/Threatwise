import { useEffect, useRef, useState } from 'react'
import type { Scenario, ScenarioChoice } from '../content/types'

const CHANNEL_LABEL: Record<Scenario['channel'], string> = {
  phone: 'Phone call',
  chat: 'Chat message',
  email: 'Email',
  video: 'Video call',
}

export default function ScenarioPlayer({ scenario, onDone }: { scenario: Scenario; onDone(): void }) {
  const [stepId, setStepId] = useState(scenario.startId)
  const [picked, setPicked] = useState<ScenarioChoice | null>(null)
  const step = scenario.steps.find((s) => s.id === stepId)!
  const feedbackRef = useRef<HTMLParagraphElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const moved = useRef(false)

  // Keep keyboard and screen-reader users in place as buttons are swapped out.
  useEffect(() => {
    if (picked) feedbackRef.current?.focus()
    else if (moved.current) textRef.current?.focus()
  }, [picked, stepId])

  const restart = () => { moved.current = true; setStepId(scenario.startId); setPicked(null) }

  return (
    <div>
      <h3>{scenario.title}</h3>
      <span className="channel">{CHANNEL_LABEL[scenario.channel]}</span>
      <p className="scenario-text" ref={textRef} tabIndex={-1}>{step.text}</p>

      {!picked ? (
        <>
          <p className="muted">What do you do?</p>
          <div className="choice-list">
            {step.choices.map((c) => (
              <button key={c.label} className="button" onClick={() => setPicked(c)}>{c.label}</button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <p className="muted">You chose: {picked.label}</p>
          <p className={`feedback ${picked.safe ? 'good' : 'bad'}`} ref={feedbackRef} tabIndex={-1}>{picked.feedback}</p>
          <div className="button-row">
            {picked.next ? (
              <button className="button primary" onClick={() => { moved.current = true; setStepId(picked.next!); setPicked(null) }}>Continue</button>
            ) : (
              <button className="button primary" onClick={onDone}>Finish</button>
            )}
          </div>
        </div>
      )}
      {(picked || stepId !== scenario.startId) && (
        <div className="button-row">
          <button className="button" onClick={restart}>Start over</button>
        </div>
      )}
    </div>
  )
}
