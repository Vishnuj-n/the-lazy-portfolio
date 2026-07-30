# `PORTFOLIO.json` Schema

## Purpose

Each public repository that should appear in the portfolio must contain a
`PORTFOLIO.json` file at its repository root. The ingestion pipeline validates
this manifest before including the project in `src/data/projects.json`.

The manifest contains curated presentation data only. Repository metadata such
as the repository name, URL, stars, forks, license, languages, and GitHub
timestamps is derived from the GitHub API by the ingestion pipeline.

## Canonical Structure

```json
{
  "schemaVersion": 1,
  "title": "Project display name",
  "summary": "A concise explanation of the problem, architecture, and outcome.",
  "category": "Primary project category",
  "date": "YYYY-MM",
  "tier": 1,
  "priority": 100,
  "techStack": [
    "Technology One",
    "Technology Two"
  ],
  "highlights": [
    "Specific technical capability or measurable result",
    "Another important architectural feature"
  ],
  "media": {
    "thumbnail": null,
    "videoDemo": null
  },
  "links": {
    "live": null,
    "documentation": null
  }
}
```

## Field Definitions

| Field | Type | Required | Validation |
|---|---|---:|---|
| `schemaVersion` | Integer | Yes | Must be exactly `1`. |
| `title` | String | Yes | Between 2 and 80 characters. |
| `summary` | String | Yes | Between 40 and 500 characters. Must describe the problem, architecture, and practical outcome. |
| `category` | String | Yes | Between 2 and 80 characters. |
| `date` | String | Yes | Must use the `YYYY-MM` format and represent the most defensible major release or project date. |
| `tier` | Integer | Yes | Must be between `1` and `3`. |
| `priority` | Integer | Yes | Must be between `0` and `100`. Projects are displayed in descending priority order. |
| `techStack` | String array | Yes | Must contain 1 to 12 unique, non-empty technology names. |
| `highlights` | String array | Yes | Must contain 1 to 6 concise, factual, non-empty statements. |
| `media.thumbnail` | String or `null` | Yes | Must be an absolute HTTPS URL or `null`. |
| `media.videoDemo` | String or `null` | Yes | Must be an absolute HTTPS URL or `null`. |
| `links.live` | String or `null` | Yes | Must be an absolute HTTPS URL or `null`. |
| `links.documentation` | String or `null` | Yes | Must be an absolute HTTPS URL or `null`. |

## Tier And Priority Rules

| Tier | Meaning |
|---:|---|
| `1` | Flagship project rendered in the primary editorial layout. |
| `2` | Standard project rendered in the projects grid. |
| `3` | Archive, experiment, or supporting project. |

Use priorities from `90` to `100` only for the most important work. Priority
controls ordering, while tier controls layout treatment.

## Authoring Rules

- The filename must be exactly `PORTFOLIO.json` and must be stored at the repository root.
- The file must contain valid JSON with double quotes, no comments, and no trailing commas.
- Use `null` when an optional URL is unavailable. Do not use empty strings or placeholder URLs.
- All URLs must use HTTPS and must resolve without authentication.
- Include only claims and technologies that can be verified from the repository.
- Keep technology names consistently capitalized, such as `Vue 3`, `SQLite`, and `Wails`.
- Do not add fields outside the canonical structure for schema version 1.
- Do not include `repoName`, `repositoryUrl`, stars, forks, license, languages, or update timestamps.

## StudyLoop Example

The following manifest is a starting point based on the currently documented
StudyLoop architecture. Verify its date and every technical claim against the
StudyLoop repository before committing it.

```json
{
  "schemaVersion": 1,
  "title": "StudyLoop",
  "summary": "A local-first desktop AI tutoring application that combines spaced-repetition scheduling, semantic content retrieval, and persistent local storage for personalized study workflows.",
  "category": "Desktop App / AI Systems",
  "date": "2026-05",
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
    "Processes learning material into semantic chunks for contextual retrieval.",
    "Stores application and study data locally with SQLite.",
    "Packages the Vue interface as a native desktop application through Wails."
  ],
  "media": {
    "thumbnail": null,
    "videoDemo": null
  },
  "links": {
    "live": null,
    "documentation": null
  }
}
```

## Agent Prompt

Use the following prompt inside a project repository to generate its manifest:

```text
Create a PORTFOLIO.json file at the root of this repository.

First inspect the repository, including README files, package manifests, source
directories, documentation, release metadata, and git history when available.
Use only facts that can be verified from the repository. Do not invent features,
metrics, URLs, technologies, dates, or outcomes.

The file must follow this exact schema:

{
  "schemaVersion": 1,
  "title": "string",
  "summary": "string",
  "category": "string",
  "date": "YYYY-MM",
  "tier": 1,
  "priority": 100,
  "techStack": ["string"],
  "highlights": ["string"],
  "media": {
    "thumbnail": null,
    "videoDemo": null
  },
  "links": {
    "live": null,
    "documentation": null
  }
}

Validation requirements:

1. schemaVersion must be the integer 1.
2. title must contain 2 to 80 characters.
3. summary must contain 40 to 500 characters and explain the problem,
   architecture, and practical outcome.
4. category must contain 2 to 80 characters.
5. date must use YYYY-MM and should represent the most defensible major release
   or project date found in the repository.
6. tier must be an integer from 1 to 3. Use 1 for a flagship project, 2 for a
   standard project, or 3 for an archive or experiment.
7. priority must be an integer from 0 to 100. Use 100 only when the repository is
   a primary flagship project.
8. techStack must contain 1 to 12 unique, verified technologies.
9. highlights must contain 1 to 6 concise, technically specific, verifiable
   statements.
10. Every URL must be an absolute HTTPS URL.
11. Use null for unavailable media or links. Never use an empty string or a
    placeholder URL.
12. Do not add fields outside this schema.
13. Do not include repository name, repository URL, stars, forks, license,
    languages, or update timestamps. The portfolio ingestion pipeline derives
    those values from GitHub.
14. Produce valid JSON with double quotes, no comments, and no trailing commas.

Write the completed file directly to PORTFOLIO.json. Parse it as JSON to verify
its syntax. Then report which repository files support each selected technology
and highlight, and identify any fields set to null because no verified URL was
found.
```

## Pipeline Behavior

The ingestion pipeline must reject a manifest when:

- Required fields are absent or have the wrong type.
- A string or array violates its size limit.
- `date` is not a valid `YYYY-MM` value.
- `tier`, `priority`, or `schemaVersion` is outside its allowed range.
- A URL is neither `null` nor an absolute HTTPS URL.
- A technology or highlight is duplicated or empty.
- The JSON cannot be parsed.

A rejected manifest must not stop the complete repository scan. The pipeline
should report the repository name and validation errors, skip that project, and
continue processing the remaining repositories.
