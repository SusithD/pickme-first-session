import { TukShapes } from './icons'

export type MapMode = 'pickup' | 'route' | 'searching' | 'matched' | 'trip' | 'arrived'

const ROUTE = 'M118 248 C160 248 188 242 206 222 C224 202 226 180 250 166 C270 154 292 144 318 140'
const MATCHED_PICKUP = { x: 118, y: 208 }
const DRIVER_ROUTE = 'M252 150 C232 176 190 202 118 208'
const PICKUP = { x: 118, y: 248 }
const DEST = { x: 318, y: 140 }
const DRIVER = { x: 252, y: 142 }

function Callout({ text }: { text: string }) {
  const width = Math.round(text.length * 6.9 + 28)
  const right = DEST.x + 14
  return (
    <g className="citymap-callout">
      <rect x={right - width} y={DEST.y - 46} width={width} height="26" rx="13" />
      <text x={right - width / 2} y={DEST.y - 29} textAnchor="middle">
        {text}
      </text>
    </g>
  )
}

export function CityMap({ mode, callout }: { mode: MapMode; callout?: string }) {
  const pickup = mode === 'matched' ? MATCHED_PICKUP : PICKUP
  const showRoute = mode === 'route' || mode === 'trip' || mode === 'arrived'
  return (
    <svg
      className="citymap"
      viewBox="0 0 390 500"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden="true"
      focusable="false"
    >
      <rect className="citymap-land" width="390" height="500" />
      <rect className="citymap-park" x="130" y="334" width="60" height="44" rx="14" />
      <rect className="citymap-park" x="272" y="386" width="80" height="50" rx="14" />
      <rect className="citymap-park" x="338" y="224" width="40" height="64" rx="14" />
      <rect className="citymap-park" x="340" y="60" width="36" height="56" rx="14" />
      <rect className="citymap-park" x="112" y="118" width="54" height="40" rx="14" />

      <g className="citymap-minor">
        <path d="M84 120C180 110 280 126 384 100" />
        <path d="M84 220C150 212 210 226 384 212" />
        <path d="M60 60C140 70 200 60 384 40" />
        <path d="M150 380C160 440 150 470 156 500" />
        <path d="M280 400C330 410 360 420 384 410" />
      </g>
      <g className="citymap-major">
        <path d="M72 0C84 90 70 200 90 300S98 430 104 500" />
        <path d="M84 360C170 350 260 360 384 330" />
        <path d="M250 0C246 80 252 140 250 190C248 260 262 360 258 500" />
        <path d="M338 0C330 120 340 300 330 500" />
        <path d="M70 252C94 250 100 248 118 248" />
        {showRoute ? <path d={ROUTE} /> : null}
      </g>
      <path className="citymap-rail" d="M96 0C108 90 92 200 112 300S120 430 128 500" />
      <path className="citymap-rail-ties" d="M96 0C108 90 92 200 112 300S120 430 128 500" />
      <path
        className="citymap-sea"
        d="M0 0H50C60 60 36 120 54 190S44 300 60 380S50 460 58 500H0Z"
      />

      {mode === 'matched' ? (
        <>
          <path className="citymap-route-casing citymap-route-casing-thin" d={DRIVER_ROUTE} />
          <path className="citymap-route citymap-route-thin" d={DRIVER_ROUTE} />
          <g transform={`translate(${DRIVER.x} ${DRIVER.y})`}>
            <circle className="citymap-driver" r="14" />
            <g
              className="citymap-driver-glyph"
              transform="translate(-9 -9) scale(0.75)"
              strokeWidth="2"
            >
              <TukShapes />
            </g>
          </g>
        </>
      ) : null}

      {showRoute ? (
        <>
          <path className="citymap-route-casing" d={ROUTE} />
          <path className="citymap-route" d={ROUTE} />
          <g transform={`translate(${DEST.x} ${DEST.y})`}>
            <rect className="citymap-dest-ring" x="-9" y="-9" width="18" height="18" rx="5" />
            <rect className="citymap-dest" x="-6" y="-6" width="12" height="12" rx="3" />
          </g>
          {callout ? <Callout text={callout} /> : null}
        </>
      ) : null}

      <g transform={`translate(${pickup.x} ${pickup.y})`}>
        {mode === 'searching' ? (
          <g className="citymap-radar">
            <circle className="citymap-ring citymap-ring-1" r="30" />
            <circle className="citymap-ring citymap-ring-2" r="56" />
            <circle className="citymap-ring citymap-ring-3" r="84" />
          </g>
        ) : (
          <circle className="citymap-halo" r="22" />
        )}
        <circle className="citymap-pickup-ring" r="10" />
        <circle className="citymap-pickup" r="7" />
      </g>

      {mode === 'arrived' ? (
        <g transform={`translate(${DEST.x} ${DEST.y})`}>
          <circle className="citymap-driver" r="14" />
          <g
            className="citymap-driver-glyph"
            transform="translate(-9 -9) scale(0.75)"
            strokeWidth="2"
          >
            <TukShapes />
          </g>
        </g>
      ) : null}

      {mode === 'trip' ? (
        <circle
          className={`citymap-vehicle citymap-vehicle-${mode}`}
          r="6"
          style={{ offsetPath: `path("${ROUTE}")` }}
        />
      ) : null}
    </svg>
  )
}
