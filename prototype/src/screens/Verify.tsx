import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/Button'
import { Brand } from '../components/Brand'
import { IconCheck, IconInfo } from '../components/icons'
import { LiveRegion } from '../components/LiveRegion'
import { Notice } from '../components/Notice'
import { useI18n } from '../i18n/I18nContext'
import { useEmbed } from '../state/EmbedContext'
import { useRide } from '../state/RideContext'
import { DEMO_OTP, OTP_RESEND_SECONDS, formatLkr, normalisePhone } from '../state/mock'
import { fareTotal } from '../state/rideMachine'
import styles from './Verify.module.css'

type Stage = 'phone' | 'code' | 'done'

const CODE_PATTERN = /^\d{6}$/

export default function Verify() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const { local } = useEmbed()
  const control = state.variant === 'control'

  const [stage, setStage] = useState<Stage>(local.verifyStage ?? 'phone')
  const [phone, setPhone] = useState(state.phone ?? '')
  const [sentTo, setSentTo] = useState(local.verifyStage ? (state.phone ?? '') : '')
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

  const slots = Array.from({ length: 6 }, (_, index) => code[index] ?? '')

  return (
    <section className={`screen screen-cta ${styles.verify}`}>
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
              <div className="phone-row">
                <span className="phone-prefix">{t('verify.phonePrefix')}</span>
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
              {phoneError ? (
                <p id={phoneErrorId} className={styles.error}>
                  {phoneError}
                </p>
              ) : null}
            </div>
            <p className="callout">
              <IconInfo size={18} />
              <span>{t('verify.demoOnly')}</span>
            </p>
            <div className="page-cta">
              <Button type="submit" block>
                {t('verify.sendCode')}
              </Button>
            </div>
          </form>
        </>
      ) : null}

      {stage === 'code' ? (
        <>
          <p className={styles.body}>
            {t('verify.codeHint', { phone: `${t('verify.phonePrefix')} ${sentTo}` })}
          </p>
          <form className={styles.form} noValidate onSubmit={confirmCode}>
            <div>
              <label className="field-label" htmlFor={codeId}>
                {t('verify.codeLabel')}
              </label>
              <div className={styles.slots}>
                <input
                  ref={codeInputRef}
                  id={codeId}
                  className={styles.codeInput}
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
                {slots.map((digit, index) => (
                  <span
                    key={index}
                    aria-hidden="true"
                    className={`${styles.slot} ${index === code.length ? styles.slotActive : ''}`}
                  >
                    {digit}
                  </span>
                ))}
              </div>
              {codeError ? (
                <p id={codeErrorId} className={styles.error}>
                  {codeError}
                </p>
              ) : null}
            </div>
            <p className="callout">
              <IconInfo size={18} />
              <span className={`callout-text ${styles.calloutText}`}>
                <span className="callout-strong">{t('verify.demoOnly')}</span>
                <span>{t('verify.demoCode', { code: DEMO_OTP })}</span>
              </span>
            </p>
            <div className={styles.resend}>
              {waiting ? (
                <p>{t('verify.resendWait', { seconds: secondsLeft })}</p>
              ) : (
                <Button variant="ghost" className={styles.textButton} onClick={resendCode}>
                  {t('verify.resend')}
                </Button>
              )}
              <Button variant="ghost" className={styles.textButton} onClick={changeNumber}>
                {t('verify.wrongNumber')}
              </Button>
            </div>
            <div className="page-cta">
              <Button type="submit" block>
                {t('verify.confirm')}
              </Button>
            </div>
          </form>
        </>
      ) : null}

      {stage === 'done' ? (
        <>
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
          </div>
          <div className="page-cta">
            <Button block onClick={() => dispatch({ type: 'SIGN_IN' })}>
              {t('verify.continue')}
            </Button>
          </div>
        </>
      ) : null}

      <LiveRegion message={phoneError ?? codeError ?? ''} politeness="assertive" />
      <LiveRegion message={notice} />
    </section>
  )
}
