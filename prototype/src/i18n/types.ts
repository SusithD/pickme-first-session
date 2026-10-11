import type { en } from './strings/en'

export type StringKey = keyof typeof en
export type Lang = 'en' | 'si' | 'ta'
export type Translations = Partial<Record<StringKey, string>>
export type Vars = Record<string, string | number>

export const LANGS: readonly { code: Lang; short: string; long: string }[] = [
  { code: 'en', short: 'EN', long: 'English' },
  { code: 'si', short: 'සිං', long: 'සිංහල' },
  { code: 'ta', short: 'தமிழ்', long: 'தமிழ்' },
]
