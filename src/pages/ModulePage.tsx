import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PretendInbox from '../components/PretendInbox'
import LessonStep from '../components/LessonStep'
import ScenarioPlayer from '../components/ScenarioPlayer'
import QuizStep from '../components/QuizStep'
import StoryStep from '../components/StoryStep'
import WhatToDoCard from '../components/WhatToDoCard'
import { useContent } from '../content/ContentContext'
import type { TrainingModule } from '../content/types'
import { useProgress } from '../progress/ProgressContext'

const STEPS = ['story', 'lesson', 'practice', 'quiz', 'whatToDo'] as const
type Step = (typeof STEPS)[number]
const LABELS: Record<Step, string> = {
  story: 'What happened',
  lesson: 'Lesson',
  practice: 'Practice',
  quiz: 'Quiz',
  whatToDo: 'What to do',
}

export default function ModulePage() {
  const { id } = useParams()
  const { modules } = useContent()
  const mod = modules.find((m) => m.id === id)
  if (!mod) {
    return (
      <div className="card">
        <h1>Module not found</h1>
        <p>That module doesn't exist (any more).</p>
        <Link to="/" className="button">Go home</Link>
      </div>
    )
  }
  return <ModulePlayer key={mod.id} mod={mod} />
}

function ModulePlayer({ mod }: { mod: TrainingModule }) {
  const { record } = useProgress()
  const [stepIndex, setStepIndex] = useState(0)
  const step = STEPS[stepIndex]
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)
  const startedRecorded = useRef(false)

  useEffect(() => {
    if (startedRecorded.current) return
    startedRecorded.current = true
    record({ moduleId: mod.id, kind: 'started' })
  }, [mod.id, record])

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    headingRef.current?.focus()
    window.scrollTo?.({ top: 0 })
  }, [stepIndex])

  const go = (delta: number) => setStepIndex((i) => Math.min(STEPS.length - 1, Math.max(0, i + delta)))
  const practiceRecorded = useRef(false)
  const finishPractice = () => {
    if (!practiceRecorded.current) {
      practiceRecorded.current = true
      record({ moduleId: mod.id, kind: 'practiceDone' })
    }
    go(1)
  }

  const heading = step === 'story' ? mod.story.headline : step === 'whatToDo' ? 'What to do' : LABELS[step]
  const showNav = step === 'story' || step === 'lesson'

  return (
    <article className="step">
      <p className="step-label">Module {mod.order} · {mod.title}</p>
      <ol className="stepper" aria-label={`Step ${stepIndex + 1} of ${STEPS.length}: ${LABELS[step]}`}>
        {STEPS.map((s, i) => (
          <li key={s} className={i === stepIndex ? 'is-active' : i < stepIndex ? 'is-past' : ''} />
        ))}
      </ol>
      {heading !== LABELS[step] && <p className="step-label">{LABELS[step]}</p>}
      <h2 ref={headingRef} tabIndex={-1}>{heading}</h2>

      <div hidden={step !== 'story'}><StoryStep story={mod.story} /></div>
      <div hidden={step !== 'lesson'}><LessonStep lesson={mod.lesson} financeExample={mod.financeExample} /></div>
      <div hidden={step !== 'practice'}><PracticeStep mod={mod} onDone={finishPractice} /></div>
      <div hidden={step !== 'quiz'}>
        <QuizStep
          questions={mod.quiz}
          onSubmit={(score) => record({ moduleId: mod.id, kind: 'quizScored', score })}
          onPass={() => go(1)}
        />
      </div>
      <div hidden={step !== 'whatToDo'}><WhatToDoCard items={mod.whatToDo} /></div>

      <div className="button-row">
        {stepIndex > 0 && step !== 'whatToDo' && (
          <button className="button" onClick={() => go(-1)}>Back</button>
        )}
        {showNav && <button className="button primary" onClick={() => go(1)}>Next</button>}
      </div>
    </article>
  )
}

function PracticeStep({ mod, onDone }: { mod: TrainingModule; onDone(): void }) {
  const { emails } = useContent()
  if (mod.practice.kind === 'inbox') {
    const ids = mod.practice.emailIds
    const chosen = ids.map((id) => emails.find((e) => e.id === id)).filter((e) => e !== undefined)
    return <PretendInbox emails={chosen} onDone={onDone} />
  }
  return <ScenarioPlayer scenario={mod.practice.scenario} onDone={onDone} />
}
