import { PlaceholderScreen } from '../components/PlaceholderScreen'
import { useI18n } from '../i18n/I18nContext'

export default function Location() {
  const { t } = useI18n()
  return <PlaceholderScreen step="location" title={t('location.title.treatment')} />
}
