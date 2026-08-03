<script setup>
import { ref, computed } from 'vue';
import HeroSection from '../components/HeroSection.vue';
import SiteNav from '../components/SiteNav.vue';
import TechStack from '../components/TechStack.vue';
import TierOneProjects from '../components/TierOneProjects.vue';
import TierTwoProjects from '../components/TierTwoProjects.vue';
import CertificationGrid from '../components/CertificationGrid.vue';
import WorkExperience from '../components/WorkExperience.vue';
import ContactSection from '../components/ContactSection.vue';
import projectsData from '../data/projects.json';
import certificationsData from '../data/certifications.json';
import experienceData from '../data/experience.json';
import { MOCK_CERTIFICATIONS_SAMPLE, MOCK_PROJECT_MEDIA } from '../data/mockData.js';

const isDev = import.meta.env.DEV || new URLSearchParams(window.location.search).has('mock');
const showMocks = ref(false);

const projects = computed(() => {
  const list = Array.isArray(projectsData) ? projectsData : [];
  if (!showMocks.value) return list;
  return list.map((p, idx) => {
    if (idx === 0) {
      return { ...p, media: MOCK_PROJECT_MEDIA };
    }
    return p;
  });
});

const certifications = computed(() => {
  const base = Array.isArray(certificationsData) ? certificationsData : [];
  if (!showMocks.value) return base;
  return MOCK_CERTIFICATIONS_SAMPLE;
});

const experience = Array.isArray(experienceData) ? experienceData : [];
const tierOneProjects = computed(() => projects.value.filter((project) => Number(project.tier) === 1));
const tierTwoProjects = computed(() => projects.value.filter((project) => Number(project.tier) === 2));
</script>

<template>
  <SiteNav
    :has-selected-work="tierOneProjects.length > 0"
    :has-projects="tierTwoProjects.length > 0"
    :has-credentials="certifications.length > 0"
  />

  <div>
    <!-- Floating Dev Mock Toggle (Only visible in Dev Mode or with ?mock=true) -->
    <div
      v-if="isDev"
      style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;"
    >
      <button
        type="button"
        style="font-family: var(--font-mono); font-size: 11px; padding: 8px 14px; background: #161616; color: var(--primary); border: 1px solid var(--primary); border-radius: 999px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.5);"
        @click="showMocks = !showMocks"
      >
        🛠️ Dev Mocks: {{ showMocks ? 'ON (Sample Media & 4 Certs)' : 'OFF' }}
      </button>
    </div>

    <HeroSection />

    <main id="main-content">
      <WorkExperience :experience="experience" />
      <TechStack />
      <TierOneProjects :projects="tierOneProjects.value || tierOneProjects" />
      <TierTwoProjects :projects="tierTwoProjects.value || tierTwoProjects" />
      <CertificationGrid :certifications="certifications.value || certifications" />
      <ContactSection />
    </main>
  </div>
</template>
