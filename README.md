# PayFlow Analyzer

> Transaction analytics dashboard — real-time spend categorization, anomaly detection, and burn rate forecasting.

## Tech Stack
- React 18 + TypeScript
- Recharts 2.x (ComposedChart, Bar, Line)
- React Router v6 (useSearchParams)
- Vite 5 + CSS Modules

## Features
- Smart category classifier — weighted keyword scoring with confidence %
- Anomaly detection — flags transactions > 2 standard deviations from category mean
- Burn rate projection — linear regression over last 30 days
- CSV export — RFC 4180-compliant one-click download
- URL filter state — date, category, amount filters in URLSearchParams

## Getting Started
```bash
npm install
npm run dev
```

## Deploy
```bash
npx vercel --prod
```
