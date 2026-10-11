import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { IconCheck, IconChevronDown } from './icons'

export interface SelectOption<T extends string> {
  value: T
  label: string
  description?: string
}

interface SelectProps<T extends string> {
  id: string
  label: string
  value: T
  options: readonly SelectOption<T>[]
  onChange: (value: T) => void
}

interface MenuPosition {
  top: number
  left: number
  width: number
  maxHeight: number
  placement: 'below' | 'above'
}

const GAP = 6
const MARGIN = 8
const OPTION_HEIGHT = 44
const PAGE_STEP = 5
const TYPEAHEAD_MS = 500

function measure(trigger: HTMLElement, optionCount: number): MenuPosition {
  const rect = trigger.getBoundingClientRect()
  const wanted = optionCount * OPTION_HEIGHT + 12
  const below = window.innerHeight - rect.bottom - GAP - MARGIN
  const above = rect.top - GAP - MARGIN
  const placement = below >= wanted || below >= above ? 'below' : 'above'
  const room = Math.max(placement === 'below' ? below : above, OPTION_HEIGHT + 12)
  const height = Math.min(wanted, room)
  return {
    left: rect.left,
    width: rect.width,
    top: placement === 'below' ? rect.bottom + GAP : rect.top - GAP - height,
    maxHeight: room,
    placement,
  }
}

export function Select<T extends string>({ id, label, value, options, onChange }: SelectProps<T>) {
  const labelId = `${id}-label`
  const listboxId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const typed = useRef({ text: '', timer: 0 })
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [position, setPosition] = useState<MenuPosition | null>(null)

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  const selected = options[selectedIndex]
  const last = options.length - 1

  const show = useCallback(
    (index: number) => {
      setActive(index)
      setOpen(true)
    },
    [setActive, setOpen],
  )

  const close = useCallback(() => setOpen(false), [])

  const commit = useCallback(
    (index: number) => {
      const option = options[index]
      if (option && option.value !== value) onChange(option.value)
      setOpen(false)
    },
    [onChange, options, value],
  )

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    setPosition(measure(triggerRef.current, options.length))
  }, [open, options.length])

  useEffect(() => {
    if (!open) return
    const update = () => {
      if (triggerRef.current) setPosition(measure(triggerRef.current, options.length))
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open, options.length])

  useEffect(() => {
    const menu = menuRef.current
    if (!open || !menu) return
    const item = menu.children[active]
    if (!(item instanceof HTMLElement)) return
    if (item.offsetTop < menu.scrollTop) menu.scrollTop = item.offsetTop - 6
    else if (item.offsetTop + item.offsetHeight > menu.scrollTop + menu.clientHeight)
      menu.scrollTop = item.offsetTop + item.offsetHeight - menu.clientHeight + 6
  }, [open, active, position])

  useEffect(() => {
    const state = typed.current
    return () => window.clearTimeout(state.timer)
  }, [])

  function typeAhead(char: string, from: number): number {
    const state = typed.current
    window.clearTimeout(state.timer)
    state.text += char.toLowerCase()
    state.timer = window.setTimeout(() => {
      state.text = ''
    }, TYPEAHEAD_MS)
    const repeated = state.text.split('').every((c) => c === state.text[0])
    const needle = repeated ? (state.text[0] ?? '') : state.text
    const begin = repeated ? from + 1 : from
    for (let step = 0; step < options.length; step += 1) {
      const index = (begin + step) % options.length
      if (options[index]?.label.toLowerCase().startsWith(needle)) return index
    }
    return from
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const { key } = event
    if (event.ctrlKey || event.metaKey) return
    const printable = key.length === 1 && (key !== ' ' || typed.current.text !== '')

    if (!open) {
      if (
        key === 'Enter' ||
        key === ' ' ||
        key === 'ArrowDown' ||
        key === 'ArrowUp' ||
        key === 'Home' ||
        key === 'End'
      ) {
        event.preventDefault()
        show(key === 'Home' ? 0 : key === 'End' ? last : selectedIndex)
      } else if (printable) {
        event.preventDefault()
        show(typeAhead(key, selectedIndex))
      }
      return
    }

    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        setActive(Math.min(active + 1, last))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (event.altKey) commit(active)
        else setActive(Math.max(active - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        setActive(0)
        break
      case 'End':
        event.preventDefault()
        setActive(last)
        break
      case 'PageDown':
        event.preventDefault()
        setActive(Math.min(active + PAGE_STEP, last))
        break
      case 'PageUp':
        event.preventDefault()
        setActive(Math.max(active - PAGE_STEP, 0))
        break
      case 'Enter':
      case ' ':
        if (key === ' ' && printable) {
          event.preventDefault()
          setActive(typeAhead(key, active))
          break
        }
        event.preventDefault()
        commit(active)
        break
      case 'Escape':
        event.preventDefault()
        event.stopPropagation()
        close()
        break
      case 'Tab':
        commit(active)
        break
      default:
        if (printable) {
          event.preventDefault()
          setActive(typeAhead(key, active))
        }
    }
  }

  const menuStyle: CSSProperties | undefined = position
    ? {
        top: position.top,
        left: position.left,
        minWidth: position.width,
        maxHeight: position.maxHeight,
        transformOrigin: position.placement === 'below' ? 'top center' : 'bottom center',
      }
    : undefined

  return (
    <div className="select">
      <label id={labelId} htmlFor={id} className="field-label">
        {label}
      </label>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        className="select-trigger"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open ? `${listboxId}-${active}` : undefined}
        data-open={open || undefined}
        onClick={() => (open ? close() : show(selectedIndex))}
        onKeyDown={onKeyDown}
        onBlur={close}
      >
        <span className="select-value">{selected?.label}</span>
        <IconChevronDown size={18} className="select-chevron" />
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={labelId}
            tabIndex={-1}
            className="select-menu"
            data-placement={position?.placement}
            style={menuStyle}
            onMouseDown={(event) => event.preventDefault()}
          >
            {options.map((option, index) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <div
                key={option.value}
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={option.value === value}
                tabIndex={-1}
                className="select-option"
                data-active={index === active || undefined}
                onMouseMove={() => index !== active && setActive(index)}
                onClick={() => commit(index)}
              >
                <span className="select-option-text">
                  <span className="select-option-label">{option.label}</span>
                  {option.description && (
                    <span className="select-option-desc">{option.description}</span>
                  )}
                </span>
                {option.value === value && <IconCheck size={18} className="select-check" />}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  )
}
