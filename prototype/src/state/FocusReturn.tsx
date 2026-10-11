import { createContext, useContext, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'

interface FocusReturnValue {
  set: (id: string) => void
  take: () => string | undefined
}

const noop: FocusReturnValue = { set: () => undefined, take: () => undefined }

const FocusReturnContext = createContext<FocusReturnValue>(noop)

export function FocusReturnProvider({ children }: { children: ReactNode }) {
  const pending = useRef<string | undefined>(undefined)
  const value = useMemo<FocusReturnValue>(
    () => ({
      set: (id) => {
        pending.current = id
      },
      take: () => {
        const id = pending.current
        pending.current = undefined
        return id
      },
    }),
    [],
  )
  return <FocusReturnContext.Provider value={value}>{children}</FocusReturnContext.Provider>
}

export function useFocusReturn(): FocusReturnValue {
  return useContext(FocusReturnContext)
}
