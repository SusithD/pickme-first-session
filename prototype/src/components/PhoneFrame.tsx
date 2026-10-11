import type { ReactNode } from 'react'
import { useHasFallback, useI18n } from '../i18n/I18nContext'
import { ConceptBanner } from './ConceptBanner'
import { StatusBar } from './StatusBar'
import { VariantChip } from './VariantChip'

export function PhoneFrame({
  children,
  headerAction,
  mobile,
}: {
  children: ReactNode
  headerAction?: ReactNode
  mobile: boolean
}) {
  const { t } = useI18n()
  const hasFallback = useHasFallback()
  return (
    <div className="device">
      <div className="phone" role="group" aria-label={t('frame.label')}>
        <header className="phone-header">
          <StatusBar />
          <div className="notice-strip">
            <ConceptBanner />
            {mobile ? <VariantChip /> : null}
            {hasFallback ? (
              <span className="chip chip-en" aria-label={t('frame.enChipLabel')}>
                {t('frame.enChip')}
              </span>
            ) : null}
          </div>
          {headerAction ? <div className="phone-header-row">{headerAction}</div> : null}
        </header>
        <main className="phone-main" id="main">
          {children}
        </main>
        <span className="home-indicator" aria-hidden="true" />
      </div>
    </div>
  )
}
