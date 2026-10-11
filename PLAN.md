# PLAN: PickMe first ride, an unofficial growth concept

Owner: Susith Deshan Alwis. Written 2026-10-11. All decisions below are made; each carries a one-line reason. Not affiliated with PickMe / Digital Mobility Solutions Lanka.

## 1. Decisions log

| # | Decision | Rationale |
|---|---|---|
| D1 | **Reframe scope from "first session" to "first ride": the stretch from seeing a fare to paying for it, plus getting help.** | Review mining found zero evidence of signup/OTP/permission friction and strong evidence of fare shock, driver-only trip end, cash/card mismatch and dead support. Design where the evidence is. |
| D2 | **Primary bet: a fare the rider can hold.** Upfront fare breakdown, a plain promise about what can change it, every change explained before payment, and a rider-side trip end. | The four strongest complaint themes all collapse into one trust gap between the estimate and the receipt. One bet, one flow. |
| D3 | **Repo name `SusithD/pickme-first-session`.** GitHub description: `Unofficial growth concept for a new rider's first ride on PickMe (Sri Lanka): desk research, funnel audit, hypotheses, coded React prototype and an A/B test plan. Not affiliated with PickMe.` | "pickme" is used descriptively (nominative use), "first-ride" states the scope, the description leads with "Unofficial". Local folder stays `pickme-first-session`; only the remote name differs. |
| D4 | **Prototype = React 18 + Vite + TypeScript, vanilla CSS with custom-property tokens, HashRouter, GitHub Pages at `https://susithd.github.io/pickme-first-session/`.** | Fills the React gap in the portfolio; no Tailwind keeps the token system visible and reviewable; hash routing avoids 404s on Pages. |
| D5 | **No "current PickMe" clone. The baseline is (a) a problem storyboard built from public reviews and (b) a Control/Treatment toggle on the two fare screens, where Control is a labelled "typical ride-hailing pattern", not PickMe's UI.** | No teardown screenshots exist, so a clone would be invented. A storyboard shows the pain honestly; the toggle still gives a hiring manager a before/after. |
| D6 | **10 screens, one linear flow, scripted scenario switches (no driver, driver cancels, route change, driver asks for cash).** | Fewer excellent screens beat a wide shallow app; scenario switches show state design without extra screens. |
| D7 | **Sinhala / Tamil / English toggle is global; full coverage on the 5 fare-and-help screens, English fallback with a visible "EN" chip elsewhere.** | Translation is the riskiest copy; cover where it matters and be visible about the gap. All si/ta strings flagged for native-speaker review. |
| D8 | **Research honesty: the case study states it is desk research only (about 30 reviews and posts, trilingual benchmark), no teardown, no interviews, and lists primary research as step one of next steps.** | A fabricated interview is a career-ending find for a hiring manager; a stated gap is a mature one. |
| D9 | **Numbers policy: no funnel conversion rates or test results are presented as real. Every rate is tagged "assumption" with its reasoning. Case-study metrics count things done, not outcomes.** | Hard constraint; also matches the house style of the other case studies ("stated only as far as the facts support"). |
| D10 | **Personal LinkedIn posts are excluded as evidence everywhere.** | Private individuals, seen only as search snippets. |
| D11 | **Out of scope: signup/OTP redesign, Food/Trucks/Flash, driver app, maps SDK, live pricing, dark mode, native build, Figma files.** | Nothing in the evidence points there; each would cost more than it proves. |
| D12 | **Deadline shape: one day of agent work after this plan; T1 first, then a parallel fan-out, then one integration pass and three review panels.** | Matches the two-tier model strategy in the user's working preferences. |

## 2. Problem framing, funnel model, hypotheses

### Problem statement
A new PickMe rider has no trouble installing or signing up (no evidence otherwise), but the first ride is where trust is won or lost: the fare shown at booking is not the fare charged, the trip can keep running after arrival because only the driver can end it, the app says card but the driver wants cash, and when any of that happens there is no help that answers. Each of these is a reason not to take a second ride.

### Funnel model (illustrative; every rate is an assumption)
No PickMe funnel data exists publicly. The stage list is standard for ride-hailing; the rates are chosen to make the shape visible and must never be quoted as fact. The reasoning column is the only part with evidential weight.

| Stage | Illustrative rate from previous stage | Why this shape (assumption reasoning) |
|---|---|---|
| S1 Install, open | 100% (base) | Start of model. |
| S2 Signup complete | 85% | Phone+OTP is the regional norm (benchmark: Uber [V], Gojek/Careem/Rapido [S]); no complaints found, so modelled as a small leak. |
| S3 Destination set | 80% | Standard "where to" intent step; no evidence of friction. |
| S4 Fare seen | 95% | Fare appears automatically once destination is set. |
| S5 Booking confirmed | 60% | First trust gate. Reviews compare PickMe unfavourably with Uber on price stability; peak +15 to 25% on tuks is reported [snippet]. |
| S6 Driver matched and arrived | 75% | Waits, "no driver found", drivers who cancel or ask riders to cancel (about 5 reviews). |
| S7 Trip completed and paid without dispute | 85% | Fare above estimate, driver-only trip end, cash demanded on card trips (about 12 reviews across three themes). |
| S8 Second ride within 7 days | 45% | The giving-up trigger in reviews is an unresolved fare or support problem, so S7 failures are modelled as S8 losses. |

