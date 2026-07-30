# Sprint Plan: Zero-Maintenance Portfolio

## Sprint Goal
Build and deploy a zero-maintenance, automated developer portfolio powered by Vite, Vue 3, Tailwind CSS, and GitHub Actions, conforming to [PLAN.md](file:///c:/Users/vishn/PROJECT/AUTO%20PORTOFLIO/docs/PLAN.md) and [DESIGN.md](file:///c:/Users/vishn/PROJECT/AUTO%20PORTOFLIO/docs/DESIGN.md).

---

## Task Breakdown & Roadmap

### Task 1: Environment Setup & Project Initialization
- [x] Initialize Vite + Vue 3 project in root directory (`npx create-vite . --template vue`).
- [x] Configure Tailwind CSS with custom OKLCH color tokens, `Syne`, `Inter`, and `JetBrains Mono` font stacks.
- [x] Set up environment variable schemas (`.env.example`) for `GITHUB_PAT` and deploy hooks.

### Task 2: Automated Data Ingestion Pipeline
- [x] Implement `scripts/fetch-projects.js` to fetch public repositories via GitHub API.
- [x] Implement parser for `PORTFOLIO.json` root files across repos with error boundary handling.
- [x] Implement asset verification script `scripts/verify-assets.js` to check external imagery and Google Drive links.

### Task 3: Portfolio Layout & Core Components
- [x] Build **Hero Component**: Dynamic header with status badge and career summary.
- [x] Build **Tier-1 Alternating Flex-Hero Engine**:
  - [x] Even/Odd alternating row layout.
  - [x] Fail-safe 100% width full-bleed hero banner for odd flagship counts.
- [x] Build **Tier-2 Projects Grid Component**: Compact grid with tech tag pills.
- [x] Build **Certifications Grid & Monogram Resolver**:
  - [x] Auto-fit CSS grid with odd-count full row span logic.
  - [x] Fallback pipeline: Direct URL $\rightarrow$ Simple Icons CDN $\rightarrow$ Initials SVG Monogram.

### Task 4: Glassmorphism Theme & Micro-Interactions
- [ ] Implement sticky top nav with glassmorphism blur (`backdrop-filter: blur(12px)`).
  - [ ] Add a primary navigation landmark above the hero with links to Selected Work, Projects, and Credentials.
  - [ ] Give every destination a stable section ID and offset anchor scrolling below the sticky navigation.
  - [ ] Preserve the status badge, provide an opaque no-blur fallback, and prevent the site shell from breaking sticky positioning.
  - [ ] Use full labels on tablet/desktop and numbered 40px minimum touch targets on mobile.
  - [ ] Verify keyboard focus, reduced-motion behavior, 320px layout, and no horizontal overflow.
- [x] Add card Y-axis translate (`-4px`) and subtle teal border glow transitions on hover.
- [x] Apply thumbnail zoom (`1.03x`) on image hover containers.

### Task 5: CI/CD Automation & Deployment
- [ ] Create GitHub Action `.github/workflows/portfolio-sync.yml` for weekly cron deployment trigger.
  - [ ] Run every Sunday at `00:00 UTC` and support manual `workflow_dispatch` execution.
  - [ ] Use minimal permissions, concurrency cancellation, a five-minute job timeout, and a fail-fast hook request.
  - [ ] Fail with a clear message when `VERCEL_DEPLOY_HOOK_URL` is missing or rejected.
- [ ] Connect Vercel Deploy Hook and verify production build pipeline.
  - [ ] Configure Vercel for Node.js 20+, `npm run build`, and the `dist` output directory.
  - [ ] Store `GITHUB_PAT` and `GITHUB_USERNAME` in Vercel and `VERCEL_DEPLOY_HOOK_URL` in GitHub Actions secrets.
  - [ ] Manually dispatch the workflow and confirm data ingestion, asset verification, Vite compilation, and production promotion.
  - [ ] Confirm a failed build leaves the previous successful Vercel deployment active.
### Task 6: Integration & Playwright End-to-End Testing
- [x] Implement Node native integration tests (`tests/integration/data-pipeline.test.js`) verifying combined execution of `fetch-projects.js` and `verify-assets.js`.
- [x] Configure Playwright E2E testing framework (`playwright.config.js`) linked to Vite web server.
- [x] Build Playwright E2E test suite (`tests/e2e/portfolio.spec.js`):
  - [x] Verify Hero component header, status badge, and career text rendering.
  - [x] Verify Tier-1 alternating Flex-Hero cards and Tier-2 compact grid structures.
  - [x] Verify Certifications grid and SVG monogram fallback resolver.
  - [x] Verify multi-viewport responsiveness (Desktop 1440px, Tablet 768px, Mobile 375px & 320px).
  - [x] Verify keyboard navigation, accessibility landmarks, and focus management.
- [x] Update `package.json` test scripts (`test:unit`, `test:integration`, `test:e2e`, `test:all`).

---

## Verification Plan
- **Build Verification:** Run `npm run build` locally to ensure zero build errors or missing module resolutions.
- **Offline Build Verification:** Run `npm run build:offline` to verify compilation independently of GitHub and remote media availability.
- **Unit Tests:** Run `npm run test:unit` before build triggers.
- **Integration Tests:** Run `npm run test:integration` to validate fetch and asset verification pipeline integration.
- **Playwright E2E Tests:** Run `npm run test:e2e` to validate full browser rendering, navigation, and viewports.
- **Lighthouse/Accessibility Gate:** Ensure minimum text contrast ratio of 4.5:1 and fast page loading performance.
- **Deployment Gate:** A manual `Weekly Portfolio Sync` run must return a successful hook response and produce a successful Vercel production deployment.

