<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  projects: {
    type: Array,
    default: () => [],
  },
});

function projectUrl(project) {
  return project.repositoryUrl || '';
}

function readTime(project) {
  const content = [project.summary, ...(project.highlights || [])].filter(Boolean).join(' ');
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value.length === 7 ? `${value}-01T00:00:00Z` : value);
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
}
</script>

<template>
  <section v-if="projects.length" id="selected-work" class="px-6 md:px-8 py-16 md:py-20 max-w-5xl mx-auto" aria-labelledby="tier-one-title">
    <div class="flex items-center gap-3 mb-6">
      <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.12em;">
        03
      </span>
      <div style="width: 24px; height: 1px; background: var(--muted-foreground); opacity: 0.4;" />
      <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.12em; text-transform: uppercase;">
        Selected Work
      </span>
    </div>

    <h2
      id="tier-one-title"
      style="font-family: var(--font-display); font-size: clamp(28px, 4vw, 42px); font-weight: 600; letter-spacing: -0.025em; color: var(--foreground); margin-bottom: 8px;"
    >
      Built around the workflow
    </h2>
    <p style="font-family: var(--font-sans); font-size: 14px; color: var(--muted-foreground); margin-bottom: 32px; max-width: 520px;">
      Selected systems where architecture, constraints, and product behaviour carry equal weight.
    </p>

    <div class="flex flex-col gap-px" style="border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden;">
      <div
        v-for="(p, i) in projects"
        :key="p.repoName || p.title"
        data-testid="project-card"
        style="background: var(--card); padding: 28px; transition: background 0.15s;"
        :style="{ borderBottom: i < projects.length - 1 ? '1px solid var(--border)' : 'none' }"
        class="hover:bg-[#161616] group"
      >
        <div class="flex items-start justify-between gap-4 mb-3">
          <div>
            <span style="font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; color: var(--muted-foreground); display: block; margin-bottom: 6px; text-transform: uppercase;">
              {{ String(i + 1).padStart(2, '0') }} / {{ p.category || 'SOFTWARE SYSTEM' }}
            </span>
            <h3 style="font-family: var(--font-display); font-size: 22px; font-weight: 600; letter-spacing: -0.02em; color: var(--foreground);">
              {{ p.title }}
            </h3>
          </div>
          <a
            v-if="projectUrl(p)"
            :href="projectUrl(p)"
            target="_blank"
            rel="noreferrer"
            style="font-family: var(--font-mono); font-size: 11px; color: var(--primary); text-decoration: none; white-space: nowrap; padding: 4px 10px; border: 1px solid rgba(200,245,66,0.3); border-radius: var(--radius); flex-shrink: 0;"
          >
            Source ↗
          </a>
        </div>

        <p style="font-family: var(--font-sans); font-size: 13.5px; line-height: 1.65; color: var(--secondary-foreground); max-width: 680px; margin-bottom: 16px;">
          {{ p.summary }}
        </p>

        <div v-if="p.techStack?.length" class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="t in p.techStack"
            :key="t"
            class="inline-block px-2.5 py-0.5 text-xs rounded-sm border"
            style="font-family: var(--font-mono); background: rgba(200,245,66,0.06); border-color: rgba(200,245,66,0.18); color: #c8f542; letter-spacing: 0.02em;"
          >
            {{ t }}
          </span>
        </div>

        <div class="flex items-center gap-4 flex-wrap">
          <span v-if="p.updatedAt || p.date" style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.02em;">
            Updated {{ formatDate(p.updatedAt || p.date) }}
          </span>
          <span v-if="p.stars !== undefined" style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.02em;">
            ★ {{ p.stars }}
          </span>
          <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.02em;">
            {{ readTime(p) }} min read
          </span>
          <RouterLink
            :to="'/project/' + (p.repoName || p.title).toLowerCase()"
            style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.02em; transition: color 0.15s;"
            class="hover:text-[var(--foreground)]"
          >
            Details →
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
