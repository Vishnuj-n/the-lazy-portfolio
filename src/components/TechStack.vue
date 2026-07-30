<script setup>
const categories = [
  {
    name: 'Backend & Systems',
    description: 'Core languages, APIs, and data stores built for reliability and throughput',
    skills: ['Go', 'Python', 'REST APIs', 'PostgreSQL', 'SQLite'],
  },
  {
    name: 'Developer Tooling & DevOps',
    description: 'Environment tooling, containerization, and API testing workflows',
    skills: ['Docker', 'Git', 'Linux CLI', 'Postman', 'Wails'],
  },
  {
    name: 'AI & Workflow Engines',
    description: 'Local-first intelligence, vector search, and spaced repetition schedulers',
    skills: ['FSRS Spaced Repetition', 'RAG Pipelines', 'sqlite-vec', 'ONNX Runtime', 'LangChain'],
  },
];
</script>

<template>
  <section id="tech-stack" class="portfolio-section tech-stack-section" aria-labelledby="tech-stack-title">
    <div class="section-heading">
      <p class="section-heading__index">02 / CORE CAPABILITIES</p>
      <h2 id="tech-stack-title">Technical Stack & Systems</h2>
      <p>Categorized focus areas spanning backend architecture, AI application engines, and developer automation.</p>
    </div>

    <div class="tech-stack__grid">
      <div v-for="cat in categories" :key="cat.name" class="tech-stack__category">
        <h3 class="tech-stack__cat-title">{{ cat.name }}</h3>
        <p class="tech-stack__cat-desc">{{ cat.description }}</p>
        <ul class="tech-stack__pills">
          <li v-for="skill in cat.skills" :key="skill" class="tech-stack__pill">
            {{ skill }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
