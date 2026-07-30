<script setup>
import ProjectMedia from './ProjectMedia.vue';

defineProps({
  projects: {
    type: Array,
    default: () => [],
  },
});

function projectUrl(project) {
  return project.repositoryUrl || '';
}
</script>

<template>
  <section v-if="projects.length" id="selected-work" class="portfolio-section tier-one" aria-labelledby="tier-one-title">
    <header class="section-heading">
      <p class="section-heading__index">01 / Flagship</p>
      <h2 id="tier-one-title">Systems built around the workflow</h2>
      <p>Selected projects where architecture, constraints, and product behavior carry equal weight.</p>
    </header>

    <div class="tier-one__list">
      <article
        v-for="(project, index) in projects"
        :key="project.repoName || project.title"
        class="flagship-project"
        :class="{
          'flagship-project--reverse': index % 2 === 1,
          'flagship-project--hero': projects.length % 2 === 1 && index === projects.length - 1,
        }"
      >
        <ProjectMedia :project="project" />

        <div class="flagship-project__content">
          <div class="project-meta">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <span>{{ project.category || 'Software system' }}</span>
            <time v-if="project.date" :datetime="project.date">{{ project.date }}</time>
          </div>
          <h3>{{ project.title }}</h3>
          <p class="flagship-project__summary">{{ project.summary }}</p>
          <ul v-if="project.techStack?.length" class="tech-list" aria-label="Technologies used">
            <li v-for="tech in project.techStack" :key="tech">{{ tech }}</li>
          </ul>
          <a v-if="projectUrl(project)" class="project-link" :href="projectUrl(project)" target="_blank" rel="noreferrer">
            View repository <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
    </div>
  </section>
</template>
