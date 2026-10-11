import { PlaceholderScreen } from '../components/PlaceholderScreen'
import { useI18n } from '../i18n/I18nContext'

export default function Where() {
  const { t } = useI18n()
  return <PlaceholderScreen step="where" title={t('where.title')} />
}
