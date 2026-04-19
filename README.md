# StratoStruct Frontend

StratoStruct is a React application for searching structural component suppliers by site postcode, comparing supplier coverage, distance, and drive time, and managing products/suppliers through an admin interface.

Live site: [https://www.stratostruct.com](https://www.stratostruct.com)

## Features

- Authenticated supplier search by UK postcode.
- Product/component selection drawer.
- Ranked supplier results panel over a Mapbox map.
- Supplier filters for sort order, maximum distance, minimum component matches, and route availability.
- Recommended supplier set for covering selected components with fewer suppliers.
- Map markers for site and suppliers, with route actions from supplier popups.
- CSV export for supplier results.
- Browser-local saved searches.
- Admin product creation, editing, and deletion.
- Admin supplier creation, editing, and deletion.
- Login, signup, logout, and account deletion flows.

## Tech Stack

- React 18
- Create React App / `react-scripts`
- Chakra UI
- Mapbox GL JS
- AWS S3 static hosting
- CloudFront CDN
- GitHub Actions deployment

## Project Structure

```text
src/
  components/      Reusable UI components
  context/         React context providers
  functions/       API and utility helpers
  hooks/           Auth/context hooks
  images/          Logo and static image assets
  pages/           Route-level pages
testing/
  functions/       Utility tests
.github/workflows/
  main.yml         S3/CloudFront deploy workflow
```

## Environment Variables

Create a local `.env` file in the frontend repo:

```bash
REACT_APP_BACKEND_API_URL=https://your-api-gateway-url/dev
REACT_APP_MAPBOX_API_KEY=your_mapbox_public_token
```

Both variables are read at build time. For GitHub Actions, configure them as repository secrets:

- `REACT_APP_BACKEND_API_URL`
- `REACT_APP_MAPBOX_API_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## Local Development

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm start
```

Build production assets:

```bash
npm run build
```

## Deployment

Deployments run from GitHub Actions on pushes to `main`.

The workflow:

1. Uses Node 20.
2. Installs dependencies with `npm ci`.
3. Builds the React app with GitHub Actions secrets.
4. Syncs `build/` to `s3://www.stratostruct.com`.
5. Invalidates CloudFront distribution `EW2V6Q17DPNPQ`.

Manual equivalent:

```bash
npm ci
npm run build
aws s3 sync build/ s3://www.stratostruct.com --region eu-west-2 --delete
aws cloudfront create-invalidation --distribution-id EW2V6Q17DPNPQ --paths "/*"
```

## Notes

- Saved searches are currently stored in `localStorage`, so they are browser/device-specific.
- The frontend API helper normalizes `REACT_APP_BACKEND_API_URL`, so either a trailing slash or no trailing slash is acceptable.
- The current Create React App build reports a large bundle warning; this is not a deploy blocker, but a future Vite/code-splitting pass would improve build performance and bundle size.
