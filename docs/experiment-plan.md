# Experiment plan: H1 (fare you can hold) and H5 (fare before account)

Status: planned, not run. Date 2026-10-11. Desk research only: no teardown, no interviews, no PickMe data. Every rate and input below is an assumption unless a source is named. The prototype logs no analytics; the event table in section 1.8 is the specification for a live product.

Not affiliated with PickMe (Digital Mobility Solutions Lanka).

## 1. H1 primary test: a fare you can hold

### 1.1 Hypothesis

If a new rider sees a fixed fare with a breakdown (base, distance, peak) before booking, is told the only three things that can change it, and sees every change explained line by line before paying, then more first-ride riders book again within 7 days, because the fare becomes a promise rather than an estimate.

Hypothesis ranking and ICE scores are in `docs/hypotheses.md`. H1 is ranked first (ICE 24, Part B, funnel stages S5, S7, S8).

### 1.2 Unit, audience and assignment

- **Population:** new rider accounts on their first booking attempt, in the Western Province, on Android and iOS.
- **Unit of randomisation:** the rider, assigned at first fare view (screen 3, `#/ride`), 50/50.
- **Assignment key:** install ID at first fare view, carried onto the account at signup. Plan section 5 says "sticky by account", but under the H5 treatment the fare is shown before any account exists, so an account-only key cannot work. Install ID is the key until signup, and the account inherits it.
- **Interaction with H5:** H1 and H5 are separate tests with separate assignments. Run them one after the other, not concurrently, unless a factorial design is approved (see 1.9).

### 1.3 Arms

| Element | Control | Treatment |
|---|---|---|
| Ride screen price label | "Estimated LKR 470 to 620" | "Fixed fare" with "Includes peak +15% now" when peak is on |
| Link on ride screen | None | "What can change this?" opens the fare sheet (screen 4) |
| Fare sheet | "Fare is an estimate. Final fare may vary." only | Full breakdown and the three change rules |
| Mid-trip route change | Total moves silently | Inline notice with "+LKR" delta, Accept or Ask at the end |
| Trip end | Waiting for the driver, no button | Rider can end the trip ("Yes, end my trip") and 60 s timeout |
| Receipt | Total only | Explained delta lines before payment, "Something's not right" route |

Both arms use the same mock fares, the same peak rule and the same scenario switches, so the only difference is the presentation and the promise. The control copy is a generic pattern, not PickMe's interface (D5).

### 1.4 Metrics

| Type | Metric | Definition |
|---|---|---|
| Primary | Second completed ride within 7 days (S8) | Share of riders with a completed first ride who complete a second ride within 7 days of that first ride. |
| Secondary | Booking confirmation from fare view (S5) | Share of riders who see the fare (screen 3) and confirm a booking. |
| Secondary | First-trip completion without a fare dispute (S7) | Share of first trips that complete and are paid without a dispute raised within 24 h. |
| Diagnostic | Fare-change acceptance and explained-delta reach | Share of route-change events accepted, and share of receipts with delta lines shown before payment. |

Why S8 is primary: the review evidence says fare shock loses the next ride, not this one (plan section 5).

### 1.5 Sample size

**Method:** two-proportion z-test, two-sided, alpha 0.05, power 0.80.

**Formula:**

n per arm = 2 × (z(1 − α/2) + z(power))² × p̄ (1 − p̄) / d²

where p̄ = (p1 + p2) / 2 and d = p2 − p1.

**Inputs (all assumptions except z and the MDE choice):**

| Input | Value | Label |
|---|---|---|
| α, two-sided | 0.05 | Convention |
| z(0.975) | 1.959964 (1.96 rounded) | Standard normal quantile |
| Power | 0.80 | Convention |
| z(0.80) | 0.841621 (0.84 rounded) | Standard normal quantile |
| p1, control S8 rate | 0.45 | **Assumption**, the same as the S8 stage rate in plan section 2. No public figure exists for PickMe. |
| d, MDE | 0.03 (3 pp absolute, about 6.7% relative) | Choice. Smaller lifts would not justify the driver-side pricing change. |
| p2, treatment rate | 0.48 | Derived: p1 + d |

**Arithmetic (MDE 3 pp, rounded z as in the formula above):**

