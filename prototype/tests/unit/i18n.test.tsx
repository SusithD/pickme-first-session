import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { I18nProvider, useHasFallback, useI18n } from '../../src/i18n/I18nContext'
import { RideProvider } from '../../src/state/RideContext'
import type { RideState } from '../../src/state/rideMachine'

function Probe() {
  const { t } = useI18n()
  const fallback = useHasFallback()
  return (
    <div>
      <p>{t('ride.cta', { ride: 'Tuk', amount: 'LKR 540' })}</p>
      <p data-testid="fallback">{String(fallback)}</p>
    </div>
  )
}

function renderWith(initialState: Partial<RideState>) {
  return render(
    <RideProvider initialState={initialState}>
      <I18nProvider>
        <Probe />
      </I18nProvider>
    </RideProvider>,
  )
}

describe('I18nProvider', () => {
  it('interpolates variables in English and sets html lang', () => {
    renderWith({ lang: 'en' })
    expect(screen.getByText('Book Tuk · LKR 540')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en')
    expect(screen.getByTestId('fallback')).toHaveTextContent('false')
  })

  it('falls back to English and flags it for empty Sinhala', async () => {
    renderWith({ lang: 'si' })
    expect(screen.getByText('Book Tuk · LKR 540')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('si')
    await waitFor(() => expect(screen.getByTestId('fallback')).toHaveTextContent('true'))
  })
})
