<template>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <div id="top" style="background: var(--background); min-height: 100vh;">
    <router-view />
    <footer
      style="border-top: 1px solid var(--border); padding: 40px 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;"
      class="max-w-5xl mx-auto"
    >
      <span style="font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--foreground);">
        Vishnu JN.
      </span>
      <p style="font-family: var(--font-sans); font-size: 12px; color: var(--muted-foreground);">
        © 2026 · Built with intent from public GitHub manifests.
      </p>
    </footer>
  </div>
</template>