- p̄ = (0.45 + 0.48) / 2 = 0.465
- p̄ (1 − p̄) = 0.465 × 0.535 = 0.248775
- (1.96 + 0.84)² = 2.80² = 7.84
- d² = 0.03² = 0.0009
- n = 2 × 7.84 × 0.248775 / 0.0009 = 4,334.2, so **about 4,334 per arm, about 8,670 in total (about 8,700)**

With exact z values (1.959964 and 0.841621) the result is 4,339 per arm. The rounded form is kept to match the formula as written.

**Sensitivity (same inputs, other MDE):**

| MDE (absolute) | Treatment rate | n per arm (rounded z) | Total |
|---|---|---|---|
| 3 pp | 0.48 | 4,334 | about 8,670 |
| 4 pp | 0.49 | 2,441 | about 4,880 |

A 4 pp MDE needs about 56% of the sample of a 3 pp MDE. The choice of MDE should be revisited if the first traffic check shows the 3 pp target is out of reach.

**Denominator note.** The riders counted must have completed a first ride, because S8 is measured on first completed rides. Riders who never complete a first ride do not enter the calculation. Using the illustrative funnel rates in plan section 2 (S5 60%, S6 75%, S7 85%), the completion chance from fare view is 0.60 × 0.75 × 0.85 = 0.3825. That means about **22,660 fare views** are needed to produce about 8,670 completed first rides. These rates are assumptions and must be replaced with the live funnel before launch.

### 1.6 Duration

**Traffic estimate.** The only public traffic figure is more than 250,000 new consumers in a single peak month (FY24/25, island-wide, secondary news summary, not verified against the primary results). A tenth of that is 25,000 per month, or about 830 per day across the whole island. At that rate the 22,660 fare views take about **27 days**, before any Western Province filter, new-rider filter or eligibility loss. The Western Province share is not known and must be measured.

**Rule:**

- Minimum run: 3 weeks. This covers two full weekly cycles (weekday and weekend, and rainy-season variation) plus the 7-day maturity window for S8.
- Expected run: set by the pre-launch traffic check. Estimate eligible fare views per day from the live app for two weeks before launch, then compute the date on which about 8,670 completed first rides are reached. The expected run is the later of that date and the 3-week minimum, plus 7 days of maturity.
- Fixed end date, set in advance. No peeking at the primary metric before the end date. Guardrails are watched daily for safety (section 1.7); they do not change the decision rule.

### 1.7 Guardrails

Guardrails stop or block shipping. Thresholds are absolute differences between treatment and control.

| Guardrail | Breach condition | Action |
|---|---|---|
| Cancellation rate after match | Treatment up by more than 1 pp absolute | Pause treatment; investigate |
| Driver acceptance rate | Treatment down by more than 2 pp absolute | Kill H1 treatment; move to H2 (driver-neutral) |
| Support contacts per 100 trips | Any clear increase in treatment | Do not ship. Threshold for "clear" to be fixed before launch (plan gives none). |
| Gross take per trip | Treatment down by more than 2% | Do not ship |
| Crash-free sessions | Lower in treatment than control | Pause treatment. Threshold to be fixed before launch (plan gives none). |

### 1.8 Decision rules

| Outcome | Rule |
|---|---|
| **Ship** | Primary lift is significant at alpha 0.05 (two-sided) and no guardrail is breached. |
| **Iterate** | S5 improves significantly but S8 does not. The promise is believed but not kept. Fix the change explanations and receipt, then re-test. |
| **Kill** | Driver acceptance guardrail breached. Stop H1 treatment and move to H2, which costs drivers nothing. |
| **Inconclusive** | Primary not significant at the fixed end date. Do not ship. Record the result. Do not extend without a pre-registered reason. |
| **Do not ship** | Any other guardrail breached, even if the primary is significant. |

### 1.9 Analysis notes

- **Sample ratio check.** Before reading the primary, confirm the 50/50 split. A mismatch beyond chance means an assignment or logging fault; stop and fix.
- **Intention-to-treat sensitivity.** The primary is defined on completed first rides, and the treatment may change who completes. As a sensitivity check, also report S8 measured on all riders assigned at fare view (second ride within 14 days of fare view). This is a proposed addition, not yet approved.
- **Factorial option.** Running H1 and H5 together as a 2 × 2 is possible if traffic is enough. Not planned; sequential is the default.

