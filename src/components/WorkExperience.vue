<script setup>
defineProps({
  experience: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <section id="experience" class="portfolio-section">
    <header class="section-heading">
      <p class="section-heading__index">01 / Experience & Leadership</p>
      <h2>Work Experience & Leadership</h2>
      <p>Engineering roles, industry internship, and technical leadership.</p>
    </header>

    <div class="experience-list">
      <article
        v-for="(item, index) in experience"
        :key="index"
        class="experience-card"
      >
        <div class="experience-card__header">
          <div>
            <h3>{{ item.role }}</h3>
            <p class="experience-card__company">{{ item.company || item.organization }}</p>
          </div>
          <span class="experience-card__period">{{ item.period }}</span>
        </div>
        <ul class="experience-card__highlights">
          <li v-for="(highlight, hIndex) in item.highlights" :key="hIndex">
            {{ highlight }}
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<style scoped>
.experience-list {
  display: grid;
  gap: 1rem;
}

.experience-card {
  padding: clamp(1.35rem, 4vw, 1.75rem);
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  box-shadow: inset 0 1px 0 oklch(1 0 0 / 0.05);
  transition: background-color 220ms var(--ease-out), transform 220ms var(--ease-out);
}

.experience-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.experience-card h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.experience-card__company {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.experience-card__period {
  font-family: var(--font-mono);
  color: var(--text-muted);
  font-size: 0.72rem;
  white-space: nowrap;
}

.experience-card__highlights {
  margin: 0;
  padding-left: 1.2rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.65;
}

.experience-card__highlights li + li {
  margin-top: 0.35rem;
}

@media (hover: hover) and (pointer: fine) {
  .experience-card:hover {
    background: var(--bg-surface-hover);
    transform: translateY(-2px);
  }
}

@media (max-width: 640px) {
  .experience-card__header {
    flex-direction: column;
    gap: 0.35rem;
  }
}
</style>
