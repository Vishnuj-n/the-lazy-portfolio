# `PORTFOLIO.json` Manifest

## Purpose

Any public repository that should appear in the portfolio must contain a
`PORTFOLIO.json` file at its root. The ingestion pipeline reads this file,
validates the required fields, and adds GitHub repository metadata before
writing `src/data/projects.json`.

Keep the manifest small. Include curated project information only. The pipeline
derives the repository name, repository URL, stars, forks, license, languages,
and GitHub timestamps from the GitHub API.

## Required Fields

| Field | Type | Rules |
|---|---|---|
| `title` | String | Project display name, 2 to 80 characters. |
| `summary` | String | Factual project description, 40 to 500 characters. |
| `category` | String | Primary project category, 2 to 80 characters. |
| `date` | String | Major release or project date in `YYYY-MM` format. |
| `tier` | Integer | `1` for flagship, `2` for standard, or `3` for archive and experiments. |
| `priority` | Integer | Display order from `0` to `100`, sorted from highest to lowest. |
| `techStack` | String array | Between 1 and 12 unique, verified technologies. |

A manifest missing any required field is excluded from the generated project
dataset. The ingestion pipeline reports the validation error and continues
scanning other repositories.

## Optional Fields

| Field | Type | Behavior when omitted |
|---|---|---|
| `highlights` | String array | The UI hides the highlights section. |
| `media.thumbnail` | HTTPS URL | The UI displays a project monogram or neutral placeholder. |
| `media.videoDemo` | HTTPS URL | The UI hides the video action. |
| `links.live` | HTTPS URL | The UI hides the live-project action. |
| `links.documentation` | HTTPS URL | The UI hides the documentation action. |

Optional fields should be omitted when no verified value is available. Do not
use empty strings, `null`, or placeholder URLs. If `media` or `links` is present,
it may contain only the documented fields.

## Minimal Valid Manifest

```json
{
  "title": "StudyLoop",
  "summary": "A local-first desktop AI tutoring application combining spaced-repetition scheduling with semantic content retrieval.",
    "category": "Educational Technology",
    "date": "2026-07",
  "tier": 1,
  "priority": 100,
  "techStack": [
    "Go",
    "Wails",
    "Vue 3",
    "SQLite",
    "FSRS"
  ]
}
```

The values above reflect the current public StudyLoop manifest. Re-verify project
claims before copying them into another repository.

## Complete Manifest

```json
{
  "title": "StudyLoop",
  "summary": "A local-first desktop AI tutoring application combining spaced-repetition scheduling with semantic content retrieval.",
  "category": "Educational Technology",
  "date": "2026-07",
  "tier": 1,
  "priority": 100,
  "techStack": [
    "Go",
    "Wails",
    "Vue 3",
    "SQLite",
    "FSRS"
  ],
  "highlights": [
    "Uses FSRS-based scheduling to model review timing and retention.",
    "Stores application and study data locally with SQLite."
  ],
  "media": {
    "thumbnail": "https://example.com/studyloop-thumbnail.webp",
    "videoDemo": "https://example.com/studyloop-demo.mp4"
  },
  "links": {
    "live": "https://studyloop.example.com",
    "documentation": "https://docs.studyloop.example.com"
  }
}
```

The URLs above illustrate the structure only. Never put these placeholder URLs
in a real manifest.

## Authoring Rules

- Store the file as `PORTFOLIO.json` at the repository root.
- Use valid JSON with double quotes, no comments, and no trailing commas.
- Include every required field.
- Omit unavailable optional fields instead of adding empty or placeholder values.
- Use only absolute HTTPS URLs that are publicly accessible without authentication.
- Include only claims and technologies that can be verified from repository files.
- Keep technology names consistently capitalized, such as `Vue 3`, `SQLite`, and `Wails`.
- Keep highlights concise, factual, and technically specific.
- Do not include fields that the ingestion pipeline derives from GitHub.

## Agent Prompt

Use the following prompt inside a project repository:

```text
Inspect this repository and create PORTFOLIO.json at its root for use by an
automated developer portfolio.

Before writing the file, inspect the README, package manifests, source tree,
documentation, release metadata, and git history when available. Use only facts
that can be verified from the repository. Do not invent features, technologies,
metrics, dates, outcomes, or URLs.

PORTFOLIO.json has these required fields:

- title: project display name, string, 2 to 80 characters
- summary: factual description of the problem, architecture, and practical
  outcome, string, 40 to 500 characters
- category: primary project category, string, 2 to 80 characters
- date: the most defensible major release or project date in YYYY-MM format
- tier: integer 1, 2, or 3; use 1 for flagship, 2 for standard, and 3 for archive
  or experimental work
- priority: integer from 0 to 100; use 100 only for a primary flagship project
- techStack: array containing 1 to 12 unique technologies verified in the repo

These fields are optional:

- highlights: array containing 1 to 6 concise, technically specific facts
- media.thumbnail: publicly accessible absolute HTTPS image URL
- media.videoDemo: publicly accessible absolute HTTPS video or demo URL
- links.live: publicly accessible absolute HTTPS deployed-project URL
- links.documentation: publicly accessible absolute HTTPS documentation URL

Omit an optional field when no verified value exists. Do not use null, empty
strings, example domains, guessed links, local file paths, or placeholder URLs.
If media has no verified child fields, omit media. If links has no verified child
fields, omit links.

Use this structure, removing optional sections that cannot be verified:

{
  "title": "Project name",
  "summary": "Verified project description.",
  "category": "Project category",
  "date": "YYYY-MM",
  "tier": 2,
  "priority": 50,
  "techStack": ["Verified technology"],
  "highlights": ["Verified technical fact."],
  "media": {
    "thumbnail": "https://verified-public-url",
    "videoDemo": "https://verified-public-url"
  },
  "links": {
    "live": "https://verified-public-url",
    "documentation": "https://verified-public-url"
  }
}

Do not include repoName, repositoryUrl, stars, forks, license, languages, GitHub
timestamps, schemaVersion, or any field not listed above. The portfolio ingestion
pipeline derives repository metadata from GitHub.

Write the completed manifest directly to PORTFOLIO.json. Parse the finished file
as JSON to verify that it has double-quoted keys and strings, no comments, and no
trailing commas. Confirm that all required fields are present and that date,
tier, priority, and techStack satisfy their constraints.

After writing and validating the file, report:

1. The repository evidence used for each technology and highlight.
2. The reason for the selected tier and priority.
3. Which optional fields were omitted because no verified value was found.
```

## Validation Approach

No separate JSON Schema is required. `scripts/fetch-projects.js` validates the
parsed object directly with JavaScript. It checks required fields, types, limits,
date format, allowed numeric ranges, arrays, and optional HTTPS URLs.

Invalid manifests do not stop the complete scan. The pipeline reports the
repository name and errors, skips that project, and continues processing the
remaining repositories.

## Generated Metadata

Validated manifests are augmented in `src/data/projects.json` with these fields:

| Field | Type | Source |
|---|---|---|
| `repoName` | String | GitHub repository name. |
| `repositoryUrl` | HTTPS URL | GitHub repository page. |
| `stars` | Integer | Current stargazer count. |
| `forks` | Integer | Current fork count. |
| `license` | String or `null` | GitHub SPDX identifier when available. |
| `languages` | Object | Language names mapped to byte counts. |
| `createdAt` | ISO timestamp | GitHub repository creation time. |
| `updatedAt` | ISO timestamp | GitHub repository update time. |
| `pushedAt` | ISO timestamp | Most recent GitHub push time. |

Do not author these fields in `PORTFOLIO.json`.
