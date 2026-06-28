import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to data config
const CONFIG_PATH = path.join(process.cwd(), "src", "data", "config.json");

// Supabase Server Client (uses service role key for server-side operations)
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to load configurations
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
  }
  return {
    model: "gemini-3.5-flash",
    systemInstruction: "Você é o NoCode Creator, um desenvolvedor front-end de elite que cria sites de página única (SPA) modernos, responsivos e extremamente elegantes em HTML5, CSS3 e JavaScript. Use Tailwind CSS via CDN (https://cdn.tailwindcss.com) para estilização incrível e Lucide Icons (https://unpkg.com/lucide@latest) para ícones modernos. Crie páginas ricas em seções, com imagens ilustrativas bonitas do Unsplash, tipografia impecável, seções bem estruturadas (Hero, Benefícios, Galeria/Portfolio, Depoimentos, Preços, FAQ e Contato), e interatividade real via JS para abrir modais, validar formulários e alternar abas.",
    customApiKey: ""
  };
}

// Helper to save configurations
function saveConfig(config: any) {
  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    return false;
  }
}

// ----------------------------------------------------
// API ENDPOINTS
// ----------------------------------------------------

// Get current config
app.get("/api/config", (req, res) => {
  const config = loadConfig();
  
  // Mask all API keys in apiKeys map
  const maskedApiKeys: Record<string, string> = {};
  if (config.apiKeys) {
    for (const [provider, key] of Object.entries(config.apiKeys)) {
      if (key && typeof key === "string" && key.trim() !== "") {
        maskedApiKeys[provider] = "••••••••••••••••";
      }
    }
  }

  // Mask customApiKey for security
  const maskedConfig = {
    ...config,
    apiKeys: maskedApiKeys,
    hasCustomApiKey: !!config.customApiKey,
    customApiKey: config.customApiKey ? "••••••••••••••••" : ""
  };
  res.json(maskedConfig);
});

// Update config
app.post("/api/config", (req, res) => {
  const { 
    activeProvider, 
    activeModel, 
    customModelInput, 
    model, 
    systemInstruction, 
    apiKeys, 
    savedProviders 
  } = req.body;
  
  const currentConfig = loadConfig();

  if (activeProvider !== undefined) currentConfig.activeProvider = activeProvider;
  if (activeModel !== undefined) currentConfig.activeModel = activeModel;
  if (customModelInput !== undefined) currentConfig.customModelInput = customModelInput;
  if (model !== undefined) currentConfig.model = model;
  if (systemInstruction !== undefined) currentConfig.systemInstruction = systemInstruction;
  
  // Update apiKeys map, ensuring we do not overwrite actual keys with masks
  if (apiKeys && typeof apiKeys === "object") {
    if (!currentConfig.apiKeys) {
      currentConfig.apiKeys = {};
    }
    for (const [prov, val] of Object.entries(apiKeys)) {
      if (val !== undefined && val !== "••••••••••••••••" && val !== "") {
        currentConfig.apiKeys[prov] = val;
      }
    }
  }

  if (savedProviders !== undefined) {
    currentConfig.savedProviders = savedProviders;
  }

  // Fallback sync for legacy keys
  if (currentConfig.apiKeys && currentConfig.apiKeys["google-ai"]) {
    currentConfig.customApiKey = currentConfig.apiKeys["google-ai"];
  }

  const success = saveConfig(currentConfig);
  if (success) {
    res.json({ status: "success", message: "Configurações atualizadas com sucesso!" });
  } else {
    res.status(500).json({ error: "Falha ao salvar configurações no servidor." });
  }
});

// Reset config
app.post("/api/reset-config", (req, res) => {
  const defaultConfig = {
    model: "gemini-3.5-flash",
    activeProvider: "google-ai",
    activeModel: "gemini-3.5-flash",
    apiKeys: {},
    savedProviders: [],
    systemInstruction: "Você é o NoCode Creator, um desenvolvedor front-end de elite que cria sites de página única (SPA) modernos, responsivos e extremamente elegantes em HTML5, CSS3 e JavaScript. Use Tailwind CSS via CDN (https://cdn.tailwindcss.com) para estilização incrível e Lucide Icons (https://unpkg.com/lucide@latest) para ícones modernos. Crie páginas ricas em seções, com imagens ilustrativas bonitas do Unsplash, tipografia impecável, seções bem estruturadas (Hero, Benefícios, Galeria/Portfolio, Depoimentos, Preços, FAQ e Contato), e interatividade real via JS para abrir modais, validar formulários e alternar abas.",
    customApiKey: ""
  };
  const success = saveConfig(defaultConfig);
  if (success) {
    res.json({ status: "success", message: "Configurações restauradas para o padrão." });
  } else {
    res.status(500).json({ error: "Falha ao resetar configurações." });
  }
});

