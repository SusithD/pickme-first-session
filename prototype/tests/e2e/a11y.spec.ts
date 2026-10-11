import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { ROUTES, expectOneH1, goToRoute, open, press, setDemo, settle } from './helpers'
import type { Lang, Scenario, Variant } from './helpers'

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
const VARIANTS: readonly Variant[] = ['control', 'treatment']
const LANGS: readonly Lang[] = ['en', 'si', 'ta']

async function scan(page: Page): Promise<string[]> {
  await settle(page)
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  return results.violations.map(
    (violation) =>
      `${violation.id} (${violation.impact}): ${violation.nodes
        .map((node) => node.target.join(' '))
        .join(' | ')}`,
  )
}

async function prepare(page: Page, variant: Variant, lang: Lang, scenario?: Scenario) {
  await open(page, 'intro')
  await setDemo(page, { variant, ...(scenario ? { scenario } : {}) })
  await setDemo(page, { lang })
}

test.describe('axe on every route, variant and language', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  for (const variant of VARIANTS) {
    for (const lang of LANGS) {
      for (const route of ROUTES) {
        test(`${route} / ${variant} / ${lang}`, async ({ page }) => {
          await prepare(page, variant, lang)
          await goToRoute(page, route)
          await expectOneH1(page)
          await expect(page.locator('html')).toHaveAttribute('lang', lang)
          expect(await scan(page)).toEqual([])
        })
      }
    }
  }
})

test.describe('axe on interactive states', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  for (const lang of LANGS) {
    for (const variant of VARIANTS) {
      test(`verify code stage / ${variant} / ${lang}`, async ({ page }) => {
        await prepare(page, variant, lang)
        await goToRoute(page, 'verify')
        await page.getByRole('textbox').first().fill('771234567')
        await page.keyboard.press('Enter')
        await expect(page.locator('input[autocomplete="one-time-code"]')).toBeFocused()
        await expectOneH1(page)
        expect(await scan(page)).toEqual([])
        await page.keyboard.type('000000')
        await page.keyboard.press('Enter')
        await expect(page.locator('input[aria-invalid="true"]')).toBeVisible()
        expect(await scan(page)).toEqual([])
        await page.keyboard.press('ControlOrMeta+a')
        await page.keyboard.type('123456')
        await page.keyboard.press('Enter')
        await expect(
          page.locator('[role="status"]').filter({ hasText: /\S/ }).first(),
        ).toBeVisible()
        expect(await scan(page)).toEqual([])
      })

      test(`phone validation error / ${variant} / ${lang}`, async ({ page }) => {
        await prepare(page, variant, lang)
        await goToRoute(page, variant === 'control' ? 'welcome' : 'verify')
        await page.getByRole('textbox').first().fill('12')
        await page.keyboard.press('Enter')
        await expect(page.locator('input[aria-invalid="true"]')).toBeVisible()
        expect(await scan(page)).toEqual([])
      })
    }

    const scenarios: readonly Scenario[] = ['noDriver', 'driverCancel', 'routeChange', 'cashDemand']
    for (const scenario of scenarios) {
      test(`${scenario} states / treatment / ${lang}`, async ({ page }) => {
        await prepare(page, 'treatment', lang, scenario)
        await goToRoute(page, 'finding')
        await settle(page)
        await page.locator('main button.btn-secondary').first().click()
        await settle(page)
        expect(await scan(page)).toEqual([])
        if (scenario === 'noDriver') {
          await page.locator('main button.btn-primary').first().click()
          await settle(page)
          await page.locator('main button.btn-secondary').first().click()
          await settle(page)
        }
        if (scenario === 'driverCancel') {
          await expect(page.getByRole('alert').filter({ hasText: /\S/ })).toBeVisible({
            timeout: 9000,
          })
          expect(await scan(page)).toEqual([])
          await page.locator('main button.btn-secondary').first().click()
          await settle(page)
        }
        expect(await scan(page)).toEqual([])
        await goToRoute(page, 'trip')
        await settle(page)
        expect(await scan(page)).toEqual([])
        if (scenario === 'routeChange') {
          await page.locator('main .notice button.btn-secondary').click()
          expect(await scan(page)).toEqual([])
          await goToRoute(page, 'arrived')
          await page.locator('main button.btn-primary').click()
          await expect(page.locator('main .notice')).toBeVisible()
          expect(await scan(page)).toEqual([])
        }
      })
    }

    test(`help submitted and safety sheet / ${lang}`, async ({ page }) => {
      await prepare(page, 'treatment', lang)
      await goToRoute(page, 'trip')
      await press(page, page.locator('main .btn-secondary').nth(1))
      await expect(page.getByRole('dialog')).toBeVisible()
      await settle(page)
      expect(await scan(page)).toEqual([])
      await page.keyboard.press('Escape')
      await goToRoute(page, 'help')
      await page.getByRole('radio').first().focus()
      await page.keyboard.press('Space')
      await page.locator('main form button[type="submit"]').click()
      await expect(page.locator('main .btn-secondary')).toBeVisible()
      expect(await scan(page)).toEqual([])
    })
  }

  test('demo controls open as a sheet on mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await open(page, 'ride')
    await press(page, page.getByRole('button', { name: 'Demo', exact: true }))
    await expect(page.getByRole('dialog')).toBeVisible()
    expect(await scan(page)).toEqual([])
  })
})

