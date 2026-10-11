# Hypotheses: a new PickMe rider's first session

Unofficial concept by Susith Deshan Alwis. Not affiliated with PickMe / Digital Mobility Solutions Lanka. Written 2026-10-11.

**Status: desk research only.** No teardown, no interviews and no PickMe data were used. The stage rates referred to here come from the assumed funnel in `funnel-audit.md`. They are assumptions.

## 1. Ranking

ICE scores are judgement, not data. The author set Impact, Confidence and Ease from the desk research to order the tests. None of them was measured. The ICE figure here is the simple sum of the three 1 to 10 scores, as in PLAN.md section 2 and section 10. The usual product form (Impact x Confidence x Ease) gives the same order: H1 504, H2 336, H3 294, H5 245.

| Rank | ID | Hypothesis (short) | Impact | Confidence | Ease | ICE (sum) | Stages moved |
|---|---|---|---|---|---|---|---|
| 1 (primary bet) | H1 | Fare you can hold | 9 | 7 | 8 | 24 | S5, S7, S8 |
| 2 | H2 | Rider-side trip end | 8 | 7 | 6 | 21 | S7, S8 |
| 3 | H3 | Payment agreed before pickup | 7 | 6 | 7 | 20 | S5, S6, S7 |
| 4 | H5 | Fare before account (Part A) | 7 | 5 | 7 | 19 | S2 to S5 |
| folded | H4 | One-tap dispute with ticket and reply time | in H1 | in H1 | in H1 | in H1 | S7, S8 |

H4 is not scored on its own. It is folded into H1 (section 2.4).

## 2. Hypotheses

### 2.1 H1: Fare you can hold (primary bet, Part B)

**If** the booking screen shows a fixed fare with a breakdown (base, distance, peak), names the only three things that can change it (waiting over 5 minutes at pickup, a route change the rider approves, a stop the rider adds), and the receipt explains every change line by line before payment,

**then** booking confirmation from the fare view (S5) and the second ride within 7 days (S8) rise, and fare disputes (S7) fall,

**because** a higher-than-estimated charge with no explanation is the most repeated complaint in the public reviews. One reviewer on Trustpilot (1 Oct 2025) wrote "Charges you way higher than the estimated". Reviews also compare PickMe unfavourably with Uber on price stability.

**Evidence.**
- Reviews: about 5 items on the fare theme, plus about 2 on peak charges that are known only from snippets (02-review-mining.md, section 2; section 3, item 1).
- Benchmark: Uber shows price estimates before a rider confirms (03-benchmark.md, Uber table "Fare transparency" [V]; transferable pattern 4). Bolt shows fares upfront in listings [S].
- Gaps: PickMe's live fare screen was not captured. The 15 to 25% peak charge on tuk-tuks is from a Yamu snippet only (02-review-mining.md, section 1, row 12). The three change items in the prototype (waiting, route, stop) are design values, not PickMe policy.

**Confidence (7 of 10, judgement).** The direction is supported by repeated reviews and by a benchmark. The size of the effect is unknown and nothing has been tested. The review sample is skewed, and the current fare format is unverified.

**Metric it would move.**
- Primary: second completed ride within 7 days of the first completed ride (S8). This follows the experiment plan (PLAN.md section 5).
- Secondary: booking confirmation from fare view (S5); first trip completed without a fare dispute (S7).
- Instrumentation: `fare_breakdown_opened`, `fare_change_shown`, `fare_change_accepted`, `receipt_delta_lkr`.

**Risks.**
- **Driver side of fixed fares.** A fixed fare moves price risk to the driver. A long or slow trip may be worth less to the driver. The guardrail is driver acceptance rate down by no more than 2 percentage points (PLAN.md section 5). Driver acceptance may fall even if rider metrics improve.
- **A broken promise is worse than an estimate.** The promise only helps if every change is enforced and explained. If the receipt adds an unexplained line, the trust gap is wider than before.
- **Price level.** If the fixed number includes a buffer, riders may pay more. The gross take guardrail is down more than 2% per trip (PLAN.md section 5).
- **Peak pricing.** A fixed fare that includes peak may read as a price rise. Peak charges appear in reviews (snippet only).
- **Unverified policy.** The fixed-fare model and the three change types must be confirmed against PickMe's actual pricing rules before any real test.

### 2.2 H2: Rider-side trip end

**If** the rider can confirm "I've arrived" and end the trip themselves when the driver has not ended it within 60 seconds of arrival,

**then** disputed fares and card overcharges (S7) fall, and the second ride rate (S8) rises,

