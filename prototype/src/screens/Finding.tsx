import { useEffect, useRef, useState } from 'react'
import { Button, LinkButton } from '../components/Button'
import { ShareTripButton } from '../components/ShareTripButton'
import { LiveRegion } from '../components/LiveRegion'
import { Notice } from '../components/Notice'
import { useI18n } from '../i18n/I18nContext'
import { useReducedMotion, useRide, useVariant } from '../state/RideContext'
import { DRIVER_CANCEL_DELAY_MS, MATCH_DELAY_MS, formatLkr } from '../state/mock'
import type { RideType } from '../state/mock'
import { STEP_PATHS, bookedFare, fareFor } from '../state/rideMachine'
import type { RideAction, Scenario } from '../state/rideMachine'
import styles from './Finding.module.css'

function searchOutcome(attempt: number, scenario: Scenario, rideType: RideType): RideAction {
  const noTuk = scenario === 'noDriver' && rideType === 'tuk' && attempt === 1
  return { type: noTuk ? 'DRIVER_NONE' : 'DRIVER_FOUND' }
}

export default function Finding() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const variant = useVariant()
  const reducedMotion = useReducedMotion()
  const { finding, scenario, rideType, peak, fare, driver, permissions, destination, pickupNote } =
    state
  const [elapsed, setElapsed] = useState(0)
  const attempts = useRef(0)
  const cancels = useRef(0)

  const rideLabel = t(`common.${rideType}` as const).toLowerCase()
  const fareAmount = formatLkr(bookedFare(fare))
  const smallCarAmount = formatLkr(bookedFare(fareFor('smallCar', peak, destination)))

  useEffect(() => {
    if (finding !== 'searching') return
    setElapsed(0)
    const tick = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(tick)
  }, [finding])

  useEffect(() => {
    if (finding !== 'searching') return
    const timer = window.setTimeout(() => {
      attempts.current += 1
      dispatch(searchOutcome(attempts.current, scenario, rideType))
    }, MATCH_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [finding, scenario, rideType, dispatch])

  useEffect(() => {
    if (finding !== 'matched' || scenario !== 'driverCancel' || cancels.current > 0) return
    const timer = window.setTimeout(() => {
      cancels.current += 1
      dispatch({ type: 'DRIVER_CANCELLED' })
    }, DRIVER_CANCEL_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [finding, scenario, dispatch])

  useEffect(() => {
    if (finding !== 'cancelled') return
    const timer = window.setTimeout(() => dispatch({ type: 'FIND_AGAIN' }), MATCH_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [finding, dispatch])

  function skipWait() {
    if (finding === 'cancelled') {
      dispatch({ type: 'FIND_AGAIN' })
      return
    }
    attempts.current += 1
    dispatch(searchOutcome(attempts.current, scenario, rideType))
  }

  function trySmallCar() {
    dispatch({ type: 'CHOOSE_RIDE', rideType: 'smallCar' })
    dispatch({ type: 'FIND_AGAIN' })
  }

  let politeMessage = ''
  let assertiveMessage = ''
  if (finding === 'searching') {
    politeMessage = t('finding.searching', { ride: rideLabel })
  } else if (finding === 'matched' && driver) {
    politeMessage = `${t('finding.matched')}. ${driver.name}, ${t('finding.eta', { min: driver.etaMin })}`
  } else if (finding === 'none') {
    politeMessage = t('finding.none', { amount: smallCarAmount })
  } else if (finding === 'cancelled') {
    assertiveMessage = t('finding.cancelled', { amount: fareAmount })
  }

  const showPrimer = variant === 'treatment' && permissions.notifications === 'unset'

  return (
    <section className="screen">
      <h1>{t('finding.title')}</h1>

      {finding === 'searching' ? (
        <>
          <div className={styles.searching}>
            {reducedMotion ? (
              <span className={styles.staticLabel}>{t('finding.searchingStatic')}</span>
            ) : (
              <span className={styles.spinner} aria-hidden="true" />
            )}
            <div>
              <p className={styles.lead}>{t('finding.searching', { ride: rideLabel })}</p>
              <p className="muted">{t('finding.elapsed', { seconds: elapsed })}</p>
            </div>
          </div>
          <div className={styles.actions}>
            <Button variant="secondary" block onClick={skipWait}>
              {t('finding.skip')}
            </Button>
            <LinkButton variant="ghost" block to={STEP_PATHS.ride}>
              {t('finding.cancel')}
            </LinkButton>
          </div>
        </>
      ) : null}

      {finding === 'matched' && driver ? (
        <>
          <h2 className={styles.heading}>{t('finding.matched')}</h2>
          <div className={styles.driver}>
            <p className={styles.driverName}>{driver.name}</p>
            <p>{t('finding.rating', { rating: driver.rating })}</p>
            <p>
              {driver.vehicle}, {t('finding.plate', { plate: driver.plate })}
            </p>
            <p>{t('finding.eta', { min: driver.etaMin })}</p>
            {pickupNote ? <p>{t('finding.note', { note: pickupNote })}</p> : null}
            <p className={styles.badge}>
              {t('finding.agreed', {
                method: t(driver.agreedPayment === 'cash' ? 'common.cash' : 'common.card'),
              })}
            </p>
          </div>
          {scenario === 'cashDemand' && variant === 'treatment' ? (
            <Notice tone="warn">
              {t('finding.cashLocked', {
                method: t(driver.agreedPayment === 'cash' ? 'common.cash' : 'common.card'),
              })}
            </Notice>
          ) : null}
          {showPrimer ? (
            <Notice tone="info" className={styles.primer}>
              <p>{t('finding.notifTitle')}</p>
              <div className={styles.primerActions}>
                <Button
                  onClick={() =>
                    dispatch({ type: 'SET_NOTIFICATION_PERMISSION', value: 'allowed' })
                  }
                >
                  {t('finding.notifAllow')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    dispatch({ type: 'SET_NOTIFICATION_PERMISSION', value: 'declined' })
                  }
                >
                  {t('finding.notifSkip')}
                </Button>
              </div>
            </Notice>
          ) : null}
          <div className={styles.actions}>
            <Button variant="secondary" block disabled>
              {t('finding.call')}
            </Button>
            <ShareTripButton block label={t('finding.share')} />
            <LinkButton block to={STEP_PATHS.trip}>
              {t('finding.continue')}
            </LinkButton>
          </div>
        </>
      ) : null}

      {finding === 'none' ? (
        <>
          <Notice tone="info">{t('finding.none', { amount: smallCarAmount })}</Notice>
          <div className={styles.actions}>
            <Button block onClick={trySmallCar}>
              {t('finding.trySmallCar')}
            </Button>
            <Button variant="secondary" block onClick={() => dispatch({ type: 'FIND_AGAIN' })}>
              {t('finding.wait')}
            </Button>
          </div>
        </>
      ) : null}

      {finding === 'cancelled' ? (
        <>
          <Notice tone="warn">{t('finding.cancelled', { amount: fareAmount })}</Notice>
          <div className={styles.actions}>
            <Button variant="secondary" block onClick={skipWait}>
              {t('finding.skip')}
            </Button>
          </div>
        </>
      ) : null}

      <LiveRegion message={politeMessage} />
      <LiveRegion message={assertiveMessage} politeness="assertive" />
    </section>
  )
}
