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
