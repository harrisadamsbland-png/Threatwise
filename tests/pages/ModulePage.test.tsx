import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../render'

const next = (u: ReturnType<typeof userEvent.setup>) => u.click(screen.getByRole('button', { name: 'Next' }))

describe('ModulePage', () => {
  it('records started and shows the story with stop moment and sources', () => {
    const { store } = renderApp({ route: '#/module/m-a' })
    expect(store.load().some((e) => e.moduleId === 'm-a' && e.kind === 'started')).toBe(true)
    expect(screen.getByRole('heading', { name: 'Something happened' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'The moment it could have been stopped' })).toBeInTheDocument()
    expect(screen.getByText('When the email arrived.')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: 'Source' })
    expect(link).toHaveAttribute('href', 'https://example.com/a')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('walks story → lesson → practice → quiz → what to do', async () => {
    const u = userEvent.setup()
    const { store } = renderApp({ route: '#/module/m-a' })
    await next(u)
    expect(screen.getByText('Lesson paragraph.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'In finance and crypto' })).toBeInTheDocument()
    expect(screen.getByText('A finance example.')).toBeInTheDocument()
    await next(u)
    expect(screen.getByText('Practice')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText('Lesson paragraph.')).toBeInTheDocument()
    await next(u)
    await completePractice(u)
    expect(store.load().some((e) => e.kind === 'practiceDone')).toBe(true)
    for (const g of screen.getAllByRole('radiogroup')) await u.click(g.querySelectorAll('input')[0])
    await u.click(screen.getByRole('button', { name: 'Check answers' }))
    expect(store.load().find((e) => e.kind === 'quizScored')?.score).toBe(1)
    await next(u)
    expect(screen.getByText('Check')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to all modules' })).toHaveAttribute('href', '#/')
  })

  it('shows not found for an unknown module', () => {
    renderApp({ route: '#/module/nope' })
    expect(screen.getByText('Module not found')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '#/')
  })
})

// Fixture module uses inbox practice with one phishing email.
async function completePractice(u: ReturnType<typeof userEvent.setup>) {
  const cont = screen.queryByRole('button', { name: 'Continue' })
  if (cont) return u.click(cont)
  await u.click(screen.getByRole('button', { name: /IT Support/ }))
  await u.click(screen.getByRole('button', { name: 'Phishing' }))
  await u.click(screen.getByRole('button', { name: 'Check my answers' }))
  await u.click(screen.getByRole('button', { name: 'Continue to quiz' }))
}
