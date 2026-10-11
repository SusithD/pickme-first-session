import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Location from '../../src/screens/Location'
import Verify from '../../src/screens/Verify'
import Welcome from '../../src/screens/Welcome'
import { I18nProvider } from '../../src/i18n/I18nContext'
import { RideProvider, useRide } from '../../src/state/RideContext'
import type { RideState } from '../../src/state/rideMachine'

function Probe() {
  const { state } = useRide()
  return (
    <>
      <p data-testid="signed-in">{String(state.signedIn)}</p>
      <p data-testid="location">{state.permissions.location}</p>
    </>
  )
}

function renderWith(ui: ReactNode, overrides: Partial<RideState> = {}, path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <RideProvider initialState={overrides}>
        <I18nProvider>
          {ui}
          <Probe />
        </I18nProvider>
      </RideProvider>
    </MemoryRouter>,
  )
}

const treatment: Partial<RideState> = { variant: 'treatment' }
const control: Partial<RideState> = { variant: 'control' }

afterEach(() => {
  vi.useRealTimers()
})

describe('Welcome (A1)', () => {
  it('treatment shows language buttons and a Where are you going link, with no account wall', () => {
    renderWith(<Welcome />, treatment)
    expect(screen.getByRole('heading', { level: 1, name: 'Welcome' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'English' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'සිංහල' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'தமிழ்' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Where are you going?' })).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('control leads with the account wall and a phone field', () => {
    renderWith(<Welcome />, control)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Create an account to continue' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Mobile number' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Where are you going?' })).not.toBeInTheDocument()
  })

  it('control rejects a short phone with an announced error', async () => {
    const user = userEvent.setup()
    renderWith(<Welcome />, control)
    await user.type(screen.getByRole('textbox', { name: 'Mobile number' }), '7712')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    const input = screen.getByRole('textbox', { name: 'Mobile number' })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription(expect.stringContaining('Enter 9 digits after +94.'))
    expect(screen.getByRole('alert')).toHaveTextContent('Enter 9 digits after +94.')
  })

  it('control moves to the verify route with the phone carried in router state', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/welcome']}>
        <RideProvider initialState={control}>
          <I18nProvider>
            <Routes>
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/verify" element={<Verify />} />
            </Routes>
          </I18nProvider>
        </RideProvider>
      </MemoryRouter>,
    )
    await user.type(screen.getByRole('textbox', { name: 'Mobile number' }), '77 123 4567')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(
      screen.getByRole('heading', { level: 1, name: 'Confirm your number' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Mobile number' })).toHaveValue('771234567')
  })
})

describe('Verify (A3)', () => {
  it('rejects a phone number that is not 9 digits and accepts a valid one', async () => {
    const user = userEvent.setup()
    renderWith(<Verify />, treatment)
    const phone = screen.getByRole('textbox', { name: 'Mobile number' })
    await user.type(phone, '77 12')
    await user.click(screen.getByRole('button', { name: 'Send code' }))
    expect(phone).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Enter 9 digits after +94.')

    await user.clear(phone)
    await user.type(phone, '77 123 4567')
    await user.click(screen.getByRole('button', { name: 'Send code' }))
    const code = screen.getByRole('textbox', { name: '6-digit code' })
    expect(code).toHaveAttribute('inputmode', 'numeric')
    expect(code).toHaveAttribute('autocomplete', 'one-time-code')
    expect(screen.getByText('Demo code: 123456')).toBeInTheDocument()
  })

  it('accepts a pasted code and shows an error for a wrong one', async () => {
    const user = userEvent.setup()
    renderWith(<Verify />, treatment)
    await user.type(screen.getByRole('textbox', { name: 'Mobile number' }), '771234567')
    await user.click(screen.getByRole('button', { name: 'Send code' }))
    const code = screen.getByRole('textbox', { name: '6-digit code' })

    await user.click(code)
    await user.paste('999999')
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(code).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('That code doesn’t match.')
    expect(screen.queryByText('Number confirmed.')).not.toBeInTheDocument()

    await user.clear(code)
    await user.click(code)
    await user.paste('12 34 56')
    expect(code).toHaveValue('123456')
  })

  it('treatment confirms with the fare kept and signs in on Continue', async () => {
    const user = userEvent.setup()
    renderWith(<Verify />, treatment)
    await user.type(screen.getByRole('textbox', { name: 'Mobile number' }), '771234567')
    await user.click(screen.getByRole('button', { name: 'Send code' }))
    await user.type(screen.getByRole('textbox', { name: '6-digit code' }), '123456')
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(screen.getByText('Number confirmed.')).toBeInTheDocument()
    expect(screen.getByText('Still LKR 540')).toBeInTheDocument()
    expect(screen.getByTestId('signed-in')).toHaveTextContent('false')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByTestId('signed-in')).toHaveTextContent('true')
  })

  it('control confirms without the fare line', async () => {
    const user = userEvent.setup()
    renderWith(<Verify />, control)
    await user.type(screen.getByRole('textbox', { name: 'Mobile number' }), '771234567')
    await user.click(screen.getByRole('button', { name: 'Send code' }))
    await user.type(screen.getByRole('textbox', { name: '6-digit code' }), '123456')
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(screen.getByText('Number confirmed.')).toBeInTheDocument()
    expect(screen.queryByText(/Still LKR/)).not.toBeInTheDocument()
  })

  it('counts down before offering resend and returns to the phone step on Wrong number', async () => {
    vi.useFakeTimers()
    renderWith(<Verify />, treatment)
    fireEvent.change(screen.getByRole('textbox', { name: 'Mobile number' }), {
      target: { value: '771234567' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send code' }))
    expect(screen.getByText('Didn’t get it? Resend in 30 s')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(30_000)
    })
    expect(screen.getByRole('button', { name: 'Resend code' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Resend code' }))
    expect(screen.getByText('Didn’t get it? Resend in 30 s')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Wrong number' }))
    expect(screen.getByRole('textbox', { name: 'Mobile number' })).toHaveValue('771234567')
  })
})

describe('Location (A2)', () => {
  it('treatment allow dispatches the location permission', async () => {
    const user = userEvent.setup()
    renderWith(<Location />, treatment, '/location')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Allow location so your driver finds you',
    )
    expect(screen.getByTestId('location')).toHaveTextContent('unset')
    await user.click(screen.getByRole('link', { name: 'Allow while using' }))
    expect(screen.getByTestId('location')).toHaveTextContent('allowed')
  })

  it('treatment type-instead dispatches typed', async () => {
    const user = userEvent.setup()
    renderWith(<Location />, treatment, '/location')
    await user.click(screen.getByRole('link', { name: 'Type pickup instead' }))
    expect(screen.getByTestId('location')).toHaveTextContent('typed')
  })

  it('control uses the generic copy', () => {
    renderWith(<Location />, control, '/location')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Allow location access' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Allow' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Not now' })).toBeInTheDocument()
  })
})
