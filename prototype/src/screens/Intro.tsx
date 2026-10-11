import { LangToggle } from '../components/LangToggle'
import { LinkButton } from '../components/Button'
import { useI18n } from '../i18n/I18nContext'
import { STEP_PATHS } from '../state/rideMachine'
import styles from './Intro.module.css'

export default function Intro() {
  const { t } = useI18n()

  return (
    <section className={`screen ${styles.intro}`}>
      <h1>{t('intro.title')}</h1>
      <p className={styles.note}>{t('intro.note')}</p>
      <div className={styles.language}>
        <p className={styles.caption}>{t('intro.langLabel')}</p>
        <LangToggle />
      </div>
      <div className={styles.actions}>
        <LinkButton to={STEP_PATHS.welcome} block>
          {t('intro.start')}
        </LinkButton>
        <LinkButton to={STEP_PATHS.problem} variant="secondary" block>
          {t('intro.problem')}
        </LinkButton>
      </div>
      <p className={styles.review}>{t('intro.reviewNote')}</p>
    </section>
  )
}
