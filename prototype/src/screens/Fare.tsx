import { Button } from '../components/Button'
import { Sheet } from '../components/Sheet'
import { useI18n } from '../i18n/I18nContext'
import { DISTANCE_KM, formatLkr } from '../state/mock'
import { useRide } from '../state/RideContext'
import { bookedFare, fareTotal } from '../state/rideMachine'
import styles from './Fare.module.css'

export default function Fare() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const treatment = state.variant === 'treatment'
  const total = fareTotal(state.fare)
  const changes = total - bookedFare(state.fare)

  const close = () => dispatch({ type: 'GOTO', step: 'ride' })

  return (
    <Sheet open title={t('fare.title')} onClose={close}>
      {treatment ? (
        <div className={styles.body}>
          <dl className={styles.breakdown}>
            <div className={styles.line}>
              <dt>{t('fare.base')}</dt>
              <dd>{formatLkr(state.fare.base)}</dd>
            </div>
            <div className={styles.line}>
              <dt>{t('fare.distance', { km: DISTANCE_KM })}</dt>
              <dd>{formatLkr(state.fare.distance)}</dd>
            </div>
            {state.peak ? (
              <div className={styles.line}>
                <dt>{t('fare.peak')}</dt>
                <dd>{formatLkr(state.fare.peak)}</dd>
              </div>
            ) : null}
            {changes !== 0 ? (
              <div className={styles.line}>
                <dt>{t('fare.lineChanges')}</dt>
                <dd>{formatLkr(changes)}</dd>
              </div>
            ) : null}
            <div className={styles.total}>
              <dt>{t('fare.total')}</dt>
              <dd>{formatLkr(total)}</dd>
            </div>
          </dl>

          <div className={styles.changes}>
            <h3 className={styles.heading}>{t('fare.changeHeading')}</h3>
            <ul className={styles.list}>
              <li>{t('fare.change.wait')}</li>
              <li>{t('fare.change.route')}</li>
              <li>{t('fare.change.stop')}</li>
            </ul>
          </div>

          <p className={styles.promise}>{t('fare.promise')}</p>

          <Button block onClick={close}>
            {t('fare.close')}
          </Button>
        </div>
      ) : (
        <p>{t('fare.control.body')}</p>
      )}
    </Sheet>
  )
}
