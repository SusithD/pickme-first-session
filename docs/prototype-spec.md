# Prototype spec of record

Date 2026-10-11. Consolidates plan sections 3 and 10 (addendum), then the local-market and review fixes. This file is the reference for every screen, route, state, copy string, token and variant rule in the prototype.

Not affiliated with PickMe. Desk research only; no PickMe interface, logo, colour or screen is reproduced. The control variant is a generic ride-hailing pattern, never PickMe's real behaviour. All fares, plates, rates and the 60 s and 24 h values are invented demo values.

## 1. Frame and conventions

- **Phone frame:** 390 x 844 px, centred on desktop with the concept note and demo controls beside it. Full-screen under 600 px wide.
- **Banner:** a permanent banner inside the frame reads "Unofficial concept. Not affiliated with PickMe."
- **Variant chip:** the frame header always shows "Control" or "Treatment", so screenshots are self-labelling.
- **Mock city:** Colombo. Mock places with distance from the pickup: Fort Railway Station 5.8 km, Borella 6.2 km, Wellawatte 3.1 km, Mount Lavinia Beach 8.6 km, Nugegoda 10.4 km.
- **Currency:** LKR. All fares are invented and computed from distance, not copied from any PickMe rate card.
- **Mock pickup:** "Near Bambalapitiya Junction (GPS, mock)".
- **Screen count:** 13. Numbered 0 to 9 (ten screens from the core flow, including the Problem storyboard at 1) and A1 to A3 (Part A, added by the addendum).

## 2. Routes and flow

| Route | Screen | Part |
|---|---|---|
| `#/` | 0 Intro | Shared |
| `#/problem` | 1 Problem storyboard | Shared (framing, not in the linear flow) |
| `#/welcome` | A1 Welcome | A |
| `#/location` | A2 Location primer (sheet over Where) | A |
| `#/where` | 2 Where to? | B (entry point for both parts) |
| `#/ride` | 3 Choose your ride | B |
| `#/fare` | 4 How this fare is made | B |
| `#/verify` | A3 Confirm your number | A |
| `#/finding` | 5 Finding your driver | B |
| `#/trip` | 6 On the way | B |
| `#/arrived` | 7 You've arrived | B |
| `#/receipt` | 8 Your fare | B |
| `#/help` | 9 Get help | B |

**Treatment flow:** Intro (0) → Welcome (A1) → Where (2) with location primer (A2) → Ride (3) → Fare sheet (4) → Confirm your number (A3) at "Book" → Finding (5) with notification primer → On the way (6) → You've arrived (7) → Your fare (8) → Get help (9).

**Control flow:** Intro (0) → Welcome (A1, account wall first) → Confirm your number (A3) → Location primer and notification ask (both right after Welcome) → Where (2) → Ride (3, control copy) → Fare sheet (4, control copy) → Finding (5) → On the way (6) → You've arrived (7, control copy) → Your fare (8) → Get help (9).

The Problem storyboard (1) is reached from Intro ("See the problem first") and is not part of either flow.

## 3. Screens

Each screen lists: route, purpose, copy (English, exact), states, interactions, and the hypothesis it serves.

### 0. Intro · `#/`

- **Purpose:** say what this is, set language, start.
- **Copy:**
  - Title: "A first ride you can trust"
  - Note: "Unofficial concept by Susith Alwis. Not affiliated with PickMe. Built from public reviews; no interviews yet."
  - Language control (segmented): EN / සිං / தமிழ்
  - Buttons: "Start the ride", "See the problem first"
- **States:** default.
- **Interactions:** language change sets `html lang` and persists in `sessionStorage`.
- **Serves:** all.
- **Translation:** full coverage (si, ta). Shows the reviewStatus footnote.

### 1. Problem storyboard · `#/problem`

- **Purpose:** show the pain honestly, without a UI clone.
- **Copy:**
  - Heading: "What riders say goes wrong (public reviews, 2025 to 2026)"
  - Four panels, each a card with no illustration. Each has a situation line, one quote under 15 words with platform and date, and a "where it bites" tag.
  - Panel 1, fare: "Charges you way higher than the estimated" (Trustpilot, 1 Oct 2025). Tag: fare.
  - Panel 2, trip end: "only the driver can end journey even though you reached your destination" (Trustpilot, 1 Oct 2025; a reviewer report, not verified in the app). Tag: trip end.
  - Panel 3, cash: "ask you to pay with cash even though it's set up for card" (App Store, 26 Jul, year not shown). Tag: payment.
  - Panel 4, support: support ticket closed "without feedback" (App Store, 5 Jun, year not shown). Tag: support.
  - Footer: "These are reviews, not a reconstruction of the app's screens."
