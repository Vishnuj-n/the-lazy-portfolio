<script setup>
const shortYear = String(new Date().getFullYear()).slice(-2);
</script>

<template>
  <header class="hero" aria-labelledby="hero-title">
    <div class="hero__utility">
      <a class="hero__mark" href="#main-content" aria-label="Go to selected work">VJN / {{ shortYear }}</a>
      <p class="status-pill">
        <span class="status-pill__dot" aria-hidden="true"></span>
        Building local-first systems
      </p>
    </div>

    <div class="hero__grid">
      <div class="hero__identity">
        <p class="eyebrow">Software engineering student / Bengaluru</p>
        <h1 id="hero-title">Vishnu J<br />Narayanan</h1>
      </div>

      <div class="hero__brief">
        <p class="hero__role">Backend systems / Go / Python / AI applications</p>
        <p class="hero__summary">
          Software engineering student focused on backend systems, local-first applications, and
          AI-integrated software. Experienced in designing modular architectures, REST APIs,
          desktop applications, and workflow-driven systems using Go, Python, PostgreSQL, SQLite,
          and modern backend technologies.
        </p>
        <nav class="hero__links" aria-label="Social profiles">
          <a href="https://github.com/Vishnuj-n" target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href="https://linkedin.com/in/vishnu-jn" target="_blank" rel="noreferrer">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </div>

    <a class="hero__index" href="#selected-work">
      <span>Selected systems</span>
      <span aria-hidden="true">↓</span>
    </a>
  </header>
</template>
