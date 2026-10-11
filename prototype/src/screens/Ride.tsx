import { Button, LinkButton } from '../components/Button'
import { RadioGroup } from '../components/Radio'
import type { RadioOption } from '../components/Radio'
import { useI18n } from '../i18n/I18nContext'
import type { StringKey } from '../i18n/types'
import { RIDES, RIDE_TYPES, formatLkr } from '../state/mock'
import type { PaymentMethod, RideType } from '../state/mock'
import { useRide, useVariant } from '../state/RideContext'
import { STEP_PATHS, bookedFare, fareFor } from '../state/rideMachine'
import styles from './Ride.module.css'

const RIDE_NAME_KEY: Record<RideType, StringKey> = {
  tuk: 'common.tuk',
  flex: 'common.flex',
  car: 'common.car',
}

const PAYMENT_KEY: Record<PaymentMethod, StringKey> = {
  cash: 'common.cash',
  card: 'common.card',
}

const PAYMENT_METHODS: readonly PaymentMethod[] = ['cash', 'card']

export default function Ride() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const variant = useVariant()
  const treatment = variant === 'treatment'
  const selectedFare = bookedFare(state.fare)

  const rideOptions: RadioOption<RideType>[] = RIDE_TYPES.map((id) => {
    const ride = RIDES[id]
    const price = treatment
      ? formatLkr(bookedFare(fareFor(id, state.peak)))
      : t('ride.estimateRange', {
          low: ride.estimateLow.toLocaleString('en-US'),
          high: ride.estimateHigh.toLocaleString('en-US'),
        })
    return {
      value: id,
      label: t(RIDE_NAME_KEY[id]),
      description: (
        <span className={styles.option}>
          <span className={styles.optionPrice}>{price}</span>
          <span>{t('ride.eta', { min: ride.etaMin })}</span>
        </span>
      ),
    }
  })

  const paymentOptions: RadioOption<PaymentMethod>[] = PAYMENT_METHODS.map((method) => ({
    value: method,
    label: t(PAYMENT_KEY[method]),
  }))

  const rideName = t(RIDE_NAME_KEY[state.rideType])
  const amount = formatLkr(selectedFare)

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
          {state.peak ? <p className={styles.peak}>{t('ride.peakIncluded')}</p> : null}
          <LinkButton to={STEP_PATHS.fare} variant="ghost">
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
        {t('ride.cta', { ride: rideName, amount })}
      </Button>
    </section>
  )
}