- **States:** default.
- **Interactions:** "Design for this" jumps to screen 2 (Where).
- **Serves:** framing.
- **Translation:** English only, by design. The screen says so.

### 2. Where to? · `#/where`

- **Purpose:** destination entry.
- **Copy:**
  - Pickup chip: "Near Bambalapitiya Junction (GPS, mock)"
  - Search placeholder: "Where to?"
  - Five mock places as a list (Fort Railway Station, Borella, Wellawatte, Mount Lavinia Beach, Nugegoda)
  - Optional "Pickup note or landmark" field, for example "Opposite the pharmacy, red gate"; the note is shown on the matched card
  - Helper: "Fare is shown before you book."
  - Empty search: "No places match"
- **States:** default; empty search.
- **Interactions:** selecting a place sets the trip distance and goes to screen 3. Enter key works.
- **Serves:** S3, S4.
- **Note:** Part A (A2 location primer) opens as a sheet over this screen. In the treatment, the rider sees this screen before any account exists.

### A1. Welcome · `#/welcome`

- **Purpose:** in-app first launch. Language choice before anything else.
- **Copy (treatment):**
  - Language as three large buttons: English / සිංහල / தமிழ்
  - Then the CTA: "Where are you going?"
- **Copy (control):** "Create an account to continue", with the phone field first.
- **States:** treatment; control.
- **Interactions:** language buttons set the global language. Control CTA leads to A3.
- **Serves:** H5.
- **Translation:** si and ta required (addendum work breakdown, T7).

### A2. Location primer · `#/location`

- **Purpose:** ask for location in context, with a reason. Mock only; no real permission request is made.
- **Copy:**
  - "Allow location so your driver finds you. You can also type your pickup."
  - Buttons: "Allow while using", "Type pickup instead"
- **States:** allowed (sets mock permission to granted and fills the pickup chip with the mock location); typed (pickup chip is left for the rider to type).
- **Serves:** H5, S3.

### 3. Choose your ride · `#/ride`

The hero screen. Fare and payment gate.

