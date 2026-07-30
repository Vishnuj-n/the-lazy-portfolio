<script setup>
import { computed } from 'vue';

const props = defineProps({
  hasSelectedWork: Boolean,
  hasProjects: Boolean,
  hasCredentials: Boolean,
});

const links = computed(() => [
  { label: 'Stack', shortLabel: 'Stack', href: '#tech-stack' },
  { label: 'Selected work', shortLabel: 'Work', href: '#selected-work' },
  { label: 'Projects', shortLabel: 'Projects', href: '#projects' },
  { label: 'Credentials', shortLabel: 'Study', href: '#credentials' },
  { label: 'Contact', shortLabel: 'Contact', href: '#contact' },
  { label: 'GitHub', shortLabel: 'GitHub', href: 'https://github.com/Vishnuj-n', external: true },
].filter((link) => {
  if (link.href === '#selected-work') return props.hasSelectedWork;
  if (link.href === '#projects') return props.hasProjects;
  if (link.href === '#credentials') return props.hasCredentials;
  return true;
}));
</script>

<template>
  <nav class="site-nav" aria-label="Primary navigation">
    <a class="site-nav__brand" href="#top" aria-label="Back to top">Vishnu JN<span aria-hidden="true">.</span></a>

    <div class="site-nav__links">
      <a
        v-for="link in links"
        :key="link.href"
        :href="link.href"
        :aria-label="`Go to ${link.label}`"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'noreferrer' : undefined"
      >
        <span class="site-nav__label site-nav__label--full">{{ link.label }}</span>
        <span class="site-nav__label site-nav__label--short">{{ link.shortLabel }}</span>
        <span v-if="link.external" class="site-nav__external" aria-hidden="true">↗</span>
      </a>
    </div>
  </nav>
</template>
