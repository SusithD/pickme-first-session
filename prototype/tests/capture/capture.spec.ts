import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { bookAndVerify, open, setDemo } from '../e2e/helpers'
import type { DemoSettings } from '../e2e/helpers'

const OUT = process.env.CAPTURE_DIR ?? 'captures'

async function shot(page: Page, name: string) {
  await page.waitForTimeout(400)
  await page.locator('.phone').screenshot({ path: `${OUT}/${name}.png`, animations: 'disabled' })
}

async function toWhere(page: Page, settings: DemoSettings = {}) {
  await open(page, 'intro')
  await setDemo(page, { variant: 'treatment', ...settings })
  await page.getByRole('link', { name: 'Start the ride' }).click()
  await page.getByRole('link', { name: 'Where are you going?' }).click()
  await page.getByRole('link', { name: 'Type pickup instead' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Where to?' })).toBeVisible()
}

async function toRide(page: Page, settings: DemoSettings = {}) {
  await toWhere(page, settings)
  await page.getByRole('button', { name: 'Fort Railway Station' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Choose your ride' })).toBeVisible()
}

async function toMatched(page: Page, settings: DemoSettings = {}) {
  await toRide(page, settings)
  await bookAndVerify(page)
  await page.getByRole('button', { name: 'Skip wait' }).click()
  await expect(page.getByRole('heading', { level: 2, name: 'Driver found' })).toBeVisible()
}

test('core treatment screens', async ({ page }) => {
  await open(page, 'intro')
  await setDemo(page, { variant: 'treatment' })
  await shot(page, 'intro')
  await page.getByRole('link', { name: 'See the problem first' }).click()
  await shot(page, 'problem')
  await toWhere(page)
  await shot(page, 'where')
  await page.getByRole('button', { name: 'Fort Railway Station' }).click()
  await shot(page, 'ride-treatment')
  await page.screenshot({ path: `${OUT}/desktop-stage.png` })
  await page.getByRole('link', { name: 'What can change this?' }).click()
  await expect(page.getByRole('dialog', { name: 'How this fare is made' })).toBeVisible()
  await shot(page, 'fare-sheet')
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: /^Book / }).click()
  await page.getByRole('textbox', { name: 'Mobile number' }).fill('771234567')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('textbox', { name: '6-digit code' })).toBeVisible()
  await shot(page, 'verify')
})

test('welcome variants', async ({ page }) => {
  await open(page, 'intro')
  await setDemo(page, { variant: 'treatment' })
  await page.getByRole('link', { name: 'Start the ride' }).click()
  await shot(page, 'welcome-treatment')
  await setDemo(page, { variant: 'control' })
  await shot(page, 'welcome-control')
})

test('ride control', async ({ page }) => {
  await toRide(page)
  await setDemo(page, { variant: 'control' })
  await shot(page, 'ride-control')
})

test('matched and trip to help', async ({ page }) => {
  await toMatched(page, { scenario: 'routeChange' })
  await shot(page, 'finding-matched')
  await page.getByRole('button', { name: 'Not now' }).click()
  await page.getByRole('link', { name: 'Continue' }).click()
  await expect(page.getByText(/Driver took a longer route/)).toBeVisible()
  await shot(page, 'trip-route-change')
  await page.getByRole('button', { name: 'Accept' }).click()
  await page.getByRole('link', { name: 'Arrive at destination' }).click()
  await shot(page, 'arrived')
  await page.getByRole('button', { name: 'Yes, end my trip' }).click()
  await expect(page.getByText(/more than booked/)).toBeVisible()
  await shot(page, 'receipt-delta')
  await page.getByRole('link', { name: 'Something’s not right' }).click()
  await page.getByRole('radio', { name: 'Fare is higher than explained' }).check()
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByText(/opened/).first()).toBeVisible()
  await shot(page, 'help-ticket')
})

test('driver cancelled', async ({ page }) => {
  await toMatched(page, { scenario: 'driverCancel' })
  await expect(page.getByText(/Your driver cancelled/).first()).toBeVisible({ timeout: 9000 })
  await shot(page, 'finding-cancelled')
})

test('languages', async ({ page }) => {
  await toRide(page)
  await setDemo(page, { lang: 'ta' })
  await shot(page, 'ride-tamil')
  await setDemo(page, { lang: 'en' })
  await toMatched(page)
  await page.getByRole('button', { name: 'Not now' }).click()
  await page.getByRole('link', { name: 'Continue' }).click()
  await page.getByRole('link', { name: 'Arrive at destination' }).click()
  await page.getByRole('button', { name: 'Yes, end my trip' }).click()
  await setDemo(page, { lang: 'si' })
  await shot(page, 'receipt-sinhala')
})

test('mobile ride', async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
    baseURL: 'http://localhost:5179',
  })
  const page = await ctx.newPage()
  await toRide(page)
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/mobile-ride.png` })
  await ctx.close()
})