**because** a trip that stays open after arrival is a recurring review complaint. One reviewer on Trustpilot (1 Oct 2025) wrote "only the driver can end journey even though you reached your destination". Section 3, item 3 of the review mining ranks this as the most specific trip-end problem.

**Evidence.**
- Reviews: about 3 items on this theme in the research count. This audit cites only the Trustpilot item (02-review-mining.md, section 2, theme "Trip not ended by driver"; section 3, item 3).
- Benchmark: none. The benchmarked apps' safety pages do not describe rider control of trip end (03-benchmark.md, Uber "Safety and trust", Grab and Gojek rows). This is a gap, not evidence that the approach fails.

**Confidence (7 of 10, judgement).** The complaint is explicit, but the count is small. The 60 second window is a design choice with no data behind it.

**Metric it would move.**
- Primary: disputed-fare rate per completed trip (S7).
- Secondary: share of trips closed by rider, driver or timeout (`trip_ended_by`); minutes from arrival to trip close; support contacts about "trip didn't end".
- Second ride rate (S8) as a longer-term check.

**Risks.**
- **Driver loses payment.** If the rider ends the trip early, or the timeout closes it while the driver is still waiting, the driver may lose a legitimate fare. This interacts with the waiting charge in H1.
- **False arrival signal.** The arrival signal may come from driver-side location data. A review (Trustpilot, 3 Oct 2026) says "Beware: drivers can hack geolocation", so the signal can be spoofed.
- **Driver app change.** This needs a change to the driver side too. The driver app is out of scope in PLAN.md (decision D11), which is why Ease is 6.

**Why it is tested separately.** H2 changes how a trip is closed, which is a different control from the fare display in H1. If both were bundled, a fall in disputes could not be attributed to either one.

### 2.3 H3: Payment agreed before pickup

**If** the payment method is chosen on the booking screen with cash as a first-class option, and the driver's acceptance shows the agreed method ("driver has agreed: cash" or "card"),

**then** cash-demand incidents and cancellations fall,

**because** riders report drivers asking for cash on trips set up for card. One App Store review (26 Jul, year not shown) wrote "ask you to pay with cash even though it's set up for card". Benchmark apps list cash at the booking step, so the choice is not hidden.

**Evidence.**
- Reviews: about 4 items on the cash-versus-card theme (02-review-mining.md, section 2; section 3, item 5).
- Benchmark: Gojek lists cash at booking and allows a switch to cashless during a trip in Jabodetabek [V] (03-benchmark.md, Gojek table; pattern 3). Careem selects cash per trip at booking [S]. Rapido lists cash alongside wallets [S].
- Gaps: the current PickMe payment menu is not verified (01-context.md, section 4). The cash-first default is a design choice, not a documented PickMe feature.

**Confidence (6 of 10, judgement).** Reviews show the mismatch, but they do not show how often it happens in the current app. The cause may be partly driver choice, which the rider interface cannot fix.

**Metric it would move.**
- Primary: cash-demand incidents per 100 card trips. Measured through the help reason "Driver asked for cash on a card trip" (`help_reason`).
- Guardrail: cancellation rate after match, up no more than 1 percentage point (PLAN.md section 5).
- Driver acceptance rate.

**Risks.**
- **Platform economics.** The research does not show how PickMe collects commission on cash trips compared with card trips. A cash-first default could change gross take. The guardrail is gross take per trip down by no more than 2%.
- **Card verification.** Card verification friction is reported (about 2 items, snippets). A cash-first default could push riders toward cash, which would change S5 in ways the test would have to separate.
- **Driver refusal.** A driver may refuse a cash booking, which would lower acceptance.
- **Rider preference.** Riders who prefer card may find a cash-first default off-putting. The Sri Lankan rider review in PLAN.md section 9 should check this.

**Why it is tested separately.** H3 changes the payment step and the driver's acceptance message. Its effects would be mixed into H1's fare effects if the two were tested together.

### 2.4 H4: One-tap dispute with a ticket number and a stated reply time (folded into H1)

**If** a rider who sees an explained change can open a dispute in one tap, and the app gives a ticket number and a stated reply time,

**then** trust after a disputed trip rises, and second-ride losses that come from unresolved fares fall,

**because** an explained difference with no route to contest it is only half a promise. Support is the repeated failure point: one App Store review (5 Jun, year not shown) describes a ticket closed "without feedback". Another reviewer on Trustpilot (Sep 2025) wrote "Very poor app no chat service."

**Why it is folded into H1.** The dispute step only exists on the receipt screen, and it depends on the same explained-delta data. A separate test would need the support team to commit to a reply time, which is an operational change, not a design change.

