import type { ReactNode } from 'react'
import { useHasFallback, useI18n } from '../i18n/I18nContext'
import { ConceptBanner } from './ConceptBanner'
import { VariantChip } from './VariantChip'

export function PhoneFrame({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  const hasFallback = useHasFallback()
  return (
    <div className="phone" role="group" aria-label={t('frame.label')}>
      <header className="phone-header">
        <ConceptBanner />
        <div className="phone-header-row">
          <VariantChip />
          {hasFallback ? (
            <span className="chip chip-en" aria-label={t('frame.enChipLabel')}>
              {t('frame.enChip')}
            </span>
          ) : null}
        </div>
      </header>
      <main className="phone-main" id="main">
        {children}
      </main>
    </div>
  )
}
