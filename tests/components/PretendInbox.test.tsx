import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import PretendInbox from '../../src/components/PretendInbox'
import { makeEmail } from '../fixtures'

const emails = [
  makeEmail({ attachment: 'reset-instructions.html' }),
  makeEmail({
    id: 'e2', fromName: 'Priya in HR', fromAddress: 'priya@northwind-office.example', subject: 'Team lunch Friday',
    body: ['Menu is at https://intranet.northwind-office.example/lunch'], isPhishing: false, redFlags: [],
    whySafe: 'Expected, internal, asks for nothing.',
  }),
]

describe('PretendInbox', () => {
  it('lists senders and subjects and opens an email', async () => {
    const u = userEvent.setup()
    render(<PretendInbox emails={emails} onDone={vi.fn()} />)
    expect(screen.getByText('Team lunch Friday')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /IT Support/ }))
    expect(screen.getByText('it@northwind-0ffice.example')).toBeInTheDocument()
    expect(screen.getByText(/reset-instructions\.html/)).toBeInTheDocument()
  })

  it('renders links as non-clickable text', async () => {
    const u = userEvent.setup()
    const { container } = render(<PretendInbox emails={emails} onDone={vi.fn()} />)
    await u.click(screen.getByRole('button', { name: /Priya in HR/ }))
    expect(screen.getByText('https://intranet.northwind-office.example/lunch')).toHaveClass('fake-link')
    expect(container.querySelector('a[href]')).toBeNull()
  })

  it('records verdicts in the list and checks answers only when all are judged', async () => {
    const u = userEvent.setup()
    const onDone = vi.fn()
    render(<PretendInbox emails={emails} onDone={onDone} />)
    const check = screen.getByRole('button', { name: 'Check my answers' })
    expect(check).toBeDisabled()
    await u.click(screen.getByRole('button', { name: /IT Support/ }))
    await u.click(screen.getByRole('button', { name: 'Phishing' }))
    expect(within(screen.getByRole('button', { name: /IT Support/ })).getByText('Phishing')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /Priya in HR/ }))
    await u.click(screen.getByRole('button', { name: 'Phishing' }))
    await u.click(check)
    expect(screen.getByText('1 of 2 right')).toBeInTheDocument()
    expect(screen.getByText('Lookalike domain')).toBeInTheDocument()
    expect(screen.getByText('Zero instead of O.')).toBeInTheDocument()
    expect(screen.getByText('Expected, internal, asks for nothing.')).toBeInTheDocument()
    expect(screen.getByText(/You said phishing — it was safe/)).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Continue to quiz' }))
    expect(onDone).toHaveBeenCalledWith({ correct: 1, total: 2, missed: ['e2'] })
  })
})

describe('PretendInbox focus', () => {
  it('focuses the email heading on open, the list item on back, and the score on check', async () => {
    const u = userEvent.setup()
    render(<PretendInbox emails={emails} onDone={vi.fn()} />)
    await u.click(screen.getByRole('button', { name: /IT Support/ }))
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Password expires today' }))
    await u.click(screen.getByRole('button', { name: /Back to inbox/ }))
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /IT Support/ }))
    await u.click(screen.getByRole('button', { name: /IT Support/ }))
    await u.click(screen.getByRole('button', { name: 'Phishing' }))
    await u.click(screen.getByRole('button', { name: /Priya in HR/ }))
    await u.click(screen.getByRole('button', { name: 'Looks safe' }))
    await u.click(screen.getByRole('button', { name: 'Check my answers' }))
    expect(document.activeElement).toBe(screen.getByText('2 of 2 right'))
  })
})
