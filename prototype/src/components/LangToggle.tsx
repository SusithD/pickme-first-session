import { useI18n } from '../i18n/I18nContext'
import { LANGS } from '../i18n/types'
import type { Lang } from '../i18n/types'
import { useRide } from '../state/RideContext'
import { IconCheck } from './icons'
import { RadioGroup } from './Radio'

interface LangToggleProps {
  size?: 'segmented' | 'large'
  labelKind?: 'short' | 'long'
}

export function LangToggle({ size = 'segmented', labelKind = 'short' }: LangToggleProps) {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const options = LANGS.map((lang) => ({
    value: lang.code,
    label: (
      <span className="lang-option">
        <span lang={lang.code}>{labelKind === 'short' ? lang.short : lang.long}</span>
        {size === 'large' ? <IconCheck size={22} className="lang-check" /> : null}
      </span>
    ),
  }))
  return (
    <RadioGroup<Lang>
      label={t('lang.label')}
      hideLabel
      orientation="horizontal"
      value={state.lang}
      options={options}
      onChange={(lang) => dispatch({ type: 'SET_LANG', lang })}
      className={`lang-toggle lang-toggle-${size}`}
    />
  )
}
