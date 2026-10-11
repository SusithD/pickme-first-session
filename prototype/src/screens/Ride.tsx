import type { ReactNode } from 'react'
import { Button, LinkButton } from '../components/Button'
import {
  IconCar,
  IconCard,
  IconCash,
  IconChevronRight,
  IconLock,
  IconSmallCar,
  IconTuk,
} from '../components/icons'
import { MapScreen } from '../components/MapScreen'
import { RadioGroup } from '../components/Radio'
import type { RadioOption } from '../components/Radio'
import { useI18n } from '../i18n/I18nContext'
import type { StringKey } from '../i18n/types'
import { PEAK_PERCENT, RIDES, RIDE_TYPES, formatLkr } from '../state/mock'
import type { PaymentMethod, RideType } from '../state/mock'
import { useFocusReturn } from '../state/FocusReturn'
import { useRide, useVariant } from '../state/RideContext'
import { STEP_PATHS, bookedFare, fareFor } from '../state/rideMachine'
import styles from './Ride.module.css'

const RIDE_NAME_KEY: Record<RideType, StringKey> = {
  tuk: 'common.tuk',
  smallCar: 'common.smallCar',
  car: 'common.car',
}

const PAYMENT_KEY: Record<PaymentMethod, StringKey> = {
  cash: 'common.cash',
  card: 'common.card',
}

const RIDE_ICON: Record<RideType, ReactNode> = {
  tuk: <IconTuk size={26} />,
  smallCar: <IconSmallCar size={26} />,
  car: <IconCar size={26} />,
}

const FARE_TRIGGER_ID = 'fare-trigger'

const PAYMENT_METHODS: readonly PaymentMethod[] = ['cash', 'card']

export default function Ride() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const variant = useVariant()
  const treatment = variant === 'treatment'
  const focusReturn = useFocusReturn()

  const estimateLabel = t('ride.estimate', { amount: '' }).trim()

  const rideOptions: RadioOption<RideType>[] = RIDE_TYPES.map((id) => {
    const ride = RIDES[id]
    const rideFare = fareFor(id, state.peak, state.destination)
    const rideAmount = formatLkr(bookedFare(rideFare))
    return {
      value: id,
      label: (
        <>
          <span className={`vehicle-badge ${styles.badge}`}>{RIDE_ICON[id]}</span>
          <span className={styles.name}>{t(RIDE_NAME_KEY[id])}</span>
        </>
      ),
      description: (
        <>
          <span className={styles.eta}>
            {t('ride.etaSeats', { min: ride.etaMin, seats: ride.seats })}
          </span>
          <span className={styles.price}>
            {treatment ? null : <span className={styles.estimate}>{estimateLabel}</span>}
            <span className={styles.amount}>{rideAmount}</span>
          </span>
        </>
      ),
    }
  })

  const paymentOptions: RadioOption<PaymentMethod>[] = PAYMENT_METHODS.map((method) => ({
    value: method,
    label: (
      <span className={styles.payLabel}>
        {method === 'cash' ? <IconCash size={18} /> : <IconCard size={18} />}
        {t(PAYMENT_KEY[method])}
      </span>
    ),
  }))

  const rideName = t(RIDE_NAME_KEY[state.rideType])
  const amount = formatLkr(bookedFare(state.fare))
  const cta = treatment
    ? t('ride.cta', { ride: rideName, amount })
    : t('ride.ctaControl', { ride: rideName, amount })

  const callout = state.destination
    ? t('trip.routeBar', { place: state.destination.name, min: state.destination.tripMinutes })
    : undefined

  return (
    <MapScreen
      mode="route"
      callout={callout}
      sheetTop="34%"
      footer={
        <Button block onClick={() => dispatch({ type: 'BOOK' })}>
          {cta}
        </Button>
      }
    >
      <h1>{t('ride.title')}</h1>

      {treatment ? (
        <div className={styles.promise}>
          <span className={styles.lock}>
            <IconLock size={14} />
          </span>
          <p className={styles.promiseText}>
            <span className={styles.fareLabel}>{t('ride.fixedFare')}</span>
            {state.peak ? (
              <span className="footnote">{t('ride.peakIncluded', { percent: PEAK_PERCENT })}</span>
            ) : null}
          </p>
          <LinkButton
            to={STEP_PATHS.fare}
            variant="ghost"
            className={styles.promiseLink}
            id={FARE_TRIGGER_ID}
            onClick={() => focusReturn.set(FARE_TRIGGER_ID)}
            aria-label={t('ride.whatChanges')}
          >
            {t('ride.details')}
            <IconChevronRight size={14} />
          </LinkButton>
        </div>
      ) : null}

      <RadioGroup
        label={t('ride.rideGroup')}
        hideLabel
        value={state.rideType}
        options={rideOptions}
        onChange={(rideType) => dispatch({ type: 'CHOOSE_RIDE', rideType })}
        optionClassName={styles.rideOption}
        className={styles.rides}
      />
      {treatment ? (
        <p className="footnote">
          {t('common.smallCar')}: {t('ride.vehicleMayVary')}
        </p>
      ) : null}

      <RadioGroup
        label={t('ride.paymentGroup')}
        value={state.payment}
        options={paymentOptions}
        onChange={(payment) => dispatch({ type: 'SET_PAYMENT', payment })}
        orientation="horizontal"
        className={`lang-toggle ${styles.payment}`}
      />
      <p className="footnote">{t('ride.paymentHelper')}</p>
    </MapScreen>
  )
}
