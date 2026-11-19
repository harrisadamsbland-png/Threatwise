import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ScenarioPlayer from '../../src/components/ScenarioPlayer'
import { makeScenario } from '../fixtures'

describe('ScenarioPlayer', () => {
  it('starts at startId with a channel label', () => {
    render(<ScenarioPlayer scenario={makeScenario()} onDone={vi.fn()} />)
    expect(screen.getByText('Phone call')).toBeInTheDocument()
    expect(screen.getByText(/need your code/)).toBeInTheDocument()
  })

  it.each([['chat', 'Chat message'], ['email', 'Email'], ['video', 'Video call']] as const)('labels %s', (channel, label) => {
    render(<ScenarioPlayer scenario={makeScenario({ channel })} onDone={vi.fn()} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('shows feedback and follows next to the following step', async () => {
    const u = userEvent.setup()
    render(<ScenarioPlayer scenario={makeScenario()} onDone={vi.fn()} />)
    await u.click(screen.getByRole('button', { name: 'Read out the code' }))
    expect(screen.getByText('Never share codes.')).toHaveClass('bad')
    await u.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText(/ask for your password/)).toBeInTheDocument()
  })

  it('finishes on a choice without next', async () => {
    const u = userEvent.setup()
    const onDone = vi.fn()
    render(<ScenarioPlayer scenario={makeScenario()} onDone={onDone} />)
    await u.click(screen.getByRole('button', { name: 'Hang up and call IT back' }))
    expect(screen.getByText('Exactly right.')).toHaveClass('good')
    await u.click(screen.getByRole('button', { name: 'Finish' }))
    expect(onDone).toHaveBeenCalled()
  })

  it('start over returns to the first step', async () => {
    const u = userEvent.setup()
    render(<ScenarioPlayer scenario={makeScenario()} onDone={vi.fn()} />)
    await u.click(screen.getByRole('button', { name: 'Read out the code' }))
    await u.click(screen.getByRole('button', { name: 'Continue' }))
    await u.click(screen.getByRole('button', { name: 'Start over' }))
    expect(screen.getByText(/need your code/)).toBeInTheDocument()
  })
})

describe('ScenarioPlayer focus', () => {
  it('moves focus to the feedback after choosing, and to the step text after Continue', async () => {
    const u = userEvent.setup()
    render(<ScenarioPlayer scenario={makeScenario()} onDone={vi.fn()} />)
    await u.click(screen.getByRole('button', { name: 'Read out the code' }))
    expect(document.activeElement).toBe(screen.getByText('Never share codes.'))
    await u.click(screen.getByRole('button', { name: 'Continue' }))
    expect(document.activeElement).toBe(screen.getByText(/ask for your password/))
  })
})
