# Threatwise — Employee Security Training — Design

*Working name — easy to change.* Date: 2026-11-18

## 1. Intent and why

Security awareness training a company hands to its staff so they don't become
the way in — the kind of human mistake behind "Binance-type" incidents (stolen
funds, bribed insiders, leaked customer data, impersonation). Employees don't
need to learn hacking; they need to recognise phishing and the direct risks
*they* pose to the company, and know what to do.

Audience: **any office job** (not one industry). Each module uses everyday
office examples (invoices, HR, IT help desk, shared files) and includes at
least one crypto/finance example, since that's where the inspiration came from.

Real stories are the core: a real incident teaches far better than a generic
rule. Each module opens with what really happened and "the moment someone could
have stopped it".

**Out of scope here:** the owner's personal advanced-learning app (deep
technical hack breakdowns, red teaming, AI/surveillance tracking). That is a
**separate project**, to be designed on its own later and heavily personalised.
Nothing in this app depends on it.

## 2. Approaches considered

1. **Simple static web app.** Fast, free to host, no logins; company can't see
   who completed training.
2. **Full training platform.** Accounts, admin dashboard, real phishing test
   emails. What companies pay for, but far bigger (auth, database, email
   delivery, legal care around test-phishing staff).
3. **Build #1 now, shaped to grow into #2.** ← **Chosen by the owner.** Usable
   soon; content and progress data are structured so logins and an admin
   dashboard can be added later without rewriting.

## 3. Goals (v1)

- 7 short training modules with a real story, lesson, practice, quiz and a
  "what to do" card.
- A "pretend inbox" for phishing practice, and "what do you do?" scenarios.
- A printable completion certificate.
- Progress saved in the browser, behind an interface a backend can replace.
- Works on phone and desktop.

## 4. Non-goals (v1)

- Logins, company accounts, admin dashboard, completion reports (planned for v2).
- Sending real phishing test emails to anyone.
- The owner's personal deep-dive learning app (separate project).
- Payments.

## 5. Anti-goals (failure even if it "works")

- Shaming or scaring employees. Tone is "you're the best defence", not "you'll
  be fired".
- Long, boring compliance-video energy. Each module takes ~5–10 minutes.
- Practice phishing emails that impersonate real brands. The pretend inbox uses
  a fictional company and fictional vendors, so the content can't be lifted and
  used as real phishing.
- Stating incident facts that aren't backed by public sources.

## 6. Content

### 6.1 Modules

| # | Module | Opening real story (builder's call) |
|---|--------|-------------------------------------|
| 1 | Spotting phishing emails (pretend inbox) | Binance hot-wallet theft, 2019 |
| 2 | Phone and help-desk impersonation | MGM Resorts, 2023 |
| 3 | Deepfakes and "urgent request from the boss" | Arup deepfake video call, 2024 (~$25M) |
| 4 | Bribes and insider recruitment approaches | Crypto exchange support staff bribed to leak customer data (e.g. Coinbase, 2025) |
| 5 | Fake job offers, files and downloads | Ronin bridge, 2022 (malware in a fake job offer) |
| 6 | Passwords, MFA, and "MFA fatigue" push spam | Uber, 2022 |
| 7 | Handling data and how to report — "report fast, no blame" | A case where fast reporting limited the damage |

Each module flow: **story → lesson → practice → quiz (3–5 questions) → "what to
do" card.** Finishing all 7 unlocks a printable certificate (employee types
their name; date added automatically).

### 6.2 Practice formats

- **Pretend inbox:** a fake email client with ~10 emails at a fictional company.
  The employee marks each "phishing" or "safe"; afterwards, red flags are
  highlighted on each email (lookalike sender, urgency, odd link, unexpected
  attachment) with a one-line explanation.
- **Scenarios:** short branching "what do you do?" steps for phone calls, chat
  messages, bribe offers and boss-impersonation requests, with feedback on each
  choice.

### 6.3 Sources

Every real story lists its public sources. A content check fails the build if
a story has none.

## 7. How it's built (builder's calls, stated for review)

- **Web app:** React + TypeScript + Vite. Static site, hostable free (Netlify /
  GitHub Pages / Cloudflare Pages).
- **Content as files in the repo:** Markdown for prose; JSON/TS for quizzes,
  inbox emails and scenarios. Stable IDs for every module and question.
- **Progress:** stored in `localStorage` behind a `ProgressStore` interface.
  Progress is recorded as events `{ moduleId, kind, score?, timestamp }`, the
  same shape a future backend would store per user, so v2 swaps the store
  implementation, not the app. If browser storage is unavailable the app still
  works; progress just isn't remembered.
- **Pages:** home (progress overview + module list), module player, pretend
  inbox, certificate.
- **Tests:** Vitest for scoring and progress logic, plus a content check (every
  quiz question has exactly one correct answer, every story has sources, every
  inbox email has its red flags defined).

## 8. Path to v2 (not built now)

Accounts, company workspaces, admin dashboard (assign modules, completion
rates), server-side progress, optional real phishing simulations with consent
and policy safeguards.

## 9. Left to the builder

Visual design and styling, exact lesson and quiz wording, component structure,
folder layout, hosting provider, the module 7 story.
