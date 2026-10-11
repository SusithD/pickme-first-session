import { PlaceholderScreen } from '../components/PlaceholderScreen'
import { useI18n } from '../i18n/I18nContext'

export default function Help() {
  const { t } = useI18n()
  return <PlaceholderScreen step="help" title={t('help.title')} />
}
