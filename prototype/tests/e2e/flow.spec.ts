import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import {
  bookAndVerify,
  expectOneH1,
  open,
  press,
  settle,
  setDemo,
  tabAndPress,
  tabTo,
  verifyPhone,
} from './helpers'

function h1(page: Page, name: string | RegExp) {
  return page.getByRole('heading', { level: 1, name })
}

async function chooseDestination(page: Page, query: string) {
  const search = page.getByRole('searchbox', { name: 'Where to?' })
  await tabTo(page, search)
  await page.keyboard.type(query)
  await page.keyboard.press('Enter')
  await expect(h1(page, 'Choose your ride')).toBeFocused()
}

async function startTreatment(page: Page) {
  await open(page, 'intro')
  await setDemo(page, { variant: 'treatment' })
  await tabAndPress(page, page.getByRole('link', { name: 'Start the ride' }))
  await expect(h1(page, 'Welcome')).toBeFocused()
  await tabAndPress(page, page.getByRole('link', { name: 'Where are you going?' }))
  await expect(h1(page, /Allow location/)).toBeFocused()
  await tabAndPress(page, page.getByRole('link', { name: 'Allow while using' }))
  await expect(h1(page, 'Where to?')).toBeFocused()
  await chooseDestination(page, 'Wella')
}

