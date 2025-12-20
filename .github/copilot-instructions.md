# Copilot instructions — my-portfolio

**Purpose:** Personal portfolio built with Next.js (App Router), TypeScript, and TailwindCSS. The site is data-driven: editable JSON files under `data/content/` and assets under `data/assets/` (uploaded via GitHub API by the admin UI).

## Quick start for contributors

- Run locally: `npm run dev` (uses `next dev`). Build: `npm run build` and `npm run start`.
- Lint: `npm run lint` (project uses `eslint` + `eslint-config-next`).
- TypeScript: `strict: true` in `tsconfig.json` and path alias `@/*` -> `./*`.

## Big-picture architecture 🔧

- Next.js App Router (`app/`). Primary pages: `app/page.tsx`, `app/projects`, `app/resume`, `app/admin`.
- Static/data driven content lives in `data/content/*.json` and `data/*.(ts|json)` provides typed exports.
- Admin UI (`app/admin`) calls server API routes under `app/api/admin/*` to: 
  - Authenticate (`POST /api/admin/login`) — expects `ADMIN_PASSWORD` env var and sets an `admin_auth` cookie.
  - Save content (`POST /api/admin/content`) — updates `data/content/<key>.json` via GitHub Contents API (requires `GITHUB_*` env vars).
  - Upload assets (`POST /api/admin/asset`) — uploads binary files to a path in the repository via the GitHub API and returns a `raw.githubusercontent.com` URL.
- Server-side content fetch: `lib/content.ts` uses the GitHub Contents API when `GITHUB_OWNER` and `GITHUB_REPO` are set; otherwise local `data/` files are used for development.

## Important files to reference (examples)

- Content flow: `lib/content.ts` (fetch from GitHub), `data/content/*.json` (local canonical content)
- Admin APIs: `app/api/admin/content/route.ts`, `app/api/admin/asset/route.ts`, `app/api/admin/login/route.ts`
- Admin client helpers: `app/admin/forms/saveContent.ts`, `app/admin/forms/uploadAsset.ts`
- Components & pages: `app/admin/*`, `components/*`

## Project-specific conventions and gotchas ⚠️

- Environment variables are required for CMS features:
  - `ADMIN_PASSWORD` (used by `POST /api/admin/login`)
  - `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_TOKEN` (and optional `GITHUB_BRANCH`) are used by server APIs and `lib/content.ts`.
  - **Do not** commit secrets — this repo currently contains a local `.env.local` with real credentials; rotate any exposed tokens and ensure `.env.local` is added to `.gitignore` and removed from history.
- The content API validates keys against a fixed list: `site`, `seo`, `home`, `about`, `projects`, `resume`. Follow that shape when updating content programmatically.
- Asset uploads send a path and file to the GitHub contents API and return a `raw.githubusercontent.com` URL — keep uploaded asset paths stable, and avoid renaming files referenced in JSON.
- Cookie auth: `admin_auth` is set as `httpOnly` and expires after 8 hours; admin pages read that cookie for client-side gating.
- Prefer using the repository's fetch helpers (e.g., `saveContent`, `uploadAsset`) instead of calling endpoints directly so behavior and error handling remain consistent.

## Coding style & imports

- TypeScript with strict mode; add types under `types/` and follow existing typed data models (see `types/*.ts`).
- Imports often use the path alias `@/` (configured in `tsconfig.json`) — maintain that pattern.
- CSS is Tailwind (see `tailwind.config`/`postcss.config.mjs`), do not introduce a conflicting styling approach.

## Testing, CI, and checks

- There are no tests or CI workflows present; before opening a PR run:
  - `npm run lint` and `npm run build`
  - Manually test admin flows for content update and asset upload if you touched server/API logic.

## Safety and PR guidance ✅

- If a change requires env vars (e.g., `GITHUB_TOKEN`), document which vars are needed in the PR description and **never** paste secret values.
- For content changes, prefer updating `data/content/*.json` in a PR or use the admin UI which creates an edit via GitHub API — maintain consistent JSON schema/shape.
- For changes touching publishing logic, manually verify the produced `raw.githubusercontent.com` URLs and the content commit messages.

---

If you'd like, I can:
- (A) create a `.github/copilot-instructions.md` file now (this file was created), or
- (B) extend this with short examples (code snippets) for common tasks (e.g., "Add a new content key", "Upload an asset programmatically").

Please review and tell me if any sections need more detail or specific examples to include. 👍