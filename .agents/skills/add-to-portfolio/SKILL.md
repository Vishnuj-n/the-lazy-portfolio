---
name: add-to-portfolio
description: "Inspects a target code repository, analyzes project structure and git history, generates a conforming PORTFOLIO.json manifest according to schema guidelines, validates it with validate-portfolio.py, and onboards the project into the portfolio. Use when users ask to add, onboard, or generate a PORTFOLIO.json for a project."
when_to_use: "add this project to my portfolio, onboard project, generate PORTFOLIO.json, validate PORTFOLIO.json, add project manifest"
dispatch_intent: "Onboard project into portfolio by analyzing repo, generating PORTFOLIO.json manifest, and running validation"
---

# Add to Portfolio: Project Onboarding Skill

Prefix your first line with 🥷 inline, not as its own paragraph.

This skill automates inspecting a code repository, discovering verified metadata, generating a strictly conforming `PORTFOLIO.json` manifest according to [schema.md](file:///c:/Users/vishn/PROJECT/AUTO%20PORTOFLIO/docs/schema.md), and validating it using cross-platform scripts.

---

## Workflow Steps

### 1. Repository Analysis
Inspect the target repository files to extract factual, verifiable metadata:
- **README & Documentation**: Project title, problem statement, key features.
- **Package Manifests**: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, etc., to identify exact tech stack dependencies.
- **Source Code & Git History**: Defensible creation/release dates (`YYYY-MM`), main programming languages, frameworks.
- **Deployment & Media**: Verified live URL, documentation link, or media thumbnail URLs (must be HTTPS without credentials).

> [!IMPORTANT]
> Use ONLY verified facts from repository code or documentation. Do NOT invent dates, metrics, features, or external URLs.

---

## 2. Manifest Constraints

Enforce the exact rules specified in `docs/schema.md`:

| Field | Type | Rules |
|---|---|---|
| `title` | String | Project display name (2 to 80 chars). |
| `summary` | String | Factual project description (40 to 500 chars). |
| `category` | String | Primary category (2 to 80 chars). |
| `date` | String | Major release/project date in `YYYY-MM` format. |
| `tier` | Integer | `1` (Flagship), `2` (Standard), or `3` (Archive/Experiment). |
| `priority` | Integer | Display priority (`0` to `100`). |
| `techStack` | String[] | 1 to 12 unique tech stack strings (1 to 50 chars each). |
| `highlights` | String[] (Optional) | 1 to 6 concise technical facts (10 to 200 chars each). |
| `media` | Object (Optional) | `thumbnail` (HTTPS URL) and/or `videoDemo` (HTTPS URL). |
| `links` | Object (Optional) | `live` (HTTPS URL) and/or `documentation` (HTTPS URL). |

> [!CAUTION]
> Do NOT include GitHub-derived fields in `PORTFOLIO.json` (`repoName`, `repositoryUrl`, `stars`, `forks`, `license`, `languages`, `createdAt`, `updatedAt`, `pushedAt`). The ingestion pipeline fetches these automatically from GitHub API.

---

## 3. Manifest Generation

Create `PORTFOLIO.json` at the root of the repository:

```json
{
  "title": "Verified Project Name",
  "summary": "Factual project summary describing architecture, problem solved, and core features.",
  "category": "Software Architecture",
  "date": "2026-07",
  "tier": 2,
  "priority": 75,
  "techStack": [
    "TypeScript",
    "Node.js",
    "Vue 3"
  ],
  "highlights": [
    "Implements event-driven message queue architecture.",
    "Achieves sub-50ms query response time."
  ]
}
```

---

## 4. Manifest Validation

Run the cross-platform Node.js validator to ensure structural correctness:

```bash
node .agents/skills/add-to-portfolio/scripts/validate-portfolio.js path/to/PORTFOLIO.json
```

Or run against the root manifest in the current directory:

```bash
node .agents/skills/add-to-portfolio/scripts/validate-portfolio.js PORTFOLIO.json
```

If validation fails, fix reported issues in `PORTFOLIO.json` until `VALID: PORTFOLIO.json` (or `VALID: -`) is reported.

---

## 5. Onboarding Verification Report

Summarize the onboarding results:
1. **Evidence Summary**: Code and configuration files used to verify `techStack`, `highlights`, and `date`.
2. **Tier & Priority Rationale**: Explanation for the assigned tier and priority rating.
3. **Optional Fields**: List of optional fields populated vs omitted.
4. **Validation Output**: Result of running `node scripts/validate-portfolio.js`.
