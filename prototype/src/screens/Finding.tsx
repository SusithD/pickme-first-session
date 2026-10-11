import { PlaceholderScreen } from '../components/PlaceholderScreen'
import { useI18n } from '../i18n/I18nContext'

export default function Finding() {
  const { t } = useI18n()
  return <PlaceholderScreen step="finding" title={t('finding.title')} />
}
