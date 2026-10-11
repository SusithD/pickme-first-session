import { LinkButton } from '../components/Button'
import { IconQuote } from '../components/icons'
import { useI18n } from '../i18n/I18nContext'
import type { StringKey } from '../i18n/types'
import { STEP_PATHS } from '../state/rideMachine'
import styles from './Problem.module.css'

interface Panel {
  situation: StringKey
  quote: StringKey
  source: StringKey
  tag: StringKey
}

const PANELS: readonly Panel[] = [
  {
    situation: 'problem.panel1.situation',
    quote: 'problem.panel1.quote',
    source: 'problem.panel1.source',
    tag: 'problem.panel1.tag',
  },
  {
    situation: 'problem.panel2.situation',
    quote: 'problem.panel2.quote',
    source: 'problem.panel2.source',
    tag: 'problem.panel2.tag',
  },
  {
    situation: 'problem.panel3.situation',
    quote: 'problem.panel3.quote',
    source: 'problem.panel3.source',
    tag: 'problem.panel3.tag',
  },
  {
    situation: 'problem.panel4.situation',
    quote: 'problem.panel4.quote',
    source: 'problem.panel4.source',
    tag: 'problem.panel4.tag',
  },
]

export default function Problem() {
  const { t } = useI18n()

  return (
    <section className={`screen ${styles.problem}`}>
      <h1>{t('problem.title')}</h1>
      <ul className={styles.cards}>
        {PANELS.map((panel) => (
          <li key={panel.quote} className={styles.card}>
            <h2 className={styles.situation}>{t(panel.situation)}</h2>
            <figure className={styles.figure}>
              <IconQuote size={32} className={styles.mark} />
              <blockquote className={styles.quote}>
                <p>{t(panel.quote)}</p>
              </blockquote>
              <figcaption className={styles.source}>{t(panel.source)}</figcaption>
            </figure>
            <p className={styles.tagRow}>
              <span className={styles.tagLabel}>{t('problem.tagLabel')}</span>
              <span className={styles.tag}>{t(panel.tag)}</span>
            </p>
          </li>
        ))}
      </ul>
      <p className={styles.footer}>{t('problem.footer')}</p>
      <LinkButton to={STEP_PATHS.welcome} block>
        {t('problem.cta')}
      </LinkButton>
    </section>
  )
}
