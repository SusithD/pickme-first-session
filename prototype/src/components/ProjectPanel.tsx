import { useI18n } from '../i18n/I18nContext'
import { IconArrowUpRight } from './icons'

const CASE_STUDY_URL = 'https://susith.theqexle.site/work/pickme-first-session'
const REPO_URL = 'https://github.com/SusithD/pickme-first-session'

export function ProjectPanel() {
  const { t } = useI18n()
  return (
    <section className="project" aria-labelledby="project-title">
      <p className="project-eyebrow">{t('demo.project.eyebrow')}</p>
      <h2 id="project-title" className="project-title">
        {t('demo.project.title')}
      </h2>
      <p className="project-pitch">{t('demo.project.pitch')}</p>

      <div className="project-try">
        <h3 className="project-try-title">{t('demo.project.tryHeading')}</h3>
        <ol className="project-steps">
          <li>{t('demo.project.step1')}</li>
          <li>{t('demo.project.step2')}</li>
          <li>{t('demo.project.step3')}</li>
        </ol>
      </div>

      <p className="project-links">
        <a className="project-link" href={CASE_STUDY_URL} target="_blank" rel="noreferrer">
          {t('demo.project.caseStudy')}
          <span className="visually-hidden"> {t('demo.project.newTab')}</span>
          <IconArrowUpRight size={16} />
        </a>
        <a className="project-link" href={REPO_URL} target="_blank" rel="noreferrer">
          {t('demo.project.repo')}
          <span className="visually-hidden"> {t('demo.project.newTab')}</span>
          <IconArrowUpRight size={16} />
        </a>
      </p>
    </section>
  )
}
