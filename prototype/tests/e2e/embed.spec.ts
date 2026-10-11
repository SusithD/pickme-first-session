import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

interface Expectation {
  h1: RegExp
  text?: RegExp
  lang?: string
}

const SCENES: Record<string, Expectation> = {
  intro: { h1: /A first ride you can trust/ },
  problem: { h1: /What new riders say goes wrong/ },
  'welcome-treatment': { h1: /^Welcome$/ },
  'welcome-control': { h1: /Create an account to continue/ },
  location: { h1: /Allow location so your driver finds you/ },
  where: { h1: /^Where to\?$/ },
  'ride-treatment': { h1: /Choose your ride/, text: /Details/ },
  'ride-control': { h1: /Choose your ride/ },
  'fare-sheet': { h1: /How this fare is made/ },
  verify: { h1: /Confirm your number/, text: /6-digit code/ },
  'finding-matched': { h1: /Your driver is on the way/, text: /Nimal/ },
  'finding-cancelled': { h1: /Finding your driver/, text: /Your driver cancelled/ },
  'trip-route-change': { h1: /On the way/, text: /Driver took a longer route/ },
  arrived: { h1: /Have you arrived at Fort Railway Station\?/ },
  'receipt-delta': { h1: /Your fare/, text: /more than booked/ },
  'receipt-asbooked': { h1: /Your fare/, text: /as booked/ },
  'help-ticket': { h1: /Get help/, text: /TKT-4821/ },
  'receipt-sinhala': { h1: /.+/, lang: 'si' },
  'ride-tamil': { h1: /.+/, lang: 'ta' },
}

const VIEWPORTS = [
  { width: 300, height: 640 },
  { width: 430, height: 932 },
]

async function load(page: Page, scene: string) {
  await page.goto(`/?embed=1&scene=${scene}`)
  await expect(page.locator('main h1').first()).toBeVisible()
}

test.describe('embed scenes', () => {
  for (const [scene, expected] of Object.entries(SCENES)) {
    test(scene, async ({ page }) => {
      await load(page, scene)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(expected.h1)
      if (expected.text) await expect(page.locator('main')).toContainText(expected.text)
      if (expected.lang) await expect(page.locator('html')).toHaveAttribute('lang', expected.lang)
      await expect(page.locator('.demo-aside, .project, .demo-opener')).toHaveCount(0)
      await expect(page.getByRole('button', { name: /demo/i })).toHaveCount(0)
      expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true)

      for (const viewport of VIEWPORTS) {
        await page.setViewportSize(viewport)
        await page.waitForTimeout(50)
        const box = await page.locator('.device').boundingBox()
        if (!box) throw new Error('device missing')
        expect(box.x).toBeGreaterThanOrEqual(-0.5)
        expect(box.y).toBeGreaterThanOrEqual(-0.5)
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 0.5)
        expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 0.5)
        const overflow = await page.evaluate(() => ({
          x: document.documentElement.scrollWidth - window.innerWidth,
          y: document.documentElement.scrollHeight - window.innerHeight,
        }))
        expect(overflow.x).toBeLessThanOrEqual(0)
        expect(overflow.y).toBeLessThanOrEqual(0)
      }
    })
  }

  test('scene seeded in the hash query still works', async ({ page }) => {
    await page.goto('/#/?embed=1&scene=ride-control')
    await expect(page.locator('main h1').first()).toHaveText(/Choose your ride/)
    await expect(page.locator('.demo-aside')).toHaveCount(0)
  })

  test('unknown scene falls back to intro', async ({ page }) => {
    await load(page, 'nope')
    await expect(page.locator('main h1').first()).toHaveText(/A first ride you can trust/)
  })

  test('finding cancelled stays cancelled and the flow stays interactive', async ({ page }) => {
    await load(page, 'finding-cancelled')
    await page.waitForTimeout(3500)
    await expect(page.locator('main')).toContainText(/Your driver cancelled/)
    await page.getByRole('button', { name: 'Skip wait' }).click()
    await expect(page.locator('main')).toContainText(/Nimal/, { timeout: 5000 })
  })

  test('taps navigate the flow', async ({ page }) => {
    await load(page, 'intro')
    await page.getByRole('link', { name: 'Start the ride' }).click()
    await expect(page.locator('main h1')).toHaveText(/^Welcome$/)
  })

  for (const scene of ['ride-treatment', 'fare-sheet', 'receipt-delta']) {
    test(`axe on ${scene}`, async ({ page }) => {
      await load(page, scene)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(results.violations.map((v) => v.id)).toEqual([])
    })
  }
})
