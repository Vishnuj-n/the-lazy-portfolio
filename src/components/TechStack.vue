<script setup>
const STACK = [
  {
    category: 'Backend & Systems',
    desc: 'Core languages, APIs, and data stores built for reliability and throughput',
    tags: ['Go', 'Python', 'REST APIs', 'PostgreSQL', 'SQLite'],
  },
  {
    category: 'Developer Tooling & DevOps',
    desc: 'Environment tooling, containerisation, and API testing workflows',
    tags: ['Docker', 'Git', 'Linux CLI', 'Postman', 'Wails'],
  },
  {
    category: 'AI & Workflow Engines',
    desc: 'Local-first intelligence, vector search, and spaced-repetition schedulers',
    tags: ['FSRS Spaced Repetition', 'RAG Pipelines', 'sqlite-vec', 'ONNX Runtime', 'LangChain'],
  },
];
</script>

<template>
  <section id="stack" class="px-6 md:px-8 py-16 md:py-20 max-w-5xl mx-auto" aria-labelledby="tech-stack-title">
    <div class="flex items-center gap-3 mb-6">
      <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.12em;">
        02
      </span>
      <div style="width: 24px; height: 1px; background: var(--muted-foreground); opacity: 0.4;" />
      <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted-foreground); letter-spacing: 0.12em; text-transform: uppercase;">
        Core Capabilities
      </span>
    </div>

    <h2
      id="tech-stack-title"
      style="font-family: var(--font-display); font-size: clamp(28px, 4vw, 42px); font-weight: 600; letter-spacing: -0.025em; color: var(--foreground); margin-bottom: 8px;"
    >
      Technical Stack & Systems
    </h2>
    <p style="font-family: var(--font-sans); font-size: 14px; color: var(--muted-foreground); margin-bottom: 32px;">
      Categorised focus areas spanning backend architecture, AI application engines, and developer automation.
    </p>

    <div class="flex flex-wrap gap-4 justify-center">
      <div
        v-for="s in STACK"
        :key="s.category"
        style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; transition: border-color 0.15s;"
        class="hover:border-[rgba(200,245,66,0.2)] w-full sm:w-[calc(50%-0.5rem)] md:w-auto md:flex-[1_1_calc(33.333%-0.67rem)]"
      >
        <h3 style="font-family: var(--font-sans); font-weight: 600; font-size: 14px; color: var(--foreground); margin-bottom: 8px;">
          {{ s.category }}
        </h3>
        <p style="font-family: var(--font-sans); font-size: 12.5px; color: var(--muted-foreground); line-height: 1.6; margin-bottom: 16px;">
          {{ s.desc }}
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="t in s.tags"
            :key="t"
            class="inline-block px-2.5 py-0.5 text-xs rounded-sm border"
            style="font-family: var(--font-mono); background: rgba(200,245,66,0.06); border-color: rgba(200,245,66,0.18); color: #c8f542; letter-spacing: 0.02em;"
          >
            {{ t }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
