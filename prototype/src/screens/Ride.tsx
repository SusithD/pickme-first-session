import { PlaceholderScreen } from '../components/PlaceholderScreen'
import { useI18n } from '../i18n/I18nContext'

export default function Ride() {
  const { t } = useI18n()
  return <PlaceholderScreen step="ride" title={t('ride.title')} />
}
