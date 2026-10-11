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

describe('App shell', () => {
  beforeEach(() => {
    window.location.hash = '#/'
  })

  it('shows the banner, variant chip and one h1 per screen', () => {
    renderApp()
    expect(screen.getByText('Unofficial concept. Not affiliated with PickMe.')).toBeInTheDocument()
    expect(screen.getByLabelText('Current variant: Treatment')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('walks the treatment flow with Next and moves focus to the h1', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('link', { name: 'Next' }))
    const heading = await screen.findByRole('heading', { level: 1, name: 'Welcome' })
    expect(window.location.hash).toBe('#/welcome')
    expect(heading).toHaveFocus()
  })
})
