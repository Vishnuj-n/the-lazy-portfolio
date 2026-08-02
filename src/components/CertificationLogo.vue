<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  certification: {
    type: Object,
    required: true,
  },
});

const imgFailed = ref(false);

const issuerLower = computed(() => (props.certification.issuer || '').toLowerCase());
const titleLower = computed(() => (props.certification.title || '').toLowerCase());

const imageSrc = computed(() => {
  if (props.certification.logoUrl) return props.certification.logoUrl;
  if (props.certification.slug) {
    const color = props.certification.color || 'FFFFFF';
    return `https://cdn.simpleicons.org/${props.certification.slug}/${color}`;
  }
  return null;
});

const initials = computed(() =>
  props.certification.issuer
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase(),
);
</script>

<template>
  <div
    class="flex-shrink-0 flex items-center justify-center rounded border overflow-hidden"
    style="width: 40px; height: 40px; background: rgba(200,245,66,0.04); border-color: rgba(240,237,232,0.12);"
  >
    <!-- Dynamic Image from JSON (logoUrl or simpleicons slug) -->
    <img
      v-if="imageSrc && !imgFailed"
      :src="imageSrc"
      :alt="`${certification.issuer} logo`"
      class="w-5 h-5 object-contain"
      loading="lazy"
      decoding="async"
      @error="imgFailed = true"
    />

    <!-- Built-in vector icons fallback -->
    <template v-else>
      <!-- Oracle Logo -->
      <svg v-if="issuerLower.includes('oracle')" viewBox="0 0 24 24" width="22" height="22" fill="#F80000">
        <path d="M16.2 3H7.8C3.5 3 0 6.5 0 10.8v2.4C0 17.5 3.5 21 7.8 21h8.4c4.3 0 7.8-3.5 7.8-7.8v-2.4C24 6.5 20.5 3 16.2 3zm4.2 10.2c0 2.3-1.9 4.2-4.2 4.2H7.8c-2.3 0-4.2-1.9-4.2-4.2v-2.4c0-2.3 1.9-4.2 4.2-4.2h8.4c2.3 0 4.2 1.9 4.2 4.2v2.4z"/>
      </svg>

      <!-- GitHub Logo -->
      <svg v-else-if="issuerLower.includes('github')" viewBox="0 0 24 24" width="20" height="20" fill="#FFFFFF">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>

      <!-- Postman Logo -->
      <svg v-else-if="issuerLower.includes('postman')" viewBox="0 0 24 24" width="20" height="20" fill="#FF6C37">
        <path d="M13.5 2C7.15 2 2 7.15 2 13.5S7.15 25 13.5 25 25 19.85 25 13.5 19.85 2 13.5 2zm5.7 6.8l-3.3 3.3 1.4 1.4-1.4 1.4-1.4-1.4-2.8 2.8 1.4 1.4-1.4 1.4-1.4-1.4-3.3 3.3c-2.5-1.7-4.1-4.6-4.1-7.8 0-5.2 4.2-9.4 9.4-9.4 2.8 0 5.3 1.2 7.1 3.2z"/>
      </svg>

      <!-- AWS / Forage Cloud Logo -->
      <svg v-else-if="issuerLower.includes('aws') || issuerLower.includes('forage') || titleLower.includes('aws')" viewBox="0 0 24 24" width="20" height="20" fill="#FF9900">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
      </svg>

      <!-- NPTEL / Academic Graduation Cap Logo -->
      <svg v-else-if="issuerLower.includes('nptel')" viewBox="0 0 24 24" width="20" height="20" stroke="#c8f542" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
      </svg>

      <!-- Fallback Monogram -->
      <span
        v-else
        style="font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: #c8f542;"
      >
        {{ initials }}
      </span>
    </template>
  </div>
</template>
