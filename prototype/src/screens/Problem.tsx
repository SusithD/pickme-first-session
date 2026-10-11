import { PlaceholderScreen } from '../components/PlaceholderScreen'
import { useI18n } from '../i18n/I18nContext'

export default function Problem() {
  const { t } = useI18n()
  return <PlaceholderScreen step="problem" title={t('problem.title')} />
}