**Evidence.**
- Reviews: about 5 items on the support theme, including items not cited here (02-review-mining.md, section 2, theme "No working support channel; tickets closed; hotline callback never came"; section 3, item 2).
- Benchmark: weak. Uber's safety page lists 24/7 safety agents [V]. Gojek describes a Safe Trip Kit with emergency help [S]. Neither describes a dispute flow for fares.

**Confidence.** Folded into H1's confidence. The support gap is repeated, but the link to S8 is an interpretation of the reviews.

**Metric it would move.**
- Tickets opened and their reason (`ticket_opened`, `help_reason`).
- Share of tickets answered within the stated reply time. A stated time that is missed does more harm than no stated time.
- Second ride rate (S8) for riders who opened a ticket.

**Risks.**
- **A promise PickMe cannot keep.** A stated reply time that support does not meet repeats the failure the reviews describe. The 24-hour reply in the prototype is mock copy. It must not go live unless the support team can meet it.
- **Ticket volume.** Making disputes easy can raise contacts per 100 trips. That is a guardrail in PLAN.md section 5, and it cuts against H4 if it rises.

### 2.5 H5: Fare before account (Part A)

**If** a new rider can see a fixed fare for their own trip before signing up, and location and notification permissions are asked at the moment they matter (location when setting a pickup, notifications after booking),

**then** more new installs reach a confirmed booking (S2 to S5), and the first confirmed booking within 24 hours of install rises,

**because** the rider sees the value before paying the cost of signing up. Uber's rebuilt onboarding asks for a mobile number first, and treats push permission and payment setup as later steps (03-benchmark.md, Uber table "Signup method and steps" and "Permissions timing" [V]; transferable patterns 1 and 2).

**Evidence.**
- Benchmark: Uber [V] for phone-first signup and push timing. Bolt asks for location right after download [S], which is the opposite choice, so the benchmark is mixed.
- Reviews: none. Signup, OTP and permissions had zero items in the sampled reviews (02-review-mining.md, section 2; section 4). This is a gap, not proof the flow is fine.
- Gaps: PickMe's signup method was not confirmed (01-context.md, section 4). The copy "No password. We text you a 6-digit code." is design copy and must be checked against the live flow.

**Confidence (5 of 10, judgement).** This is the weakest evidence of the five. The case rests on a benchmark and on a problem that is not visible in the reviews. A null result is a real possibility if PickMe's signup is already fast.

**Metric it would move.**
- Primary: first confirmed booking within 24 hours of install (S2 to S5).
- Secondary: signup completion (S2); one-time code failure rate.
- Guardrails (PLAN.md section 10): one-time code failure rate; fraudulent or no-show bookings by new accounts; fare-quote service load.

**Risks.**
- **Anonymous quotes.** A fare can be requested before signup, which adds load on the fare service and invites abuse. The guardrails above cover this.
- **Bait and switch.** If the fare changes after the number is entered, the rider will feel misled. The "still LKR 540" copy must be true in every case, which ties H5 to H1's promise.
- **Permission grants.** Asking for location at pickup may lower the grant rate, even as it improves trust.
- **Null result.** If signup is already quick, H5 changes little and costs more build time than it saves.

**Why it is tested separately.** H5 changes what the rider sees before signup. H1 changes what they see after booking. Both move S5, so a bundled test would not show which change produced a booking. The two also need different units: H5 needs an assignment point at install or first launch, which the experiment plan has not yet set, while H1 is assigned at the first fare view.

## 3. Why the hypotheses are tested separately

- **Attribution.** H1, H2, H3 and H5 each move at least one shared stage (S5, S7 or S8). Bundling them would show a lift without telling the team which change caused it.
- **Different costs.** H1 and H3 affect driver earnings and acceptance. H2 affects driver payment at trip end. H5 affects fraud and fare-service load. A test that failed on one guardrail would stop the others, so each needs its own guardrail set.
- **Different evidence.** H1 and H2 rest on reviews. H5 rests on a benchmark. Testing them together would mix a strong bet with a weak one.
- **Order.** H1 goes first because it has the most review evidence and the highest ICE. H2 follows, since it costs drivers less, by judgement and not yet tested. H3 and H5 follow after the primary result is known.

## 4. Risks shared by all hypotheses

- All stage rates are assumptions, so no hypothesis has a measured baseline. The experiment plan's sample size uses the same assumed D7 baseline as funnel stage S8 (0.45), so it will change once real data replaces that assumption.
- The reviews are a sample of about 30 items and the Trustpilot sample is skewed toward dissatisfied users. Effects may be smaller among riders who do not write reviews.
- Sinhala and Tamil copy in the prototype is a draft. Any live test needs native-speaker review first.
