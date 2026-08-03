<script setup>
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import projectsData from '../data/projects.json';

import { MOCK_PROJECT_MEDIA } from '../data/mockData.js';

const route = useRoute();
const projectId = route.params.id;

const isDev = import.meta.env.DEV || new URLSearchParams(window.location.search).has('mock');

const project = computed(() => {
  const found = (projectsData || []).find(
    (p) => (p.repoName || '').toLowerCase() === (projectId || '').toLowerCase()
  ) || projectsData[0];

  if (isDev && (!found.media || !Object.keys(found.media).length)) {
    return { ...found, media: MOCK_PROJECT_MEDIA };
  }
  return found;
});

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v) return `https://www.youtube-nocookie.com/embed/${v}?autoplay=0&rel=0`;
    }
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0`;
    }
  } catch {}
  return '';
}
</script>

<template>
  <div v-if="project" class="px-6 md:px-8 py-12 md:py-16 max-w-4xl mx-auto">
    <RouterLink
      to="/"
      style="font-family: var(--font-mono); font-size: 12px; color: var(--muted-foreground); text-decoration: none; display: inline-block; margin-bottom: 24px; transition: color 0.15s;"
      class="hover:text-[var(--foreground)]"
    >
      ← Back to Portfolio
    </RouterLink>

    <header class="mb-12">
      <p style="font-family: var(--font-mono); font-size: 11px; color: var(--primary); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 12px;">
        {{ project.category }} <span v-if="project.date">· {{ project.date }}</span>
      </p>
      <h1
        style="font-family: var(--font-display); font-size: clamp(32px, 5vw, 54px); font-weight: 700; letter-spacing: -0.025em; color: var(--foreground); margin-bottom: 16px; line-height: 1.1;"
      >
        {{ project.title }}
      </h1>
      <p style="font-family: var(--font-sans); font-size: 16px; line-height: 1.7; color: var(--secondary-foreground); max-width: 680px; margin-bottom: 24px;">
        {{ project.summary }}
      </p>

      <div class="flex items-center gap-3 flex-wrap">
        <a
          v-if="project.repositoryUrl"
          :href="project.repositoryUrl"
          target="_blank"
          rel="noreferrer"
          style="font-family: var(--font-sans); font-size: 13px; font-weight: 500; padding: 9px 20px; background: var(--primary); color: var(--primary-foreground); border-radius: var(--radius); text-decoration: none; transition: opacity 0.15s;"
          class="hover:opacity-90"
        >
          View Source Code ↗
        </a>
        <a
          v-if="project.links?.live"
          :href="project.links.live"
          target="_blank"
          rel="noreferrer"
          style="font-family: var(--font-sans); font-size: 13px; font-weight: 500; padding: 9px 20px; background: transparent; color: var(--foreground); border: 1px solid var(--border); border-radius: var(--radius); text-decoration: none; transition: border-color 0.15s;"
          class="hover:border-[rgba(240,237,232,0.3)]"
        >
          Live Demo ↗
        </a>
      </div>
    </header>

    <!-- Media Section -->
    <section v-if="project.media && (project.media.videoDemo || project.media.thumbnail || project.media.gallery?.length)" class="pt-8 mb-12" style="border-top: 1px solid var(--border);">
      <div class="flex items-center justify-between gap-4 mb-6">
        <div>
          <span style="font-family: var(--font-mono); font-size: 11px; color: var(--primary); letter-spacing: 0.14em; text-transform: uppercase;">
            Showcase
          </span>
          <h2 style="font-family: var(--font-display); font-size: 22px; font-weight: 600; color: var(--foreground); margin-top: 2px;">
            Media & Architectural Demos
          </h2>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Video Demo Card -->
        <div v-if="project.media.videoDemo" class="flex flex-col gap-2">
          <span style="font-family: var(--font-mono); font-size: 10px; color: var(--muted-foreground); letter-spacing: 0.08em; text-transform: uppercase;">
            ▶ Live Demo Video
          </span>
          <div class="rounded-md overflow-hidden relative group" style="border: 1px solid var(--border); background: var(--card); aspect-ratio: 16/9;">
            <iframe
              v-if="getYouTubeEmbedUrl(project.media.videoDemo)"
              :src="getYouTubeEmbedUrl(project.media.videoDemo)"
              title="YouTube video player"
              class="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
            <video
              v-else
              controls
              loop
              muted
              playsinline
              :src="project.media.videoDemo"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Main Thumbnail Card -->
        <div v-if="project.media.thumbnail" class="flex flex-col gap-2">
          <span style="font-family: var(--font-mono); font-size: 10px; color: var(--muted-foreground); letter-spacing: 0.08em; text-transform: uppercase;">
            📷 Primary Interface
          </span>
          <div class="rounded-md overflow-hidden relative group cursor-pointer" style="border: 1px solid var(--border); background: var(--card); aspect-ratio: 16/9;">
            <img
              :src="project.media.thumbnail"
              :alt="project.title + ' primary preview'"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        <!-- Additional Gallery Images -->
        <div
          v-for="(img, idx) in project.media.gallery"
          :key="idx"
          class="flex flex-col gap-2"
        >
          <span style="font-family: var(--font-mono); font-size: 10px; color: var(--muted-foreground); letter-spacing: 0.08em; text-transform: uppercase;">
            🖼️ Feature Screen {{ idx + 1 }}
          </span>
          <div class="rounded-md overflow-hidden relative group cursor-pointer" style="border: 1px solid var(--border); background: var(--card); aspect-ratio: 16/9;">
            <img
              :src="img"
              :alt="`${project.title} screenshot ${idx + 1}`"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Architectural Highlights -->
    <section v-if="project.highlights?.length" class="pt-8 mb-12" style="border-top: 1px solid var(--border);">
      <h2 style="font-family: var(--font-display); font-size: 20px; font-weight: 600; color: var(--foreground); margin-bottom: 16px;">
        Architectural Highlights & Features
      </h2>
      <ul class="flex flex-col gap-2.5">
        <li
          v-for="(highlight, i) in project.highlights"
          :key="i"
          style="font-family: var(--font-sans); font-size: 14px; line-height: 1.65; color: var(--secondary-foreground); padding-left: 16px; position: relative;"
        >
          <span style="position: absolute; left: 0; top: 8px; width: 4px; height: 4px; border-radius: 50%; background: var(--primary); display: block;" />
          {{ highlight }}
        </li>
      </ul>
    </section>

    <!-- Tech Stack -->
    <section v-if="project.techStack?.length" class="pt-8 mb-12" style="border-top: 1px solid var(--border);">
      <h2 style="font-family: var(--font-display); font-size: 20px; font-weight: 600; color: var(--foreground); margin-bottom: 16px;">
        Technologies Used
      </h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tech in project.techStack"
          :key="tech"
          class="inline-block px-2.5 py-1 text-xs rounded-sm border"
          style="font-family: var(--font-mono); background: rgba(200,245,66,0.06); border-color: rgba(200,245,66,0.18); color: #c8f542; letter-spacing: 0.02em;"
        >
          {{ tech }}
        </span>
      </div>
    </section>

    <footer class="pt-8" style="border-top: 1px solid var(--border);">
      <RouterLink
        to="/"
        style="font-family: var(--font-mono); font-size: 12px; color: var(--muted-foreground); text-decoration: none;"
        class="hover:text-[var(--foreground)]"
      >
        ← Back to Home
      </RouterLink>
    </footer>
  </div>
</template>