Compound S1 to S8 at these rates is about 11%. The point of the model is where the leaks sit: S5 to S8 (fare and trust), not S1 to S4 (onboarding). The prototype attacks S5, S7 and S8.

### Hypotheses, ICE-ranked (1 to 10 each; scores are judgement, not data)

| Rank | Hypothesis | Impact | Confidence | Ease | ICE | Funnel stages |
|---|---|---|---|---|---|---|
| **1 (primary bet)** | **H1 Fare you can hold.** If the booking screen shows a fixed fare with a breakdown (base, distance, peak), states the only three things that can change it, and the receipt explains any delta line by line before charging, then booking confirmation and second-ride rate rise because the fare becomes a promise instead of a guess. | 9 | 7 | 8 | 24 | S5, S7, S8 |
| 2 | **H2 Rider-side trip end.** If the rider can confirm "I've arrived" and end the trip themselves when the driver has not ended it within 60 seconds, then disputed fares and card overcharges fall. | 8 | 7 | 6 | 21 | S7, S8 |
| 3 | **H3 Payment agreed before pickup.** If the payment method is chosen on the booking screen with cash as a first-class option, and the driver's acceptance shows "driver has agreed: card", then cash-demand incidents and cancellations fall. | 7 | 6 | 7 | 20 | S5, S6, S7 |

H4 (one-tap dispute with a ticket number and a stated reply time) is folded into H1's receipt screen because an explained delta without a route to contest it is only half a promise.

## 3. Prototype spec

Frame: phone frame (390 x 844) centred on desktop with the concept note and demo controls beside it; full-screen under 600px. A permanent banner inside the frame reads "Unofficial concept. Not affiliated with PickMe." Mock city: Colombo. Mock places: Fort Railway Station, Bambalapitiya Junction, Nugegoda, Borella, Mount Lavinia Beach. Currency LKR. All fares are invented round numbers.

### Screens

| # | Route | Screen | Purpose | Key content and English copy | States | Interactions | Serves |
|---|---|---|---|---|---|---|---|
| 0 | `#/` | **Intro** | Say what this is, set language, start | Title "A first ride you can trust". Note "Unofficial concept by Susith Alwis. Not affiliated with PickMe. Built from public reviews; no interviews yet." Language segmented control EN / සිං / தமிழ். Buttons "Start the ride", "See the problem first". | default | Language changes `html lang` and persists in `sessionStorage`. | all |
| 1 | `#/problem` | **Problem storyboard** | Show the pain honestly, without a UI clone | Heading "What new riders say goes wrong (public reviews, 2025 to 2026)". Four panels, each an illustration-free card: situation line, one quote under 15 words with platform and date, "where it bites" tag. Panel 1 fare: "Charges you way higher than the estimated" (Trustpilot, 1 Oct 2025). Panel 2 trip end: "only the driver can end journey even though you reached your destination" (Trustpilot, 1 Oct 2025). Panel 3 cash: "ask you to pay with cash even though it's set up for card" (App Store, 26 Jul, year not shown). Panel 4 support: support ticket closed "without feedback" (App Store, 5 Jun). Footer "These are reviews, not a reconstruction of the app's screens." | default | "Design for this" jumps to screen 2. | framing |
| 2 | `#/where` | **Where to?** | Destination entry | Pickup chip "Near Bambalapitiya Junction (GPS, mock)". Search field placeholder "Where to?". Five mock places as a list. Helper "Fare is shown before you book." | default, empty search ("No places match"), | Select a place to go to screen 3. Enter key works. | S3, S4 |
| 3 | `#/ride` | **Choose your ride** | Fare and payment gate, the hero screen | Cards Tuk LKR 540, Flex LKR 890, Car LKR 1,240, each "about 12 min away". **Treatment:** price label "Fixed fare" plus a one-line "Includes peak +15% now" when peak is on, and a link "What can change this?" to screen 4. **Control:** "Estimated LKR 470 to 620", no breakdown, no link. Payment row: Cash (default, selected) / Card, with helper "Your driver sees the method you chose." CTA "Book Tuk · LKR 540". | default, peak on/off, control/treatment | Radiogroup for ride type (arrow keys), radiogroup for payment, CTA to screen 5. | H1, H3 |
| 4 | `#/fare` | **How this fare is made** | Fare breakdown and the promise | Bottom sheet. Lines: Base LKR 100, Distance 6.2 km LKR 372, Peak +15% LKR 68, Total LKR 540. Section "Only three things can change this fare": waiting over 5 minutes at pickup (LKR 10/min), a route change you approve, a stop you add. Line "If it changes, you'll see why before you pay." Button "Got it". | treatment only (control shows "Fare is an estimate. Final fare may vary." and nothing else) | Dialog with focus trap, Esc closes, returns focus to the trigger. | H1 |
| 5 | `#/finding` | **Finding your driver** | Matching with honest states | Loading: "Finding a tuk near you" with elapsed time, "Cancel, no charge". Matched: driver first name, 4.8 rating, vehicle "Bajaj tuk, blue, WP ABC-1234", "3 min away", badge "Driver agreed: Cash", masked call button "Call (number hidden)", "Share trip link". | loading, matched, **no driver** ("No tuk free right now. Try Flex at LKR 890 or wait 2 min", no charge), **driver cancelled** ("Your driver cancelled. We're finding another; your fare stays LKR 540, no cancellation fee") | Scenario switches from demo controls; "Continue" to screen 6. Live region announces state changes. | H3, S6 |
| 6 | `#/trip` | **On the way** | In-trip transparency | Stylised route bar (no map SDK) with "Fort Railway Station · 9 min". "Fare so far: LKR 540 (unchanged)". Buttons "Share trip", "Safety (hold 3 s)". **Route change event:** inline notice "Driver took a longer route because of a road closure. +LKR 120. Accept / Ask at the end". | default, route change (treatment shows the notice; control silently moves the total) | Notice is a live region; Accept updates the fare; "Ask at the end" flags the receipt. | H1 |
| 7 | `#/arrived` | **You've arrived** | Rider-side trip end | "Have you arrived at Fort Railway Station?" Buttons "Yes, end my trip" / "Not yet". Line "The driver can also end the trip. If neither of you does within 60 s of arrival, the fare stops counting." **Control:** "Waiting for the driver to end the trip", no button. | treatment, control, waiting countdown | Primary action ends the trip, goes to screen 8. | H2 |
| 8 | `#/receipt` | **Your fare** | Explained delta, the pay moment | "LKR 540, as booked" or, with route change, "LKR 660 · LKR 120 more than booked" with lines "Route change (accepted on trip) +LKR 120". "Pay cash to driver" / "Charged to card ••1234". Rating 1 to 5. Button "Something's not right". | as booked, changed-and-explained, flagged-from-trip | "Something's not right" opens screen 9. | H1, H4 |
| 9 | `#/help` | **Get help** | Support that answers | Three one-tap reasons: "Fare is higher than explained", "Driver asked for cash on a card trip", "This trip didn't happen". Then "Ticket #PM-4821 opened. We reply within 24 hours. The extra LKR 120 is on hold." Button "Back to start". | reason picked, submitted | Radio list, submit, confirmation in a live region. | H4, S8 |

