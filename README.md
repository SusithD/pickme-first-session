# PickMe first session: an unofficial growth concept

From install to a first ride you can trust

[![Pages](https://github.com/SusithD/pickme-first-session/actions/workflows/pages.yml/badge.svg)](https://github.com/SusithD/pickme-first-session/actions/workflows/pages.yml)
![Code: MIT](https://img.shields.io/badge/code-MIT-green)
![Docs: CC BY 4.0](https://img.shields.io/badge/docs-CC%20BY%204.0-blue)

- A self-initiated concept for a new rider's first session on PickMe in Sri Lanka, covering install to booking (Part A) and booking to receipt and help (Part B).
- Desk research, a funnel audit built from labelled assumptions, hypotheses, a coded trilingual prototype and an A/B test plan.
- **Unofficial. Not affiliated with, endorsed by or sponsored by PickMe (Digital Mobility Solutions Lanka).**

## The two bets

The primary bet (H1, Part B) is that a rider who can hold the fare will book again. The booking screen shows a fixed fare with its breakdown and the only three things that can change it. Every change on the trip is explained, and the receipt explains any difference before payment. The rider can also end the trip themselves if the driver has not ended it within 60 seconds. The review evidence points to a trust gap between the fare shown and the fare charged, and this is where the work is focused.

The supporting bet (H5, Part A) is that a new rider who sees their own fare before creating an account will reach a confirmed booking more often. The sign-up step moves to the moment of booking, and each permission is asked when the rider can see why it matters. This bet rests on benchmark evidence, not on PickMe complaints, so it is ranked lower and will be tested separately from H1.

## Live prototype

**https://susithd.github.io/pickme-first-session/**

The prototype is a phone-sized frame with a demo panel beside it (a bottom sheet on mobile, opened from a "Demo" button).

- **Variant** switches between Control (a generic ride-hailing pattern, not PickMe's interface) and Treatment. The chip in the frame header always shows which one is active.
- **Scenario** switches the ride between normal, no driver, driver cancels, route change and driver asks for cash. Peak pricing, language (EN, සිං, தமிழ்) and a reduced-motion override are in the same panel.

The link works once the first GitHub Pages deploy has run.

## Research honesty

> [!NOTE]
> **This is desk research only.** About 30 public reviews and posts were read (Trustpilot, the App Store, press and social posts), and six ride-hailing apps were benchmarked: Uber, Grab, Gojek, Careem, Bolt and Rapido. There was **no teardown** of PickMe on a clean device, **no interviews** with riders, and **no PickMe data**. Every funnel rate and sample-size input is an assumption and is labelled as one. Google Play reviews were not read in full. The Sinhala and Tamil copy is a machine draft that **needs native-speaker review**. Primary research is the first step in [docs/next-steps.md](docs/next-steps.md).

## Structure

```
pickme-first-session/
├── README.md
├── LICENSE                     MIT (code)
├── PLAN.md                     decisions, hypotheses, build plan
├── research/
│   ├── 00-teardown-guide.md    how to capture a clean-device teardown (not yet done)
│   ├── 01-context.md           company and market fact sheet
│   ├── 02-review-mining.md     public review themes and sources
│   ├── 03-benchmark.md         six-app benchmark with evidence keys
│   └── 04-interview-guide.md   five first-use sessions (not yet run)
├── docs/
│   ├── decisions.md            D1 to D16, dated, with overrides
│   ├── prototype-spec.md       screens, routes, states, copy, tokens, variants
│   ├── experiment-plan.md      H1 test and H5 spec, sample sizes, guardrails, events
│   └── next-steps.md           primary research first, then H2 and H3
├── prototype/                  React 18, Vite, TypeScript, vanilla CSS, tests
│   ├── src/
│   ├── tests/
│   └── package.json
└── .github/workflows/
    └── pages.yml               lint, unit tests, e2e, build, deploy to Pages
```

Docs are CC BY 4.0. Code is MIT.

## Run it

The prototype lives in `prototype/`. Node 22 is used in CI.

```bash
cd prototype
npm ci
npm run dev       # local dev server
npm test          # unit tests (Vitest)
npm run e2e       # keyboard walk and accessibility checks (Playwright, axe)
```

## Status and next steps

- **Research:** desk research and benchmark done. Teardown, five interviews, Google Play review scrape and native-speaker review of Sinhala and Tamil are still to do.
- **Prototype:** planned as 13 screens (ten core screens plus three Part A screens), in English, Sinhala and Tamil, with a Control and Treatment variant. The build is tracked in `PLAN.md`, section 8.
- **Experiment:** H1 test and H5 spec are written in `docs/experiment-plan.md`. Nothing has been run.
- **Next:** primary research, then the H2 (rider-side trip end) and H3 (payment agreed before pickup) tests. See [docs/next-steps.md](docs/next-steps.md).

## Licence

- Code: MIT. See [LICENSE](LICENSE).
- Documentation (README, `docs/`, `research/`): Creative Commons Attribution 4.0 (CC BY 4.0).

## Author

Susith Deshan Alwis. [https://susith.theqexle.site](https://susith.theqexle.site)
