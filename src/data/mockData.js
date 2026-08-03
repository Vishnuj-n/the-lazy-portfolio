export const MOCK_PROJECT_MEDIA = {
  videoDemo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
  ],
};

export const MOCK_CERTIFICATIONS_SAMPLE = [
  {
    title: 'Oracle Cloud Infrastructure 2025 Generative AI Professional',
    issuer: 'Oracle',
    slug: 'oracle',
    color: 'F80000',
  },
  {
    title: 'GitHub Foundations',
    issuer: 'GitHub',
    slug: 'github',
    color: 'FFFFFF',
  },
  {
    title: 'Postman API Fundamentals Student Expert',
    issuer: 'Postman',
    slug: 'postman',
    color: 'FF6C37',
  },
  {
    title: 'Programming, Data Structures and Algorithms Using Python (NPTEL Elite)',
    issuer: 'NPTEL',
  },
  {
    title: '[DUMMY] Kubernetes Certified Application Developer (CKAD)',
    issuer: 'CNCF / Linux Foundation',
    slug: 'kubernetes',
    color: '326CE5',
  },
  {
    title: '[DUMMY] AWS Certified Solutions Architect - Associate',
    issuer: 'Amazon Web Services',
    slug: 'amazonwebservices',
    color: 'FF9900',
  },
];

export const MOCK_DUMMY_PROJECTS = [
  {
    title: '[DUMMY] HyperLog Analytics Engine',
    summary: 'A high-throughput distributed event streaming and real-time aggregation engine written in Rust with gRPC and ClickHouse bindings for sub-millisecond query evaluation.',
    category: 'Distributed Systems',
    date: '2026-08',
    tier: 2,
    priority: 88,
    techStack: ['Rust', 'gRPC', 'ClickHouse', 'Tokio', 'Docker'],
    highlights: [
      'Processes over 100k events/sec with zero-copy deserialization.',
      'Supports custom windowing functions and real-time dashboard subscriptions.'
    ],
    repoName: 'hyperlog-analytics',
    repositoryUrl: 'https://github.com/vishnuj-n/hyperlog-analytics',
    stars: 42,
    forks: 7,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-03T10:00:00Z'
  },
  {
    title: '[DUMMY] EdgeVector Store',
    summary: 'Embedded WebAssembly vector search index with HNSW graph support for local-first in-browser semantic retrieval.',
    category: 'AI Infrastructure',
    date: '2026-07',
    tier: 2,
    priority: 82,
    techStack: ['WebAssembly', 'C++', 'TypeScript', 'SIMD'],
    highlights: [
      'Compiles HNSW C++ core into WASM with SIMD instructions enabled.',
      'Enables sub-10ms k-NN search across 50,000 vectors directly in client memory.'
    ],
    repoName: 'edge-vector-store',
    repositoryUrl: 'https://github.com/vishnuj-n/edge-vector-store',
    stars: 18,
    forks: 2,
    createdAt: '2026-07-15T00:00:00Z',
    updatedAt: '2026-08-02T12:00:00Z'
  }
];

export const MOCK_DUMMY_STACK_CATEGORIES = [
  {
    category: '[DUMMY] Cloud & Distributed Infrastructure',
    desc: 'Cloud-native deployment, container orchestration, and telemetry setups for production microservices.',
    tags: ['Kubernetes', 'Terraform', 'Prometheus', 'Grafana', 'Kafka'],
  },
  {
    category: '[DUMMY] Security & Cryptography',
    desc: 'Zero-knowledge validation mechanisms, OAuth2/OIDC provider integrations, and HSM key management.',
    tags: ['OAuth2', 'JWT', 'Vault', 'mTLS', 'OpenSSL'],
  }
];