Secondary surfaces (not screens): **Demo controls** drawer (desktop: beside the frame; mobile: a bottom sheet opened from a "Demo" button) with Variant (Control / Treatment), Peak pricing, Scenario (Normal / No driver / Driver cancels / Route change / Driver asks for cash), Language, Reduced motion override. All are plain form controls.

### Variant mechanism
A single `variant: 'control' | 'treatment'` in app state. Screens 3, 4, 6, 7 read it. A chip in the frame header reads "Control" or "Treatment" at all times so screenshots are self-labelling. Control copy is generic ("Estimated", "Waiting for the driver") and the demo panel says "Control is a typical ride-hailing pattern, not PickMe's interface."

### Design tokens (distinct from PickMe's yellow/black)
Contrast ratios computed with the WCAG relative-luminance formula; all text pairs meet AA (4.5:1 normal text, 3:1 large and UI).

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--ink` | `#14213D` | body text | 15.3:1 on `--paper`, 16.0:1 on white |
| `--ink-2` | `#5B6470` | secondary text | 5.7:1 on `--paper`, 6.0:1 on white |
| `--paper` | `#FAFAF7` | app background | base |
| `--surface` | `#FFFFFF` | cards, sheets | base |
| `--primary` | `#0B6E6D` (deep teal) | CTA, links, selected | white on primary 6.1:1; primary on `--paper` 5.8:1 |
| `--primary-soft` | `#E6F4F3` | selected card tint | `--ink` on it 14.2:1; `#085E5D` text on it 6.7:1 |
| `--danger` | `#B42318` | errors, cancellations | 6.6:1 on white, 6.1:1 on `#FEF3F2` |
| `--warn-ink` / `--warn-bg` | `#7A4E00` / `#FFFBEB` | fare change notices | 6.9:1 |
| `--ok-ink` / `--ok-bg` | `#067647` / `#ECFDF3` | "as booked", agreed badges | 5.4:1 |
| `--border` | `#6B7584` | input and card borders | 4.7:1 on white (UI needs 3:1) |
| `--focus` | `#14213D` 2px solid + 2px white offset | focus ring | visible on all surfaces |

Type scale (rem; base 16px; Sinhala/Tamil get `line-height: 1.6` because of taller glyphs): display 1.75/1.2 semibold, title 1.25/1.3 semibold, body 1/1.5, small 0.875/1.5, caption 0.75/1.4 (used only with `--ink-2`, never below 0.75rem). Fonts: `Inter, system-ui` for Latin; `"Noto Sans Sinhala"` and `"Noto Sans Tamil"` from Google Fonts with `font-display: swap` and system fallback.

Spacing: 4-point scale, tokens `--s1..--s8` = 4, 8, 12, 16, 24, 32, 48, 64. Radius `--r-sm` 8, `--r-md` 12, `--r-lg` 20. Touch targets minimum 44x44 (WCAG 2.2 target size 24x24 AA exceeded). Motion: 160 ms ease-out transitions only; `prefers-reduced-motion: reduce` disables all transitions and the matching spinner becomes a static "Searching" label with elapsed seconds.

## 4. Technical plan

