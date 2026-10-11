import { describe, expect, it } from 'vitest'
import { en } from '../../src/i18n/strings/en'
import { si } from '../../src/i18n/strings/si'
import { ta } from '../../src/i18n/strings/ta'

const TRANSLATED = [
  'welcome',
  'location',
  'where',
  'ride',
  'fare',
  'verify',
  'finding',
  'trip',
  'arrived',
  'receipt',
  'help',
  'common',
  'banner',
]

const keys = Object.keys(en).filter((key) => TRANSLATED.includes(key.split('.')[0] ?? ''))

function placeholders(text: string): string[] {
  return [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1] ?? '').sort()
}

const english: Record<string, string> = en
const dictionaries: Record<string, Record<string, string | undefined>> = { si, ta }

describe.each(Object.entries(dictionaries))('%s translations', (_lang, dict) => {
  it('covers every key in the translated namespaces', () => {
    const missing = keys.filter((key) => !(key in dict))
    expect(missing).toEqual([])
  })

  it('keeps the same placeholders as English', () => {
    const mismatched = keys.filter((key) => {
      const translated = dict[key]
      return (
        translated !== undefined &&
        placeholders(translated).join(',') !== placeholders(english[key] ?? '').join(',')
      )
    })
    expect(mismatched).toEqual([])
  })

  it('has no keys outside English', () => {
    expect(Object.keys(dict).filter((key) => !(key in en))).toEqual([])
  })
})
