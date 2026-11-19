# Threatwise Employee Training Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static web app that trains office employees to spot phishing, impersonation, bribes and other human-risk attacks, through 7 short story-led modules, a pretend inbox, scenarios, quizzes and a certificate.

**Architecture:** React SPA with hash routing (works on any static host). All training content lives as typed TS data files validated by a content checker that runs in the test suite. Progress is a list of events behind a `ProgressStore` interface (localStorage now, a backend in v2); everything shown to the user is derived from those events.

**Tech Stack:** Vite + React 18 + TypeScript, react-router-dom (HashRouter), Vitest + @testing-library/react + jsdom, plain CSS with custom properties.

**Spec:** `docs/superpowers/specs/2026-11-18-threatwise-design.md`

## Global Constraints

- Audience: any office job; every module includes at least one crypto/finance example.
- Tone: "you're the best defence" — never shaming or fear-based. No "you'll be fired" language.
- Each module ~5–10 minutes: story → lesson → practice → quiz (3–5 questions) → "what to do" card.
- Pretend inbox and scenarios use a fictional company (**Northwind Office Co.**, domain `northwind-office.example`) and fictional vendors only; never real brands, real domains or real people's names in practice emails.
- Real stories cite ≥1 public source URL; facts must match the sources.
- No logins, no network calls, no real emails sent.
- If browser storage is unavailable or corrupt, the app still works; progress just isn't remembered.
- Must be usable at 360px wide (phone) and on desktop.
- Module counts as complete when its quiz is passed: score ratio ≥ 0.7 (builder's call; spec is silent).

## Review Focus

1. `localStorage` throws (private mode / blocked) → app renders and all modules are playable; progress silently not saved. *(Task 2 test)*
2. Stored progress is corrupt or from an unknown shape → ignored, not a crash. *(Task 2 test)*
3. Employee retakes a quiz and scores lower → module stays complete (best attempt counts). *(Task 2 test)*
4. Certificate with empty or whitespace-only name → print disabled; very long name wraps rather than overflowing. *(Task 7 test)*
5. Pretend inbox at 360px width → email list and reading pane stack; flag buttons reachable without horizontal scroll. *(Task 9 screenshot check)*

---

## File Structure

```
threatwise/
  index.html, package.json, vite.config.ts, tsconfig.json
  src/
    main.tsx, App.tsx, styles.css
    content/
      types.ts            # all content types
      validate.ts         # validateContent(): string[] of problems
      inbox.ts            # INBOX_EMAILS
      modules/
        index.ts          # MODULES (ordered)
        m1-phishing.ts … m7-reporting.ts
    progress/
      store.ts            # ProgressEvent, ProgressStore, LocalProgressStore, MemoryProgressStore
      summary.ts          # summarize(events, modules)
      ProgressContext.tsx # React provider + useProgress()
    scoring.ts            # scoreQuiz, scoreInbox, PASS_RATIO
    pages/
      Home.tsx, ModulePage.tsx, CertificatePage.tsx
    components/
      StoryStep.tsx, LessonStep.tsx, QuizStep.tsx, WhatToDoCard.tsx,
      PretendInbox.tsx, ScenarioPlayer.tsx
  tests/  (mirrors src: *.test.ts / *.test.tsx)
```

---

### Task 1: Scaffold, content types and content validator

**Files:**
- Create: project scaffold (`npm create vite@latest threatwise -- --template react-ts` contents, kept minimal), `src/content/types.ts`, `src/content/validate.ts`, `src/content/modules/index.ts` (exports `MODULES: TrainingModule[] = []` for now), `src/content/inbox.ts` (exports `INBOX_EMAILS: InboxEmail[] = []`)
- Test: `tests/content/validate.test.ts`

**Interfaces:**
- Produces (`src/content/types.ts`):
  ```ts
  export interface Source { title: string; url: string }
  export interface Story { headline: string; date: string; body: string[]; stopMoment: string; sources: Source[] }
  export interface QuizQuestion { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string }
  export interface ScenarioChoice { label: string; feedback: string; safe: boolean; next?: string }
  export interface ScenarioStep { id: string; text: string; choices: ScenarioChoice[] }
  export interface Scenario { id: string; title: string; channel: 'phone' | 'chat' | 'email' | 'video'; startId: string; steps: ScenarioStep[] }
  export interface RedFlag { label: string; explanation: string }
  export interface InboxEmail { id: string; fromName: string; fromAddress: string; subject: string; body: string[]; attachment?: string; isPhishing: boolean; redFlags: RedFlag[]; whySafe?: string }
  export type Practice = { kind: 'inbox'; emailIds: string[] } | { kind: 'scenario'; scenario: Scenario }
  export interface TrainingModule { id: string; order: number; title: string; minutes: number; story: Story; lesson: string[]; financeExample: string; practice: Practice; quiz: QuizQuestion[]; whatToDo: string[] }
  ```
- Produces: `validateContent(modules: TrainingModule[], emails: InboxEmail[]): string[]` — empty array means valid.

- [ ] **Step 1: `git init`, scaffold Vite react-ts, add Vitest, jsdom, @testing-library/react, @testing-library/jest-dom, react-router-dom; set `test.environment = 'jsdom'` in `vite.config.ts`; `npm test` script runs `vitest run`.**

- [ ] **Step 2: Write failing tests** in `tests/content/validate.test.ts`, using a small valid fixture module + email built in the test file:
  - `validateContent([valid], [email])` → `[]`
  - module with zero `story.sources` → result contains a string including `"no sources"` and the module id
  - question with `correctIndex` out of range → contains `"correctIndex"`
  - quiz with 2 or 6 questions → contains `"3–5 questions"`
  - phishing email with empty `redFlags` → contains `"red flags"`
  - safe email without `whySafe` → contains `"whySafe"`
  - inbox practice referencing unknown email id → contains `"unknown email"`
  - scenario choice `next` pointing at a missing step id → contains `"missing step"`
  - email `fromAddress` not ending in `.example` → contains `"fictional domain"`
  - duplicate module ids or question ids → contains `"duplicate"`
  - `tests/content/real-content.test.ts`: `validateContent(MODULES, INBOX_EMAILS)` equals `[]` (passes trivially until content lands).

- [ ] **Step 3: Run `npm test` — expect validate tests FAIL (function missing).**

- [ ] **Step 4: Implement `validateContent`** returning one human-readable string per problem, prefixed with the module/email id.

- [ ] **Step 5: Run `npm test` — expect PASS.**

- [ ] **Step 6: Commit** `feat: scaffold app with content types and validator`

---

### Task 2: Progress store and summary

**Files:**
- Create: `src/progress/store.ts`, `src/progress/summary.ts`, `src/scoring.ts`
- Test: `tests/progress/store.test.ts`, `tests/progress/summary.test.ts`, `tests/scoring.test.ts`

**Interfaces:**
- Produces (`store.ts`):
  ```ts
  export type ProgressKind = 'started' | 'practiceDone' | 'quizScored'
  export interface ProgressEvent { moduleId: string; kind: ProgressKind; score?: number; timestamp: string } // score = ratio 0..1
  export interface ProgressStore { load(): ProgressEvent[]; append(e: ProgressEvent): void; clear(): void }
  export class LocalProgressStore implements ProgressStore { constructor(storage?: Storage, key = 'threatwise.progress.v1') }
  export class MemoryProgressStore implements ProgressStore {}
  ```
- Produces (`summary.ts`):
  ```ts
  export interface ModuleStatus { moduleId: string; started: boolean; practiceDone: boolean; bestScore: number | null; complete: boolean }
  export function summarize(events: ProgressEvent[], moduleIds: string[]): { modules: ModuleStatus[]; completedCount: number; allComplete: boolean; completedAt: string | null }
  ```
  `completedAt` = timestamp of the event that completed the last module.
- Produces (`scoring.ts`): `PASS_RATIO = 0.7`; `scoreQuiz(questions: QuizQuestion[], answers: (number|null)[]): number` (ratio); `scoreInbox(emails: InboxEmail[], verdicts: Record<string, boolean>): { correct: number; total: number; missed: string[] }` (verdict `true` = "phishing"; `missed` = ids judged wrong or unanswered).

- [ ] **Step 1: Write failing tests**
  - Store: append then load round-trips; `new LocalProgressStore(throwingStorage)` → `load()` returns `[]` and `append()` does not throw *(Review Focus 1)*; storage containing `"not json"` or `{"foo":1}` or an array with malformed events → `load()` returns only well-formed events / `[]` *(Review Focus 2)*; `clear()` empties.
  - Summary: no events → all incomplete, `completedCount 0`; quizScored 0.8 → complete; 0.6 → incomplete; scores 0.9 then 0.4 → `bestScore 0.9`, still complete *(Review Focus 3)*; events for unknown module ids ignored; all modules complete in any order → `allComplete true`, `completedAt` = latest completing event.
  - Scoring: `scoreQuiz` with 3/4 correct → 0.75; unanswered counts wrong; `scoreInbox` reports `missed` ids.

- [ ] **Step 2: Run `npm test` — expect FAIL.**

- [ ] **Step 3: Implement.** `LocalProgressStore` wraps every storage access in try/catch and keeps an in-memory copy so the session still works when writes fail.

- [ ] **Step 4: Run `npm test` — expect PASS.**

- [ ] **Step 5: Commit** `feat: progress events, summary and scoring`

---

### Task 3: App shell, routing and Home page

**Files:**
- Create: `src/progress/ProgressContext.tsx`, `src/App.tsx`, `src/pages/Home.tsx`, `src/styles.css`; modify `src/main.tsx`
- Test: `tests/pages/Home.test.tsx`

**Interfaces:**
- Consumes: `MODULES`, `ProgressStore`, `summarize`.
- Produces: `<ProgressProvider store={ProgressStore}>`; `useProgress(): { events; status: ReturnType<typeof summarize>; record(e: Omit<ProgressEvent,'timestamp'>): void; reset(): void }`. Routes (HashRouter): `/` Home, `/module/:id` ModulePage, `/certificate` CertificatePage. `App` accepts optional `store` prop (default `LocalProgressStore`) and `modules` prop (default `MODULES`) for tests.

- [ ] **Step 1: Write failing tests** (render `App` with `MemoryProgressStore` and fixture modules):
  - Home lists every module title in `order`, each with its minutes and a link to `/module/<id>`.
  - Shows "0 of N complete"; after store pre-seeded with a passing quizScored event, shows "1 of N complete" and a "Done" badge on that module.
  - Certificate link is absent until all complete, then present.
  - Intro copy contains "best defence".
- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement.** Style tokens in `:root` (colors, spacing), light and dark via `prefers-color-scheme`; mobile-first layout, max content width ~760px.
- [ ] **Step 4: Run — PASS.**
- [ ] **Step 5: Commit** `feat: app shell, progress context and home page`

---

### Task 4: Module player (story, lesson, quiz, what-to-do)

**Files:**
- Create: `src/pages/ModulePage.tsx`, `src/components/StoryStep.tsx`, `LessonStep.tsx`, `QuizStep.tsx`, `WhatToDoCard.tsx`
- Test: `tests/pages/ModulePage.test.tsx`, `tests/components/QuizStep.test.tsx`

**Interfaces:**
- Consumes: `useProgress().record`, `scoreQuiz`, `PASS_RATIO`.
- Produces: `ModulePage` steps in order `story → lesson → practice → quiz → whatToDo` with Back/Next. Practice step renders `<PretendInbox emails onDone(result)>` or `<ScenarioPlayer scenario onDone()>` (Tasks 5, 6); until those exist, render a placeholder with a "Continue" button.
  `QuizStep` props: `{ questions: QuizQuestion[]; onSubmit(score: number): void }`.

- [ ] **Step 1: Write failing tests**
  - Opening a module records `started`; story step shows headline, `stopMoment` under the heading "The moment it could have been stopped", and every source as a link with `target="_blank" rel="noopener noreferrer"`.
  - Lesson step shows lesson paragraphs and the `financeExample` under "In finance and crypto".
  - Quiz: Submit disabled until every question answered; after submit shows each explanation, marks right/wrong, records `quizScored` with ratio; below `PASS_RATIO` shows "Try again" which resets answers; at/above shows "Next".
  - What-to-do card lists `whatToDo` items and a "Back to all modules" link.
  - Unknown module id → "Module not found" with a link home.
- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement.** Quiz options are radio groups (keyboard accessible); step changes move focus to the step heading.
- [ ] **Step 4: Run — PASS.**
- [ ] **Step 5: Commit** `feat: module player with story, lesson, quiz and action card`

---

### Task 5: Pretend inbox

**Files:**
- Create: `src/components/PretendInbox.tsx`; wire into `ModulePage`
- Test: `tests/components/PretendInbox.test.tsx`

**Interfaces:**
- Consumes: `InboxEmail`, `scoreInbox`.
- Produces: `PretendInbox` props `{ emails: InboxEmail[]; onDone(result: ReturnType<typeof scoreInbox>): void }`. On done, `ModulePage` records `practiceDone`.

- [ ] **Step 1: Write failing tests**
  - Lists sender name + subject for each email; clicking one opens it showing from address, body and attachment name.
  - Each opened email has "Phishing" and "Looks safe" buttons; chosen verdict shown in the list.
  - "Check my answers" disabled until every email has a verdict; then shows "X of N right", and for each email its red flags (label + explanation) or `whySafe`, marking wrong verdicts.
  - Links in email bodies are rendered as non-clickable styled text (no `<a href>`).
- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement.** Two-pane on ≥720px, stacked list-then-email below 720px with a "Back to inbox" button.
- [ ] **Step 4: Run — PASS.**
- [ ] **Step 5: Commit** `feat: pretend inbox practice`

---

### Task 6: Scenario player

**Files:**
- Create: `src/components/ScenarioPlayer.tsx`; wire into `ModulePage`
- Test: `tests/components/ScenarioPlayer.test.tsx`

**Interfaces:**
- Produces: `ScenarioPlayer` props `{ scenario: Scenario; onDone(): void }`.

- [ ] **Step 1: Write failing tests** (fixture with 2 steps):
  - Starts at `startId`, shows step text and a channel label ("Phone call", "Chat message", "Email", "Video call").
  - Choosing a choice shows its feedback, styled safe/unsafe; if `next` set, "Continue" goes to that step; if not, shows "Finish" which calls `onDone`.
  - "Start over" returns to `startId`.
- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run — PASS.**
- [ ] **Step 5: Commit** `feat: branching scenario practice`

---

### Task 7: Certificate

**Files:**
- Create: `src/pages/CertificatePage.tsx`; print styles in `styles.css`
- Test: `tests/pages/CertificatePage.test.tsx`

**Interfaces:**
- Consumes: `useProgress().status` (`allComplete`, `completedAt`).

- [ ] **Step 1: Write failing tests**
  - Not all complete → message listing remaining module titles, no certificate.
  - All complete → name input; "Print certificate" disabled while name empty or whitespace *(Review Focus 4)*; typing a name shows it on the certificate with "Threatwise Security Awareness", module count, and `completedAt` formatted as a date.
  - Name input `maxLength={80}`; certificate name element has class `cert-name` (CSS sets `overflow-wrap: anywhere`).
  - Print button calls `window.print` (mocked).
- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement.** `@media print` hides everything except the certificate.
- [ ] **Step 4: Run — PASS.**
- [ ] **Step 5: Commit** `feat: printable completion certificate`

---

### Task 8: Training content (7 modules + inbox)

**Files:**
- Create: `src/content/modules/m1-phishing.ts`, `m2-phone.ts`, `m3-deepfake.ts`, `m4-bribes.ts`, `m5-fake-jobs.ts`, `m6-mfa.ts`, `m7-reporting.ts`; fill `modules/index.ts` and `inbox.ts`
- Test: existing `tests/content/real-content.test.ts`, plus add: `MODULES.length === 7`, orders are 1..7, every `minutes` in 5..10.

**Interfaces:**
- Consumes: types from Task 1. Practice: m1 → inbox (10 emails, ~6 phishing / ~4 safe); m2 phone, m3 video, m4 chat, m5 email, m6 phone (MFA push + "IT" call), m7 chat → scenarios.

Stories (verify every fact against the cited sources with web search before writing; if a fact can't be verified, leave it out):
m1 Binance 2019 hot-wallet theft · m2 MGM Resorts 2023 help-desk call · m3 Arup 2024 deepfake video call (~US$25M) · m4 Coinbase 2025 bribed support contractors · m5 Ronin/Axie 2022 fake job offer · m6 Uber 2022 MFA fatigue · m7 builder chooses a well-documented case where quick reporting limited damage.

- [ ] **Step 1: Research and write m1–m4** with sources; each module has a `financeExample` and 3–5 quiz questions whose explanations teach, not just mark.
- [ ] **Step 2: Write the 10 inbox emails** at Northwind Office Co. covering: lookalike domain, fake invoice/payment change, fake IT password reset, shared-file lure, fake crypto wallet "verification", urgent CEO request, plus genuine HR/IT/colleague emails.
- [ ] **Step 3: Research and write m5–m7.**
- [ ] **Step 4: Run `npm test` — validator reports `[]`; all tests PASS.**
- [ ] **Step 5: Tone pass:** search content for "fired", "fault", "stupid", "blame" (except "no blame") and rewrite any hits.
- [ ] **Step 6: Commit** `feat: seven training modules and pretend inbox content`

---

### Task 9: Build, visual check and README

**Files:**
- Create: `README.md`, `scripts/screenshots.mjs`
- Modify: `vite.config.ts` (`base: './'` so it runs from any static host path)

- [ ] **Step 1: `npm run build` — expect success, `dist/` produced, no TS errors.**
- [ ] **Step 2: Write `scripts/screenshots.mjs`** (Playwright, preinstalled) serving `dist/` via `vite preview`, capturing Home, a story step, the inbox list, an opened email, a quiz, and the certificate at 360×800 and 1280×800 into `screenshots/` (gitignored).
- [ ] **Step 3: Review screenshots:** at 360px no horizontal scroll (`document.documentElement.scrollWidth <= 360` asserted in the script) and inbox flag buttons visible *(Review Focus 5)*; dark mode readable.
- [ ] **Step 4: README:** what it is, `npm install`, `npm run dev`, `npm test`, `npm run build`, how to add a module, how to deploy `dist/` to Netlify/GitHub Pages, v2 roadmap.
- [ ] **Step 5: Commit** `chore: build config, screenshot check and README`
