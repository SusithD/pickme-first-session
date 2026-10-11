import { useState } from 'react'
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

export function ShareTripButton({ label, block }: { label: string; block?: boolean }) {
  const { t } = useI18n()
  const [status, setStatus] = useState('')

  async function share() {
    setStatus('')
    await copyText(DEMO_TRIP_LINK)
    setStatus(t('trip.shared'))
  }

  return (
    <>
      <Button variant="secondary" block={block} onClick={() => void share()}>
        {label}
      </Button>
      <LiveRegion message={status} visuallyHidden={false} className="muted" />
    </>
  )
}
