import { PlaceholderScreen } from '../components/PlaceholderScreen'
import { useI18n } from '../i18n/I18nContext'

export default function Trip() {
  const { t } = useI18n()
  return <PlaceholderScreen step="trip" title={t('trip.title')} />
}
