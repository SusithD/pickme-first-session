import type { ReactNode } from 'react'

interface IconProps {
  size?: number
  className?: string
}

function Svg({ size = 20, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  )
}

export function IconSearch(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </Svg>
  )
}

export function IconPin(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </Svg>
  )
}

export function IconTrain(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5.5" y="3.5" width="13" height="13" rx="3" />
      <path d="M5.5 11h13M9 20l-1.5 1.5M15 20l1.5 1.5M9 16.5V20M15 16.5V20" />
      <path d="M9 7.5h.01M15 7.5h.01" />
    </Svg>
  )
}

export function IconWave(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 9c2.2-2 4.3-2 6 0s3.8 2 6 0 3.3-1.6 6 0" />
      <path d="M3 14c2.2-2 4.3-2 6 0s3.8 2 6 0 3.3-1.6 6 0" />
      <path d="M3 19c2.2-2 4.3-2 6 0s3.8 2 6 0 3.3-1.6 6 0" />
    </Svg>
  )
}

export function IconPlus(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  )
}

export function IconChevronRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 5l7 7-7 7" />
    </Svg>
  )
}

export function IconChevronLeft(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M15 5l-7 7 7 7" />
    </Svg>
  )
}

export function IconLocate(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 4L4 10.5l6.5 2.5L13 19.5z" />
    </Svg>
  )
}

export function IconChevronDown(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  )
}

export function IconArrowUpRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 17L17 7M8.5 7H17v8.5" />
    </Svg>
  )
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Svg>
  )
}

export function IconLock(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <path d="M12 15v1.5" />
    </Svg>
  )
}

export function IconShield(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6z" />
      <path d="M9 12l2.2 2.2L15.5 10" />
    </Svg>
  )
}

export function IconCash(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="6.5" width="18" height="11" rx="2.5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6.5 12h.01M17.5 12h.01" />
    </Svg>
  )
}

export function IconCard(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M7 15h3" />
    </Svg>
  )
}

export function IconTuk(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 15V9.5C4 8.1 5.1 7 6.5 7h6c.8 0 1.5.4 1.9 1.1L16 11" />
      <path d="M4 11.5h12M9.5 7v4.5" />
      <path d="M16 11h3c1.1 0 2 .9 2 2v2" />
      <path d="M4 15h1.2M10.8 15h4.4M20.8 15H21" />
      <circle cx="8" cy="16" r="2.2" />
      <circle cx="18" cy="16" r="2.2" />
    </Svg>
  )
}

export function IconSmallCar(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 15v-3c0-.6.3-1.1.8-1.4L8 8.5 9.5 7h5c.5 0 1 .2 1.3.6L18.5 11l1.7.8c.5.3.8.8.8 1.4V15" />
      <path d="M8 8.5l.5 2.5H18M13 7.5V11" />
      <path d="M3.5 15h1.8M10 15h4M18.7 15H21" />
      <circle cx="7.5" cy="16" r="2.2" />
      <circle cx="16.5" cy="16" r="2.2" />
    </Svg>
  )
}

export function IconCar(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 15v-2.2c0-.6.4-1.1 1-1.3L7 10.5 9 7.5h5.5l3 3 2.8.8c.6.2 1 .7 1 1.3V15" />
      <path d="M9 7.5l-.5 3H17.5M13 7.5v3" />
      <path d="M2.5 15h2M10 15h4.4M19 15h2.8" />
      <circle cx="7" cy="16" r="2.2" />
      <circle cx="17" cy="16" r="2.2" />
    </Svg>
  )
}

export function IconPhone(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6.5 4h3l1.5 4-2 1.3a11 11 0 0 0 5.7 5.7L16 13l4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 4.5 6a2 2 0 0 1 2-2z" />
    </Svg>
  )
}

export function IconShare(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 15V4M8 8l4-4 4 4" />
      <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    </Svg>
  )
}

export function IconStar({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={props.size ?? 20}
      height={props.size ?? 20}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={props.className}
    >
      <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z" />
    </svg>
  )
}

export function IconAlert(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4l9 16H3z" />
      <path d="M12 10v4M12 17.2v.01" />
    </Svg>
  )
}

export function IconClock(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  )
}

export function IconRoute(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h5.5a3.5 3.5 0 0 0 0-7h-3a3.5 3.5 0 0 1 0-7H16" />
    </Svg>
  )
}

export function IconBell(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z" />
      <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
    </Svg>
  )
}

export function IconLife(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M6 6l3.8 3.8M18 6l-3.8 3.8M6 18l3.8-3.8M18 18l-3.8-3.8" />
    </Svg>
  )
}

export function IconQuote(props: IconProps) {
  return (
    <svg
      width={props.size ?? 32}
      height={props.size ?? 32}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={props.className}
    >
      <path d="M9.5 6C6 7 4 9.8 4 13.5V18h6v-6H7.2c.1-1.8 1-3 2.8-3.7zM20 6c-3.5 1-5.5 3.8-5.5 7.5V18h6v-6h-2.8c.1-1.8 1-3 2.8-3.7z" />
    </svg>
  )
}
