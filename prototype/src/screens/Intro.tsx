import { Brand } from '../components/Brand'
import { LangToggle } from '../components/LangToggle'
import { LinkButton } from '../components/Button'
import { useI18n } from '../i18n/I18nContext'
import { STEP_PATHS } from '../state/rideMachine'
import styles from './Intro.module.css'

function CoverArt() {
  return (
    <svg
      className={styles.art}
      viewBox="0 0 342 110"
      preserveAspectRatio="xMaxYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.artCasing} d="M16 96H96V56H200V24H318" />
      <path className={styles.artRoute} d="M16 96H96V56H200V24H318" />
      <circle className={styles.artStart} cx="16" cy="96" r="9" />
      <circle className={styles.artEnd} cx="318" cy="24" r="9" />
    </svg>
  )
}

export default function Intro() {
  const { t } = useI18n()

  return (
    <section className={`screen ${styles.intro}`}>
      <div className={styles.cover}>
        <Brand />
        <CoverArt />
        <h1 className={`large-title ${styles.title}`}>{t('intro.title')}</h1>
        <p className={styles.note}>{t('intro.note')}</p>
      </div>
      <div className={styles.body}>
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
      </div>
    </section>
  )
}
