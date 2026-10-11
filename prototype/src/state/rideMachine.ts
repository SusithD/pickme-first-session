import type { Lang } from '../i18n/types'
import { RIDES, ROUTE_CHANGE_AMOUNT, TICKET_ID, mockDriver } from './mock'
import type { Driver, PaymentMethod, Place, RideType } from './mock'

export type Step =
  | 'intro'
  | 'problem'
  | 'welcome'
  | 'location'
  | 'where'
  | 'ride'
  | 'fare'
  | 'verify'
  | 'finding'
  | 'trip'
  | 'arrived'
  | 'receipt'
  | 'help'

export type Variant = 'control' | 'treatment'
export type Scenario = 'normal' | 'noDriver' | 'driverCancel' | 'routeChange' | 'cashDemand'
export type FindingStatus = 'searching' | 'matched' | 'none' | 'cancelled'
export type ChangeKind = 'route' | 'wait' | 'stop'
export type ChangeStatus = 'pending' | 'accepted' | 'askLater' | 'silent'
export type RouteChangeDecision = 'accepted' | 'askLater'
export type LocationPermission = 'unset' | 'allowed' | 'typed'
export type NotificationPermission = 'unset' | 'allowed' | 'declined'
export type MotionPreference = 'system' | 'reduce' | 'allow'
export type TripEndedBy = 'rider' | 'driver' | 'timeout'
export type HelpReason = 'fareHigher' | 'cashOnCard' | 'noTrip'

export interface FareChange {
  id: string
  kind: ChangeKind
  amount: number
  status: ChangeStatus
}

export interface Fare {
  base: number
  distance: number
  peak: number
  changes: FareChange[]
}

export interface Permissions {
  location: LocationPermission
  notifications: NotificationPermission
}

export interface RideState {
  step: Step
  variant: Variant
  lang: Lang
  scenario: Scenario
  peak: boolean
  reducedMotion: MotionPreference
  signedIn: boolean
  permissions: Permissions
  destination?: Place
  rideType: RideType
  payment: PaymentMethod
  booked: boolean
  fare: Fare
  driver?: Driver
  finding: FindingStatus
  routeChangeDecision?: RouteChangeDecision
  endedBy?: TripEndedBy
  helpReason?: HelpReason
  ticket?: string
}

export type RideAction =
  | { type: 'GOTO'; step: Step }
  | { type: 'SET_LANG'; lang: Lang }
  | { type: 'SET_VARIANT'; variant: Variant }
  | { type: 'SET_SCENARIO'; scenario: Scenario }
  | { type: 'SET_PEAK'; peak: boolean }
  | { type: 'SET_REDUCED_MOTION'; preference: MotionPreference }
  | { type: 'SET_LOCATION_PERMISSION'; value: Exclude<LocationPermission, 'unset'> }
  | { type: 'SET_NOTIFICATION_PERMISSION'; value: Exclude<NotificationPermission, 'unset'> }
  | { type: 'SET_DESTINATION'; place: Place }
  | { type: 'CHOOSE_RIDE'; rideType: RideType }
  | { type: 'SET_PAYMENT'; payment: PaymentMethod }
  | { type: 'BOOK' }
  | { type: 'SIGN_IN' }
  | { type: 'DRIVER_FOUND' }
  | { type: 'DRIVER_NONE' }
  | { type: 'DRIVER_CANCELLED' }
  | { type: 'FIND_AGAIN' }
  | { type: 'ROUTE_CHANGED' }
  | { type: 'ACCEPT_CHANGE' }
  | { type: 'DEFER_CHANGE' }
  | { type: 'END_TRIP'; endedBy: TripEndedBy }
  | { type: 'OPEN_TICKET'; reason: HelpReason }
  | { type: 'RESET' }

export const STEP_PATHS: Record<Step, string> = {
  intro: '/',
  problem: '/problem',
  welcome: '/welcome',
  location: '/location',
  where: '/where',
  ride: '/ride',
  fare: '/fare',
  verify: '/verify',
  finding: '/finding',
  trip: '/trip',
  arrived: '/arrived',
  receipt: '/receipt',
  help: '/help',
}

export const STEPS = Object.keys(STEP_PATHS) as Step[]

export function stepFromPath(path: string): Step | undefined {
  const normalised = path.length > 1 ? path.replace(/\/+$/, '') : path
  return STEPS.find((step) => STEP_PATHS[step] === normalised)
}

