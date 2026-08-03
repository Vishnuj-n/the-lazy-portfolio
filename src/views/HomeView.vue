<script setup>
import { ref, computed } from 'vue';
import HeroSection from '../components/HeroSection.vue';
import SiteNav from '../components/SiteNav.vue';
import TechStack from '../components/TechStack.vue';
import TierOneProjects from '../components/TierOneProjects.vue';
import TierTwoProjects from '../components/TierTwoProjects.vue';
import CertificationGrid from '../components/CertificationGrid.vue';
import WorkExperience from '../components/WorkExperience.vue';
import EducationSection from '../components/EducationSection.vue';
import ContactSection from '../components/ContactSection.vue';
import projectsData from '../data/projects.json';
import certificationsData from '../data/certifications.json';
import experienceData from '../data/experience.json';
import educationData from '../data/education.json';

const isDev = import.meta.env.DEV || new URLSearchParams(window.location.search).has('mock');
const showMocks = ref(false);
const showPanel = ref(false);

const dummyCertsCount = ref(1);
const dummyProjectsCount = ref(1);
const dummyStackCount = ref(1);

const projects = computed(() => {
  return Array.isArray(projectsData) ? [...projectsData] : [];
});

const certifications = computed(() => {
  const base = Array.isArray(certificationsData) ? [...certificationsData] : [];
  if (!showMocks.value) return base;
  const placeholders = Array.from({ length: dummyCertsCount.value }, (_, i) => ({
    id: `placeholder-cert-${i}`,
    isPlaceholder: true,
  }));
  return [...base, ...placeholders];
});

const extraStack = computed(() => {
  if (!showMocks.value) return [];
  return Array.from({ length: dummyStackCount.value }, (_, i) => ({
    id: `placeholder-stack-${i}`,
    isPlaceholder: true,
  }));
});

const experience = Array.isArray(experienceData) ? experienceData : [];
const education = Array.isArray(educationData) ? educationData : [];
const tierOneProjects = computed(() => projects.value.filter((project) => Number(project.tier) === 1));

const tierTwoProjects = computed(() => {
  const base = projects.value.filter((project) => Number(project.tier) === 2);
  if (!showMocks.value) return base;
  const placeholders = Array.from({ length: dummyProjectsCount.value }, (_, i) => ({
    id: `placeholder-project-${i}`,
    tier: 2,
    isPlaceholder: true,
  }));
  return [...base, ...placeholders];
});
</script>

<template>
  <SiteNav
    :has-selected-work="tierOneProjects.length > 0"
    :has-projects="tierTwoProjects.length > 0"
    :has-credentials="certifications.length > 0"
  />

  <div>
    <!-- Floating Dev Controls & Toggle (Only visible in Dev Mode or with ?mock=true) -->
    <div
      v-if="isDev"
      style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; align-items: flex-end; gap: 8px;"
    >
      <!-- Expanded Controls Panel -->
      <div
        v-if="showMocks && showPanel"
        style="background: #121212; border: 1px solid var(--primary); border-radius: 12px; padding: 14px 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.8); width: 280px; font-family: var(--font-mono);"
      >
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px;">
          <span style="font-size: 11px; font-weight: 600; color: var(--primary);">🛠️ DUMMY BLOCK CONTROLS</span>
          <button style="background: none; border: none; color: var(--muted-foreground); cursor: pointer; font-size: 12px;" @click="showPanel = false">✕</button>
        </div>

        <!-- Tech Stack Counter -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-size: 11px; color: var(--foreground);">Stack Blocks:</span>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button style="background: #222; border: 1px solid #444; color: #fff; width: 22px; height: 22px; border-radius: 4px; cursor: pointer;" @click="dummyStackCount = Math.max(0, dummyStackCount - 1)">-</button>
            <span style="font-size: 11px; color: var(--primary); min-width: 16px; text-align: center;">{{ dummyStackCount }}</span>
            <button style="background: #222; border: 1px solid #444; color: #fff; width: 22px; height: 22px; border-radius: 4px; cursor: pointer;" @click="dummyStackCount++">+</button>
          </div>
        </div>

        <!-- More Projects Counter -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-size: 11px; color: var(--foreground);">Projects (Tier 2):</span>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button style="background: #222; border: 1px solid #444; color: #fff; width: 22px; height: 22px; border-radius: 4px; cursor: pointer;" @click="dummyProjectsCount = Math.max(0, dummyProjectsCount - 1)">-</button>
            <span style="font-size: 11px; color: var(--primary); min-width: 16px; text-align: center;">{{ dummyProjectsCount }}</span>
            <button style="background: #222; border: 1px solid #444; color: #fff; width: 22px; height: 22px; border-radius: 4px; cursor: pointer;" @click="dummyProjectsCount++">+</button>
          </div>
        </div>

        <!-- Certifications Counter -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 11px; color: var(--foreground);">Certs Blocks:</span>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button style="background: #222; border: 1px solid #444; color: #fff; width: 22px; height: 22px; border-radius: 4px; cursor: pointer;" @click="dummyCertsCount = Math.max(0, dummyCertsCount - 1)">-</button>
            <span style="font-size: 11px; color: var(--primary); min-width: 16px; text-align: center;">{{ dummyCertsCount }}</span>
            <button style="background: #222; border: 1px solid #444; color: #fff; width: 22px; height: 22px; border-radius: 4px; cursor: pointer;" @click="dummyCertsCount++">+</button>
          </div>
        </div>
      </div>

      <!-- Dev Mode Button -->
      <div style="display: flex; gap: 6px;">
        <button
          v-if="showMocks"
          type="button"
          style="font-family: var(--font-mono); font-size: 11px; padding: 8px 12px; background: #161616; color: var(--foreground); border: 1px solid var(--border); border-radius: 999px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.5);"
          @click="showPanel = !showPanel"
        >
          ⚙️ Controls
        </button>
        <button
          type="button"
          style="font-family: var(--font-mono); font-size: 11px; padding: 8px 14px; background: #161616; color: var(--primary); border: 1px solid var(--primary); border-radius: 999px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.5);"
          @click="showMocks = !showMocks; if(showMocks) showPanel = true"
        >
          🛠️ Dev Mocks: {{ showMocks ? 'ON' : 'OFF' }}
        </button>
      </div>
    </div>

    <HeroSection />

    <main id="main-content">
      <WorkExperience :experience="experience" />
      <EducationSection :education="education" />
      <TechStack :extra-categories="extraStack" />
      <TierOneProjects :projects="tierOneProjects" />
      <TierTwoProjects :projects="tierTwoProjects" />
      <CertificationGrid :certifications="certifications" />
      <ContactSection />
    </main>
  </div>
</template>
