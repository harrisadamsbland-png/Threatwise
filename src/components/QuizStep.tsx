import { useState } from 'react'
import type { QuizQuestion } from '../content/types'
import { PASS_RATIO, scoreQuiz } from '../scoring'

interface Props {
  questions: QuizQuestion[]
  onSubmit(score: number): void
  onPass(): void
}

export default function QuizStep({ questions, onSubmit, onPass }: Props) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null))
  const [score, setScore] = useState<number | null>(null)
  const checked = score !== null
  const allAnswered = answers.every((a) => a !== null)
  const right = questions.filter((q, i) => answers[i] === q.correctIndex).length

  function submit() {
    const s = scoreQuiz(questions, answers)
    setScore(s)
    onSubmit(s)
  }

  function retry() {
    setAnswers(questions.map(() => null))
    setScore(null)
  }

  return (
    <div>
      {questions.map((q, qi) => (
        <fieldset key={q.id} className="quiz-q" role="radiogroup" aria-labelledby={`${q.id}-legend`}>
          <legend id={`${q.id}-legend`}>{qi + 1}. {q.prompt}</legend>
          {q.options.map((opt, oi) => {
            const chosen = answers[qi] === oi
            const cls = checked && chosen ? (oi === q.correctIndex ? ' is-right' : ' is-wrong') : ''
            return (
              <label key={oi} className={`option${cls}`}>
                <input
                  type="radio"
                  name={q.id}
                  checked={chosen}
                  disabled={checked}
                  onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                />
                <span>{opt}</span>
              </label>
            )
          })}
          {checked && (
            <p className={`feedback ${answers[qi] === q.correctIndex ? 'good' : 'bad'}`}>
              <strong>{answers[qi] === q.correctIndex ? 'Correct. ' : `The answer is: ${q.options[q.correctIndex]}. `}</strong>
              <span>{q.explanation}</span>
            </p>
          )}
        </fieldset>
      ))}

      {!checked ? (
        <div className="button-row">
          <button className="button primary" disabled={!allAnswered} onClick={submit}>Check answers</button>
        </div>
      ) : (
        <div aria-live="polite">
          <p className="result">
            {right} of {questions.length} correct.{' '}
            {score >= PASS_RATIO ? 'Nice work.' : `You need ${Math.ceil(PASS_RATIO * questions.length)} to pass. Have another go.`}
          </p>
          <div className="button-row">
            {score >= PASS_RATIO ? (
              <button className="button primary" onClick={onPass}>Next</button>
            ) : (
              <button className="button primary" onClick={retry}>Try again</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
