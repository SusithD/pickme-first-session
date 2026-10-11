# 03 Benchmark: new-rider first session

Date of research: 2026-10-11. Scope: Uber, Grab, Gojek, Careem, Bolt, Rapido.

## Evidence key

- **[V]** verified by fetching the primary page this session
- **[S]** seen only in a search snippet or third-party page. Not fetched, so treat as unverified.
- **[U]** not found, or contradicted by sources. Do not use without checking the live app.

## Research limits

Many official help centers blocked or failed the fetch. Careem help pages returned 403. Uber's "request a ride without an account" page returned 404. Grab's help center returned an error page. Rapido's booking page and Bolt's help pages failed the SSL handshake or were not found. Most sign-up, permission-timing, and first-ride promo claims below are therefore [S] or [U]. Before design decisions are based on them, check each app directly on a real device in the target market.

## Per-app benchmark

### Uber

| Dimension | Finding | Status | Source |
|---|---|---|---|
| Signup method and steps | Rider app asks for mobile number first. The old Sign In vs Register fork was removed. Each data request is its own step. | [V] | https://www.uber.com/ci/en/blog/mobile-onboarding/ (same article as the Uber eng post; the eng.uber.com URL returned 404 on fetch) |
| Steps before first booking | No exact count found. The article describes the flow as a question-answer cycle driven by the server. | [U] count | same as above |
| Permissions timing | Push notification permission is handled as a post-onboarding "ConfigureStep", not in the initial flow. Location timing not stated in the article. | [V] for push. [U] for location. | same as above |
| Payment before booking | Help page says payment is "cash, a credit card, or an Uber Cash balance" depending on region. It does not say whether a payment method must be added before the first ride. | [V] (help page), payment-required question [U] | https://www.uber.com/us/en/ride/how-it-works/ |
| Guest or browse-first | Not found. Help page for guest ride returned 404. Onboarding article does not mention guest mode. | [U] | n/a |
| First-ride promos | Not found for the rider app. A 2015 Mapway partner case study claims A/B-tested signup and first-ride gains through a partner integration. This is not Uber's own app. | [S] (dated, partner) | https://developer.uber.com (Mapway case study, via search) |
| Fare transparency | Help page: the app shows "price estimates" before confirming. | [V] | https://www.uber.com/us/en/ride/how-it-works/ |
| Safety and trust | Help page: match plate, car, and driver photo; "never get in a car where the vehicle or driver identity doesn't match." Safety page: 911 with live location, RideCheck (off-route and crash sensing), 24/7 safety agents, masked numbers, driver background checks, auto insurance. | [V] | https://www.uber.com/us/en/safety/ ; https://www.uber.com/us/en/ride/how-it-works/ |
| Local adaptation | Onboarding rebuilt so market-specific copy and steps are server-driven, without app releases. Payment setup can be skipped in some markets. | [V] | https://www.uber.com/ci/en/blog/mobile-onboarding/ |

### Grab

| Dimension | Finding | Status | Source |
|---|---|---|---|
| Signup method and steps | No primary source fetched. Third-party text says: download, register, then choose pickup and drop-off on the booking screen. | [S] | https://www.grab.com/vn/en/blog/first-2-free-rides-100-000vnd-grab-mastercard-through-grabpay/ (search result, not the sign-up page) |
| Permissions timing | Not found. | [U] | n/a |
| Payment before booking | Not found. Card-linked promos require card selection at booking. | [U] for the general rule | search results only |
| Guest or browse-first | Not found. | [U] | n/a |
| First-ride promos | Older offers only: PH first 5 GrabCar rides free within 5 km (old page); PH P50 off first 5 rides with a code (2017); SG card-linked deal for first two cashless rides free (2017). Current: a Cambodia bank card 20% offer through 31 Dec 2026, capped at 2 redemptions a month. Other promos are event-specific or expired. | [S] for all, dates vary | https://www.grab.com/ph/blog/free-grabcar-rides/ ; https://www.ppcbank.com.kh/grab-pay-20off-ppcbank-visa/ |
| Fare transparency | Not found. | [U] | n/a |
| Safety and trust | Masked phone numbers; driver selfie verification; in-app SOS; trip sharing; route deviation monitoring. Article dated 21 March 2025. | [V] | https://www.grab.com/inside-grab/stories/support-at-every-step-heres-what-we-do-to-make-riding-with-grab-safe/ |
| Local adaptation | Promos are region- and payment-specific. Not verified further. | [S] | search results |
| Grab tech blog on rider onboarding | Not found. | [U] | n/a |