### Folder structure (`prototype/`)
```
prototype/
  index.html
  package.json  vite.config.ts  tsconfig.json  .eslintrc.cjs  playwright.config.ts  vitest.config.ts
  public/favicon.svg
  src/
    main.tsx                  app bootstrap, HashRouter
    app/App.tsx               layout: PhoneFrame + DemoControls + routes
    app/routes.tsx            route table
    state/rideMachine.ts      reducer, types, initial state
    state/RideContext.tsx     provider + hooks (useRide, useVariant, useScenario)
    state/mock.ts             places, rides, fares, driver
    i18n/I18nContext.tsx      provider, t(), setLang, sets <html lang>
    i18n/types.ts             StringKey union derived from en
    i18n/strings/en.ts  si.ts  ta.ts
    components/PhoneFrame.tsx  ConceptBanner.tsx  Button.tsx  Sheet.tsx  Notice.tsx  Radio.tsx  LiveRegion.tsx  LangToggle.tsx  DemoControls.tsx
    screens/Intro.tsx  Problem.tsx  Where.tsx  Ride.tsx  Fare.tsx  Finding.tsx  Trip.tsx  Arrived.tsx  Receipt.tsx  Help.tsx
    styles/tokens.css  base.css  components.css
    screens/*.module.css      one per screen
  tests/unit/rideMachine.test.ts  i18n.test.ts
  tests/e2e/flow.spec.ts  a11y.spec.ts
```

### State model
`rideMachine.ts`: `type Step = 'intro'|'problem'|'where'|'ride'|'fare'|'finding'|'trip'|'arrived'|'receipt'|'help'`. State: `{ step, variant, lang, scenario: 'normal'|'noDriver'|'driverCancel'|'routeChange'|'cashDemand', peak: boolean, destination?: Place, rideType?: 'tuk'|'flex'|'car', payment: 'cash'|'card', fare: { base, distance, peak, changes: FareChange[] }, driver?: Driver, finding: 'searching'|'matched'|'none'|'cancelled', routeChangeDecision?: 'accepted'|'askLater', ticket?: string }`. Actions are named events (`SET_DESTINATION`, `CHOOSE_RIDE`, `BOOK`, `DRIVER_FOUND`, `ROUTE_CHANGED`, `ACCEPT_CHANGE`, `END_TRIP`, `OPEN_TICKET`, `SET_VARIANT`, `SET_SCENARIO`, `RESET`). The route is derived from `step`; navigating by URL dispatches `GOTO` so deep links work. Timers (matching 2.5 s, driver cancel 4 s) live in `Finding.tsx` effects and are skipped under reduced motion in favour of a "Skip wait" button that is always present anyway.

### i18n
`en.ts` is the source of truth; `StringKey = keyof typeof en`; `si` and `ta` are `Partial<Record<StringKey,string>>`. `t(key)` returns the translation or English and, when it falls back, the screen shows one "EN" chip (via `useHasFallback()`), not per string. `html[lang]` is set to `en`, `si` or `ta` so screen readers pick the right voice. Every si/ta file starts with a comment-free `reviewStatus: 'machine-draft, needs native review'` export that `Intro` surfaces as a footnote. Translation scope: screens 0, 3, 4, 7, 8, 9 fully; others fall back.

### Routing and Pages
`HashRouter` from `react-router-dom`. `vite.config.ts` sets `base: process.env.BASE_PATH ?? '/'`; the workflow passes `/pickme-first-session/`. `index.html` has `<meta name="robots" content="noindex">` removed only on main (keep indexable; it is a portfolio piece) and the `<title>` "First ride concept (unofficial)".

### Accessibility checklist (WCAG 2.2 AA)
- Semantic landmarks: `header` (banner), `main` (screen), `aside` (demo controls), one `h1` per screen.
- Focus: on screen change, focus moves to the `h1`; dialogs trap focus and restore it; focus ring token on every interactive element; no `outline: none`.
- Radiogroups for ride type, payment and help reasons with arrow-key movement and `aria-checked`.
- Live regions: matching state, fare change notice, ticket confirmation (`aria-live="polite"`; driver-cancel uses `assertive`).
- Reduced motion honoured (tokens.css media query + `useReducedMotion` hook). Nothing depends on hover.
- Target size 44px; text resizes to 200% without clipping (test in Playwright with `page.setViewportSize` and zoom).
- Colour never the only signal: badges carry text, fare changes carry "+LKR".
- `lang` switching, Sinhala/Tamil fonts loaded, no text in images.
- Keyboard-only run of the full flow is an e2e test; axe has zero violations on every screen in both variants and all three languages.

### Testing
- **Vitest + Testing Library**: reducer transitions for every scenario; i18n test asserting every key used by the 6 fully translated screens exists in `si` and `ta`; `Fare` renders breakdown totals that sum.
- **Playwright** (chromium, mobile and desktop projects): `flow.spec.ts` walks intro to help with keyboard only in treatment and control; `a11y.spec.ts` runs `@axe-core/playwright` on each route x variant x language (60 checks) and asserts no violations; one reduced-motion run asserts no CSS transitions are active.
- Lint: ESLint (typescript, react-hooks, jsx-a11y recommended) + Prettier.

