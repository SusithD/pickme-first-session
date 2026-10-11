export type RideType = 'tuk' | 'smallCar' | 'car'
export type PaymentMethod = 'cash' | 'card'

export interface Place {
  id: string
  name: string
  distanceKm: number
  tripMinutes: number
}

export interface RideOption {
  id: RideType
  base: number
  perKm: number
  etaMin: number
  seats: number
}

export interface Driver {
  name: string
  rating: number
  vehicle: string
  plate: string
  etaMin: number
  agreedPayment: PaymentMethod
}

export const PICKUP_NAME = 'Bambalapitiya Junction'
export const PEAK_PERCENT = 15
export const WAIT_FEE_PER_MIN = 10
export const WAIT_FREE_MINUTES = 5
export const ROUTE_CHANGE_AMOUNT = 120
export const ARRIVAL_TIMEOUT_SECONDS = 60
export const MATCH_DELAY_MS = 2500
export const DRIVER_CANCEL_DELAY_MS = 4000
export const OTP_RESEND_SECONDS = 60
export const DEMO_OTP = '123456'
export const TICKET_ID = 'TKT-4821'
export const DEMO_TRIP_LINK = 'https://example.com/trip/demo'

export const PLACES: readonly Place[] = [
  { id: 'fort', name: 'Fort Railway Station', distanceKm: 5.8, tripMinutes: 25 },
  { id: 'borella', name: 'Borella', distanceKm: 6.2, tripMinutes: 25 },
  { id: 'wellawatte', name: 'Wellawatte', distanceKm: 3.1, tripMinutes: 14 },
  { id: 'mount-lavinia', name: 'Mount Lavinia Beach', distanceKm: 8.6, tripMinutes: 30 },
  { id: 'nugegoda', name: 'Nugegoda', distanceKm: 10.4, tripMinutes: 38 },
]

export const DEFAULT_PLACE: Place = PLACES[0] ?? {
  id: 'fort',
  name: 'Fort Railway Station',
  distanceKm: 5.8,
  tripMinutes: 25,
}

export const RIDES: Record<RideType, RideOption> = {
  tuk: { id: 'tuk', base: 100, perKm: 80, etaMin: 12, seats: 3 },
  smallCar: { id: 'smallCar', base: 150, perKm: 110, etaMin: 9, seats: 4 },
  car: { id: 'car', base: 200, perKm: 150, etaMin: 7, seats: 4 },
}

export const RIDE_TYPES: readonly RideType[] = ['tuk', 'smallCar', 'car']

const VEHICLES: Record<RideType, { vehicle: string; plate: string }> = {
  tuk: { vehicle: 'Bajaj tuk, blue', plate: 'WP ABC-1234' },
  smallCar: { vehicle: 'Suzuki Wagon R, white', plate: 'WP CAB-5678' },
  car: { vehicle: 'Toyota Axio, silver', plate: 'WP CBD-9012' },
}

export function mockDriver(rideType: RideType, payment: PaymentMethod): Driver {
  return {
    name: 'Nimal',
    rating: 4.8,
    etaMin: 5,
    agreedPayment: payment,
    ...VEHICLES[rideType],
  }
}

export function formatLkr(amount: number): string {
  return `LKR ${amount.toLocaleString('en-US')}`
}

export function normalisePhone(input: string): string | undefined {
  const compact = input.replace(/[\s\-()]/g, '').replace(/^\+/, '')
  let digits = compact
  if (/^94\d{9}$/.test(compact)) digits = compact.slice(2)
  else if (/^0\d{9}$/.test(compact)) digits = compact.slice(1)
  return /^\d{9}$/.test(digits) ? digits : undefined
}
