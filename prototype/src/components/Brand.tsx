import { useI18n } from '../i18n/I18nContext'

export function Brand() {
  const { t } = useI18n()
  return (
    <p className="brand">
      <span className="brand-name">PickMe</span>
      <span className="brand-tag">{t('intro.brandTag')}</span>
    </p>
  )
}