test.describe('treatment flow, keyboard only', () => {
  test('full walk from intro to back to start', async ({ page }) => {
    await open(page, 'intro')
    await expectOneH1(page)
    await setDemo(page, { variant: 'treatment' })

    await tabAndPress(page, page.getByRole('link', { name: 'Start the ride' }))
    await expect(h1(page, 'Welcome')).toBeFocused()

    const english = page.getByRole('radio', { name: 'English' })
    await press(page, english, 'ArrowRight')
    await expect(page.getByRole('radio', { name: 'සිංහල' })).toBeChecked()
    await expect(page.locator('html')).toHaveAttribute('lang', 'si')
    await page.keyboard.press('ArrowLeft')
    await expect(english).toBeChecked()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    await tabAndPress(page, page.getByRole('link', { name: 'Where are you going?' }))
    await expect(h1(page, /Allow location/)).toBeFocused()
    await tabAndPress(page, page.getByRole('link', { name: 'Type pickup instead' }))
    await expect(h1(page, 'Where to?')).toBeFocused()

    await tabAndPress(page, page.getByRole('button', { name: 'Add a note for your driver' }))
    await expect(page.getByRole('button', { name: 'Add a note for your driver' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    await tabTo(page, page.getByRole('textbox', { name: /Pickup note/ }))
    await page.keyboard.type('Blue gate')
    await tabTo(page, page.getByRole('searchbox', { name: 'Where to?' }))
    await page.keyboard.type('zzz')
    await expect(page.getByText('No places match')).toBeVisible()
    await page.keyboard.press('ControlOrMeta+a')
    await page.keyboard.type('Wella')
    await page.keyboard.press('Enter')
    await expect(h1(page, 'Choose your ride')).toBeFocused()

    const tuk = page.getByRole('radio', { name: /^Tuk/ })
    await expect(tuk).toBeChecked()
    await press(page, tuk, 'ArrowDown')
    const smallCar = page.getByRole('radio', { name: /^Small car/ })
    await expect(smallCar).toBeChecked()
    await expect(smallCar).toBeFocused()
    await page.keyboard.press('ArrowUp')
    await expect(tuk).toBeChecked()
    const cash = page.getByRole('radio', { name: 'Cash' })
    await press(page, cash, 'ArrowRight')
    await expect(page.getByRole('radio', { name: 'Card' })).toBeChecked()
    await expect(page.getByRole('button', { name: /^Book Tuk/ })).toContainText('LKR')

    const trigger = page.getByRole('link', { name: 'What can change this?' })
    await tabTo(page, trigger)
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog', { name: 'How this fare is made' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused()
    await settle(page)
    await expectOneH1(page)
    await expect(dialog.getByText('Only three things can change this fare')).toBeVisible()
    const inside = () => dialog.evaluate((el) => el.contains(document.activeElement))
    await page.keyboard.press('Shift+Tab')
    expect(await inside()).toBe(true)
    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press('Tab')
      expect(await inside()).toBe(true)
    }
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()

    await page.keyboard.press('Enter')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused()
    await settle(page)
    await tabAndPress(page, dialog.getByRole('button', { name: 'Got it' }))
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()

    await bookAndVerify(page)
    await expect(
      page.getByText('Searching', { exact: true }).or(page.getByText(/s elapsed/)),
    ).toBeVisible()

    await tabAndPress(page, page.getByRole('button', { name: 'Skip wait' }))
    await expect(page.getByRole('heading', { level: 2, name: 'Driver found' })).toBeVisible()
    await expect(page.getByText('Driver agreed: Card')).toBeVisible()
    await expect(page.getByText('Your note: Blue gate')).toBeVisible()
    await tabAndPress(page, page.getByRole('button', { name: 'Not now' }))
    await tabAndPress(page, page.getByRole('link', { name: 'Continue' }))
    await expect(h1(page, 'On the way')).toBeFocused()
    await expect(page.getByText(/Fare so far: LKR [\d,]+ \(unchanged\)/)).toBeVisible()

    const safety = page.getByRole('button', { name: 'Safety', exact: true })
    await tabAndPress(page, safety)
    const safetyDialog = page.getByRole('dialog', { name: 'Safety' })
    await expect(safetyDialog).toBeVisible()
    await expect(safetyDialog.getByRole('button', { name: 'Close' })).toBeFocused()
    await settle(page)
    await page.keyboard.press('Escape')
    await expect(safetyDialog).toBeHidden()
    await expect(safety).toBeFocused()

    await tabAndPress(page, page.getByRole('link', { name: 'Arrive at destination' }))
    await expect(h1(page, /Have you arrived at Wellawatte/)).toBeFocused()
    await tabAndPress(page, page.getByRole('button', { name: 'Not yet' }), 'Space')
    await expect(page.getByText(/The button stays here/)).toBeVisible()
    await tabAndPress(page, page.getByRole('button', { name: 'Yes, end my trip' }))
    await expect(h1(page, 'Your fare')).toBeFocused()
    await expect(page.getByText(/as booked/)).toBeVisible()
    await expect(page.getByText('Charged to card ••1234')).toBeVisible()

    const rateFive = page.getByRole('radio', { name: '5 of 5' })
    await tabTo(page, page.getByRole('radio', { name: '1 of 5' }))
    await page.keyboard.press('End')
    await expect(rateFive).toBeChecked()

    await tabAndPress(page, page.getByRole('link', { name: 'Something’s not right' }))
    await expect(h1(page, 'Get help')).toBeFocused()
    const send = page.getByRole('button', { name: 'Send' })
    await expect(send).toBeDisabled()
    await tabTo(page, page.getByRole('radio', { name: 'Fare is higher than explained' }))
    await page.keyboard.press('Space')
    await expect(page.getByRole('radio', { name: 'Fare is higher than explained' })).toBeChecked()
    await expect(send).toBeEnabled()
    await tabAndPress(page, send, 'Space')
    await expect(page.getByRole('status').filter({ hasText: 'Ticket #TKT-4821' })).toBeVisible()
    await tabAndPress(page, page.getByRole('button', { name: 'Back to start' }))
    await expect(h1(page, 'A first ride you can trust')).toBeVisible()
  })

  test('verify rejects a wrong code and a bad number', async ({ page }) => {
    await open(page, 'verify')
    const phone = page.getByRole('textbox', { name: 'Mobile number' })
    await tabTo(page, phone)
    await page.keyboard.type('12')
    await page.keyboard.press('Enter')
    await expect(page.getByText(/Enter a Sri Lankan mobile number/).first()).toBeVisible()
    await expect(phone).toHaveAttribute('aria-invalid', 'true')
    await page.keyboard.press('ControlOrMeta+a')
    await page.keyboard.type('0771234567')
    await page.keyboard.press('Enter')
    const code = page.getByRole('textbox', { name: '6-digit code' })
    await expect(code).toBeFocused()
    await page.keyboard.type('000000')
    await page.keyboard.press('Enter')
    await expect(page.getByText(/doesn’t match/).first()).toBeVisible()
    await expect(code).toHaveAttribute('aria-invalid', 'true')
  })

  test('arrival timer ends the trip on its own', async ({ page }) => {
    await page.clock.install()
    await open(page, 'arrived')
    await expect(page.getByText('60 s left')).toBeVisible()
    await page.clock.runFor(61_000)
    await expect(h1(page, 'Your fare')).toBeVisible()
  })
})

test.describe('route sync', () => {
  test('closing the fare sheet right after opening it returns to the ride screen', async ({
    page,
  }) => {
    await open(page, 'ride')
    await setDemo(page, { variant: 'treatment' })
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          document.querySelector<HTMLElement>('#fare-trigger')?.click()
          window.setTimeout(() => {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
            resolve()
          }, 4)
        }),
    )
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(h1(page, 'Choose your ride')).toBeVisible()
    await expect(page).toHaveURL(/#\/ride$/)
  })
})

