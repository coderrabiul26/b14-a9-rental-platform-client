# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

**b14-a9-rental-platform-client** — the client app for a rental platform (an assignment project). Currently early stage: a scaffolded Next.js app with a homepage and a growing set of shared/UI components. Server/API work lives elsewhere (this repo is client-only for now).

## Commands

```bash
npm run dev      # dev server (Turbopack) at http://localhost:3000
npm run build    # production build
npm run lint     # ESLint (flat config in eslint.config.mjs)
```

No test framework is configured. Verify changes with `npm run lint` and a successful `npm run build`.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) with `cacheComponents`, `partialPrefetching`, and **React Compiler** enabled in `next.config.ts`.
- **React 19** with the React Compiler (`babel-plugin-react-compiler`).
- **Tailwind CSS v4** via `@tailwindcss/turbopack`; theme tokens/CSS variables live in `src/app/globals.css` (no `tailwind.config` file).
- **shadcn/ui** in the `base-nova` style — components are built on **`@base-ui/react`** (Base UI), *not* Radix. Icons: **lucide-react**. Utility: `cn()` from `src/lib/utils.ts`.
- TypeScript in strict mode; path alias `@/*` → `src/*`.

## Project Structure

```
src/
  app/            # App Router: layout.tsx, page.tsx, globals.css
  components/
    ui/           # shadcn primitives (button, card, dialog, ...) — mostly generated
    shared/       # app-level shared components (navbar, header)
  lib/            # utils (cn)
public/           # static assets
```

Add new routes as folders under `src/app`. Add new shadcn components with the shadcn CLI (`npx shadcn@latest add <component>`) rather than hand-writing them, so the `base-nova`/Base UI style stays consistent. Application-specific composed components go in `src/components/shared`.

## Conventions

- Default to **Server Components**; only add `"use client"` where interactivity is genuinely needed.
- Use the `@/*` path alias for all internal imports.
- Use `next/image` for images and `next/font` fonts (Geist Sans/Mono are already wired in `src/app/layout.tsx`).
- Class names are merged with `cn()`; styling relies on Tailwind v4 CSS-variable tokens defined in `globals.css`.
- Because React Compiler is enabled, avoid manual memoization (`useMemo`/`useCallback`/`memo`) unless there is a measured need — the compiler handles it.

## Next.js Version Warning

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
