// Serves dist/ with `vite preview`, captures key screens at phone and desktop sizes,
// and fails if any page scrolls horizontally on a 360px phone.
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')

const PORT = 4179
const BASE = `http://localhost:${PORT}/`
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
mkdirSync('screenshots', { recursive: true })

const ALL_DONE = JSON.stringify(
  ['phishing-emails', 'phone-impersonation', 'deepfakes-boss-requests', 'bribes-insider-approaches', 'fake-jobs-files', 'passwords-mfa', 'data-and-reporting']
    .map((moduleId) => ({ moduleId, kind: 'quizScored', score: 1, timestamp: '2026-11-19T10:00:00.000Z' })),
)

const failures = []
try {
  for (let i = 0; i < 40; i++) { try { await fetch(BASE); break } catch { await sleep(250) } }
  const browser = await chromium.launch()
  for (const [label, viewport, scheme] of [['phone', { width: 360, height: 800 }, 'light'], ['desktop', { width: 1280, height: 800 }, 'light'], ['phone-dark', { width: 360, height: 800 }, 'dark']]) {
    const ctx = await browser.newContext({ viewport, colorScheme: scheme })
    const page = await ctx.newPage()
    const shot = async (name) => {
      await page.waitForTimeout(150)
      const sw = await page.evaluate(() => document.documentElement.scrollWidth)
      if (sw > viewport.width) failures.push(`${label}/${name}: scrollWidth ${sw} > ${viewport.width}`)
      await page.screenshot({ path: `screenshots/${label}-${name}.png`, fullPage: true })
    }
    await page.goto(BASE)
    await shot('home')
    await page.goto(`${BASE}#/module/phishing-emails`)
    await shot('story')
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await shot('inbox')
    await page.getByRole('button', { name: /Brightline Supplies Accounts/ }).click()
    await shot('email')
    const flag = page.getByRole('button', { name: 'Phishing', exact: true })
    if (!(await flag.isVisible())) failures.push(`${label}: Phishing button not visible`)
    await page.goto(`${BASE}#/module/phone-impersonation`)
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await shot('scenario')
    await page.getByRole('button', { name: /call the service desk back/ }).click()
    await page.getByRole('button', { name: 'Finish' }).click()
    await shot('quiz')
    await page.evaluate((v) => localStorage.setItem('threatwise.progress.v1', v), ALL_DONE)
    await page.goto(`${BASE}#/certificate`)
    await page.reload()
    await page.getByLabel('Your name').fill('Sam Rivera')
    await shot('certificate')
    await ctx.close()
  }
  await browser.close()
} finally {
  server.kill()
}
if (failures.length) { console.error('FAIL\n' + failures.join('\n')); process.exit(1) }
console.log('screenshots OK')