test.describe('scenarios, treatment', () => {
  test('noDriver offers a small car and then finds one', async ({ page }) => {
    await startTreatment(page)
    await setDemo(page, { scenario: 'noDriver' })
    await bookAndVerify(page)
    await tabAndPress(page, page.getByRole('button', { name: 'Skip wait' }))
    await expect(page.getByText(/No tuk free right now/).first()).toBeVisible()
    await expect(page.getByText(/You have not been charged/).first()).toBeVisible()
    await tabAndPress(page, page.getByRole('button', { name: 'Try Small car' }))
    await tabAndPress(page, page.getByRole('button', { name: 'Skip wait' }))
    await expect(page.getByText(/Suzuki Wagon R/)).toBeVisible()
  })

  test('driverCancel re-matches without a fee', async ({ page }) => {
    await startTreatment(page)
    await setDemo(page, { scenario: 'driverCancel' })
    await bookAndVerify(page)
    await tabAndPress(page, page.getByRole('button', { name: 'Skip wait' }))
    await expect(page.getByRole('heading', { level: 2, name: 'Driver found' })).toBeVisible()
    await expect(page.getByText(/Your driver cancelled/).first()).toBeVisible({ timeout: 9000 })
    await expect(page.getByText(/no cancellation fee/).first()).toBeVisible()
    await expect(page.getByRole('alert').filter({ hasText: 'cancelled' })).toHaveCount(1)
    await expect(page.getByText(/s elapsed/)).toBeVisible({ timeout: 9000 })
    await tabAndPress(page, page.getByRole('button', { name: 'Skip wait' }))
    await expect(page.getByRole('heading', { level: 2, name: 'Driver found' })).toBeVisible()
    await page.waitForTimeout(4500)
    await expect(page.getByRole('heading', { level: 2, name: 'Driver found' })).toBeVisible()
  })

  async function reachTripWithRouteChange(page: Page) {
    await startTreatment(page)
    await setDemo(page, { scenario: 'routeChange' })
    await bookAndVerify(page)
    await tabAndPress(page, page.getByRole('button', { name: 'Skip wait' }))
    await tabAndPress(page, page.getByRole('button', { name: 'Not now' }))
    await tabAndPress(page, page.getByRole('link', { name: 'Continue' }))
    await expect(h1(page, 'On the way')).toBeFocused()
    await expect(page.getByText(/Driver took a longer route/)).toBeVisible()
  }

  test('routeChange accepted updates the fare', async ({ page }) => {
    await reachTripWithRouteChange(page)
    await tabAndPress(page, page.getByRole('button', { name: 'Accept' }))
    await expect(page.getByText(/Accepted\. New fare LKR/)).toBeVisible()
    await tabAndPress(page, page.getByRole('link', { name: 'Arrive at destination' }))
    await tabAndPress(page, page.getByRole('button', { name: 'Yes, end my trip' }))
    await expect(h1(page, 'Your fare')).toBeFocused()
    await expect(page.getByText(/more than booked/)).toBeVisible()
    await expect(page.getByText('Route change (accepted on trip)')).toBeVisible()
  })

  test('routeChange ask later flags the receipt and holds the amount', async ({ page }) => {
    await reachTripWithRouteChange(page)
    await tabAndPress(page, page.getByRole('button', { name: 'Ask at the end' }))
    await expect(page.getByText(/We will flag it on your receipt/)).toBeVisible()
    await tabAndPress(page, page.getByRole('link', { name: 'Arrive at destination' }))
    await tabAndPress(page, page.getByRole('button', { name: 'Yes, end my trip' }))
    await expect(page.getByText('Route change (flagged, on hold)')).toBeVisible()
    await expect(page.getByText(/is on hold until we reply/)).toBeVisible()
    await tabAndPress(page, page.getByRole('link', { name: 'Something’s not right' }))
    await tabTo(page, page.getByRole('radio', { name: 'Fare is higher than explained' }))
    await page.keyboard.press('Space')
    await tabAndPress(page, page.getByRole('button', { name: 'Send' }))
    await expect(page.getByText(/The extra LKR 120 is on hold/)).toBeVisible()
  })

  test('cashDemand keeps the agreed payment locked', async ({ page }) => {
    await startTreatment(page)
    await setDemo(page, { scenario: 'cashDemand' })
    await press(page, page.getByRole('radio', { name: 'Cash' }), 'ArrowRight')
    await bookAndVerify(page)
    await tabAndPress(page, page.getByRole('button', { name: 'Skip wait' }))
    await expect(page.getByText(/Your driver asked for cash/)).toBeVisible()
    await expect(page.getByText(/can’t change it/)).toBeVisible()
    await expect(page.getByText('Driver agreed: Card')).toBeVisible()
    await tabAndPress(page, page.getByRole('button', { name: 'Not now' }))
    await tabAndPress(page, page.getByRole('link', { name: 'Continue' }))
    await tabAndPress(page, page.getByRole('link', { name: 'Arrive at destination' }))
    await tabAndPress(page, page.getByRole('button', { name: 'Yes, end my trip' }))
    await expect(page.getByText('Charged to card ••1234')).toBeVisible()
    await tabAndPress(page, page.getByRole('link', { name: 'Something’s not right' }))
    await tabTo(page, page.getByRole('radio', { name: 'Fare is higher than explained' }))
    await page.keyboard.press('ArrowDown')
    await expect(page.getByRole('radio', { name: /asked for cash on a card trip/ })).toBeChecked()
    await tabAndPress(page, page.getByRole('button', { name: 'Send' }))
    await expect(page.getByText(/Ticket #TKT-4821 opened/)).toBeVisible()
  })
})

test.describe('control flow, keyboard only', () => {
  test('full walk with account first', async ({ page }) => {
    await open(page, 'intro')
    await setDemo(page, { variant: 'control' })
    await tabAndPress(page, page.getByRole('link', { name: 'Start the ride' }))
    await expect(h1(page, 'Create an account to continue')).toBeFocused()

    const phone = page.getByRole('textbox', { name: 'Mobile number' })
    await tabTo(page, phone)
    await page.keyboard.press('Enter')
    await expect(page.getByText(/Enter a Sri Lankan mobile number/).first()).toBeVisible()
    await page.keyboard.type('771234567')
    await page.keyboard.press('Enter')
    await expect(h1(page, 'Confirm your number')).toBeFocused()

    await verifyPhone(page)
    await expect(h1(page, 'Allow location access')).toBeFocused()
    await tabAndPress(page, page.getByRole('link', { name: 'Allow', exact: true }))
    await expect(h1(page, 'Where to?')).toBeFocused()
    await chooseDestination(page, 'Borella')

    await expect(page.getByRole('link', { name: 'What can change this?' })).toHaveCount(0)
    await expect(page.getByRole('radio', { name: /^Tuk/ })).toContainText('Estimated')
    await tabAndPress(page, page.getByRole('button', { name: /^Book Tuk · est\./ }))
    await expect(h1(page, 'Finding your driver')).toBeFocused()
    await tabAndPress(page, page.getByRole('button', { name: 'Skip wait' }))
    await expect(page.getByRole('button', { name: 'Not now' })).toHaveCount(0)
    await tabAndPress(page, page.getByRole('link', { name: 'Continue' }))
    await expect(h1(page, 'On the way')).toBeFocused()
    await tabAndPress(page, page.getByRole('link', { name: 'Arrive at destination' }))
    await expect(h1(page, 'You’ve arrived')).toBeFocused()
    await tabAndPress(page, page.getByRole('button', { name: 'Driver ends trip (demo)' }))
    await expect(h1(page, 'Your fare')).toBeFocused()
    await expect(page.getByText(/as booked/)).toHaveCount(0)
    await tabAndPress(page, page.getByRole('link', { name: 'Something’s not right' }))
    await expect(h1(page, 'Get help')).toBeFocused()
  })

  test('control route change is applied silently', async ({ page }) => {
    await open(page, 'intro')
    await setDemo(page, { variant: 'control', scenario: 'routeChange' })
    await open(page, 'trip')
    await expect(page.getByRole('button', { name: 'Accept' })).toHaveCount(0)
    await expect(page.getByText(/Fare so far: LKR [\d,]+$/)).toBeVisible()
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('no running animations or transitions on the animated screens', async ({ page }) => {
    await open(page, 'finding')
    await setDemo(page, { variant: 'treatment' })
    await expect(page.getByText('Searching', { exact: true })).toBeVisible()
    const running = () =>
      page.evaluate(() =>
        document
          .getAnimations()
          .filter((a) => a.playState === 'running')
          .map((a) => a.id || a.constructor.name),
      )
    expect(await running()).toEqual([])

    for (const route of ['ride', 'fare', 'trip', 'arrived', 'receipt'] as const) {
      await open(page, route)
      expect(await running()).toEqual([])
    }

    const durations = await page.evaluate(() => {
      const bad: string[] = []
      for (const el of Array.from(document.querySelectorAll('*'))) {
        const style = getComputedStyle(el)
        const anim = style.animationName !== 'none' && parseFloat(style.animationDuration) > 0
        const trans = style.transitionDuration.split(',').some((d) => parseFloat(d) > 0)
        if (anim || trans) bad.push(`${el.tagName}.${el.className}`)
      }
      return bad
    })
    expect(durations).toEqual([])
  })
})
