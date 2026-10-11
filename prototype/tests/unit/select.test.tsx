import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Select } from '../../src/components/Select'
import type { SelectOption } from '../../src/components/Select'

type Fruit = 'apple' | 'apricot' | 'banana' | 'cherry'

const OPTIONS: SelectOption<Fruit>[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot', description: 'Small and orange' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

function Harness({ onChange }: { onChange?: (value: Fruit) => void }) {
  const [value, setValue] = useState<Fruit>('apple')
  return (
    <div>
      <button type="button">outside</button>
      <Select
        id="fruit"
        label="Fruit"
        value={value}
        options={OPTIONS}
        onChange={(next) => {
          setValue(next)
          onChange?.(next)
        }}
      />
    </div>
  )
}

function trigger() {
  return screen.getByRole('combobox', { name: 'Fruit' })
}

describe('Select', () => {
  it('exposes combobox semantics and the selected label', () => {
    render(<Harness />)
    const box = trigger()
    expect(box).toHaveTextContent('Apple')
    expect(box).toHaveAttribute('aria-haspopup', 'listbox')
    expect(box).toHaveAttribute('aria-expanded', 'false')
    expect(box).not.toHaveAttribute('aria-controls')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it.each(['{Enter}', ' ', '{ArrowDown}', '{ArrowUp}', '{Alt>}{ArrowDown}{/Alt}'])(
    'opens with %j',
    async (keys) => {
      const user = userEvent.setup()
      render(<Harness />)
      trigger().focus()
      await user.keyboard(keys)
      expect(trigger()).toHaveAttribute('aria-expanded', 'true')
      const list = screen.getByRole('listbox')
      expect(trigger()).toHaveAttribute('aria-controls', list.id)
      expect(screen.getAllByRole('option')).toHaveLength(4)
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'true')
      expect(trigger()).toHaveFocus()
    },
  )

  it('moves the active option with arrows, Home, End and pages', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    trigger().focus()
    await user.keyboard('{Enter}')
    const active = () => trigger().getAttribute('aria-activedescendant')
    const idOf = (name: string) => screen.getByRole('option', { name: new RegExp(`^${name}`) }).id
    expect(active()).toBe(idOf('Apple'))
    await user.keyboard('{ArrowDown}')
    expect(active()).toBe(idOf('Apricot'))
    await user.keyboard('{End}')
    expect(active()).toBe(idOf('Cherry'))
    await user.keyboard('{ArrowDown}')
    expect(active()).toBe(idOf('Cherry'))
    await user.keyboard('{Home}')
    expect(active()).toBe(idOf('Apple'))
    await user.keyboard('{PageDown}')
    expect(active()).toBe(idOf('Cherry'))
    await user.keyboard('{PageUp}')
    expect(active()).toBe(idOf('Apple'))
    expect(trigger()).toHaveFocus()
  })

  it('jumps by type-ahead and cycles repeated letters', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    trigger().focus()
    await user.keyboard('{Enter}')
    const idOf = (name: string) => screen.getByRole('option', { name: new RegExp(`^${name}`) }).id
    await user.keyboard('c')
    expect(trigger().getAttribute('aria-activedescendant')).toBe(idOf('Cherry'))
    await user.keyboard('{Home}')
    await new Promise((resolve) => setTimeout(resolve, 600))
    await user.keyboard('a')
    expect(trigger().getAttribute('aria-activedescendant')).toBe(idOf('Apricot'))
  })

  it('opens on typing from the closed state', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    trigger().focus()
    await user.keyboard('b')
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    expect(trigger().getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: 'Banana' }).id,
    )
  })

  it('selects with Enter, closes, and keeps focus on the trigger', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Harness onChange={onChange} />)
    trigger().focus()
    await user.keyboard('{Enter}{ArrowDown}{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledWith('banana')
    expect(trigger()).toHaveTextContent('Banana')
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(trigger()).toHaveFocus()
  })

  it('selects with Space', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Harness onChange={onChange} />)
    trigger().focus()
    await user.keyboard(' {ArrowDown} ')
    expect(onChange).toHaveBeenCalledWith('apricot')
  })

  it('cancels with Escape without changing the value', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Harness onChange={onChange} />)
    trigger().focus()
    await user.keyboard('{Enter}{ArrowDown}{Escape}')
    expect(onChange).not.toHaveBeenCalled()
    expect(trigger()).toHaveTextContent('Apple')
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(trigger()).toHaveFocus()
  })

  it('selects the active option on Tab and closes', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Harness onChange={onChange} />)
    trigger().focus()
    await user.keyboard('{Enter}{End}{Tab}')
    expect(onChange).toHaveBeenCalledWith('cherry')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('selects on click and renders secondary text', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Harness onChange={onChange} />)
    await user.click(trigger())
    expect(screen.getByText('Small and orange')).toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: /Cherry/ }))
    expect(onChange).toHaveBeenCalledWith('cherry')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes on outside click and toggles on trigger click', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(trigger())
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'outside' }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    await user.click(trigger())
    await user.click(trigger())
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('focuses the trigger when the label is clicked', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByText('Fruit'))
    expect(trigger()).toHaveFocus()
  })
})
