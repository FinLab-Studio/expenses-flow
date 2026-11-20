# FinLab — Expenses Flow

Personal finance app: track income and expenses by category, monthly budget, charts.
RS School team project.

Live: https://finlab-studio.github.io/expenses-flow/ (deployed from `dev`)

## Tech stack

TypeScript, Vite, Vitest, SCSS, ESLint, Prettier, GitHub Actions, GitHub Pages.
No framework: SPA on vanilla TypeScript with a hash router.

## Requirements

- Node.js 22.23.5 (see `.nvmrc`), npm 10

With nvm-windows: `nvm install 22.23.5`, then `nvm use 22.23.5`.
With nvm on macOS/Linux: `nvm install`, then `nvm use` (reads `.nvmrc`).

## Getting started

```bash
git clone https://github.com/FinLab-Studio/expenses-flow.git
cd expenses-flow
npm ci
npm run dev
```

Open the folder `expenses-flow` itself in VS Code / VSCodium (not a parent folder):
shared editor settings and recommended extensions live in `.vscode/`.

## Scripts

| Command                | What it does                       |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start the dev server               |
| `npm run build`        | Type-check and build to `dist/`    |
| `npm run preview`      | Serve the production build locally |
| `npm run typecheck`    | Type-check without building        |
| `npm test`             | Run unit tests once                |
| `npm run test:watch`   | Run unit tests in watch mode       |
| `npm run lint`         | Lint with ESLint                   |
| `npm run lint:fix`     | Lint and fix what ESLint can fix   |
| `npm run format`       | Format all files with Prettier     |
| `npm run format:check` | Check formatting (used in CI)      |

## Styles

SCSS lives in `src/styles/`; the entry point `main.scss` is imported in `src/main.ts`.

| File           | What it holds                                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_tokens.scss` | Design tokens as CSS custom properties: shared ones (fonts, font sizes, spacing, radii) and theme colors — light by default, dark in `:root[data-theme='dark']` |
| `_reset.scss`  | Minimal modern reset                                                                                                                                            |
| `_mixins.scss` | Breakpoint mixins `up()` / `down()` (`md` = 768px, `lg` = 1024px) and `visually-hidden`                                                                         |
| `_base.scss`   | Styles for plain HTML elements and the `.visually-hidden` class                                                                                                 |
| `components/`  | Component styles (added with the app shell)                                                                                                                     |

Conventions:

- Use tokens instead of raw values: `var(--color-surface)`, `var(--space-4)`. A new color goes into both themes under the same name.
- Name tokens by purpose (`--color-text-muted`), not by look (`--gray-600`): the dark theme changes the value, not the meaning.
- Desktop first: write desktop styles by default and phone overrides in `@include mx.down(md)`. Use `up()` only for ranges (`up(md)` + `down(lg)`) and for mobile-only components (e.g. the bottom sheet).
- Check the phone layout at 390px width (DevTools device toolbar).
- Breakpoints are Sass variables because `var()` does not work in `@media` conditions; everything else is a CSS custom property.
- Fonts (Inter, Space Grotesk) are self-hosted via Fontsource: no requests to Google Fonts.

```scss
@use '../../styles/mixins' as mx;

.card {
  padding: var(--space-6);
  background-color: var(--color-surface);
  border-radius: var(--radius-xl);

  @include mx.down(md) {
    padding: var(--space-4);
  }
}
```

## Workflow

- Branch from `dev`: `feat/`, `fix/`, `chore/`, `test/`, `docs/`, `refactor/` + short name + issue number, e.g. `feat/transaction-form-12`.
- Open a PR into `dev`; CI (lint, format, typecheck, test, build) must pass; one approval; squash merge.
- `main` receives `dev` at the end of the project.
