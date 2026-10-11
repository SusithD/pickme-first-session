import { describe, expect, it } from 'vitest'
import {
  STEPS,
  STEP_PATHS,
  bookedFare,
  createInitialState,
  fareTotal,
  flaggedAmount,
  nextStep,
  rideReducer,
  stepFromHash,
  stepFromPath,
} from '../../src/state/rideMachine'
import type { RideAction, RideState } from '../../src/state/rideMachine'
import { PLACES, ROUTE_CHANGE_AMOUNT, TICKET_ID, normalisePhone } from '../../src/state/mock'

function run(actions: RideAction[], initial: RideState = createInitialState()): RideState {
  return actions.reduce(rideReducer, initial)
}

const fort = PLACES[0]!

function walk(initial: RideState): string[] {
  const walked: string[] = []
  for (let state: RideState | undefined = initial; state;) {
    walked.push(state.step)
    const next = nextStep(state)
    state = next ? { ...state, step: next } : undefined
  }
  return walked
}

describe('initial state', () => {
  it('starts on intro in treatment, English, cash, tuk, peak on, signed out', () => {
    const state = createInitialState()
    expect(state).toMatchObject({
      step: 'intro',
      variant: 'treatment',
      lang: 'en',
      scenario: 'normal',
      peak: true,
      signedIn: false,
      payment: 'cash',
      rideType: 'tuk',
      finding: 'searching',
      booked: false,
    })
    expect(state.permissions).toEqual({ location: 'unset', notifications: 'unset' })
    expect(fareTotal(state.fare)).toBe(649)
  })

  it('accepts overrides', () => {
    expect(createInitialState({ lang: 'si' }).lang).toBe('si')
  })
})

describe('routing helpers', () => {
  it('has a path for all 13 steps and round-trips them', () => {
    expect(STEPS).toHaveLength(13)
    for (const step of STEPS) expect(stepFromPath(STEP_PATHS[step])).toBe(step)
  })

  it('parses hashes and falls back to intro', () => {
    expect(stepFromHash('#/ride')).toBe('ride')
    expect(stepFromHash('')).toBe('intro')
    expect(stepFromHash('#/nowhere')).toBe('intro')
    expect(stepFromPath('/ride/')).toBe('ride')
  })

  it('walks the treatment flow from intro to help', () => {
    expect(walk(createInitialState())).toEqual([
      'intro',
      'welcome',
      'location',
      'where',
      'ride',
      'fare',
      'verify',
      'finding',
      'trip',
      'arrived',
      'receipt',
      'help',
    ])
  })

  it('walks the control flow with account and permissions first', () => {
    expect(walk(createInitialState({ variant: 'control' }))).toEqual([
      'intro',
      'welcome',
      'verify',
      'location',
      'where',
      'ride',
      'finding',
      'trip',
      'arrived',
      'receipt',
      'help',
    ])
  })

  it('skips verify after the fare sheet when already signed in', () => {
    const state = createInitialState({ step: 'fare', signedIn: true })
    expect(nextStep(state)).toBe('finding')
  })
})

describe('GOTO', () => {
  it('sets the step', () => {
    expect(run([{ type: 'GOTO', step: 'receipt' }]).step).toBe('receipt')
  })
})

describe('SET_LANG, SET_VARIANT, SET_SCENARIO, SET_REDUCED_MOTION', () => {
  it('updates each field', () => {
    const state = run([
      { type: 'SET_LANG', lang: 'ta' },
      { type: 'SET_VARIANT', variant: 'control' },
      { type: 'SET_SCENARIO', scenario: 'routeChange' },
      { type: 'SET_REDUCED_MOTION', preference: 'reduce' },
    ])
    expect(state).toMatchObject({
      lang: 'ta',
      variant: 'control',
      scenario: 'routeChange',
      reducedMotion: 'reduce',
    })
  })
})

describe('SET_PEAK and CHOOSE_RIDE', () => {
  it('recomputes the fare with and without peak', () => {
    const off = run([{ type: 'SET_PEAK', peak: false }])
    expect(off.fare.peak).toBe(0)
    expect(fareTotal(off.fare)).toBe(564)
    expect(fareTotal(run([{ type: 'SET_PEAK', peak: true }], off).fare)).toBe(649)
  })

  it('prices each ride type', () => {
    expect(fareTotal(run([{ type: 'CHOOSE_RIDE', rideType: 'smallCar' }]).fare)).toBe(906)
    expect(fareTotal(run([{ type: 'CHOOSE_RIDE', rideType: 'car' }]).fare)).toBe(1231)
  })

  it('keeps existing fare changes when the ride type or peak changes', () => {
    const changed = run([{ type: 'ROUTE_CHANGED' }, { type: 'ACCEPT_CHANGE' }])
    const flex = run([{ type: 'CHOOSE_RIDE', rideType: 'smallCar' }], changed)
    expect(flex.fare.changes).toHaveLength(1)
    const noPeak = run([{ type: 'SET_PEAK', peak: false }], changed)
    expect(noPeak.fare.changes).toHaveLength(1)
  })
})

