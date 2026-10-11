import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useSyncExternalStore,
} from 'react'
import type { Dispatch, ReactNode } from 'react'
import type { Lang } from '../i18n/types'
import { createInitialState, rideReducer, stepFromHash } from './rideMachine'
import type { RideAction, RideState, Scenario, Variant } from './rideMachine'

interface RideContextValue {
  state: RideState
  dispatch: Dispatch<RideAction>
}

const RideContext = createContext<RideContextValue | null>(null)
const LANG_KEY = 'pickme-first-session:lang'

function readStoredLang(): Lang | undefined {
  try {
    const stored = window.sessionStorage.getItem(LANG_KEY)
    return stored === 'en' || stored === 'si' || stored === 'ta' ? stored : undefined
  } catch {
    return undefined
  }
}

function initialise(overrides?: Partial<RideState>): RideState {
  return createInitialState({
    step: stepFromHash(window.location.hash),
    lang: readStoredLang() ?? 'en',
    ...overrides,
  })
}

export function RideProvider({
  children,
  initialState,
}: {
  children: ReactNode
  initialState?: Partial<RideState>
}) {
  const [state, dispatch] = useReducer(rideReducer, initialState, initialise)

  useEffect(() => {
    try {
      window.sessionStorage.setItem(LANG_KEY, state.lang)
    } catch {
      return
    }
  }, [state.lang])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <RideContext.Provider value={value}>{children}</RideContext.Provider>
}

export function useRide(): RideContextValue {
  const ctx = useContext(RideContext)
  if (!ctx) throw new Error('useRide must be used inside RideProvider')
  return ctx
}

export function useVariant(): Variant {
  return useRide().state.variant
}

export function useScenario(): Scenario {
  return useRide().state.scenario
}

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeToMotion(callback: () => void): () => void {
  const list = window.matchMedia(REDUCE_QUERY)
  list.addEventListener('change', callback)
  return () => list.removeEventListener('change', callback)
}

function systemPrefersReduced(): boolean {
  return window.matchMedia(REDUCE_QUERY).matches
}

export function useReducedMotion(): boolean {
  const preference = useRide().state.reducedMotion
  const system = useSyncExternalStore(subscribeToMotion, systemPrefersReduced, () => false)
  if (preference === 'reduce') return true
  if (preference === 'allow') return false
  return system
}
