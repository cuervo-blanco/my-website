# Jaime Osvaldo Website

Portfolio and marketing site for Jaime Osvaldo built with React, Vite, and deployed to Firebase Hosting.

## Stack

- React 18 with `react-router-dom`
- Vite 6 for dev/build and Vitest for tests
- SCSS for styling
- Firebase Hosting for static deployment
- Firebase Analytics and Storage on the frontend
- Email links for portfolio contact; retained Web3Forms support
- Firebase Functions for private backend endpoints

## Project Structure

- [src/App.js](/Users/soyingeniero/Documents/my-website/src/App.js:1): router and scroll/analytics shell
- [src/main.jsx](/Users/soyingeniero/Documents/my-website/src/main.jsx:1): client entry and hydration bootstrap
- [src/entry-server.jsx](/Users/soyingeniero/Documents/my-website/src/entry-server.jsx:1): SSR entry used for prerendering
- [src/pages/FilmHomePage.js](/Users/soyingeniero/Documents/my-website/src/pages/FilmHomePage.js:1): combined Film, Companies, and Live & Theatre homepage
- [src/components](/Users/soyingeniero/Documents/my-website/src/components): layout, common UI, and content sections
- [src/config/site.js](/Users/soyingeniero/Documents/my-website/src/config/site.js:1): site metadata, navigation, social links, and contact config
- [src/config/prerender.js](/Users/soyingeniero/Documents/my-website/src/config/prerender.js:1): route metadata and structured data used by the prerender step
- [src/data/portfolio.js](/Users/soyingeniero/Documents/my-website/src/data/portfolio.js:1): portfolio media/content data
- [src/data/services.js](/Users/soyingeniero/Documents/my-website/src/data/services.js:1): service/category content data
- [public](/Users/soyingeniero/Documents/my-website/public): deploy-time static assets
- [scripts/prerender.mjs](/Users/soyingeniero/Documents/my-website/scripts/prerender.mjs:1): route prerender step for static HTML output
- [functions](/Users/soyingeniero/Documents/my-website/functions/index.js:1): Firebase Functions entrypoint for contact and licensing

## Local Development

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm test
npm run test:ci
```

`npm run build` performs three steps:

1. client build with Vite
2. server render bundle for the known routes
3. prerender pass that writes crawlable HTML into `dist`

## Contact Form Modes

Contact has its own `/contact` page, linked from the primary menu, with a compact message form. An email link is shown only when `VITE_CONTACT_EMAIL` is configured. The form supports direct Web3Forms submission or the optional backend endpoint.

Environment variables live in [.env.example](/Users/soyingeniero/Documents/my-website/.env.example:1):

- `VITE_CONTACT_ENDPOINT`
- `VITE_WEB3FORMS_ACCESS_KEY`

If you want the contact form to stop exposing the Web3Forms key in the browser:

1. Install function dependencies:

```bash
cd functions
npm install
```

2. Deploy the `contact` function and set the Web3Forms key as a Firebase secret.
3. Point `VITE_CONTACT_ENDPOINT` at the deployed function URL, for example:

```bash
VITE_CONTACT_ENDPOINT=https://us-central1-my-website-26cef.cloudfunctions.net/contact
```

The frontend is already compatible with either mode.

## Licensing API

This repo now also contains a self-hosted licensing backend for DidiCompensate under [functions/licensing](/Users/soyingeniero/Documents/my-website/functions/licensing).

What it does:

- creates license records in Postgres
- issues short-lived signed leases
- verifies those leases locally on the client
- refreshes and releases activations by requiring the previous signed lease

Routes are available in two shapes:

- direct Firebase function URL:
  `https://us-central1-my-website-26cef.cloudfunctions.net/licensing/health`
- same-domain Hosting rewrite:
  `https://jaimeosvaldo.com/api/licensing/health`

The API uses:

- [functions/sql/001_licensing_schema.sql](/Users/soyingeniero/Documents/my-website/functions/sql/001_licensing_schema.sql:1) for the Postgres schema
- [functions/test/licensingApi.test.js](/Users/soyingeniero/Documents/my-website/functions/test/licensingApi.test.js:1) for local smoke tests

Required Firebase secrets:

- `LICENSING_DATABASE_URL`
- `LICENSING_ADMIN_TOKEN`
- `DIDICOMPENSATE_PRIVATE_KEY`
- `DIDICOMPENSATE_PUBLIC_KEY`

Optional environment variables for the function runtime:

- `DIDICOMPENSATE_PRODUCT_ID`
- `DEFAULT_LEASE_DURATION_DAYS`

Typical setup:

```bash
cd functions
npm install
npm test
firebase functions:secrets:set LICENSING_DATABASE_URL
firebase functions:secrets:set LICENSING_ADMIN_TOKEN
firebase functions:secrets:set DIDICOMPENSATE_PRIVATE_KEY
firebase functions:secrets:set DIDICOMPENSATE_PUBLIC_KEY
firebase deploy --only functions
```

