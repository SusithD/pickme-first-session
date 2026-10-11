import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { useI18n } from '../i18n/I18nContext'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  container?: 'frame' | 'viewport'
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Sheet({ open, onClose, title, children, container = 'frame' }: SheetProps) {
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
          <h2 id={titleId} className="sheet-title">
            {title}
          </h2>
          <button type="button" className="btn btn-ghost sheet-close" onClick={() => onClose()}>
            {t('common.close')}
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  )
}
