import { PlaceholderScreen } from '../components/PlaceholderScreen'
import { useI18n } from '../i18n/I18nContext'

export default function Verify() {
  const { t } = useI18n()
  return <PlaceholderScreen step="verify" title={t('verify.title')} />
}