### 1.10 Event and instrumentation spec

Shared properties on every event: `test_id` (for example `H1`), `variant` (`control` or `treatment`), `part` (`A` or `B`), `lang` (`en`, `si`, `ta`), `platform` (`android` or `ios`), `install_id`, `account_id` (after signup), `ts`.

**Never send** phone numbers, OTP codes, names, precise GPS coordinates or payment card details. Locations are sent as place IDs from the mock or product list only.

| Event | When fired | Properties |
|---|---|---|
| `app_first_open` | First app launch after install | `install_ts` |
| `destination_set` | Destination chosen on screen 2 | `place_id`, `has_pickup_gps` |
| `fare_viewed` | Ride screen shows fares (screen 3), first time per rider | `ride_type_list`, `peak_on`, `fare_tuk_lkr`, `fare_flex_lkr`, `fare_car_lkr` |
| `fare_breakdown_opened` | Fare sheet opened (screen 4) | `ride_type`, `peak_on`, `source` (`link` or `sheet_trigger`) |
| `booking_confirmed` | Book CTA confirmed (S5) | `ride_type`, `payment` (`cash` or `card`), `fare_lkr` |
| `driver_matched` | A driver is matched (S6) | `wait_s`, `driver_accepted` (`true` or `false`) |
| `driver_declined` | Driver declines or cancels after assignment | `reason` (`driver_cancelled`, `timeout`, `other`) |
| `rider_cancelled_after_match` | Rider cancels after match (guardrail) | `elapsed_s` |
| `fare_change_shown` | A fare change notice appears on the trip (screen 6) | `change_type` (`route`, `wait`, `stop`), `delta_lkr`, `before_payment` (`true` or `false`) |
| `fare_change_accepted` | Rider taps Accept on a change | `change_type`, `delta_lkr` |
| `fare_change_deferred` | Rider taps "Ask at the end" | `change_type`, `delta_lkr` |
| `trip_ended_by` | Trip ends | `by` (`rider`, `driver` or `timeout`), `minutes_after_arrival`, `fare_final_lkr` |
| `receipt_delta_lkr` | Receipt renders (screen 8) | `delta_lkr`, `explained` (`true` if all delta lines are shown), `booked_lkr`, `final_lkr` |
| `payment_completed` | Payment recorded (cash or card) | `method`, `final_lkr` |
| `trip_completed` | Trip completes and is paid (S7) | `dispute_raised_24h` (`true` or `false`) |
| `help_reason` | Reason chosen on screen 9 | `reason` (`fare_higher`, `cash_on_card`, `trip_not_happened`) |
| `ticket_opened` | Ticket submitted (screen 9) | `ticket_ref`, `reason`, `on_hold_lkr` |
| `second_ride_booked` | Second booking confirmed within 7 days of first completed ride | `days_since_first_ride` (S8) |

**H5 events (Part A).** Used only in the H5 test, but logged on all arms so the funnel reconciles:

| Event | When fired | Properties |
|---|---|---|
| `language_selected` | Language chosen on Intro or Welcome | `lang` |
| `location_primer_shown` | Location sheet shown (A2) | `outcome` (`allowed` or `typed`) |
| `signup_started` | Phone step opened (A3 step 1) | `order` (`before_fare` or `at_book`) |
| `otp_sent` | Code sent | `resend` (`true` or `false`) |
| `otp_verified` | Code accepted | `attempts` |
| `otp_failed` | Code rejected | `reason` (`invalid` or `expired`), `attempt_no` |
| `wrong_number_tapped` | "Wrong number" back link used | none |
| `account_created` | Account exists after verification | `signup_ms` |
| `notification_primer_shown` | Alerts primer shown after match | `outcome` (`allowed`, `declined`) |

### 1.11 Readout dashboard (text sketch)

