<template>
  <section id="contact" class="px-6 md:px-8 py-16 md:py-20 max-w-5xl mx-auto" aria-labelledby="contact-title">
    <div
      style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 36px 32px;"
    >
      <div class="flex items-center gap-3 mb-6">
        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.12em;">
          06
        </span>
        <div style="width: 24px; height: 1px; background: var(--muted-foreground); opacity: 0.4;" />
        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.12em; text-transform: uppercase;">
          Get In Touch
        </span>
      </div>

      <h2
        id="contact-title"
        style="font-family: var(--font-display); font-size: clamp(26px, 3.5vw, 38px); font-weight: 600; letter-spacing: -0.02em; color: var(--foreground); margin-bottom: 12px;"
      >
        Let's build software that matters.
      </h2>
      <p style="font-family: var(--font-sans); font-size: 14px; line-height: 1.65; color: var(--secondary-foreground); max-width: 600px; margin-bottom: 28px;">
        I'm currently open for Software Developer Internships and full-time Software Engineering roles. Interested in backend systems, AI applications, and developer productivity tooling.
      </p>

      <div class="flex items-center gap-3 flex-wrap">
        <a
          href="mailto:vishnujn2005@gmail.com"
          style="font-family: var(--font-sans); font-size: 13px; font-weight: 500; padding: 10px 22px; background: var(--primary); color: var(--primary-foreground); border-radius: var(--radius); text-decoration: none; display: inline-flex; items-center: center; gap: 8px; transition: opacity 0.15s;"
          class="hover:opacity-90"
        >
          <span>Send Email</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2.5 4.5h19A2.5 2.5 0 0 1 24 7v10a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 0 17V7a2.5 2.5 0 0 1 2.5-2.5Zm0 2L12 13l9.5-6.5h-19ZM22 8.4l-9.4 6.4a1 1 0 0 1-1.2 0L2 8.4V17c0 .3.2.5.5.5h19c.3 0 .5-.2.5-.5V8.4Z"/></svg>
        </a>
        <a
          href="https://linkedin.com/in/vishnu-jn"
          target="_blank"
          rel="noreferrer"
          style="font-family: var(--font-sans); font-size: 13px; font-weight: 500; padding: 10px 20px; background: transparent; color: var(--foreground); border: 1px solid var(--border); border-radius: var(--radius); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: border-color 0.15s;"
          class="hover:border-[rgba(240,237,232,0.3)]"
        >
          LinkedIn ↗
        </a>
        <a
          href="https://github.com/Vishnuj-n"
          target="_blank"
          rel="noreferrer"
          style="font-family: var(--font-sans); font-size: 13px; font-weight: 500; padding: 10px 20px; background: transparent; color: var(--foreground); border: 1px solid var(--border); border-radius: var(--radius); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: border-color 0.15s;"
          class="hover:border-[rgba(240,237,232,0.3)]"
        >
          GitHub ↗
        </a>
      </div>
    </div>
  </section>
</template>
