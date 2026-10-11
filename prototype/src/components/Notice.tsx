import type { ReactNode } from 'react'

type NoticeTone = 'info' | 'warn' | 'ok' | 'danger'

interface NoticeProps {
  tone?: NoticeTone
  live?: 'polite' | 'assertive'
  children: ReactNode
  className?: string
}

export function Notice({ tone = 'info', live, children, className }: NoticeProps) {
  const role = live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined
  return (
    <div
      className={['notice', `notice-${tone}`, className ?? ''].filter(Boolean).join(' ')}
      role={role}
      aria-live={live}
    >
      {children}
    </div>
  )
}
