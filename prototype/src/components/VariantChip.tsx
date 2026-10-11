import { useI18n } from '../i18n/I18nContext'
import { useVariant } from '../state/RideContext'

export function VariantChip() {
  const { t } = useI18n()
  const variant = useVariant()
  const label = t(variant === 'control' ? 'frame.variant.control' : 'frame.variant.treatment')
  return (
    <span
      className={`chip chip-${variant}`}
      aria-label={t('frame.variantLabel', { variant: label })}
    >
      {label}
    </span>
  )
}
