# PickMe first-session review mining (02)

Research date: 2026-10-11. Scope: public reviews and press relevant to a new rider's first session (install, signup/OTP, permissions, service choice, pickup/drop, fare, payment, first booking, drop-off points).

Quote rule: every quoted phrase is under 15 words. Where a source was only seen as a search-result summary (not fetched), it is marked "snippet".

## 1. Sources checked

| # | URL | Accessible | What it gave |
|---|---|---|---|
| 1 | https://play.google.com/store/apps/details?id=com.pickme.passenger | No | Fetch returned truncated content, no rating or reviews visible. |
| 2 | https://apps.apple.com/app/id1000163961 | Yes | 3.6 of 5 from 159 ratings; 4 visible reviews (Apr 11, Jun 5, Jul 26 [year not shown], Dec 31 2025). |
| 3 | https://appgoblin.info/apps/1000163961 | Yes | 3.23 avg from 521 ratings (labelled "mixed"); 26K installs; store last updated 2026-10-06. No review text. |
| 4 | https://uk.trustpilot.com/review/pickme.lk | Yes | TrustScore 1.2/5 from 78 reviews; 88% one-star. 10 most recent reviews, Feb to Oct 2026. Trustpilot says the company has not invited reviews, so the sample may be skewed. |
| 5 | https://es.trustpilot.com/review/pickme.lk | Yes | Same totals. Dated reviews from Sep 2025 to Oct 2026, including payment and estimate-vs-final fare reviews. |
| 6 | https://kimola.com/reports/unlock-insights-with-the-pickme-app-user-feedback-analysis-google-play-en-154763 | No (HTTP 410). Snippet only | Third-party summary of Google Play reviews: praise for prompt service; complaints on rain service, arrival delays, card verification, bugs. No counts or dates. |
| 7 | https://kottu.org/go/?id=361990 | No (HTTP 500). Snippet only | Blogger's tuk-tuk ride; driver asked for location again. Undated. |
| 8 | https://restofworld.org/2024/sri-lanka-pickme/ | Yes | Rest of World, 6 Mar 2024. Driver-side and safety context; no first-session app complaints; does not cover cash vs card. |
| 9 | https://www.themorning.lk/articles/CwXXpi75OIGIjlBjV2j0 | Yes | The Morning, 5 Oct 2025. Ride-hailing driver-conduct complaints; PickMe is not named in the complaints. |
| 10 | https://reddit.com (search for "pickme sri lanka") | No (fetch blocked) | No Reddit PickMe threads retrieved. Search surfaced one Reddit snapshot (reddit.sentinel-team.org/posts/1qoanoi, Jan 2026) about tuk-tuk overcharging, snippet only. |
| 11 | Personal LinkedIn posts (individuals, not linked) | Not fetched. Snippet only | Two personal posts about trip-end and fare-dispute complaints; no reply from support. Not used as evidence in the docs or the case study. |
| 12 | https://www.yamu.lk/blog/pickme-and-uber-srilanka-what-the-fare-increases-mean-for-you | No (301 redirect not followed). Snippet only | Says PickMe added a 15-25% peak charge for three-wheelers where demand exceeds supply. |
| 13 | Daily FT, The Morning, AdaDerana, AsiaNews, Sunday Times, Business & Human Rights Resource Centre (PickMe vs taxi unions, driver pay, fare cuts) | Not fetched. Snippet only | Mostly driver-side or company-side news; no first-session complaints. |

## 2. Themes

Counts are rough, from the items I actually read (about 30 dated reviews and posts across Trustpilot, App Store, LinkedIn, press). They are not a census. "Snippet" means the count comes from a search summary, not the page.