### GitHub Actions (`.github/workflows/pages.yml`)
```yaml
name: pages
on: { push: { branches: [main] }, workflow_dispatch: {} }
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: prototype } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm, cache-dependency-path: prototype/package-lock.json }
      - run: npm ci
      - run: npm run lint && npm run test
      - run: npx playwright install --with-deps chromium
      - run: npm run e2e
      - run: npm run build
        env: { BASE_PATH: /pickme-first-session/ }
      - uses: actions/upload-pages-artifact@v3
        with: { path: prototype/dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
Repo setting: Pages source = GitHub Actions. `dist/404.html` is a copy of `index.html` so a direct hit on a hash route still loads.

## 5. A/B experiment plan outline

- **Unit and audience:** new rider accounts (first booking attempt), Western Province, Android and iOS, assigned at first fare view, 50/50, sticky by account.
- **Treatment:** H1 fare screen plus explained receipt (the primary bet). H2 and H3 are follow-on tests, not bundled, so the result is attributable.
- **Primary metric:** second completed ride within 7 days of the first completed ride (S8). Chosen because the complaint evidence says fare shock loses the *next* ride, not this one.
- **Secondary:** booking confirmation rate from fare view (S5); first-trip completion without a fare dispute (S7).
- **Guardrails (stop or do-not-ship if breached):** cancellation rate after match up +1 pp absolute; driver acceptance rate down 2 pp (fixed fares may shift risk to drivers); support contacts per 100 trips up; gross take per trip down more than 2%; crash-free sessions unchanged.
- **MDE and sample size (all inputs are assumptions):** two-proportion z-test, two-sided alpha 0.05, power 0.80. Baseline D7 second-ride rate p = 0.45 (assumption, same as funnel stage S8; no public figure). MDE = 3 pp absolute (0.45 to 0.48, 6.7% relative; a smaller lift would not justify the driver-side pricing change).
  n per arm = 2 x (z_{0.975} + z_{0.80})^2 x p̄(1-p̄) / d^2 = 2 x (1.96 + 0.84)^2 x 0.465 x 0.535 / 0.03^2 ≈ 4,334 new riders per arm, about 8,700 total. At MDE 4 pp it is about 2,441 per arm.
- **Duration:** company coverage reports a peak of over 250,000 new consumers in one month (secondary source, FY24/25). About 22,660 fare views are needed to yield about 8,700 completed first rides (assumed 0.60 x 0.75 x 0.85 completion from fare view); at a tenth of that peak month that takes about 27 days before any regional filter. Run at least 3 full weeks of enrolment plus 7 days for the primary metric to mature, and size the real duration from measured traffic. Do not peek before the fixed end.
- **Decision rules:** ship if primary lift is significant and no guardrail breached; iterate if S5 improves but S8 does not (promise believed, not kept); kill if driver acceptance guardrail breaches, and move to H2 which costs drivers nothing.
- **Instrumentation to add:** `fare_breakdown_opened`, `fare_change_shown`, `fare_change_accepted`, `trip_ended_by: rider|driver|timeout`, `receipt_delta_lkr`, `help_reason`, `ticket_opened`.

## 6. Docs list for the repo

```
README.md                         title, one-paragraph summary, live prototype link, honesty box, how to run, structure
PLAN.md                           this file
research/00-teardown-guide.md     (exists) marked "not yet done"
research/01-context.md            (exists)
research/02-review-mining.md      (exists)
research/03-benchmark.md          (exists)
research/04-interview-guide.md    (exists) marked "not yet run"
docs/funnel-audit.md              problem statement, stage model with assumption labels, evidence per stage, what data would replace each assumption
docs/hypotheses.md                H1 to H4 with ICE table and the fold-in of H4
docs/experiment-plan.md           section 5 expanded, with the event spec and a mock dashboard sketch in text
docs/decisions.md                 section 1 plus any decisions made during the build, dated
docs/prototype-spec.md            section 3 (screens, states, copy, tokens) so the prototype has a spec of record
docs/next-steps.md                primary research first: teardown on a clean device, 5 interviews, Play review scrape; then H2/H3 tests
prototype/README.md               run, test, deploy, i18n notes, translation review status
```
README.md outline: `# PickMe first ride: an unofficial growth concept` · badge row (Pages deploy, licence MIT for code, CC BY 4.0 for docs) · "What this is / is not" (three lines, the non-affiliation line bold) · "The bet in one paragraph" · "Live prototype" link and a 2-line "how to use the demo controls" · "Research honesty" (desk research only, about 30 items, the exclusions) · "Structure" tree · "Run it" · "Status and next steps".

## 7. Portfolio case study draft (maps to `CaseStudy` in `app/data/work.ts`)

