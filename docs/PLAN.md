# Architecture & Execution Plan: Zero-Maintenance Portfolio

## System Architecture Overview

```
+------------------+         Weekly Cron / Manual        +---------------------+
|  GitHub Actions  | ----------------------------------+ | Vercel Deploy Hook  |
+------------------+                                     +---------------------+
                                                                    |
                                                                    v
+------------------+       Authenticated API Scans       +---------------------+
|  GitHub API /    | <---------------------------------- | Static Build Engine |
| Raw Content CDN  | ----------------------------------+ |  (Vue / Nuxt)       |
+------------------+        PORTFOLIO.json Data          +---------------------+
                                                                    |
                                                                    v
                                                         +---------------------+
                                                         | Pre-Build Asset     |
                                                         | Verification        |
                                                         +---------------------+
                                                                    |
                                                                    v
                                                         +---------------------+
                                                         | Editorial UI        |
                                                         | Render Engine       |
                                                         +---------------------+
```

---

## Phase 1: Infrastructure & Security Setup

### Task 1.1: GitHub Personal Access Token (PAT) Generation
1. Navigate to GitHub Developer Settings $\rightarrow$ Personal Access Tokens (Classic).
2. Generate a token with `read-only` access for public repositories.
3. Save the token as `GITHUB_PAT` under Vercel **Settings > Environment Variables**.

### Task 1.2: Vercel Deploy Hook Configuration
1. Navigate to Vercel **Settings > Git > Deploy Hooks**.
2. Create a deployment hook named `GitHub-Cron-Sync` targeted at the `main` branch.
3. Save the generated deployment URL in GitHub Repository Secrets under `VERCEL_DEPLOY_HOOK_URL`.

---

## Phase 2: Automated Sync Engine

Create workflow definition `.github/workflows/portfolio-sync.yml` in the main portfolio repository:

```yaml
name: Weekly Portfolio Sync
on:
  schedule:
    - cron: '0 0 * * 0' # Runs every Sunday at midnight
  workflow_dispatch:    # Allows manual triggering via GitHub UI or CLI

jobs:
  trigger-vercel-build:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Vercel Deploy Hook
        run: curl -X POST "${{ secrets.VERCEL_DEPLOY_HOOK_URL }}"
```

---

## Phase 3: Authenticated Data Pipeline & Validation

### Task 3.1: Repository & Metadata Fetch Script (`scripts/fetch-projects.js`)

```javascript
import fetch from 'node-fetch';

async function fetchPortfolioData() {
  const pat = process.env.GITHUB_PAT;
  const username = 'vishnuj-n';
  
  // 1. Fetch all public repos
  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
    headers: { Authorization: `token ${pat}` }
  });
  const repos = await reposRes.json();

  const projects = [];

  // 2. Scan for PORTFOLIO.json
  for (const repo of repos) {
    const specRes = await fetch(`https://raw.githubusercontent.com/${username}/${repo.name}/main/PORTFOLIO.json`, {
      headers: { Authorization: `token ${pat}` }
    });

    if (specRes.ok) {
      const spec = await specRes.json();
      projects.push({ ...spec, repoName: repo.name });
    }
  }

  return projects.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}
```

### Task 3.2: Asset Validation Script (`scripts/verify-assets.js`)
- Pre-checks imagery and external links (e.g., custom logos and Google Drive assets) during build execution to prevent broken media assets in production deployments.

---

## Phase 4: Dynamic Editorial UI & Layout Engine

### Component 4.1: Project Layout (Odd/Even Flex-Hero Engine)
- Render flagship projects in borderless containers with alternating directions:
  - **Even Index:** Media Left $\rightarrow$ Text Right
  - **Odd Index:** Text Left $\rightarrow$ Media Right
- **Fail-Safe Rule:** If the flagship count is odd, force the final card to span 100% width as a Hero Banner.

### Component 4.2: Certifications Layout Engine
- Auto-fit CSS grid container.
- If total certificates count is odd, stretch the final card across the bottom row.
- **Logo Resolution Pipeline:** Custom URL $\rightarrow$ Simple Icons CDN (`https://cdn.simpleicons.org/<issuer>/<color>`) $\rightarrow$ Monogram Text Avatar.

---

## Phase 5: Repository Specification Protocol

Every published repository includes `PORTFOLIO.json` at its root:

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
