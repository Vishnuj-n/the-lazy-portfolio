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
  <section v-if="projects.length" id="projects" class="portfolio-section tier-two" aria-labelledby="tier-two-title">
    <header class="section-heading section-heading--compact">
      <p class="section-heading__index">02 / Field notes</p>
      <h2 id="tier-two-title">More working software</h2>
    </header>

    <div class="tier-two__grid">
      <article
        v-for="(project, index) in projects"
        :key="project.repoName || project.title"
        class="standard-project"
        :style="{ '--card-index': index }"
      >
        <ProjectMedia :project="project" compact />
        <div class="standard-project__content">
          <div class="project-meta">
            <span>{{ project.category || 'Project' }}</span>
            <time v-if="project.date" :datetime="project.date">{{ project.date }}</time>
          </div>
          <h3>{{ project.title }}</h3>
          <p>{{ project.summary }}</p>
          <ul v-if="project.techStack?.length" class="tech-list tech-list--compact" aria-label="Technologies used">
            <li v-for="tech in project.techStack" :key="tech">{{ tech }}</li>
          </ul>
          <a v-if="projectUrl(project)" class="project-link" :href="projectUrl(project)" target="_blank" rel="noreferrer">
            Repository <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
    </div>
  </section>
</template>
