import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { LANGS } from '../i18n/types'
import type { Lang } from '../i18n/types'
import { useRide } from '../state/RideContext'
import type { MotionPreference, Scenario, Variant } from '../state/rideMachine'
import { Button } from './Button'
import { Select } from './Select'
import type { SelectOption } from './Select'
import { Sheet } from './Sheet'
import { VariantChip } from './VariantChip'

const SCENARIOS: readonly Scenario[] = [
  'normal',
  'noDriver',
  'driverCancel',
  'routeChange',
  'cashDemand',
]
const MOTION: readonly MotionPreference[] = ['system', 'reduce', 'allow']
const VARIANTS: readonly Variant[] = ['control', 'treatment']
const MOBILE_QUERY = '(max-width: 599px)'

export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches)
  useEffect(() => {
    const list = window.matchMedia(MOBILE_QUERY)
    const update = () => setMobile(list.matches)
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [])
  return mobile
}

function Controls() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const scenarioOptions: SelectOption<Scenario>[] = SCENARIOS.map((scenario) => ({
    value: scenario,
    label: t(`demo.scenario.${scenario}` as const),
  }))
  const langOptions: SelectOption<Lang>[] = LANGS.map((lang) => ({
    value: lang.code,
    label: lang.long,
  }))
  const motionOptions: SelectOption<MotionPreference>[] = MOTION.map((preference) => ({
    value: preference,
    label: t(`demo.motion.${preference}` as const),
  }))

  return (
    <form className="demo-form" onSubmit={(event) => event.preventDefault()}>
      <p className="demo-intro">{t('demo.intro')}</p>

      <fieldset className="demo-field">
        <legend className="field-label">{t('demo.variant')}</legend>
        <div className="segmented">
          {VARIANTS.map((variant) => (
            <label key={variant} className="segmented-option">
              <input
                type="radio"
                name="demo-variant"
                value={variant}
                checked={state.variant === variant}
                onChange={() => dispatch({ type: 'SET_VARIANT', variant })}
              />
              <span>
                {t(variant === 'control' ? 'demo.variant.control' : 'demo.variant.treatment')}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="switch-row">
        <span>{t('demo.peak')}</span>
        <input
          type="checkbox"
          className="switch"
          checked={state.peak}
          onChange={(event) => dispatch({ type: 'SET_PEAK', peak: event.target.checked })}
        />
      </label>

      <Select
        id="demo-scenario"
        label={t('demo.scenario')}
        value={state.scenario}
        options={scenarioOptions}
        onChange={(scenario) => dispatch({ type: 'SET_SCENARIO', scenario })}
      />

      <Select
        id="demo-language"
        label={t('demo.language')}
        value={state.lang}
        options={langOptions}
        onChange={(lang) => dispatch({ type: 'SET_LANG', lang })}
      />

      <Select
        id="demo-motion"
        label={t('demo.motion')}
        value={state.reducedMotion}
        options={motionOptions}
        onChange={(preference) => dispatch({ type: 'SET_REDUCED_MOTION', preference })}
      />

      <Button variant="secondary" block onClick={() => dispatch({ type: 'RESET' })}>
        {t('demo.restart')}
      </Button>
    </form>
  )
}

interface DemoControlsProps {
  mobile: boolean
  open: boolean
  onClose: () => void
}

export function DemoOpener({ onOpen }: { onOpen: () => void }) {
  const { t } = useI18n()
  return (
    <Button variant="secondary" className="demo-open" onClick={onOpen}>
      {t('demo.open')}
    </Button>
  )
}

export function DemoControls({ mobile, open, onClose }: DemoControlsProps) {
  const { t } = useI18n()

  if (mobile) {
    return (
      <Sheet open={open} onClose={onClose} title={t('demo.title')} container="viewport">
        <Controls />
      </Sheet>
    )
  }

  return (
    <aside className="demo-aside" aria-labelledby="demo-title">
      <div className="demo-head">
        <h2 id="demo-title" className="demo-title">
          {t('demo.title')}
        </h2>
        <VariantChip />
      </div>
      <Controls />
    </aside>
  )
}
