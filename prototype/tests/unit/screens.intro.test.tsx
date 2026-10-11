import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HashRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { I18nProvider } from '../../src/i18n/I18nContext'
import { RideProvider } from '../../src/state/RideContext'

function renderApp() {
  return render(
    <HashRouter>
      <RideProvider>
        <I18nProvider>
          <App />
        </I18nProvider>
      </RideProvider>
    </HashRouter>,
  )
}

const QUOTES = [
  'Charges you way higher than the estimated',
  'only the driver can end journey even though you reached your destination',
  'ask you to pay with cash even though it’s set up for card',
  'without feedback',
]

describe('Intro screen', () => {
  beforeEach(() => {
    window.location.hash = '#/'
  })

  it('renders the title, language choice and both entry points', () => {
    renderApp()
    expect(
      screen.getByRole('heading', { level: 1, name: 'A first ride you can trust' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Unofficial concept by Susith Alwis/)).toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: 'Language' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start the ride' })).toHaveAttribute(
      'href',
      '#/welcome',
    )
    expect(screen.getByRole('link', { name: 'See the problem first' })).toHaveAttribute(
      'href',
      '#/problem',
    )
  })

  it('navigates to the problem storyboard from "See the problem first"', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('link', { name: 'See the problem first' }))
    const heading = await screen.findByRole('heading', {
      level: 1,
      name: /What new riders say goes wrong/,
    })
    expect(window.location.hash).toBe('#/problem')
    expect(heading).toHaveFocus()
  })
})

describe('Problem screen', () => {
  beforeEach(() => {
    window.location.hash = '#/problem'
  })

  it('shows the four verified review quotes exactly as written', () => {
    renderApp()
    for (const quote of QUOTES) {
      expect(screen.getByText(quote)).toBeInTheDocument()
    }
    expect(
      screen.getByText('These are reviews, not a reconstruction of the app’s screens.'),
    ).toBeInTheDocument()
  })

  it('"Design for this" starts the flow at Welcome', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('link', { name: 'Design for this' }))
    await screen.findByRole('heading', { level: 1, name: 'Welcome' })
    expect(window.location.hash).toBe('#/welcome')
  })
})
