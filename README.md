# Better Self

## About

Better Self is a web app that helps you to be a better person. It's a simple app that helps you to track your daily habits and goals. You can also track your mood and journal your thoughts.
Now we first want to use PWA to support mobile because we want to make it easy for you to track your daily habits and goals, mob

## Pre-requisites

1. [Node.js](https://nodejs.org/en/) or nvm installed.
2. `pnpm` installed.

## Getting Started

1. You can either click `Use this template` button on this repository and clone the repo or directly from your terminal:

```bash
npx degit sozonome/nextarter-chakra <YOUR_APP_NAME>
```

2. After cloning the project, run this command: `pnpm` or `pnpm install`

3. Then, run the development server:

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

