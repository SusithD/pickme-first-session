import { useI18n } from '../i18n/I18nContext'
import { useRide } from '../state/RideContext'
import { STEP_PATHS, nextStep } from '../state/rideMachine'
import type { Step } from '../state/rideMachine'
import { Button, LinkButton } from './Button'

export function PlaceholderScreen({ step, title }: { step: Step; title: string }) {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const next = nextStep({ ...state, step })

  return (
    <section className="screen">
      <h1>{title}</h1>
      <p className="muted">{t('common.placeholderNote')}</p>
      {next ? (
        <LinkButton
          to={STEP_PATHS[next]}
          onClick={step === 'verify' ? () => dispatch({ type: 'SIGN_IN' }) : undefined}
        >
          {t('common.next')}
        </LinkButton>
      ) : (
        <Button onClick={() => dispatch({ type: 'RESET' })}>{t('help.backToStart')}</Button>
      )}
    </section>
  )
}
