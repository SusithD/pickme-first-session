import { Button } from '../components/Button'
import { IconClock, IconPin, IconRoute, IconShield } from '../components/icons'
import { Sheet } from '../components/Sheet'
import { useI18n } from '../i18n/I18nContext'
import { PEAK_PERCENT, WAIT_FEE_PER_MIN, WAIT_FREE_MINUTES, formatLkr } from '../state/mock'
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
    <Sheet open title={t('fare.title')} onClose={close} headingLevel="h1">
      {treatment ? (
        <div className={styles.body}>
          <dl className={styles.breakdown}>
            <div className={styles.line}>
              <dt>{t('fare.base')}</dt>
              <dd>{formatLkr(state.fare.base)}</dd>
            </div>
            <div className={styles.line}>
              <dt>{t('fare.distance', { km: state.fare.distanceKm })}</dt>
              <dd>{formatLkr(state.fare.distance)}</dd>
            </div>
            {state.peak ? (
              <div className={styles.line}>
                <dt>{t('fare.peak', { percent: PEAK_PERCENT })}</dt>
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
            <h2 className={styles.heading}>{t('fare.changeHeading')}</h2>
            <ul className={styles.list}>
              <li>
                <span className="icon-badge">
                  <IconClock size={20} />
                </span>
                <span>
                  {t('fare.change.wait', {
                    minutes: WAIT_FREE_MINUTES,
                    amount: formatLkr(WAIT_FEE_PER_MIN),
                  })}
                </span>
              </li>
              <li>
                <span className="icon-badge">
                  <IconRoute size={20} />
                </span>
                <span>{t('fare.change.route')}</span>
              </li>
              <li>
                <span className="icon-badge">
                  <IconPin size={20} />
                </span>
                <span>{t('fare.change.stop')}</span>
              </li>
            </ul>
          </div>

          <p className={styles.promise}>
            <IconShield size={22} />
            <span>{t('fare.promise')}</span>
          </p>

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
