<template>
  <div class="min-h-screen bg-bg-base text-text-primary px-6 py-12 md:px-12 lg:px-24">
    <!-- Header section -->
    <header class="max-w-6xl mx-auto border-b border-border-subtle pb-8 mb-12">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span class="font-mono text-xs uppercase tracking-widest text-accent-teal block mb-2">
            System Initialization // Task 1 Active
          </span>
          <h1 class="font-syne font-extrabold text-4xl sm:text-5xl md:text-6xl text-text-primary tracking-tight">
            Vishnu J Narayanan
          </h1>
          <p class="font-inter text-text-secondary text-lg mt-2 max-w-2xl">
            Zero-Maintenance Portfolio Architecture — Powered by Vite, Vue 3 & Tailwind CSS with OKLCH Color Tokens.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-surface border border-border-subtle font-mono text-xs text-text-secondary">
            <span class="w-2 h-2 rounded-full bg-accent-teal animate-pulse"></span>
            OKLCH Engine Ready
          </span>
        </div>
      </div>
    </header>

    <!-- Main Content Grid / Test Bed -->
    <main class="max-w-6xl mx-auto space-y-12">
      <!-- Token Demonstration Section -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Token Card 1 -->
        <div class="bg-bg-surface border border-border-subtle rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-teal hover:shadow-[0_12px_32px_-8px_rgba(0,242,254,0.15)]">
          <span class="font-mono text-xs text-accent-teal uppercase tracking-wider block mb-2">Typography Stack</span>
          <h3 class="font-syne font-bold text-xl text-text-primary mb-3">Syne Display</h3>
          <p class="font-inter text-sm text-text-secondary leading-relaxed">
            Geometric structure for headlines and section banners. Ultra-clean typography hierarchy.
          </p>
        </div>

        <!-- Token Card 2 -->
        <div class="bg-bg-surface border border-border-subtle rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-teal hover:shadow-[0_12px_32px_-8px_rgba(0,242,254,0.15)]">
          <span class="font-mono text-xs text-accent-teal uppercase tracking-wider block mb-2">Body Stack</span>
          <h3 class="font-syne font-bold text-xl text-text-primary mb-3">Inter Body Text</h3>
          <p class="font-inter text-sm text-text-secondary leading-relaxed">
            Ultra-legible sans-serif body typography designed for precision readability across density levels.
          </p>
        </div>

        <!-- Token Card 3 -->
        <div class="bg-bg-surface border border-border-subtle rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-teal hover:shadow-[0_12px_32px_-8px_rgba(0,242,254,0.15)]">
          <span class="font-mono text-xs text-accent-teal uppercase tracking-wider block mb-2">Code & Metadata</span>
          <h3 class="font-syne font-bold text-xl text-text-primary mb-3">JetBrains Mono</h3>
          <div class="font-mono text-xs text-text-muted bg-bg-base border border-border-subtle p-3 rounded-lg mt-2">
            oklch(0.80 0.18 190) // Electric Teal
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
</script>
