import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useRide } from '../state/RideContext'
import { en } from './strings/en'
import { si } from './strings/si'
import { ta } from './strings/ta'
import type { Lang, StringKey, Translations, Vars } from './types'

const dictionaries: Record<Lang, Translations> = { en, si, ta }
const UNTRACKED_PREFIXES = ['demo.', 'frame.', 'banner.', 'lang.']

interface I18nValue {
  lang: Lang
  t: (key: StringKey, vars?: Vars) => string
  hasFallback: boolean
}

const I18nContext = createContext<I18nValue | null>(null)

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = vars[name]
    return value === undefined ? match : String(value)
  })
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const {
    state: { lang, step },
  } = useRide()
  const [hasFallback, setHasFallback] = useState(false)
  const scopeKey = `${lang}:${step}`
  const scopeRef = useRef(scopeKey)
  const missingRef = useRef(new Set<string>())

  if (scopeRef.current !== scopeKey) {
    scopeRef.current = scopeKey
    missingRef.current = new Set()
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (key: StringKey, vars?: Vars) => {
      const translated = lang === 'en' ? undefined : dictionaries[lang][key]
      if (translated !== undefined) return interpolate(translated, vars)
      if (lang !== 'en' && !UNTRACKED_PREFIXES.some((prefix) => key.startsWith(prefix))) {
        const missing = missingRef.current
        if (!missing.has(key)) {
          missing.add(key)
          queueMicrotask(() => setHasFallback(true))
        }
      }
      return interpolate(en[key], vars)
    },
    [lang],
  )

  useEffect(() => {
    if (missingRef.current.size === 0) setHasFallback(false)
  }, [scopeKey])

  const value = useMemo(() => ({ lang, t, hasFallback }), [lang, t, hasFallback])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}

export function useHasFallback(): boolean {
  return useI18n().hasFallback
}
