<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  certification: {
    type: Object,
    required: true,
  },
});

const sourceIndex = ref(0);
const sources = computed(() => {
  const resolved = [];
  if (props.certification.logoUrl) resolved.push(props.certification.logoUrl);
  if (props.certification.slug) {
    const color = props.certification.color || 'FFFFFF';
    resolved.push(`https://cdn.simpleicons.org/${props.certification.slug}/${color}`);
  }
  return resolved;
});
const activeSource = computed(() => sources.value[sourceIndex.value]);
const initials = computed(() =>
  props.certification.issuer
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase(),
);

function useNextSource() {
  sourceIndex.value += 1;
}
</script>

<template>
  <div class="certification-logo">
    <img
      v-if="activeSource"
      :src="activeSource"
      :alt="`${certification.issuer} logo`"
      width="64"
      height="64"
      loading="lazy"
      decoding="async"
      @error="useNextSource"
    />
    <svg v-else viewBox="0 0 64 64" width="64" height="64" role="img" :aria-label="`${certification.issuer} initials`">
      <defs>
        <linearGradient :id="`monogram-${initials}`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="oklch(0.8 0.18 190)" />
          <stop offset="1" stop-color="oklch(0.58 0.12 220)" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="61" height="61" rx="10" fill="oklch(0.12 0.015 250)" :stroke="`url(#monogram-${initials})`" stroke-width="3" />
      <text x="32" y="38" text-anchor="middle" fill="oklch(0.96 0.005 250)" font-family="JetBrains Mono, monospace" font-size="18" font-weight="500">{{ initials }}</text>
    </svg>
  </div>
</template>
