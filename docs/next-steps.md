# Next steps

Status as of 2026-10-11. The work so far is desk research only: about 30 public reviews and posts (several seen only as snippets), a six-app benchmark (Uber, Grab, Gojek, Careem, Bolt, Rapido), a funnel map with no invented rates, a coded prototype and an A/B plan. There has been no teardown, no interviews and no access to PickMe data. Primary research comes first because every H-level decision currently rests on reviewer reports and assumptions.

Not affiliated with PickMe (Digital Mobility Solutions Lanka).

## 1. Primary research (do first)

### 1.1 Clean-device teardown

Source: `research/00-teardown-guide.md`. Status: not yet done.

- Use a phone that has never had PickMe installed, or uninstall it and clear its data. Use a phone number with no existing PickMe account if possible, with the owner's permission if it belongs to someone else.
- Record one continuous screen video from the Play Store (Android) or App Store (iOS) through to the booking step. Stop before confirming. Do not book a real ride unless one is needed.
- Capture: store listing, first launch, signup and OTP timing, permissions (when asked and whether a reason is given), home screen, booking flow (fare display, ETA, payment method, promo codes).
- Capture the first screens of PickMe Food, to see how a second service is introduced.
- Repeat the signup in Sinhala or Tamil if the app offers it, and note copy that breaks or reads poorly.
- Export screenshots into `research/teardown/` as `01-store.png`, `02-splash.png` and so on. Log timestamps for anything that confused or nearly stopped the walkthrough.
- **Output:** the teardown file, plus an update to the status line in `research/00-teardown-guide.md`.

What this resolves: the signup and permission assumptions behind H5 and Part A (both currently [U] or unverified in the benchmark), and whether the fare and payment screens match the reviews.

### 1.2 Five first-use interviews

Source: `research/04-interview-guide.md`. Status: not yet run.

- **Who:** 3 people who have never used PickMe (for example older relatives, students, or people who only use Uber or call tuk-tuks), and 2 people who tried PickMe but rarely or never use it now. Include at least one Sinhala-first or Tamil-first speaker and at least one person with a low-end Android phone.
- **Format:** 20 to 30 minutes each. Hand over the phone with PickMe freshly installed and ask the participant to get to the point where they would confirm a tuk ride to a real nearby place, then stop. Do not help; think-aloud.
- **Consent:** explain it is a personal design project, not for PickMe. Ask before recording screen or voice. Use first names or initials only. Do not record phone numbers or OTPs.
- **Output:** one notes file per person at `research/interviews/p1.md` to `p5.md`, using the template in the guide.
- **Decision this informs:** whether the fare-trust theme (H1) and the signup-cost theme (H5) appear in real use, and whether any new theme shows up that the reviews did not.

### 1.3 Play Store review scrape

Status: not started. Google Play reviews were not read at all in the review mining (the listing fetch failed; the only figure is an aggregate of 3.23 from 521 ratings).

- Read Google Play reviews sorted by newest, for the same period as the App Store and Trustpilot sample (2025 to 2026).
- Search or scan for the terms behind the gaps in `research/02-review-mining.md`: "OTP", "verify", "login", "location", "permission", "fare", "cash", "card", "end trip", "support".
- Record each relevant review in a table: date, rating, platform, theme, quote (under 15 words), and the research file section it supports.
- Proposed stop rule: read until the 12-month cut-off or 100 relevant reviews, whichever comes first. Fix this before starting.
- Also check the manual gaps listed in the review mining: a manual search of r/srilanka and r/SriLanka for "PickMe", and the App Store developer replies (one, from 6 Feb, was mentioned but not read).
- **Output:** an update to `research/02-review-mining.md` with the new counts marked as Play, and any change to the top-five friction ranking flagged.
- **Decision this informs:** whether the signup and permission theme (currently zero evidence) changes, which would change the H5 priority.

### 1.4 Usability test of the live prototype

Status: not started. Run before the interviews, because it needs no PickMe access.

- Five moderated sessions on the live prototype, in Sinhala and English, on a phone.
- Test whether riders understand "What can change this?" and the receipt delta, and whether the Control variant reads as an ordinary estimate.
- **Output:** three findings and the changes made, recorded in `docs/decisions.md`.

### 1.5 Native-speaker review of Sinhala and Tamil

Status: not started. Every Sinhala and Tamil string is a machine draft and is flagged `reviewStatus: 'machine-draft, needs native review'` in the code.

