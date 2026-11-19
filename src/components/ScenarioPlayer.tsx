import { useState } from 'react'
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

  const restart = () => { setStepId(scenario.startId); setPicked(null) }

  return (
    <div>
      <h3>{scenario.title}</h3>
      <span className="channel">{CHANNEL_LABEL[scenario.channel]}</span>
      <p className="scenario-text">{step.text}</p>

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
        <div aria-live="polite">
          <p className="muted">You chose: {picked.label}</p>
          <p className={`feedback ${picked.safe ? 'good' : 'bad'}`}>{picked.feedback}</p>
          <div className="button-row">
            {picked.next ? (
              <button className="button primary" onClick={() => { setStepId(picked.next!); setPicked(null) }}>Continue</button>
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
