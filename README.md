# Jaime Osvaldo Website

Portfolio and marketing site for Jaime Osvaldo built with React, Vite, and deployed to Firebase Hosting.

## Stack

- React 18 with `react-router-dom`
- Vite 6 for dev/build and Vitest for tests
- SCSS for styling
- Firebase Hosting for static deployment
- Firebase Analytics and Storage on the frontend
- Web3Forms for the current contact flow
- Firebase Functions for private backend endpoints

## Project Structure

- [src/App.js](/Users/soyingeniero/Documents/my-website/src/App.js:1): router and scroll/analytics shell
- [src/main.jsx](/Users/soyingeniero/Documents/my-website/src/main.jsx:1): client entry and hydration bootstrap
- [src/entry-server.jsx](/Users/soyingeniero/Documents/my-website/src/entry-server.jsx:1): SSR entry used for prerendering
- [src/pages/Home.js](/Users/soyingeniero/Documents/my-website/src/pages/Home.js:1): homepage composition
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

By default the site still posts directly to Web3Forms so the contact form works without extra backend setup.

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

## Recent Cleanup

- Replaced hardcoded content blobs with shared data/config modules
- Migrated the frontend build from Create React App to Vite
- Added prerendered route output for SEO-critical pages
- Improved navigation, accessibility, and test coverage
- Added compressed audio preview support
- Added optional backend scaffold for private contact submissions
