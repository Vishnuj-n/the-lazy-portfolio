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
  const words = (project.summary || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value.length === 7 ? `${value}-01T00:00:00Z` : value);
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
}
</script>

<template>
  <section v-if="projects.length" id="projects" class="portfolio-section tier-two" aria-labelledby="tier-two-title">
    <header class="section-heading section-heading--compact">
      <p class="section-heading__index">02 / Projects</p>
      <h2 id="tier-two-title">More working software</h2>
      <p>Smaller systems, experiments, and tools built to answer a specific need.</p>
    </header>

    <div class="project-list">
      <article
        v-for="(project, index) in projects"
        :key="project.repoName || project.title"
        class="project-card"
        data-testid="project-card"
      >
        <div class="project-card__kicker"><span>{{ String(index + 1).padStart(2, '0') }}</span><span>{{ project.category || 'Project' }}</span></div>
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
