import type { ReactNode } from 'react'

const INERT_PROPS = { inert: '' }

export function Inert({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden="true" {...INERT_PROPS}>
      {children}
    </div>
  )
}