### Gojek

| Dimension | Finding | Status | Source |
|---|---|---|---|
| Signup method and steps | Phone number, then one-time code by SMS, then home screen. Described for Bali. | [S] | https://wise.com/au/blog/gojek-in-bali (third-party) |
| Permissions timing | Official GoRide help page does not mention app permissions. | [V] for the absence, [U] for timing | https://www.gojek.com/en-id/help/goride/bagaimana-cara-memesan-transportasi-motor |
| Payment before booking | Booking selector: GoPay, cash, LinkAja, card, Jago (list from GoCar help page). Cash is an option at booking. | [V] for booking page, [S] for list | https://www.gojek.com/en-id/help/goride/bagaimana-cara-memesan-transportasi-motor ; https://www.gojek.com/help/gocar/saya-ingin-memesan-transportasi-mobil |
| Guest or browse-first | Not found. | [U] | n/a |
| First-ride promos | Old Singapore 2019 offer: $5 voucher for verifying phone number, tied to PayLah!. Expired. | [S] (dated) | https://thesmartlocal.com/read/gojek-promo-code/ |
| Fare transparency | Not found on the GoRide page. | [U] | n/a |
| Safety and trust | Safe Trip Kit behind shield icon: Share Trip (SMS, WhatsApp, Messenger, LINE link), emergency help, insurance, safety handbook. Phone numbers masked. Emergency button limited (GoRide Jabodetabek). Coverage varies by country. | [S] | https://www.gojek.com/help/gocar/panduan-keamanan-keadaan-darurat-untuk-gocar ; https://go-jek.com/sg/safety |
| Local adaptation | Cash-to-cashless switch during trip in Jabodetabek. Driver change problem noted in Bali guide. | [V] for Jabodetabek switch (booking page); [S] for Bali | https://www.gojek.com/en-id/help/goride/bagaimana-cara-memesan-transportasi-motor |

### Careem

| Dimension | Finding | Status | Source |
|---|---|---|---|
| Signup method and steps | Valid mobile number, then 4-digit code by SMS or WhatsApp, then full name. Website signup also available. Password option on ride-hailing page. | [S] (help article returned 403 on fetch) | https://help.careem.com/hc/en-us/articles/360001609507-How-can-I-create-an-account |
| Permissions timing | Not found. | [U] | n/a |
| Payment before booking | Cash is chosen per trip at booking, not at signup. Card or wallet not stated as required at signup. | [S] | https://help.careem.com/hc/en-us/categories/1500001164901-Rides (search snippet; cash policy page 403) |
| Guest or browse-first | Guest booking described for websites. The help article says "only through the website", then says the app also works. Contradictory, so check the live app. | [S] / contradicted | https://help.careem.com/hc/en-us/articles/360001583588-Can-I-book-a-ride-for-someone-else-on-Careem |
| First-ride promos | Partner-specific only (Ooredoo QR60 code; bank first-ride offer). Time- and market-limited. | [S] | https://www.gulf-times.com/story/464848/ooredoo-teams-up-with-app-based-car-service |
| Fare transparency | Not found. | [U] | n/a |
| Safety and trust | Not found on fetched pages. | [U] | n/a |
| Local adaptation | Cash policy: captain must collect full fare; if no change, captain adds the excess as Pay wallet credit. | [S] | search snippet from Careem cash policy page |

### Bolt

