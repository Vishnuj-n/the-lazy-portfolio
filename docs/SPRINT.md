# Sprint Plan: Zero-Maintenance Portfolio

## Sprint Goal
Build and deploy a zero-maintenance, automated developer portfolio powered by Vite, Vue 3, Tailwind CSS, and GitHub Actions, conforming to [PLAN.md](file:///c:/Users/vishn/PROJECT/AUTO%20PORTOFLIO/docs/PLAN.md) and [DESIGN.md](file:///c:/Users/vishn/PROJECT/AUTO%20PORTOFLIO/docs/DESIGN.md).

---

## Sprint Roadmap

### Sprint 1: Environment Setup & Project Initialization (Completed)
- [x] Initialize Vite + Vue 3 project in root directory (`npx create-vite . --template vue`).
- [x] Configure Tailwind CSS with custom OKLCH color tokens, `Syne`, `Inter`, and `JetBrains Mono` font stacks.
- [x] Set up environment variable schemas (`.env.example`) for `GITHUB_PAT` and deploy hooks.

---

### Sprint 2: Automated Data Ingestion Pipeline & Metadata Stores (Completed)
- [x] Implement `scripts/fetch-projects.js` to fetch public repositories via GitHub API.
- [x] Implement parser for `PORTFOLIO.json` root files across repos with error boundary handling.
- [x] Implement asset verification script `scripts/verify-assets.js` to check external imagery and Google Drive links.
- [x] Add static metadata stores (`skills.json`, `certificates.json`).

---

### Sprint 3: Core Layout & Dynamic Components (Completed)
- [x] Build **Hero Component**: Dynamic header with status badge and career summary.
- [x] Build **Tier-1 Alternating Flex-Hero Engine**:
  - [x] Even/Odd alternating row layout.
  - [x] Fail-safe 100% width full-bleed hero banner for odd flagship counts.
- [x] Build **Tier-2 Projects Grid Component**: Compact grid with tech tag pills.
- [x] Build **Certifications Grid & Monogram Resolver**:
  - [x] Auto-fit CSS grid with odd-count full row span logic.
  - [x] Fallback pipeline: Direct URL $\rightarrow$ Simple Icons CDN $\rightarrow$ Initials SVG Monogram.

---

### Sprint 4: Card Micro-Interactions & Visual Styling (Completed)
- [x] Card Y-axis translate (`-4px`) and subtle teal border glow transitions on hover.
- [x] Thumbnail zoom (`1.03x`) on image hover containers.

---

### Sprint 5: Integration & E2E Testing Pipeline (Completed)
- [x] Implement Node native integration tests (`tests/integration/data-pipeline.test.js`) verifying combined execution of `fetch-projects.js` and `verify-assets.js`.
- [x] Configure Playwright E2E testing framework (`playwright.config.js`) linked to Vite web server.
- [x] Build Playwright E2E test suite (`tests/e2e/portfolio.spec.js`) across multi-viewport viewports (Desktop 1440px, Tablet 768px, Mobile 375px & 320px).
- [x] Update `package.json` test scripts (`test:unit`, `test:integration`, `test:e2e`, `test:all`).

---

### Sprint 6: Sticky Navigation & Accessible Shell (In Progress)
- [ ] Implement sticky top nav with glassmorphism blur (`backdrop-filter: blur(12px)`).
  - [ ] Add primary navigation landmark above hero with links to Selected Work, Projects, Credentials.
  - [ ] Offset anchor scrolling below sticky navigation with stable section IDs.
  - [ ] Opaque no-blur fallback & preserve site shell structure.
  - [ ] Full labels on tablet/desktop and 40px touch targets on mobile.
- [ ] Final visual audit across all viewports.

---

### Sprint 7: Production Build Verification & V1 Deployment Gate (V1 Launch)
- [ ] Verify local production build (`npm run build`).
- [ ] Connect Vercel deployment project & environment variables.
- [ ] Ship V1 portfolio live.

---

### Sprint 8: V1.5 Agent Ingestion Blueprint & Master Resume Sync
- [ ] **Task 8.1:** Create `master_resume.md` single-source-of-truth document.
- [ ] **Task 8.2:** Craft Master Resume Prompt template for LLMs to generate `portfolio.json` files.
- [ ] **Task 8.3:** Write step-by-step developer guide for populating project manifests via AI coding agents.

---

### Sprint 9: V2 Portfolio Agent Skill ("Add project to portfolio")
- [ ] **Task 9.1:** Build custom agent skill for `"Add this project to my portfolio"`.
- [ ] **Task 9.2:** Develop automated codebase inspector and `PORTFOLIO.json` generator script.

---

### Sprint 10: V3 Workflow Automation & AI GitHub Actions
- [ ] **Task 10.1:** Define GitHub Issue templates for project/credential intake.
- [ ] **Task 10.2:** Create issue/PR parser script to update local stores.
- [ ] **Task 10.3:** Setup `.github/workflows/portfolio-sync.yml` weekly cron sync & Vercel Deploy Hook.
- [ ] **Task 10.4:** Optional AI GitHub Action pipeline for automated issue processing and pull requests.
