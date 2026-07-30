# Sprint Plan: Zero-Maintenance Portfolio

## Sprint Goal
Build and deploy a zero-maintenance, automated developer portfolio powered by Vite, Vue 3, Tailwind CSS, and GitHub Actions, conforming to [PLAN.md](file:///c:/Users/vishn/PROJECT/AUTO%20PORTOFLIO/docs/PLAN.md) and [DESIGN.md](file:///c:/Users/vishn/PROJECT/AUTO%20PORTOFLIO/docs/DESIGN.md).

---

## Task Breakdown & Roadmap

### Task 1: Environment Setup & Project Initialization
- [ ] Initialize Vite + Vue 3 project in root directory (`npx create-vite . --template vue`).
- [ ] Configure Tailwind CSS with custom OKLCH color tokens, `Syne`, `Inter`, and `JetBrains Mono` font stacks.
- [ ] Set up environment variable schemas (`.env.example`) for `GITHUB_PAT` and deploy hooks.

### Task 2: Automated Data Ingestion Pipeline
- [ ] Implement `scripts/fetch-projects.js` to fetch public repositories via GitHub API.
- [ ] Implement parser for `PORTFOLIO.json` root files across repos with error boundary handling.
- [ ] Implement asset verification script `scripts/verify-assets.js` to check external imagery and Google Drive links.

### Task 3: Portfolio Layout & Core Components
- [ ] Build **Hero Component**: Dynamic header with status badge and career summary.
- [ ] Build **Tier-1 Alternating Flex-Hero Engine**:
  - Even/Odd alternating row layout.
  - Fail-safe 100% width full-bleed hero banner for odd flagship counts.
- [ ] Build **Tier-2 Projects Grid Component**: Compact grid with tech tag pills.
- [ ] Build **Certifications Grid & Monogram Resolver**:
  - Auto-fit CSS grid with odd-count full row span logic.
  - Fallback pipeline: Direct URL $\rightarrow$ Simple Icons CDN $\rightarrow$ Initials SVG Monogram.

### Task 4: Glassmorphism Theme & Micro-Interactions
- [ ] Implement sticky top nav with glassmorphism blur (`backdrop-filter: blur(12px)`).
- [ ] Add card Y-axis translate (`-4px`) and subtle teal border glow transitions on hover.
- [ ] Apply thumbnail zoom (`1.03x`) on image hover containers.

### Task 5: CI/CD Automation & Deployment
- [ ] Create GitHub Action `.github/workflows/portfolio-sync.yml` for weekly cron deployment trigger.
- [ ] Connect Vercel Deploy Hook and verify production build pipeline.
- [ ] Perform cross-device testing (Desktop >1024px, Tablet, Mobile <767px).

---

## Verification Plan
- **Build Verification:** Run `npm run build` locally to ensure zero build errors or missing module resolutions.
- **Data Script Test:** Run `node scripts/fetch-projects.js` to confirm JSON generation and fallback handling.
- **Lighthouse/Accessibility Gate:** Ensure minimum text contrast ratio of 4.5:1 and fast page loading performance.
