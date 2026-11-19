import type { InboxEmail, Scenario, TrainingModule } from '../src/content/types'

export function makeEmail(over: Partial<InboxEmail> = {}): InboxEmail {
  return {
    id: 'e1',
    fromName: 'IT Support',
    fromAddress: 'it@northwind-0ffice.example',
    subject: 'Password expires today',
    body: ['Reset now at hxxp://northwind-0ffice.example/reset'],
    isPhishing: true,
    redFlags: [{ label: 'Lookalike domain', explanation: 'Zero instead of O.' }],
    ...over,
  }
}

export function makeScenario(over: Partial<Scenario> = {}): Scenario {
  return {
    id: 's1',
    title: 'A call from "IT"',
    channel: 'phone',
    startId: 'a',
    steps: [
      {
        id: 'a',
        text: 'Someone says they are from IT and need your code.',
        choices: [
          { label: 'Read out the code', feedback: 'Never share codes.', safe: false, next: 'b' },
          { label: 'Hang up and call IT back', feedback: 'Exactly right.', safe: true },
        ],
      },
      {
        id: 'b',
        text: 'They now ask for your password.',
        choices: [{ label: 'Hang up and report it', feedback: 'Good recovery.', safe: true }],
      },
    ],
    ...over,
  }
}

export function makeModule(over: Partial<TrainingModule> = {}): TrainingModule {
  return {
    id: 'm-test',
    order: 1,
    title: 'Test module',
    minutes: 6,
    story: {
      headline: 'Something happened',
      date: '2020-01-01',
      body: ['A paragraph.'],
      stopMoment: 'When the email arrived.',
      sources: [{ title: 'Source', url: 'https://example.com/a' }],
    },
    lesson: ['Lesson paragraph.'],
    financeExample: 'A finance example.',
    practice: { kind: 'inbox', emailIds: ['e1'] },
    quiz: [0, 1, 2].map((i) => ({
      id: `q${i}`,
      prompt: `Question ${i}?`,
      options: ['Right', 'Wrong'],
      correctIndex: 0,
      explanation: `Because ${i}.`,
    })),
    whatToDo: ['Stop', 'Check', 'Report'],
    ...over,
  }
}
