# Threatwise: Employee Security Training

Short, story-led security awareness training for office staff. There are seven 5–10 minute modules, each built around a real incident (Binance, MGM, Arup, Coinbase, Ronin, Uber, Reddit). Employees practise in a pretend inbox and in "what do you do?" scenarios, take a quick quiz, and get a printable certificate at the end.

- No logins, no server, no tracking. Progress is saved in the employee's browser.
- Practice emails use a made-up company (Northwind Office Co.) and `.example` domains, and links in them can't be clicked.
- Every real story cites public sources. The test suite fails if a story has none.

## Run it

```bash
npm install
npm run dev        # local dev server
npm test           # unit + content tests
npm run build      # production build into dist/
npm run screenshots  # phone/desktop/dark screenshots + no-horizontal-scroll check (needs Playwright)
```

## Deploy

`npm run build`, then upload `dist/` to any static host: Netlify (drag and drop), Cloudflare Pages, or GitHub Pages. It uses hash routing and relative paths, so it works from any folder.

## Add or edit content

- Modules: `src/content/modules/mN-*.ts`, registered in `src/content/modules/index.ts`
- Practice inbox emails: `src/content/inbox.ts`
- Types: `src/content/types.ts`

`npm test` runs `validateContent`, which checks that every quiz has 3–5 questions with a valid answer, every story has https sources, every phishing email has red flags, every safe email explains why, scenarios have no broken links, and senders use fictional `.example` domains.

A module counts as complete when its quiz score is 70% or higher. Retakes keep the best score.

## Roadmap (v2)

Company accounts, an admin dashboard (assign modules, completion rates), server-side progress, and optional real phishing simulations with consent safeguards. Progress is already stored as events (`src/progress/store.ts`) behind a `ProgressStore` interface, so a backend can replace `localStorage` without changing the UI.
