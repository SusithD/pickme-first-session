interface LiveRegionProps {
  message: string
  politeness?: 'polite' | 'assertive'
  visuallyHidden?: boolean
  className?: string
}

export function LiveRegion({
  message,
  politeness = 'polite',
  visuallyHidden = true,
  className,
}: LiveRegionProps) {
  const classNames = [visuallyHidden ? 'visually-hidden' : '', className ?? '']
    .filter(Boolean)
    .join(' ')
  return (
    <div
      role={politeness === 'assertive' ? 'alert' : 'status'}
      aria-live={politeness}
      aria-atomic="true"
      className={classNames || undefined}
    >
      {message}
    </div>
  )
}
