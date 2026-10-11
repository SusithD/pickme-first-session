import { PlaceholderScreen } from '../components/PlaceholderScreen'
import { useI18n } from '../i18n/I18nContext'

export default function Fare() {
  const { t } = useI18n()
  return <PlaceholderScreen step="fare" title={t('fare.title')} />
}