describe('permissions', () => {
  it('sets location and notification permissions independently', () => {
    const state = run([
      { type: 'SET_LOCATION_PERMISSION', value: 'allowed' },
      { type: 'SET_NOTIFICATION_PERMISSION', value: 'declined' },
    ])
    expect(state.permissions).toEqual({ location: 'allowed', notifications: 'declined' })
  })

  it('records a typed pickup', () => {
    expect(run([{ type: 'SET_LOCATION_PERMISSION', value: 'typed' }]).permissions.location).toBe(
      'typed',
    )
  })
})

describe('SET_DESTINATION', () => {
  it('stores the place and moves to ride', () => {
    const state = run([{ type: 'SET_DESTINATION', place: fort }])
    expect(state.destination).toEqual(fort)
    expect(state.step).toBe('ride')
  })
})

describe('SET_PAYMENT', () => {
  it('switches between cash and card', () => {
    expect(run([{ type: 'SET_PAYMENT', payment: 'card' }]).payment).toBe('card')
  })
})

describe('BOOK and SIGN_IN', () => {
  it('sends a signed-out rider to verify with the fare unchanged', () => {
    const state = run([{ type: 'BOOK' }])
    expect(state.step).toBe('verify')
    expect(state.booked).toBe(true)
    expect(state.finding).toBe('searching')
    expect(fareTotal(state.fare)).toBe(649)
  })

  it('SIGN_IN after booking continues to finding', () => {
    const state = run([{ type: 'BOOK' }, { type: 'SIGN_IN' }])
    expect(state.signedIn).toBe(true)
    expect(state.step).toBe('finding')
  })

  it('sends a signed-in rider straight to finding', () => {
    const state = run([{ type: 'BOOK' }], createInitialState({ signedIn: true }))
    expect(state.step).toBe('finding')
  })

  it('clears previous trip results when booking again', () => {
    const dirty = run([
      { type: 'DRIVER_FOUND' },
      { type: 'ROUTE_CHANGED' },
      { type: 'ACCEPT_CHANGE' },
      { type: 'END_TRIP', endedBy: 'rider' },
      { type: 'OPEN_TICKET', reason: 'fareHigher' },
    ])
    const fresh = run([{ type: 'BOOK' }], dirty)
    expect(fresh.driver).toBeUndefined()
    expect(fresh.fare.changes).toEqual([])
    expect(fresh.routeChangeDecision).toBeUndefined()
    expect(fresh.endedBy).toBeUndefined()
    expect(fresh.ticket).toBeUndefined()
  })

  it('control SIGN_IN before booking continues to location', () => {
    const state = run(
      [{ type: 'SIGN_IN' }],
      createInitialState({ variant: 'control', step: 'verify' }),
    )
    expect(state.step).toBe('location')
  })
})

describe('finding actions', () => {
  it('DRIVER_FOUND matches a driver who agreed to the chosen payment', () => {
    const state = run([{ type: 'SET_PAYMENT', payment: 'card' }, { type: 'DRIVER_FOUND' }])
    expect(state.finding).toBe('matched')
    expect(state.driver?.agreedPayment).toBe('card')
    expect(state.driver?.plate).toBe('WP ABC-1234')
  })

  it('DRIVER_NONE clears the driver', () => {
    const state = run([{ type: 'DRIVER_FOUND' }, { type: 'DRIVER_NONE' }])
    expect(state.finding).toBe('none')
    expect(state.driver).toBeUndefined()
  })

  it('DRIVER_CANCELLED keeps the fare', () => {
    const state = run([{ type: 'DRIVER_FOUND' }, { type: 'DRIVER_CANCELLED' }])
    expect(state.finding).toBe('cancelled')
    expect(state.driver).toBeUndefined()
    expect(fareTotal(state.fare)).toBe(649)
  })

  it('FIND_AGAIN returns to searching', () => {
    expect(run([{ type: 'DRIVER_NONE' }, { type: 'FIND_AGAIN' }]).finding).toBe('searching')
  })
})

