export interface Source { title: string; url: string }

export interface Story {
  headline: string
  date: string
  body: string[]
  stopMoment: string
  sources: Source[]
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface ScenarioChoice { label: string; feedback: string; safe: boolean; next?: string }
export interface ScenarioStep { id: string; text: string; choices: ScenarioChoice[] }
export interface Scenario {
  id: string
  title: string
  channel: 'phone' | 'chat' | 'email' | 'video'
  startId: string
  steps: ScenarioStep[]
}

export interface RedFlag { label: string; explanation: string }

export interface InboxEmail {
  id: string
  fromName: string
  fromAddress: string
  subject: string
  body: string[]
  attachment?: string
  isPhishing: boolean
  redFlags: RedFlag[]
  whySafe?: string
}

export type Practice =
  | { kind: 'inbox'; emailIds: string[] }
  | { kind: 'scenario'; scenario: Scenario }

export interface TrainingModule {
  id: string
  order: number
  title: string
  minutes: number
  story: Story
  lesson: string[]
  financeExample: string
  practice: Practice
  quiz: QuizQuestion[]
  whatToDo: string[]
}
