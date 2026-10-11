# Funnel audit: a new PickMe rider's first session

Unofficial concept by Susith Deshan Alwis. Not affiliated with PickMe / Digital Mobility Solutions Lanka. Written 2026-10-11.

**Status: desk research only.** No teardown of the app, no rider or driver interviews and no PickMe data of any kind were used. Every conversion rate in this document is an assumption. None may be quoted as a fact.

## 1. Problem statement

The new rider's first session has two parts. They carry different levels of evidence, and this audit keeps them apart.

**Part A: install to first booking ("get to a fare fast").** A new rider has to choose a language, set a destination, see a fare, sign up and confirm a booking. The research found no public evidence of trouble with install, signup, one-time codes or permissions. That absence is not evidence that the flow works. The review sample is about 30 items, the Trustpilot sample leans toward dissatisfied users, the PickMe signup method was not confirmed (01-context.md, section 4), and onboarding screens were not captured (02-review-mining.md, section 4). Part A therefore rests mainly on benchmark evidence from Uber's documented onboarding (03-benchmark.md, Uber table and transferable patterns 1 and 2). Confidence is low.

**Part B: first ride trust (booking to receipt and help).** Public reviews repeat four problems:

1. The fare charged is higher than the estimate shown at booking, and nothing explains the difference.
2. Only the driver can end the trip, so a trip can stay open after the rider has arrived.
3. The app is set to card, but the driver asks for cash.
4. When something goes wrong, support tickets close without an answer, or no reply comes.

Each of these is a plausible reason for a rider not to book a second ride. Confidence in the direction is moderate, because the same themes recur across Trustpilot, the App Store and press. Confidence in the size of each problem is low, because the counts are rough and come from a sample, not a census.

In short: a new rider may not have trouble getting in. The first ride is where trust is won or lost, and the most repeated problem is the gap between the fare estimate and the fare charged.

## 2. Evidence limits

- **Desk research only.** The planned teardown on a clean device, five rider interviews and a Play review scrape have not been done (see section 5).
- **Sources:** about 30 dated reviews and posts (02-review-mining.md, section 2); a benchmark of six apps built from help pages and articles (03-benchmark.md); a context fact sheet (01-context.md).
- **Trustpilot sample is skewed.** The company has not invited reviews and 88% of the reviews are one-star (02-review-mining.md, section 1, row 4). Read it as a sample of the most dissatisfied users, not the average rider.
- **Not verified:** Google Play reviews and Reddit could not be read (02-review-mining.md, section 4). Several claims come from search snippets only, marked [S] in 03-benchmark.md. Claims marked [U] were not found.
- **Dates:** one App Store review dated 26 Jul has no year shown (02-review-mining.md, section 4).

Evidence strength labels used in the tables below:

- **Reviews:** counted items from public reviews and press (02-review-mining.md).
- **Benchmark:** competitor help pages or articles (03-benchmark.md).
- **None:** no evidence found either way.

## 3. Funnel model (every rate is an assumption)

No public PickMe funnel data exists. The eight stages are standard for ride-hailing. The rates are set to make the shape of the funnel visible. They are not measurements. The reasoning column is the only part with evidential weight.

| Stage | Rate from previous stage | Reasoning (assumption) | Evidence (file, section) | Strength |
|---|---|---|---|---|
| **S1** Install and open | 100% (base, assumption) | Start of the model. No conversion is assumed or known. | 02-review-mining.md, section 1, row 3 (AppGoblin install count only; no conversion rate). | None |
| **S2** Signup complete | 85% (assumption) | Phone number and one-time code is the regional norm in the benchmarked apps, so it is modelled as a small leak. Not verified for PickMe, whose signup method is unknown. | 02-review-mining.md, section 2, theme "Signup / OTP / phone verification" (0 items). 01-context.md, section 4 (signup method NOT FOUND). 03-benchmark.md, Uber table "Signup method and steps" [V]; Careem and Rapido [S]; transferable pattern 1. | Benchmark. No PickMe review evidence. |
| **S3** Destination set | 80% (assumption) | A "where to" step is standard intent. No friction found. A location prompt asked before the rider has a reason could add a small leak. | 02-review-mining.md, section 2, theme "Permissions" (0 direct items). 03-benchmark.md, Bolt table "Permissions timing" (location right after download) [S]; transferable pattern 2 [V] for push timing. | Benchmark (mostly [S]). No PickMe review evidence. |
| **S4** Fare seen | 95% (assumption) | The fare appears once a destination is set. Reviews refer to an "estimate" shown at booking, so an estimate exists. Its exact format is not verified. | 02-review-mining.md, section 2, theme "Final fare much higher than the estimate shown at booking" (indirect: shows an estimate exists). 03-benchmark.md, Uber table "Fare transparency" [V]; transferable pattern 4. | Reviews (indirect) and benchmark |
| **S5** Booking confirmed | 60% (assumption) | First trust gate. Riders compare the booking estimate with what they pay and report peak charges on tuk-tuks. Card verification friction is also reported. This is the largest modelled leak after S8. | 02-review-mining.md, section 2, themes "Final fare much higher than the estimate shown at booking" (about 5 items), "Fare shock from peak / surge charges on tuk-tuks" (about 2, snippets only), "Card pre-authorisation or card verification friction" (about 2). Section 3, item 1. | Reviews (moderate counts, sample is skewed; peak evidence is snippet only) |
| **S6** Driver matched and arrived | 75% (assumption) | Waits, "no driver found", cancellations and drivers asking riders to cancel, and late arrival or calls about the pickup spot. Some of this is driver supply rather than app design, so the leak is modelled as moderate. | 02-review-mining.md, section 2, themes "Long waits, no driver found, order never collected, pre-booking fails" (about 5), "Cancellation charges or cancellations after acceptance; drivers asking riders to cancel" (about 3), "Driver calls to confirm pickup location; late arrival" (about 3). Section 3, item 4. 03-benchmark.md, Uber "Safety and trust" (plate and driver photo match) [V]; transferable patterns 5 and 7. | Reviews (moderate; mixed causes) |
| **S7** Trip completed and paid without dispute | 85% (assumption) | A small per-trip dispute rate. The three main mechanisms (fare above estimate, trip not ended, cash demanded on card trips) together account for about 12 counted items. Overcharge claims are a separate, smaller set. The count for trip-end includes items this audit does not cite. | 02-review-mining.md, section 2, themes "Final fare much higher than the estimate shown at booking" (about 5), "Trip not ended by driver, so the meter keeps running and the card is charged" (about 3), "Driver takes or demands cash / card set but driver asks for cash" (about 4), "Driver overcharging (double fare, GPS spoofing claim, fuel charge not deducted)" (about 5). Section 3, items 3 and 5. | Reviews (strong on mechanism; no rate) |
| **S8** Second ride within 7 days | 45% (assumption) | Reviews describe the fare and support problems as reasons to stop, so S7 failures are modelled as S8 losses. This is the research's interpretation, not a measured churn event. The 45% is not in line with the 40% baseline used in the experiment plan (see the note below the table). | 02-review-mining.md, section 3, item 2 (support gap read as the trigger; an interpretation). Section 2, theme "No working support channel; tickets closed; hotline callback never came" (Trustpilot, Sep 2025: "Very poor app no chat service."). 01-context.md, section 6 (no retention rate published). 03-benchmark.md: no repeat-use data for any benchmarked app. | None for the rate. Reviews show direction only (weak; skewed sample). |

