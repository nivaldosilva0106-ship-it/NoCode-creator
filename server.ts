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
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt é obrigatório." });
  }

  const config = loadConfig();
  
  // Retrieve Google AI key from new map or fallback key
  let apiKeyToUse = (config.apiKeys && config.apiKeys["google-ai"]) || config.customApiKey || process.env.GEMINI_API_KEY;
  
  if (!apiKeyToUse) {
    try {
      console.log("Nenhuma chave de API configurada. Utilizando o Gerador de Alta Fidelidade Local.");
      const { generateFallbackSite } = await import("./src/data/fallbackGenerator");
      const fallbackResult = generateFallbackSite(prompt);
      return res.json(fallbackResult);
    } catch (fallbackError) {
      console.error("Erro ao rodar gerador local:", fallbackError);
      return res.status(500).json({ 
        error: "Nenhuma chave de API do Gemini configurada. Forneça uma chave de API no Painel Administrativo ou configure a variável de ambiente GEMINI_API_KEY." 
      });
    }
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKeyToUse,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });

    const targetModel = config.model || "gemini-3.5-flash";

    console.log(`Chamando Gemini com o modelo ${targetModel} para o prompt: "${prompt}"`);

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Crie um site de página única (SPA) completo, bonito e interativo baseado neste prompt de usuário: "${prompt}".\n\nRetorne as respostas no formato JSON com os campos exatamente definidos.`
            }
          ]
        }
      ],
      config: {
        systemInstruction: config.systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            html: {
              type: Type.STRING,
              description: "O código HTML completo do index.html. Deve conter Tailwind CSS via CDN (<script src='https://cdn.tailwindcss.com'></script>), Lucide Icons via CDN (<script src='https://unpkg.com/lucide@latest'></script> ou outra biblioteca de ícones) e todas as seções necessárias (ex: Hero, Recursos, Sobre, Contato)."
            },
            css: {
              type: Type.STRING,
              description: "Código CSS customizado de suporte para animações, degradês avançados ou correções de visual."
            },
            js: {
              type: Type.STRING,
              description: "Código JavaScript para adicionar interatividade real como toggles de abas, exibição de modais, feedback em formulários ou sliders."
            },
            explanation: {
              type: Type.STRING,
              description: "Uma explicação curta das principais seções e recursos criados neste projeto, escrita em português."
            }
          },
          required: ["html", "css", "js", "explanation"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("O modelo não retornou conteúdo textual válido.");
    }

    const data = JSON.parse(responseText.trim());

    // Auto-save to Supabase if connected
    try {
      if (supabaseUrl && supabaseKey) {
        await supabase.from("projects").insert([{
          prompt,
          html: data.html || "",
          css: data.css || "",
          js: data.js || "",
          explanation: data.explanation || ""
        }]);
        console.log("[Supabase] Projeto salvo automaticamente após geração.");
      }
    } catch (saveErr) {
      console.error("[Supabase] Erro ao salvar projeto:", saveErr);
    }

    res.json(data);

  } catch (error: any) {
    console.error("Erro na chamada da API do Gemini:", error);
    res.status(500).json({ 
      error: "Falha na geração do site pelo Gemini.", 
      details: error.message || error 
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
    const { data, error } = await supabase.from("projects").select("count").limit(1);
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
