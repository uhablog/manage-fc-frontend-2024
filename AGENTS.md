# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js 14 App Router frontend written in TypeScript. Main application code lives in `src/app`, with page routes in `page.tsx`, shared layouts in `layout.tsx`, and server route handlers in `src/app/api/**/route.ts`. Reusable UI components live in `src/app/component`, shared helpers in `src/libs`, global theme setup in `src/theme.ts`, and domain types in `src/types`. Static assets are stored in `public`. Use the `@/*` path alias for imports from `src`.

## Build, Test, and Development Commands
- `npm install` — install dependencies.
- `npm run dev` — start the local dev server at `http://localhost:3000`.
- `npm run lint` — run ESLint with the Next.js ruleset.
- `npm run build` — create a production build and catch type or route issues.
- `npm run start` — run the built app locally after `npm run build`.

## Coding Style & Naming Conventions
Prefer TypeScript for new code. Follow the existing style: 2-space indentation, semicolons, and concise React function components. Use `PascalCase` for component files such as `GameDetail.tsx`, `camelCase` for helpers, and keep Next.js route filenames framework-standard (`page.tsx`, `layout.tsx`, `route.ts`). Keep types in `src/types` and name them clearly, for example `PlayerStats.ts`. Lint with `next/core-web-vitals`; there is no Prettier config in this repo, so match the surrounding file style when editing.

## Testing Guidelines
There is currently no dedicated test runner configured in `package.json`. For every change, at minimum run `npm run lint`, and run `npm run build` for changes that affect routing, API handlers, authentication, or production rendering. If you add tests later, keep them close to the feature or under a dedicated `tests` directory and name them after the unit under test.

## Commit & Pull Request Guidelines
Recent history favors short, descriptive commit messages, often in Japanese, for example `選手の詳細ページ作成` or `不要なコンポーネント削除`. Keep commits focused on one concern. Pull requests should include a clear summary, impacted routes or components, related issue links, and screenshots or short recordings for UI changes. Note any required environment variables or backend API changes.

## Security & Configuration Tips
Do not commit secrets. This app depends on environment variables including `API_ENDPOINT`, `AUTH0_ISSUER_BASE_URL`, `AUTH0_M2M_CLIENT_ID`, `AUTH0_M2M_CLIENT_SECRET`, and `BLOB_READ_WRITE_TOKEN`. Many `src/app/api` handlers proxy requests to the backend, so verify auth and request payload changes carefully.
