<script setup>
import CertificationLogo from './CertificationLogo.vue';

defineProps({
  certifications: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <section v-if="certifications.length" id="credentials" class="portfolio-section certifications" aria-labelledby="certifications-title">
    <header class="section-heading section-heading--compact">
      <p class="section-heading__index">03 / Credentials</p>
      <h2 id="certifications-title">Verified areas of study</h2>
    </header>

    <div class="certifications__grid" :class="{ 'certifications__grid--odd': certifications.length % 2 === 1 }">
      <article v-for="(certification, index) in certifications" :key="certification.title" class="certification-card">
        <CertificationLogo :certification="certification" />
        <div>
          <p class="certification-card__issuer">{{ certification.issuer }}</p>
          <h3>{{ certification.title }}</h3>
        </div>
        <span class="certification-card__number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
      </article>
    </div>
  </section>
</template>
