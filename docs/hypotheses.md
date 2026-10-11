# Hypotheses: a new rider's first session

Unofficial concept by Susith Deshan Alwis. Not affiliated with PickMe / Digital Mobility Solutions Lanka. Written 2026-10-11.

**Status: desk research only.** No teardown, no interviews, no PickMe data. Everything about PickMe's current behaviour below is what reviewers report, not something verified in the app. Design values (the 60 s rule, the three change types, the 24 h reply) are proposals, not PickMe policy.

## 1. Order and what would change my mind

The order reflects evidence strength and testability, not a scored model. Each bet lists what would make it wrong.

| Order | ID | Bet | Evidence | What would change my mind |
|---|---|---|---|---|
| 1 (primary) | H1 | Fare you can hold: fixed fare, change rules, explained receipt | Repeated reviewer reports (fare theme about 5 items) plus a benchmark | Teardown shows PickMe already explains every fare change; or real data shows few first-ride fare gaps |
| 2 | H2 | Rider-side trip end | About 3 reviewer reports; no benchmark | Teardown shows the rider can already end the trip |
| 3 | H3 | Payment agreed before pickup | About 4 reviewer reports; Gojek benchmark [V] | Real data shows cash-on-card demands are rare |
| 4 | H4 | One-tap dispute with ticket and reply time | About 5 support reports; weak benchmark | Support cannot commit to a reply time |
| 5 | H5 | Fare before account (Part A) | Benchmark only; no PickMe reports | Teardown shows signup is already fast, or data shows little loss before the first fare |

H1 contains only the fare display, the change rules and the explained receipt. H2 and H4 are separate follow-on tests, so each result can be attributed.

## 2. Hypotheses

### 2.1 H1: Fare you can hold (primary bet, Part B)

**If** the booking screen shows a fixed fare with a breakdown (base, distance, peak), names the only three things that could change it (proposed: waiting over 5 minutes, a route change the rider approves, a stop the rider adds), and the receipt explains every change line by line before payment,

**then** booking confirmation from the fare view (S5) and second completed rides (S8) rise, and fare disputes (S7) fall,

**because** a charge above the estimate with no explanation is one of the most repeated themes in public reviews. One Trustpilot reviewer (1 Oct 2025) wrote "Charges you way higher than the estimated". Reviews also compare PickMe unfavourably with Uber on price stability.

**Evidence.**
- Reviews: about 5 items on the fare theme, plus about 2 on peak charges known only from snippets (02, sections 2 and 3).
- Benchmark: Uber shows price estimates before confirming [V]; Bolt shows fares upfront [S] (03-benchmark.md).
- Gaps: PickMe's live fare screen was not captured. The 15 to 25% tuk peak charge is a Yamu snippet only. The three change types are design values.

**Metrics.** Primary: second completed ride within 14 days of assignment, over all assigned riders (experiment-plan.md). Secondary: S5, S7. Instrumentation: `fare_breakdown_opened`, `fare_change_shown`, `fare_change_accepted`, `receipt_delta_lkr`.

**Risks.**
- **A fixed fare is a pricing and liability change, not only presentation.** Someone absorbs trip-to-trip variance. See experiment-plan.md, section 1.6, for who absorbs each change type and the driver guardrails.
- **A broken promise is worse than an estimate.** If the receipt adds an unexplained line, the trust gap widens.
- **Price level.** If the fixed number includes a buffer, riders pay more; if it sits at the midpoint, the platform absorbs overruns. The plan fixes the rule in advance and tracks it.
- **Unverified policy.** The fixed-fare model and change types must be checked against PickMe's real pricing rules before any test.

### 2.2 H2: Rider-side trip end

**If** the rider can confirm "I've arrived" and end the trip when the driver has not ended it within a set window after arrival (proposed: 60 seconds),

**then** disputed fares and card overcharges (S7) fall and second rides (S8) rise,

**because** reviewers report a trip staying open after arrival. One Trustpilot reviewer (1 Oct 2025) wrote "only the driver can end journey even though you reached your destination". This is a reviewer report, not verified in the app.

**Evidence.** About 3 reviewer items (02, section 2, item 3, which notes few reviews). No benchmark: the benchmarked safety pages do not describe rider control of trip end, which is a gap, not evidence against.

**Metrics.** Primary: disputes per completed trip. Secondary: share of trips closed by rider, driver or timeout; minutes from arrival to close.

**Risks.**
- **Driver may lose a legitimate fare** if the rider ends early or the timeout closes the trip while the driver waits. Lower driver-earnings risk than H1, but it still needs a driver-side change.
- **False arrival signal.** The arrival signal may come from driver-side location. One reviewer claims drivers can spoof geolocation (Trustpilot, 3 Oct 2026; unverified), so the signal may not be reliable.
- **The 60 s window** is a design choice with no data behind it.

