import { useState } from 'react'
import type { ReactNode } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { DEMO_TRIP_LINK } from '../state/mock'
import { Button } from './Button'
import { LiveRegion } from './LiveRegion'

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard?.writeText(text)
  } catch {
    return
  }
}

interface ShareTripButtonProps {
  label: string
  block?: boolean
  icon?: ReactNode
  className?: string
}

export function ShareTripButton({ label, block, icon, className }: ShareTripButtonProps) {
  const { t } = useI18n()
  const [status, setStatus] = useState('')

  async function share() {
    setStatus('')
    await copyText(DEMO_TRIP_LINK)
    setStatus(t('trip.shared'))
  }

  return (
    <div className="share">
      <Button variant="secondary" block={block} className={className} onClick={() => void share()}>
        {icon}
        {label}
      </Button>
      <LiveRegion message={status} visuallyHidden={false} className="muted share-status" />
    </div>
  )
}
