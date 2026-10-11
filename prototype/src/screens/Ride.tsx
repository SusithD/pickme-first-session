import { Button, LinkButton } from '../components/Button'
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

const FARE_TRIGGER_ID = 'fare-trigger'

const PAYMENT_METHODS: readonly PaymentMethod[] = ['cash', 'card']

export default function Ride() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const variant = useVariant()
  const treatment = variant === 'treatment'
  const focusReturn = useFocusReturn()

  const rideOptions: RadioOption<RideType>[] = RIDE_TYPES.map((id) => {
    const ride = RIDES[id]
    const rideFare = fareFor(id, state.peak, state.destination)
    const rideAmount = formatLkr(bookedFare(rideFare))
    const price = treatment ? rideAmount : t('ride.estimate', { amount: rideAmount })
    return {
      value: id,
      label: t(RIDE_NAME_KEY[id]),
      description: (
        <span className={styles.option}>
          <span className={styles.optionPrice}>{price}</span>
          <span>{t('ride.eta', { min: ride.etaMin })}</span>
          {treatment && id === 'smallCar' ? <span>{t('ride.vehicleMayVary')}</span> : null}
        </span>
      ),
    }
  })

  const paymentOptions: RadioOption<PaymentMethod>[] = PAYMENT_METHODS.map((method) => ({
    value: method,
    label: t(PAYMENT_KEY[method]),
  }))

  const rideName = t(RIDE_NAME_KEY[state.rideType])
  const amount = formatLkr(bookedFare(state.fare))
  const cta = treatment
    ? t('ride.cta', { ride: rideName, amount })
    : t('ride.ctaControl', { ride: rideName, amount })

  return (
    <section className={styles.screen}>
      <h1>{t('ride.title')}</h1>

      <RadioGroup
        label={t('ride.rideGroup')}
        value={state.rideType}
        options={rideOptions}
        onChange={(rideType) => dispatch({ type: 'CHOOSE_RIDE', rideType })}
        optionClassName={styles.rideOption}
      />

      {treatment ? (
        <div className={styles.fareNote}>
          <p className={styles.fareLabel}>{t('ride.fixedFare')}</p>
          {state.peak ? (
            <p className={styles.peak}>{t('ride.peakIncluded', { percent: PEAK_PERCENT })}</p>
          ) : null}
          <LinkButton
            to={STEP_PATHS.fare}
            variant="ghost"
            id={FARE_TRIGGER_ID}
            onClick={() => focusReturn.set(FARE_TRIGGER_ID)}
          >
            {t('ride.whatChanges')}
          </LinkButton>
        </div>
      ) : null}

      <RadioGroup
        label={t('ride.paymentGroup')}
        value={state.payment}
        options={paymentOptions}
        onChange={(payment) => dispatch({ type: 'SET_PAYMENT', payment })}
        orientation="horizontal"
        optionClassName={styles.paymentOption}
      />
      <p className="muted">{t('ride.paymentHelper')}</p>

      <Button block onClick={() => dispatch({ type: 'BOOK' })}>
        {cta}
      </Button>
    </section>
  )
}