**What would change my mind.** The teardown shows the rider can already end the trip, or real data shows trips rarely stay open.

### 2.3 H3: Payment agreed before pickup

**If** the payment method is chosen on the booking screen with cash as a first-class option and the driver's acceptance shows the agreed method,

**then** cash-demand incidents and cancellations fall,

**because** reviewers report drivers asking for cash on card trips. One App Store review (26 Jul, year not shown) wrote "ask you to pay with cash even though it's set up for card".

**Evidence.** About 4 reviewer items. Gojek lists cash at booking and allows a cashless switch in Jabodetabek [V]; Careem [S] and Rapido [S] list cash. The current PickMe payment menu is not verified.

**Metrics.** Primary: cash-demand incidents per 100 card trips (`help_reason`). Guardrails: cancellation after match, gross take per trip, driver acceptance.

**Risks.** Commission on cash vs card trips is unknown, so a cash-first default could change gross take. Drivers may refuse cash bookings. Card verification friction (about 2 snippet items) may shift riders to cash. The cause may be partly driver choice, which the rider interface cannot fix.

### 2.4 H4: One-tap dispute with a ticket number and stated reply time

A separate follow-on test, run after H1 and on top of H1's explained receipt.

**If** a rider who sees an explained change can open a dispute in one tap and gets a ticket number and a stated reply time (proposed: 24 hours),

**then** trust after a disputed trip rises and second-ride losses from unresolved fares fall,

**because** an explained difference with no route to contest it is half a promise. One App Store review (5 Jun, year not shown) describes a ticket closed "without feedback"; one Trustpilot reviewer (Sep 2025) wrote "Very poor app no chat service."

**Evidence.** About 5 support items (02, section 2). Benchmark weak: Uber lists 24/7 safety agents [V], Gojek a Safe Trip Kit [S]; neither describes a fare dispute flow.

**Metrics.** Tickets opened by reason; share answered within the stated time; second rides for riders who opened a ticket.

**Risks.**
- **A reply time PickMe cannot keep** repeats the failure reviewers describe. The 24 h reply in the prototype is a proposal and mock copy.
- **Contacts per trip about fares may rise by design**, because disputes become easy. The guardrail is therefore unresolved contacts and resolution within the stated time, not total contacts.
- It needs a support commitment, which is operational, not a design change.

### 2.5 H5: Fare before account (Part A)

Two separable parts. **H5a** (fare before account) is the bet. **H5b** (permission timing: location when setting pickup, notifications after booking) is secondary and is tested only after H5a, or as a separate arm, because bundling hides which change worked. The prototype shows both together as a demo.

**If** a new rider sees a fixed fare for their own trip before signing up,

**then** more new installs reach a confirmed booking (S2 to S5) and the first confirmed booking within 24 hours of install rises,

**because** the rider sees the value before paying the cost of signing up. Uber's rebuilt onboarding asks for a mobile number first and treats push permission and payment as later steps [V] (03-benchmark.md, patterns 1 and 2).

**Evidence.** Benchmark only. Bolt asks location right after download [S], the opposite choice, so the benchmark is mixed. Reviews: zero items on signup, OTP or permissions, which is a gap, not proof the flow is fine. PickMe's signup method is unconfirmed; "No password. We text you a 6-digit code." is design copy.

**Metrics.** Primary: confirmed first booking within 24 hours of install. Secondary: signup completion; OTP failure rate. Guardrails and thresholds: experiment-plan.md, section 2.

**Risks.**
- **Abuse.** Anonymous quotes invite scripted quote scraping and add fare-service load. Moving OTP to Book may also move the drop to the point of highest intent. Quote caps and OTP rate limits are in the plan.
- **SMS pumping.** Sending codes at a new point can raise fraudulent OTP traffic and SMS cost.
- **Bait and switch.** "Still LKR 540" must be true in every case, which ties H5 to H1's promise.
- **Null result.** If signup is already quick, H5 changes little.

**Confidence.** Lowest of the five: the case rests on a benchmark and on a problem not visible in reviews.

## 3. Why the hypotheses are tested separately

- **Attribution.** H1, H2, H3, H4 and H5 each move shared stages (S5, S7, S8). Bundling shows a lift without showing which change caused it.
- **Different costs.** H1 and H3 affect driver earnings and acceptance; H2 affects driver payment at trip end; H5 affects fraud and fare-service load. Each needs its own guardrails.
- **Different evidence.** H1 and H2 rest on reviewer reports; H5 on a benchmark.
- **Order.** H1 first, then H2 and H4, then H3 and H5, adjusted once real data exists.

## 4. Risks shared by all hypotheses

- No hypothesis has a measured baseline; the experiment plan gives sample sizes as a table over assumed baselines.
- The reviews are about 30 items and skew negative; effects may be smaller among riders who do not write reviews.
- Sinhala and Tamil copy is a machine draft and needs native-speaker review before any live test.