## Media Notes

- Source WAV files remain in [public/audio](/Users/soyingeniero/Documents/my-website/public/audio).
- Compressed portfolio previews are generated into [public/audio-previews](/Users/soyingeniero/Documents/my-website/public/audio-previews) and are the assets used by the site.

## Deployment

Firebase Hosting deploys through the GitHub workflows in [.github/workflows](/Users/soyingeniero/Documents/my-website/.github/workflows/firebase-hosting-merge.yml:1).

Current CI steps:

- `npm ci`
- `npm run test:ci`
- `npm run build`
- deploy hosting preview/live

Original WAV masters in `public/audio` stay in Git but are excluded from Hosting by `firebase.json`. The site uses the smaller `public/audio-previews` files. Keep a limited release history in the Firebase Hosting console to prevent retained releases from filling the project storage quota.

## Search visibility

The four portfolio pages include visible New York service descriptions, descriptive search titles, canonical URLs, social previews, and JSON-LD identifying the same person and verified work. The production build prerenders this content into HTML so it is available before JavaScript runs. Keep the location and roles accurate when editing `src/config/site.js` and `src/config/prerender.js`.

After publishing, verify `https://jaimeosvaldo.com` in Google Search Console using the Google account that owns the domain. Submit `https://jaimeosvaldo.com/sitemap.xml` and use URL Inspection to request indexing for `/`, `/dev`, `/art`, and `/contact`. Verification requires the domain owner's DNS access or Google's supplied verification token; no token is fabricated in this repository. Search rankings and indexing timing are controlled by Google.

## Recent Cleanup

- Replaced hardcoded content blobs with shared data/config modules
- Migrated the frontend build from Create React App to Vite
- Added prerendered route output for SEO-critical pages
- Improved navigation, accessibility, and test coverage
- Added compressed audio preview support
- Added optional backend scaffold for private contact submissions

## Updating Portfolio Content

- Companies: edit `companyGroups` in `src/data/clients.js`. Add `{ name: "New Company" }` to either list; a name alone renders cleanly. An optional `logo: "/img/company.svg"` uses a file in `public/img`, or import an image from `src/assets/img/client-logos`. Logos use accessible names without repeated visible labels. Set `logoTone: "light"` for a white transparent logo so it remains visible on the light grid. No component edits are required.
- Film credits: edit `filmCredits` in `src/data/film.js`. Each title uses its IMDb title ID and verified roles. Set `forthcoming: true` and a confirmed production `stage` for upcoming work. Optional `poster`, `featured`, and `mediaLinks` add artwork and links. Check IMDb before changing a stage or adding a release date.
- Animation: the Dark Knites feature lives in `src/pages/ArtHomePage.js`. Its web video and still are in `public/media`; the source render remains in Movies/Renders/DarkKnites/Video Renders. The video is a 1080p H.264/AAC copy with fast-start playback and is loaded when a visitor presses play.
- Live & theatre credits: add `{ title: "Production", roles: ["A1"], venue: "Venue" }` to `src/data/liveCredits.js`. An optional `image` object adds a gallery card; record its photographer and source. Sources for the current six images are in `content-sources/live-theatre-media.md`. The homepage presents these after Film and Companies.
- Dev: the single `/dev` page links to the GitHub profile defined by `githubProfileUrl` in `src/data/software.js` with the full interactive DSP dictionary directly beneath it.
- DSP: `src/data/dspBrief.js` holds the concept index and brief public sentences. Original essays remain in `src/data/dspDictionary.js`; all original source copy is also saved in `content-archive/2026-10-01-original-descriptions.json`. `GainDemo` and `DspConceptDemo` provide accessible controls, formulas, visible charts and short animations. Add a concept to `dspBrief.js`, then register a mathematical model in `src/data/dspDemos/` with controls, defaults, and a `compute(values)` function returning charts, a readout, and an optional equation/note. Longer model caveats are under a closed disclosure.

The canonical portfolio pages are `/` (Film, Companies, Live & Theatre), `/dev` (GitHub and DSP Dictionary), `/art` (Animation), and `/contact`. Older film/live/company/sample/project URLs redirect to the corresponding page anchors through Firebase Hosting and local preview middleware. `/terms` remains available. Legacy section subdomain roots still render on the client; canonical metadata points to the main-domain pages.

The original descriptions are preserved outside the public bundle in `content-archive/2026-10-01-original-descriptions.json`. Its `files` object contains exact pre-revision source text keyed by path; see `content-archive/README.md`.

Frontend checks run with `npm run test:ci`. The Functions backend uses a separate Node test runner: `npm --prefix functions test`.
