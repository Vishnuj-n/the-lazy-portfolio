<script setup>
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import projectsData from '../data/projects.json';

const route = useRoute();
const projectId = route.params.id;

const project = computed(() => {
  return (projectsData || []).find(
    (p) => (p.repoName || '').toLowerCase() === (projectId || '').toLowerCase()
  ) || projectsData[0];
});
</script>

<template>
  <div v-if="project" class="project-detail">
    <RouterLink to="/" class="back-link">&larr; Back to Portfolio</RouterLink>

    <header class="project-detail__header">
      <p class="eyebrow">{{ project.category }} · {{ project.date }}</p>
      <h1>{{ project.title }}</h1>
      <p class="project-detail__summary">{{ project.summary }}</p>

      <div class="project-detail__actions">
        <a
          v-if="project.repositoryUrl"
          :href="project.repositoryUrl"
          target="_blank"
          rel="noreferrer"
          class="btn btn--primary"
        >
          View Source Code &rarr;
        </a>
        <a
          v-if="project.links?.live"
          :href="project.links.live"
          target="_blank"
          rel="noreferrer"
          class="btn btn--secondary"
        >
          Live Demo
        </a>
      </div>
    </header>

    <!-- Media Section (Videos & Screenshots) -->
    <section class="project-detail__media" v-if="project.media">
      <h2>Media & Product Showcase</h2>
      <div v-if="project.media.videoDemo" class="video-container">
        <video controls autoplay loop muted :src="project.media.videoDemo"></video>
      </div>
      <div v-if="project.media.thumbnail" class="thumbnail-container">
        <img :src="project.media.thumbnail" :alt="project.title + ' preview'" />
      </div>
    </section>

    <!-- Technical Architecture & Key Highlights -->
    <section class="project-detail__section" v-if="project.highlights?.length">
      <h2>Architectural Highlights & Features</h2>
      <ul class="highlights-list">
        <li v-for="(highlight, i) in project.highlights" :key="i">
          {{ highlight }}
        </li>
      </ul>
    </section>

    <!-- Tech Stack Breakdown -->
    <section class="project-detail__section" v-if="project.techStack?.length">
      <h2>Technologies Used</h2>
      <ul class="tech-list">
        <li v-for="tech in project.techStack" :key="tech">{{ tech }}</li>
      </ul>
    </section>

    <footer class="project-detail__footer">
      <RouterLink to="/" class="back-link">&larr; Back to Home</RouterLink>
    </footer>
  </div>
</template>

<style scoped>
.project-detail {
  padding-block: 2.5rem 5rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 2rem;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  font-size: 0.8rem;
  transition: color 180ms ease;
}

.back-link:hover {
  color: var(--text-primary);
}

.project-detail__header h1 {
  margin: 0.5rem 0 1rem;
  font-size: clamp(2.2rem, 6vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.project-detail__summary {
  max-width: 65ch;
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 1.75rem;
}

.project-detail__actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  text-decoration: none;
  transition: opacity 180ms ease;
}

.btn--primary {
  background: var(--text-primary);
  color: var(--bg-base);
}

.btn--secondary {
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
}

.btn:hover {
  opacity: 0.88;
}

.project-detail__section,
.project-detail__media {
  margin-top: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-subtle);
}

.project-detail__section h2,
.project-detail__media h2 {
  margin-bottom: 1.25rem;
  font-size: 1.35rem;
  font-weight: 700;
}

.highlights-list {
  display: grid;
  gap: 0.85rem;
  padding-left: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

.video-container video,
.thumbnail-container img {
  width: 100%;
  max-height: 480px;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.project-detail__footer {
  margin-top: 4rem;
}
</style>
