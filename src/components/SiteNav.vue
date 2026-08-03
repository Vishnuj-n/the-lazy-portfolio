<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  hasSelectedWork: Boolean,
  hasProjects: Boolean,
  hasCredentials: Boolean,
});

const activeNav = ref('');

const links = computed(() => [
  { label: 'Work', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Stack', href: '#stack' },
  { label: 'Projects', href: '#selected-work', show: props.hasSelectedWork || props.hasProjects },
  { label: 'Credentials', href: '#credentials', show: props.hasCredentials },
  { label: 'Contact', href: '#contact' },
].filter((link) => link.show !== false));
</script>

<template>
  <nav
    class="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4"
    style="background: rgba(8,8,8,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border);"
    aria-label="Primary navigation"
  >
    <a
      href="#top"
      aria-label="Vishnu JN. homepage"
      style="font-family: var(--font-display); font-weight: 600; font-size: 17px; color: var(--foreground); text-decoration: none; letter-spacing: -0.01em;"
    >
      Vishnu JN.
    </a>

    <div class="flex items-center gap-5 md:gap-7">
      <a
        v-for="link in links"
        :key="link.href"
        :href="link.href"
        @click="activeNav = link.label"
        :style="{
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          fontWeight: activeNav === link.label ? 500 : 400,
          color: activeNav === link.label ? 'var(--foreground)' : 'var(--muted-foreground)',
          textDecoration: 'none',
          transition: 'color 0.15s',
        }"
        class="hover:text-[var(--foreground)]"
      >
        {{ link.label }}
      </a>
      <a
        href="https://github.com/Vishnuj-n"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub profile"
        style="font-family: var(--font-sans); font-size: 13px; color: var(--muted-foreground); text-decoration: none; display: flex; align-items: center; gap: 4px; transition: color 0.15s;"
        class="hover:text-[var(--foreground)]"
      >
        GitHub
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
          <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      </a>
    </div>
  </nav>
</template>
