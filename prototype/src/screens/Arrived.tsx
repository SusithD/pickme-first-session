import { PlaceholderScreen } from '../components/PlaceholderScreen'
import { useI18n } from '../i18n/I18nContext'
import { PLACES } from '../state/mock'
import { useRide } from '../state/RideContext'

export default function Arrived() {
  const { t } = useI18n()
  const { state } = useRide()
  const place = (state.destination ?? PLACES[0])?.name ?? ''
  return <PlaceholderScreen step="arrived" title={t('arrived.title', { place })} />
}
