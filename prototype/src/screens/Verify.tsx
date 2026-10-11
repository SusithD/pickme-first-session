import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/Button'
import { Brand } from '../components/Brand'
import { IconCheck } from '../components/icons'
import { LiveRegion } from '../components/LiveRegion'
import { Notice } from '../components/Notice'
import { useI18n } from '../i18n/I18nContext'
import { useRide } from '../state/RideContext'
import { DEMO_OTP, OTP_RESEND_SECONDS, formatLkr, normalisePhone } from '../state/mock'
import { fareTotal } from '../state/rideMachine'
import styles from './Verify.module.css'

type Stage = 'phone' | 'code' | 'done'

const CODE_PATTERN = /^\d{6}$/

export default function Verify() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const control = state.variant === 'control'

  const [stage, setStage] = useState<Stage>('phone')
  const [phone, setPhone] = useState(state.phone ?? '')
  const [sentTo, setSentTo] = useState('')
  const [phoneError, setPhoneError] = useState<string | undefined>()
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string | undefined>()
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_SECONDS)
  const [notice, setNotice] = useState('')

  const phoneInputRef = useRef<HTMLInputElement>(null)
  const codeInputRef = useRef<HTMLInputElement>(null)
  const lastStage = useRef(stage)

  const phoneId = useId()
  const phoneHintId = useId()
  const phoneErrorId = useId()
  const codeId = useId()
  const codeErrorId = useId()

  const waiting = stage === 'code' && secondsLeft > 0

  useEffect(() => {
    if (lastStage.current === stage) return
    lastStage.current = stage
    if (stage === 'phone') phoneInputRef.current?.focus()
    if (stage === 'code') codeInputRef.current?.focus()
  }, [stage])

  useEffect(() => {
    if (!waiting) return
    const id = window.setInterval(() => setSecondsLeft((seconds) => Math.max(0, seconds - 1)), 1000)
    return () => window.clearInterval(id)
  }, [waiting])

  function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const digits = normalisePhone(phone)
    if (!digits) {
      setPhoneError(t('verify.phoneError'))
      return
    }
    setPhoneError(undefined)
    dispatch({ type: 'SET_PHONE', phone: digits })
    setSentTo(digits)
    setCode('')
    setCodeError(undefined)
    setNotice('')
    setSecondsLeft(OTP_RESEND_SECONDS)
    setStage('code')
  }

  function confirmCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!CODE_PATTERN.test(code) || code !== DEMO_OTP) {
      setCodeError(t('verify.codeError'))
      return
    }
    setCodeError(undefined)
    setStage('done')
  }

  function resendCode() {
    setCode('')
    setCodeError(undefined)
    setNotice(t('verify.resent'))
    setSecondsLeft(OTP_RESEND_SECONDS)
  }

  function changeNumber() {
    setCode('')
    setCodeError(undefined)
    setNotice('')
    setStage('phone')
  }

  return (
    <section className={`screen ${styles.verify}`}>
      <Brand />
      <h1 className="large-title">{t('verify.title')}</h1>

      {stage === 'phone' ? (
        <>
          <p className={styles.body}>{t('verify.noPassword')}</p>
          <form className={styles.form} noValidate onSubmit={sendCode}>
            <div>
              <label className="field-label" htmlFor={phoneId}>
                {t('verify.phoneLabel')}
              </label>
              <div className={'phone-row'}>
                <span className={'phone-prefix'}>{t('verify.phonePrefix')}</span>
                <input
                  ref={phoneInputRef}
                  id={phoneId}
                  className={`phone-input ${phoneError ? styles.invalid : ''}`}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  value={phone}
                  aria-invalid={phoneError ? true : undefined}
                  aria-describedby={phoneError ? `${phoneHintId} ${phoneErrorId}` : phoneHintId}
                  onChange={(event) => setPhone(event.target.value.replace(/[^\d\s+]/g, ''))}
                />
              </div>
              <p id={phoneHintId} className={styles.hint}>
                {t('verify.phoneHint')}
              </p>
              <p className="demo-note">{t('verify.demoOnly')}</p>
              {phoneError ? (
                <p id={phoneErrorId} className={styles.error}>
                  {phoneError}
                </p>
              ) : null}
            </div>
            <Button type="submit" block>
              {t('verify.sendCode')}
            </Button>
          </form>
        </>
      ) : null}

      {stage === 'code' ? (
        <>
          <p className={styles.body}>
            {t('verify.codeHint', { phone: `${t('verify.phonePrefix')} ${sentTo}` })}
          </p>
          <p className={styles.demo}>{t('verify.demoCode', { code: DEMO_OTP })}</p>
          <p className="demo-note">{t('verify.demoOnly')}</p>
          <form className={styles.form} noValidate onSubmit={confirmCode}>
            <div>
              <label className="field-label" htmlFor={codeId}>
                {t('verify.codeLabel')}
              </label>
              <input
                ref={codeInputRef}
                id={codeId}
                className={`form-input ${styles.codeInput} ${codeError ? styles.invalid : ''}`}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                aria-invalid={codeError ? true : undefined}
                aria-describedby={codeError ? codeErrorId : undefined}
                onChange={(event) => {
                  setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                  setCodeError(undefined)
                }}
              />
              {codeError ? (
                <p id={codeErrorId} className={styles.error}>
                  {codeError}
                </p>
              ) : null}
            </div>
            <Button type="submit" block>
              {t('verify.confirm')}
            </Button>
          </form>
          <div className={styles.resend}>
            {waiting ? (
              <p>{t('verify.resendWait', { seconds: secondsLeft })}</p>
            ) : (
              <Button variant="secondary" onClick={resendCode}>
                {t('verify.resend')}
              </Button>
            )}
            <Button variant="ghost" onClick={changeNumber}>
              {t('verify.wrongNumber')}
            </Button>
          </div>
        </>
      ) : null}

      {stage === 'done' ? (
        <div className={styles.success}>
          <span className={styles.check}>
            <IconCheck size={36} />
          </span>
          <Notice tone="ok" live="polite">
            {t('verify.success')}
          </Notice>
          {control ? null : (
            <p>{t('verify.fareKept', { amount: formatLkr(fareTotal(state.fare)) })}</p>
          )}
          <Button block onClick={() => dispatch({ type: 'SIGN_IN' })}>
            {t('verify.continue')}
          </Button>
        </div>
      ) : null}

      <LiveRegion message={phoneError ?? codeError ?? ''} politeness="assertive" />
      <LiveRegion message={notice} />
    </section>
  )
}