describe('route change actions', () => {
  it('ROUTE_CHANGED is pending in treatment and does not move the total yet', () => {
    const state = run([{ type: 'ROUTE_CHANGED' }])
    expect(state.fare.changes).toEqual([
      { id: 'route-1', kind: 'route', amount: ROUTE_CHANGE_AMOUNT, status: 'pending' },
    ])
    expect(fareTotal(state.fare)).toBe(649)
  })

  it('ROUTE_CHANGED silently moves the total in control', () => {
    const state = run([{ type: 'ROUTE_CHANGED' }], createInitialState({ variant: 'control' }))
    expect(state.fare.changes[0]?.status).toBe('silent')
    expect(fareTotal(state.fare)).toBe(769)
  })

  it('ROUTE_CHANGED is idempotent', () => {
    expect(run([{ type: 'ROUTE_CHANGED' }, { type: 'ROUTE_CHANGED' }]).fare.changes).toHaveLength(1)
  })

  it('ACCEPT_CHANGE adds the amount to the total', () => {
    const state = run([{ type: 'ROUTE_CHANGED' }, { type: 'ACCEPT_CHANGE' }])
    expect(state.routeChangeDecision).toBe('accepted')
    expect(fareTotal(state.fare)).toBe(769)
    expect(bookedFare(state.fare)).toBe(649)
    expect(flaggedAmount(state.fare)).toBe(0)
  })

  it('DEFER_CHANGE flags the amount for the receipt', () => {
    const state = run([{ type: 'ROUTE_CHANGED' }, { type: 'DEFER_CHANGE' }])
    expect(state.routeChangeDecision).toBe('askLater')
    expect(state.fare.changes[0]?.status).toBe('askLater')
    expect(flaggedAmount(state.fare)).toBe(120)
  })
})

describe('END_TRIP', () => {
  it.each(['rider', 'driver', 'timeout'] as const)('records %s and moves to receipt', (endedBy) => {
    const state = run([{ type: 'END_TRIP', endedBy }])
    expect(state.endedBy).toBe(endedBy)
    expect(state.step).toBe('receipt')
  })
})

describe('OPEN_TICKET', () => {
  it('stores the reason and a ticket number', () => {
    const state = run([{ type: 'OPEN_TICKET', reason: 'cashOnCard' }])
    expect(state.helpReason).toBe('cashOnCard')
    expect(state.ticket).toBe(TICKET_ID)
  })
})

describe('RESET', () => {
  it('returns to intro but keeps demo preferences', () => {
    const dirty = run([
      { type: 'SET_LANG', lang: 'si' },
      { type: 'SET_VARIANT', variant: 'control' },
      { type: 'SET_SCENARIO', scenario: 'noDriver' },
      { type: 'SET_PEAK', peak: false },
      { type: 'SET_REDUCED_MOTION', preference: 'reduce' },
      { type: 'SET_DESTINATION', place: fort },
      { type: 'SET_PAYMENT', payment: 'card' },
      { type: 'CHOOSE_RIDE', rideType: 'car' },
      { type: 'SIGN_IN' },
      { type: 'BOOK' },
      { type: 'OPEN_TICKET', reason: 'noTrip' },
      { type: 'RESET' },
    ])
    expect(dirty).toMatchObject({
      step: 'intro',
      lang: 'si',
      variant: 'control',
      scenario: 'noDriver',
      peak: false,
      reducedMotion: 'reduce',
      signedIn: false,
      booked: false,
      payment: 'cash',
      rideType: 'tuk',
    })
    expect(dirty.destination).toBeUndefined()
    expect(dirty.ticket).toBeUndefined()
    expect(fareTotal(dirty.fare)).toBe(564)
  })
})

describe('per-place fares', () => {
  it('prices each destination from its own distance', () => {
    const totals = PLACES.map((place) => fareTotal(run([{ type: 'SET_DESTINATION', place }]).fare))
    expect(new Set(totals).size).toBe(PLACES.length)
    const wellawatte = PLACES.find((place) => place.id === 'wellawatte')!
    const state = run([{ type: 'SET_DESTINATION', place: wellawatte }])
    expect(state.fare).toMatchObject({ base: 100, distance: 248, peak: 52, distanceKm: 3.1 })
  })

  it('keeps the fare when the ride type changes after choosing a place', () => {
    const state = run([
      { type: 'SET_DESTINATION', place: PLACES[4]! },
      { type: 'CHOOSE_RIDE', rideType: 'car' },
    ])
    expect(state.fare.distance).toBe(Math.round(150 * 10.4))
  })
})

describe('phone, pickup note and rating', () => {
  it('stores each', () => {
    const state = run([
      { type: 'SET_PHONE', phone: '771234567' },
      { type: 'SET_PICKUP_NOTE', note: 'Blue gate' },
      { type: 'RATE_TRIP', rating: 4 },
    ])
    expect(state).toMatchObject({ phone: '771234567', pickupNote: 'Blue gate', rating: 4 })
    const reset = run([{ type: 'RESET' }], state)
    expect(reset.phone).toBeUndefined()
    expect(reset.pickupNote).toBeUndefined()
    expect(reset.rating).toBeUndefined()
  })

  it('normalises Sri Lankan numbers', () => {
    expect(normalisePhone('077 123 4567')).toBe('771234567')
    expect(normalisePhone('+94 77 123 4567')).toBe('771234567')
    expect(normalisePhone('94771234567')).toBe('771234567')
    expect(normalisePhone('771234567')).toBe('771234567')
    expect(normalisePhone('7712')).toBeUndefined()
    expect(normalisePhone('0771234')).toBeUndefined()
  })
})
