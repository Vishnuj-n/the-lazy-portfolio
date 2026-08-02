<script setup>
defineProps({
  experience: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <section id="experience" class="px-6 md:px-8 py-16 md:py-20 max-w-5xl mx-auto" aria-labelledby="experience-title">
    <div class="flex items-center gap-3 mb-6">
      <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.12em;">
        01
      </span>
      <div style="width: 24px; height: 1px; background: var(--muted-foreground); opacity: 0.4;" />
      <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.12em; text-transform: uppercase;">
        Experience & Leadership
      </span>
    </div>

    <h2
      id="experience-title"
      style="font-family: var(--font-display); font-size: clamp(28px, 4vw, 42px); font-weight: 600; letter-spacing: -0.025em; color: var(--foreground); margin-bottom: 8px;"
    >
      Work Experience & Leadership
    </h2>
    <p style="font-family: var(--font-sans); font-size: 14px; color: var(--muted-foreground); margin-bottom: 32px;">
      Engineering roles, industry internship, and technical leadership.
    </p>

    <div class="flex flex-col gap-4">
      <div
        v-for="(item, index) in experience"
        :key="index"
        style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px 28px; transition: border-color 0.15s;"
        class="hover:border-[rgba(200,245,66,0.2)]"
      >
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
          <div>
            <h3 style="font-family: var(--font-sans); font-weight: 600; font-size: 15px; color: var(--foreground); margin-bottom: 3px;">
              {{ item.role }}
            </h3>
            <p style="font-family: var(--font-sans); font-size: 13px; color: var(--primary);">
              {{ item.company || item.organization }}
            </p>
          </div>
          <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); white-space: nowrap; letter-spacing: 0.04em;">
            {{ item.period }}
          </span>
        </div>

        <ul class="flex flex-col gap-2.5 mt-4">
          <li
            v-for="(highlight, hIndex) in (item.bullets || item.highlights)"
            :key="hIndex"
            style="font-family: var(--font-sans); font-size: 13.5px; line-height: 1.65; color: var(--secondary-foreground); padding-left: 16px; position: relative;"
          >
            <span
              style="position: absolute; left: 0; top: 8px; width: 4px; height: 4px; border-radius: 50%; background: var(--primary); display: block;"
            />
            {{ highlight }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
