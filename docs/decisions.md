# Decisions log

Project: PickMe first session, an unofficial growth concept. Not affiliated with PickMe (Digital Mobility Solutions Lanka).

All decisions below were made on 2026-10-11. D1 to D11 come from plan section 1; D13 to D16 come from the section 10 addendum of the same date and override earlier decisions where noted. Where a later decision overrides an earlier one, the earlier row keeps its text and is marked as superseded so the history stays visible.

## Decisions

| # | Date | Decision | Status | Rationale and notes |
|---|---|---|---|---|
| D1 | 2026-10-11 | Reframe scope from "first session" to "first ride": the stretch from seeing a fare to paying for it, plus getting help. | Partly superseded by D13 | Review mining found no evidence of signup, OTP or permission friction (a gap, not a finding) and repeated reviewer reports of fare shock, driver-only trip end, cash/card mismatch and slow support. D13 re-adds install-to-booking as Part A at lower confidence. |
| D2 | 2026-10-11 | Primary bet: a fare the rider can hold. Upfront fare breakdown, a proposed promise about what can change it, and every change explained before payment. The rider-side trip end (H2) and dispute route (H4) are separate follow-on tests. | Active; confirmed by D13 | Several complaint themes, each with about five items, point to one trust gap between the estimate and the receipt. Carried into H1. |
| D3 | 2026-10-11 | Repo name `SusithD/pickme-first-session`, with the description beginning "Unofficial growth concept for a new rider's first ride...". | Superseded by D14 | The name stays as set here. The description and scope were changed by D14. The local folder name `pickme-first-session` was never changed. |
| D4 | 2026-10-11 | Prototype stack: React 18, Vite, TypeScript, vanilla CSS with custom-property tokens, HashRouter, GitHub Pages at `https://susithd.github.io/pickme-first-session/`. | Active | No Tailwind, so the token system stays visible and reviewable. Hash routing avoids 404s on Pages. |
| D5 | 2026-10-11 | No clone of the current PickMe app. The baseline is (a) a problem storyboard built from public reviews and (b) a Control/Treatment toggle on the fare screens, where Control is a labelled "typical ride-hailing pattern". | Active | No teardown screenshots exist, so a clone would be invented. The storyboard shows the pain honestly; the toggle still gives a before/after. |
| D6 | 2026-10-11 | 10 screens, one linear flow, scripted scenario switches (no driver, driver cancels, route change, driver asks for cash). | Screen count superseded by D13 (13 screens); flow and scenario approach active | Scenario switches show state design without extra screens. The three Part A screens (Welcome, Location, Confirm your number) bring the total to 13. |
| D7 | 2026-10-11 | Sinhala / Tamil / English toggle is global. Full coverage on the fare-and-help screens, English fallback with a visible "EN" chip elsewhere. All si/ta strings flagged for native-speaker review. | Active; scope extended | Plan section 4 lists six fully translated screens (0, 3, 4, 7, 8, 9), not the five stated in D7. This log follows section 4. Section 10 adds Welcome and Verify (A1, A3) to the fully translated set. |
| D8 | 2026-10-11 | Research honesty: the case study states that the work is desk research only (about 30 reviews and posts, several seen only as snippets; a six-app benchmark), with no teardown and no interviews. Primary research is step one of next steps. | Active | A fabricated interview would be a serious problem; a stated gap is a mature one. |
| D9 | 2026-10-11 | Numbers policy: no funnel conversion rate or test result is presented as real. Every rate is tagged "assumption" with its reasoning. Case-study metrics count things done, not outcomes. | Active | Hard constraint. Applies to the funnel model, sample-size inputs and the portfolio entry. |
| D10 | 2026-10-11 | Social-media posts by private individuals (search snippets only) are excluded from every deliverable. | Active | Private individual; snippet only; not verifiable. |
| D11 | 2026-10-11 | Out of scope: Food, Trucks, Flash, driver app, maps SDK, live pricing, dark mode, native build, Figma files. | Partly superseded by D13 and D15 | Signup and permissions moved into scope as Part A. The other items remain out of scope. |
| D13 | 2026-10-11 | Two-part scope. Part A "Get to a fare fast" (install to booking). Part B "A first ride you can trust" (booking to receipt and help). Part B stays the primary bet. | Active. Overrides D1, D6 (screen count) and D11 (signup out of scope). | Part B has review evidence. Part A rests on benchmark evidence (Uber's documented onboarding change, verified) and is a lower-confidence bet. Saying so is the point. |
| D14 | 2026-10-11 | Repo `SusithD/pickme-first-session`, Pages at `https://susithd.github.io/pickme-first-session/`. Description: "Unofficial growth concept for a new PickMe rider's first session in Sri Lanka, from install to a first ride they can trust: desk research, funnel audit, hypotheses, coded React prototype and A/B test plan. Not affiliated with PickMe." | Active. Overrides D3 (name and description). | The name now matches the full scope and the local folder. All `pickme-first-session` URLs and the Vite `BASE_PATH` use the same name. |
| D15 | 2026-10-11 | Part A treatment is fare before account. A new rider picks a language, sets a destination and sees the fixed fare before any signup. Phone and OTP are asked only at "Book". Location is asked in context with a one-line reason. Notifications are asked after booking, tied to "tell you when your driver arrives". Control: a generic account wall first (language, phone, OTP, permissions, then home). | Active | Moves the value (a believable fare) ahead of the cost (signup), which is the benchmarked pattern. Ties each permission to a moment the rider understands. |
| D16 | 2026-10-11 | Signup copy stays honest: "No password. We text you a 6-digit code." The code field supports paste and one-time-code autofill (`autocomplete="one-time-code"`), a "Resend in 30 s" state and a "Wrong number" back link. | Active | Small, standard and accessible. Nothing is claimed about PickMe's current signup, which has not been verified. |

## Open points

These are not new decisions. Each needs an owner's call before the affected work starts.

1. **H1 assignment before signup.** Assignment is keyed to an install ID and carried onto the account (see `docs/experiment-plan.md`).
2. **Demo toggle versus live tests.** The demo uses one global variant toggle. Live tests cannot share it: H1 and H5 are assigned separately and run one after the other.
3. **Primary metric denominator.** The primary is now intent-to-treat: all riders assigned at first fare view, second completed ride within 14 days of assignment. The completed-first-ride version is a secondary cut.
4. **Duration.** Duration comes from a traffic-scenario table, not one estimate, and the real baseline comes from measured data.
5. **Thresholds.** Guardrail thresholds are filled with stated assumptions and re-read once real baselines exist.
6. **Translation scope.** Plan section 4 lists six fully translated screens (D7 says five); section 4 is used, with Welcome and Verify added.
7. **Driver economics.** Who absorbs each fare change is a proposal to agree with PickMe before any test.
