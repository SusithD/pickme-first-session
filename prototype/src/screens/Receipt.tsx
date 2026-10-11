import { Button, LinkButton } from '../components/Button'
import {
  IconAlert,
  IconCard,
  IconCash,
  IconCheck,
  IconReceipt,
  IconStar,
} from '../components/icons'
import { Notice } from '../components/Notice'
import { RadioGroup } from '../components/Radio'
import { useI18n } from '../i18n/I18nContext'
import { formatLkr } from '../state/mock'
import { useRide, useVariant } from '../state/RideContext'
import { STEP_PATHS, bookedFare, fareTotal, flaggedAmount } from '../state/rideMachine'
import type { FareChange, Rating } from '../state/rideMachine'
import styles from './Receipt.module.css'

const RATINGS = ['1', '2', '3', '4', '5']

function toRating(value: string): Rating {
  return Number(value) as Rating
}

export default function Receipt() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const variant = useVariant()
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
        <IconStar
          size={32}
          filled={Number(value) <= (state.rating ?? 0)}
          className={Number(value) <= (state.rating ?? 0) ? styles.on : undefined}
        />
        <span className="visually-hidden">{t('receipt.rating', { n: value })}</span>
      </>
    ),
  }))

  const asBooked = payable === booked

  return (
    <section className={`screen screen-cta ${styles.receipt}`}>
      <span className={`${styles.seal} ${treatment && asBooked ? styles.sealOk : ''}`}>
        {treatment && asBooked ? <IconCheck size={30} /> : <IconReceipt size={28} />}
      </span>
      <h1 className={styles.title}>{t('receipt.title')}</h1>

      <div className={styles.summary}>
        {treatment ? (
          <p className={styles.amount}>
            <span aria-hidden="true">{formatLkr(payable)}</span>
            <span className="visually-hidden">{headline}</span>
          </p>
        ) : (
          <p className={styles.amount}>{headline}</p>
        )}
        {treatment ? (
          <p className={`${styles.pill} ${asBooked ? styles.pillOk : styles.pillWarn}`}>
            {asBooked ? <IconCheck size={16} /> : <IconAlert size={16} />}
            {asBooked
              ? t('receipt.pill.asBooked')
              : t('receipt.pill.explained', { amount: formatLkr(payable - booked) })}
          </p>
        ) : null}
      </div>

      {shownChanges.length > 0 ? (
        <dl className={styles.lines}>
          <div className={styles.line}>
            <dt className="ellipsis">{t('receipt.bookedFare')}</dt>
            <dd>{formatLkr(booked)}</dd>
          </div>
          {shownChanges.map((change) => (
            <div key={change.id} className={styles.line}>
              <dt className="ellipsis">{changeLabel(change)}</dt>
              <dd>+{formatLkr(change.amount)}</dd>
            </div>
          ))}
          <div className={`${styles.line} ${styles.total}`}>
            <dt>{t('fare.total')}</dt>
            <dd>{formatLkr(payable)}</dd>
          </div>
        </dl>
      ) : null}

      {treatment && flagged > 0 ? (
        <Notice tone="warn">{t('receipt.flagged', { amount: formatLkr(flagged) })}</Notice>
      ) : null}

      <p className={styles.payment}>
        <span className="icon-badge">
          {payment === 'card' ? <IconCard size={20} /> : <IconCash size={20} />}
        </span>
        <span>{payment === 'card' ? t('receipt.payCard') : t('receipt.payCash')}</span>
      </p>

      <RadioGroup
        label={t('receipt.rateLabel')}
        value={state.rating ? String(state.rating) : ''}
        options={ratingOptions}
        onChange={(value) => dispatch({ type: 'RATE_TRIP', rating: toRating(value) })}
        orientation="horizontal"
        className={styles.rating}
        optionClassName={styles.star}
      />

      <div className="page-cta">
        <LinkButton variant="ghost" block className={styles.quiet} to={STEP_PATHS.help}>
          {t('receipt.notRight')}
        </LinkButton>
        <Button block onClick={() => dispatch({ type: 'RESET' })}>
          {t('receipt.done')}
        </Button>
      </div>
    </section>
  )
}