- `slug: 'pickme-first-session'`, `index: '04'`, `title: 'A first ride you can trust'`, `kicker: 'Unofficial growth concept for a Sri Lankan ride-hailing app'`, `role: 'Product designer · frontend engineer'`, `company: 'Self-initiated concept'`, `year: '2026'`, `stack: ['React 18', 'Vite', 'TypeScript', 'Vitest', 'Playwright', 'axe', 'GitHub Pages']`, `disciplines: ['Design', 'Frontend']`, `accent: '#0B6E6D'`.
- `summary`: One paragraph: unsolicited concept for PickMe's new-rider first ride; desk research on public reviews and six competitor apps; funnel audit; a coded, trilingual, accessible prototype; an A/B plan. Not affiliated.
- `problem`: New riders say the fare charged is not the fare shown, the trip can keep running after arrival, the driver asks for cash on a card trip, and support does not answer.
- `credit`: "Solo project. Research, design, code and test plan are mine. Reviews quoted are public; no PickMe material or data was used. Sinhala and Tamil copy is a draft awaiting native-speaker review."
- `metrics` (counts, not outcomes): `{ value: '~30', label: 'public reviews and posts read across 4 platforms' }`, `{ value: '10 screens', label: 'coded prototype in Sinhala, Tamil and English' }`, `{ value: '0 violations', label: 'axe checks across every screen, variant and language' }`.
- `sections` (heading: one-line content):
  1. **What this is and is not**: unsolicited, no access, no data, no affiliation; why PickMe (daily app in Colombo, listed company, visible review record).
  2. **Finding the real first-session problem**: expected signup friction, found none; the evidence sits between estimate and receipt.
  3. **A funnel built from assumptions, honestly labelled**: the stage model and why the leak is post-confirm.
  4. **The bet: a fare you can hold**: H1 and the two supporting hypotheses with ICE.
  5. **Designing the flow in code**: the ten screens, control/treatment, scenario states, no PickMe UI cloned.
  6. **Three languages and a screen reader from day one**: i18n approach, `lang`, Noto fonts, 44px targets, reduced motion.
  7. **How I would test it**: primary metric, guardrails, sample-size reasoning.
  8. **What is missing**: no teardown, no interviews, no real numbers; next steps.
- `flows[4]` (after section index 4), FlowDiagram spec: `title: 'How the fare promise travels through the ride'`, `cols: ['Rider', 'Prototype screens', 'Ride state', 'Outcome']`, nodes: `rider` (actor, col 0, row 1), `ride` "Choose your ride · fixed fare" (ui, 1, 0), `fare` "How this fare is made" (ui, 1, 1), `trip` "On the way · change notice" (ui, 1, 2), `arrived` "You've arrived · rider ends" (ui, 1, 3), `machine` "Ride reducer" (service, 2, 1), `changes` "Fare changes log" (store, 2, 2), `receipt` "Explained receipt" (ui, 3, 1), `help` "Ticket in 24 h" (external, 3, 2). Edges: rider→ride, ride→fare "what can change", ride→machine "BOOK", machine→trip, trip→changes "ROUTE_CHANGED", arrived→machine "END_TRIP", changes→receipt "delta lines", receipt→help dashed "something's not right". Steps: one line per node explaining the promise at that point.
- `processNotes` (discover, design, build, ship, measure): "Mined about 30 public reviews and posts and benchmarked six apps before deciding what to design; found the problem was not where I expected." / "Wrote the screens as copy and states first, then built them; the control variant is a generic pattern, not a reconstruction of PickMe." / "React, Vite and TypeScript with a reducer-driven ride state, so every scenario is a dispatch away." / "Deployed to GitHub Pages through Actions; lint, unit, keyboard-only e2e and axe gate every push." / "Nothing is measured yet: the experiment plan states the metric, guardrails and the sample size it would need."
- `highlights`: "The fare screen states the only three things that can change the price." / "A rider can end the trip 60 seconds after arrival if the driver has not." / "The receipt explains every rupee of difference before payment." / "Control and treatment are one toggle apart, so the comparison is in the prototype itself."
- `outcome`: "A deployed, trilingual, accessible prototype of one flow, with the research, funnel reasoning and test plan that led to it. No metric claims: the work has not been tested with riders or shipped."
- `reflection`: "I would run the teardown and five interviews before building; the storyboard stands in for evidence I should have gathered first. I would also test H2 before H1 if driver-side pricing proved contentious."
- `links`: `{ label: 'Live prototype', href: 'https://susithd.github.io/pickme-first-session/' }`, `{ label: 'Repository', href: 'https://github.com/SusithD/pickme-first-session' }`.
- `compare`: before = screenshot of screen 3 in Control, after = screen 3 in Treatment, labels "Control · typical pattern" / "Treatment · fixed fare", caption "Same screen, one toggle. Control is a generic pattern, not PickMe's interface."
- `media`: `{ url: 'susithd.github.io/pickme-first-session', desktop: '/img/work/pickme/frame-desktop.jpg', mobile: '/img/work/pickme/ride-mobile.jpg' }`.
- `cover`/`covers`: hero = Treatment ride screen in the phone frame on desktop; covers[k+1] per section: storyboard (2), funnel figure exported from docs (3), fare sheet (4), finding-driver cancelled state (5), Sinhala receipt (6), experiment table (7), empty string elsewhere.
- `gallery` shots to capture (all at 390x844 inside the frame, plus two desktop): intro; storyboard; where-to; ride Control; ride Treatment; fare sheet; finding (matched); finding (driver cancelled); trip with route-change notice; arrived; receipt with delta; help ticket; receipt in Sinhala; ride in Tamil; desktop frame with demo controls (wide); mobile full-screen ride.

## 8. Work breakdown (file ownership is exclusive per task)

