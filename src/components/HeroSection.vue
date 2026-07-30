<script setup>
import { ref } from 'vue';

const avatarFailed = ref(false);
</script>

<template>
  <header class="hero" aria-labelledby="hero-title">
    <div class="hero__grid">
      <div class="hero__content">
        <p class="eyebrow">Software engineering student · Bengaluru</p>
        <h1 id="hero-title">Vishnu J Narayanan</h1>
        <p class="hero__summary">
          Backend Systems & AI Applications Engineer building local-first software around real workflow friction, long-term learning retention, and developer automation.
        </p>

        <ul class="hero__highlights">
          <li>Computer Science (Data Science) @ Atria Institute of Technology (CGPA 8.76) & Minor in AI @ IIT Mandi.</li>
          <li>Software Developer Intern @ Ellipsonic — Go, Python, PostgreSQL, REST APIs & Docker.</li>
          <li>Technical Lead @ AIT AI Club | Cryptic 3.0 Hackathon Runner-up.</li>
        </ul>

        <div class="hero__actions">
          <a href="#contact" class="btn btn--primary" aria-label="Get in touch">
            <span>Contact Me</span>
          </a>
          <a href="https://github.com/Vishnuj-n" target="_blank" rel="noreferrer" class="btn btn--secondary" aria-label="Download or view resume">
            <span>View Résumé</span>
            <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 16l-5-5h3V4h4v7h3l-5 5zm9 4H3v-2h18v2z"/></svg>
          </a>

          <nav class="social-links" aria-label="Social profiles">
            <a href="https://github.com/Vishnuj-n" target="_blank" rel="noreferrer" aria-label="GitHub profile">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .8a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.22c-3.22.7-3.9-1.36-3.9-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.16 1.18a10.94 10.94 0 0 1 5.76 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.82 1.19 3.08 0 4.41-2.71 5.38-5.29 5.67.42.36.79 1.06.79 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .8Z"/></svg>
            </a>
            <a href="https://linkedin.com/in/vishnu-jn" target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.3 7.8H1.7V22h3.6V7.8ZM3.5 2A2.1 2.1 0 1 0 3.5 6.2 2.1 2.1 0 0 0 3.5 2ZM22.3 13.8c0-4.3-2.3-6.3-5.4-6.3a4.7 4.7 0 0 0-4.2 2.3h-.1v-2H9.2V22h3.6v-7c0-1.9.4-3.7 2.7-3.7 2.3 0 2.3 2.1 2.3 3.8V22h3.6l.9-8.2Z"/></svg>
            </a>
            <a href="mailto:vishnujn2005@gmail.com" aria-label="Email Vishnu">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 4.5h19A2.5 2.5 0 0 1 24 7v10a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 0 17V7a2.5 2.5 0 0 1 2.5-2.5Zm0 2L12 13l9.5-6.5h-19ZM22 8.4l-9.4 6.4a1 1 0 0 1-1.2 0L2 8.4V17c0 .3.2.5.5.5h19c.3 0 .5-.2.5-.5V8.4Z"/></svg>
            </a>
          </nav>
        </div>
      </div>

      <div class="hero__visual">
        <div class="hero__avatar-frame" title="Vishnu J Narayanan">
          <img
            v-if="!avatarFailed"
            src="/avatar-bw.svg"
            alt="Vishnu J Narayanan"
            class="hero__avatar-img"
            @error="avatarFailed = true"
          />
          <div v-else class="hero__avatar-fallback" aria-hidden="true">
            <span class="hero__avatar-initials">VN</span>
            <span class="hero__avatar-badge">Go · Python · AI</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