- Ask at least one native Sinhala speaker and one native Tamil speaker to review every string in `prototype/src/i18n/strings/si.ts` and `ta.ts` against the English in `en.ts`.
- Checks: meaning, tone for a transport app, readability on a phone, and whether the fare and payment wording matches how riders talk about tuk-tuks and cash.
- Scope: all keys in the fully translated screens (Intro, Ride, Fare, Arrived, Receipt, Help) and the new Welcome and Verify screens.
- Record the reviewer's name or initials, date and changes in a review log. The app footnote can only change from "draft" to "reviewed" after this.
- **Output:** corrected string files and an updated `reviewStatus`.

### 1.6 Pre-launch checks on secondary figures

These do not block the prototype but they do block any real test.

- The experiment plan's traffic scenarios lean on the FY24/25 peak of more than 250,000 new consumers in one month. It is a secondary news summary. Check it against the FY25/26 results release and the investor relations site.
- The founding year and founder name conflict across sources (see `research/01-context.md`). Do not repeat either in the case study until checked against the prospectus.

## 2. H2 and H3 tests (after the H1 readout)

Only start these once H1 has closed and its decision is recorded in `docs/decisions.md`. H5 is specified in `docs/experiment-plan.md`, section 2. It does not run concurrently with H1, because both would assign the same riders.

### 2.1 H2: rider-side trip end

- **Hypothesis:** if the rider can confirm "I've arrived" and end the trip when the driver has not ended it within 60 seconds, then disputed fares and card overcharges fall. Stages S7 and S8.
- **Why next:** lower driver-earnings risk than H1, though it still needs a driver-side change and can cost a driver a legitimate fare if a trip is closed early.
- **Primary metric:** disputes raised within 24 h of trip end per 100 trips (lower is better), with S8 as the secondary metric.
- **Prerequisites:** the `trip_ended_by` event (with `by` and `minutes_after_arrival`) must be live in the control arm first, so the baseline rate of driver-only ends is measured, not assumed.
- **Sample size:** same method as H1 (two-proportion test). The baseline dispute rate is unknown; it must come from the control arm's first two weeks, not from an assumed number.

### 2.2 H3: payment agreed before pickup

- **Hypothesis:** if the payment method is chosen on the booking screen with cash as a first-class option, and the driver's acceptance shows "driver has agreed: card", then cash-demand incidents and cancellations fall. Stages S5, S6 and S7.
- **Primary metric:** cash-demand incidents per 100 card trips, from `help_reason = cash_on_card` and a driver-side report, if one is available.
- **Prerequisites:** the `payment` property on `booking_confirmed` and a defined way to log a cash demand (rider report or driver report), agreed before the test starts.
- **Guardrails:** same as H1, plus driver acceptance rate for card-only bookings.

### 2.3 Order and attribution

1. H1 (primary bet) runs first, alone.
2. H2 next (H4, the dispute route, follows on top of H1's receipt), because it carries lower driver-earnings risk than H1.
3. H3 and H5 after that, once driver-side guardrail data from H1 and H2 is available.

Each test gets its own `test_id`, its own assignment and its own readout, so a result can be attributed to one change.

## 3. Open local questions

Not resolved by desk research; each needs a local check (teardown, drivers, riders) before a live test.

- **Tolls and parking.** Expressway tolls and parking are commonly paid in cash on top of the fare. Does the "only three things can change this fare" promise need a fourth line, or a statement that tolls are paid separately?
- **Night surcharge.** A night charge after 10 pm is reported for tuks (Yamu, unverified). It is not in the prototype's fare logic.
- **Meter versus app fare.** Drivers may say "meter on" or ask for extra because the app rate is low. The fare promise must handle this.
- **Exact change.** Paying LKR 685 in cash raises change and rounding. A round-to-10 convention or a "Have exact change?" hint may be needed. Wallets, QR and bill-to-mobile are not in the prototype.
- **Return fare.** Drivers going to the suburbs may ask for a return fare.
- **Data cost and low-end phones.** The prototype loads Google Fonts for Sinhala and Tamil, which costs data on prepaid plans. Test on a 2 GB RAM Android Go phone and consider system fonts.
- **Safety for lone riders at night.** Share-trip defaults and a women-driver preference are not covered.
- **Fuel-price repricing.** Fares change with fuel prices; a fixed-fare rule must say when the rate card updates.

## 4. Repository follow-ups

These are tracked in `PLAN.md` section 8.

- Prototype fixes from the local-market review (per-destination fares, peak as 15% of the subtotal, realistic trip times, generic ride names).
- Review panels after the docs and after the prototype.