All paths under `/Users/susithsecondry/Documents/pickme-first-session/`. Executor: Haiku unless marked. Acceptance criteria are checked by the integrator (T12), not self-reported.

**T1 Scaffold (sequential, first; Sonnet).** Owns `prototype/package.json, vite.config.ts, tsconfig*.json, index.html, .eslintrc.cjs, .prettierrc, vitest.config.ts, playwright.config.ts, src/main.tsx, src/app/*, src/state/*, src/i18n/I18nContext.tsx, src/i18n/types.ts, src/i18n/strings/en.ts (keys for all screens, English copy from section 3), src/i18n/strings/si.ts and ta.ts (empty partials), src/components/*, src/styles/*, .github/workflows/pages.yml, prototype/README.md`. Also creates placeholder `src/screens/*.tsx` that render their `h1` only. AC: `npm run dev` shows frame with banner, demo controls and lang toggle; `npm run lint`, `npm run test`, `npm run build` pass; reducer unit tests cover every action; tokens.css matches section 3 values exactly; placeholder route for all 10 screens works.

**Parallel after T1 (each owns only its screen file, its module.css and its test):**
- **T2** `src/screens/Intro.tsx`, `Problem.tsx` (+css). AC: quotes and attributions exactly as section 3; no PickMe imagery; "EN" chip logic not needed (English-only content on Problem is by design and says so).
- **T3** `src/screens/Where.tsx`, `Ride.tsx` (+css). AC: radiogroups keyboard-operable; Control/Treatment copy differs as specified; CTA label includes fare.
- **T4** `src/screens/Fare.tsx`, `Trip.tsx` (+css). AC: Sheet focus trap; route-change notice is a live region; totals sum from state, not hard-coded.
- **T5** `src/screens/Finding.tsx`, `Arrived.tsx` (+css). AC: four finding states, timers skipped under reduced motion, "Skip wait" always present; Arrived countdown announces once.
- **T6** `src/screens/Receipt.tsx`, `Help.tsx` (+css). AC: delta lines rendered from `fare.changes`; ticket number from state; confirmation in live region.
- **T7** `src/i18n/strings/si.ts`, `ta.ts`. AC: every key used by screens 0, 3, 4, 7, 8, 9 present; strings short; file exports `reviewStatus`; i18n unit test passes. (Sonnet; flag every string as draft.)
- **T8** `tests/e2e/flow.spec.ts`, `tests/e2e/a11y.spec.ts`. AC: keyboard-only walk in both variants; axe matrix over routes x variants x languages passes against the integrated build (will run red until T2 to T7 land; written against the spec).
- **T9** `docs/funnel-audit.md`, `docs/hypotheses.md`. AC: every rate labelled assumption; every evidence line cites a research file section; no quote over 15 words; LinkedIn anecdote absent.
- **T10** `docs/experiment-plan.md`, `docs/next-steps.md`, `docs/decisions.md`, `docs/prototype-spec.md`, `README.md` (rewrite). AC: formula and inputs shown; README has the honesty box and the Pages link; decisions dated.
- **T11** Portfolio entry: `susith-portfolio/app/data/work.ts` (append entry only) and `susith-portfolio/app/public/img/work/pickme/` placeholders list. AC: type-checks against `CaseStudy`; no metric is an outcome claim; gallery `src` list matches section 7 shot list; covers reference gallery srcs. (Runs last among the parallel set; images are captured in T12.)

**T12 Integration (main session, after all).** Wire screens into routes, run lint + unit + e2e + axe + build locally, capture the gallery shots with Playwright into `susith-portfolio/app/public/img/work/pickme/`, create the GitHub repo with the D3 description, push, enable Pages, confirm the live URL, then run the review panels (section 9) and fix findings. Not delegated.

## 9. Review panels

Run after docs (T9, T10), after the prototype (T12), and on the case study (T11). Each reviewer returns findings as blocking / should-fix / nit with file and line.

| Reviewer | Checks |
|---|---|
| **Head of Growth Design (hiring manager, e.g. Chess.com Growth)** | Is the bet sharp and falsifiable; does the funnel reasoning hold without data; are hypotheses ranked with stated trade-offs; is the experiment plan something a PM would sign; does the case study show judgement, not just output; would they book an interview. |
| **Sri Lankan rider and market reviewer** | Colombo place names and tuk/Flex/Car naming plausible; LKR fares in a believable range for 6 km; cash-first default matches local habit; peak pricing described as it is reported; Sinhala/Tamil strings readable and not machine-garbled; no cultural tone-deafness in copy; the storyboard reflects what riders actually complain about. |
| **Accessibility specialist (WCAG 2.2 AA)** | Keyboard-only completion; focus management on route change and dialogs; radiogroup semantics; live regions not chatty; 44px targets; contrast of every token pair in context; 200% zoom; `lang` switching; reduced motion; axe is necessary not sufficient, so a manual VoiceOver pass on three screens. |
| **Fact-checker and honesty reviewer** | Every number is sourced or labelled assumption; quotes under 15 words with platform and date and matching `02-review-mining.md`; no invented users, interviews or results; no PickMe logo, colours or UI reconstruction; the non-affiliation note is always visible; LinkedIn anecdote absent; "desk research only" stated in README, docs and case study; metrics in `work.ts` are counts. |
| **Senior frontend engineer** | Reducer is the single source of truth; no duplicated state in screens; types strict, no `any`; i18n keys typed; CSS tokens used, no magic colours; bundle under 200 kB gzipped; CI green on a clean clone; `base` path correct; 404 fallback; tests meaningful (not snapshot-only); no explanatory comments; commit messages carry the why. |

