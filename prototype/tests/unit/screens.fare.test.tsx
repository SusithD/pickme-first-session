import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { I18nProvider } from '../../src/i18n/I18nContext'
import Fare from '../../src/screens/Fare'
import Trip from '../../src/screens/Trip'
import { RideProvider, useRide } from '../../src/state/RideContext'
import { fareFor } from '../../src/state/rideMachine'
import type { RideState, Step, Variant } from '../../src/state/rideMachine'

function StepProbe() {
  const { state } = useRide()
  return <p data-testid="step">{state.step}</p>
}

function renderWith(ui: ReactElement, initialState: Partial<RideState>) {
  return render(
    <MemoryRouter>
      <RideProvider initialState={initialState}>
        <I18nProvider>
          {ui}
          <StepProbe />
        </I18nProvider>
      </RideProvider>
    </MemoryRouter>,
  )
}

function rideState(
  step: Step,
  variant: Variant,
  peak: boolean,
  extra: Partial<RideState> = {},
): Partial<RideState> {
  return { step, variant, peak, fare: fareFor('tuk', peak, undefined), ...extra }
}

function amounts(container: HTMLElement): number[] {
  return Array.from(container.querySelectorAll('dd')).map((cell) =>
    Number((cell.textContent ?? '').replace(/[^0-9]/g, '')),
  )
}

describe('Fare sheet', () => {
  it('breakdown sums to the total with peak on', () => {
    const { container } = renderWith(<Fare />, rideState('fare', 'treatment', true))
    const values = amounts(container)
    expect(values).toEqual([100, 464, 85, 649])
    expect(values.slice(0, -1).reduce((sum, value) => sum + value, 0)).toBe(649)
    expect(screen.getByText('Peak +15%')).toBeInTheDocument()
  })

  it('breakdown sums to the total with peak off and drops the peak line', () => {
    const { container } = renderWith(<Fare />, rideState('fare', 'treatment', false))
    const values = amounts(container)
    expect(values).toEqual([100, 464, 564])
    expect(values.slice(0, -1).reduce((sum, value) => sum + value, 0)).toBe(564)
    expect(screen.queryByText('Peak +15%')).not.toBeInTheDocument()
  })

  it('lists the three things that can change the fare in treatment', () => {
    renderWith(<Fare />, rideState('fare', 'treatment', true))
    expect(screen.getByText('Only three things can change this fare')).toBeInTheDocument()
    expect(
      screen.getByText('Waiting over 5 minutes at pickup (LKR 10 a minute)'),
    ).toBeInTheDocument()
    expect(screen.getByText('A route change you approve')).toBeInTheDocument()
    expect(screen.getByText('A stop you add')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Got it' })).toBeInTheDocument()
  })

  it('control shows only the estimate note', () => {
    renderWith(<Fare />, rideState('fare', 'control', true))
    expect(screen.getByText('Fare is an estimate. Final fare may vary.')).toBeInTheDocument()
    expect(screen.queryByText('Only three things can change this fare')).not.toBeInTheDocument()
    expect(screen.queryByText('Base')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Got it' })).not.toBeInTheDocument()
  })

  it('Got it returns to the ride screen', async () => {
    const user = userEvent.setup()
    renderWith(<Fare />, rideState('fare', 'treatment', true))
    await user.click(screen.getByRole('button', { name: 'Got it' }))
    expect(screen.getByTestId('step')).toHaveTextContent('ride')
  })

  it('Escape closes the sheet and returns to the ride screen', async () => {
    const user = userEvent.setup()
    renderWith(<Fare />, rideState('fare', 'treatment', true))
    await user.keyboard('{Escape}')
    expect(screen.getByTestId('step')).toHaveTextContent('ride')
  })
})

describe('Trip', () => {
  it('accepting the route change updates the fare', async () => {
    const user = userEvent.setup()
    renderWith(<Trip />, rideState('trip', 'treatment', true, { scenario: 'routeChange' }))
    expect(
      await screen.findByText('Driver took a longer route because of a road closure. +LKR 120.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Fare so far: LKR 649 (unchanged)')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Accept' }))
    expect(screen.getByText('Fare so far: LKR 769')).toBeInTheDocument()
    expect(screen.getByText('Accepted. New fare LKR 769.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Accept' })).not.toBeInTheDocument()
  })

  it('Ask at the end flags the change for the receipt', async () => {
    const user = userEvent.setup()
    renderWith(<Trip />, rideState('trip', 'treatment', true, { scenario: 'routeChange' }))
    await user.click(await screen.findByRole('button', { name: 'Ask at the end' }))
    expect(screen.getByText('Noted. We will flag it on your receipt.')).toBeInTheDocument()
  })

  it('control moves the fare silently with no notice', async () => {
    renderWith(<Trip />, rideState('trip', 'control', true, { scenario: 'routeChange' }))
    expect(await screen.findByText('Fare so far: LKR 769')).toBeInTheDocument()
    expect(screen.queryByText(/Driver took a longer route/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Accept' })).not.toBeInTheDocument()
  })
})
