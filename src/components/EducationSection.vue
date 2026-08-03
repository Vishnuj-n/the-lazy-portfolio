<script setup>
import educationData from '../data/education.json';

defineProps({
  education: {
    type: Array,
    default: () => (Array.isArray(educationData) ? educationData : []),
  },
});
</script>

<template>
  <section v-if="education.length" id="education" class="px-6 md:px-8 py-16 md:py-20 max-w-5xl mx-auto" aria-labelledby="education-title">
    <div class="flex items-center gap-3 mb-6">
      <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.12em;">
        02
      </span>
      <div style="width: 24px; height: 1px; background: var(--muted-foreground); opacity: 0.4;" />
      <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.12em; text-transform: uppercase;">
        Education & Academics
      </span>
    </div>

    <h2
      id="education-title"
      style="font-family: var(--font-display); font-size: clamp(28px, 4vw, 42px); font-weight: 600; letter-spacing: -0.025em; color: var(--foreground); margin-bottom: 8px;"
    >
      Education
    </h2>
    <p style="font-family: var(--font-sans); font-size: 14px; color: var(--muted-foreground); margin-bottom: 32px;">
      Academic background, degree programs, and minor specializations.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="edu in education"
        :key="edu.id"
        style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px 28px; transition: border-color 0.15s; display: flex; flex-direction: column; justify-content: space-between;"
        class="hover:border-[rgba(200,245,66,0.2)]"
      >
        <div>
          <div class="flex items-start justify-between gap-3 mb-2">
            <h3 style="font-family: var(--font-sans); font-weight: 600; font-size: 16px; color: var(--foreground); line-height: 1.35;">
              {{ edu.degree }}
            </h3>
            <span v-if="edu.isPrimary" style="font-family: var(--font-mono); font-size: 10px; padding: 2px 8px; border-radius: 999px; background: rgba(200,245,66,0.1); color: var(--primary); border: 1px solid rgba(200,245,66,0.2); white-space: nowrap;">
              Primary Degree
            </span>
          </div>

          <p style="font-family: var(--font-sans); font-size: 14px; color: var(--primary); font-weight: 500; margin-bottom: 4px;">
            {{ edu.institution }}
          </p>

          <p v-if="edu.location" style="font-family: var(--font-sans); font-size: 12.5px; color: var(--muted-foreground); margin-bottom: 12px;">
            {{ edu.location }}
          </p>

          <div v-if="edu.coursework && edu.coursework.length" style="margin-top: 12px;">
            <p style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
              Relevant Coursework
            </p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="course in edu.coursework"
                :key="course"
                style="font-family: var(--font-mono); font-size: 11px; background: rgba(255,255,255,0.04); color: var(--secondary-foreground); border: 1px solid var(--border); border-radius: 4px; padding: 2px 7px;"
              >
                {{ course }}
              </span>
            </div>
          </div>
        </div>

        <div style="border-top: 1px solid var(--border); padding-top: 14px; margin-top: 16px;" class="flex items-center justify-between">
          <span v-if="edu.score" style="font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--primary);">
            {{ edu.score }}
          </span>
          <span v-else style="font-family: var(--font-mono); font-size: 12px; color: var(--muted-foreground);">
            Completed / Ongoing
          </span>

          <span v-if="edu.period" style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.04em;">
            {{ edu.period }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
