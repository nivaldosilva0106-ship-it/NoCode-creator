// Client-side AI generation - calls provider APIs directly from browser
// Used when running on Vercel (no Express server available)

export interface GenerateResult {
  html: string;
  css: string;
  js: string;
  explanation: string;
}

const SYSTEM_PROMPT = `Você é o NoCode Creator, um desenvolvedor front-end de elite que cria sites de página única (SPA) modernos, responsivos e extremamente elegantes em HTML5, CSS3 e JavaScript. Use Tailwind CSS via CDN (https://cdn.tailwindcss.com) para estilização incrível e Lucide Icons (https://unpkg.com/lucide@latest) para ícones modernos. Crie páginas ricas em seções, com imagens ilustrativas bonitas do Unsplash, tipografia impecável, seções bem estruturadas (Hero, Benefícios, Galeria/Portfolio, Depoimentos, Preços, FAQ e Contato), e interatividade real via JS para abrir modais, validar formulários e alternar abas.`;

function buildUserMessage(prompt: string): string {
  return `Crie um site de página única (SPA) completo, bonito e interativo baseado neste prompt de usuário: "${prompt}".\n\nRetorne APENAS um JSON válido com estes campos (sem markdown, sem \`\`\`):\n{"html": "...", "css": "...", "js": "...", "explanation": "..."}`;
}

function buildRefineMessage(instruction: string, html: string, css: string, js: string): string {
  return `Atualize o site que criamos anteriormente de acordo com as seguintes instruções: "${instruction}".\n\nCódigo atual:\n--- HTML ---\n${html}\n\n--- CSS ---\n${css}\n\n--- JS ---\n${js}\n\nRetorne APENAS um JSON válido com estes campos (sem markdown, sem \`\`\`):\n{"html": "...", "css": "...", "js": "...", "explanation": "..."}`;
}

function parseAIResponse(content: string): GenerateResult {
  let cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  // Try to find JSON in the response
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  const data = JSON.parse(cleaned);
  return {
    html: data.html || "",
    css: data.css || "",
    js: data.js || "",
    explanation: data.explanation || ""
  };
}

// Google Gemini
async function callGemini(apiKey: string, model: string, prompt: string): Promise<GenerateResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildUserMessage(prompt) }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: { temperature: 0.7, maxOutputTokens: 16384 }
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gemini API error ${res.status}`);
  }
  const result = await res.json();
  const content = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return parseAIResponse(content);
}

// Gemini refine
async function callGeminiRefine(apiKey: string, model: string, instruction: string, html: string, css: string, js: string): Promise<GenerateResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildRefineMessage(instruction, html, css, js) }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: { temperature: 0.7, maxOutputTokens: 16384 }
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gemini API error ${res.status}`);
  }
  const result = await res.json();
  const content = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return parseAIResponse(content);
}

// OpenAI-compatible (OpenAI, OpenRouter, DeepSeek, Groq, Mistral, xAI, Together, Fireworks, SambaNova, NVIDIA)
async function callOpenAICompatible(apiUrl: string, apiKey: string, model: string, prompt: string, extraHeaders?: Record<string, string>): Promise<GenerateResult> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
    ...extraHeaders
  };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserMessage(prompt) }
      ],
      temperature: 0.7,
      max_tokens: 16384,
      response_format: { type: "json_object" }
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }

  const result = await res.json();
  const content = result.choices?.[0]?.message?.content || "";
  return parseAIResponse(content);
}

// OpenAI-compatible refine
async function callOpenAICompatibleRefine(apiUrl: string, apiKey: string, model: string, instruction: string, html: string, css: string, js: string, extraHeaders?: Record<string, string>): Promise<GenerateResult> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
    ...extraHeaders
  };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildRefineMessage(instruction, html, css, js) }
      ],
      temperature: 0.7,
      max_tokens: 16384,
      response_format: { type: "json_object" }
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }

  const result = await res.json();
  const content = result.choices?.[0]?.message?.content || "";
  return parseAIResponse(content);
}

// Anthropic (Claude) - CORS may not work from browser
async function callAnthropic(apiKey: string, model: string, prompt: string): Promise<GenerateResult> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model,
      max_tokens: 16384,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserMessage(prompt) }]
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Anthropic API error ${res.status}`);
  }
  const result = await res.json();
  const content = result.content?.[0]?.text || "";
  return parseAIResponse(content);
}

async function callAnthropicRefine(apiKey: string, model: string, instruction: string, html: string, css: string, js: string): Promise<GenerateResult> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model,
      max_tokens: 16384,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildRefineMessage(instruction, html, css, js) }]
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Anthropic API error ${res.status}`);
  }
  const result = await res.json();
  const content = result.content?.[0]?.text || "";
  return parseAIResponse(content);
}

const PROVIDER_API_URLS: Record<string, string> = {
  "openai": "https://api.openai.com/v1/chat/completions",
  "openrouter": "https://openrouter.ai/api/v1/chat/completions",
  "deepseek": "https://api.deepseek.com/v1/chat/completions",
  "mistral": "https://api.mistral.ai/v1/chat/completions",
  "groq": "https://api.groq.com/openai/v1/chat/completions",
  "xai": "https://api.x.ai/v1/chat/completions",
  "together": "https://api.together.xyz/v1/chat/completions",
  "sambanova": "https://api.sambanova.ai/v1/chat/completions",
  "nvidia-nim": "https://integrate.api.nvidia.com/v1/chat/completions",
  "fireworks": "https://api.fireworks.ai/inference/v1/chat/completions",
};

export async function generateSite(
  provider: string,
  model: string,
  apiKey: string,
  prompt: string
): Promise<GenerateResult> {
  if (provider === "google-ai") {
    return callGemini(apiKey, model, prompt);
  }
  if (provider === "anthropic") {
    return callAnthropic(apiKey, model, prompt);
  }
  const apiUrl = PROVIDER_API_URLS[provider];
  if (!apiUrl) {
    throw new Error(`Provedor "${provider}" não suportado ainda.`);
  }
  const extraHeaders: Record<string, string> = {};
  if (provider === "openrouter") {
    extraHeaders["HTTP-Referer"] = window.location.origin;
    extraHeaders["X-Title"] = "NoCode Creator";
  }
  return callOpenAICompatible(apiUrl, apiKey, model, prompt, extraHeaders);
}

export async function refineSite(
  provider: string,
  model: string,
  apiKey: string,
  instruction: string,
  html: string,
  css: string,
  js: string
): Promise<GenerateResult> {
  if (provider === "google-ai") {
    return callGeminiRefine(apiKey, model, instruction, html, css, js);
  }
  if (provider === "anthropic") {
    return callAnthropicRefine(apiKey, model, instruction, html, css, js);
  }
  const apiUrl = PROVIDER_API_URLS[provider];
  if (!apiUrl) {
    throw new Error(`Provedor "${provider}" não suportado ainda.`);
  }
  const extraHeaders: Record<string, string> = {};
  if (provider === "openrouter") {
    extraHeaders["HTTP-Referer"] = window.location.origin;
    extraHeaders["X-Title"] = "NoCode Creator";
  }
  return callOpenAICompatibleRefine(apiUrl, apiKey, model, instruction, html, css, js, extraHeaders);
}
