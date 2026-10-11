import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, LinkButton } from '../components/Button'
import { LangToggle } from '../components/LangToggle'
import { LiveRegion } from '../components/LiveRegion'
import { useI18n } from '../i18n/I18nContext'
import { normalisePhone } from '../state/mock'
import { useRide } from '../state/RideContext'
import { STEP_PATHS, nextStep } from '../state/rideMachine'
import styles from './Welcome.module.css'

export default function Welcome() {
  const { state } = useRide()
  return state.variant === 'control' ? <ControlWelcome /> : <TreatmentWelcome />
}

function TreatmentWelcome() {
  const { t } = useI18n()
  const { state } = useRide()
  const next = nextStep({ ...state, step: 'welcome' })

  return (
    <section className={`screen ${styles.welcome}`}>
      <h1>{t('welcome.title.treatment')}</h1>
      <div className={styles.language}>
        <p className={styles.caption}>{t('welcome.langPrompt')}</p>
        <LangToggle size="large" labelKind="long" />
      </div>
      <LinkButton to={next ? STEP_PATHS[next] : STEP_PATHS.welcome} block>
        {t('welcome.cta.treatment')}
      </LinkButton>
      <p className={styles.note}>{t('welcome.note.treatment')}</p>
    </section>
  )
}

function ControlWelcome() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const navigate = useNavigate()
  const [phone, setPhone] = useState(state.phone ?? '')
  const [phoneError, setPhoneError] = useState<string | undefined>()
  const inputId = useId()
  const hintId = useId()
  const errorId = useId()
  const next = nextStep({ ...state, step: 'welcome' })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const digits = normalisePhone(phone)
    if (!digits) {
      setPhoneError(t('verify.phoneError'))
      return
    }
    setPhoneError(undefined)
    dispatch({ type: 'SET_PHONE', phone: digits })
    navigate(next ? STEP_PATHS[next] : STEP_PATHS.welcome)
  }

  return (
    <section className={`screen ${styles.welcome}`}>
      <h1>{t('welcome.title.control')}</h1>
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <div>
          <label className="field-label" htmlFor={inputId}>
            {t('welcome.phoneLabel.control')}
          </label>
          <div className={styles.phoneRow}>
            <span className={styles.prefix}>{t('verify.phonePrefix')}</span>
            <input
              id={inputId}
              className={`form-input ${styles.phoneInput} ${phoneError ? styles.invalid : ''}`}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={phone}
              aria-invalid={phoneError ? true : undefined}
              aria-describedby={phoneError ? `${hintId} ${errorId}` : hintId}
              onChange={(event) => setPhone(event.target.value.replace(/[^\d\s+]/g, ''))}
            />
          </div>
          <p id={hintId} className={styles.hint}>
            {t('welcome.phoneHint.control')}
          </p>
          {phoneError ? (
            <p id={errorId} className={styles.error}>
              {phoneError}
            </p>
          ) : null}
        </div>
        <Button type="submit" block>
          {t('welcome.cta.control')}
        </Button>
      </form>
      <LiveRegion message={phoneError ?? ''} politeness="assertive" />
      <LangToggle />
    </section>
  )
}
