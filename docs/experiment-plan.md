# Experiment plan: H1 (fare you can hold) and H5 (fare before account)

Status: planned, not run. Date 2026-10-11. Desk research only: no teardown, no interviews, no PickMe data. Every rate and input below is an assumption unless a source is named. The prototype logs no analytics; the event table in section 1.9 is the specification for a live product.

Not affiliated with PickMe (Digital Mobility Solutions Lanka).

## 1. H1 test: a fare you can hold

### 1.1 Hypothesis

If a new rider sees a fixed fare with a breakdown (base, distance, peak) before booking, is told the only three things that can change it (proposed rules), and sees every change explained line by line on the receipt before paying, then more riders complete a second ride within 14 days of assignment, because the fare becomes a promise rather than an estimate.

H1 contains only fare display, change rules and the explained receipt. The rider-side trip end (H2) and the dispute route (H4) are separate follow-on tests and are identical in both arms here.

### 1.2 Unit, audience and assignment

- **Population:** new riders at their first fare view, Western Province, Android and iOS.
- **Unit:** the rider, assigned 50/50 at first fare view (screen 3).
- **Key:** install ID, assigned before signup and inherited by the account. An account-only key cannot work because the H5 flow shows fares before any account exists.
- **Exposure:** `experiment_exposed` fires at assignment. Analysis is on everyone assigned, not on those who book.
- **H1 and H5:** separate tests, run one after the other, never concurrently. They share riders and would need a sized 2 x 2 interaction. No concurrent run is planned.

### 1.3 Arms

In a live test, control is the current production app, to be captured in the teardown. The Control column below is the prototype's generic stand-in, not PickMe's behaviour.

| Element | Control (generic stand-in) | Treatment |
|---|---|---|
| Price shown | Midpoint number labelled "Estimated" | The same number labelled "Fixed fare", with "Includes peak +15% now" when peak is on |
| Fare sheet | "Fare is an estimate. Final fare may vary." | Breakdown and the three change rules |
| Mid-trip route change | Total changes without a notice | Notice with "+LKR" delta, Accept or Ask at the end |
| Receipt | Total only | Explained delta lines before payment |

Price-level confound: both arms quote the same number at booking (the fixed-fare rule below), so a difference in outcomes is presentation and promise, not price level. Treatment fixed fare = the quote the control app would show as its estimate. Fixed vs final fare is logged in both arms as a covariate and a guardrail.

### 1.4 Metrics

| Type | Metric | Definition |
|---|---|---|
| **Primary (intent-to-treat)** | Second completed ride within 14 days | Of all riders assigned at first fare view, the share who complete a second ride within 14 days of assignment (the first ride may be any time in the window). |
| Secondary | Second completed ride within 14 days among riders who completed a first ride | Conditional on a post-assignment event the treatment may change, so it cannot be the headline. Reported as a cut. |
| Secondary | S5: booking confirmed from fare view | |
| Secondary | S7: first trip paid without a dispute within 24 h | |
| Diagnostic | Change acceptance; share of receipts with explained delta lines | |

Why 14 days from assignment: fare shock loses the next ride, not this one, and 7 days is sparse for new riders.

### 1.5 Sample size

Two-proportion z-test, two-sided, alpha 0.05, power 0.80. n per arm = 2 (1.96 + 0.84)^2 p-bar (1 - p-bar) / d^2, with p-bar the average of the two rates. The baseline is the share of all assigned fare viewers who complete two rides within 14 days. It is unknown. Illustration only: if 60% of fare views become a booking, 75% of bookings are matched, 85% of those complete, and 45% of completers return, the baseline is about 17%. These rates are assumptions.

n per arm (exact z values):

| Baseline | MDE 2 pp | MDE 3 pp | MDE 4 pp |
|---|---|---|---|
| 15% | 5,274 | 2,403 | 1,384 |
| 25% | 7,551 | 3,397 | 1,934 |
| 35% | 9,042 | 4,043 | 2,287 |

Total riders are twice the figure. **Planning case: baseline 15%, MDE 3 pp (a 20% relative lift): 2,403 per arm, about 4,800 riders.** A 3 pp lift on a 15% base is the smallest change worth a pricing and liability change; the real baseline and MDE come from measured data before launch (the first two weeks of production funnel data), and the table above is re-read then.

Traffic scenarios for the planning case (about 4,800 assigned riders). Eligible new-rider fare views per month is an assumption: the only public figure is more than 250,000 new consumers in the peak month (FY24/25, island-wide, secondary news summary, unverified), and the Western Province share is not known.

| Scenario (eligible fare views per month) | Per day | Days to 4,800 | Days to finish (plus 14 maturity) |
|---|---|---|---|
| 12,500 | 417 | 12 | 26 |
| 25,000 | 833 | 6 | 20 |
| 50,000 | 1,667 | 3 | 17 |