**Compound rate.** Install to second ride at these assumed rates: 0.85 x 0.80 x 0.95 x 0.60 x 0.75 x 0.85 x 0.45 = 0.111, about **11%**. This product is also an assumption.

**What the shape shows, and what it does not.** With these inputs the largest relative drops are at S8 (55% lost), S5 (40%), S6 (25%), S3 (20%) and S2 and S7 (15% each). Those drops were set by judgement from the reviews. The model does not show that S5 to S8 leak more than S1 to S4 in reality. It only records where the reviews point.

**Consistency note.** The S8 rate here (45% within 7 days) is also the D7 second-ride baseline used to size the experiment (docs/experiment-plan.md). Both are assumptions and move together.

## 4. Evidence strength by stage

- **Review-backed:** S5, S6 and S7 (the mechanisms are specific and recur). S8 has review evidence for direction only.
- **Benchmark-backed:** S2, S3 and S4. The PickMe review record is silent on these stages.
- **No evidence:** S1 has no rate evidence at all. The S8 rate has none.

The stages that carry the primary bet (S5 to S8) are the ones with review evidence. The stages that carry the Part A bet (S2 to S4) rest on benchmarks from other apps.

## 5. What real data would replace each assumption

No public source can supply stage-level rates for PickMe. Only the company's own event data, or a primary research sample, can do that. Public company reports give totals and growth (01-context.md, sections 3 and 7), not conversion by stage.

| Stage | Assumption to replace | Real data needed | Where it would come from |
|---|---|---|---|
| S1 Install and open | Install-to-open rate | Install and first-open events by install source and platform | PickMe product analytics (internal). Store consoles give installs only. |
| S2 Signup complete | Signup completion rate | Events for signup started, phone entered, code sent, code verified, code failed, signup completed | PickMe analytics and auth logs (internal) |
| S3 Destination set | Destination-set rate; effect of a location prompt | Destination-set events; location permission grant rate | Rider app analytics (internal) |
| S4 Fare seen | Fare-view rate | Fare-quote shown events per session with destination set | Rider app analytics and fare-quote service logs (internal) |
| S5 Booking confirmed | Confirmation rate from fare view; effect of peak and card verification | Booking confirmed vs fare shown; card verification failures; peak flag on quotes | Booking and payment logs (internal) |
| S6 Driver matched and arrived | Match rate, no-driver rate, cancellation rate after match | Match and arrival timestamps; cancellation by party; driver acceptance rate | Dispatch logs (internal) |
| S7 Completed and paid without dispute | Dispute-free completion rate | Trip completion; `trip_ended_by`; fare delta on receipt; disputes, refunds and support contacts per 100 trips | Trip, payment and support ticket data (internal) |
| S8 Second ride within 7 days | Seven-day return rate | Cohort of first completed rides and whether a second ride follows within 7 days | Trip table (internal). Public data cannot supply this. |

**Primary research (planned, not done).** Each of these would test the stage assumptions from the rider side:

- A teardown of the live app on a clean device, screen by screen, to replace the assumed onboarding and fare-view steps (00-teardown-guide.md, marked not yet done).
- Five rider interviews, covering the first ride and what made them book again or not (04-interview-guide.md, marked not yet run).
- A Google Play review scrape sorted by newest, searching for "OTP", "verify", "login", "location", "fare", "cash" and "trip" (02-review-mining.md, section 4). This would test the signup silence in section 2 of 02.
- A manual search of r/srilanka and r/SriLanka for PickMe threads (02-review-mining.md, section 4).

## 6. Sources used

- 01-context.md: sections 3, 4, 6 and 7.
- 02-review-mining.md: sections 1, 2, 3 and 4.
- 03-benchmark.md: per-app tables for Uber, Careem, Gojek, Bolt and Rapido; transferable patterns 1 to 10; the evidence key ([V], [S], [U]).
- PLAN.md: section 2 (funnel model), section 5 (experiment baseline), section 10 (Part A addendum).
