import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HashRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { I18nProvider } from '../../src/i18n/I18nContext'
import { FocusReturnProvider } from '../../src/state/FocusReturn'
import { RideProvider } from '../../src/state/RideContext'
import type { RideState } from '../../src/state/rideMachine'

function renderApp(initialState?: Partial<RideState>) {
  return render(
    <HashRouter>
      <RideProvider initialState={initialState}>
        <I18nProvider>
          <FocusReturnProvider>
            <App />
          </FocusReturnProvider>
        </I18nProvider>
      </RideProvider>
    </HashRouter>,
  )
}

async function expectScreen(name: string | RegExp, variantLabel: string) {
  const heading = await screen.findByRole('heading', { level: 1, name })
  await waitFor(() => expect(heading).toHaveFocus())
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  expect(screen.getByText('Unofficial concept. Not affiliated with PickMe.')).toBeVisible()
  expect(screen.getByLabelText(`Current variant: ${variantLabel}`)).toBeVisible()
}

async function verifyPhone(user: ReturnType<typeof userEvent.setup>, phone?: string) {
  if (phone) await user.type(screen.getByRole('textbox', { name: 'Mobile number' }), phone)
  await user.click(screen.getByRole('button', { name: 'Send code' }))
  await user.type(screen.getByRole('textbox', { name: '6-digit code' }), '123456')
  await user.click(screen.getByRole('button', { name: 'Confirm' }))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
}

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '#/'
  })

  it('shows the banner, variant chip and one h1 on first load', () => {
    renderApp()
    expect(screen.getByText('Unofficial concept. Not affiliated with PickMe.')).toBeInTheDocument()
    expect(screen.getByLabelText('Current variant: Treatment')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('walks the whole treatment flow through the real UI', async () => {
    const user = userEvent.setup()
    renderApp()
    const t = 'Treatment'

    await user.click(screen.getByRole('link', { name: 'Start the ride' }))
    await expectScreen('Welcome', t)

    await user.click(screen.getByRole('link', { name: 'Where are you going?' }))
    await expectScreen('Allow location so your driver finds you', t)

    await user.click(screen.getByRole('link', { name: 'Type pickup instead' }))
    await expectScreen('Where to?', t)

    await user.type(screen.getByLabelText(/Pickup note for your driver/), 'Blue gate')
    await user.click(screen.getByRole('button', { name: 'Fort Railway Station' }))
    await expectScreen('Choose your ride', t)
    expect(screen.getByRole('button', { name: 'Book Tuk · LKR 649' })).toBeInTheDocument()

    const trigger = screen.getByRole('link', { name: 'What can change this?' })
    await user.click(trigger)
    const sheet = await screen.findByRole('dialog')
    expect(within(sheet).getByRole('heading', { level: 1 })).toHaveTextContent(
      'How this fare is made',
    )
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    await user.click(within(sheet).getByRole('button', { name: 'Got it' }))
    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'What can change this?' })).toHaveFocus(),
    )

    await user.click(screen.getByRole('button', { name: 'Book Tuk · LKR 649' }))
    await expectScreen('Confirm your number', t)
    await verifyPhone(user, '077 123 4567')
    await expectScreen('Finding your driver', t)

    await user.click(screen.getByRole('button', { name: 'Skip wait' }))
    expect(await screen.findByText('Your note: Blue gate')).toBeInTheDocument()
    expect(screen.getByText(/Sample plate WP ABC-1234/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Share trip link' }))
    expect(screen.getAllByText('Trip link copied (demo)').length).toBeGreaterThan(0)
    await user.click(screen.getByRole('link', { name: 'Continue' }))
    await expectScreen('On the way', t)

    await user.click(screen.getByRole('button', { name: 'Safety' }))
    const safety = await screen.findByRole('dialog')
    expect(
      within(safety).getByRole('link', { name: 'Call 119 (Police emergency)' }),
    ).toHaveAttribute('href', 'tel:119')
    await user.click(within(safety).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Safety' })).toHaveFocus())

    await user.click(screen.getByRole('link', { name: 'Arrive at destination' }))
    await expectScreen('Have you arrived at Fort Railway Station?', t)
    await user.click(screen.getByRole('button', { name: 'Yes, end my trip' }))
    await expectScreen('Your fare', t)
    expect(screen.getByText('LKR 649, as booked')).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: /4 of 5/ }))
    expect(screen.getByRole('radio', { name: /4 of 5/ })).toBeChecked()

    await user.click(screen.getByRole('link', { name: 'Something’s not right' }))
    await expectScreen('Get help', t)
    await user.click(
      screen.getByRole('radio', { name: 'Driver asked me to cancel and pay outside the app' }),
    )
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(await screen.findByText(/Ticket #TKT-4821 opened/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back to start' }))
    await expectScreen('A first ride you can trust', t)
  })

  it('walks the control flow through the real UI', async () => {
    const user = userEvent.setup()
    renderApp({ variant: 'control' })
    const c = 'Control'

    await user.click(screen.getByRole('link', { name: 'Start the ride' }))
    await expectScreen('Create an account to continue', c)

    await user.type(screen.getByRole('textbox', { name: 'Mobile number' }), '+94 77 123 4567')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await expectScreen('Confirm your number', c)
    expect(screen.getByRole('textbox', { name: 'Mobile number' })).toHaveValue('771234567')
    await verifyPhone(user)
    await expectScreen('Allow location access', c)

    await user.click(screen.getByRole('link', { name: 'Not now' }))
    await expectScreen('Where to?', c)
    await user.click(screen.getByRole('button', { name: 'Fort Railway Station' }))
    await expectScreen('Choose your ride', c)
    expect(screen.queryByRole('link', { name: 'What can change this?' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Book Tuk · est. LKR 649' }))
    await expectScreen('Finding your driver', c)
    await user.click(screen.getByRole('button', { name: 'Skip wait' }))
    await user.click(await screen.findByRole('link', { name: 'Continue' }))
    await expectScreen('On the way', c)

    await user.click(screen.getByRole('link', { name: 'Arrive at destination' }))
    await expectScreen('You’ve arrived', c)
    await user.click(screen.getByRole('button', { name: 'Driver ends trip (demo)' }))
    await expectScreen('Your fare', c)

    await user.click(screen.getByRole('link', { name: 'Something’s not right' }))
    await expectScreen('Get help', c)
  })
})
