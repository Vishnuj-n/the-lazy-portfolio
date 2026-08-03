# The Lazy Portfolio™*

> **Update where you work. Your portfolio follows.**

*\*Not actually trademarked—we were too lazy to file the paperwork.*

A low-maintenance portfolio system for developers who would rather build projects than maintain websites. Built with Vue 3, Vite, and Tailwind CSS.

---

## Why?

Every developer has built (or wanted to build) a portfolio.

The problem isn't creating it. The problem is **keeping it up to date**.

A new project. A new certificate. A new achievement. A better demo video.  

It all starts with:
> *"I'll update it later."*

Eventually, your portfolio becomes a snapshot of who you were months ago—not what you're building today.

**The Lazy Portfolio** fixes that by decoupling project metadata from portfolio website maintenance.

---

## Architecture Concept

Instead of editing your portfolio website every time you build something new, your portfolio website acts purely as an **aggregator**.

```text
[ Your Portfolio Site ] (LAZY-PORTFOLIO)
       │
       ├── Ingests via GitHub API
       │
       ├──► repo-1 / PORTFOLIO.json
       ├──► repo-2 / PORTFOLIO.json
       └──► repo-3 / PORTFOLIO.json
```

* 🚫 **No duplicate information** to write or update.
* 🚫 **No editing React/Vue component code** to add a project.
* 🚫 **No manual entry maintenance**.

---

## How It Works

1. `scripts/fetch-projects.js` paginates the GitHub API and inspects each of your public repositories for a root `PORTFOLIO.json`.
2. Valid manifests are enriched with repository metadata (stars, forks, license, tech language stats, push dates).
3. `scripts/verify-assets.js` verifies remote thumbnails and videos to prevent broken links on the live site.
4. Vue 3 compiles and renders `src/data/projects.json` into responsive editorial layouts.

---

## Part 1: Setting Up The Portfolio Website

Follow these steps to run your portfolio site locally:

### 1. Prerequisites
* **Node.js**: v20 or newer
* **npm**: v9 or newer

### 2. Installation & Run
```bash
# 1. Clone this repository
git clone https://github.com/vishnuj-n/LAZY-PORTFOLIO.git
cd LAZY-PORTFOLIO

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and set GITHUB_USERNAME=your-github-username

# 4. Fetch public project data and run locally
npm run prepare-data
npm run dev
```

Open `http://localhost:5173` to preview your portfolio site!

---

## Part 2: Opting Projects In via `PORTFOLIO.json`

To make any public repository show up on your portfolio site, simply add a `PORTFOLIO.json` file at its root:

```json
{
  "title": "StudyLoop",
  "summary": "Local-first desktop AI tutoring application combining spaced-repetition scheduling with semantic retrieval.",
  "category": "Educational Technology",
  "date": "2026-07",
  "tier": 1,
  "priority": 100,
  "techStack": ["Go", "Wails", "Vue 3", "SQLite", "FSRS"]
}
```

### Adding Manifests via AI Agents or Master Resume

You don't need to write `PORTFOLIO.json` manually:
* **Option A (AI Master Prompt)**: Copy the [Agent Prompt from `docs/schema.md`](docs/schema.md#agent-prompt) into ChatGPT, Claude, Gemini, or Cursor inside your project repo. It will inspect your codebase and generate a valid `PORTFOLIO.json`.
* **Option B (Master Resume + Skill)**: Give your [`master_resume.md`](master_resume.md) to an AI assistant equipped with the `add-to-portfolio` skill to onboard projects across your repos automatically.

---

## Deployment & Automated Sync

The portfolio updates automatically without manual re-deployments:

1. Deploy the site to **Vercel** (`main` branch, Node 20+, build command `npm run build`, output `dist`).
2. Add `GITHUB_PAT` and `GITHUB_USERNAME` to Vercel Environment Variables.
3. Create a Vercel Deploy Hook and add its URL to GitHub Repository Secrets as `VERCEL_DEPLOY_HOOK_URL`.
4. GitHub Actions automatically pings the deploy hook weekly (or on manual dispatch), triggering Vercel to re-fetch all `PORTFOLIO.json` manifests across your GitHub repos and rebuild the site.

---

## Roadmap & Feature Status

* 🟢 **v1 (Completed)**: Automated GitHub API ingestion, `PORTFOLIO.json` schema validation, responsive Vue 3 editorial site.
* 🟢 **v2 (Completed)**: LLM Master Prompt (`docs/schema.md`) & AI Agent skill (`add-to-portfolio`) for 1-command manifest generation.
* 🟢 **v3 (Completed)**: **GitHub Issue Templates & Intake Automation** — Add new credentials, experience, or AI/non-repo highlights directly via GitHub Issues (`.github/ISSUE_TEMPLATE`)! Automated workflow (`.github/workflows/issue-intake.yml` & `scripts/parse-issue.js`) parses issues and creates automated PRs.
* 🟡 **v4 (Active / Next)**: **AI GitHub Actions Pipeline** — Advanced natural-language issue parsing and automated verification via LLM adapters.


---

## Commands Reference

| Command | Description |
|---|---|
| `npm run dev` | Start Vite local development server. |
| `npm run fetch-data` | Ingest `PORTFOLIO.json` manifests from public GitHub repositories. |
| `npm run verify-assets` | Validate and sanitize project media URLs. |
| `npm run prepare-data` | Run `fetch-data` and `verify-assets` in sequence. |
| `npm test` | Run the automated Node.js test suite. |
| `npm run build` | Fetch fresh data, verify media assets, and create a production build. |
| `npm run build:offline` | Build from existing local `projects.json` without network calls. |
| `npm run preview` | Preview production build (`dist/`) locally. |

---

## Philosophy & Contributing

Your portfolio shouldn't become another side project.  
The work you're already doing should keep it alive.

Ideas, discussions, and pull requests are welcome!


