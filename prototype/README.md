# First ride concept (prototype)

Unofficial concept. Not affiliated with PickMe. A React prototype of a new rider's first session, from install to a first ride they can trust. See the repository root for the research and plan.

## Run

```
npm install
npm run dev
```

Open the printed local URL. The phone frame shows the concept banner and a variant chip. The demo controls (beside the frame on desktop, behind the Demo button on phones) switch variant, peak pricing, scenario, language and reduced motion.

## Scripts

| Script            | What it does                                                  |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Vite dev server                                               |
| `npm run build`   | Type-check, build to `dist/`, copy `index.html` to `404.html` |
| `npm run preview` | Serve the production build on port 4173                       |
| `npm run lint`    | ESLint (typescript, react-hooks, jsx-a11y) and Prettier check |
| `npm run format`  | Prettier write                                                |
| `npm run test`    | Vitest unit tests                                             |
| `npm run e2e`     | Playwright and axe (builds and previews first)                |

First time running e2e: `npx playwright install chromium`.

## Deploy

GitHub Pages through `.github/workflows/pages.yml` on every push to `main`. The workflow builds with `BASE_PATH=/pickme-first-session/` and runs the e2e job only when `prototype/tests/e2e/*.spec.ts` exists. Set Pages source to GitHub Actions in the repository settings. Routing uses `HashRouter`, and `dist/404.html` is a copy of `index.html`.

Local build for a sub-path: `BASE_PATH=/pickme-first-session/ npm run build`.

## Structure

- `src/state` reducer (`rideMachine.ts`), mock data, `RideContext`
- `src/i18n` `I18nContext`, typed keys, `strings/en.ts` (source of truth), `si.ts`, `ta.ts`
- `src/components` shared UI (PhoneFrame, Sheet, Radio, Notice, LiveRegion, DemoControls and others)
- `src/screens` one file per screen; `src/app/routes.tsx` is the route table
- `src/styles` design tokens, base and component styles

## i18n review status

English is the source. Sinhala and Tamil are machine drafts and need native-speaker review (`reviewStatus` in `src/i18n/strings/si.ts` and `ta.ts`: `machine-draft, needs native review`). Missing keys fall back to English and the frame shows one "EN" chip. Keys are `screen.element[.state][.variant]`; add a key to `en.ts` and the types follow.