- **Purpose:** show the fare and take the payment method.
- **Copy:**
  - Ride cards: Tuk, Small car and Car, with generic names rather than PickMe's own tier names, and a note "Vehicle may vary." Fares depend on the destination. For Borella (6.2 km, peak on): Tuk LKR 543, Small car LKR 815, Car LKR 1,264. Pickup estimates: Tuk about 5 min, Small car 6, Car 8, longer when peak is on.
  - Treatment price label: "Fixed fare". When peak is on, add "Includes peak +15% now" (an invented rate, not PickMe's). Link: "What can change this?" (opens screen 4).
  - Control price label: "Estimated LKR 543" (the same number as the treatment fare, labelled as an estimate). No breakdown, no link. Both arms quote the same number so price level is not a confound.
  - Payment row: Cash (default, selected) / Card. Helper: "Your driver sees the method you chose."
  - CTA: "Book Tuk · LKR 543" (the CTA label includes the fare and the ride type).
- **States:** default; peak on; peak off; control; treatment.
- **Interactions:** radiogroup for ride type (arrow keys); radiogroup for payment; CTA goes to screen A3 if not signed in (treatment), otherwise to screen 5.
- **Serves:** H1, H3.

### 4. How this fare is made · `#/fare`

- **Purpose:** the breakdown and the promise.
- **Form:** bottom sheet.
- **Copy (treatment):**
  - Lines (Tuk, Borella): Base LKR 100; Distance 6.2 km at LKR 60/km LKR 372; Peak +15% LKR 71; Total LKR 543.
  - Per-km rates: Tuk 60 (base 100), Small car 95 (base 120), Car 145 (base 200). Peak is computed as round(15% of the subtotal).
  - Section heading: "Only three things can change this fare"
  - Items: waiting over 5 minutes at pickup (LKR 10/min); a route change you approve; a stop you add.
  - Line: "If it changes, you'll see why before you pay."
  - Button: "Got it"
- **Copy (control):** "Fare is an estimate. Final fare may vary." and nothing else.
- **States:** treatment; control.
- **Interactions:** dialog with focus trap; Esc closes; focus returns to the trigger.
- **Serves:** H1.
- **Requirement:** totals and the peak line are computed from distance and state, not hard-coded. The breakdown sums to the total for every destination and ride type.

### A3. Confirm your number · `#/verify`

Shown after "Book" when not signed in (treatment). Control shows it straight after Welcome.

- **Purpose:** sign-up at the moment of booking.
- **Step 1, phone:**
  - +94 prefix shown. The field accepts 9 digits, a leading 0 (0771234567, stripped) or a pasted 94 prefix (94771234567). Inline validation.
  - Copy: "No password. We text you a 6-digit code."
- **Step 2, code:**
  - Six-digit code, supports paste and autofill (`autocomplete="one-time-code"`), a single input with `inputmode="numeric"` (not six labelled boxes).
  - "Didn't get it? Resend in 60 s", then "Resend" once the wait ends. Hint: "Check the SIM that received the code" for dual-SIM phones.
  - "Wrong number" back link to step 1.
- **After success:** return to the booking with the fare unchanged: "Still LKR 543".
- **Notifications primer:** appears on Finding after the match, not here. Copy: "Turn on alerts to know when your driver arrives."
- **States:** phone; code; invalid code; resend wait.
- **Errors:** announced in a live region.
- **Serves:** H5, S2.

### 5. Finding your driver · `#/finding`

- **Purpose:** matching with honest states.
- **Copy:**
  - Loading: "Finding a tuk near you", with elapsed time, and "Cancel, no charge".
  - Matched: driver first name, 4.8 rating, vehicle "Bajaj tuk, blue" with a plate labelled "sample plate", "5 min away" (longer when peak is on), the rider's pickup note, badge "Driver agreed: Cash", masked call button "Call (number hidden)", "Share trip link".
  - No driver: "No tuk free right now. Try Small car at LKR 815 or wait 2 min" with "no charge".
  - Driver cancelled: "Your driver cancelled. We're finding another; your fare stays LKR 543, no cancellation fee."
  - Notification primer (after match): "Turn on alerts to know when your driver arrives."
- **States:** loading; matched; no driver; driver cancelled.
- **Interactions:** scenario switches from the demo controls. "Continue" goes to screen 6. Live region announces state changes (polite; driver cancelled is assertive). "Skip wait" is always present.
- **Timers:** matching 2.5 s; driver cancel 4 s. Under reduced motion, the timers are replaced by "Skip wait".
- **Serves:** H3, S6.

### 6. On the way · `#/trip`

- **Purpose:** in-trip transparency.
- **Copy:**
  - Stylised route bar (no map SDK): "Fort Railway Station · 25 min" (trip times 20 to 35 min by destination and peak).
  - "Fare so far: LKR 543 (unchanged)"
  - Buttons: "Share trip", "Safety (hold 3 s)". The Safety screen shows "Police emergency: 119" and the share-trip action.
- **Route-change notice (treatment):** "Driver took a longer route because of a road closure. +LKR 120." Buttons: "Accept", "Ask at the end".
- **Control (generic stand-in):** the total changes without a notice.
- **States:** default; route change (treatment shows the notice; control changes the total without a notice).
- **Interactions:** the notice is a live region. Accept updates the fare. "Ask at the end" flags the receipt.
- **Serves:** H1.

### 7. You've arrived · `#/arrived`

- **Purpose:** rider-side trip end (H2). A demo of a follow-on idea, not part of the live H1 arm.
- **Copy (treatment):**
  - "Have you arrived at Fort Railway Station?"
  - Buttons: "Yes, end my trip", "Not yet"
  - Line: "The driver can also end the trip. If neither of you does within 60 s of arrival, the fare stops counting." (the 60 s rule is a proposal)
- **Copy (control, generic stand-in):** "Waiting for the driver to end the trip", with no button.
- **States:** treatment; control; waiting countdown (60 s).
- **Interactions:** the primary action ends the trip and goes to screen 8. The countdown announces once, not every second.
- **Serves:** H2.

### 8. Your fare · `#/receipt`

- **Purpose:** explained difference and the pay moment.
- **Copy:**
  - As booked: "LKR 543, as booked"
  - Changed and explained: "LKR 663 · LKR 120 more than booked", with the line "Route change (accepted on trip) +LKR 120".
  - Payment: "Pay cash to driver" or "Charged to card ••1234"
  - Rating: 1 to 5
  - Button: "Something's not right"
- **States:** as booked; changed and explained; flagged from trip.
- **Interactions:** delta lines are rendered from `fare.changes`, not hard-coded. "Something's not right" goes to screen 9.
- **Serves:** H1, H4 (folded in).

### 9. Get help · `#/help`

- **Purpose:** support that answers.
- **Copy:**
  - Four one-tap reasons (radio list): "Fare is higher than explained", "Driver asked for cash on a card trip", "Driver asked me to cancel and pay outside the app", "This trip didn't happen".
  - Submit.
  - Confirmation: "Ticket #TKT-4821 opened. We reply within 24 hours (a proposed time). The extra LKR 120 is on hold."
  - Button: "Back to start"
- **States:** reason picked; submitted.
- **Interactions:** radio list, submit, confirmation in a live region. The ticket number comes from state.
- **Serves:** H4, S8.

## 4. Demo controls (secondary surface)

Not a screen. Desktop: beside the frame. Mobile: a bottom sheet opened from a "Demo" button. All are plain form controls.

| Control | Options | Effect |
|---|---|---|
| Variant | Control / Treatment | Sets `variant`. Affects screens 3, 4, 6, 7, 8 and the Part A screens (A1, A3) |
| Peak pricing | On / Off | Adds the peak line (15% of the subtotal) and the peak note |
| Scenario | Normal / No driver / Driver cancels / Route change / Driver asks for cash | Sets `scenario` |
| Language | EN / සිං / தமிழ் | Sets the global language |
| Reduced motion override | Follow system / On / Off | Overrides `prefers-reduced-motion` for the demo |

Panel text: "Control is a typical ride-hailing pattern, not PickMe's interface."

## 5. Variant mechanism

- A single `variant: 'control' | 'treatment'` in app state.
- Screens 3, 4, 6, 7 read it, as do A1 and A3 (the addendum makes `partAVariant` follow the global variant).
- The chip in the frame header reads "Control" or "Treatment" at all times.
- Control copy is a generic pattern ("Estimated", "Waiting for the driver"), never PickMe's behaviour. Nothing in control reconstructs PickMe's interface.

**Demo versus live tests.** The single toggle is a demo convenience. Demo treatment bundles H1 (screens 3, 4, 6, 8) with the H2 trip end (screen 7) and the H4 dispute route (screen 9). A live H1 arm holds only fare display, change rules and the explained receipt. H1 and H5 (A1, A2, A3) also need separate assignments. See `docs/experiment-plan.md`.

## 6. State model

File: `prototype/src/state/rideMachine.ts`.

- `Step`: `'intro' | 'problem' | 'welcome' | 'where' | 'location' | 'ride' | 'fare' | 'verify' | 'finding' | 'trip' | 'arrived' | 'receipt' | 'help'`
- State: `{ step, variant, lang, scenario: 'normal' | 'noDriver' | 'driverCancel' | 'routeChange' | 'cashDemand', peak: boolean, signedIn: boolean, permissions: { location: 'unset' | 'allowed' | 'typed', notifications: 'unset' | 'allowed' | 'declined' }, destination?, rideType?: 'tuk' | 'smallCar' | 'car', payment: 'cash' | 'card', fare: { base, distance, peak, changes: FareChange[] }, driver?, finding: 'searching' | 'matched' | 'none' | 'cancelled', routeChangeDecision?: 'accepted' | 'askLater', ticket? }`
- Actions: `SET_DESTINATION`, `CHOOSE_RIDE`, `SET_PAYMENT`, `BOOK`, `VERIFY_PHONE`, `VERIFY_CODE`, `SET_PERMISSION`, `DRIVER_FOUND`, `ROUTE_CHANGED`, `ACCEPT_CHANGE`, `DEFER_CHANGE`, `END_TRIP`, `OPEN_TICKET`, `SET_VARIANT`, `SET_SCENARIO`, `SET_LANG`, `RESET`, `GOTO`.
- The route is derived from `step`. A URL dispatches `GOTO`, so deep links work.
- Timers live in the screen effects (`Finding.tsx`), not in the reducer.

## 7. Internationalisation

- `en.ts` is the source of truth. `StringKey = keyof typeof en`.
- `si` and `ta` are `Partial<Record<StringKey, string>>`.
- `t(key)` returns the translation or English. When it falls back, the screen shows one "EN" chip (`useHasFallback()`), not one per string.
- `html[lang]` is `en`, `si` or `ta`.
- Every si and ta file exports `reviewStatus: 'machine-draft, needs native review'`. Intro shows it as a footnote.
- **Full coverage:** screens 0, 3, 4, 7, 8, 9, A1 and A3. Others fall back to English with the EN chip.
- Sinhala and Tamil get `line-height: 1.6`.
- Fonts: `"Noto Sans Sinhala"` and `"Noto Sans Tamil"` from Google Fonts with `font-display: swap` and a system fallback.

## 8. Design tokens

Contrast ratios are computed with the WCAG relative-luminance formula and re-checked for this spec. All text pairs meet AA (4.5:1 normal text, 3:1 large text and UI).

| Token | Value | Use | Contrast (computed) |
|---|---|---|---|
| `--ink` | `#14213D` | body text | 15.3:1 on `--paper`; 16.0:1 on white |
| `--ink-2` | `#5B6470` | secondary text | 5.7:1 on `--paper`; 6.0:1 on white |
| `--paper` | `#FAFAF7` | app background | base |
| `--surface` | `#FFFFFF` | cards, sheets | base |
| `--primary` | `#0B6E6D` | CTA, links, selected | white on primary 6.1:1; primary on `--paper` 5.8:1 |
| `--primary-soft` | `#E6F4F3` | selected card tint | `--ink` on it 14.2:1; `#085E5D` text on it 6.7:1 |
| `--danger` | `#B42318` | errors, cancellations | 6.6:1 on white; 6.1:1 on `#FEF3F2` |
| `--warn-ink` / `--warn-bg` | `#7A4E00` / `#FFFBEB` | fare change notices | 6.9:1 |
| `--ok-ink` / `--ok-bg` | `#067647` / `#ECFDF3` | "as booked", agreed badges | 5.4:1 |
| `--border` | `#6B7584` | input and card borders | 4.7:1 on white (UI needs 3:1) |
| `--focus` | `#14213D`, 2 px solid, 2 px white offset | focus ring | visible on all surfaces |

Rules:

- Colour is never the only signal. Badges carry text; fare changes carry "+LKR".
- No `outline: none`. Every interactive element has the focus token.
- Nothing depends on hover.
- Only tokens in `tokens.css` are used. No magic colours in screen CSS.

### Type scale (rem, base 16 px)

| Role | Size / line height | Weight |
|---|---|---|
| Display | 1.75 / 1.2 | semibold |
| Title | 1.25 / 1.3 | semibold |
| Body | 1 / 1.5 | regular |
| Small | 0.875 / 1.5 | regular |
| Caption | 0.75 / 1.4 | regular, only with `--ink-2`, never below 0.75 rem |

Sinhala and Tamil use `line-height: 1.6` at each role.

### Spacing, radius, targets, motion

- Spacing: 4-point scale, `--s1` to `--s8` = 4, 8, 12, 16, 24, 32, 48, 64 px.
- Radius: `--r-sm` 8 px, `--r-md` 12 px, `--r-lg` 20 px.
- Touch targets: minimum 44 x 44 px.
- Motion: 160 ms ease-out transitions only.
- `prefers-reduced-motion: reduce` disables all transitions. The matching spinner becomes a static "Searching" label with elapsed seconds.
- Layout works at phone width with a 16 px side gutter and no horizontal page scroll. Text resizes to 200% without clipping.

## 9. Accessibility requirements (WCAG 2.2 AA)

- Landmarks: `header` (banner), `main` (screen), `aside` (demo controls); one `h1` per screen.
- Focus moves to the `h1` on screen change. Dialogs trap focus and restore it to the trigger.
- Radiogroups for ride type, payment and help reasons, with arrow-key movement and `aria-checked`.
- Live regions: matching state (polite), fare change notice (polite), ticket confirmation (polite), driver cancelled (assertive). Not chatty: do not announce every timer tick.
- Target size 44 px. Nothing is conveyed by colour alone.
- `lang` switches with the language. Sinhala and Tamil fonts are loaded. No text in images.
- Keyboard-only run of the full flow is an e2e test (Part A included). Axe reports zero violations on every route, in both variants and all three languages. Axe is necessary but not sufficient: a manual VoiceOver pass on three screens (Ride, Fare, Finding) is part of the review panel.

## 10. Copy and content rules

- Plain professional English. No emoji anywhere in the UI or the copy.
- Every review quote is under 15 words, with platform and date, and matches `research/02-review-mining.md`.
- All fares, plates and rates are invented and labelled as mock or sample.
- No PickMe logo, colour or screen reconstruction. The PickMe name appears only in the non-affiliation notice.
- The non-affiliation note is visible on every screen through the banner.
- Social-media posts by private individuals are excluded (D10).

## 11. Out of scope

Food, Trucks and Flash; driver app; maps SDK; live pricing; dark mode; native build; Figma files; any real permission request; any real account creation; any real payment. Real signup and OTP redesign is not built; the Part A screens are a prototype of the copy and order only.
