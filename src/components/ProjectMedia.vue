<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const imageFailed = ref(false);
const thumbnail = computed(() => props.project.media?.thumbnail || '');
const title = computed(() => props.project.title || 'Untitled project');
const initials = computed(() =>
  title.value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase(),
);
</script>

<template>
  <div class="project-media" :class="{ 'project-media--compact': compact }">
    <img
      v-if="thumbnail && !imageFailed"
      class="project-media__image"
      :src="thumbnail"
      :alt="`${title} project preview`"
      width="1200"
      height="800"
      loading="lazy"
      decoding="async"
      @error="imageFailed = true"
    />
    <div v-else class="project-media__placeholder" role="img" :aria-label="`${title} monogram preview`">
      <svg class="project-media__noise" aria-hidden="true">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.07" />
      </svg>
      <span class="project-media__orbit" aria-hidden="true"></span>
      <span class="project-media__orbit project-media__orbit--secondary" aria-hidden="true"></span>
      <span class="project-media__initials">{{ initials }}</span>
      <span class="project-media__label">Image not supplied</span>
    </div>
  </div>
</template>
