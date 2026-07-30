# Zero-Maintenance Portfolio

An automated developer portfolio built with Vue 3, Vite, and Tailwind CSS. Public GitHub repositories opt in by publishing a validated `PORTFOLIO.json` manifest at their root.

## How It Works

1. `scripts/fetch-projects.js` paginates the GitHub API and inspects each public repository for `PORTFOLIO.json`.
2. Valid manifests are enriched with repository URLs, stars, forks, license details, language bytes, and GitHub timestamps.
3. `scripts/verify-assets.js` checks public thumbnails and videos, normalizes supported Google Drive links, and removes inaccessible media fields.
4. Vue renders the generated `src/data/projects.json` using editorial Tier 1 and Tier 2 layouts.

Invalid or missing manifests are skipped independently. A complete GitHub outage preserves the last valid generated dataset when one exists.

## Setup

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Copy the variable names from `.env.example` into your local environment as needed. `GITHUB_PAT` is optional for public data, but raises the GitHub API rate limit. The target account resolves in this order:

1. `GITHUB_USERNAME`
2. `VITE_GITHUB_USERNAME`
3. `vishnuj-n`

Never commit a real token or `.env` file.

## Commands

| Command | Purpose |
|---|---|
| `npm run fetch-data` | Generate `src/data/projects.json` from GitHub. |
| `npm run verify-assets` | Validate and sanitize generated project media. |
| `npm run prepare-data` | Run ingestion and asset verification in sequence. |
| `npm test` | Run the dependency-free Node test suite. |
| `npm run build` | Refresh remote data, verify assets, and create a production build. |
| `npm run build:offline` | Build from the existing generated dataset without network access. |
| `npm run preview` | Preview the production build locally. |

## Deployment

Vercel owns the production build. GitHub Actions only triggers the Vercel Deploy Hook every Sunday at 00:00 UTC or when the workflow is dispatched manually.

1. Import the repository into Vercel and target the `main` branch.
2. Use Node.js 20 or newer, the build command `npm run build`, and the output directory `dist`.
3. Add `GITHUB_PAT` and `GITHUB_USERNAME` to the Vercel project environment. `GITHUB_PAT` should be a read-only token and must never use a `VITE_` prefix.
4. Create a Vercel Deploy Hook named `GitHub-Cron-Sync` for `main`.
5. Add the hook URL to the GitHub repository Actions secrets as `VERCEL_DEPLOY_HOOK_URL`.
6. Open **Actions > Weekly Portfolio Sync**, run the workflow manually, and confirm that the resulting Vercel production deployment succeeds.

During deployment, `npm run build` refreshes project data, verifies remote media, and then compiles the site. If GitHub is temporarily unavailable, the fetch script preserves the committed dataset when it is valid. A failed hook request or Vercel build does not replace the last successful production deployment.

For diagnosis, inspect the GitHub Actions run first. A missing or rejected hook fails the `Trigger deploy hook` step. If that step succeeds, inspect the linked Vercel build logs for ingestion, asset verification, or Vite compilation errors.

## Add A Project

Add a root-level `PORTFOLIO.json` to a public repository owned by the configured GitHub account. The minimal shape is:

```json
{
  "title": "Project name",
  "summary": "A factual project description between 40 and 500 characters.",
  "category": "Project category",
  "date": "2026-07",
  "tier": 2,
  "priority": 50,
  "techStack": ["Verified technology"]
}
```

See [`docs/schema.md`](docs/schema.md) for constraints, optional fields, and the repository-agent authoring prompt.

## Documentation

- [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md): system requirements
- [`docs/PLAN.md`](docs/PLAN.md): architecture and execution plan
- [`docs/DESIGN.md`](docs/DESIGN.md): visual system and responsive behavior
- [`docs/schema.md`](docs/schema.md): manifest contract
- [`docs/SPRINT.md`](docs/SPRINT.md): implementation status
