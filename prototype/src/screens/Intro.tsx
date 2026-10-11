import { PlaceholderScreen } from '../components/PlaceholderScreen'
import { useI18n } from '../i18n/I18nContext'

export default function Intro() {
  const { t } = useI18n()
  return <PlaceholderScreen step="intro" title={t('intro.title')} />
}
