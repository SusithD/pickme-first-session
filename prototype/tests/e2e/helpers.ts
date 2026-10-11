import { expect } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'

export type Variant = 'control' | 'treatment'
export type Lang = 'en' | 'si' | 'ta'
export type Scenario = 'normal' | 'noDriver' | 'driverCancel' | 'routeChange' | 'cashDemand'

export const ROUTES = [
  'intro',
  'problem',
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
] as const

export const ROUTE_HASH: Record<(typeof ROUTES)[number], string> = {
  intro: '/',
  problem: '/problem',
  welcome: '/welcome',
  location: '/location',
  where: '/where',
  ride: '/ride',
  fare: '/fare',
  verify: '/verify',
  finding: '/finding',
  trip: '/trip',
  arrived: '/arrived',
  receipt: '/receipt',
  help: '/help',
}

export const DEMO_CODE = '123456'
export const PHONE = '771234567'

const VARIANT_LABEL: Record<Variant, string> = { control: 'Control', treatment: 'Treatment' }
const SCENARIO_LABEL: Record<Scenario, string> = {
  normal: 'Normal',
  noDriver: 'No driver',
  driverCancel: 'Driver cancels',
  routeChange: 'Route change',
  cashDemand: 'Driver asks for cash',
}

export async function press(page: Page, locator: Locator, key = 'Enter'): Promise<void> {
  await locator.focus()
  await expect(locator).toBeFocused()
  await page.keyboard.press(key)
}

export async function tabTo(page: Page, locator: Locator, max = 60): Promise<void> {
  for (let i = 0; i < max; i += 1) {
    const focused = await locator.evaluate((el) => el === document.activeElement).catch(() => false)
    if (focused) return
    await page.keyboard.press('Tab')
  }
  await expect(locator).toBeFocused()
}

export async function tabAndPress(page: Page, locator: Locator, key = 'Enter'): Promise<void> {
  await tabTo(page, locator)
  await page.keyboard.press(key)
}

async function demoPanel(page: Page): Promise<{ panel: Locator; close: () => Promise<void> }> {
  const opener = page.getByRole('button', { name: 'Demo', exact: true })
  if (await opener.isVisible()) {
    await press(page, opener)
    const dialog = page.getByRole('dialog', { name: 'Demo controls' })
    await expect(dialog).toBeVisible()
    return {
      panel: dialog,
      close: async () => {
        await page.keyboard.press('Escape')
        await expect(dialog).toBeHidden()
      },
    }
  }
  return { panel: page.getByRole('complementary'), close: async () => undefined }
}

const LANG_LABEL: Record<Lang, string> = { en: 'English', si: 'සිංහල', ta: 'தமிழ்' }

async function chooseOption(page: Page, combobox: Locator, name: string): Promise<void> {
  await combobox.click()
  await expect(combobox).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('option', { name, exact: true }).click()
  await expect(combobox).toHaveAttribute('aria-expanded', 'false')
}

export interface DemoSettings {
  variant?: Variant
  scenario?: Scenario
  lang?: Lang
  peak?: boolean
}

export async function setDemo(page: Page, settings: DemoSettings): Promise<void> {
  const { panel, close } = await demoPanel(page)
  if (settings.variant) {
    const radio = panel.getByRole('radio', { name: VARIANT_LABEL[settings.variant] })
    await radio.focus()
    await page.keyboard.press('Space')
    await expect(radio).toBeChecked()
  }
  if (settings.peak !== undefined) {
    const box = panel.getByRole('checkbox', { name: 'Peak pricing' })
    if ((await box.isChecked()) !== settings.peak) {
      await box.focus()
      await page.keyboard.press('Space')
    }
    expect(await box.isChecked()).toBe(settings.peak)
  }
  if (settings.scenario) {
    await chooseOption(
      page,
      panel.getByRole('combobox', { name: 'Scenario' }),
      SCENARIO_LABEL[settings.scenario],
    )
  }
  if (settings.lang) {
    await chooseOption(
      page,
      panel.getByRole('combobox', { name: /Language|භාෂාව|மொழி/ }),
      LANG_LABEL[settings.lang],
    )
    await expect(page.locator('html')).toHaveAttribute('lang', settings.lang)
  }
  await close()
}

export async function open(page: Page, route: (typeof ROUTES)[number] = 'intro'): Promise<void> {
  await page.goto(`/#${ROUTE_HASH[route]}`)
  await expect(page.locator('main h1, main [role="dialog"] h1').first()).toBeVisible()
}

export async function goToRoute(page: Page, route: (typeof ROUTES)[number]): Promise<void> {
  await page.evaluate((hash) => {
    window.location.hash = hash
  }, ROUTE_HASH[route])
  await expect(page.locator('main h1, main [role="dialog"] h1').first()).toBeVisible()
}

export async function verifyPhone(page: Page): Promise<void> {
  const phone = page.getByRole('textbox', { name: 'Mobile number' })
  await tabTo(page, phone)
  await page.keyboard.type(PHONE)
  await page.keyboard.press('Enter')
  const code = page.getByRole('textbox', { name: '6-digit code' })
  await expect(code).toBeFocused()
  await expect(page.getByText(`Demo code: ${DEMO_CODE}`)).toBeVisible()
  await page.keyboard.type(DEMO_CODE)
  await page.keyboard.press('Enter')
  await expect(page.getByText('Number confirmed.')).toBeVisible()
  await tabAndPress(page, page.getByRole('button', { name: 'Continue' }))
}

export async function bookAndVerify(page: Page): Promise<void> {
  await press(page, page.getByRole('button', { name: /^Book / }))
  await expect(page.getByRole('heading', { level: 1, name: 'Confirm your number' })).toBeFocused()
  await verifyPhone(page)
  await expect(page.getByRole('heading', { level: 1, name: 'Finding your driver' })).toBeVisible()
}

export async function expectOneH1(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
}

export async function settle(page: Page): Promise<void> {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 50)))
      }),
  )
}
