import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'
import { STEP_PATHS } from '../state/rideMachine'
import { IconChevronLeft } from './icons'

export function BackButton() {
  const { t } = useI18n()
  const navigate = useNavigate()
  return (
    <button
      type="button"
      className="float-btn"
      aria-label={t('common.back')}
      onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(STEP_PATHS.intro))}
    >
      <IconChevronLeft size={22} />
    </button>
  )
}
