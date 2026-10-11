import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { IconCheck } from '../components/icons'
import { LiveRegion } from '../components/LiveRegion'
import { MapScreen } from '../components/MapScreen'
import { useI18n } from '../i18n/I18nContext'
import { useRide, useVariant } from '../state/RideContext'
import { ARRIVAL_TIMEOUT_SECONDS, PLACES } from '../state/mock'
import styles from './Arrived.module.css'

const HALFWAY_SECONDS = ARRIVAL_TIMEOUT_SECONDS / 2

export default function Arrived() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const variant = useVariant()
  const place = (state.destination ?? PLACES[0])?.name ?? ''
  const treatment = variant === 'treatment'
  const callout = place
  const [remaining, setRemaining] = useState(ARRIVAL_TIMEOUT_SECONDS)
  const [showNotYet, setShowNotYet] = useState(false)

  useEffect(() => {
    if (!treatment) return
    const tick = window.setInterval(() => setRemaining((seconds) => Math.max(0, seconds - 1)), 1000)
    return () => window.clearInterval(tick)
  }, [treatment])

  useEffect(() => {
    if (treatment && remaining === 0) dispatch({ type: 'END_TRIP', endedBy: 'timeout' })
  }, [treatment, remaining, dispatch])

  const halfwayMessage =
    treatment && remaining === HALFWAY_SECONDS ? t('arrived.countdown', { seconds: remaining }) : ''

  if (!treatment) {
    return (
      <MapScreen mode="arrived" back={false} callout={callout} sheetTop="58%">
        <h1>{t('arrived.heading.control')}</h1>
        <p className="muted">{t('arrived.waiting.control')}</p>
        <div className={styles.actions}>
          <Button
            variant="secondary"
            block
            onClick={() => dispatch({ type: 'END_TRIP', endedBy: 'driver' })}
          >
            {t('arrived.driverEnds')}
          </Button>
        </div>
      </MapScreen>
    )
  }

  return (
    <MapScreen mode="arrived" back={false} callout={callout} sheetTop="58%">
      <h1>{t('arrived.title', { place })}</h1>
      <div className={styles.actions}>
        <Button
          block
          className={styles.confirm}
          onClick={() => dispatch({ type: 'END_TRIP', endedBy: 'rider' })}
        >
          <IconCheck size={22} />
          {t('arrived.yes')}
        </Button>
        <Button variant="secondary" block onClick={() => setShowNotYet(true)}>
          {t('arrived.no')}
        </Button>
      </div>
      {showNotYet ? <p className={styles.note}>{t('arrived.notYet')}</p> : null}
      <p className={styles.rule}>{t('arrived.rule', { seconds: ARRIVAL_TIMEOUT_SECONDS })}</p>
      <p className={styles.countdown}>{t('arrived.countdown', { seconds: remaining })}</p>
      <LiveRegion message={halfwayMessage} />
    </MapScreen>
  )
}
