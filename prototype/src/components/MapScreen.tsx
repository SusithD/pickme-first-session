import type { ReactNode } from 'react'
import { BackButton } from './BackButton'
import { CityMap } from './CityMap'
import type { MapMode } from './CityMap'
import { IconLocate } from './icons'

interface MapScreenProps {
  mode: MapMode
  callout?: string
  back?: boolean
  children: ReactNode
  sheetTop?: string
  footer?: ReactNode
}

export function MapScreen({
  mode,
  callout,
  back = true,
  children,
  sheetTop,
  footer,
}: MapScreenProps) {
  return (
    <div
      className="mapscreen"
      style={sheetTop ? { ['--sheet-top' as string]: sheetTop } : undefined}
    >
      <div className="mapscreen-map">
        <CityMap mode={mode} callout={callout} />
      </div>
      {back ? <BackButton /> : null}
      <span className="float-btn float-locate" aria-hidden="true">
        <IconLocate size={20} />
      </span>
      <div className="mapscreen-sheet">
        <span className="grab" aria-hidden="true" />
        {children}
        {footer ? <div className="sheet-cta">{footer}</div> : <span className="sheet-tail" />}
      </div>
    </div>
  )
}
