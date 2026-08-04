<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  hasSelectedWork: Boolean,
  hasProjects: Boolean,
  hasCredentials: Boolean,
});

const activeNav = ref('');
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLinkClick = (label) => {
  activeNav.value = label;
  closeMobileMenu();
};

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
    class="sticky top-0 z-50 w-full"
    style="background: rgba(8,8,8,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border);"
    aria-label="Primary navigation"
  >
    <div class="flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto">
      <a
        href="#top"
        aria-label="Vishnu JN. homepage"
        style="font-family: var(--font-display); font-weight: 600; font-size: 17px; color: var(--foreground); text-decoration: none; letter-spacing: -0.01em;"
        @click="closeMobileMenu"
      >
        Vishnu JN.
      </a>

      <!-- Desktop Navigation Links -->
      <div class="hidden md:flex items-center gap-7">
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

      <!-- Mobile Hamburger / Close Button -->
      <button
        type="button"
        class="md:hidden flex items-center justify-center p-2 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] focus:outline-none"
        :aria-expanded="isMobileMenuOpen"
        aria-label="Toggle navigation menu"
        @click="toggleMobileMenu"
      >
        <!-- 3-bar Hamburger Icon when closed -->
        <svg v-if="!isMobileMenuOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <!-- Close (X) Icon when open -->
        <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- Mobile Drawer Menu -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden flex flex-col gap-3 px-6 py-5 border-t border-[var(--border)]"
      style="background: rgba(10,10,10,0.96); backdrop-filter: blur(16px);"
    >
      <a
        v-for="link in links"
        :key="`mobile-${link.href}`"
        :href="link.href"
        @click="handleLinkClick(link.label)"
        :style="{
          fontFamily: 'var(--font-sans)',
          fontSize: '15px',
          fontWeight: activeNav === link.label ? 600 : 400,
          color: activeNav === link.label ? 'var(--primary)' : 'var(--foreground)',
          textDecoration: 'none',
          padding: '6px 0',
        }"
      >
        {{ link.label }}
      </a>
      <a
        href="https://github.com/Vishnuj-n"
        target="_blank"
        rel="noreferrer"
        @click="closeMobileMenu"
        style="font-family: var(--font-sans); font-size: 15px; color: var(--muted-foreground); text-decoration: none; display: flex; align-items: center; gap: 6px; padding: 6px 0;"
      >
        GitHub ↗
      </a>
    </div>
  </nav>
</template>

