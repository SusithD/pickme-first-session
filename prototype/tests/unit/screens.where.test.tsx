import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { HashRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Ride from '../../src/screens/Ride'
import Where from '../../src/screens/Where'
import { I18nProvider } from '../../src/i18n/I18nContext'
import { PLACES } from '../../src/state/mock'
import { RideProvider, useRide } from '../../src/state/RideContext'
import type { RideState, Variant } from '../../src/state/rideMachine'

function renderScreen(ui: ReactElement, initialState: Partial<RideState>) {
  const latest: { current?: RideState } = {}
  function Probe() {
    latest.current = useRide().state
    return null
  }
  render(
    <HashRouter>
      <RideProvider initialState={initialState}>
        <I18nProvider>
          {ui}
          <Probe />
        </I18nProvider>
      </RideProvider>
    </HashRouter>,
  )
  return latest
}

function whereState(overrides: Partial<RideState> = {}): Partial<RideState> {
  return { step: 'where', variant: 'treatment', peak: true, ...overrides }
}

function rideState(variant: Variant, overrides: Partial<RideState> = {}): Partial<RideState> {
  return { step: 'ride', variant, peak: true, ...overrides }
}

describe('Where screen', () => {
  it('lists all mock places and filters them as the rider types', async () => {
    const user = userEvent.setup()
    renderScreen(<Where />, whereState())
    expect(screen.getByRole('heading', { level: 1, name: 'Where to?' })).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', {
        name: /Fort Railway|Wellawatte|Nugegoda|Borella|Mount Lavinia/,
      }),
    ).toHaveLength(PLACES.length)

    await user.type(screen.getByRole('searchbox', { name: 'Where to?' }), 'nug')
    const list = screen.getByRole('list', { name: 'Places' })
    expect(within(list).getAllByRole('button')).toHaveLength(1)
    expect(within(list).getByRole('button', { name: 'Nugegoda' })).toBeInTheDocument()
  })

  it('shows the empty state when nothing matches', async () => {
    const user = userEvent.setup()
    renderScreen(<Where />, whereState())
    await user.type(screen.getByRole('searchbox', { name: 'Where to?' }), 'zzz')
    expect(screen.getByText('No places match')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Places' })).not.toBeInTheDocument()
  })

  it('selects the first match on Enter and moves to the ride step', async () => {
    const user = userEvent.setup()
    const latest = renderScreen(<Where />, whereState())
    await user.type(screen.getByRole('searchbox', { name: 'Where to?' }), 'mount{Enter}')
    expect(latest.current?.destination?.id).toBe('mount-lavinia')
    expect(latest.current?.step).toBe('ride')
  })

  it('selects a place on click', async () => {
    const user = userEvent.setup()
    const latest = renderScreen(<Where />, whereState())
    await user.click(screen.getByRole('button', { name: 'Borella' }))
    expect(latest.current?.destination?.id).toBe('borella')
  })

  it('offers the location primer in treatment only while permission is unset', () => {
    const { unmount } = render(
      <HashRouter>
        <RideProvider initialState={whereState()}>
          <I18nProvider>
            <Where />
          </I18nProvider>
        </RideProvider>
      </HashRouter>,
    )
    expect(
      screen.getByRole('link', { name: 'Allow location for a closer pickup' }),
    ).toHaveAttribute('href', '#/location')
    unmount()
  })

  it('hides the location primer link in control', () => {
    renderScreen(<Where />, whereState({ variant: 'control' }))
    expect(
      screen.queryByRole('link', { name: 'Allow location for a closer pickup' }),
    ).not.toBeInTheDocument()
  })
})

describe('Ride screen', () => {
  it('moves the ride type with arrow keys and wraps around', async () => {
    const user = userEvent.setup()
    const latest = renderScreen(<Ride />, rideState('treatment'))
    const group = screen.getByRole('radiogroup', { name: 'Ride type' })
    const tuk = within(group).getByRole('radio', { name: /^Tuk/ })
    tuk.focus()

    await user.keyboard('{ArrowRight}')
    expect(latest.current?.rideType).toBe('smallCar')
    expect(within(group).getByRole('radio', { name: /^Small car/ })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(within(group).getByRole('radio', { name: /^Small car/ })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    await user.keyboard('{ArrowRight}')
    expect(latest.current?.rideType).toBe('tuk')
  })

  it('moves the payment choice with arrow keys and defaults to cash', async () => {
    const user = userEvent.setup()
    const latest = renderScreen(<Ride />, rideState('treatment'))
    const group = screen.getByRole('radiogroup', { name: 'Payment' })
    expect(within(group).getByRole('radio', { name: 'Cash' })).toHaveAttribute(
      'aria-checked',
      'true',
    )

    within(group).getByRole('radio', { name: 'Cash' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(latest.current?.payment).toBe('card')
    expect(screen.getByText('Your driver sees the method you chose.')).toBeInTheDocument()
  })

  it('shows the fixed fare, peak line and breakdown link in treatment', () => {
    renderScreen(<Ride />, rideState('treatment'))
    expect(screen.getByText('Fixed fare')).toBeInTheDocument()
    expect(screen.getByText('Includes peak +15% now')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'What can change this?' })).toHaveAttribute(
      'href',
      '#/fare',
    )
    expect(screen.queryByText(/Estimated/)).not.toBeInTheDocument()
  })

  it('hides the peak line in treatment when peak pricing is off', () => {
    renderScreen(<Ride />, rideState('treatment', { peak: false }))
    expect(screen.queryByText('Includes peak +15% now')).not.toBeInTheDocument()
    expect(screen.getByText('LKR 564')).toBeInTheDocument()
  })

  it('shows the same fare labelled as an estimate with no breakdown and no link in control', () => {
    renderScreen(<Ride />, rideState('control'))
    expect(screen.getByRole('radio', { name: /^Tuk.*Estimated LKR 649$/ })).toBeInTheDocument()
    expect(screen.queryByText('Fixed fare')).not.toBeInTheDocument()
    expect(screen.queryByText('Includes peak +15% now')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'What can change this?' })).not.toBeInTheDocument()
  })

  it('labels the CTA with the selected ride and its booked fare', async () => {
    const user = userEvent.setup()
    const latest = renderScreen(<Ride />, rideState('treatment'))
    expect(screen.getByRole('button', { name: 'Book Tuk · LKR 649' })).toBeInTheDocument()

    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Ride type' })).getByRole('radio', {
        name: /^Car/,
      }),
    )
    expect(screen.getByRole('button', { name: 'Book Car · LKR 1,231' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Book Car · LKR 1,231' }))
    expect(latest.current?.booked).toBe(true)
    expect(latest.current?.rideType).toBe('car')
  })

  it('labels the control CTA as an estimate', () => {
    renderScreen(<Ride />, rideState('control'))
    expect(screen.getByRole('button', { name: 'Book Tuk · est. LKR 649' })).toBeInTheDocument()
  })
})
