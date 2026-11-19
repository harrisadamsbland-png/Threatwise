import type { InboxEmail, Scenario, TrainingModule } from './types'

function duplicates(ids: string[]): string[] {
  const seen = new Set<string>()
  const dupes = new Set<string>()
  for (const id of ids) (seen.has(id) ? dupes : seen).add(id)
  return [...dupes]
}

function checkScenario(prefix: string, s: Scenario, problems: string[]) {
  const stepIds = new Set(s.steps.map((st) => st.id))
  if (!stepIds.has(s.startId)) problems.push(`${prefix}: scenario startId points at missing step "${s.startId}"`)
  for (const d of duplicates(s.steps.map((st) => st.id))) problems.push(`${prefix}: duplicate step id "${d}"`)
  for (const step of s.steps) {
    if (step.choices.length === 0) problems.push(`${prefix}: step "${step.id}" has no choices`)
    for (const c of step.choices) {
      if (c.next !== undefined && !stepIds.has(c.next)) {
        problems.push(`${prefix}: choice "${c.label}" points at missing step "${c.next}"`)
      }
    }
  }
}

function checkEmail(e: InboxEmail, problems: string[]) {
  const p = `email ${e.id}`
  if (!/@[a-z0-9.-]+\.example$/i.test(e.fromAddress)) {
    problems.push(`${p}: sender "${e.fromAddress}" must use a fictional domain ending in .example`)
  }
  if (e.isPhishing && e.redFlags.length === 0) problems.push(`${p}: phishing email has no red flags`)
  if (!e.isPhishing && !e.whySafe) problems.push(`${p}: safe email needs whySafe`)
}

/** Returns one human-readable problem per issue; empty means valid. */
export function validateContent(modules: TrainingModule[], emails: InboxEmail[]): string[] {
  const problems: string[] = []
  const emailIds = new Set(emails.map((e) => e.id))

  for (const d of duplicates(modules.map((m) => m.id))) problems.push(`duplicate module id "${d}"`)
  for (const d of duplicates(emails.map((e) => e.id))) problems.push(`duplicate email id "${d}"`)
  for (const d of duplicates(modules.flatMap((m) => m.quiz.map((q) => q.id)))) {
    problems.push(`duplicate question id "${d}"`)
  }

  for (const m of modules) {
    const p = `module ${m.id}`
    if (m.story.sources.length === 0) problems.push(`${p}: story has no sources`)
    for (const s of m.story.sources) {
      if (!/^https:\/\//.test(s.url)) problems.push(`${p}: source "${s.title}" must be an https URL`)
    }
    if (m.quiz.length < 3 || m.quiz.length > 5) problems.push(`${p}: quiz needs 3–5 questions, has ${m.quiz.length}`)
    for (const q of m.quiz) {
      if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
        problems.push(`${p}: question ${q.id} correctIndex ${q.correctIndex} is out of range`)
      }
      if (!q.explanation) problems.push(`${p}: question ${q.id} has no explanation`)
    }
    if (!m.financeExample) problems.push(`${p}: missing financeExample`)
    if (m.whatToDo.length === 0) problems.push(`${p}: missing whatToDo items`)
    if (m.practice.kind === 'inbox') {
      for (const id of m.practice.emailIds) {
        if (!emailIds.has(id)) problems.push(`${p}: inbox practice references unknown email "${id}"`)
      }
    } else {
      checkScenario(p, m.practice.scenario, problems)
    }
  }

  for (const e of emails) checkEmail(e, problems)
  return problems
}