test.describe('target size', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  for (const variant of VARIANTS) {
    for (const route of ['welcome', 'ride', 'where', 'verify', 'receipt', 'help'] as const) {
      test(`interactive targets are at least 24px / ${route} / ${variant}`, async ({ page }) => {
        await prepare(page, variant, 'en')
        await goToRoute(page, route)
        await settle(page)
        const small = await page.evaluate(() =>
          Array.from(
            document.querySelectorAll<HTMLElement>(
              'main button, main a.btn, main input, main select, main [role="radio"], aside input, aside select, aside button',
            ),
          )
            .filter((el) => el.offsetParent !== null && !el.closest('[aria-hidden="true"]'))
            .map((el) => ({
              el,
              rect: (el.closest('label') ?? el).getBoundingClientRect(),
            }))
            .filter(({ rect }) => rect.width > 0 && (rect.width < 24 || rect.height < 24))
            .map(({ el, rect }) => `${el.tagName}.${el.className} ${rect.width}x${rect.height}`),
        )
        expect(small).toEqual([])
      })
    }
  }
})

test.describe('reflow at 200% zoom and 320px width', () => {
  const sizes = [
    { name: '200% zoom', width: 640, height: 450 },
    { name: '320px width', width: 320, height: 568 },
  ]

  for (const size of sizes) {
    for (const lang of LANGS) {
      for (const route of ['ride', 'fare', 'receipt'] as const) {
        test(`${route} / ${lang} / ${size.name}`, async ({ page }) => {
          await page.setViewportSize({ width: size.width, height: size.height })
          await open(page, 'intro')
          await setDemo(page, { variant: 'treatment' })
          await setDemo(page, { lang })
          await goToRoute(page, route)
          await settle(page)
          const overflow = await page.evaluate(() => {
            const frame = document.querySelector<HTMLElement>('.phone')
            const issues: string[] = []
            const doc = document.documentElement
            if (doc.scrollWidth > doc.clientWidth) {
              issues.push(`page ${doc.scrollWidth}>${doc.clientWidth}`)
            }
            if (!frame) return ['no phone frame']
            if (frame.scrollWidth > frame.clientWidth) {
              issues.push(`frame ${frame.scrollWidth}>${frame.clientWidth}`)
            }
            const limit = frame.getBoundingClientRect().right + 1
            for (const el of Array.from(frame.querySelectorAll<HTMLElement>('*'))) {
              if (el.closest('.visually-hidden')) continue
              const rect = el.getBoundingClientRect()
              if (rect.width > 0 && rect.right > limit) {
                issues.push(`${el.tagName}.${el.className} right=${Math.round(rect.right)}`)
              }
            }
            return issues
          })
          expect(overflow).toEqual([])
        })
      }
    }
  }
})

test.describe('document structure', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  for (const lang of LANGS) {
    test(`html lang follows the selected language / ${lang}`, async ({ page }) => {
      await open(page, 'intro')
      await setDemo(page, { lang })
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      await goToRoute(page, 'ride')
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      await page.reload()
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
    })
  }
})
