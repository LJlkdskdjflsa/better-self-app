# HR AI

## About

HR AI is a web app that helps HR to find the best candidate and empower their workflow for their company. This app is built using Next.js, Chakra UI, and TypeScript.

## Pre-requisites

1. [Node.js](https://nodejs.org/en/) or nvm installed.
2. `pnpm` installed.

! before start develop please read the `[Tech team onboarding guide](https://www.notion.so/Tech-team-onboarding-Guide-c1d2fb93fe8b40d6af029623bf088bb5?pvs=4)` document.

## Getting Started

Run this command: `pnpm` or `pnpm install`

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/lib/pages/index.tsx`. The page auto-updates as you edit the file.

## File Structure

check file structure

```bash
tree -I 'node_modules|public'
```

## How to Run e2e Test (in local machine)

1. Build production with `pnpm build`, then run the production build using `pnpm start`.
2. Open another terminal (or new terminal tab, don't cancel / close the production server), then run the test with `pnpm test:e2e`.

References:

- https://nextjs.org/docs/testing#playwright
  - https://nextjs.org/docs/testing#running-your-playwright-tests


## Design branch

We use `design/{design_name}` branch to create layout of the design for the app.
Only design branch can use the commit without check of Git pre-commit hook.
```bash
git commit -m "Your commit message" --no-verify
```