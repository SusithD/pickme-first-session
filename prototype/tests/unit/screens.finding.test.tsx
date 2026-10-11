import { act, fireEvent, render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Arrived from '../../src/screens/Arrived'
import Finding from '../../src/screens/Finding'
import { I18nProvider } from '../../src/i18n/I18nContext'
import { useRide, RideProvider } from '../../src/state/RideContext'
import {
  ARRIVAL_TIMEOUT_SECONDS,
  DRIVER_CANCEL_DELAY_MS,
  MATCH_DELAY_MS,
  mockDriver,
} from '../../src/state/mock'
import type { RideState } from '../../src/state/rideMachine'

function Probe() {
  const { state } = useRide()
  const snapshot = {
    step: state.step,
    finding: state.finding,
    rideType: state.rideType,
    endedBy: state.endedBy,
  }
  return (
    <div data-testid="probe" hidden>
      {JSON.stringify(snapshot)}
    </div>
  )
}

function readProbe(): { step: string; finding: string; rideType: string; endedBy?: string } {
  return JSON.parse(screen.getByTestId('probe').textContent ?? '{}')
}

function renderScreen(ui: ReactElement, initial: Partial<RideState>) {
  return render(
    <MemoryRouter>
      <RideProvider initialState={initial}>
        <I18nProvider>
          {ui}
          <Probe />
        </I18nProvider>
      </RideProvider>
    </MemoryRouter>,
  )
}

function advance(ms: number) {
  const step = 100
  for (let elapsed = 0; elapsed < ms; elapsed += step) {
    act(() => {
      vi.advanceTimersByTime(Math.min(step, ms - elapsed))
    })
  }
}

describe('Finding screen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('matches the driver after the mock delay, not before', () => {
    renderScreen(<Finding />, { step: 'finding', finding: 'searching' })
    expect(
      screen.getByRole('heading', { level: 1, name: 'Finding your driver' }),
    ).toBeInTheDocument()
    advance(MATCH_DELAY_MS - 1)
    expect(readProbe().finding).toBe('searching')
    advance(1)
    expect(readProbe().finding).toBe('matched')
    expect(screen.getByRole('heading', { level: 2, name: 'Driver found' })).toBeInTheDocument()
    expect(screen.getByText('Nimal')).toBeInTheDocument()
    expect(screen.getByText('Driver agreed: Cash')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Call (number hidden)' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'Continue' })).toHaveAttribute('href', '/trip')
  })

  it('counts elapsed seconds while searching and stops after the match', () => {
    renderScreen(<Finding />, { step: 'finding', finding: 'searching' })
    advance(2000)
    expect(screen.getByText('2 s elapsed')).toBeInTheDocument()
    advance(MATCH_DELAY_MS)
    expect(screen.queryByText(/s elapsed/)).not.toBeInTheDocument()
  })

  it('skips the wait on demand', () => {
    renderScreen(<Finding />, { step: 'finding', finding: 'searching' })
    fireEvent.click(screen.getByRole('button', { name: 'Skip wait' }))
    expect(readProbe().finding).toBe('matched')
  })

  it('shows the no-driver state with no charge and lets the rider try Flex', () => {
    renderScreen(<Finding />, {
      step: 'finding',
      finding: 'searching',
      scenario: 'noDriver',
      rideType: 'tuk',
      peak: true,
    })
    advance(MATCH_DELAY_MS)
    expect(readProbe().finding).toBe('none')
    expect(
      screen.getAllByText(/No tuk free right now\. Try Small car at LKR 906/).length,
    ).toBeGreaterThan(0)
    expect(screen.getAllByText(/You have not been charged/).length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('button', { name: 'Try Small car' }))
    expect(readProbe().rideType).toBe('smallCar')
    expect(readProbe().finding).toBe('searching')
    advance(MATCH_DELAY_MS)
    expect(readProbe().finding).toBe('matched')
  })

  it('runs the driver-cancel flow once, then re-matches with the fare kept', () => {
    renderScreen(<Finding />, { step: 'finding', finding: 'searching', scenario: 'driverCancel' })
    advance(MATCH_DELAY_MS)
    expect(readProbe().finding).toBe('matched')

    advance(DRIVER_CANCEL_DELAY_MS)
    expect(readProbe().finding).toBe('cancelled')
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Your driver cancelled. We’re finding another; your fare stays LKR 649, no cancellation fee.',
    )

    advance(MATCH_DELAY_MS * 2)
    expect(readProbe().finding).toBe('matched')

    advance(DRIVER_CANCEL_DELAY_MS * 2)
    expect(readProbe().finding).toBe('matched')
  })

  it('shows the cash-demand notice in treatment only', () => {
    renderScreen(<Finding />, {
      step: 'finding',
      finding: 'matched',
      scenario: 'cashDemand',
      payment: 'card',
      driver: mockDriver('tuk', 'card'),
    })
    expect(screen.getByText('Driver agreed: Card')).toBeInTheDocument()
    expect(screen.getByText(/the driver can’t change it/)).toBeInTheDocument()
  })

  it('offers the notification primer after the match in treatment', () => {
    renderScreen(<Finding />, {
      step: 'finding',
      finding: 'matched',
      variant: 'treatment',
      driver: mockDriver('tuk', 'cash'),
    })
    fireEvent.click(screen.getByRole('button', { name: 'Turn on alerts' }))
    expect(screen.queryByRole('button', { name: 'Turn on alerts' })).not.toBeInTheDocument()
  })
})

describe('Arrived screen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('ends the trip when the rider confirms arrival', () => {
    renderScreen(<Arrived />, {
      step: 'arrived',
      variant: 'treatment',
      destination: { id: 'fort', name: 'Fort Railway Station', distanceKm: 5.8, tripMinutes: 25 },
    })
    expect(
      screen.getByRole('heading', { level: 1, name: 'Have you arrived at Fort Railway Station?' }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Yes, end my trip' }))
    expect(readProbe()).toMatchObject({ step: 'receipt', endedBy: 'rider' })
  })

  it('ends the trip by timeout after 60 seconds, announcing the halfway point once', () => {
    renderScreen(<Arrived />, { step: 'arrived', variant: 'treatment' })
    advance((ARRIVAL_TIMEOUT_SECONDS / 2) * 1000)
    expect(screen.getByRole('status')).toHaveTextContent('30 s left')
    advance((ARRIVAL_TIMEOUT_SECONDS / 2 - 1) * 1000)
    expect(readProbe()).toMatchObject({ step: 'arrived' })
    expect(screen.getByText('1 s left')).toBeInTheDocument()
    advance(1000)
    expect(readProbe()).toMatchObject({ step: 'receipt', endedBy: 'timeout' })
  })

  it('shows the waiting state in control with no rider button, and the demo driver control ends the trip', () => {
    renderScreen(<Arrived />, { step: 'arrived', variant: 'control' })
    expect(screen.getByText('Waiting for the driver to end the trip')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Yes, end my trip' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Driver ends trip (demo)' }))
    expect(readProbe()).toMatchObject({ step: 'receipt', endedBy: 'driver' })
  })
})
