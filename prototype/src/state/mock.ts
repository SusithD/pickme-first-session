export type RideType = 'tuk' | 'flex' | 'car'
export type PaymentMethod = 'cash' | 'card'

export interface Place {
  id: string
  name: string
}

export interface RideOption {
  id: RideType
  base: number
  distance: number
  peak: number
  estimateLow: number
  estimateHigh: number
  etaMin: number
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
export const DISTANCE_KM = 6.2
export const PEAK_PERCENT = 15
export const WAIT_FEE_PER_MIN = 10
export const ROUTE_CHANGE_AMOUNT = 120
export const ARRIVAL_TIMEOUT_SECONDS = 60
export const MATCH_DELAY_MS = 2500
export const DRIVER_CANCEL_DELAY_MS = 4000
export const OTP_RESEND_SECONDS = 30
export const DEMO_OTP = '123456'
export const TICKET_ID = 'PM-4821'

export const PLACES: readonly Place[] = [
  { id: 'fort', name: 'Fort Railway Station' },
  { id: 'bambalapitiya', name: 'Bambalapitiya Junction' },
  { id: 'nugegoda', name: 'Nugegoda' },
  { id: 'borella', name: 'Borella' },
  { id: 'mount-lavinia', name: 'Mount Lavinia Beach' },
]

export const RIDES: Record<RideType, RideOption> = {
  tuk: {
    id: 'tuk',
    base: 100,
    distance: 372,
    peak: 68,
    estimateLow: 470,
    estimateHigh: 620,
    etaMin: 12,
  },
  flex: {
    id: 'flex',
    base: 150,
    distance: 650,
    peak: 90,
    estimateLow: 790,
    estimateHigh: 990,
    etaMin: 9,
  },
  car: {
    id: 'car',
    base: 200,
    distance: 900,
    peak: 140,
    estimateLow: 1100,
    estimateHigh: 1380,
    etaMin: 7,
  },
}

export const RIDE_TYPES: readonly RideType[] = ['tuk', 'flex', 'car']

const VEHICLES: Record<RideType, { vehicle: string; plate: string }> = {
  tuk: { vehicle: 'Bajaj tuk, blue', plate: 'WP ABC-1234' },
  flex: { vehicle: 'Suzuki Wagon R, white', plate: 'WP CAB-5678' },
  car: { vehicle: 'Toyota Axio, silver', plate: 'WP CBD-9012' },
}

export function mockDriver(rideType: RideType, payment: PaymentMethod): Driver {
  return {
    name: 'Nimal',
    rating: 4.8,
    etaMin: 3,
    agreedPayment: payment,
    ...VEHICLES[rideType],
  }
}

export function formatLkr(amount: number): string {
  return `LKR ${amount.toLocaleString('en-US')}`
}
