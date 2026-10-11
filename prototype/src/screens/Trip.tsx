import { useEffect } from 'react'
import { Button, LinkButton } from '../components/Button'
import { Notice } from '../components/Notice'
import { useI18n } from '../i18n/I18nContext'
import { formatLkr } from '../state/mock'
import { useRide } from '../state/RideContext'
import { STEP_PATHS, bookedFare, fareTotal } from '../state/rideMachine'
import styles from './Trip.module.css'

const MINUTES_LEFT = 9

export default function Trip() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const { scenario, destination, variant } = state
  const treatment = variant === 'treatment'
  const routeChange = state.fare.changes.find((change) => change.kind === 'route')
  const total = fareTotal(state.fare)
  const unchanged = total === bookedFare(state.fare)

  useEffect(() => {
    if (scenario === 'routeChange') dispatch({ type: 'ROUTE_CHANGED' })
  }, [scenario, dispatch])

  let routeNotice = null
  if (treatment && routeChange?.status === 'pending') {
    routeNotice = (
      <Notice tone="warn">
        <p>{t('trip.routeNotice', { amount: formatLkr(routeChange.amount) })}</p>
        <div className={styles.actions}>
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
    <section className={styles.screen}>
      <h1>{t('trip.title')}</h1>

      {destination ? (
        <div className={styles.routeCard}>
          <div className={styles.track} aria-hidden="true">
            <span className={styles.dotDone} />
            <span className={styles.travelled} />
            <span className={styles.dotCurrent} />
            <span className={styles.remaining} />
            <span className={styles.dotEnd} />
          </div>
          <p className={styles.routeLabel}>
            {t('trip.routeBar', { place: destination.name, min: MINUTES_LEFT })}
          </p>
        </div>
      ) : null}

      <p className={styles.fare}>
        {unchanged
          ? t('trip.fareUnchanged', { amount: formatLkr(total) })
          : t('trip.fareSoFar', { amount: formatLkr(total) })}
      </p>

      <div aria-live="polite" aria-atomic="true">
        {routeNotice}
      </div>

      <div className={styles.actions}>
        <Button variant="secondary">{t('trip.share')}</Button>
        <Button variant="secondary">{t('trip.safety')}</Button>
      </div>

      <LinkButton to={STEP_PATHS.arrived} block>
        {t('trip.continue')}
      </LinkButton>
    </section>
  )
}
