<script setup>
import CertificationLogo from './CertificationLogo.vue';

defineProps({
  certifications: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <section v-if="certifications.length" id="credentials" class="px-6 md:px-8 py-16 md:py-20 max-w-5xl mx-auto" aria-labelledby="certifications-title">
    <div class="flex items-center gap-3 mb-6">
      <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.12em;">
        05
      </span>
      <div style="width: 24px; height: 1px; background: var(--muted-foreground); opacity: 0.4;" />
      <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.12em; text-transform: uppercase;">
        Credentials & Study
      </span>
    </div>

    <h2
      id="certifications-title"
      style="font-family: var(--font-display); font-size: clamp(28px, 4vw, 42px); font-weight: 600; letter-spacing: -0.025em; color: var(--foreground); margin-bottom: 32px;"
    >
      Verified areas of study
    </h2>

    <div class="flex flex-wrap gap-4 justify-center">
      <div
        v-for="(cert, index) in certifications"
        :key="cert.title"
        style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; transition: border-color 0.15s; position: relative;"
        class="hover:border-[rgba(200,245,66,0.2)] flex items-start gap-3.5 w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)]"
      >
        <CertificationLogo :certification="cert" />
        <div class="flex-1">
          <p style="font-family: var(--font-sans); font-size: 12px; color: var(--primary); margin-bottom: 2px;">
            {{ cert.issuer }}
          </p>
          <h3 style="font-family: var(--font-sans); font-weight: 600; font-size: 14px; color: var(--foreground); line-height: 1.35;">
            {{ cert.title }}
          </h3>
        </div>
        <span
          style="font-family: var(--font-mono); font-size: 10px; color: var(--muted-foreground); position: absolute; top: 16px; right: 16px; opacity: 0.5;"
          aria-hidden="true"
        >
          {{ String(index + 1).padStart(2, '0') }}
        </span>
      </div>
    </div>
  </section>
</template>
