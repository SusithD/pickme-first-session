import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { IconClose } from './icons'
import { useI18n } from '../i18n/I18nContext'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  container?: 'frame' | 'viewport'
  headingLevel?: 'h1' | 'h2'
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Sheet({
  open,
  onClose,
  title,
  children,
  container = 'frame',
  headingLevel = 'h2',
}: SheetProps) {
  const Heading = headingLevel
  const { t } = useI18n()
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const panel = panelRef.current
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? panel)?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (!panel) return
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      if (!firstItem || !lastItem) {
        event.preventDefault()
        panel.focus()
        return
      }
      const active = document.activeElement
      const outside = !panel.contains(active)
      if (event.shiftKey && (outside || active === firstItem || active === panel)) {
        event.preventDefault()
        lastItem.focus()
      } else if (!event.shiftKey && (outside || active === lastItem)) {
        event.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previous?.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div className={`sheet-root sheet-${container}`}>
      <div className="sheet-scrim" aria-hidden="true" onClick={() => onClose()} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="sheet"
      >
        <div className="sheet-header">
          <Heading id={titleId} className="sheet-title">
            {title}
          </Heading>
          <button
            type="button"
            className="sheet-close"
            aria-label={t('common.close')}
            onClick={() => onClose()}
          >
            <IconClose size={16} />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  )
}