// Generate website based on prompt
app.post("/api/generate", async (req, res) => {
  const { prompt, provider, model: requestedModel } = req.body;
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt é obrigatório." });
  }

  // Read config from Supabase (primary) or local file (fallback)
  let config: any = {};
  try {
    const { data } = await supabase
      .from("user_configs")
      .select("*")
      .eq("user_id", "default")
      .maybeSingle();
    if (data) {
      config = {
        activeProvider: data.active_provider,
        activeModel: data.active_model,
        apiKeys: data.api_keys || {},
        systemInstruction: data.system_instruction || "",
        model: data.active_model
      };
    } else {
      config = loadConfig();
    }
  } catch {
    config = loadConfig();
  }

  const activeProvider = provider || config.activeProvider || "google-ai";
  const activeModel = requestedModel || config.activeModel || config.model || "gemini-3.5-flash";
  const apiKeys = config.apiKeys || {};
  const systemInstruction = config.systemInstruction || "";

  const userMessage = `Crie um site de página única (SPA) completo, bonito e interativo baseado neste prompt de usuário: "${prompt}".\n\nRetorne as respostas no formato JSON com os campos exatamente definidos.`;

  const jsonSchema = `\n\nRetorne APENAS um JSON válido com estes campos (sem markdown, sem \`\`\`):
{
  "html": "O código HTML completo...",
  "css": "Código CSS customizado...",
  "js": "Código JavaScript para interatividade...",
  "explanation": "Explicação curta do que foi criado..."
}`;

  try {
    let responseData: any;

    // 1. Google AI (Gemini) - uses SDK
    if (activeProvider === "google-ai") {
      const apiKey = apiKeys["google-ai"] || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        const { generateFallbackSite } = await import("./src/data/fallbackGenerator");
        return res.json(generateFallbackSite(prompt));
      }
      const ai = new GoogleGenAI({ apiKey });
      console.log(`[Gemini] Model: ${activeModel}`);
      const response = await ai.models.generateContent({
        model: activeModel,
        contents: [{ role: "user", parts: [{ text: userMessage + jsonSchema }] }],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              html: { type: Type.STRING },
              css: { type: Type.STRING },
              js: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["html", "css", "js", "explanation"]
          }
        }
      });
      const text = response.text;
      if (!text) throw new Error("Gemini não retornou conteúdo.");
      responseData = JSON.parse(text.trim());

    // 2. Anthropic (Claude) - different API format
    } else if (activeProvider === "anthropic") {
      const apiKey = apiKeys["anthropic"];
      if (!apiKey) throw new Error("Chave de API da Anthropic não configurada.");
      console.log(`[Anthropic] Model: ${activeModel}`);
      const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: activeModel,
          max_tokens: 16384,
          system: systemInstruction,
          messages: [{ role: "user", content: userMessage + jsonSchema }]
        })
      });
      if (!apiRes.ok) {
        const err = await apiRes.json();
        throw new Error(err.error?.message || `Anthropic API error ${apiRes.status}`);
      }
      const result = await apiRes.json();
      const content = result.content?.[0]?.text || "";
      // Strip markdown code fences if present
      const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
      responseData = JSON.parse(cleaned);

    // 3. OpenAI-compatible providers (OpenAI, OpenRouter, Together, Groq, DeepSeek, Mistral, xAI, SambaNova, NVIDIA, Fireworks)
    } else {
      const providerApiUrls: Record<string, string> = {
        "openai": "https://api.openai.com/v1/chat/completions",
        "openrouter": "https://openrouter.ai/api/v1/chat/completions",
        "deepseek": "https://api.deepseek.com/v1/chat/completions",
        "mistral": "https://api.mistral.ai/v1/chat/completions",
        "groq": "https://api.groq.com/openai/v1/chat/completions",
        "xai": "https://api.x.ai/v1/chat/completions",
        "together": "https://api.together.xyz/v1/chat/completions",
        "cohere": "https://api.cohere.com/v2/chat",
        "sambanova": "https://api.sambanova.ai/v1/chat/completions",
        "nvidia-nim": "https://integrate.api.nvidia.com/v1/chat/completions",
        "fireworks": "https://api.fireworks.ai/inference/v1/chat/completions",
        "huggingface": "https://api-inference.huggingface.co/models/",
      };

      const apiUrl = providerApiUrls[activeProvider];
      if (!apiUrl) {
        throw new Error(`Provedor "${activeProvider}" não suportado ainda. Use Gemini, Anthropic ou um provedor OpenAI-compatível.`);
      }

      const apiKey = apiKeys[activeProvider];
      if (!apiKey) throw new Error(`Chave de API para ${activeProvider} não configurada.`);

      console.log(`[${activeProvider}] Model: ${activeModel}`);

      let body: any;
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      };

      if (activeProvider === "openrouter") {
        headers["HTTP-Referer"] = "https://nocode-creator.app";
        headers["X-Title"] = "NoCode Creator";
      }

      if (activeProvider === "cohere") {
        // Cohere v2 chat format
        body = {
          model: activeModel,
          messages: [{ role: "user", content: userMessage + jsonSchema }],
          stream: false,
          response_format: { type: "json_object" }
        };
      } else {
        body = {
          model: activeModel,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userMessage + jsonSchema }
          ],
          temperature: 0.7,
          max_tokens: 16384
        };
        // Some providers support response_format
        if (["openai", "openrouter", "deepseek", "groq", "together", "xai", "fireworks"].includes(activeProvider)) {
          body.response_format = { type: "json_object" };
        }
      }

      const apiRes = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });

      if (!apiRes.ok) {
        const err = await apiRes.json().catch(() => ({}));
        throw new Error(err.error?.message || err.message || `API error ${apiRes.status}`);
      }

      const result = await apiRes.json();

      // Extract content - different providers have different response shapes
      let content = "";
      if (result.choices?.[0]?.message?.content) {
        content = result.choices[0].message.content;
      } else if (result.message?.content) {
        content = result.message.content;
      } else if (result.content?.[0]?.text) {
        content = result.content[0].text;
      } else if (typeof result.text === "string") {
        content = result.text;
      } else {
        throw new Error("Formato de resposta não reconhecido do provedor.");
      }

      // Strip markdown code fences if present
      const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
      responseData = JSON.parse(cleaned);
    }

    // Auto-save to Supabase
    try {
      if (supabaseUrl && supabaseKey) {
        await supabase.from("projects").insert([{
          prompt,
          html: responseData.html || "",
          css: responseData.css || "",
          js: responseData.js || "",
          explanation: responseData.explanation || ""
        }]);
      }
    } catch (saveErr) {
      console.error("[Supabase] Erro ao salvar projeto:", saveErr);
    }

    res.json(responseData);

  } catch (error: any) {
    console.error(`Erro na chamada da API (${activeProvider}):`, error);
    res.status(500).json({
      error: `Falha na geração pelo provedor ${activeProvider}.`,
      details: error.message || String(error)
    });
  }
});

// ----------------------------------------------------
// SUPABASE ENDPOINTS
// ----------------------------------------------------

// Check Supabase connection status
app.get("/api/supabase/status", async (req, res) => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return res.json({ connected: false, error: "Credenciais Supabase não configuradas." });
    }
    const { data, error } = await supabase.from("projects").select("*", { count: "exact", head: true }).limit(1);
    if (error) {
      return res.json({ connected: false, error: error.message });
    }
    res.json({ connected: true, message: "Supabase conectado com sucesso!" });
  } catch (err: any) {
    res.json({ connected: false, error: err.message });
  }
});

// Save project to Supabase
app.post("/api/supabase/projects/save", async (req, res) => {
  try {
    const { prompt, html, css, js, explanation } = req.body;
    const { data, error } = await supabase
      .from("projects")
      .insert([{ prompt, html, css, js, explanation }])
      .select();
    if (error) throw error;
    res.json({ status: "success", project: data?.[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get projects from Supabase
app.get("/api/supabase/projects", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw error;
    res.json({ projects: data || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete project from Supabase
app.delete("/api/supabase/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
    res.json({ status: "success" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static assets or mount Vite dev server
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

initServer();