| Theme | How often seen | First-session relevant? | Representative evidence (short paraphrase) + source |
|---|---|---|---|
| Final fare much higher than the estimate shown at booking | ~5 reviews (Trustpilot x3, Trustpilot Sep 2025 comparing with Uber, snippet from Kimola) | Yes: fare understanding | Reviewer says the app "Charges you way higher than the estimated" (1 Oct 2025). Trustpilot https://es.trustpilot.com/review/pickme.lk |
| Trip not ended by driver, so the meter keeps running and the card is charged | ~3 (Trustpilot, LinkedIn x2) | Yes: drop-off and payment | Reviewer says "only the driver can end journey even though you reached your destination" (1 Oct 2025). Trustpilot https://es.trustpilot.com/review/pickme.lk . A personal LinkedIn post describes a similar card overcharge (snippet only, not used). |
| Driver takes or demands cash / card set but driver asks for cash | ~4 (App Store, Trustpilot x2, one more review) | Yes: payment method | App Store reviewer says drivers "ask you to pay with cash even though it's set up for card" (Jul 26, year not shown). https://apps.apple.com/app/id1000163961 . Trustpilot: "Don't use card payment! They scam you!" (1 Oct 2025) |
| Card pre-authorisation or card verification friction | ~2 (Kimola snippet; Trustpilot, French review) | Yes: payment setup | Play reviews on card verification problems (Kimola, snippet). Trustpilot reviewer asked to "save my bank card for payment" for a parcel pickup, suggested minimum of 3 EUR (16 Sep 2025, French). https://es.trustpilot.com/review/pickme.lk |
| Cancellation charges or cancellations after acceptance; drivers asking riders to cancel | ~3 (App Store x2, Trustpilot) | Yes: first booking | Reviewer says a cancellation charge was "added to our trip that's not fair at all" (Apr 11). Another says drivers "may ask you to cancel" long trips (Jul 26). https://apps.apple.com/app/id1000163961 |
| Long waits, no driver found, order never collected, pre-booking fails | ~5 (Trustpilot Apr 17, May 31, Feb 14 2026; App Store Jul 26; Kimola snippet on rain) | Yes: booking reliability | Trustpilot Feb 14 2026: "Don't bother pre booking" (drivers searched about 15 minutes before pickup). Trustpilot May 31 2026: "Still waiting.." https://uk.trustpilot.com/review/pickme.lk |
| Driver calls to confirm pickup location; late arrival | ~3 (App Store Jul 26; kottu blog snippet; Kimola snippet on arrival delays) | Yes: pickup/drop | App Store reviewer: drivers "call to ask for locations" and arrive late (Jul 26). https://apps.apple.com/app/id1000163961 |
| No working support channel; tickets closed; hotline callback never came | ~5 (Trustpilot x3, LinkedIn x2, App Store Jun 5) | Yes: this is the giving-up trigger | App Store reviewer: support ticket closed "without feedback" after damage acknowledged (Jun 5). Trustpilot Sep 2025: "Very poor app no chat service." LinkedIn: hotline "promised a callback that never happened". https://apps.apple.com/app/id1000163961 ; https://es.trustpilot.com/review/pickme.lk |
| Driver overcharging (double fare, GPS spoofing claim, fuel charge not deducted) | ~5 (Trustpilot x4, Trustpilot Oct 2026 GPS claim) | Partly: fare trust | Trustpilot Oct 3 2026: "Beware: drivers can hack geolocation" (about a 9,000 LKR overcharge). https://uk.trustpilot.com/review/pickme.lk |
| Driver conduct and safety (intoxicated driver, pressure for cash, wheelchair user, harassment) | ~5 (Trustpilot Mar 13 2026 and Apr 25 2026, Aug 28 2026; The Morning Oct 2025; Rest of World 2024) | Low for first session, high for trust | Wheelchair user reports impatient driver on a multi-stop trip (Mar 13 2026). https://uk.trustpilot.com/review/pickme.lk . Note: one search summary dated this review Apr 2026; the fetched page says Mar 13 2026. |
| Fare shock from peak / surge charges on tuk-tuks | ~2 (Yamu snippet; AsiaNews snippet) | Yes: fare understanding | Yamu says a 15-25% peak charge applies to three-wheelers when demand exceeds supply (snippet). https://www.yamu.lk/blog/pickme-and-uber-srilanka-what-the-fare-increases-mean-for-you |
| Positive: prompt service, good drivers, "best way to get around" | ~3 (App Store Dec 31 2025; Kimola snippet; student paper) | Yes: counterweight | App Store reviewer: "Never had a bad experience with the app or the driver partners." (Dec 31 2025). https://apps.apple.com/app/id1000163961 |
| Signup / OTP / phone verification | 0 | Yes | No evidence found in any source I could read. See gaps. |
| Permissions (location, notifications, contacts) | 0 direct. One indirect: driver asking for location again (kottu snippet) | Yes | No evidence of permission-related complaints. |
| App bugs (unspecified) | ~2 (Kimola snippet; Trustpilot "Disgusting App", Jun 17 2026) | Yes, but vague | Kimola snippet says reviewers report bugs that need urgent attention. No specifics. |

