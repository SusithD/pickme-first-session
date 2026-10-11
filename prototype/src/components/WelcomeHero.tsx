import { Brand } from './Brand'

export function WelcomeHero({ compact }: { compact?: boolean }) {
  return (
    <div className={compact ? 'hero-top hero-compact' : 'hero-top'}>
      <div className="hero-brand">
        <Brand />
      </div>
      <svg
        className="hero-art"
        viewBox="0 0 390 300"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        focusable="false"
      >
        <circle className="hero-sun" cx="318" cy="96" r="30" />
        <g className="hero-far">
          <rect x="14" y="196" width="40" height="92" />
          <rect x="62" y="164" width="34" height="124" />
          <rect x="104" y="206" width="48" height="82" />
          <rect x="246" y="186" width="44" height="102" />
          <rect x="298" y="154" width="34" height="134" />
          <rect x="340" y="204" width="50" height="84" />
        </g>
        <g className="hero-near">
          <rect x="158" y="150" width="20" height="138" />
          <rect x="182" y="164" width="18" height="124" />
          <rect x="204" y="126" width="6" height="162" />
          <ellipse cx="207" cy="132" rx="15" ry="22" />
          <rect x="206" y="84" width="2" height="26" />
          <rect x="198" y="168" width="18" height="4" />
          <path d="M120 288v-48a18 18 0 0 1 36 0v48z" />
        </g>
        <rect className="hero-road" x="0" y="286" width="390" height="14" />
        <g className="hero-tuk">
          <path d="M232 268V254C232 234 250 220 276 220C296 220 308 228 314 242L324 266z" />
          <path
            className="hero-window"
            d="M244 262V248C244 240 252 234 264 234H288C296 234 301 238 304 246L310 262z"
          />
          <rect x="252" y="246" width="10" height="16" rx="4" />
          <path d="M232 262H330C338 262 344 267 344 274V281H232z" />
          <path className="hero-line" d="M326 262L334 284M318 236H334" />
          <circle cx="258" cy="280" r="12" />
          <circle cx="334" cy="285" r="7" />
          <circle className="hero-window" cx="258" cy="280" r="4.5" />
          <circle className="hero-window" cx="334" cy="285" r="2.5" />
        </g>
      </svg>
    </div>
  )
}
