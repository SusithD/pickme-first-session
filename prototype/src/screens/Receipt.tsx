import { PlaceholderScreen } from '../components/PlaceholderScreen'
import { useI18n } from '../i18n/I18nContext'

export default function Receipt() {
  const { t } = useI18n()
  return <PlaceholderScreen step="receipt" title={t('receipt.title')} />
}
