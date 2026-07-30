<script setup>
import HeroSection from './components/HeroSection.vue';
import SiteNav from './components/SiteNav.vue';
import TierOneProjects from './components/TierOneProjects.vue';
import TierTwoProjects from './components/TierTwoProjects.vue';
import CertificationGrid from './components/CertificationGrid.vue';
import projectsData from './data/projects.json';
import certificationsData from './data/certifications.json';

const projects = Array.isArray(projectsData) ? projectsData : [];
const certifications = Array.isArray(certificationsData) ? certificationsData : [];
const tierOneProjects = projects.filter((project) => Number(project.tier) === 1);
const tierTwoProjects = projects.filter((project) => Number(project.tier) === 2);
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <div id="top" class="site-shell">
    <SiteNav />
    <HeroSection />

    <main id="main-content" class="portfolio-main">
      <TierOneProjects :projects="tierOneProjects" />
      <TierTwoProjects :projects="tierTwoProjects" />
      <CertificationGrid :certifications="certifications" />
    </main>

    <footer class="site-footer">
      <p>Vishnu J Narayanan</p>
      <p>Backend systems / local-first software / practical AI</p>
    </footer>
  </div>
</template>
