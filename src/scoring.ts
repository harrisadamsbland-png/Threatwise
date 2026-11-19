import type { InboxEmail, QuizQuestion } from './content/types'

export const PASS_RATIO = 0.7

export function scoreQuiz(questions: QuizQuestion[], answers: (number | null)[]): number {
  if (questions.length === 0) return 0
  const right = questions.filter((q, i) => answers[i] === q.correctIndex).length
  return right / questions.length
}

/** verdicts[id] === true means the employee said "phishing". */
export function scoreInbox(emails: InboxEmail[], verdicts: Record<string, boolean>) {
  const missed = emails.filter((e) => verdicts[e.id] !== e.isPhishing).map((e) => e.id)
  return { correct: emails.length - missed.length, total: emails.length, missed }
}
