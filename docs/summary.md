# Summary: a first ride you can trust (two-minute read)

Unofficial, self-initiated concept. Not affiliated with PickMe (Digital Mobility Solutions Lanka). Desk research only: no teardown, no interviews, no PickMe data.

## Problem
Trust is won or lost in a new rider's first session. Public reviews of PickMe in Sri Lanka raise four themes, with about five items each:
- a fare higher than the estimate;
- a trip that, reviewers say, only the driver can end;
- drivers asking for cash on card trips;
- support tickets closed without an answer.

These are reports from reviewers. They were not checked in the app.

## Evidence, and its limits
- About 30 dated reviews and posts. Several were seen only as search snippets, Google Play reviews were not read at all, and Trustpilot reviews skew negative.
- A benchmark of six apps (Uber, Grab, Gojek, Careem, Bolt, Rapido), based on their help pages and on articles.
- No evidence either way on signup, OTP or permissions. That is a gap, not a finding.
- No funnel rates are public, so none are presented as fact.

## Two bets
1. **H1, primary: a fare you can hold.** A fixed fare with a breakdown, the three things that could change it (proposed rules) and a receipt that explains any difference. This is reasoned from repeated reviewer reports and from how Uber displays fares.
2. **H5, supporting: fare before account.** A new rider sees their own fare before signing up, and the OTP step moves to the moment they tap Book. The evidence is benchmark-only, so this ranks lower.

Rider-side trip end, one-tap disputes and agreeing the payment method before pickup are separate follow-on tests.

## What the prototype shows
The prototype is live and runs in a phone frame. It has:
- 13 screens in English, Sinhala and Tamil (the Sinhala and Tamil copy is a machine draft);
- a toggle between Control (a generic pattern, not PickMe's interface) and Treatment;
- scripted scenarios: no driver found, driver cancels, route change, and driver asks for cash;
- automated accessibility checks.

Fares, plates and rates are invented.

## How it would be tested
- **Assignment:** riders are randomised at their first fare view.
- **Primary metric:** intent-to-treat. Of all assigned riders, how many complete a second ride within 14 days of assignment.
- **Sample size:** a table across baselines of 15 to 35% and lifts of 2 to 4 percentage points. The planning case is a 15% baseline and a 3-point lift, about 4,800 riders.
- **Guardrails:** driver acceptance, driver earnings per hour, platform fare loss, cancellations, support and crashes. A fixed fare changes pricing and liability, so the plan states who absorbs each change.
- **Ship rule:** ship only if the lift is at least the minimum effect and its confidence interval is above zero.

## What is missing
- A teardown on a clean device.
- Five rider interviews.
- A usability test of the prototype.
- Native-speaker review of the Sinhala and Tamil copy.
- Real PickMe baselines.
- An agreement on driver economics.

Local questions such as tolls and parking paid in cash, the night surcharge, and giving change or rounding are listed as open in [next-steps.md](next-steps.md).

## Read next
[funnel-audit.md](funnel-audit.md), [hypotheses.md](hypotheses.md), [experiment-plan.md](experiment-plan.md), [prototype-spec.md](prototype-spec.md), [decisions.md](decisions.md), [next-steps.md](next-steps.md).
