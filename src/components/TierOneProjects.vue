<script setup>
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
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value.length === 7 ? `${value}-01T00:00:00Z` : value);
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
}
</script>

<template>
  <section v-if="projects.length" id="selected-work" class="portfolio-section tier-one" aria-labelledby="tier-one-title">
    <header class="section-heading">
      <p class="section-heading__index">01 / Selected work</p>
      <h2 id="tier-one-title">Built around the workflow</h2>
      <p>Selected systems where architecture, constraints, and product behavior carry equal weight.</p>
    </header>

    <div class="tier-one__list">
      <article
        v-for="(project, index) in projects"
        :key="project.repoName || project.title"
        class="project-card project-card--flagship"
        data-testid="project-card"
      >
        <div class="project-card__kicker">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <span>{{ project.category || 'Software system' }}</span>
        </div>
        <h3><a v-if="projectUrl(project)" :href="projectUrl(project)" target="_blank" rel="noreferrer">{{ project.title }}</a><template v-else>{{ project.title }}</template></h3>
        <p class="project-card__summary">{{ project.summary }}</p>
        <ul v-if="project.techStack?.length" class="tech-list" aria-label="Technologies used">
          <li v-for="tech in project.techStack" :key="tech">{{ tech }}</li>
        </ul>
        <footer class="project-card__footer">
          <time v-if="project.updatedAt || project.date" :datetime="project.updatedAt || project.date">Updated {{ formatDate(project.updatedAt || project.date) }}</time>
          <span v-if="project.stars !== undefined">★ {{ project.stars }}</span>
          <span v-if="project.forks">⑂ {{ project.forks }}</span>
          <span>{{ readTime(project) }} min read</span>
          <a v-if="projectUrl(project)" class="project-link" :href="projectUrl(project)" target="_blank" rel="noreferrer">Source <span aria-hidden="true">↗</span></a>
        </footer>
      </article>
    </div>
  </section>
</template>
