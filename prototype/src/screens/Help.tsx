import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/Button'
import { IconCheck } from '../components/icons'
import { RadioGroup } from '../components/Radio'
import type { RadioOption } from '../components/Radio'
import { useI18n } from '../i18n/I18nContext'
import { formatLkr } from '../state/mock'
import { useRide } from '../state/RideContext'
import { flaggedAmount } from '../state/rideMachine'
import type { HelpReason } from '../state/rideMachine'
import styles from './Help.module.css'

type ReasonValue = HelpReason | ''

export default function Help() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const [reason, setReason] = useState<ReasonValue>(state.helpReason ?? '')
  const submitted = state.ticket !== undefined
  const flagged = flaggedAmount(state.fare)
  const reasons: readonly RadioOption<ReasonValue>[] = [
    { value: 'fareHigher', label: t('help.reason.fareHigher') },
    { value: 'cashOnCard', label: t('help.reason.cashOnCard') },
    { value: 'offApp', label: t('help.reason.offApp') },
    { value: 'noTrip', label: t('help.reason.noTrip') },
  ]

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (reason === '') return
    dispatch({ type: 'OPEN_TICKET', reason })
  }

  return (
    <section className="screen screen-cta">
      <h1 className="large-title">{t('help.title')}</h1>

      {submitted ? null : (
        <form className={styles.form} onSubmit={submit}>
          <RadioGroup<ReasonValue>
            label={t('help.reasonsLabel')}
            value={reason}
            options={reasons}
            onChange={setReason}
            list
          />
          {reason === '' ? <p className={styles.hint}>{t('help.pickReason')}</p> : null}
          <div className="page-cta">
            <Button type="submit" block disabled={reason === ''}>
              {t('help.submit')}
            </Button>
          </div>
        </form>
      )}

      <div role="status" aria-live="polite" className={submitted ? styles.confirmation : undefined}>
        {submitted ? (
          <>
            <span className={styles.check}>
              <IconCheck size={30} />
            </span>
            <span className={styles.mono} aria-hidden="true">
              #{state.ticket}
            </span>
            <p className={styles.ticket}>{t('help.ticket', { ticket: state.ticket ?? '' })}</p>
            {flagged > 0 ? (
              <p className={styles.hold}>{t('help.hold', { amount: formatLkr(flagged) })}</p>
            ) : null}
          </>
        ) : null}
      </div>

      {submitted ? (
        <div className="page-cta">
          <Button variant="secondary" block onClick={() => dispatch({ type: 'RESET' })}>
            {t('help.backToStart')}
          </Button>
        </div>
      ) : null}
    </section>
  )
}
