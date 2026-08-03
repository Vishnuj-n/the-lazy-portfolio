import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const CERTIFICATIONS_PATH = resolve('src/data/certifications.json');
const EXPERIENCE_PATH = resolve('src/data/experience.json');

export function extractImageUrls(text) {
  if (!text || typeof text !== 'string') return [];
  const urls = new Set();
  
  // Markdown images: ![alt](url)
  const mdRegex = /!\[.*?\]\((https?:\/\/[^\s\)]+)\)/g;
  let match;
  while ((match = mdRegex.exec(text)) !== null) {
    urls.add(match[1]);
  }

  // Direct URLs or GitHub attachments
  const urlRegex = /(https?:\/\/(?:github\.com\/user-attachments\/assets\/[^\s\)]+|user-images\.githubusercontent\.com\/[^\s\)]+|[^\s<"']+?\.(?:png|jpg|jpeg|gif|webp|svg)))/gi;
  while ((match = urlRegex.exec(text)) !== null) {
    urls.add(match[1]);
  }

  return Array.from(urls);
}

export function parseTemplateBody(body) {
  if (!body || typeof body !== 'string') return null;

  const data = {};
  const sections = body.split(/###\s+/);

  for (const section of sections) {
    if (!section.trim()) continue;
    const lines = section.trim().split('\n');
    const header = lines[0].trim().toLowerCase();
    const content = lines.slice(1).join('\n').trim();

    if (header.includes('action')) {
      data.action = content.toLowerCase().includes('update') ? 'update' : 'create';
    } else if (header.includes('certification title') || header.includes('title')) {
      data.title = content;
    } else if (header.includes('issuer')) {
      data.issuer = content;
    } else if (header.includes('slug')) {
      if (content && content.toLowerCase() !== '_no response_') data.slug = content;
    } else if (header.includes('color')) {
      if (content && content.toLowerCase() !== '_no response_') data.color = content.replace(/^#/, '');
    } else if (header.includes('company') || header.includes('organization')) {
      data.company = content;
    } else if (header.includes('role')) {
      data.role = content;
    } else if (header.includes('period')) {
      data.period = content;
    } else if (header.includes('location')) {
      data.location = content;
    } else if (header.includes('highlights')) {
      data.highlights = content
        .split('\n')
        .map(line => line.replace(/^[-*•\d\.]+\s*/, '').trim())
        .filter(Boolean);
    }
  }

  return Object.keys(data).length > 0 ? data : null;
}

export function validateCertification(cert) {
  const errors = [];
  if (!cert || typeof cert !== 'object') return ['Certification must be an object'];
  if (!cert.title || typeof cert.title !== 'string' || cert.title.length < 3) errors.push('Title must be at least 3 chars');
  if (!cert.issuer || typeof cert.issuer !== 'string' || cert.issuer.length < 2) errors.push('Issuer must be at least 2 chars');
  if (cert.slug && typeof cert.slug !== 'string') errors.push('Slug must be a string');
  if (cert.color && (typeof cert.color !== 'string' || !/^[0-9A-Fa-f]{3,6}$/.test(cert.color))) errors.push('Color must be a valid hex string');
  return errors;
}

export function validateExperience(exp) {
  const errors = [];
  if (!exp || typeof exp !== 'object') return ['Experience must be an object'];
  const name = exp.company || exp.organization;
  if (!name || typeof name !== 'string' || name.length < 2) errors.push('Company/Organization must be specified');
  if (!exp.role || typeof exp.role !== 'string' || exp.role.length < 2) errors.push('Role must be specified');
  if (!exp.period || typeof exp.period !== 'string') errors.push('Period must be specified');
  if (!Array.isArray(exp.highlights) || exp.highlights.length === 0) errors.push('Highlights must be a non-empty array');
  return errors;
}

export async function callOpenAICompatibleLLM({ prompt, schemaDescription, fetchImpl = fetch, env = process.env }) {
  const baseUrl = (env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const apiKey = env.OPENAI_API_KEY;
  const model = env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not configured');
  }

  const systemPrompt = `You are a portfolio data extraction assistant. Parse the raw input into structured JSON conforming to target schema.
${schemaDescription}
Output ONLY raw valid JSON. Do not include markdown code block backticks.`;

  let attempts = 0;
  let lastError = null;
  let feedback = '';

  while (attempts < 3) {
    attempts++;
    const userContent = feedback ? `${prompt}\n\nPrevious validation failed: ${feedback}. Please fix.` : prompt;
    
    const response = await fetchImpl(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`LLM API request failed (${response.status}): ${errText}`);
    }

    const resJson = await response.json();
    const rawContent = resJson.choices?.[0]?.message?.content?.trim() || '';
    const cleanJsonStr = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();

    try {
      const parsed = JSON.parse(cleanJsonStr);
      return parsed;
    } catch (e) {
      lastError = e.message;
      feedback = `JSON parse error: ${e.message}`;
    }
  }

  throw new Error(`LLM parsing failed after 3 attempts: ${lastError}`);
}

export async function processIssueIntake({
  issueBody,
  issueLabels = [],
  env = process.env,
  fetchImpl = fetch,
  certPath = CERTIFICATIONS_PATH,
  expPath = EXPERIENCE_PATH,
} = {}) {
  const isCredential = issueLabels.includes('intake:credential');
  const isExperience = issueLabels.includes('intake:experience');
  const isAI = issueLabels.includes('intake:ai');

  let parsedData = null;
  let entityType = null;

  // 1. Try static template parsing first for any issue
  parsedData = parseTemplateBody(issueBody);

  if (isCredential) {
    entityType = 'certification';
  } else if (isExperience) {
    entityType = 'experience';
  } else if (parsedData) {
    // Auto-detect entity type from parsed fields if labels are missing
    if (parsedData.title || parsedData.issuer) {
      entityType = 'certification';
    } else if (parsedData.company || parsedData.role) {
      entityType = 'experience';
    }
  }

  // 2. Only fall back to LLM if static parsing failed OR if explicitly labeled intake:ai
  if (!parsedData || !entityType || isAI) {
    if (isAI || !parsedData) {
      const schemaDesc = `
Entity types:
1. "certification": { "action": "create"|"update", "title": string, "issuer": string, "slug"?: string, "color"?: string }
2. "experience": { "action": "create"|"update", "company"?: string, "organization"?: string, "role": string, "period": string, "location": string, "highlights": string[] }

Return JSON object: { "entityType": "certification"|"experience", "data": <entity_object> }`;

      const result = await callOpenAICompatibleLLM({ prompt: issueBody, schemaDescription: schemaDesc, fetchImpl, env });
      entityType = result.entityType;
      parsedData = result.data;
    }
  }

  if (!parsedData || !entityType) {
    throw new Error('Could not parse valid dataset intake from issue');
  }

  if (entityType === 'certification') {
    const errors = validateCertification(parsedData);
    if (errors.length) throw new Error(`Invalid certification: ${errors.join(', ')}`);

    const raw = await readFile(certPath, 'utf8').catch(() => '[]');
    const certs = JSON.parse(raw);
    const action = (parsedData.action || 'create').toLowerCase();

    const existingIndex = certs.findIndex(c => c.title.toLowerCase() === parsedData.title.toLowerCase());
    const cleanCert = { title: parsedData.title, issuer: parsedData.issuer };
    if (parsedData.slug) cleanCert.slug = parsedData.slug;
    if (parsedData.color) cleanCert.color = parsedData.color;

    if (action === 'update' && existingIndex !== -1) {
      certs[existingIndex] = { ...certs[existingIndex], ...cleanCert };
    } else {
      if (existingIndex !== -1) certs[existingIndex] = cleanCert;
      else certs.push(cleanCert);
    }

    await writeFile(certPath, JSON.stringify(certs, null, 2) + '\n', 'utf8');
    return { type: 'certification', action, data: cleanCert, path: certPath };
  } else if (entityType === 'experience') {
    const errors = validateExperience(parsedData);
    if (errors.length) throw new Error(`Invalid experience: ${errors.join(', ')}`);

    const raw = await readFile(expPath, 'utf8').catch(() => '[]');
    const exps = JSON.parse(raw);
    const action = (parsedData.action || 'create').toLowerCase();

    const nameKey = parsedData.company ? 'company' : 'organization';
    const nameVal = parsedData.company || parsedData.organization;

    const existingIndex = exps.findIndex(e => (e.company || e.organization || '').toLowerCase() === nameVal.toLowerCase());
    const cleanExp = { [nameKey]: nameVal, role: parsedData.role, period: parsedData.period, location: parsedData.location, highlights: parsedData.highlights };

    if (action === 'update' && existingIndex !== -1) {
      exps[existingIndex] = { ...exps[existingIndex], ...cleanExp };
    } else {
      if (existingIndex !== -1) exps[existingIndex] = cleanExp;
      else exps.push(cleanExp);
    }

    await writeFile(expPath, JSON.stringify(exps, null, 2) + '\n', 'utf8');
    return { type: 'experience', action, data: cleanExp, path: expPath };
  }

  throw new Error(`Unsupported entity type: ${entityType}`);
}

export async function main() {
  const issueBody = process.env.ISSUE_BODY || '';
  const issueLabels = (process.env.ISSUE_LABELS || '').split(',').map(s => s.trim());

  if (!issueBody) {
    console.error('ISSUE_BODY environment variable is missing');
    process.exitCode = 1;
    return;
  }

  try {
    const result = await processIssueIntake({ issueBody, issueLabels });
    console.log(`Successfully processed ${result.type} intake (${result.action}):`, result.data);
  } catch (err) {
    console.error(`Error processing issue intake: ${err.message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main();
}
