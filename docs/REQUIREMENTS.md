# Requirements Specification: Zero-Maintenance Portfolio

## Overview
This document outlines the functional, non-functional, and technical requirements for the zero-maintenance portfolio system. The architecture relies on an authenticated data pipeline using a GitHub Personal Access Token (PAT), automated triggers, pre-build asset verification, and an editorial layout engine.

---

## 1. Authentication & Security Requirements

### 1.1 Personal Access Token (PAT) Management
- **Token Type:** GitHub Personal Access Token (Classic).
- **Permissions:** Read-only access to public repositories (`public_repo` scope).
- **Environment Storage:** Saved securely as `GITHUB_PAT` in Vercel environment variables.
- **Rate Limit Mitigation:** Authenticated requests raise the GitHub API rate limit threshold from 60 requests/hour (unauthenticated) to 5,000 requests/hour, eliminating rate-limiting build failures across multi-repository scans.

### 1.2 Deployment Security
- **Deploy Hook Endpoint:** Secure Vercel Deploy Hook URL generated for the `main` branch.
- **Secrets Management:** Deploy Hook URL stored exclusively in GitHub Repository Secrets (`VERCEL_DEPLOY_HOOK_URL`).

---

## 2. Automated Sync Engine Requirements

### 2.1 Trigger System
- **Automated Schedule:** Cron schedule executing every Sunday at midnight (`0 0 * * 0`).
- **Manual Execution:** `workflow_dispatch` trigger enabled for immediate manual builds via GitHub UI or CLI.
- **Runner Environment:** Execution on `ubuntu-latest` inside standard GitHub Actions workflow.

---

## 3. Data Pipeline Requirements

### 3.1 Repository Scanning & Metadata Fetching
- **Target User:** `vishnuj-n`
- **Scanning Scope:** Fetch all public repositories up to maximum pagination bounds.
- **Specification Discovery:** Inspect the root directory of each public repository for a `PORTFOLIO.json` file.
- **Filter Rule:** Exclude any repository missing a valid `PORTFOLIO.json` file from rendering on the live site.
- **Sorting Rule:** Order valid projects descending by priority score (`priority` property).

### 3.2 Asset Validation Pipeline
- **Pre-Build Verification:** Run script (`scripts/verify-assets.js`) prior to static page compilation.
- **Link Auditing:** Validate custom logo URLs and Google Drive media links to ensure HTTP accessibility before production deployment.

---

## 4. UI & Layout Engine Requirements

### 4.1 Design Philosophy
- **Style:** Minimalist, editorial-grade UI.
- **Border Rules:** Avoid traditional 1px component borders; rely on white space, typography, and background contrast.

### 4.2 Dynamic Flex-Hero Engine (Tier 1 Flagship Projects)
- **Alternating Layout:**
  - **Even Index:** Media Left $\rightarrow$ Text Right
  - **Odd Index:** Text Left $\rightarrow$ Media Right
- **Grid Balance Guard:** If total count of Tier 1 projects is odd, render the final item across 100% width as a standalone Hero Banner.

### 4.3 Certifications Grid Engine
- **Grid Layout:** Auto-fit CSS grid layout.
- **Full-Width Stretch:** If total certificate count is odd, stretch the last card across the full bottom row.
- **Logo Resolution Fallback Pipeline:**
  1. Custom URL (explicitly defined in configuration).
  2. CDN Resolution (fetch from Simple Icons based on issuer name, e.g., `https://cdn.simpleicons.org/amazonaws/FF9900`).
  3. Stylized Monogram Avatar (fallback if CDN fetch fails).

---

## 5. Specification Standard (`PORTFOLIO.json`)

Repositories opting into portfolio display must place a `PORTFOLIO.json` file at root with the following structure:

| Field | Type | Description |
|---|---|---|
| `tier` | Number | Priority tier classification (e.g., `1` for flagship). |
| `priority` | Number | Integer score used for descending layout ordering. |
| `title` | String | Project display title. |
| `category` | String | Domain classification string. |
| `date` | String | ISO year-month string (`YYYY-MM`). |
| `techStack` | Array | Technologies and frameworks used. |
| `summary` | String | Concise technical summary of the system. |
| `media.thumbnail` | String | Public URL for project thumbnail. |
| `media.videoDemo` | String | Direct media URL for video preview. |
