# Zero-Maintenance Portfolio

A automated, zero-friction developer portfolio system driven by GitHub API, Vercel Deploy Hooks, and dynamic layout engines.

## Features

- **Authenticated Data Pipeline:** Uses a GitHub Personal Access Token (`GITHUB_PAT`) to fetch public repositories without rate limits.
- **Automated Sync Engine:** Runs a weekly GitHub Action (`.github/workflows/portfolio-sync.yml`) that pings a Vercel Deploy Hook to build the static site.
- **Zero-Maintenance Metadata Parsing:** Scans repositories for a `PORTFOLIO.json` file at root level. Missing files dynamically hide the repository from display.
- **Asset Validation Pipeline:** Validates custom media assets and Google Drive URLs (`scripts/verify-assets.js`) prior to compilation.
- **Editorial UI & Dynamic Layout Engine:**
  - **Odd/Even Flex-Hero Engine:** Alternates project layout order and spans odd final items to 100% width.
  - **Auto-Fit Certifications Grid:** Uses a three-tier logo fallback strategy (Custom URL $\rightarrow$ Simple Icons CDN $\rightarrow$ Monogram Avatar).

---

## Architecture & Data Flow

```
[ GitHub Repositories ] --( PORTFOLIO.json )--> [ Authenticated Fetch Script ]
                                                          |
                                                          v
[ Vercel Deploy Hook ] <--( Weekly Cron )-- [ GitHub Actions Sync Workflow ]
          |
          v
[ Static Build Engine (Vue/Nuxt) ] --> [ Pre-Build Asset Verification ] --> [ Editorial UI ]
```

---

## Quick Setup Guide

### 1. Configure GitHub PAT
Generate a classic GitHub Personal Access Token with **read-only** public repository access and save it in Vercel **Settings > Environment Variables** as `GITHUB_PAT`.

### 2. Configure Vercel Deploy Hook
Create a Deploy Hook named `GitHub-Cron-Sync` in Vercel targeting `main`, and store the endpoint URL in your repository secrets as `VERCEL_DEPLOY_HOOK_URL`.

### 3. Add Specification to Repositories
Add a `PORTFOLIO.json` file to the root of any repository you wish to feature:

```json
{
  "tier": 1,
  "priority": 100,
  "title": "StudyLoop",
  "category": "Desktop App / AI Systems",
  "date": "2026-05",
  "techStack": ["Go", "Wails", "Vue 3", "SQLite", "FSRS"],
  "summary": "Local-first desktop AI tutoring application combining FSRS cognitive modeling and semantic vector chunking.",
  "media": {
    "thumbnail": "https://lh3.googleusercontent.com/d/YOUR_GDRIVE_FILE_ID",
    "videoDemo": "https://drive.google.com/uc?export=download&id=YOUR_GDRIVE_FILE_ID"
  }
}
```

---

## Documentation

Comprehensive project documentation is available in the [`docs/`](file:///c:/Users/vishn/PROJECT/AUTO%20PORTOFLIO/docs) directory:
- [REQUIREMENTS.md](file:///c:/Users/vishn/PROJECT/AUTO%20PORTOFLIO/docs/REQUIREMENTS.md) - System specifications and requirements.
- [PLAN.md](file:///c:/Users/vishn/PROJECT/AUTO%20PORTOFLIO/docs/PLAN.md) - Technical implementation plan and architectural breakdown.
