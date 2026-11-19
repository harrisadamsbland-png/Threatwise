import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { passed, renderApp } from '../render'

describe('Home', () => {
  it('lists modules in order with minutes and links', () => {
    renderApp()
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('First module')
    expect(items[0]).toHaveTextContent('5 min')
    expect(items[1]).toHaveTextContent('Second module')
    expect(within(items[0]).getByRole('link')).toHaveAttribute('href', '#/module/m-a')
  })

  it('shows progress and done badges', () => {
    renderApp({ events: [passed('m-a')] })
    expect(screen.getByText('1 of 2 complete')).toBeInTheDocument()
    expect(within(screen.getAllByRole('listitem')[0]).getByText('Done')).toBeInTheDocument()
    expect(within(screen.getAllByRole('listitem')[1]).queryByText('Done')).toBeNull()
  })

  it('starts at 0 of N and hides the certificate link', () => {
    renderApp()
    expect(screen.getByText('0 of 2 complete')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /certificate/i })).toBeNull()
  })

  it('shows the certificate link when everything is complete', () => {
    renderApp({ events: [passed('m-a'), passed('m-b')] })
    expect(screen.getByRole('link', { name: /certificate/i })).toHaveAttribute('href', '#/certificate')
  })

  it('uses encouraging copy', () => {
    renderApp()
    expect(document.body).toHaveTextContent(/best defence/i)
  })
})
