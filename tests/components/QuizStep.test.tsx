import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import QuizStep from '../../src/components/QuizStep'
import { makeModule } from '../fixtures'

const questions = makeModule().quiz // 3 questions, correct option "Right"

describe('QuizStep', () => {
  it('disables submit until every question is answered', async () => {
    const u = userEvent.setup()
    render(<QuizStep questions={questions} onSubmit={vi.fn()} onPass={vi.fn()} />)
    const submit = screen.getByRole('button', { name: 'Check answers' })
    expect(submit).toBeDisabled()
    const groups = screen.getAllByRole('radiogroup')
    for (const g of groups.slice(0, 2)) await u.click(g.querySelectorAll('input')[0])
    expect(submit).toBeDisabled()
    await u.click(groups[2].querySelectorAll('input')[0])
    expect(submit).toBeEnabled()
  })

  it('reports the score, shows explanations and lets you continue when passing', async () => {
    const u = userEvent.setup()
    const onSubmit = vi.fn()
    const onPass = vi.fn()
    render(<QuizStep questions={questions} onSubmit={onSubmit} onPass={onPass} />)
    for (const g of screen.getAllByRole('radiogroup')) await u.click(g.querySelectorAll('input')[0])
    await u.click(screen.getByRole('button', { name: 'Check answers' }))
    expect(onSubmit).toHaveBeenCalledWith(1)
    expect(screen.getByText('Because 0.')).toBeInTheDocument()
    expect(screen.getByText(/3 of 3 correct/)).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Next' }))
    expect(onPass).toHaveBeenCalled()
  })

  it('offers a retry below the pass mark and resets answers', async () => {
    const u = userEvent.setup()
    const onSubmit = vi.fn()
    render(<QuizStep questions={questions} onSubmit={onSubmit} onPass={vi.fn()} />)
    const groups = screen.getAllByRole('radiogroup')
    await u.click(groups[0].querySelectorAll('input')[0])
    await u.click(groups[1].querySelectorAll('input')[1])
    await u.click(groups[2].querySelectorAll('input')[1])
    await u.click(screen.getByRole('button', { name: 'Check answers' }))
    expect(onSubmit).toHaveBeenCalledWith(1 / 3)
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull()
    await u.click(screen.getByRole('button', { name: 'Try again' }))
    expect(screen.getByRole('button', { name: 'Check answers' })).toBeDisabled()
    expect(screen.queryByText('Because 0.')).toBeNull()
  })
})

describe('QuizStep focus', () => {
  it('moves focus to the result after checking, and to the first question after retry', async () => {
    const u = userEvent.setup()
    render(<QuizStep questions={questions} onSubmit={vi.fn()} onPass={vi.fn()} />)
    for (const g of screen.getAllByRole('radiogroup')) await u.click(g.querySelectorAll('input')[1])
    await u.click(screen.getByRole('button', { name: 'Check answers' }))
    expect(document.activeElement).toBe(screen.getByText(/0 of 3 correct/))
    await u.click(screen.getByRole('button', { name: 'Try again' }))
    expect(document.activeElement).toBe(screen.getAllByRole('radiogroup')[0].querySelector('input'))
  })
})