| Dimension | Finding | Status | Source |
|---|---|---|---|
| Signup method and steps | Download, allow location, register with phone, Facebook, or Google (Ghana guide). | [S] (third-party) | https://goldchestgh.com/blog/bolt-ghana |
| Permissions timing | Location requested right after download (Ghana guide). | [S] | https://goldchestgh.com/blog/bolt-ghana |
| Payment before booking | Cash or card. Cash paid to driver at arrival (Ghana). Card optional, cash in select countries. | [S] | https://goldchestgh.com/blog/bolt-ghana ; app listing via search |
| Guest or browse-first | Not found. | [U] | n/a |
| First-ride promos | Ghana: first free ride via promo link; referral rewards. Changes often. | [S] | https://goldchestgh.com/blog/bolt-ghana |
| Fare transparency | Fare shown before booking in several listings ("see your fare upfront"). | [S] | app listing via search |
| Safety and trust | SOS: press and hold 3 seconds, then confirm (Kenya, 2020). Emergency assist button (Malta). Live trip-share link. Driver selfie verification. Auto check-in when vehicle is still too long. | [S] (news snippets; mostly 2020 to 2024) | https://www.connectingafrica.com/emerging-technology/bolt-introduces-additional-safety-features-on-driver-s-app ; https://www.maltatoday.com.mt/business/business_news/126334/bolt_rolls_out_new_trip_safety_features |
| Trip PIN | Not found. | [U] | n/a |
| Local adaptation | Varies by market. | [S] | search results |

### Rapido (India)

| Dimension | Finding | Status | Source |
|---|---|---|---|
| Signup method and steps | Download, pick language, verify phone with OTP, enter referral code if any. Multiple Indian languages supported. | [S] (third-party promo pages) | https://www.gopaisa.com/referral-signup-bonus-code-coupons-offers/rapido-referral-code-offer |
| Permissions timing | Not found. | [U] | n/a |
| Payment before booking | Payment mode is chosen at booking: Rapido Wallet, other wallets, or cash. Help page says if a digital payment fails, the rider pays the captain in cash. | [S] | https://help.rapido.bike/hc/en-us/articles/115003221154-How-can-I-pay-for-my-ride- (search snippet; fetch failed). Page appears dated (about 2019) |
| Guest or browse-first | Not found. | [U] | n/a |
| First-ride promos | Referral offers conflict across pages: 50 Rapido Coins, Rs 50 bonus, or Rs 25 cashback, each with a different code. Treat as unverified. | [S] | https://www.flux.ai/rapido-appreferral ; https://seedly.sg/posts/rapido-verified-referral-code-ckky5k6/ |
| Fare transparency | Marketing claim of 50 to 70 percent cheaper than cabs. Not an official figure. Fare display not verified. | [S] / [U] | promo pages |
| Safety and trust | Not found on fetched pages. | [U] | n/a |
| Local adaptation | Cash is a payment option. Rules differ by state for captain payouts (Karnataka: captain collects directly). | [S] | help search snippet |

## Transferable patterns for Sri Lanka

Each pattern names the app that shows it and the source. Status follows the key above.

1. **Phone number first, no sign-in or register fork.** Uber replaced the Sign In vs Register choice with a mobile number entry, after analytics showed people tapping back and forth. [V] Source: https://www.uber.com/ci/en/blog/mobile-onboarding/

2. **Defer non-essential permissions and setup until after the first value moment.** Uber treats push permission and payment setup as post-onboarding configuration steps. [V] Source: same as pattern 1. Apply to location: ask at the moment of booking, with a clear reason. Location timing for each benchmarked app is [U].

3. **Cash as a first-class payment choice at booking, not a hidden fallback.** Careem selects cash per trip at booking [S]. Gojek lists cash at booking and allows a switch to cashless during a trip in Jabodetabek [V]. Rapido lists cash alongside wallets [S]. Source: https://www.gojek.com/en-id/help/goride/bagaimana-cara-memesan-transportasi-motor ; https://help.careem.com/hc/en-us/categories/1500001164901-Rides

4. **Upfront fare estimate before confirming.** Uber shows price estimates before confirming [V]. Bolt shows fare upfront in listings [S]. Source: https://www.uber.com/us/en/ride/how-it-works/

5. **Driver and vehicle identity check at pickup.** Uber asks riders to match plate, car, and driver photo [V]. Bolt uses driver selfie verification [S]. Grab uses masked numbers and driver selfie checks [V] (Grab safety page). Source: https://www.uber.com/us/en/ride/how-it-works/ ; https://www.grab.com/inside-grab/stories/support-at-every-step-heres-what-we-do-to-make-riding-with-grab-safe/

