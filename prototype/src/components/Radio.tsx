import { useId, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

export interface RadioOption<T extends string> {
  value: T
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}

interface RadioGroupProps<T extends string> {
  label: string
  value: T
  options: readonly RadioOption<T>[]
  onChange: (value: T) => void
  hideLabel?: boolean
  orientation?: 'vertical' | 'horizontal'
  className?: string
  optionClassName?: string
}

export function RadioGroup<T extends string>({
  label,
  value,
  options,
  onChange,
  hideLabel,
  orientation = 'vertical',
  className,
  optionClassName,
}: RadioGroupProps<T>) {
  const labelId = useId()
  const refs = useRef(new Map<T, HTMLButtonElement>())
  const enabled = options.filter((option) => !option.disabled)

  function move(from: T, delta: number) {
    const index = enabled.findIndex((option) => option.value === from)
    const target = enabled[(index + delta + enabled.length) % enabled.length]
    if (!target) return
    onChange(target.value)
    refs.current.get(target.value)?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, current: T) {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        move(current, 1)
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        move(current, -1)
        break
      case 'Home':
        event.preventDefault()
        if (enabled[0]) move(enabled[0].value, 0)
        break
      case 'End':
        event.preventDefault()
        if (enabled.length) move(enabled[enabled.length - 1]!.value, 0)
        break
    }
  }

  const hasSelectedEnabled = enabled.some((option) => option.value === value)

  return (
    <div className={className}>
      <div id={labelId} className={hideLabel ? 'visually-hidden' : 'field-label'}>
        {label}
      </div>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className={`radio-group radio-group-${orientation}`}
      >
        {options.map((option, index) => {
          const checked = option.value === value
          const focusable = checked || (!hasSelectedEnabled && index === 0)
          return (
            <button
              key={option.value}
              ref={(node) => {
                if (node) refs.current.set(option.value, node)
                else refs.current.delete(option.value)
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              disabled={option.disabled}
              tabIndex={focusable ? 0 : -1}
              className={['radio', checked ? 'radio-checked' : '', optionClassName ?? '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => onChange(option.value)}
              onKeyDown={(event) => handleKeyDown(event, option.value)}
            >
              <span className="radio-label">{option.label}</span>
              {option.description ? (
                <span className="radio-description">{option.description}</span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
