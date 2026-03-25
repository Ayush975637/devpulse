// services/claudeService.js
// npm install @anthropic-ai/sdk

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // store in .env, never hardcode
});

const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 1024;

// ─────────────────────────────────────────────
// 1. AUTO-TAG  →  Suggest tags + detect language
// ─────────────────────────────────────────────
// Use: When user saves a snippet without filling tags manually
// Returns: { language: string, tags: string[] }

export async function autoTagSnippet(code) {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      {
        role: "user",
        content: `Analyze this code snippet and respond ONLY with a JSON object. No explanation, no markdown.

Format:
{
  "language": "javascript",
  "tags": ["auth", "jwt", "middleware"]
}

Rules:
- language: lowercase name (javascript, python, sql, bash, etc.)
- tags: 3–6 short lowercase keywords that describe what this code does
- tags should cover: purpose, library/framework used, pattern type

Code:
\`\`\`
${code}
\`\`\``,
      },
    ],
  });

  const raw = message.content[0].text.trim();

  // Strip accidental markdown fences if Claude adds them
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─────────────────────────────────────────────
// 2. EXPLAIN  →  Plain English explanation
// ─────────────────────────────────────────────
// Use: "Explain this snippet" button on snippet detail page
// Returns: string (markdown supported)

export async function explainSnippet(code, language) {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      {
        role: "user",
        content: `Explain this ${language} code snippet clearly.

Rules:
- Write for a developer who hasn't seen this code before
- Cover: what it does, how it works, when to use it
- Keep it concise — 3 to 6 sentences max
- Use plain English, no unnecessary jargon
- If there are any gotchas or things to watch out for, mention them

Code:
\`\`\`${language}
${code}
\`\`\``,
      },
    ],
  });

  return message.content[0].text.trim();
}

// ─────────────────────────────────────────────
// 3. IMPROVE  →  Suggest code improvements
// ─────────────────────────────────────────────
// Use: "Improve this snippet" button
// Returns: { improvedCode: string, changes: string[] }

export async function improveSnippet(code, language) {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      {
        role: "user",
        content: `Improve this ${language} code snippet and respond ONLY with a JSON object. No markdown, no explanation outside the JSON.

Format:
{
  "improvedCode": "...the full improved code here...",
  "changes": [
    "Added error handling for null input",
    "Used const instead of let for immutable values"
  ]
}

Rules:
- Keep the same logic and purpose, just improve quality
- Focus on: readability, error handling, best practices, performance
- changes: 2–5 short bullet points describing what you changed and why
- If the code is already good, return it as-is with changes: ["Code looks clean, no major improvements needed"]

Code:
\`\`\`${language}
${code}
\`\`\``,
      },
    ],
  });

  const raw = message.content[0].text.trim();
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─────────────────────────────────────────────
// 4. GENERATE DOCS  →  Auto-write documentation
// ─────────────────────────────────────────────
// Use: "Generate Docs" button — adds JSDoc / docstring to snippet
// Returns: string (the code with docs added at top)

export async function generateDocs(code, language) {
  const docStyle = {
    javascript: "JSDoc",
    typescript: "JSDoc",
    python: "docstring (Google style)",
    java: "Javadoc",
    php: "PHPDoc",
  }[language] || "inline comments";

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      {
        role: "user",
        content: `Add ${docStyle} documentation to this ${language} code.

Rules:
- Return ONLY the documented code, nothing else
- Do not change the actual logic
- Cover: purpose, parameters, return value, example usage if helpful
- Keep documentation concise and useful

Code:
\`\`\`${language}
${code}
\`\`\``,
      },
    ],
  });

  // Strip code fences Claude might wrap around the response
  return message.content[0].text
    .replace(/^```[\w]*\n?/, "")
    .replace(/\n?```$/, "")
    .trim();
}