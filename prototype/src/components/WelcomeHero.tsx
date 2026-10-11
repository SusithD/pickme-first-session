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
          <path d="M236 280v-18c0-16 12-26 30-26h20c8 0 14 4 17 11l7 15h12c5 0 8 3 8 8v10z" />
          <rect className="hero-window" x="246" y="246" width="38" height="16" rx="7" />
          <circle cx="258" cy="288" r="11" />
          <circle cx="326" cy="289" r="9" />
          <circle className="hero-window" cx="258" cy="288" r="4" />
          <circle className="hero-window" cx="326" cy="289" r="3.5" />
        </g>
      </svg>
    </div>
  )
}