## 10. Addendum (2026-10-11): cover onboarding and the first ride

The owner asked to cover both the install-to-first-booking stretch and the first ride. This addendum overrides D1, D3, D6, D11, the screen list, H-ranking and the case-study title where they conflict.

### Decisions
| # | Decision | Rationale |
|---|---|---|
| D13 | **Two-part scope: Part A "Get to a fare fast" (install to booking), Part B "A first ride you can trust" (booking to receipt and help).** Part B stays the primary bet. | Part B has review evidence; Part A rests on benchmark evidence (Uber's documented onboarding change [V]) and is a lower-confidence bet. Saying so is the point. |
| D14 | **Repo `SusithD/pickme-first-session`**, Pages `https://susithd.github.io/pickme-first-session/`. Description: `Unofficial growth concept for a new PickMe rider's first session in Sri Lanka, from install to a first ride they can trust: desk research, funnel audit, hypotheses, coded React prototype and A/B test plan. Not affiliated with PickMe.` | Name now matches the full scope and the local folder. All `pickme-first-session` URLs and `BASE_PATH` in this plan become `pickme-first-session`. |
| D15 | **Part A treatment: fare before account.** A new rider picks a language, sets a destination and sees the fixed fare before any signup; phone number and OTP are asked only at "Book"; location is asked in context with a one-line reason; notifications are asked after booking, tied to "tell you when your driver arrives". **Control:** a generic account wall first (language, phone, OTP, permissions, then home). | Moves the value (a believable fare) ahead of the cost (signup), which is the benchmarked pattern; ties every permission to a moment the rider understands. |
| D16 | **Signup copy stays honest:** "No password. We text you a 6-digit code." The OTP field supports paste and one-time-code autofill (`autocomplete="one-time-code"`); a "Didn't get it? Resend in 30 s" state and a "Wrong number" back link. | Small, standard, accessible; nothing invented about PickMe's current signup. |

### Added screens (13 total)
| # | Route | Screen | Purpose | Key content | States | Serves |
|---|---|---|---|---|---|---|
| A1 | `#/welcome` | **Welcome** | In-app first launch | Language choice as three large buttons (English / සිංහල / தமிழ்), then "Where are you going?" CTA. Control: "Create an account to continue" with phone field first. | treatment, control | H5 |
| A2 | `#/location` | **Location primer** | Ask for location in context | Sheet over Where-to: "Allow location so your driver finds you. You can also type your pickup." Buttons "Allow while using" / "Type pickup instead". Mock only, no real permission request. | allowed, typed | H5, S3 |
| A3 | `#/verify` | **Confirm your number** | Signup at the moment of booking | Shown after "Book" when not signed in (treatment). Step 1 phone (+94 prefix, 9 digits, inline validation); step 2 six-digit code, paste/autofill, resend timer, wrong-number link. Then returns to booking with fare unchanged ("Still LKR 540"). Notifications primer appears on Finding after the match: "Turn on alerts to know when your driver arrives." | phone, code, invalid code, resend wait | H5, S2 |

Flow (treatment): Intro → Welcome → Where (+ location primer) → Ride → Fare sheet → Verify → Finding (+ notification primer) → Trip → Arrived → Receipt → Help. Control puts Verify and both permission asks straight after Welcome.

### Hypothesis H5 (Part A)
**H5 Fare before account.** If a new rider can see a fixed fare for their own trip before signing up, and permissions are asked at the moment they matter, then more installs reach a confirmed booking (S2 to S5) because the rider sees value before paying the signup cost. Impact 7, Confidence 5 (benchmark-based: Uber [V]; no PickMe complaint evidence), Ease 7, ICE 19. Ranked fourth; run as a separate test from H1 so results stay attributable. Primary metric: confirmed first booking within 24 h of install. Guardrails: OTP failure rate, fraudulent/no-show bookings by new accounts, fare-quote API load.

### Work-breakdown changes
- T1 adds placeholder routes and en keys for A1 to A3, a `signedIn` flag and `permissions` in the reducer, and a `partAVariant` that follows the global variant toggle.
- **T13 (new, parallel)** owns `src/screens/Welcome.tsx`, `Location.tsx`, `Verify.tsx` (+css). AC: OTP input accessible (single input with `inputmode="numeric"` and `autocomplete="one-time-code"`, not six boxes without labels); errors announced; control/treatment differ as specified.
- T7 adds si/ta for Welcome and Verify. T8 adds Part A to the keyboard walk. T9 adds H5 and stage S1 to S4 reasoning. T10/README and T11 use the new repo name and title.

### Case study changes
`slug: 'pickme-first-session'`, `title: 'From install to a first ride you can trust'`, `kicker` unchanged. Section 2 becomes "Two problems, two levels of evidence"; section 4 becomes "Two bets: fare before account, and a fare you can hold". Metrics: "13 screens". Gallery adds Welcome (treatment and control) and Verify.
