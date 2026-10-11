import type { ReactNode } from 'react'

const INERT_PROPS = { inert: '' }

export function Inert({ children }: { children: ReactNode }) {
  return (
    <div className="inert-fill" aria-hidden="true" {...INERT_PROPS}>
      {children}
    </div>
  )
}
