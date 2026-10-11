import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import type { SceneLocal } from '../app/scenes'

interface EmbedValue {
  embed: boolean
  local: SceneLocal
  quiet: () => boolean
}

const OFF: EmbedValue = { embed: false, local: {}, quiet: () => false }

const EmbedContext = createContext<EmbedValue>(OFF)

export function EmbedProvider({ local, children }: { local: SceneLocal; children: ReactNode }) {
  const touched = useRef(false)

  useEffect(() => {
    const mark = () => {
      touched.current = true
    }
    const events = ['pointerdown', 'keydown'] as const
    events.forEach((name) => document.addEventListener(name, mark, true))
    return () => events.forEach((name) => document.removeEventListener(name, mark, true))
  }, [])

  const value = useMemo<EmbedValue>(
    () => ({ embed: true, local, quiet: () => !touched.current }),
    [local],
  )
  return <EmbedContext.Provider value={value}>{children}</EmbedContext.Provider>
}

export function useEmbed(): EmbedValue {
  return useContext(EmbedContext)
}
