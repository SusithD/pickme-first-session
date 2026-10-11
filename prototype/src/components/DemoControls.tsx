import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { LANGS } from '../i18n/types'
import type { Lang } from '../i18n/types'
import { useRide } from '../state/RideContext'
import type { MotionPreference, Scenario, Variant } from '../state/rideMachine'
import { Button } from './Button'
import { Sheet } from './Sheet'

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

function useIsMobile(): boolean {
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

  return (
    <form className="demo-form" onSubmit={(event) => event.preventDefault()}>
      <p className="demo-intro">{t('demo.intro')}</p>

      <fieldset className="demo-field">
        <legend>{t('demo.variant')}</legend>
        {VARIANTS.map((variant) => (
          <label key={variant} className="demo-choice">
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
      </fieldset>

      <label className="demo-choice">
        <input
          type="checkbox"
          checked={state.peak}
          onChange={(event) => dispatch({ type: 'SET_PEAK', peak: event.target.checked })}
        />
        <span>{t('demo.peak')}</span>
      </label>

      <label className="demo-field">
        <span className="field-label">{t('demo.scenario')}</span>
        <select
          className="form-input"
          value={state.scenario}
          onChange={(event) =>
            dispatch({ type: 'SET_SCENARIO', scenario: event.target.value as Scenario })
          }
        >
          {SCENARIOS.map((scenario) => (
            <option key={scenario} value={scenario}>
              {t(`demo.scenario.${scenario}` as const)}
            </option>
          ))}
        </select>
      </label>

      <label className="demo-field">
        <span className="field-label">{t('demo.language')}</span>
        <select
          className="form-input"
          value={state.lang}
          onChange={(event) => dispatch({ type: 'SET_LANG', lang: event.target.value as Lang })}
        >
          {LANGS.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.long}
            </option>
          ))}
        </select>
      </label>

      <label className="demo-field">
        <span className="field-label">{t('demo.motion')}</span>
        <select
          className="form-input"
          value={state.reducedMotion}
          onChange={(event) =>
            dispatch({
              type: 'SET_REDUCED_MOTION',
              preference: event.target.value as MotionPreference,
            })
          }
        >
          {MOTION.map((preference) => (
            <option key={preference} value={preference}>
              {t(`demo.motion.${preference}` as const)}
            </option>
          ))}
        </select>
      </label>

      <Button variant="secondary" block onClick={() => dispatch({ type: 'RESET' })}>
        {t('demo.restart')}
      </Button>
    </form>
  )
}

export function DemoControls() {
  const { t } = useI18n()
  const mobile = useIsMobile()
  const [open, setOpen] = useState(false)

  if (mobile) {
    return (
      <>
        <Button variant="secondary" className="demo-open" onClick={() => setOpen(true)}>
          {t('demo.open')}
        </Button>
        <Sheet
          open={open}
          onClose={() => setOpen(false)}
          title={t('demo.title')}
          container="viewport"
        >
          <Controls />
        </Sheet>
      </>
    )
  }

  return (
    <aside className="demo-aside" aria-labelledby="demo-title">
      <h2 id="demo-title" className="demo-title">
        {t('demo.title')}
      </h2>
      <Controls />
    </aside>
  )
}
