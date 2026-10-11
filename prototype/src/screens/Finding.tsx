import { useEffect, useRef, useState } from 'react'
import { Button, LinkButton } from '../components/Button'
import { ShareTripButton } from '../components/ShareTripButton'
import { LiveRegion } from '../components/LiveRegion'
import { IconBell, IconCheck, IconPhone, IconShare, IconStar } from '../components/icons'
import { MapScreen } from '../components/MapScreen'
import { Notice } from '../components/Notice'
import { useI18n } from '../i18n/I18nContext'
import { useEmbed } from '../state/EmbedContext'
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
  const { embed } = useEmbed()
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
    if (finding !== 'cancelled' || embed) return
    const timer = window.setTimeout(() => dispatch({ type: 'FIND_AGAIN' }), MATCH_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [finding, embed, dispatch])

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
  const agreedMethod = driver
    ? t(driver.agreedPayment === 'cash' ? 'common.cash' : 'common.card')
    : ''

  return (
    <MapScreen
      mode={
        finding === 'searching' || finding === 'cancelled'
          ? 'searching'
          : finding === 'matched'
            ? 'matched'
            : 'pickup'
      }
      back={false}
      sheetTop={finding === 'matched' ? '28%' : undefined}
      footer={
        finding === 'matched' && driver ? (
          <LinkButton block to={STEP_PATHS.trip}>
            {t('finding.continue')}
          </LinkButton>
        ) : undefined
      }
    >
      <h1>{t(finding === 'matched' ? 'finding.title.matched' : 'finding.title')}</h1>

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
              <p className={`muted ${styles.elapsed}`}>
                {t('finding.elapsed', { seconds: elapsed })}
              </p>
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
          <div className={styles.driver}>
            <h2 className={styles.heading}>{t('finding.matched')}</h2>
            <div className={styles.driverTop}>
              <span className={styles.avatar} aria-hidden="true">
                {driver.name.slice(0, 1)}
              </span>
              <div className={styles.driverId}>
                <p className={styles.driverName}>{driver.name}</p>
                <p className={styles.rating}>
                  <IconStar size={16} filled />
                  <span>{t('finding.rating', { rating: driver.rating })}</span>
                </p>
              </div>
              <p className={styles.eta}>{t('finding.eta', { min: driver.etaMin })}</p>
            </div>
            <div className={styles.vehicleRow}>
              <span className={styles.vehicle}>{driver.vehicle}</span>
              <span className={styles.plateWrap}>
                <span className="visually-hidden">
                  {t('finding.plate', { plate: driver.plate })}
                </span>
                <span className={styles.sample} aria-hidden="true">
                  {t('finding.sample')}
                </span>
                <span className={styles.plate} aria-hidden="true">
                  {driver.plate}
                </span>
              </span>
            </div>
            {pickupNote ? (
              <p className={styles.note}>{t('finding.note', { note: pickupNote })}</p>
            ) : null}
            <p className={styles.badge}>
              <IconCheck size={18} />
              {t('finding.agreed', { method: agreedMethod })}
            </p>
          </div>
          <div className={styles.tiles}>
            <Button variant="secondary" className="action-circle" disabled>
              <span className="circle">
                <IconPhone size={20} />
              </span>
              {t('finding.call')}
            </Button>
            <ShareTripButton
              className="action-circle"
              icon={
                <span className="circle">
                  <IconShare size={20} />
                </span>
              }
              label={t('finding.share')}
            />
          </div>
          {scenario === 'cashDemand' && variant === 'treatment' ? (
            <Notice tone="warn">{t('finding.cashLocked', { method: agreedMethod })}</Notice>
          ) : null}
          {showPrimer ? (
            <Notice tone="info">
              <p className={styles.primerText}>
                <IconBell size={20} />
                <span>{t('finding.notifTitle')}</span>
              </p>
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
    </MapScreen>
  )
}
