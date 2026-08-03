<script setup>
import { ref, computed } from 'vue';
import experienceData from '../data/experience.json';
import educationData from '../data/education.json';
import profileData from '../data/profile.json';

const props = defineProps({
  experience: {
    type: Array,
    default: () => (Array.isArray(experienceData) ? experienceData : []),
  },
  education: {
    type: Array,
    default: () => (Array.isArray(educationData) ? educationData : []),
  },
  profile: {
    type: Object,
    default: () => profileData,
  },
});

const avatarFailed = ref(false);

// Generic computed list built iteratively using a while loop directly from JSON dataset
const recentExperience = computed(() => {
  const result = [];
  const list = props.experience;
  let i = 0;
  const maxItems = 2;

  while (i < list.length && result.length < maxItems) {
    const item = list[i];
    result.push({
      id: item.company || item.organization || `exp-${i}`,
      role: item.role,
      organization: item.company || item.organization,
      period: item.period,
      subtitle: item.highlights?.[0] || '',
    });
    i++;
  }

  return result;
});
</script>

<template>
  <section class="px-6 md:px-8 pt-10 md:pt-12 pb-12 md:pb-16 max-w-6xl mx-auto" aria-labelledby="hero-title">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-10">
      <div class="flex-1 max-w-[720px]">
        <div class="flex items-center gap-3 mb-6 md:mb-8">
          <span
            style="font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.18em; color: var(--primary); text-transform: uppercase;"
          >
            {{ profile.role }}
          </span>
          <span style="color: var(--muted-foreground)">·</span>
          <span
            style="font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.18em; color: var(--muted-foreground); text-transform: uppercase;"
          >
            {{ profile.location }}
          </span>
        </div>

        <h1
          id="hero-title"
          style="font-family: var(--font-display); font-size: clamp(48px, 7.5vw, 84px); font-weight: 700; line-height: 0.95; letter-spacing: -0.03em; color: var(--foreground); margin-bottom: 28px;"
        >
          {{ profile.firstName }}<br />
          <em style="font-style: italic; font-weight: 300;">{{ profile.lastName }}</em>
        </h1>

        <p
          style="font-family: var(--font-sans); font-size: 20px; line-height: 1.7; color: var(--secondary-foreground); max-width: 700px; margin-bottom: 24px;"
        >
          {{ profile.summary }}
        </p>

        <ul
          class="flex flex-col gap-3.5 mb-8 p-0 list-none"
          style="font-size: 19px; color: var(--secondary-foreground); font-family: var(--font-sans); line-height: 1.65;"
        >
          <li
            v-for="item in recentExperience"
            :key="item.id"
            class="flex items-start gap-3"
          >
            <span style="color: var(--primary); font-size: 18px; line-height: 1.5; flex-shrink: 0;">—</span>
            <div>
              <span style="color: var(--foreground); font-weight: 500;">{{ item.role }}</span> @ {{ item.organization }}
              <span style="font-size: 14px; color: var(--muted-foreground); font-family: var(--font-mono); font-weight: 400;">({{ item.period }})</span>
              <div style="font-size: 15px; color: var(--muted-foreground); margin-top: 2px;">
                {{ item.subtitle }}
              </div>
            </div>
          </li>
        </ul>

        <div class="flex items-center gap-3 flex-wrap mb-9">
          <a
            href="#contact"
            style="font-family: var(--font-sans); font-size: 14px; font-weight: 500; padding: 10px 22px; background: var(--primary); color: var(--primary-foreground); border-radius: var(--radius); text-decoration: none; letter-spacing: 0.01em; transition: opacity 0.15s;"
            class="hover:opacity-90"
          >
            Contact Me
          </a>
          <a
            href="https://github.com/Vishnuj-n"
            target="_blank"
            rel="noreferrer"
            style="font-family: var(--font-sans); font-size: 14px; font-weight: 500; padding: 10px 22px; background: transparent; color: var(--foreground); border-radius: var(--radius); border: 1px solid var(--border); text-decoration: none; transition: border-color 0.15s;"
            class="hover:border-[rgba(240,237,232,0.3)]"
          >
            View Résumé ↗
          </a>

          <div class="flex items-center gap-2 ml-1">
            <a
              href="https://github.com/Vishnuj-n"
              target="_blank"
              rel="noreferrer"
              title="GitHub"
              style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: var(--radius); border: 1px solid var(--border); color: var(--muted-foreground); transition: color 0.15s, border-color 0.15s;"
              class="hover:text-[var(--foreground)] hover:border-[rgba(240,237,232,0.25)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/vishnu-jn"
              target="_blank"
              rel="noreferrer"
              title="LinkedIn"
              style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: var(--radius); border: 1px solid var(--border); color: var(--muted-foreground); transition: color 0.15s, border-color 0.15s;"
              class="hover:text-[var(--foreground)] hover:border-[rgba(240,237,232,0.25)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
            <a
              href="mailto:vishnujn2005@gmail.com"
              title="Email"
              style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: var(--radius); border: 1px solid var(--border); color: var(--muted-foreground); transition: color 0.15s, border-color 0.15s;"
              class="hover:text-[var(--foreground)] hover:border-[rgba(240,237,232,0.25)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Metric Stat Bar -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 pt-6 border-t border-[var(--border)]">
          <div>
            <div style="font-family: var(--font-display); font-size: 26px; font-weight: 700; color: var(--primary); line-height: 1;">8.71</div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 5px;">GPA / CGPA</div>
          </div>
          <div>
            <div style="font-family: var(--font-display); font-size: 26px; font-weight: 700; color: var(--foreground); line-height: 1;">3+</div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 5px;">Production Projects</div>
          </div>
          <div>
            <div style="font-family: var(--font-display); font-size: 26px; font-weight: 700; color: var(--foreground); line-height: 1;">1</div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 5px;">Software Internship</div>
          </div>
          <div>
            <div style="font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--foreground); line-height: 1.1;">Runner-up</div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 5px;">Hackathon</div>
          </div>
        </div>
      </div>

      <!-- Headshot portrait frame -->
      <div class="flex-shrink-0">
        <div
          class="w-[260px] h-[325px] md:w-[320px] md:h-[400px] transition-all duration-300"
          style="border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); background: #111111; position: relative; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);"
        >
          <img
            v-if="!avatarFailed"
            src="/picture.png"
            alt="Vishnu J Narayanan"
            style="width: 100%; height: 100%; object-fit: cover;"
            @error="avatarFailed = true"
          />
          <div
            v-else
            class="flex flex-col items-center justify-center h-full p-4 text-center"
            style="background: #161616;"
          >
            <span style="font-family: var(--font-display); font-size: 28px; font-weight: 600; color: var(--primary);">VN</span>
            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); margin-top: 8px;">Go · Python · AI</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

