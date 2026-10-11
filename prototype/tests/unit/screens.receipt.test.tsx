import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { I18nProvider } from '../../src/i18n/I18nContext'
import Help from '../../src/screens/Help'
import Receipt from '../../src/screens/Receipt'
import { RideProvider, useRide } from '../../src/state/RideContext'
import { fareFor } from '../../src/state/rideMachine'
import type { FareChange, RideState, Step, Variant } from '../../src/state/rideMachine'

function StepProbe() {
  const { state } = useRide()
  return (
    <p data-testid="probe" hidden>
      {JSON.stringify({ step: state.step, ticket: state.ticket ?? null })}
    </p>
  )
}

function readProbe(): { step: Step; ticket: string | null } {
  return JSON.parse(screen.getByTestId('probe').textContent ?? '{}')
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

function receiptState(
  variant: Variant,
  changes: FareChange[] = [],
  extra: Partial<RideState> = {},
): Partial<RideState> {
  return {
    step: 'receipt',
    variant,
    peak: true,
    fare: fareFor('tuk', true, changes),
    ...extra,
  }
}

const accepted: FareChange = { id: 'route-1', kind: 'route', amount: 120, status: 'accepted' }
const askLater: FareChange = { id: 'route-1', kind: 'route', amount: 120, status: 'askLater' }
const silent: FareChange = { id: 'route-1', kind: 'route', amount: 120, status: 'silent' }

describe('Receipt', () => {
  it('shows the booked fare with no change lines when nothing changed', () => {
    renderWith(<Receipt />, receiptState('treatment'))
    expect(screen.getByRole('heading', { level: 1, name: 'Your fare' })).toBeInTheDocument()
    expect(screen.getByText('LKR 540, as booked')).toBeInTheDocument()
    expect(screen.queryByText('Changes on this trip')).not.toBeInTheDocument()
    expect(screen.getByText('Pay cash to driver')).toBeInTheDocument()
  })

  it('explains an accepted change with a line per change and the delta', () => {
    renderWith(<Receipt />, receiptState('treatment', [accepted]))
    expect(screen.getByText('LKR 660 · LKR 120 more than booked')).toBeInTheDocument()
    expect(screen.getByText('Route change (accepted on trip)')).toBeInTheDocument()
    expect(screen.getByText('+LKR 120')).toBeInTheDocument()
    expect(screen.queryByText(/on hold/)).not.toBeInTheDocument()
  })

  it('shows a flagged change as on hold and leaves it out of the payable amount', () => {
    renderWith(<Receipt />, receiptState('treatment', [askLater]))
    expect(screen.getByText('LKR 540, as booked')).toBeInTheDocument()
    expect(screen.getByText('Route change (flagged, on hold)')).toBeInTheDocument()
    expect(
      screen.getByText('You flagged the route change. LKR 120 is on hold until we reply.'),
    ).toBeInTheDocument()
  })

  it('control shows only the moved total with no explanation lines', () => {
    renderWith(<Receipt />, receiptState('control', [silent]))
    expect(screen.getByText('LKR 660')).toBeInTheDocument()
    expect(screen.queryByText(/more than booked/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Route change/)).not.toBeInTheDocument()
    expect(screen.queryByText('Changes on this trip')).not.toBeInTheDocument()
    expect(screen.getByText('Pay cash to driver')).toBeInTheDocument()
  })

  it('shows the card payment line when the trip was paid by card', () => {
    renderWith(<Receipt />, receiptState('treatment', [], { payment: 'card' }))
    expect(screen.getByText('Charged to card ••1234')).toBeInTheDocument()
  })

  it('rates the trip with a 1 to 5 radiogroup', async () => {
    const user = userEvent.setup()
    renderWith(<Receipt />, receiptState('treatment'))
    const group = screen.getByRole('radiogroup', { name: 'Rate your ride' })
    expect(group).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(5)
    await user.click(screen.getByRole('radio', { name: '4 of 5' }))
    expect(screen.getByRole('radio', { name: '4 of 5' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: '1 of 5' })).toHaveAttribute('aria-checked', 'false')
  })

  it('links "Something\'s not right" to the help screen', () => {
    renderWith(<Receipt />, receiptState('treatment'))
    expect(screen.getByRole('link', { name: 'Something’s not right' })).toHaveAttribute(
      'href',
      '/help',
    )
  })
})

describe('Help', () => {
  it('keeps submit disabled until a reason is picked, then opens a ticket with that reason', async () => {
    const user = userEvent.setup()
    renderWith(<Help />, receiptState('treatment', [], { step: 'help' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Get help' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
    await user.click(screen.getByRole('radio', { name: 'Driver asked for cash on a card trip' }))
    expect(
      screen.getByRole('radio', { name: 'Driver asked for cash on a card trip' }),
    ).toHaveAttribute('aria-checked', 'true')
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(readProbe().ticket).toBe('PM-4821')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Ticket #PM-4821 opened. We reply within 24 hours.',
    )
    expect(screen.queryByText(/is on hold/)).not.toBeInTheDocument()
  })

  it('adds the on-hold line only when a change is flagged', async () => {
    const user = userEvent.setup()
    renderWith(<Help />, receiptState('treatment', [askLater], { step: 'help' }))
    await user.click(screen.getByRole('radio', { name: 'Fare is higher than explained' }))
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(screen.getByRole('status')).toHaveTextContent('The extra LKR 120 is on hold.')
  })

  it('returns to the start with a reset that clears the ticket', async () => {
    const user = userEvent.setup()
    renderWith(<Help />, receiptState('treatment', [], { step: 'help' }))
    await user.click(screen.getByRole('radio', { name: 'This trip didn’t happen' }))
    await user.click(screen.getByRole('button', { name: 'Send' }))
    await user.click(screen.getByRole('button', { name: 'Back to start' }))
    expect(readProbe()).toEqual({ step: 'intro', ticket: null })
  })

  it('enables submit once a reason is picked', () => {
    renderWith(<Help />, receiptState('treatment', [], { step: 'help' }))
    fireEvent.click(screen.getByRole('radio', { name: 'This trip didn’t happen' }))
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled()
  })
})
