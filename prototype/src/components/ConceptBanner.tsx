import { useI18n } from '../i18n/I18nContext'

export function ConceptBanner() {
  const { t } = useI18n()
  return <p className="concept-banner">{t('banner.text')}</p>
}
