<script setup>
const shortYear = String(new Date().getFullYear()).slice(-2);

const links = [
  { index: '01', label: 'Work', href: '#selected-work' },
  { index: '02', label: 'Projects', href: '#projects' },
  { index: '03', label: 'Credentials', href: '#credentials' },
];
</script>

<template>
  <nav class="site-nav" aria-label="Primary navigation">
    <a class="site-nav__brand" href="#top" aria-label="Back to top">VJN / {{ shortYear }}</a>

    <p class="status-pill site-nav__status">
      <span class="status-pill__dot" aria-hidden="true"></span>
      Building local-first systems
    </p>

    <div class="site-nav__links">
      <a
        v-for="link in links"
        :key="link.href"
        :href="link.href"
        :aria-label="`Go to ${link.label}`"
      >
        <span class="site-nav__index" aria-hidden="true">{{ link.index }}</span>
        <span class="site-nav__label">{{ link.label }}</span>
      </a>
    </div>
  </nav>
</template>