export function stepFromHash(hash: string): Step {
  const path = hash.replace(/^#/, '').split('?')[0] || '/'
  return stepFromPath(path) ?? 'intro'
}

export function nextStep(state: RideState): Step | undefined {
  const treatment = state.variant === 'treatment'
  switch (state.step) {
    case 'intro':
    case 'problem':
      return 'welcome'
    case 'welcome':
      return treatment ? 'location' : 'verify'
    case 'verify':
      return treatment || state.booked ? 'finding' : 'location'
    case 'location':
      return 'where'
    case 'where':
      return 'ride'
    case 'ride':
      return treatment ? 'fare' : 'finding'
    case 'fare':
      return state.signedIn ? 'finding' : 'verify'
    case 'finding':
      return 'trip'
    case 'trip':
      return 'arrived'
    case 'arrived':
      return 'receipt'
    case 'receipt':
      return 'help'
    case 'help':
      return undefined
  }
}

export function fareFor(rideType: RideType, peak: boolean, changes: FareChange[] = []): Fare {
  const ride = RIDES[rideType]
  return {
    base: ride.base,
    distance: ride.distance,
    peak: peak ? ride.peak : 0,
    changes,
  }
}

export function bookedFare(fare: Fare): number {
  return fare.base + fare.distance + fare.peak
}

export function fareTotal(fare: Fare): number {
  const changed = fare.changes
    .filter((change) => change.status !== 'pending')
    .reduce((sum, change) => sum + change.amount, 0)
  return bookedFare(fare) + changed
}

export function flaggedAmount(fare: Fare): number {
  return fare.changes
    .filter((change) => change.status === 'askLater')
    .reduce((sum, change) => sum + change.amount, 0)
}

export function createInitialState(overrides: Partial<RideState> = {}): RideState {
  return {
    step: 'intro',
    variant: 'treatment',
    lang: 'en',
    scenario: 'normal',
    peak: true,
    reducedMotion: 'system',
    signedIn: false,
    permissions: { location: 'unset', notifications: 'unset' },
    rideType: 'tuk',
    payment: 'cash',
    booked: false,
    fare: fareFor('tuk', true),
    finding: 'searching',
    ...overrides,
  }
}

function updateChanges(fare: Fare, from: ChangeStatus, to: ChangeStatus): Fare {
  return {
    ...fare,
    changes: fare.changes.map((change) =>
      change.kind === 'route' && change.status === from ? { ...change, status: to } : change,
    ),
  }
}

export function rideReducer(state: RideState, action: RideAction): RideState {
  switch (action.type) {
    case 'GOTO':
      return { ...state, step: action.step }
    case 'SET_LANG':
      return { ...state, lang: action.lang }
    case 'SET_VARIANT':
      return { ...state, variant: action.variant }
    case 'SET_SCENARIO':
      return { ...state, scenario: action.scenario }
    case 'SET_PEAK':
      return {
        ...state,
        peak: action.peak,
        fare: fareFor(state.rideType, action.peak, state.fare.changes),
      }
    case 'SET_REDUCED_MOTION':
      return { ...state, reducedMotion: action.preference }
    case 'SET_LOCATION_PERMISSION':
      return { ...state, permissions: { ...state.permissions, location: action.value } }
    case 'SET_NOTIFICATION_PERMISSION':
      return { ...state, permissions: { ...state.permissions, notifications: action.value } }
    case 'SET_DESTINATION':
      return { ...state, destination: action.place, step: 'ride' }
    case 'CHOOSE_RIDE':
      return {
        ...state,
        rideType: action.rideType,
        fare: fareFor(action.rideType, state.peak, state.fare.changes),
      }
    case 'SET_PAYMENT':
      return { ...state, payment: action.payment }
    case 'BOOK':
      return {
        ...state,
        booked: true,
        fare: fareFor(state.rideType, state.peak),
        driver: undefined,
        finding: 'searching',
        routeChangeDecision: undefined,
        endedBy: undefined,
        helpReason: undefined,
        ticket: undefined,
        step: state.signedIn ? 'finding' : 'verify',
      }
    case 'SIGN_IN': {
      const signedIn = { ...state, signedIn: true }
      return { ...signedIn, step: nextStep(signedIn) ?? state.step }
    }
    case 'DRIVER_FOUND':
      return {
        ...state,
        finding: 'matched',
        driver: mockDriver(state.rideType, state.payment),
      }
    case 'DRIVER_NONE':
      return { ...state, finding: 'none', driver: undefined }
    case 'DRIVER_CANCELLED':
      return { ...state, finding: 'cancelled', driver: undefined }
    case 'FIND_AGAIN':
      return { ...state, finding: 'searching', driver: undefined }
    case 'ROUTE_CHANGED': {
      if (state.fare.changes.some((change) => change.kind === 'route')) return state
      const change: FareChange = {
        id: 'route-1',
        kind: 'route',
        amount: ROUTE_CHANGE_AMOUNT,
        status: state.variant === 'treatment' ? 'pending' : 'silent',
      }
      return { ...state, fare: { ...state.fare, changes: [...state.fare.changes, change] } }
    }
    case 'ACCEPT_CHANGE':
      return {
        ...state,
        fare: updateChanges(state.fare, 'pending', 'accepted'),
        routeChangeDecision: 'accepted',
      }
    case 'DEFER_CHANGE':
      return {
        ...state,
        fare: updateChanges(state.fare, 'pending', 'askLater'),
        routeChangeDecision: 'askLater',
      }
    case 'END_TRIP':
      return { ...state, endedBy: action.endedBy, step: 'receipt' }
    case 'OPEN_TICKET':
      return { ...state, helpReason: action.reason, ticket: TICKET_ID }
    case 'RESET':
      return createInitialState({
        variant: state.variant,
        lang: state.lang,
        scenario: state.scenario,
        peak: state.peak,
        reducedMotion: state.reducedMotion,
        fare: fareFor('tuk', state.peak),
      })
  }
}