If traffic is lower, use the table above to choose a larger MDE or stop. The assignment window never runs under two full weeks, so it spans two weekly cycles including a payday week.

### 1.6 Driver side and marketplace effects

A fixed fare changes pricing and liability. It is not only a display change. The plan therefore specifies who pays for each allowed change (all proposals, to be agreed with PickMe before any test):

| Change type | Rider pays | Driver receives | Platform absorbs |
|---|---|---|---|
| Waiting beyond 5 min | LKR 10 per minute (mock rate) | The full waiting amount | Nothing |
| Route change the rider approves | The approved delta | The approved delta | Nothing |
| Stop the rider adds | Added distance and wait at the usual rate | The same amount | Nothing |
| Overrun the rider did not approve (for example a driver detour) | Nothing: the fixed fare holds | Normal pay for the booked trip | Any compensation owed, up to a cap per trip |

Platform fare-loss bound: absorbed amounts must stay under 1% of treatment gross fares. Breach pauses the arm.

**Cash trips.** Cash is assumed to be the common payment method for tuk rides (unverified), so "explained before payment" cannot be enforced: the driver collects what the rider hands over. The treatment shows the agreed amount to both rider and driver, so a gap is visible, but it is a norm, not an enforcement.

**Interference.** Drivers serve both arms, so a rider-level split shares driver supply and can leak (for example, treatment changing which trips drivers accept, which changes control waiting times). A zone-by-time switchback or geo-cluster test is the stronger design for supply effects, but it cannot measure a 14-day per-rider repeat outcome (a rider would see both arms) and a geo test of a few clusters has little power. Choice: **rider-level assignment, with interference monitoring**. New riders are a small share of trips in any zone, so spillover should be small. The monitoring compares pickup ETA, match rate and driver acceptance by zone and treated share. A short zone-by-time switchback pilot on driver acceptance and earnings runs before the rider-level test. If monitoring shows a spillover, the follow-up is a geo-cluster design.

### 1.7 Guardrails

Thresholds are assumptions, set before launch and re-read when real baselines exist. Daily monitoring uses an alpha-spending rule, below.

| Guardrail | Breach (treatment vs control) | Action |
|---|---|---|
| Cancellation rate after match | Up more than 1 pp | Pause; investigate |
| Driver acceptance rate | Down more than 2 pp | Pause; review the driver side first |
| Driver earnings per online hour | Down more than 2% | Pause |
| Gross take per trip | Down more than 2% | Do not ship |
| Platform fare-loss bound | Absorbed amounts above 1% of treatment gross fares | Pause |
| Unresolved support contacts per 100 trips | Up more than 0.5 | Do not ship |
| Crash-free sessions | Down more than 0.2 pp | Pause |
| Fixed vs final fare gap (both arms) | Treatment mean absolute gap above control | Investigate |

Contacts about fares per trip may rise by design when disputes are easy (H4), so total contacts are not a guardrail. The guardrail is unresolved contacts and resolution within the stated time.

### 1.8 Decision rules and statistics

- **SRM check:** chi-square test of the 50/50 split, p below 0.001 means stop and fix the assignment or logging before reading anything.
- **Guardrails:** monitored daily with O'Brien-Fleming-type alpha spending (one-sided harm, overall alpha 0.025). They may stop the test for harm; they do not stop it for benefit.
- **Primary:** read once at the fixed end date. No peeking at the primary.
- **Secondaries:** Holm correction across the secondary tests. Splits (platform, language, ride type, peak) are descriptive and not decision bases.
- **Novelty:** compare week 1 against later weeks of the assignment window and read a 2-week post-period. A lift that decays is not shipped on the headline number.
- **Power for guardrails:** each guardrail has its own sample need (a 1 pp cancellation delta needs its own n). The readout reports achievable power per guardrail; underpowered ones are monitored, not tested.

| Outcome | Rule |
|---|---|
| **Ship** | Primary lift is at least the MDE and the 95% CI lower bound is above 0, no guardrail breached, no novelty decay |
| **Iterate** | S5 improves but the primary does not: the promise is believed but not kept. Fix change explanations and the receipt, then re-test |
| **Kill** | Driver acceptance or earnings guardrail breached and the cause is the fixed fare |
| **Inconclusive** | Primary not conclusive at the end date. Do not ship, do not extend without a pre-registered reason |
| **Do not ship** | Any other guardrail breached, even with a significant primary |

### 1.9 Event and instrumentation spec

Shared properties on every event: `test_id`, `variant`, `part` (`A` or `B`), `lang`, `platform`, `install_id`, `account_id` (after signup), `ts`. **Never send** phone numbers, OTP codes, names, precise GPS or card details; locations go as place IDs.