6. **Share trip by a plain link over SMS or WhatsApp, so the recipient needs no app.** Gojek Share Trip sends a link via SMS, Messenger, WhatsApp, LINE [S]. Bolt sends a live tracking link [S]. Source: https://go-jek.com/sg/safety ; https://www.bangkokpost.com/business/general/2718706/bolt-launches-range-of-new-safety-features

7. **Masked phone numbers between rider and driver.** Grab [V], Uber [V], and Gojek [S] all mask numbers. Relevant to a Sri Lankan rider who does not want to share a number with a tuk-tuk driver. Source: https://www.grab.com/inside-grab/stories/support-at-every-step-heres-what-we-do-to-make-riding-with-grab-safe/ ; https://www.uber.com/us/en/safety/

8. **Press-and-hold SOS with a confirm step to avoid accidental triggers.** Bolt Kenya requires a 3-second hold plus a Yes confirmation [S, 2020 report, currency unverified]. Source: https://www.connectingafrica.com/emerging-technology/bolt-introduces-additional-safety-features-on-driver-s-app

9. **Server-driven onboarding steps so markets can change copy and flow without an app release.** Uber's rebuilt flow runs on a question-answer back end, and the authors say this supports market and experiment changes without new builds [V]. Relevant to adapting Sinhala and Tamil copy and cash-first steps for Sri Lanka. Source: https://www.uber.com/ci/en/blog/mobile-onboarding/

10. **Partner or referral code entry during signup, with a clear reward.** Rapido prompts for a referral code during signup [S]. Careem and Bolt run partner promo codes and first-ride offers [S]. Treat the reward values as unverified: Rapido's pages conflict with each other. Source: https://www.gopaisa.com/referral-signup-bonus-code-coupons-offers/rapido-referral-code-offer ; https://goldchestgh.com/blog/bolt-ghana

## Not found in this research

- **Sinhala or Tamil localization in any benchmarked app.** Not found in any source. [U]
- **Low-bandwidth "lite" apps.** Not found. Grab Lite, Uber Lite, and similar were not checked. [U]
- **Bike or tuk-tuk product copy.** Rapido is the only bike app benchmarked. Its onboarding copy was not verified. [U]
- **Goodux teardown of Uber's first ride.** Not found. The goodux.appcues.com index exists but no Uber entry was seen. [U]
- **Grab tech blog rider onboarding post.** Not found. [U]

## Sources

- https://www.uber.com/ci/en/blog/mobile-onboarding/ [V]
- https://www.uber.com/us/en/ride/how-it-works/ [V]
- https://www.uber.com/us/en/safety/ [V]
- https://www.grab.com/inside-grab/stories/support-at-every-step-heres-what-we-do-to-make-riding-with-grab-safe/ [V]
- https://www.gojek.com/en-id/help/goride/bagaimana-cara-memesan-transportasi-motor [V]
- https://help.careem.com/hc/en-us/categories/1500001164901-Rides [S]
- https://help.careem.com/hc/en-us/articles/360001609507-How-can-I-create-an-account [S, 403 on fetch]
- https://help.careem.com/hc/en-us/articles/4403499786771-Cash-payments-and-policy [S, 403 on fetch]
- https://goldchestgh.com/blog/bolt-ghana [S]
- https://www.connectingafrica.com/emerging-technology/bolt-introduces-additional-safety-features-on-driver-s-app [S]
- https://www.maltatoday.com.mt/business/business_news/126334/bolt_rolls_out_new_trip_safety_features [S]
- https://help.rapido.bike/hc/en-us/articles/115003221154-How-can-I-pay-for-my-ride- [S, fetch failed]
- https://www.gopaisa.com/referral-signup-bonus-code-coupons-offers/rapido-referral-code-offer [S]
- https://go-jek.com/sg/safety [S]
- https://www.gulf-times.com/story/464848/ooredoo-teams-up-with-app-based-car-service [S]
- https://www.ppcbank.com.kh/grab-pay-20off-ppcbank-visa/ [S]
- https://thesmartlocal.com/read/gojek-promo-code/ [S]
- https://wise.com/au/blog/gojek-in-bali [S]
