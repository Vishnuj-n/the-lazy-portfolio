# AGENTS.md — Zero-Maintenance Portfolio Agent Guidelines

## Overview
This repository hosts the **Zero-Maintenance Portfolio** system for Vishnu J Narayanan. The portfolio automatically ingests public GitHub repositories, parses `PORTFOLIO.json` specifications, verifies remote media assets, and builds a dark editorial web UI with Vue 3, Vite, and Tailwind CSS.

---

## Workspace Structure
- `docs/` — Core architecture, design, requirements, and sprint documentation.
- `scripts/` — Automated ingestion pipeline (`fetch-projects.js`, `verify-assets.js`).
- `src/` — Vue 3 components, OKLCH design system, layouts, and static views.
- `PORTFOLIO.json` — Standard repository manifest schema for all child projects.

---

## Agent Instructions & Rules

### 1. Planning & Architecture
- Before making structural changes, consult `docs/PLAN.md`, `docs/DESIGN.md`, and `docs/REQUIREMENTS.md`.
- Always follow Planning Mode guidelines (`implementation_plan.md` & `walkthrough.md`) for non-trivial modifications.

### 2. Styling & Design Tokens
- Preserve OKLCH color tokens (`--bg-base`, `--bg-surface`, `--accent-teal`, `--text-primary`, etc.) in `src/style.css`.
- Maintain font family bindings: `Syne` (Headlines), `Inter` (Body), `JetBrains Mono` (Code/Badges).

### 3. Safety & Security
- Never commit secrets or actual GitHub tokens. Use environment variables defined in `.env.example`.
- Ensure `.gitignore` properly excludes `.env`, `node_modules/`, `.agents/`, `dist/`, and local scratch files.