## 3. Top 5 first-session friction points (ranked by evidence strength)

1. **Estimate vs final fare is not trusted.** The booking estimate and the final charge diverge, and the rider gets no explanation. Seen in about 5 reviews across Trustpilot and press snippets, with a comparison to Uber on price stability. Evidence: https://es.trustpilot.com/review/pickme.lk ; Yamu snippet (https://www.yamu.lk/blog/pickme-and-uber-srilanka-what-the-fare-increases-mean-for-you).

2. **No help when something goes wrong.** Support tickets get closed without a fix, emails go unanswered, and hotline callbacks do not come. This is the point at which a new rider stops using the app. Evidence: App Store Jun 5 review (https://apps.apple.com/app/id1000163961); Trustpilot (https://uk.trustpilot.com/review/pickme.lk); LinkedIn posts (snippet).

3. **Trip-end control sits with the driver, so the rider can be overcharged.** Riders say they reached the destination but the trip stayed open, and the card was charged far more than the estimate. Evidence: Trustpilot SG review 1 Oct 2025 (https://es.trustpilot.com/review/pickme.lk); a personal LinkedIn post (snippet only, not used).

4. **Booking reliability: waits, cancellations, and drivers who cancel after accepting.** Riders wait hours or get cancelled on, and pre-booking does not work as expected. Evidence: Trustpilot Feb 14, Apr 17, May 31 2026 (https://uk.trustpilot.com/review/pickme.lk); App Store Apr 11 and Jul 26 (https://apps.apple.com/app/id1000163961).

5. **Cash vs card mismatch.** The app is set to card, but the driver asks for cash, or a card is required up front. A new rider with no cash or an unverified card faces a payment surprise. Evidence: App Store Jul 26 review (https://apps.apple.com/app/id1000163961); Trustpilot "Don't use card payment!" (1 Oct 2025, https://es.trustpilot.com/review/pickme.lk).

Note on ranking: #3 has few reviews but is the most specific. #4 and #5 have strong counts but are only loosely first-session-specific. Items about driver safety and conduct were left out of the top 5 because they are not first-session friction, though they affect trust.

## 4. Gaps

- **Google Play is not verified.** The Play listing fetch returned no rating or reviews. The only Play figure is the AppGoblin aggregate (3.23 from 521 ratings, store last updated 2026-10-06), and the Kimola Play summary could not be fetched (HTTP 410). Play reviews should be read directly, sorted by newest.
- **Reddit is not verified.** Reddit fetches were blocked and search returned no PickMe-specific r/srilanka threads. The Reddit material found was one January 2026 snapshot about tuk-tuks. A manual search of r/srilanka and r/SriLanka for "PickMe" is still needed.
- **Signup, OTP, phone verification, and permissions: no evidence.** Searches for OTP and signup problems found nothing. This is a real gap, not a finding that the flow is fine. Suggested check: Play and App Store reviews sorted by newest for "OTP", "verify", "login", "location".
- **Several sources could not be fetched.** Kimola (HTTP 410), kottu.org (HTTP 500), Yamu (redirect not followed), and the LinkedIn posts (snippet only). Their claims are marked as snippet and should be re-checked before use in the case study.
- **Trustpilot sample is skewed.** The company has not invited reviews, 88% of reviews are one-star, and the page is labelled "Muy malo" for the Spanish locale. Treat it as a sample of the most angry users, not the average rider.
- **Dates are inconsistent in places.** The App Store Jul 26 review has no year shown. One search summary dated the wheelchair review April 2026, while the fetched page says March 13 2026. This report uses the fetched date.
- **No counts from a full review set.** The theme counts are from roughly 30 items I read, not a full scrape. The table gives rough counts only.
- **No first-session flow evidence from app-store screenshots or onboarding copy.** Store descriptions were not checked for onboarding steps beyond the developer's own claims (cash or cashless, live tracking, fare estimates).
- **Developer replies not fully checked.** One App Store developer reply (Feb 6) was mentioned but not read.
