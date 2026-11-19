import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { passed, renderApp } from '../render'

describe('CertificatePage', () => {
  it('lists remaining modules when not all complete', () => {
    renderApp({ route: '#/certificate', events: [passed('m-a')] })
    expect(screen.getByText(/finish these modules first/i)).toBeInTheDocument()
    expect(screen.getByText('Second module')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  it('needs a non-blank name before printing', async () => {
    const u = userEvent.setup()
    renderApp({ route: '#/certificate', events: [passed('m-a'), passed('m-b', '2026-03-05T10:00:00.000Z')] })
    const print = screen.getByRole('button', { name: 'Print certificate' })
    expect(print).toBeDisabled()
    await u.type(screen.getByLabelText('Your name'), '   ')
    expect(print).toBeDisabled()
  })

  it('shows the name, title, module count and completion date, and prints', async () => {
    const u = userEvent.setup()
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})
    renderApp({ route: '#/certificate', events: [passed('m-a'), passed('m-b', '2026-03-05T10:00:00.000Z')] })
    const input = screen.getByLabelText('Your name')
    expect(input).toHaveAttribute('maxLength', '80')
    await u.type(input, 'Sam Rivera')
    expect(screen.getByText('Sam Rivera')).toHaveClass('cert-name')
    expect(document.body).toHaveTextContent('Threatwise Security Awareness')
    expect(document.body).toHaveTextContent('all 2 modules')
    expect(document.body).toHaveTextContent('5 March 2026')
    await u.click(screen.getByRole('button', { name: 'Print certificate' }))
    expect(printSpy).toHaveBeenCalled()
  })
})