```
H1 FARE YOU CAN HOLD   test_id H1   window: start to end date   status: running | closed
---------------------------------------------------------------------------------
TRAFFIC   completed first rides  [ n / 4,334 per arm target ]   SRM check  OK | FAIL
---------------------------------------------------------------------------------
PRIMARY   S8 second ride within 7 days
          control  xx.x%   treatment  xx.x%   diff +x.x pp   95% CI [ , ]   p =
          MDE check: diff >= 3 pp ?   significant ?   -> rule: SHIP | ITERATE | INCONCLUSIVE
---------------------------------------------------------------------------------
SECONDARY S5 confirm from fare view   |   S7 paid without dispute (24 h)
---------------------------------------------------------------------------------
FUNNEL    S1 .. S8 by arm           observed vs assumed (plan section 2)
          bars per stage, arm-coloured; assumed rates shown as tick marks
---------------------------------------------------------------------------------
GUARDRAILS                     threshold     control    treatment   status
  cancel after match           +1 pp         x.x%       x.x%        ok | breach
  driver acceptance            -2 pp         x.x%       x.x%        ok | breach
  support contacts / 100 trips clear rise    x.x        x.x         ok | breach
  gross take per trip          -2%           LKR x      LKR x       ok | breach
  crash-free sessions          no drop       x.x%       x.x%        ok | breach
---------------------------------------------------------------------------------
FARE PROMISE  fare_change_shown   accepted %   deferred %   explained receipts %
              by change_type (route, wait, stop)
---------------------------------------------------------------------------------
HELP          help_reason mix (fare_higher, cash_on_card, trip_not_happened)
---------------------------------------------------------------------------------
SPLITS        platform (android, ios) | lang (en, si, ta) | ride_type | peak on/off
              each split shown only with its own n; no split is a decision basis
---------------------------------------------------------------------------------
```

## 2. H5 spec: fare before account (Part A)

Shorter spec. H5 is ranked fourth (ICE 19) and is the lower-confidence bet. Benchmark evidence only (Uber's documented onboarding change, verified; other apps unverified). No PickMe complaint evidence.

- **Hypothesis:** If a new rider sees a fixed fare for their own trip before signing up, and permissions are asked when they matter, then more installs reach a confirmed booking, because the rider sees value before paying the signup cost.
- **Arms:** Treatment: Welcome (A1), Where (2) with location primer (A2), Ride (3), Fare sheet (4), then Confirm your number (A3) at "Book", then Finding with notification primer. Control: Welcome with "Create an account to continue" and the phone field first, then Confirm your number, both permission asks, then home.
- **Unit and assignment:** new install, assigned at first launch (install ID), 50/50. Separate from H1 (see 1.2).
- **Primary metric:** confirmed first booking within 24 h of install.
- **Guardrails:** OTP failure rate (`otp_failed` per `otp_sent`), fraudulent or no-show bookings by new accounts, fare-quote API load (requests per install). Breach of any guardrail blocks shipping; thresholds to be set before launch.
- **Sample size (placeholder).** No install-to-booking baseline exists for PickMe. The worked example below uses an **assumed** baseline of 0.30 to show the arithmetic; replace it with the live control rate after the traffic check.
  - Inputs: alpha 0.05 two-sided, power 0.80, z 1.959964 and 0.841621, p1 = 0.30 (assumption), d = 0.03 (MDE choice), p2 = 0.33.
  - p̄ = 0.315; p̄ (1 − p̄) = 0.215775; 2 × 7.848876 × 0.215775 / 0.0009 = 3,763.5
  - **About 3,764 installs per arm, 7,528 in total**, at the assumed baseline. The count goes up if the baseline is lower and the MDE is kept at 3 pp.
- **Duration:** same rule as H1 (section 1.6). Minimum 3 weeks; a 24 h primary window means the late installs need a further day. Install volume is not known and is measured in the pre-launch traffic check.
- **Decision rules:** Ship if the primary lift is significant and no guardrail is breached. Iterate if the Verify screen drops many installs (`otp_failed` or abandon before verify is high) even though the fare view works. Kill if the OTP failure guardrail breaches.
- **Events:** the H5 events in section 1.10 (`language_selected`, `location_primer_shown`, `signup_started`, `otp_sent`, `otp_verified`, `otp_failed`, `wrong_number_tapped`, `account_created`, `notification_primer_shown`), plus `app_first_open`, `destination_set`, `fare_viewed` and `booking_confirmed`.

