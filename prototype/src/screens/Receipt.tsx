import { useState } from 'react'
import { LinkButton } from '../components/Button'
import { Notice } from '../components/Notice'
import { RadioGroup } from '../components/Radio'
import { useI18n } from '../i18n/I18nContext'
import { formatLkr } from '../state/mock'
import { useRide, useVariant } from '../state/RideContext'
import { STEP_PATHS, bookedFare, fareTotal, flaggedAmount } from '../state/rideMachine'
import type { FareChange } from '../state/rideMachine'
import styles from './Receipt.module.css'

const RATINGS = ['1', '2', '3', '4', '5']

export default function Receipt() {
  const { t } = useI18n()
  const { state } = useRide()
  const variant = useVariant()
  const [rating, setRating] = useState('')
  const { fare, payment } = state
  const treatment = variant === 'treatment'

  const booked = bookedFare(fare)
  const flagged = flaggedAmount(fare)
  const total = fareTotal(fare)
  const payable = total - flagged

  let headline: string
  if (!treatment) {
    headline = t('receipt.total.control', { amount: formatLkr(total) })
  } else if (payable === booked) {
    headline = t('receipt.asBooked', { amount: formatLkr(booked) })
  } else {
    headline = t('receipt.changed', {
      amount: formatLkr(payable),
      delta: formatLkr(payable - booked),
    })
  }

  const shownChanges: FareChange[] = treatment
    ? fare.changes.filter((change) => change.status === 'accepted' || change.status === 'askLater')
    : []

  function changeLabel(change: FareChange): string {
    if (change.kind === 'wait') return t('receipt.lineWait')
    if (change.kind === 'stop') return t('receipt.lineStop')
    return change.status === 'askLater' ? t('receipt.lineRouteFlagged') : t('receipt.lineRoute')
  }

  const ratingOptions = RATINGS.map((value) => ({
    value,
    label: (
      <>
        <span aria-hidden="true">{value}</span>
        <span className="visually-hidden">{t('receipt.rating', { n: value })}</span>
      </>
    ),
  }))

  return (
    <section className="screen">
      <h1>{t('receipt.title')}</h1>

      <div className={styles.summary}>
        <p className={styles.amount}>{headline}</p>
        {shownChanges.length > 0 ? (
          <div className={styles.changes}>
            <h2 className={styles.heading}>{t('receipt.changesHeading')}</h2>
            <dl className={styles.lines}>
              {shownChanges.map((change) => (
                <div key={change.id} className={styles.line}>
                  <dt>{changeLabel(change)}</dt>
                  <dd>+{formatLkr(change.amount)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>

      {treatment && flagged > 0 ? (
        <Notice tone="warn">{t('receipt.flagged', { amount: formatLkr(flagged) })}</Notice>
      ) : null}

      <p className={styles.payment}>
        {payment === 'card' ? t('receipt.payCard') : t('receipt.payCash')}
      </p>

      <RadioGroup
        label={t('receipt.rateLabel')}
        value={rating}
        options={ratingOptions}
        onChange={setRating}
        orientation="horizontal"
        className={styles.rating}
        optionClassName={styles.star}
      />

      <LinkButton variant="secondary" block to={STEP_PATHS.help}>
        {t('receipt.notRight')}
      </LinkButton>
    </section>
  )
}
