import { LinkButton } from '../components/Button'
import { IconPin } from '../components/icons'
import { useI18n } from '../i18n/I18nContext'
import { useRide } from '../state/RideContext'
import { STEP_PATHS, nextStep } from '../state/rideMachine'
import styles from './Location.module.css'

export default function Location() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const control = state.variant === 'control'
  const next = nextStep({ ...state, step: 'location' })
  const to = next ? STEP_PATHS[next] : STEP_PATHS.location

  return (
    <section className={`screen ${styles.location}`}>
      <span className={styles.badge}>
        <IconPin size={44} />
      </span>
      <h1 className="large-title">
        {t(control ? 'location.title.control' : 'location.title.treatment')}
      </h1>
      <p className={styles.body}>
        {t(control ? 'location.body.control' : 'location.body.treatment')}
      </p>
      <div className={styles.actions}>
        <LinkButton
          to={to}
          block
          onClick={() => dispatch({ type: 'SET_LOCATION_PERMISSION', value: 'allowed' })}
        >
          {t(control ? 'location.allow.control' : 'location.allow.treatment')}
        </LinkButton>
        <LinkButton
          to={to}
          block
          variant="secondary"
          onClick={() => dispatch({ type: 'SET_LOCATION_PERMISSION', value: 'typed' })}
        >
          {t(control ? 'location.type.control' : 'location.type.treatment')}
        </LinkButton>
      </div>
      <p className={styles.mock}>{t('location.mockNote')}</p>
    </section>
  )
}
