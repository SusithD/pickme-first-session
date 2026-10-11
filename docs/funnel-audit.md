# Funnel audit: a new rider's first session

Unofficial concept by Susith Deshan Alwis. Not affiliated with PickMe / Digital Mobility Solutions Lanka. Written 2026-10-11.

**Status: desk research only.** No teardown of the app, no rider or driver interviews and no PickMe data were used. The funnel below is a map of where to measure and where the evidence points. It contains no conversion rates, because none exist publicly.

## 1. Problem statement

The first session has two parts with different levels of evidence.

**Part A: install to first booking.** In the modelled flow, a new rider chooses a language, sets a destination, sees a fare, signs up and confirms a booking. The research found no public evidence of trouble with install, signup, one-time codes or permissions. That absence is a gap, not a finding: the sample is about 30 items, the Trustpilot sample leans negative, PickMe's signup method was not confirmed (01-context.md, section 4) and onboarding screens were not captured (02-review-mining.md, section 4). Part A rests on benchmark evidence from Uber's documented onboarding (03-benchmark.md). Confidence is low.

**Part B: first-ride trust (booking to receipt and help).** Reviewers raise four themes. Each had about five items in the sample, so none is shown to be the most common. The fare theme ranks first by evidence strength, not by count (02-review-mining.md, section 3).

1. The fare charged is higher than the estimate shown, with no explanation.
2. A reviewer reports that only the driver can end the trip (not verified in the app).
3. The app is set to card but the driver asks for cash.
4. Support tickets close without an answer, or no reply comes.

Each is a plausible reason not to book a second ride. Confidence in the direction is moderate (the themes recur across Trustpilot, the App Store and press). Confidence in size is low.

## 2. Evidence limits

- Desk research only. The clean-device teardown, five interviews and a Play review read have not been done (section 5).
- About 30 dated items; several seen only as search snippets (marked [S] in 03-benchmark.md); Google Play reviews were not read at all.
- Trustpilot is skewed: reviews are not invited and 88% are one-star (02-review-mining.md, section 1, row 4).
- One App Store review dated 26 Jul has no year shown.

## 3. Funnel map and evidence by stage

Eight standard ride-hailing stages. The right-hand column says what would replace the missing rate. Evidence strength: **Reviews** (counted items from 02-review-mining.md), **Benchmark** (competitor pages, 03-benchmark.md), **None**.

| Stage | What would be measured | Evidence here | Strength |
|---|---|---|---|
| **S1** Install and open | Install-to-first-open by source and platform | AppGoblin install count only (02, section 1, row 3) | None |
| **S2** Signup complete | Phone entered, code sent, verified, failed, completed | 0 review items; signup method NOT FOUND (01, section 4). Uber [V]; Careem and Rapido [S] | Benchmark |
| **S3** Destination set | Destination-set rate; location permission grant rate | 0 direct items. Bolt asks location at download [S]; Uber push timing [V] | Benchmark (mostly [S]) |
| **S4** Fare seen | Quotes shown per session with a destination | Reviews mention an "estimate" at booking, so one exists; format unverified. Uber fare transparency [V] | Reviews (indirect) and benchmark |
| **S5** Booking confirmed | Confirmations per fare view; peak flag; card verification failures | Fare-above-estimate about 5 items; peak on tuks about 2 (snippets); card verification about 2 | Reviews (skewed sample) |
| **S6** Driver matched and arrived | Match rate, no-driver rate, cancellation by party | Long waits about 5; cancellations about 3; pickup calls about 3 | Reviews (mixed causes, partly driver supply) |
| **S7** Completed and paid without dispute | Disputes, refunds and fare delta per 100 trips | Fare gap about 5; trip not ended about 3; cash demanded on card trips about 4; overcharging about 5 | Reviews (mechanism, no rate) |
| **S8** Second ride within 7 days | Cohort return rate | Support gap read as a churn trigger (an interpretation). No retention rate published (01, section 6) | None for the rate; direction only |

S5 to S7 have review evidence. S8 has direction only. S2 to S4 rest on benchmarks.

## 4. Which bet wins, and what would flip it

No rates exist, but the choice between H1 and H5 can still be reasoned.

- H1 can recover at most: riders who reach a first ride and meet a fare gap, times the share of them who then stop riding because of it.
- H5 can recover at most: installs lost at S2 to S4, times the share of that loss caused by the account wall coming first.

H1 is ranked first because its mechanism has repeated review evidence and its pool (first-ride riders) is observable. H5 would overtake H1 if real data showed that (a) a large share of installs are lost before the first fare and (b) most of that loss is the signup wall, while (c) first-ride fare disputes are rare. The teardown and the first two weeks of PickMe's own funnel data would settle (a) and (c). Until then H5 is the supporting bet.

## 5. What real data would replace each gap

Only PickMe's own event data or primary research can supply stage rates. Public reports give totals and growth, not conversion (01-context.md, sections 3 and 7).

| Stage | Data needed | Source |
|---|---|---|
| S1 | Install and first-open events by source | Product analytics (internal); store consoles give installs only |
| S2 | Signup started, code sent, verified, failed, completed | Analytics and auth logs |
| S3 | Destination-set and permission-grant events | Rider app analytics |
| S4 | Fare-quote shown events per session | Analytics and quote service logs |
| S5 | Booking confirmed vs fare shown; card failures; peak flag | Booking and payment logs |
| S6 | Match and arrival times; cancellation by party | Dispatch logs |
| S7 | Completion, `trip_ended_by`, receipt fare delta, disputes per 100 trips | Trip, payment and ticket data |
| S8 | Second ride within 7 days of the first | Trip table |

**Primary research (planned, not done):**

- Clean-device teardown of the live app (00-teardown-guide.md).
- Five rider interviews on the first ride (04-interview-guide.md).
- A Google Play review read, newest first, for "OTP", "verify", "login", "location", "fare", "cash", "trip".
- A manual search of r/srilanka and r/SriLanka for PickMe threads.

## 6. Sources used

01-context.md (sections 3, 4, 6, 7); 02-review-mining.md (sections 1 to 4); 03-benchmark.md (per-app tables, patterns 1 to 10, evidence key); PLAN.md (funnel and Part A sections).
