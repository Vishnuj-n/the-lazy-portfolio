<script setup>
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

const projects = Array.isArray(projectsData) ? projectsData : [];
const certifications = Array.isArray(certificationsData) ? certificationsData : [];
const experience = Array.isArray(experienceData) ? experienceData : [];
const tierOneProjects = projects.filter((project) => Number(project.tier) === 1);
const tierTwoProjects = projects.filter((project) => Number(project.tier) === 2);
</script>

<template>
  <SiteNav
    :has-selected-work="tierOneProjects.length > 0"
    :has-projects="tierTwoProjects.length > 0"
    :has-credentials="certifications.length > 0"
  />
  <HeroSection />

  <main id="main-content" class="portfolio-main">
    <WorkExperience :experience="experience" />
    <TechStack />
    <TierOneProjects :projects="tierOneProjects" />
    <TierTwoProjects :projects="tierTwoProjects" />
    <CertificationGrid :certifications="certifications" />
    <ContactSection />
  </main>
</template>

