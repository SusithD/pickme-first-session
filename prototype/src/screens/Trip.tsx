import { useEffect, useState } from 'react'
import { Button, LinkButton } from '../components/Button'
import { IconAlert, IconCheck, IconLife, IconShare } from '../components/icons'
import { MapScreen } from '../components/MapScreen'
import { Notice } from '../components/Notice'
import { Sheet } from '../components/Sheet'
import { ShareTripButton } from '../components/ShareTripButton'
import { useI18n } from '../i18n/I18nContext'
import { formatLkr } from '../state/mock'
import { useRide } from '../state/RideContext'
import { STEP_PATHS, bookedFare, fareTotal } from '../state/rideMachine'
import styles from './Trip.module.css'

export default function Trip() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const { scenario, destination, variant } = state
  const treatment = variant === 'treatment'
  const [safetyOpen, setSafetyOpen] = useState(false)
  const routeChange = state.fare.changes.find((change) => change.kind === 'route')
  const total = fareTotal(state.fare)
  const unchanged = total === bookedFare(state.fare)

  useEffect(() => {
    if (scenario === 'routeChange') dispatch({ type: 'ROUTE_CHANGED' })
  }, [scenario, dispatch])

  let routeNotice = null
  if (treatment && routeChange?.status === 'pending') {
    routeNotice = (
      <Notice tone="warn" className={styles.change}>
        <p className={styles.changeText}>
          <IconAlert size={22} />
          <span>{t('trip.routeNotice', { amount: formatLkr(routeChange.amount) })}</span>
        </p>
        <div className={styles.changeActions}>
          <Button onClick={() => dispatch({ type: 'ACCEPT_CHANGE' })}>{t('trip.accept')}</Button>
          <Button variant="secondary" onClick={() => dispatch({ type: 'DEFER_CHANGE' })}>
            {t('trip.askLater')}
          </Button>
        </div>
      </Notice>
    )
  } else if (treatment && routeChange?.status === 'accepted') {
    routeNotice = (
      <Notice tone="ok">
        <p>{t('trip.accepted', { amount: formatLkr(total) })}</p>
      </Notice>
    )
  } else if (treatment && routeChange?.status === 'askLater') {
    routeNotice = (
      <Notice tone="info">
        <p>{t('trip.askLaterNote')}</p>
      </Notice>
    )
  }

  return (
    <MapScreen
      mode="trip"
      back={false}
      callout={
        destination
          ? t('trip.routeBar', { place: destination.name, min: destination.tripMinutes })
          : undefined
      }
      footer={
        <LinkButton to={STEP_PATHS.arrived} variant="secondary" block>
          {t('trip.continue')}
        </LinkButton>
      }
    >
      <h1 className={styles.overline}>{t('trip.title')}</h1>

      {destination ? (
        <div className={styles.routeCard}>
          <div className={styles.eta}>
            <span className={styles.etaValue}>
              {t('trip.eta', { min: destination.tripMinutes })}
            </span>
            <span className={styles.etaTo}>{t('trip.to', { place: destination.name })}</span>
          </div>
          <div className={styles.track} aria-hidden="true">
            <span className={styles.startDot} />
            <span className={styles.travelled} />
            <span className={styles.endDot} />
          </div>
        </div>
      ) : null}

      <p className={styles.fare}>
        {unchanged ? (
          <span className={styles.fareOk}>
            <IconCheck size={16} />
          </span>
        ) : null}
        <span>
          {unchanged
            ? t('trip.fareUnchanged', { amount: formatLkr(total) })
            : t('trip.fareSoFar', { amount: formatLkr(total) })}
        </span>
      </p>

      <div aria-live="polite" aria-atomic="true">
        {routeNotice}
      </div>

      <div className={styles.actions}>
        <ShareTripButton label={t('trip.share')} icon={<IconShare size={20} />} />
        <Button variant="secondary" onClick={() => setSafetyOpen(true)}>
          <IconLife size={20} />
          {t('trip.safety')}
        </Button>
      </div>

      <Sheet open={safetyOpen} onClose={() => setSafetyOpen(false)} title={t('trip.safety')}>
        <div className={styles.safety}>
          <a className="btn btn-danger btn-block" href="tel:119">
            {t('trip.safety.call')}
          </a>
          <ShareTripButton block label={t('trip.safety.share')} />
        </div>
        <p className="muted">{t('trip.safety.demo')}</p>
      </Sheet>
    </MapScreen>
  )
}
