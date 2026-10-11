import { DEFAULT_PLACE, ROUTE_CHANGE_AMOUNT, TICKET_ID, mockDriver } from '../state/mock'
import { STEP_PATHS, fareFor } from '../state/rideMachine'
import type { FareChange, RideState, Step, Variant } from '../state/rideMachine'

export const SCENE_NAMES = [
  'intro',
  'problem',
  'welcome-treatment',
  'welcome-control',
  'location',
  'where',
  'ride-treatment',
  'ride-control',
  'fare-sheet',
  'verify',
  'finding-matched',
  'finding-cancelled',
  'trip-route-change',
  'arrived',
  'receipt-delta',
  'receipt-asbooked',
  'help-ticket',
  'receipt-sinhala',
  'ride-tamil',
] as const

export type SceneName = (typeof SCENE_NAMES)[number]

export interface SceneLocal {
  verifyStage?: 'phone' | 'code' | 'done'
}

export interface Scene {
  state: Partial<RideState>
  route: string
  local?: SceneLocal
}

const PHONE = '771234567'

function scene(step: Step, state: Partial<RideState>, local?: SceneLocal): Scene {
  return {
    state: { lang: 'en', variant: 'treatment', ...state, step },
    route: STEP_PATHS[step],
    ...(local ? { local } : {}),
  }
}

function routeChange(status: FareChange['status']): FareChange[] {
  return [{ id: 'route-1', kind: 'route', amount: ROUTE_CHANGE_AMOUNT, status }]
}

function mapState(variant: Variant, changes: FareChange[] = []): Partial<RideState> {
  return {
    variant,
    destination: DEFAULT_PLACE,
    rideType: 'tuk',
    payment: 'cash',
    peak: true,
    permissions: { location: 'typed', notifications: 'unset' },
    fare: fareFor('tuk', true, DEFAULT_PLACE, changes),
  }
}

function booked(variant: Variant, changes: FareChange[] = []): Partial<RideState> {
  return {
    ...mapState(variant, changes),
    booked: true,
    signedIn: true,
    phone: PHONE,
    finding: 'matched',
    driver: mockDriver('tuk', 'cash'),
  }
}

function onTrip(changes: FareChange[] = []): Partial<RideState> {
  const base = booked('treatment', changes)
  return { ...base, permissions: { location: 'typed', notifications: 'declined' } }
}

function receipt(changes: FareChange[], decision?: RideState['routeChangeDecision']) {
  return {
    ...onTrip(changes),
    endedBy: 'rider' as const,
    ...(decision ? { routeChangeDecision: decision } : {}),
  }
}

export const SCENES: Record<SceneName, Scene> = {
  intro: scene('intro', {}),
  problem: scene('problem', {}),
  'welcome-treatment': scene('welcome', { variant: 'treatment' }),
  'welcome-control': scene('welcome', { variant: 'control' }),
  location: scene('location', {}),
  where: scene('where', { permissions: { location: 'typed', notifications: 'unset' } }),
  'ride-treatment': scene('ride', mapState('treatment')),
  'ride-control': scene('ride', mapState('control')),
  'fare-sheet': scene('fare', mapState('treatment')),
  verify: scene(
    'verify',
    { ...mapState('treatment'), booked: true, phone: PHONE },
    { verifyStage: 'code' },
  ),
  'finding-matched': scene('finding', booked('treatment')),
  'finding-cancelled': scene('finding', {
    ...booked('treatment'),
    scenario: 'driverCancel',
    finding: 'cancelled',
    driver: undefined,
  }),
  'trip-route-change': scene('trip', {
    ...onTrip(routeChange('pending')),
    scenario: 'routeChange',
  }),
  arrived: scene('arrived', onTrip()),
  'receipt-delta': scene('receipt', receipt(routeChange('accepted'), 'accepted')),
  'receipt-asbooked': scene('receipt', receipt([])),
  'help-ticket': scene('help', {
    ...receipt(routeChange('accepted'), 'accepted'),
    helpReason: 'fareHigher',
    ticket: TICKET_ID,
  }),
  'receipt-sinhala': scene('receipt', {
    ...receipt(routeChange('accepted'), 'accepted'),
    lang: 'si',
  }),
  'ride-tamil': scene('ride', { ...mapState('treatment'), lang: 'ta' }),
}