| Event | When fired | Properties |
|---|---|---|
| `experiment_exposed` | Assignment at first fare view | `test_id`, `variant`, `install_id` |
| `app_first_open` | First launch | `install_ts` |
| `destination_set` | Destination chosen | `place_id`, `has_pickup_gps` |
| `fare_viewed` | Ride screen shows fares, first time per rider | `peak_on`, `fare_tuk_lkr`, `fare_small_car_lkr`, `fare_car_lkr` |
| `fare_breakdown_opened` | Fare sheet opened | `ride_type`, `peak_on` |
| `booking_confirmed` | Book confirmed (S5) | `ride_type`, `payment`, `fare_lkr` |
| `driver_matched` | Driver matched (S6) | `wait_s`, `driver_accepted` |
| `driver_declined` | Driver declines or cancels | `reason` |
| `rider_cancelled_after_match` | Rider cancels after match | `elapsed_s` |
| `fare_change_shown` | Change notice on trip | `change_type`, `delta_lkr`, `before_payment` |
| `fare_change_accepted` | Rider accepts a change | `change_type`, `delta_lkr` |
| `fare_change_deferred` | Rider taps Ask at the end | `change_type`, `delta_lkr` |
| `trip_ended_by` | Trip ends | `by`, `minutes_after_arrival`, `fare_final_lkr` |
| `receipt_delta_lkr` | Receipt renders | `delta_lkr`, `explained`, `booked_lkr`, `final_lkr` |
| `payment_completed` | Payment recorded | `method`, `final_lkr` |
| `trip_completed` | Trip completes and is paid | `trip_id` |
| `dispute_raised` | Rider opens a dispute (can fire up to 24 h later) | `trip_id`, `reason` |
| `help_reason` | Reason chosen | `reason` |
| `ticket_opened` | Ticket submitted | `ticket_ref`, `reason`, `on_hold_lkr` |
| `second_ride_completed` | A second trip completes within 14 days of assignment | `days_since_assignment` |

A dispute cannot be known when `trip_completed` fires, so it is a separate event joined on `trip_id`.

### 1.10 Readout sketch

```
H1  test_id H1   window: start to end   status: running | closed   SRM p
PRIMARY  second completed ride in 14 d, all assigned riders
         control xx.x%  treatment xx.x%  diff +x.x pp  95% CI [ , ]
         diff >= MDE and CI lower bound > 0 ?  -> SHIP | ITERATE | INCONCLUSIVE
SECONDARY  completed-first-ride cut | S5 | S7   (Holm adjusted)
NOVELTY    week 1 vs later weeks | post-period
GUARDRAILS threshold  control  treatment  status   (table in 1.7, plus achievable power)
INTERFERENCE  pickup ETA, match rate, acceptance by zone and treated share
SPLITS     descriptive only, each with its own n
```

## 2. H5 spec: fare before account (Part A)

Lower-confidence bet; benchmark evidence only (Uber onboarding [V]), no PickMe complaint evidence. H5a (fare before account) is the tested change. H5b (permission timing) is split off: if run, it is its own later test, because bundling hides which change worked.

- **Arms:** Treatment: Welcome, Where (2), Ride (3), Fare sheet (4), then Confirm your number at "Book". Control: account wall first (phone and code), then home.
- **Unit and assignment:** new install, 50/50 at first launch (install ID). Separate from H1.
- **Primary:** confirmed first booking within 24 h of install, all assigned installs.
- **Sample size:** same formula; baseline unknown. At an assumed 30% baseline and 3 pp MDE, about 3,764 installs per arm; lower baselines need fewer, a smaller MDE needs more. Table form as in section 1.5 once the baseline is measured.
- **Guardrails (assumed thresholds):**

| Guardrail | Breach |
|---|---|
| OTP failures per send | Up more than 3 pp |
| SMS cost per verified account | Up more than 20% |
| Fare quotes per install | Above a cap of 10 per device per day, or a scraping pattern flagged |
| Fraudulent or no-show bookings by new accounts | No-show rate up more than 2 pp |
| Fare-quote service load | Above agreed capacity |

- **Abuse controls (required before launch):** per-device and per-number OTP rate limits (proposed 3 sends per number per hour, 5 per device per day), a quote cap per device, and device checks on anonymous quotes. OTP resend is 60 s. Moving OTP to Book may shift the drop to the point of highest intent; the funnel step after verify is read for that.
- **Duration and statistics:** same rules as section 1.8 (SRM, sequential guardrails, novelty). Minimum two weeks including a payday week; a 24 h window needs one extra day.
- **Decision rules:** Ship if the lift is at least the MDE, the CI lower bound is above 0 and no guardrail breaches. Iterate if drop-off before verify is high though the fare view works. Kill if the OTP or abuse guardrails breach.
- **Events:** the H5 events (`language_selected`, `location_primer_shown`, `signup_started`, `otp_sent`, `otp_verified`, `otp_failed`, `wrong_number_tapped`, `account_created`, `notification_primer_shown`) plus `experiment_exposed`, `app_first_open`, `destination_set`, `fare_viewed` and `booking_confirmed`.
