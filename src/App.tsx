import { useState, useEffect, useRef, FormEvent, MouseEvent } from "react";
import JSZip from "jszip";
import { 
  Sparkles, 
  Settings, 
  Code, 
  Eye, 
  Folder, 
  FolderOpen,
  FolderClosed,
  File, 
  FileCode,
  ChevronRight, 
  Copy, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  ChevronDown, 
  Download, 
  Layers, 
  Cpu, 
  Key, 
  Sliders, 
  TrendingUp, 
  Clock, 
  ExternalLink,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Database,
  HelpCircle,
  X,
  Play,
  FileText,
  Plus,
  Mic,
  ArrowUp,
  LayoutDashboard,
  Brain,
  Coins,
  History,
  Trash2,
  AlertCircle,
  Send,
  MessageSquare,
  Bell,
  Zap,
  Share,
  Home,
  Globe,
  Lock,
  Filter,
  CheckCircle2,
  Award,
  Info,
  Maximize2,
  Palette,
  Search,
  Loader
} from "lucide-react";

// Types
interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
}

interface WebProject {
  prompt: string;
  html: string;
  css: string;
  js: string;
  explanation: string;
  timestamp: number;
  messages?: ChatMessage[];
}

interface FileTreeItem {
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileTreeItem[];
}

interface AIModel {
  id: string;
  name: string;
  isFree: boolean;
}

interface AIProvider {
  id: string;
  name: string;
  description: string;
  category: "Modelos Gerais (Texto + Código)" | "Agregadores (1 API → vários modelos)" | "Código / Geração de Aplicações" | "Modelos Open Source (Auto-hospedáveis)" | "Imagem / UI / Design" | "Voz" | "Embeddings / Pesquisa";
  models: AIModel[];
  placeholderKey: string;
  keyLabel: string;
}

const AI_PROVIDERS: AIProvider[] = [
  // 1. Modelos Gerais
  {
    id: "google-ai",
    name: "Google AI",
    description: "Gemini para texto, imagem e multimodal.",
    category: "Modelos Gerais (Texto + Código)",
    placeholderKey: "Chave do Google AI Studio (GEMINI_API_KEY)",
    keyLabel: "Gemini API Key",
    models: [
      { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash (Recomendado - Ultrarrápido)", isFree: true },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", isFree: true },
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (Extremamente preciso)", isFree: false },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (Legado rápido)", isFree: true },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Legado preciso)", isFree: false }
    ]
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT para chat, geração de código, agentes e multimodal.",
    category: "Modelos Gerais (Texto + Código)",
    placeholderKey: "Chave da OpenAI (sk-...)",
    keyLabel: "OpenAI API Key",
    models: [
      { id: "gpt-4o-mini", name: "GPT-4o Mini (Rápido e Baixo Custo)", isFree: false },
      { id: "gpt-4o", name: "GPT-4o (Alta Performance)", isFree: false },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", isFree: false },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", isFree: false },
      { id: "o1-mini", name: "o1-mini (Raciocínio para Códigos)", isFree: false },
      { id: "o1-preview", name: "o1-preview", isFree: false }
    ]
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude para programação, escrita e raciocínio.",
    category: "Modelos Gerais (Texto + Código)",
    placeholderKey: "Chave da Anthropic (sk-ant-...)",
    keyLabel: "Anthropic Key",
    models: [
      { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet (Excelente p/ Programação)", isFree: false },
      { id: "claude-3-5-haiku", name: "Claude 3.5 Haiku", isFree: false },
      { id: "claude-3-opus", name: "Claude 3 Opus", isFree: false }
    ]
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    description: "Modelos focados em código e raciocínio.",
    category: "Modelos Gerais (Texto + Código)",
    placeholderKey: "Chave da DeepSeek (sk-...)",
    keyLabel: "DeepSeek Key",
    models: [
      { id: "deepseek-coder", name: "DeepSeek-Coder (Ideal para Programar)", isFree: false },
      { id: "deepseek-chat", name: "DeepSeek-V3 (Texto e Chat)", isFree: false },
      { id: "deepseek-r1", name: "DeepSeek-R1 (Raciocínio Forte)", isFree: false }
    ]
  },
  {
    id: "xai",
    name: "xAI",
    description: "Grok para busca interativa em tempo real.",
    category: "Modelos Gerais (Texto + Código)",
    placeholderKey: "Chave da xAI (Grok Key)",
    keyLabel: "xAI API Key",
    models: [
      { id: "grok-2", name: "Grok 2", isFree: false },
      { id: "grok-beta", name: "Grok Beta", isFree: false }
    ]
  },
  {
    id: "mistral",
    name: "Mistral AI",
    description: "Modelos europeus rápidos e abertos.",
    category: "Modelos Gerais (Texto + Código)",
    placeholderKey: "Chave da Mistral AI",
    keyLabel: "Mistral API Key",
    models: [
      { id: "mistral-large-latest", name: "Mistral Large", isFree: false },
      { id: "codestral-latest", name: "Codestral (Programação)", isFree: false },
      { id: "mistral-small-latest", name: "Mistral Small", isFree: false }
    ]
  },
  {
    id: "cohere",
    name: "Cohere",
    description: "Geração de texto, busca semântica e embeddings.",
    category: "Modelos Gerais (Texto + Código)",
    placeholderKey: "Chave da Cohere (api-...)",
    keyLabel: "Cohere Key",
    models: [
      { id: "command-r-plus", name: "Command R+", isFree: false },
      { id: "command-r", name: "Command R", isFree: false }
    ]
  },
  {
    id: "ai21",
    name: "AI21 Labs",
    description: "Modelos de linguagem robustos.",
    category: "Modelos Gerais (Texto + Código)",
    placeholderKey: "Chave da AI21 Labs",
    keyLabel: "AI21 API Key",
    models: [
      { id: "jamba-instruct", name: "Jamba Instruct", isFree: false }
    ]
  },
  {
    id: "writer",
    name: "Writer",
    description: "IA corporativa para produtividade.",
    category: "Modelos Gerais (Texto + Código)",
    placeholderKey: "Chave da Writer AI",
    keyLabel: "Writer API Key",
    models: [
      { id: "palmyra-x-v3", name: "Palmyra-X v3", isFree: false }
    ]
  },
  {
    id: "aleph-alpha",
    name: "Aleph Alpha",
    description: "Modelos europeus focados em conformidade.",
    category: "Modelos Gerais (Texto + Código)",
    placeholderKey: "Chave da Aleph Alpha",
    keyLabel: "Aleph Alpha Key",
    models: [
      { id: "luminous-supreme", name: "Luminous Supreme", isFree: false }
    ]
  },
  {
    id: "amazon-bedrock",
    name: "Amazon Bedrock",
    description: "Acesso unificado a múltiplos modelos na nuvem AWS.",
    category: "Modelos Gerais (Texto + Código)",
    placeholderKey: "AWS Credentials JSON",
    keyLabel: "AWS Bedrock Config",
    models: [
      { id: "bedrock-claude-3-5", name: "Anthropic Claude 3.5 (Bedrock)", isFree: false },
      { id: "bedrock-llama-3-1", name: "Meta Llama 3.1 (Bedrock)", isFree: false }
    ]
  },
  {
    id: "azure-ai",
    name: "Microsoft Azure AI",
    description: "Modelos hospedados na nuvem Azure corporativa.",
    category: "Modelos Gerais (Texto + Código)",
    placeholderKey: "Azure Endpoint Key",
    keyLabel: "Azure API Key",
    models: [
      { id: "azure-gpt-4o", name: "Azure GPT-4o", isFree: false },
      { id: "azure-gpt-4o-mini", name: "Azure GPT-4o Mini", isFree: false }
    ]
  },

  // 2. Agregadores
  {
    id: "openrouter",
    name: "OpenRouter",
    description: "Interface única de API para mais de 100 modelos.",
    category: "Agregadores (1 API → vários modelos)",
    placeholderKey: "Chave OpenRouter (sk-or-...)",
    keyLabel: "OpenRouter Key",
    models: [
      { id: "meta-llama/llama-3.1-8b-instruct:free", name: "Llama 3.1 8B Instruct (Gratuito)", isFree: true },
      { id: "google/gemma-2-9b-it:free", name: "Gemma 2 9B Instruct (Gratuito)", isFree: true },
      { id: "qwen/qwen-2-7b-instruct:free", name: "Qwen 2 7B Instruct (Gratuito)", isFree: true },
      { id: "openrouter-auto", name: "Auto-routing (Escolha Automática)", isFree: false },
      { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet (OpenRouter)", isFree: false }
    ]
  },
  {
    id: "together",
    name: "Together AI",
    description: "Invocação de modelos open source rápidos.",
    category: "Agregadores (1 API → vários modelos)",
    placeholderKey: "Chave Together AI",
    keyLabel: "Together Key",
    models: [
      { id: "meta-llama/Meta-Llama-3.1-8B-Instruct", name: "Llama 3.1 8B (Together)", isFree: false },
      { id: "meta-llama/Meta-Llama-3.1-70B-Instruct", name: "Llama 3.1 70B (Together)", isFree: false }
    ]
  },
  {
    id: "fireworks",
    name: "Fireworks AI",
    description: "Infraestrutura de modelos ultra rápidos.",
    category: "Agregadores (1 API → vários modelos)",
    placeholderKey: "Chave Fireworks AI",
    keyLabel: "Fireworks Key",
    models: [
      { id: "accounts/fireworks/models/llama-v3p1-8b-instruct", name: "Llama 3.1 8B (Fireworks)", isFree: false },
      { id: "accounts/fireworks/models/llama-v3p1-70b-instruct", name: "Llama 3.1 70B (Fireworks)", isFree: false }
    ]
  },
  {
    id: "groq",
    name: "Groq",
    description: "Velocidade estrondosa de LPU para modelos abertos.",
    category: "Agregadores (1 API → vários modelos)",
    placeholderKey: "Chave do Groq (gsk_...)",
    keyLabel: "Groq API Key",
    models: [
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B (Gratuito na Groq)", isFree: true },
      { id: "llama-3.1-70b-versatile", name: "Llama 3.1 70B (Gratuito na Groq)", isFree: true },
      { id: "gemma2-9b-it", name: "Gemma 2 9B (Gratuito na Groq)", isFree: true },
      { id: "mixtral-8x7b-instruct", name: "Mixtral 8x7B (Gratuito na Groq)", isFree: true }
    ]
  },
  {
    id: "replicate",
    name: "Replicate",
    description: "Rode modelos complexos na nuvem via API.",
    category: "Agregadores (1 API → vários modelos)",
    placeholderKey: "Chave do Replicate",
    keyLabel: "Replicate Key",
    models: [
      { id: "replicate-llama-3", name: "Meta Llama 3 70B (Replicate)", isFree: false }
    ]
  },
  {
    id: "fal-ai",
    name: "Fal AI",
    description: "Inovação de mídia em tempo real e imagens ultra rápidas.",
    category: "Agregadores (1 API → vários modelos)",
    placeholderKey: "Chave Fal AI (fal_...)",
    keyLabel: "Fal AI Key",
    models: [
      { id: "fal-sdxl-fast", name: "SDXL Fast Generator", isFree: false }
    ]
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    description: "O maior ecossistema de modelos de código aberto.",
    category: "Agregadores (1 API → vários modelos)",
    placeholderKey: "HF Token (hf_...)",
    keyLabel: "HF Token",
    models: [
      { id: "meta-llama/Meta-Llama-3-8B-Instruct", name: "Llama 3 8B (Serverless Free)", isFree: true },
      { id: "Qwen/Qwen2.5-72B-Instruct", name: "Qwen 2.5 72B (Serverless Free)", isFree: true }
    ]
  },
  {
    id: "cloudflare-workers",
    name: "Cloudflare Workers AI",
    description: "Modelos distribuídos na rede global Edge.",
    category: "Agregadores (1 API → vários modelos)",
    placeholderKey: "Cloudflare Account Token",
    keyLabel: "CF Token",
    models: [
      { id: "llama-3-8b-instruct", name: "Llama 3 8B (Workers Edge)", isFree: false }
    ]
  },
  {
    id: "sambanova",
    name: "SambaNova Cloud",
    description: "Foco em velocidade extrema para modelos 405B.",
    category: "Agregadores (1 API → vários modelos)",
    placeholderKey: "Chave SambaNova",
    keyLabel: "SambaNova Key",
    models: [
      { id: "Meta-Llama-3.1-8B-Instruct", name: "Llama 3.1 8B (Gratuito)", isFree: true },
      { id: "Meta-Llama-3.1-70B-Instruct", name: "Llama 3.1 70B (Gratuito)", isFree: true },
      { id: "Meta-Llama-3.1-405B-Instruct", name: "Llama 3.1 405B (Avançado)", isFree: false }
    ]
  },
  {
    id: "nvidia-nim",
    name: "NVIDIA NIM",
    description: "Aceleração de microserviços de IA corporativos.",
    category: "Agregadores (1 API → vários modelos)",
    placeholderKey: "NVIDIA API Key",
    keyLabel: "NIM Key",
    models: [
      { id: "nvidia-llama-3-1-70b", name: "Llama 3.1 70B NIM", isFree: false }
    ]
  },

  // 3. Código
  {
    id: "codeium",
    name: "Codeium",
    description: "Copiloto inteligente e autocompletes de código.",
    category: "Código / Geração de Aplicações",
    placeholderKey: "Codeium Personal Token",
    keyLabel: "Codeium Token",
    models: [
      { id: "codeium-chat", name: "Codeium Code Chat", isFree: true }
    ]
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "IDE focado em desenvolvimento auxiliado por IA.",
    category: "Código / Geração de Aplicações",
    placeholderKey: "Cursor API Key",
    keyLabel: "Cursor Key",
    models: [
      { id: "cursor-small", name: "Cursor Small (Fast)", isFree: false },
      { id: "cursor-pro", name: "Cursor Pro (Custom GPT)", isFree: false }
    ]
  },
  {
    id: "bolt-ai",
    name: "Bolt",
    description: "Geração de aplicações inteiras na Web.",
    category: "Código / Geração de Aplicações",
    placeholderKey: "Bolt Key",
    keyLabel: "Bolt Key",
    models: [
      { id: "bolt-v1", name: "Bolt Build v1", isFree: false }
    ]
  },
  {
    id: "lovable",
    name: "Lovable",
    description: "Geração de apps, mockups e código do zero.",
    category: "Código / Geração de Aplicações",
    placeholderKey: "Lovable Token",
    keyLabel: "Lovable Key",
    models: [
      { id: "lovable-gpt-4o", name: "Lovable Full Stack Engine", isFree: false }
    ]
  },
  {
    id: "replit-ai",
    name: "Replit AI",
    description: "Replit Agent para construir e implantar.",
    category: "Código / Geração de Aplicações",
    placeholderKey: "Replit API Key",
    keyLabel: "Replit Key",
    models: [
      { id: "replit-agent-v2", name: "Replit Agent v2", isFree: false }
    ]
  },
  {
    id: "cody",
    name: "Sourcegraph Cody",
    description: "Busca semântica avançada em código corporativo.",
    category: "Código / Geração de Aplicações",
    placeholderKey: "Sourcegraph Access Token",
    keyLabel: "Cody Token",
    models: [
      { id: "cody-claude-3-5", name: "Cody Claude 3.5", isFree: false }
    ]
  },
  {
    id: "tabnine",
    name: "Tabnine",
    description: "Segurança de código privada e autocomplete local.",
    category: "Código / Geração de Aplicações",
    placeholderKey: "Tabnine License Key",
    keyLabel: "Tabnine Key",
    models: [
      { id: "tabnine-chat", name: "Tabnine Chat Model", isFree: false }
    ]
  },

  // 4. Modelos Open Source
  {
    id: "meta-ai",
    name: "Meta AI",
    description: "Família Llama de alta capacidade e código aberto.",
    category: "Modelos Open Source (Auto-hospedáveis)",
    placeholderKey: "Chave p/ Llama",
    keyLabel: "Meta Llama Access",
    models: [
      { id: "llama-3-1-8b", name: "Llama 3.1 8B (Open Source)", isFree: true },
      { id: "llama-3-1-70b", name: "Llama 3.1 70B (Open Source)", isFree: true },
      { id: "llama-3-1-405b", name: "Llama 3.1 405B (Open Source)", isFree: true }
    ]
  },
  {
    id: "qwen",
    name: "Qwen",
    description: "Modelos chineses líderes de raciocínio e código.",
    category: "Modelos Open Source (Auto-hospedáveis)",
    placeholderKey: "Qwen API Key",
    keyLabel: "Qwen Key",
    models: [
      { id: "qwen-2.5-coder-72b", name: "Qwen 2.5 Coder 72B (Código)", isFree: true },
      { id: "qwen-2.5-72b", name: "Qwen 2.5 72B (Linguagem)", isFree: true }
    ]
  },
  {
    id: "nous-research",
    name: "Nous Research",
    description: "Hermes refinado pela comunidade para alinhamento.",
    category: "Modelos Open Source (Auto-hospedáveis)",
    placeholderKey: "Nous Token",
    keyLabel: "Nous Key",
    models: [
      { id: "hermes-3-llama-3.1-8b", name: "Hermes 3 Llama 8B", isFree: true }
    ]
  },
  {
    id: "databricks",
    name: "Databricks",
    description: "DBRX focado em alta densidade empresarial.",
    category: "Modelos Open Source (Auto-hospedáveis)",
    placeholderKey: "Databricks Key",
    keyLabel: "DBRX Access",
    models: [
      { id: "dbrx-instruct", name: "DBRX Instruct", isFree: true }
    ]
  },
  {
    id: "stability-ai",
    name: "Stability AI",
    description: "Geração de imagem aberta por difusão latente.",
    category: "Modelos Open Source (Auto-hospedáveis)",
    placeholderKey: "Stability AI Key",
    keyLabel: "Stability Key",
    models: [
      { id: "stable-diffusion-3-5", name: "Stable Diffusion 3.5", isFree: false }
    ]
  },
  {
    id: "black-forest-labs",
    name: "Black Forest Labs",
    description: "FLUX.1 estado da arte de geração de imagens.",
    category: "Modelos Open Source (Auto-hospedáveis)",
    placeholderKey: "BFL Token",
    keyLabel: "FLUX Token",
    models: [
      { id: "flux-1-schnell", name: "FLUX.1 Schnell (Gratuito)", isFree: true },
      { id: "flux-1-dev", name: "FLUX.1 Dev (Pago)", isFree: false }
    ]
  },
  {
    id: "openchat",
    name: "OpenChat",
    description: "Modelos leves otimizados via RLHF.",
    category: "Modelos Open Source (Auto-hospedáveis)",
    placeholderKey: "OpenChat Key",
    keyLabel: "OpenChat Key",
    models: [
      { id: "openchat-3.5", name: "OpenChat 3.5", isFree: true }
    ]
  },

  // 5. Imagem
  {
    id: "ideogram",
    name: "Ideogram",
    description: "Fidelidade de texto impecável em imagens renderizadas.",
    category: "Imagem / UI / Design",
    placeholderKey: "Ideogram Key",
    keyLabel: "Ideogram Key",
    models: [
      { id: "ideogram-v2", name: "Ideogram v2", isFree: false }
    ]
  },
  {
    id: "leonardo-ai",
    name: "Leonardo AI",
    description: "Design de personagens e artes complexas.",
    category: "Imagem / UI / Design",
    placeholderKey: "Leonardo Key",
    keyLabel: "Leonardo Key",
    models: [
      { id: "leonardo-phoenix", name: "Leonardo Phoenix", isFree: false }
    ]
  },
  {
    id: "runway",
    name: "Runway",
    description: "Geração e edição de vídeo e mídia por IA.",
    category: "Imagem / UI / Design",
    placeholderKey: "Runway Account Token",
    keyLabel: "Runway Key",
    models: [
      { id: "gen-3-alpha", name: "Gen-3 Alpha", isFree: false }
    ]
  },
  {
    id: "adobe-firefly",
    name: "Adobe Firefly",
    description: "IA segura para direitos comerciais da Adobe.",
    category: "Imagem / UI / Design",
    placeholderKey: "Adobe Console Credentials",
    keyLabel: "Firefly Credentials",
    models: [
      { id: "firefly-image-v3", name: "Adobe Firefly Image v3", isFree: false }
    ]
  },
  {
    id: "canva-ai",
    name: "Canva AI",
    description: "Edições rápidas de layouts e designs de slides.",
    category: "Imagem / UI / Design",
    placeholderKey: "Canva Key",
    keyLabel: "Canva Token",
    models: [
      { id: "canva-design-ai", name: "Canva Assistant v2", isFree: false }
    ]
  },

  // 6. Voz
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description: "Clonagem de voz realista e sintonia de fala.",
    category: "Voz",
    placeholderKey: "ElevenLabs Key (xi-api-key)",
    keyLabel: "Eleven Key",
    models: [
      { id: "eleven-multilingual-v2", name: "Eleven Multilingual v2", isFree: false }
    ]
  },
  {
    id: "deepgram",
    name: "Deepgram",
    description: "Transcrição e conversão de fala em texto ultra rápida.",
    category: "Voz",
    placeholderKey: "Chave Deepgram",
    keyLabel: "Deepgram Key",
    models: [
      { id: "nova-2-general", name: "Nova-2 General Speech", isFree: false }
    ]
  },
  {
    id: "assemblyai",
    name: "AssemblyAI",
    description: "Modelos inteligentes de inteligência de áudio.",
    category: "Voz",
    placeholderKey: "Chave AssemblyAI",
    keyLabel: "AssemblyAI Key",
    models: [
      { id: "best-speech-model", name: "AssemblyAI Best Engine", isFree: false }
    ]
  },
  {
    id: "cartesia",
    name: "Cartesia",
    description: "Voz expressiva em menos de 100 milissegundos.",
    category: "Voz",
    placeholderKey: "Cartesia Key",
    keyLabel: "Cartesia Key",
    models: [
      { id: "sonic-english", name: "Sonic English", isFree: false }
    ]
  },

  // 7. Embeddings
  {
    id: "pinecone",
    name: "Pinecone",
    description: "Banco de dados vetorial gerenciado de alto desempenho.",
    category: "Embeddings / Pesquisa",
    placeholderKey: "Pinecone Key",
    keyLabel: "Pinecone Key",
    models: [
      { id: "pinecone-index", name: "Pinecone Serverless Index", isFree: false }
    ]
  },
  {
    id: "weaviate",
    name: "Weaviate",
    description: "Banco vetorial de código aberto estruturado.",
    category: "Embeddings / Pesquisa",
    placeholderKey: "Weaviate Cluster Key",
    keyLabel: "Weaviate Key",
    models: [
      { id: "weaviate-cloud", name: "Weaviate Cloud Instance", isFree: false }
    ]
  },
  {
    id: "qdrant",
    name: "Qdrant",
    description: "Motor de pesquisa vetorial robusto em Rust.",
    category: "Embeddings / Pesquisa",
    placeholderKey: "Qdrant Key",
    keyLabel: "Qdrant API Key",
    models: [
      { id: "qdrant-cloud", name: "Qdrant Cloud Instance", isFree: false }
    ]
  },
  {
    id: "milvus",
    name: "Milvus",
    description: "Banco de dados vetorial de escala massiva.",
    category: "Embeddings / Pesquisa",
    placeholderKey: "Milvus Endpoint Token",
    keyLabel: "Milvus Key",
    models: [
      { id: "milvus-cloud", name: "Milvus Cloud Managed", isFree: false }
    ]
  }
];

export default function App() {
  // Navigation State: 'home' | 'builder' | 'admin'
  const [activeTab, setActiveTab] = useState<"home" | "builder" | "admin">("home");
  
  // Dynamic typing/motivational state for header
  const typingPhrases = [
    "Vamos criar algo agora",
    "Já tens uma ideia do que queres criar?",
    "Qual é o teu próximo projeto?",
    "Cria o teu site PHP em segundos",
    "Peça ao Lovable para construir..."
  ];
  
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const fullPhrase = typingPhrases[currentPhraseIndex];

    if (!isDeleting) {
      timer = setTimeout(() => {
        setDisplayedText(fullPhrase.slice(0, displayedText.length + 1));
        // Natural typing speed variation
        setTypingSpeed(80 + Math.random() * 40);
      }, typingSpeed);

      if (displayedText === fullPhrase) {
        // Pause when full text is typed before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
          setTypingSpeed(35); // faster deletion
        }, 2500);
      }
    } else {
      timer = setTimeout(() => {
        setDisplayedText(fullPhrase.slice(0, displayedText.length - 1));
      }, typingSpeed);

      if (displayedText === "") {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % typingPhrases.length);
        setTypingSpeed(150); // small pause before starting next
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentPhraseIndex, typingSpeed]);

  // User credits with local persistence
  const [userCredits, setUserCredits] = useState<number>(() => {
    const saved = localStorage.getItem("nocode_user_credits");
    return saved ? parseInt(saved, 10) : 150;
  });

  useEffect(() => {
    localStorage.setItem("nocode_user_credits", userCredits.toString());
  }, [userCredits]);

  // Admin sub-tab selection state: 'dashboard' | 'ia' | 'credits' | 'projects'
  const [adminSubTab, setAdminSubTab] = useState<"dashboard" | "ia" | "credits" | "projects">("dashboard");
  
  // Prompt State
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  
  // Active Generated Project
  const [activeProject, setActiveProject] = useState<WebProject | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("index.php");
  const [selectedFileContent, setSelectedFileContent] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<"preview" | "code">("preview");
  const [viewportSize, setViewportSize] = useState<"desktop" | "laptop" | "tablet" | "mobile">("desktop");
  const [copiedFile, setCopiedFile] = useState(false);
  
  // File Tree expand/collapse state
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "src": true,
    "components": true,
    "assets": false,
    "hooks": false,
    "lib": false,
    "routes": false
  });

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  // Chat / Conversation History State and Ref
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Chat resize state
  const [chatWidth, setChatWidth] = useState<number>(30);
  const [isResizing, setIsResizing] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Chat recommendations/suggestions
  const [showRecommendations, setShowRecommendations] = useState(true);
  const recommendations = [
    { icon: MessageSquare, text: "Depoimentos", action: "Adicione uma seção de depoimentos com cards animados" },
    { icon: Palette, text: "Mudar cores", action: "Mude o esquema de cores para um design mais vibrante" },
    { icon: Smartphone, text: "Responsivo", action: "Otimize o site para todos os dispositivos móveis" },
    { icon: Zap, text: "Animações", action: "Adicione animações suaves ao rolar a página" },
    { icon: Search, text: "Melhorar SEO", action: "Adicione meta tags e otimize para mecanismos de busca" },
    { icon: Loader, text: "Loading screen", action: "Crie uma tela de carregamento animada" }
  ];

  const handleResizeStart = (e: MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidthPercent = (e.clientX / window.innerWidth) * 100;
        if (newWidthPercent >= 20 && newWidthPercent <= 45) {
          setChatWidth(newWidthPercent);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Synchronize chat messages with active project
  useEffect(() => {
    if (activeProject) {
      if (activeProject.messages && activeProject.messages.length > 0) {
        setChatMessages(activeProject.messages);
      } else {
        setChatMessages([
          {
            id: `msg-init-user-${activeProject.timestamp}`,
            sender: "user",
            text: activeProject.prompt,
            timestamp: activeProject.timestamp - 1000
          },
          {
            id: `msg-init-ai-${activeProject.timestamp}`,
            sender: "ai",
            text: activeProject.explanation || "Aqui está o seu site gerado com base no seu prompt.",
            timestamp: activeProject.timestamp
          }
        ]);
      }
    } else {
      setChatMessages([]);
    }
  }, [activeProject]);

  // Scroll chat to bottom on updates
  useEffect(() => {
    // Small timeout to ensure rendering is complete
    const timer = setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [chatMessages]);
  
  // refinement prompt
  const [refinePrompt, setRefinePrompt] = useState("");
  
  // Saved Projects history (local persistence)
  const [history, setHistory] = useState<WebProject[]>([]);
  
  // Server Config state
  const [apiConfig, setApiConfig] = useState({
    model: "gemini-3.5-flash",
    systemInstruction: "",
    hasCustomApiKey: false,
    customApiKey: ""
  });
  const [customKeyInput, setCustomKeyInput] = useState("");
  const [systemInstructionInput, setSystemInstructionInput] = useState("");
  const [modelSelect, setModelSelect] = useState("gemini-3.5-flash");
  
  // Advanced Multi-Provider AI Settings States
  const [activeProvider, setActiveProvider] = useState<string>("google-ai");
  const [activeModel, setActiveModel] = useState<string>("gemini-3.5-flash");
  const [customModelInput, setCustomModelInput] = useState<string>("");
  const [showCustomModelField, setShowCustomModelField] = useState<boolean>(false);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [savedProviders, setSavedProviders] = useState<string[]>([]);
  const [filterFreeOnly, setFilterFreeOnly] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Modelos Gerais (Texto + Código)");
  const [editingProvider, setEditingProvider] = useState<string>("google-ai");

  const handleSelectEditingProvider = (provId: string) => {
    setEditingProvider(provId);
    
    const hasKey = apiKeys[provId] || (provId === "google-ai" && apiConfig.hasCustomApiKey);
    setCustomKeyInput(hasKey ? "••••••••••••••••" : "");
    
    const provData = AI_PROVIDERS.find(p => p.id === provId);
    if (provData) {
      let currentModel = provId === activeProvider ? activeModel : (provData.models[0]?.id || "");
      const modelInList = provData.models.some(m => m.id === currentModel);
      if (currentModel && !modelInList) {
        setShowCustomModelField(true);
        setCustomModelInput(currentModel);
      } else {
        setShowCustomModelField(false);
        setActiveModel(currentModel || provData.models[0]?.id || "");
      }
    }
  };
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminStatusMsg, setAdminStatusMsg] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"unchecked" | "validating" | "success" | "error">("unchecked");
  const [connectionErrorMsg, setConnectionErrorMsg] = useState("");

  // Refs for auto scrolling log window
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompts
  const suggestions = [
    {
      title: "Landing Page de SaaS",
      desc: "Visual dark moderno, com pricing em grids, animações e FAQ sanfonado.",
      prompt: "Crie uma landing page de SaaS de automação de marketing por IA, com design cyberpunk roxo e preto, tabelas de preços interativas de plano anual/mensal, depoimentos em carrossel e seção de FAQ que expande com JavaScript."
    },
    {
      title: "E-Commerce de Café",
      desc: "Minimalista, rústico, com filtros de busca e carrinho reativo.",
      prompt: "Desenvolva uma loja online de cafés artesanais finos. Visual acolhedor em tons de marrom e bege. Deve conter grid de produtos, filtros funcionais em JS por categoria, modal flutuante de carrinho de compras e formulário de contato."
    },
    {
      title: "Portfolio de Fotógrafo",
      desc: "Elegante, focado em imagens, com galeria bento grid e contato.",
      prompt: "Crie um portfólio luxuoso para fotógrafo de moda. Fundo preto absoluto (#000000) com tipografia serifada fina. Galeria estilo bento-grid com fotos de exemplo do Unsplash, visualização em tela cheia ao clicar na foto (Lightbox JS) e formulário de agendamento."
    },
    {
      title: "Dashboard Financeiro",
      desc: "Profissional, com gráficos elegantes, tabelas e modo escuro.",
      prompt: "Crie um painel financeiro pessoal com simulação de saldos, transações em tabelas ordenáveis, widgets de despesas mensais e gráficos estilizados simulados usando divs e CSS puro de forma elegante e limpa."
    }
  ];

  // Load API config and History on mount
  useEffect(() => {
    fetchConfig();
    try {
      const savedHistory = localStorage.getItem("nocode_generator_history");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
        if (parsed.length > 0) {
          setActiveProject(parsed[0]);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar histórico local:", e);
    }
  }, []);

  // Update selected file content when active project or selected file changes
  useEffect(() => {
    if (activeProject) {
      const files = generatePHPFiles(activeProject);
      const matched = findFileContent(files, selectedFileName);
      setSelectedFileContent(matched || "");
    }
  }, [activeProject, selectedFileName]);

  // Scroll to bottom of logs when generating
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [generationLogs]);

  // Fetch server configuration
  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config");
      if (res.ok) {
        const data = await res.json();
        setApiConfig(data);
        setSystemInstructionInput(data.systemInstruction || "");
        
        // Multi-provider loading
        const provider = data.activeProvider || "google-ai";
        setActiveProvider(provider);
        
        const model = data.activeModel || data.model || "gemini-3.5-flash";
        setActiveModel(model);
        setModelSelect(model);
        
        const savedKeys = data.apiKeys || {};
        setApiKeys(savedKeys);
        
        setSavedProviders(data.savedProviders || []);
        setCustomModelInput(data.customModelInput || "");

        // Sync visual mask
        const providerKey = savedKeys[provider];
        if (providerKey) {
          setCustomKeyInput("••••••••••••••••");
        } else if (provider === "google-ai" && data.hasCustomApiKey) {
          setCustomKeyInput("••••••••••••••••");
        } else {
          setCustomKeyInput("");
        }

        // Determine if custom model field should be displayed
        const providerData = AI_PROVIDERS.find(p => p.id === provider);
        const modelInList = providerData?.models.some(m => m.id === model);
        if (model && providerData && !modelInList) {
          setShowCustomModelField(true);
          setCustomModelInput(model);
        } else {
          setShowCustomModelField(false);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar configurações do servidor:", error);
    }
  };

  // Save server configuration
  const handleSaveConfig = async (e: FormEvent) => {
    e.preventDefault();

    // Validar formato da chave se for o google-ai
    if (editingProvider === "google-ai") {
      const isApiKeyInvalid = customKeyInput !== "" && customKeyInput !== "••••••••••••••••" && !/^AIzaSy[A-Za-z0-9_-]{33}$/.test(customKeyInput.trim());
      if (isApiKeyInvalid) {
        setAdminStatusMsg("Erro: A chave de API do Gemini informada é inválida. Deve começar com 'AIzaSy'.");
        setTimeout(() => setAdminStatusMsg(""), 4000);
        return;
      }
    }

    setAdminSaving(true);
    setAdminStatusMsg("");
    try {
      const finalModel = showCustomModelField ? customModelInput.trim() : activeModel;
      
      const updatedKeys = { ...apiKeys };
      if (customKeyInput !== "" && customKeyInput !== "••••••••••••••••") {
        updatedKeys[editingProvider] = customKeyInput;
      }

      // Add to saved providers list if a key exists or is being saved
      let updatedSavedProviders = [...savedProviders];
      const hasKey = (customKeyInput !== "" && customKeyInput !== "••••••••••••••••") || apiKeys[editingProvider];
      if (hasKey && !updatedSavedProviders.includes(editingProvider)) {
        updatedSavedProviders.push(editingProvider);
      }

      // Automatically make editingProvider active when saving
      const nextActiveProvider = editingProvider;

      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeProvider: nextActiveProvider,
          activeModel: finalModel,
          customModelInput: showCustomModelField ? customModelInput : "",
          model: finalModel,
          systemInstruction: systemInstructionInput,
          apiKeys: updatedKeys,
          savedProviders: updatedSavedProviders
        })
      });

      if (res.ok) {
        setAdminStatusMsg(`Configurações de ${AI_PROVIDERS.find(p => p.id === editingProvider)?.name || editingProvider} salvas e ativadas!`);
        setActiveProvider(nextActiveProvider);
        fetchConfig();
        setTimeout(() => setAdminStatusMsg(""), 3000);
      } else {
        const data = await res.json();
        setAdminStatusMsg(`Erro: ${data.error || "Não foi possível salvar"}`);
      }
    } catch (error) {
      setAdminStatusMsg("Falha ao salvar configurações.");
    } finally {
      setAdminSaving(false);
    }
  };

  // Reset Server Config
  const handleResetConfig = async () => {
    if (confirm("Deseja realmente restaurar as configurações padrão?")) {
      setAdminSaving(true);
      try {
        const res = await fetch("/api/reset-config", { method: "POST" });
        if (res.ok) {
          setAdminStatusMsg("Configurações resetadas com sucesso!");
          fetchConfig();
          setTimeout(() => setAdminStatusMsg(""), 3000);
        }
      } catch (error) {
        setAdminStatusMsg("Erro ao restaurar configurações.");
      } finally {
        setAdminSaving(false);
      }
    }
  };

  // Test API Key status
  const handleTestConnection = async () => {
    setConnectionStatus("validating");
    setConnectionErrorMsg("");
    try {
      // We will perform a tiny test prompt generation with Gemini to see if the configured key is fully functional
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "teste rápido de conectividade. retorne o JSON solicitado." })
      });

      if (res.ok) {
        setConnectionStatus("success");
      } else {
        const data = await res.json();
        setConnectionStatus("error");
        setConnectionErrorMsg(data.error || "Falha ao validar chave ou resposta da API do Gemini.");
      }
    } catch (error: any) {
      setConnectionStatus("error");
      setConnectionErrorMsg(error.message || "Não foi possível conectar ao servidor.");
    }
  };

  // Generate Web Project
  const handleGenerate = async (promptText: string) => {
    if (!promptText.trim()) return;

    if (userCredits < 15) {
      alert("Créditos insuficientes! Você precisa de pelo menos 15 créditos para gerar um site. Vá para o Painel Admin para recarregar.");
      return;
    }

    setPromptInput(promptText);
    setIsGenerating(true);
    setGenerationStep(1);
    setGenerationLogs(["Iniciando mecanismo de geração NoCode...", "Preparando diretórios virtuais do projeto PHP..."]);
    setActiveTab("builder");

    // Interactive step simulations for user-friendly feel
    const stepDuration = 900;
    
    setTimeout(() => {
      setGenerationStep(2);
      setGenerationLogs(prev => [...prev, "✓ Estrutura MVC PHP inicializada.", "Analisando seu prompt para definir seções e estilização...", "Configurando Tailwind CSS e Lucide Icons para renderização responsiva..."]);
    }, stepDuration);

    setTimeout(() => {
      setGenerationStep(3);
      setGenerationLogs(prev => [...prev, "✓ Design pattern estruturado.", "Iniciando comunicação segura com o modelo Gemini API...", "Instruindo o modelo a gerar HTML semântico, JavaScript nativo e CSS de animação..."]);
    }, stepDuration * 2);

    setTimeout(() => {
      setGenerationLogs(prev => [...prev, "Aguardando retorno do modelo de IA (isso pode levar alguns segundos)...", "Escrevendo código limpo para os arquivos index.php e config.php..."]);
    }, stepDuration * 3);

    try {
      const startTime = Date.now();
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Falha na chamada da API.");
      }

      const responseData = await res.json();
      
      const elapsed = Math.max(0, 4500 - (Date.now() - startTime));
      // wait a bit so user can feel the creation steps if the request returned ultra fast
      await new Promise(resolve => setTimeout(resolve, elapsed));

      setGenerationStep(4);
      setGenerationLogs(prev => [
        ...prev, 
        "✓ Resposta recebida da API com sucesso!", 
        "Separando componentes PHP: Navbar.php, Footer.php, config.php, index.php.",
        "Compilando folha de estilos CSS personalizados...",
        "Validando interações dinâmicas e scripts JavaScript...",
        "✨ Geração concluída com sucesso! Carregando preview do site..."
      ]);

      const newProject: WebProject = {
        prompt: promptText,
        html: responseData.html || "<h1>Site Gerado</h1>",
        css: responseData.css || "",
        js: responseData.js || "",
        explanation: responseData.explanation || "Site gerado a partir do prompt do usuário.",
        timestamp: Date.now(),
        messages: [
          {
            id: `msg-gen-user-${Date.now()}`,
            sender: "user",
            text: promptText,
            timestamp: Date.now() - 1000
          },
          {
            id: `msg-gen-ai-${Date.now()}`,
            sender: "ai",
            text: responseData.explanation || "Aqui está o seu site gerado com base no seu prompt.",
            timestamp: Date.now()
          }
        ]
      };

      setActiveProject(newProject);
      setSelectedFileName("index.php");
      
      // Save to local history
      const updatedHistory = [newProject, ...history.filter(h => h.prompt !== promptText)].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem("nocode_generator_history", JSON.stringify(updatedHistory));

      // Deduct 15 credits on success
      setUserCredits(prev => Math.max(0, prev - 15));

    } catch (error: any) {
      console.error(error);
      setGenerationStep(-1);
      setGenerationLogs(prev => [
        ...prev, 
        "❌ ERRO CRÍTICO NA GERAÇÃO:", 
        error.message || "Erro desconhecido. Verifique suas configurações de API no Painel Administrativo ou tente novamente."
      ]);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 800);
    }
  };

  // Refine or modify existing project
  const handleRefine = async () => {
    if (!refinePrompt.trim() || !activeProject) return;

    if (userCredits < 10) {
      alert("Créditos insuficientes! Você precisa de pelo menos 10 créditos para refinar o site. Vá para o Painel Admin para recarregar.");
      return;
    }
    
    const originalProject = activeProject;
    const instruction = refinePrompt;
    setRefinePrompt("");
    setIsGenerating(true);
    setGenerationStep(1);
    setGenerationLogs([
      "Modificando projeto existente...",
      `Nova alteração solicitada: "${instruction}"`,
      "Enviando projeto anterior e novos requisitos para o Gemini..."
    ]);

    try {
      const combinedPrompt = `Atualize o site que criamos anteriormente de acordo com as seguintes instruções: "${instruction}".\n\n` +
        `Para sua referência, o código atual é composto de:\n` +
        `--- HTML Atual ---\n${originalProject.html}\n\n` +
        `--- CSS Atual ---\n${originalProject.css}\n\n` +
        `--- JS Atual ---\n${originalProject.js}\n\n` +
        `Retorne o código completo atualizado e modificado mantendo toda a estrutura que já funcionava e aplicando a nova alteração pedida.`;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: combinedPrompt })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Falha ao refinar o site.");
      }

      const responseData = await res.json();

      setGenerationStep(4);
      setGenerationLogs(prev => [
        ...prev,
        "✓ Alteração aplicada com sucesso!",
        "Re-dividindo arquivos PHP atualizados...",
        "Pronto! Atualizando visualização..."
      ]);

      const currentMsgs = originalProject.messages || [
        {
          id: `msg-init-user-${originalProject.timestamp}`,
          sender: "user",
          text: originalProject.prompt,
          timestamp: originalProject.timestamp - 1000
        },
        {
          id: `msg-init-ai-${originalProject.timestamp}`,
          sender: "ai",
          text: originalProject.explanation || "Aqui está o seu site gerado com base no seu prompt.",
          timestamp: originalProject.timestamp
        }
      ];

      const newMessages: ChatMessage[] = [
        ...currentMsgs,
        {
          id: `msg-refine-user-${Date.now()}`,
          sender: "user",
          text: instruction,
          timestamp: Date.now() - 500
        },
        {
          id: `msg-refine-ai-${Date.now()}`,
          sender: "ai",
          text: responseData.explanation || "A alteração foi aplicada com sucesso!",
          timestamp: Date.now()
        }
      ];

      const updatedProject: WebProject = {
        prompt: originalProject.prompt + " + " + instruction,
        html: responseData.html || originalProject.html,
        css: responseData.css !== undefined ? responseData.css : originalProject.css,
        js: responseData.js !== undefined ? responseData.js : originalProject.js,
        explanation: responseData.explanation || "Site refinado pelo usuário.",
        timestamp: Date.now(),
        messages: newMessages
      };

      setActiveProject(updatedProject);
      setSelectedFileName("index.php");

      // Update history
      const updatedHistory = [updatedProject, ...history.filter(h => h.prompt !== updatedProject.prompt)].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem("nocode_generator_history", JSON.stringify(updatedHistory));

      // Deduct 10 credits on successful refinement
      setUserCredits(prev => Math.max(0, prev - 10));

    } catch (error: any) {
      console.error(error);
      setGenerationStep(-1);
      setGenerationLogs(prev => [
        ...prev,
        "❌ ERRO AO REFINAR PROJETO:",
        error.message || "Não foi possível refinar o código."
      ]);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 800);
    }
  };

  // Helper to construct virtual PHP project files based on raw generation
  const generatePHPFiles = (proj: WebProject): FileTreeItem[] => {
    // Generate clean modular elements from the HTML
    // We can extract high level structures, but to ensure high reliability and gorgeous visual representation, 
    // we split them cleanly and insert PHP syntax comments/logic.
    
    const htmlClean = proj.html;
    
    // Extract head and body elements to modularize
    let bodyContent = htmlClean;
    const bodyMatch = htmlClean.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      bodyContent = bodyMatch[1];
    }

    // Try to extract footer/navbar structure or make them modular
    const navbarPHP = `<?php
/**
 * NoCode Creator - Componente de Cabeçalho do Site
 * Desenvolvido automaticamente
 */
?>
<!-- Header / Navigation -->
<nav class="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-zinc-100 py-4 px-6 md:px-12 flex items-center justify-between transition-all">
  <div class="flex items-center gap-3">
    <div class="w-10 h-10 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
      PHP
    </div>
    <span class="text-xl font-bold tracking-tight text-zinc-900"><?php echo SITE_NAME; ?></span>
  </div>
  <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
    <a href="index.php" class="text-indigo-600 transition-colors">Início</a>
    <a href="#features" class="hover:text-indigo-600 transition-colors">Recursos</a>
    <a href="#about" class="hover:text-indigo-600 transition-colors">Sobre</a>
    <a href="#contact" class="hover:text-indigo-600 transition-colors">Contato</a>
  </div>
  <div>
    <a href="#contact" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200">
      Iniciar
    </a>
  </div>
</nav>
`;

    const footerPHP = `<?php
/**
 * NoCode Creator - Componente de Rodapé do Site
 * Desenvolvido automaticamente
 */
?>
<!-- Footer -->
<footer class="bg-zinc-900 text-zinc-400 py-16 px-6 md:px-12 border-t border-zinc-800">
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          PHP
        </div>
        <span class="text-lg font-bold text-white"><?php echo SITE_NAME; ?></span>
      </div>
      <p class="text-sm leading-relaxed">Sites modulares criados com IA usando PHP de alta fidelidade e estilização responsiva imediata.</p>
    </div>
    <div>
      <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4">Navegação</h4>
      <ul class="space-y-2 text-sm">
        <li><a href="index.php" class="hover:text-white transition-colors">Home</a></li>
        <li><a href="#features" class="hover:text-white transition-colors">Recursos</a></li>
        <li><a href="#contact" class="hover:text-white transition-colors">Contato</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4">Contato</h4>
      <p class="text-sm">E-mail: <?php echo $contact_email; ?></p>
      <p class="text-sm">Telefone: <?php echo $phone; ?></p>
    </div>
    <div>
      <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4">Tecnologias</h4>
      <p class="text-sm leading-relaxed">Gerado em PHP 8.2+ integrado com Tailwind CSS v4 e Lucide Icons modernos via CDN externa.</p>
    </div>
  </div>
  <div class="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
    <p>&copy; <?php echo date('Y'); ?> <?php echo SITE_NAME; ?>. Todos os direitos reservados.</p>
    <p>Criado via <span class="text-indigo-400">NoCode Creator PHP</span></p>
  </div>
</footer>
`;

    const configPHP = `<?php
/**
 * NoCode Creator - Configurações Gerais do Projeto PHP
 */
define('SITE_NAME', 'Meu Site No-Code');
define('SITE_TITLE', 'Home - Criado com NoCode Creator');
define('VERSION', '1.0.0');
define('API_ENABLED', true);

// Informações dinâmicas usadas nos módulos e componentes
$contact_email = "contato@exemplo.com";
$phone = "+55 (11) 99999-9999";
?>
`;

    const cssContent = proj.css || `/* CSS de Suporte Gerado */
body {
  scroll-behavior: smooth;
}`;

    const jsContent = proj.js || `// Scripts interativos do site
document.addEventListener('DOMContentLoaded', () => {
  console.log("Site inicializado com sucesso!");
});`;

    // Dynamic index.php integrating files
    const indexPHP = `<?php
/**
 * NoCode Creator - Arquivo Principal
 * Site gerado com inteligência artificial
 * Prompt: ${proj.prompt}
 */
require_once 'config.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo SITE_NAME; ?> - <?php echo SITE_TITLE; ?></title>
    <!-- Tailwind CSS v4 CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        /* Estilos Customizados do Projeto */
        <?php include 'assets/css/style.css'; ?>
    </style>
</head>
<body class="bg-zinc-50 text-zinc-950 flex flex-col min-h-screen">

    <!-- Navbar Modularizada via PHP -->
    <?php include 'components/Navbar.php'; ?>

    <!-- Conteúdo Principal do Site -->
    <main class="flex-grow">
        <!-- Estrutura Principal Gerada por IA -->
        <div class="ai-generated-wrapper">
${bodyContent.split('\n').map(line => '            ' + line).join('\n')}
        </div>
    </main>

    <!-- Rodapé Modularizado via PHP -->
    <?php include 'components/Footer.php'; ?>

    <!-- Carregador de Ícones e Script de Interatividade -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Inicializa todos os ícones Lucide da página
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
        
        // Scripts personalizados do projeto
        <?php include 'assets/js/main.js'; ?>
    </script>
</body>
</html>
`;

    return [
      {
        name: "index.php",
        type: "file",
        content: indexPHP
      },
      {
        name: "config.php",
        type: "file",
        content: configPHP
      },
      {
        name: "components",
        type: "folder",
        children: [
          {
            name: "Navbar.php",
            type: "file",
            content: navbarPHP
          },
          {
            name: "Footer.php",
            type: "file",
            content: footerPHP
          }
        ]
      },
      {
        name: "assets",
        type: "folder",
        children: [
          {
            name: "css",
            type: "folder",
            children: [
              {
                name: "style.css",
                type: "file",
                content: cssContent
              }
            ]
          },
          {
            name: "js",
            type: "folder",
            children: [
              {
                name: "main.js",
                type: "file",
                content: jsContent
              }
            ]
          }
        ]
      },
      {
        name: "LEIA-ME.txt",
        type: "file",
        content: `=====================================================
PROJETO PHP GERADO COM NO-CODE CREATOR
=====================================================
Este projeto foi desenvolvido de forma 100% dinâmica.

ESTRUTURA DE ARQUIVOS GERADA:
- index.php: Arquivo principal de inicialização estruturado.
- config.php: Configurações de dados e constantes PHP.
- components/Navbar.php: Menu de navegação responsivo.
- components/Footer.php: Rodapé com suporte de mídias e e-mails.
- assets/css/style.css: Folha de estilos customizada.
- assets/js/main.js: Script de interações, animações e lógica.

COMO EXECUTAR LOCALMENTE:
1. Copie estes arquivos para o diretório do seu servidor web local (como XAMPP, Laragon ou Docker).
2. Certifique-se de usar PHP versão 8.0 ou superior.
3. Acesse http://localhost/seu-projeto no seu navegador.
4. O Tailwind CSS e o Lucide Icons carregarão automaticamente via CDN oficial.

Seu Prompt Criador:
"${proj.prompt}"
`
      }
    ];
  };

  // Find a specific file's content in our file tree structure
  const findFileContent = (items: FileTreeItem[], name: string): string | undefined => {
    for (const item of items) {
      if (item.type === "file" && item.name === name) {
        return item.content;
      }
      if (item.type === "folder" && item.children) {
        const found = findFileContent(item.children, name);
        if (found !== undefined) return found;
      }
    }
    // Deep match simple names
    for (const item of items) {
      if (item.type === "folder" && item.children) {
        for (const child of item.children) {
          if (child.name === name || `${item.name}/${child.name}` === name) {
            return child.content;
          }
          if (child.children) {
            for (const grand of child.children) {
              if (grand.name === name || `${item.name}/${child.name}/${grand.name}` === name) {
                return grand.content;
              }
            }
          }
        }
      }
    }
    return undefined;
  };

  // Compile full iframe srcDoc to display live preview
  const getIframeSrcDoc = () => {
    if (!activeProject) return "";
    
    // Inject custom Tailwind config + HTML + custom CSS + custom JS to render accurately inside browser iframe
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/lucide@latest"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  brand: {
                    purple: '#a855f7',
                    indigo: '#6366f1'
                  }
                }
              }
            }
          }
        </script>
        <style>
          /* Custom CSS */
          ${activeProject.css}
          html { scroll-behavior: smooth; }
        </style>
      </head>
      <body class="bg-zinc-50 text-zinc-900 min-h-screen">
        ${activeProject.html}
        
        <script>
          // Initialize lucide icons inside iframe
          document.addEventListener('DOMContentLoaded', () => {
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
          });
          
          // User JS code
          try {
            ${activeProject.js}
          } catch(e) {
            console.error("Erro no script gerado:", e);
          }
        </script>
      </body>
      </html>
    `;
  };

  // Handle single file copy
  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFileContent);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  // Handle download of the current file
  const handleDownloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([selectedFileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = selectedFileName.split("/").pop() || "index.php";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handle direct download of entire PHP code as a compressed .zip file
  const handleDownloadAll = () => {
    if (!activeProject) return;
    const files = generatePHPFiles(activeProject);
    
    const zip = new JSZip();
    
    const traverse = (items: FileTreeItem[], parentZip: JSZip) => {
      for (const item of items) {
        if (item.type === "file") {
          if (item.content !== undefined) {
            parentZip.file(item.name, item.content);
          }
        } else if (item.type === "folder" && item.children) {
          const folderZip = parentZip.folder(item.name);
          if (folderZip) {
            traverse(item.children, folderZip);
          }
        }
      }
    };
    
    traverse(files, zip);
    
    zip.generateAsync({ type: "blob" }).then((content) => {
      const element = document.createElement("a");
      element.href = URL.createObjectURL(content);
      element.download = "projeto-php-nocode.zip";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }).catch((err) => {
      console.error("Falha ao gerar o arquivo .zip:", err);
    });
  };

  const isInputKeyInvalid = activeProvider === "google-ai"
    ? (customKeyInput !== "" && customKeyInput !== "••••••••••••••••" && !/^AIzaSy[A-Za-z0-9_-]{33}$/.test(customKeyInput.trim()))
    : (customKeyInput !== "" && customKeyInput !== "••••••••••••••••" && customKeyInput.trim().length < 8);

  return (
    <div id="nocode-app-container" className="min-h-screen bg-[#050505] text-zinc-300 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white relative overflow-x-hidden">
      
      {/* Global Ambient Mesh Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {/* Left Blue Glow */}
        <div className="absolute top-[10%] left-[-25%] w-[1000px] h-[900px] bg-blue-600/35 rounded-full blur-[140px] opacity-90 mix-blend-screen"></div>
        {/* Right Blue Glow */}
        <div className="absolute top-[15%] right-[-25%] w-[1000px] h-[900px] bg-indigo-600/35 rounded-full blur-[140px] opacity-90 mix-blend-screen"></div>
        {/* Bottom Pink/Magenta Glow */}
        <div className="absolute bottom-[-15%] left-[5%] right-[5%] h-[600px] bg-pink-500/25 rounded-full blur-[150px] opacity-80 mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }}></div>
        {/* Subtle top dark overlay */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#050505] to-transparent opacity-85"></div>
      </div>

      {/* Top Header Navigation */}
      {activeTab !== "builder" && (
        <nav id="navbar-top" className={`sticky top-0 z-40 h-16 border-b border-white/5 px-4 md:px-8 flex items-center justify-between backdrop-blur-md transition-all duration-300 ${activeTab === 'home' ? 'bg-transparent border-b-transparent' : 'bg-[#09090b]/40 border-b border-white/5'}`}>
          {/* Modern Minimalistic NC Logo */}
          <div 
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 group cursor-pointer select-none flex-1"
          >
            <div className="relative">
              {/* Elegant thin neon glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-9 h-9 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center shadow-lg transition-colors group-hover:border-zinc-700">
                <span className="text-xs font-sans font-black tracking-tight text-white flex items-center gap-0.5">
                  N<span className="text-indigo-400 font-semibold">C</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-100 font-sans font-extrabold text-[15px] tracking-tight group-hover:text-white transition-colors">
                NoCode
              </span>
            </div>
          </div>

          {/* Center: Beautiful and Modern Credits Display (No-star, exactly like 2nd image) */}
          <div className="flex items-center justify-center relative">
            <div className="bg-zinc-900/60 hover:bg-zinc-900/80 border border-zinc-800/80 rounded-full px-3.5 py-1.5 flex items-center gap-2.5 shadow-md hover:shadow-lg transition-all backdrop-blur-sm group/credit cursor-pointer">
              <Coins className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-sans">
                <span className="text-zinc-400 font-medium">Créditos:</span>
                <span className="font-semibold text-zinc-100">{userCredits.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              
              {/* Tooltip on hover */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 scale-0 group-hover/credit:scale-100 transition-all origin-top duration-200 z-50 bg-zinc-950/95 border border-zinc-800 rounded-xl p-3 shadow-2xl text-[10px] text-zinc-400 w-48 text-center pointer-events-none backdrop-blur-md">
                <p className="font-semibold text-zinc-200 mb-1 font-sans">Cota Diária de Créditos</p>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(100, (userCredits / 150) * 100)}%` }}
                  ></div>
                </div>
                <p className="font-sans text-[9px] text-zinc-500">Reinicia diariamente à meia-noite UTC</p>
              </div>
            </div>
          </div>

          {/* Right side navigation and avatar actions */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            {/* Painel Lovable Button */}
            {activeProject && (
              <button 
                id="tab-btn-builder"
                onClick={() => setActiveTab("builder")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 border ${
                  activeTab === "builder" 
                    ? "bg-white/10 text-white border-white/10" 
                    : "text-zinc-400 hover:text-white bg-transparent border-transparent hover:bg-white/5"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Painel</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              </button>
            )}

            {/* Admin Button */}
            <button 
              id="tab-btn-admin"
              onClick={() => setActiveTab("admin")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 border ${
                activeTab === "admin" 
                  ? "bg-white/10 text-white border-white/10" 
                  : "text-zinc-400 hover:text-white bg-transparent border-transparent hover:bg-white/5"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all relative"
                title="Notificações"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#050505] animate-pulse"></span>
              </button>
            </div>

            {/* User Profile Avatar with Online Status */}
            <div className="h-8 w-px bg-white/5 mx-1 hidden sm:block"></div>
            
            <div className="relative group pl-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-300 shadow-md group-hover:border-white/20 transition-all select-none">
                N
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-[#050505] rounded-full"></span>
            </div>
          </div>
        </nav>
      )}

      {/* Main Container */}
      <div className="flex-grow flex flex-col relative">
        
        {/* TAB 1: HOME PAGE (SITE CREATION PROMPT) */}
        {activeTab === "home" && (
          <div id="home-view" className="flex-grow flex flex-col items-center justify-center px-4 py-20 md:py-32 relative z-10">
            
            {/* Central elements wrapper */}
            <div className="w-full max-w-3xl flex flex-col items-center justify-center z-10 space-y-8">
              
              {/* Upper Pill Badge */}
              <div className="flex items-center gap-2.5 bg-[#0f1115]/95 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[13px] font-semibold text-zinc-200 shadow-2xl hover:border-white/20 hover:bg-[#16181f] transition-all cursor-pointer group">
                <div className="flex -space-x-1.5 items-center">
                  <div className="w-5 h-5 rounded-full bg-[#4285F4] border border-zinc-950 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">▲</div>
                  <div className="w-5 h-5 rounded-full bg-[#E01E5A] border border-zinc-950 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">●</div>
                  <div className="w-5 h-5 rounded-full bg-[#00A4EF] border border-zinc-950 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">■</div>
                </div>
                <span className="tracking-tight text-white/90">Conecte todas as suas ferramentas</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </div>

              {/* Lovable-inspired Dynamic Greeting Header */}
              <div className="min-h-[64px] flex items-center justify-center px-4">
                <h1 className="text-3xl md:text-[44px] font-sans font-extrabold tracking-tight text-white text-center flex items-center justify-center flex-wrap">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-300">
                    {displayedText}
                  </span>
                  <span className="inline-block w-[3px] h-8 md:h-[40px] bg-gradient-to-b from-indigo-400 to-purple-500 ml-1.5 animate-pulse rounded-full"></span>
                </h1>
              </div>

              {/* Premium Input prompt box */}
              <div className="w-full bg-[#18181b]/95 backdrop-blur-xl border border-white/10 rounded-[28px] p-4 shadow-2xl focus-within:border-white/20 transition-all flex flex-col gap-4">
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate(promptInput);
                    }
                  }}
                  placeholder="Peça ao Lovable para construir..."
                  rows={2}
                  className="bg-transparent border-none outline-none w-full text-white text-base md:text-lg placeholder:text-zinc-500 resize-none px-2 focus:ring-0"
                />
                
                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  {/* Plus icon button on the left */}
                  <button className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer">
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Right side buttons */}
                  <div className="flex items-center gap-2">
                    {/* Selectable / Dropdown style trigger "Construir" */}
                    <div 
                      onClick={() => handleGenerate(promptInput)}
                      className="flex items-center bg-transparent hover:bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 cursor-pointer text-zinc-300 hover:text-white transition-all text-xs font-semibold gap-1"
                    >
                      <span>Construir</span>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    </div>

                    {/* Microphone icon */}
                    <button className="w-9 h-9 rounded-full bg-transparent hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer">
                      <Mic className="w-4 h-4" />
                    </button>

                    {/* Send button (rounded upward arrow) */}
                    <button
                      onClick={() => handleGenerate(promptInput)}
                      disabled={!promptInput.trim() || isGenerating}
                      className="w-9 h-9 rounded-full bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowUp className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>



            </div>

          </div>
        )}

        {/* TAB 2: BUILDER PANEL (LOVABLE INSPIRED WORKSPACE) */}
        {activeTab === "builder" && (
          <div id="builder-view" className="flex-1 flex overflow-hidden h-screen relative">
            
            {/* Generating Loader Screen (Simple loading icon as requested in Image 4) */}
            {isGenerating && (
              <div className="absolute inset-0 z-50 bg-[#050505]/65 backdrop-blur-md flex flex-col items-center justify-center p-6 select-none animate-fade-in">
                <div className="flex flex-col items-center space-y-4 text-center">
                  {generationStep === -1 ? (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 text-red-500 mx-auto animate-bounce">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white font-sans">Falha na Geração</h4>
                        <p className="text-xs text-zinc-500 max-w-xs">Ocorreu um erro ao processar o seu site.</p>
                      </div>
                      <button
                        onClick={() => setIsGenerating(false)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-all font-sans"
                      >
                        Fechar
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Only a simple high-fidelity spinning loader icon */}
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-2 border-zinc-800/80"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-indigo-500 animate-spin"></div>
                      </div>
                      <p className="text-xs text-zinc-400 font-sans font-medium tracking-wide animate-pulse">
                        Criando seu site...
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Sidebar: Lovable-inspired Sidebar */}
            <aside ref={chatContainerRef} id="builder-sidebar-files" className="h-full border-b md:border-b-0 md:border-r border-white/5 bg-[#09090b]/90 backdrop-blur-md flex flex-col shrink-0 overflow-hidden relative" style={{ width: `${chatWidth}%`, minWidth: '280px', maxWidth: '500px' }}>
              {/* Sidebar header - minimal */}
              <div className="p-3 border-b border-white/5 bg-[#0c0c0f]/60">
                <button 
                  onClick={() => setActiveTab("home")}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white border border-white/5 transition-all cursor-pointer"
                  title="Voltar ao início"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {activeProject ? (
                <div className="h-full flex flex-col overflow-hidden min-h-0">
                  {/* Outer container for scrollable content inside sidebar */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 scrollbar-none">
                    {/* Chat Messages / Conversation History */}
                    <div className="flex flex-col space-y-3 pb-2">
                      {chatMessages.map((msg, index) => (
                        <div
                          key={msg.id}
                          className={`flex max-w-[95%] animate-slide-up ${
                            msg.sender === "user" ? "self-end" : "self-start"
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {/* Message bubble - no avatar */}
                          <div className={`rounded-2xl p-3 text-[12px] leading-relaxed font-sans transition-all duration-300 hover:scale-[1.01] ${
                            msg.sender === "user"
                              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md shadow-lg shadow-indigo-500/20"
                              : "bg-[#1a1a1f] border border-white/5 text-zinc-200 rounded-bl-md shadow-lg shadow-black/20"
                          }`}>
                            {msg.sender === "ai" && (
                              <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/5">
                                <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center">
                                  <Sparkles className="w-2.5 h-2.5 text-white" />
                                </div>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">NoCode AI</span>
                              </div>
                            )}
                            <p className="whitespace-pre-line">{msg.text}</p>
                          </div>
                        </div>
                      ))}

                      {isGenerating && (
                        <div className="flex max-w-[95%] self-start animate-fade-in">
                          <div className="rounded-2xl p-3 bg-[#1a1a1f] border border-white/5 text-zinc-400 rounded-bl-md shadow-lg shadow-black/20">
                            <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/5">
                              <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center animate-pulse">
                                <Sparkles className="w-2.5 h-2.5 text-white" />
                              </div>
                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">NoCode AI</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                              </div>
                              <span className="text-[10px] text-zinc-500 ml-1">Criando...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={chatEndRef} />

                      {/* Recommendations/Suggestions */}
                      {showRecommendations && chatMessages.length <= 2 && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Sugestões</span>
                            <button 
                              onClick={() => setShowRecommendations(false)}
                              className="text-zinc-600 hover:text-zinc-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex flex-row flex-wrap gap-1.5">
                            {recommendations.map((rec, index) => {
                              const Icon = rec.icon;
                              return (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setRefinePrompt(rec.action);
                                    setShowRecommendations(false);
                                  }}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1a1a1f] hover:bg-[#222228] border border-white/5 hover:border-indigo-500/30 rounded-lg text-[10px] text-zinc-400 hover:text-zinc-200 transition-all duration-200 hover:scale-105"
                                >
                                  <Icon className="w-3 h-3 text-indigo-400" />
                                  <span>{rec.text}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lovable-inspired prompt input container at the bottom of the sidebar */}
                  <div className="p-4 border-t border-white/5 bg-[#07070a]/85 backdrop-blur-sm space-y-3 shrink-0">
                    <div className="bg-[#141418] rounded-2xl border border-white/5 p-3 flex flex-col gap-2 focus-within:border-indigo-500/30 transition-all shadow-inner">
                      <textarea
                        value={refinePrompt}
                        onChange={(e) => setRefinePrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleRefine();
                          }
                        }}
                        placeholder="Faça mudanças, adicione novos recursos..."
                        className="bg-transparent border-none outline-none resize-none text-[13px] text-white px-1 py-1 placeholder:text-zinc-600 h-12 max-h-24 scrollbar-none"
                        disabled={isGenerating}
                      />
                      
                      <div className="flex items-center justify-between border-t border-white/5 pt-2">
                        {/* Left icons: plus/attachment */}
                        <div className="flex items-center gap-1">
                          <button 
                            className="p-2 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10" 
                            title="Adicionar anexo"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*,.pdf,.txt';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  setRefinePrompt(prev => prev + `[Arquivo: ${file.name}] `);
                                }
                              };
                              input.click();
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10" 
                            title="Modo Tela Cheia"
                            onClick={() => {
                              if (document.fullscreenElement) {
                                document.exitFullscreen();
                              } else {
                                document.documentElement.requestFullscreen();
                              }
                            }}
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Right tools & action */}
                        <div className="flex items-center gap-1.5">
                          <button 
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[11px] text-zinc-400 font-semibold transition-all border border-white/5 flex items-center gap-1.5 hover:border-indigo-500/30"
                            onClick={() => {
                              setRefinePrompt("Adicione um novo componente ao site");
                            }}
                          >
                            <span>Recursos de IA</span>
                          </button>
                          
                          <button 
                            className="p-2 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10" 
                            title="Gravação de voz"
                            onClick={() => {
                              if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                                const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
                                const recognition = new SpeechRecognition();
                                recognition.lang = 'pt-BR';
                                recognition.onresult = (event: any) => {
                                  const transcript = event.results[0][0].transcript;
                                  setRefinePrompt(transcript);
                                };
                                recognition.start();
                              }
                            }}
                          >
                            <Mic className="w-4 h-4" />
                          </button>

                          <button
                            onClick={handleRefine}
                            disabled={!refinePrompt.trim() || isGenerating}
                            className="w-9 h-9 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:scale-95 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:scale-105"
                            title="Enviar mensagem"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-[9px] text-zinc-600 font-sans">Enter para enviar · Shift+Enter para nova linha</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <Code className="w-8 h-8 text-zinc-600 animate-pulse" />
                  <p className="text-zinc-500 text-xs font-sans">Nenhum projeto ativo.</p>
                  <button 
                    onClick={() => setActiveTab("home")}
                    className="bg-indigo-600/15 hover:bg-indigo-600/35 text-indigo-400 px-4 py-2 rounded-xl text-xs font-semibold transition-all font-sans"
                  >
                    Ir para o Criador
                  </button>
                </div>
              )}
            </aside>

            {/* Resize Handle */}
            <div 
              onMouseDown={handleResizeStart}
              className={`hidden md:flex w-1.5 cursor-col-resize items-center justify-center hover:bg-indigo-500/20 transition-colors ${isResizing ? 'bg-indigo-500/30' : 'bg-transparent'}`}
            >
              <div className="w-0.5 h-8 rounded-full bg-zinc-600 hover:bg-indigo-400 transition-colors"></div>
            </div>

            {/* Main Interactive Editor & Preview Canvas */}
            <main className="flex-grow bg-[#050505] flex flex-col relative overflow-hidden">
              
              {/* Workspace Top Toolbar */}
              <div className="h-12 border-b border-white/5 bg-[#09090b] px-4 flex items-center justify-between shrink-0">
                
                {/* Center Control Group */}
                <div className="flex items-center gap-3">
                  <div className="bg-white/5 rounded-lg p-0.5 flex border border-white/5">
                    <button
                      onClick={() => setPreviewMode("preview")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                        previewMode === "preview" 
                          ? "bg-white/10 text-white shadow" 
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visualização</span>
                    </button>
                    <button
                      onClick={() => setPreviewMode("code")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                        previewMode === "code" 
                          ? "bg-white/10 text-white shadow" 
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>Código</span>
                    </button>
                  </div>

                  {/* Viewport size switcher (only for preview mode) */}
                  {previewMode === "preview" && (
                    <div className="hidden sm:flex bg-white/5 rounded-lg p-0.5 border border-white/5">
                      <button
                        onClick={() => setViewportSize("desktop")}
                        className={`p-1.5 rounded transition-all ${viewportSize === "desktop" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}
                        title="Desktop (Total)"
                      >
                        <Monitor className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewportSize("laptop")}
                        className={`p-1.5 rounded transition-all ${viewportSize === "laptop" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}
                        title="Laptop (1024px)"
                      >
                        <Laptop className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewportSize("tablet")}
                        className={`p-1.5 rounded transition-all ${viewportSize === "tablet" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}
                        title="Tablet (768px)"
                      >
                        <Tablet className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewportSize("mobile")}
                        className={`p-1.5 rounded transition-all ${viewportSize === "mobile" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}
                        title="Celular (380px)"
                      >
                        <Smartphone className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* External tab link icon */}
                  <button className="p-1.5 text-zinc-400 hover:text-white bg-white/5 border border-white/5 rounded-lg" title="Abrir em Nova Aba">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                {/* Right side Actions and User Avatar */}
                <div className="flex items-center gap-3">
                  {activeProject && (
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/5 transition-all flex items-center gap-1.5"
                        title="Compartilhar projeto"
                      >
                        <Share className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </div>
                  )}

                  <div className="w-px h-6 bg-white/10 hidden sm:block"></div>

                  {/* Bell and Profile */}
                  <div className="flex items-center gap-2.5">
                    <button className="p-1.5 text-zinc-400 hover:text-white transition-colors relative">
                      <Bell className="w-4 h-4" />
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    </button>
                    
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold font-sans shadow-md ring-2 ring-indigo-500/25 cursor-pointer">
                      N
                    </div>
                  </div>
                </div>

              </div>

              {/* Workspace Stage */}
              <div className="flex-1 relative overflow-hidden bg-[#040406]">
                
                {/* Background soft mesh decoration */}
                <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                  <div className="absolute top-10 right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
                  <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"></div>
                </div>

                {activeProject ? (
                  previewMode === "preview" ? (
                    /* LIVE IFRAME RENDER PREVIEW - Full width/height */
                    <div 
                      className="w-full h-full flex flex-col bg-white overflow-hidden"
                    >
                      <iframe 
                        id="rendered-preview-iframe"
                        srcDoc={getIframeSrcDoc()}
                        className="w-full flex-grow bg-white border-none"
                        title="Preview do site gerado"
                        sandbox="allow-scripts allow-popups"
                      />
                    </div>
                  ) : (
                    /* CODE VIEW: File Tree (left) + Code Area (right) — Lovable style */
                    <div className="w-full h-full flex min-w-0 overflow-hidden">
                      
                      {/* === FILE TREE (Left Panel — independent scroll) === */}
                      <div className="w-64 h-full border-r border-white/5 bg-[#0a0a0c] flex flex-col shrink-0 overflow-hidden">
                        {/* Search */}
                        <div className="px-3 py-2.5 border-b border-white/5">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search code"
                              className="w-full bg-[#121215] border border-white/5 rounded-lg px-3 py-1.5 text-[11px] text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-indigo-500/40 transition-all"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded font-mono">⌘K</span>
                          </div>
                        </div>

                        {/* Tree content — scrolls independently */}
                        <div className="flex-1 min-h-0 overflow-y-auto py-1 scrollbar-none">
                          {/* src folder */}
                          <div className="px-2">
                            <div 
                              onClick={() => toggleFolder("src")}
                              className="flex items-center gap-1.5 px-2 py-1 text-zinc-300 text-xs font-sans cursor-pointer hover:bg-white/5 rounded-lg transition-all group"
                            >
                              {expandedFolders["src"] ? (
                                <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                              ) : (
                                <ChevronRight className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                              )}
                              {expandedFolders["src"] ? (
                                <FolderOpen className="w-4 h-4 text-indigo-400" />
                              ) : (
                                <FolderClosed className="w-4 h-4 text-indigo-400" />
                              )}
                              <span className="font-semibold text-zinc-200">src</span>
                            </div>
                            
                            {expandedFolders["src"] && (
                              <div className="ml-4 border-l border-white/5 pl-1 space-y-0.5">
                                {/* assets */}
                                <div>
                                  <div 
                                    onClick={() => toggleFolder("assets")}
                                    className="flex items-center gap-1.5 px-2 py-1 text-zinc-400 text-xs font-sans cursor-pointer hover:bg-white/5 rounded-lg transition-all group"
                                  >
                                    {expandedFolders["assets"] ? <ChevronDown className="w-3 h-3 text-zinc-600" /> : <ChevronRight className="w-3 h-3 text-zinc-600" />}
                                    {expandedFolders["assets"] ? <FolderOpen className="w-3.5 h-3.5 text-yellow-500" /> : <FolderClosed className="w-3.5 h-3.5 text-yellow-500" />}
                                    <span>assets</span>
                                  </div>
                                  {expandedFolders["assets"] && (
                                    <div className="ml-5 border-l border-white/5 pl-1 space-y-0.5">
                                      <div onClick={() => setSelectedFileName("assets/css/style.css")} className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-sans cursor-pointer rounded-lg transition-all ${selectedFileName === "assets/css/style.css" ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"}`}>
                                        <FileText className="w-3 h-3 text-cyan-400" />
                                        <span>style.css</span>
                                      </div>
                                      <div onClick={() => setSelectedFileName("assets/js/main.js")} className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-sans cursor-pointer rounded-lg transition-all ${selectedFileName === "assets/js/main.js" ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"}`}>
                                        <FileCode className="w-3 h-3 text-purple-400" />
                                        <span>main.js</span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* components */}
                                <div>
                                  <div 
                                    onClick={() => toggleFolder("components")}
                                    className="flex items-center gap-1.5 px-2 py-1 text-zinc-400 text-xs font-sans cursor-pointer hover:bg-white/5 rounded-lg transition-all group"
                                  >
                                    {expandedFolders["components"] ? <ChevronDown className="w-3 h-3 text-zinc-600" /> : <ChevronRight className="w-3 h-3 text-zinc-600" />}
                                    {expandedFolders["components"] ? <FolderOpen className="w-3.5 h-3.5 text-blue-400" /> : <FolderClosed className="w-3.5 h-3.5 text-blue-400" />}
                                    <span>components</span>
                                  </div>
                                  {expandedFolders["components"] && (
                                    <div className="ml-5 border-l border-white/5 pl-1 space-y-0.5">
                                      <div onClick={() => setSelectedFileName("components/Navbar.php")} className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-sans cursor-pointer rounded-lg transition-all ${selectedFileName === "components/Navbar.php" ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"}`}>
                                        <FileCode className="w-3 h-3 text-indigo-400" />
                                        <span>Navbar.php</span>
                                      </div>
                                      <div onClick={() => setSelectedFileName("components/Footer.php")} className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-sans cursor-pointer rounded-lg transition-all ${selectedFileName === "components/Footer.php" ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"}`}>
                                        <FileCode className="w-3 h-3 text-indigo-400" />
                                        <span>Footer.php</span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* hooks */}
                                <div>
                                  <div 
                                    onClick={() => toggleFolder("hooks")}
                                    className="flex items-center gap-1.5 px-2 py-1 text-zinc-400 text-xs font-sans cursor-pointer hover:bg-white/5 rounded-lg transition-all group"
                                  >
                                    {expandedFolders["hooks"] ? <ChevronDown className="w-3 h-3 text-zinc-600" /> : <ChevronRight className="w-3 h-3 text-zinc-600" />}
                                    {expandedFolders["hooks"] ? <FolderOpen className="w-3.5 h-3.5 text-green-400" /> : <FolderClosed className="w-3.5 h-3.5 text-green-400" />}
                                    <span>hooks</span>
                                  </div>
                                </div>

                                {/* lib */}
                                <div>
                                  <div 
                                    onClick={() => toggleFolder("lib")}
                                    className="flex items-center gap-1.5 px-2 py-1 text-zinc-400 text-xs font-sans cursor-pointer hover:bg-white/5 rounded-lg transition-all group"
                                  >
                                    {expandedFolders["lib"] ? <ChevronDown className="w-3 h-3 text-zinc-600" /> : <ChevronRight className="w-3 h-3 text-zinc-600" />}
                                    {expandedFolders["lib"] ? <FolderOpen className="w-3.5 h-3.5 text-purple-400" /> : <FolderClosed className="w-3.5 h-3.5 text-purple-400" />}
                                    <span>lib</span>
                                  </div>
                                </div>

                                {/* routes */}
                                <div>
                                  <div 
                                    onClick={() => toggleFolder("routes")}
                                    className="flex items-center gap-1.5 px-2 py-1 text-zinc-400 text-xs font-sans cursor-pointer hover:bg-white/5 rounded-lg transition-all group"
                                  >
                                    {expandedFolders["routes"] ? <ChevronDown className="w-3 h-3 text-zinc-600" /> : <ChevronRight className="w-3 h-3 text-zinc-600" />}
                                    {expandedFolders["routes"] ? <FolderOpen className="w-3.5 h-3.5 text-pink-400" /> : <FolderClosed className="w-3.5 h-3.5 text-pink-400" />}
                                    <span>routes</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Root files */}
                          <div className="px-3 mt-2 space-y-0.5">
                            <div onClick={() => setSelectedFileName("index.php")} className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-sans cursor-pointer rounded-lg transition-all ${selectedFileName === "index.php" ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"}`}>
                              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                              <span>index.php</span>
                            </div>
                            <div onClick={() => setSelectedFileName("config.php")} className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-sans cursor-pointer rounded-lg transition-all ${selectedFileName === "config.php" ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"}`}>
                              <FileCode className="w-3.5 h-3.5 text-yellow-500" />
                              <span>config.php</span>
                            </div>
                          </div>

                          {/* Separator */}
                          <div className="mx-3 my-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                          {/* Config files */}
                          <div className="px-3 space-y-0.5">
                            <div className="px-2 py-1 text-[9px] font-bold text-zinc-600 uppercase tracking-wider font-sans">Config</div>
                            <div onClick={() => setSelectedFileName("LEIA-ME.txt")} className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-sans cursor-pointer rounded-lg transition-all ${selectedFileName === "LEIA-ME.txt" ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"}`}>
                              <FileText className="w-3.5 h-3.5 text-zinc-500" />
                              <span>LEIA-ME.txt</span>
                            </div>
                            <div onClick={() => setSelectedFileName(".gitignore")} className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-sans cursor-pointer rounded-lg transition-all ${selectedFileName === ".gitignore" ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"}`}>
                              <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                              <span>.gitignore</span>
                            </div>
                            <div onClick={() => setSelectedFileName("package.json")} className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-sans cursor-pointer rounded-lg transition-all ${selectedFileName === "package.json" ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"}`}>
                              <FileCode className="w-3.5 h-3.5 text-green-500" />
                              <span>package.json</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* === CODE AREA (Right Panel — independent scroll) === */}
                      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden bg-[#09090b]">
                        {/* File tabs bar */}
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-[#0c0c0f] border-b border-white/5 overflow-x-auto shrink-0 scrollbar-none">
                          {[
                            { name: "index.php", label: "index.php" },
                            { name: "config.php", label: "config.php" },
                            { name: "components/Navbar.php", label: "Navbar.php" },
                            { name: "components/Footer.php", label: "Footer.php" },
                            { name: "assets/css/style.css", label: "style.css" },
                            { name: "assets/js/main.js", label: "main.js" },
                            { name: "LEIA-ME.txt", label: "LEIA-ME.txt" },
                          ].map((file) => (
                            <button
                              key={file.name}
                              onClick={() => setSelectedFileName(file.name)}
                              className={`px-3 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 border shrink-0 ${
                                selectedFileName === file.name
                                  ? "bg-indigo-500/10 text-white border-indigo-500/20 font-medium"
                                  : "text-zinc-500 hover:text-zinc-300 bg-transparent border-transparent"
                              }`}
                            >
                              <span className="text-[10px] opacity-75">📄</span>
                              <span>{file.label}</span>
                              {selectedFileName === file.name && (
                                <X className="w-3 h-3 text-zinc-500 hover:text-white ml-0.5" />
                              )}
                            </button>
                          ))}
                        </div>

                        {/* Code topbar: filename + actions */}
                        <div className="h-9 bg-[#0d0d11]/85 border-b border-white/5 flex items-center justify-between px-4 shrink-0">
                          <span className="text-[11px] font-mono text-zinc-400">{selectedFileName}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleCopyCode}
                              className="bg-white/5 hover:bg-white/10 text-zinc-300 px-2 py-1 rounded-md text-[10px] font-semibold border border-white/5 transition-all flex items-center gap-1"
                            >
                              {copiedFile ? (
                                <>
                                  <Check className="w-3 h-3 text-green-400" />
                                  <span className="text-green-400">Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={handleDownloadFile}
                              className="bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-300 px-2 py-1 rounded-md text-[10px] font-bold border border-indigo-500/10 transition-all flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              <span>Baixar</span>
                            </button>
                          </div>
                        </div>

                        {/* Code content with line numbers — scrolls independently */}
                        <div className="flex-1 min-h-0 overflow-hidden">
                          <pre className="h-full overflow-y-auto overflow-x-auto font-mono text-[13px] leading-[1.7] bg-[#0d0d11]/50 scrollbar-none">
                            <code className="whitespace-pre">{selectedFileContent.split('\n').map((line, i) => (
                              <div key={i} className="flex hover:bg-white/[0.02]">
                                <span className="inline-block w-12 text-right pr-4 text-zinc-600 select-none shrink-0 text-[11px]">{i + 1}</span>
                                <span className="text-zinc-300">{line}</span>
                              </div>
                            ))}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  /* Initial Empty State Builder Stage */
                  <div className="text-center space-y-6 max-w-md z-10 bg-[#0c0c0f]/80 p-8 rounded-2xl border border-white/5">
                    <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 text-indigo-400">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-bold text-base font-sans">Inicie um Novo Projeto No-Code</h3>
                      <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                        Seu espaço de desenvolvimento em tempo real está vazio. Escreva um prompt na tela inicial ou no rodapé do construtor para criar instantaneamente componentes estruturados em PHP.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("home")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all font-sans"
                    >
                      Ir para a Página Inicial
                    </button>
                  </div>
                )}

              </div>

            </main>

          </div>
        )}

        {/* TAB 3: ADMIN PANEL (CONFIGURATION & AI MODELS) */}
        {activeTab === "admin" && (
          <div id="admin-view" className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
            
            {/* Lateral Header (Sidebar Navigation only on Admin tab) */}
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-[#08080a]/95 flex flex-col shrink-0">
              {/* Header Title inside Admin Sidebar */}
              <div className="p-5 border-b border-white/5 bg-[#0c0c10]/40">
                <span className="text-[10px] font-sans font-bold text-indigo-400 uppercase tracking-widest block mb-1">Configuração Geral</span>
                <h2 className="text-xs font-sans font-extrabold text-white tracking-tight uppercase">Admin Painel</h2>
              </div>

              {/* Sidebar Navigation Options */}
              <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
                {[
                  { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard },
                  { id: "ia", label: "Ajustes de IA", icon: Brain },
                  { id: "credits", label: "Gestão de Créditos", icon: Coins },
                  { id: "projects", label: "Histórico de Sites", icon: History }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = adminSubTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setAdminSubTab(item.id as any)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                        isActive 
                          ? "bg-gradient-to-r from-indigo-500/10 to-indigo-500/[0.03] text-white border-indigo-500/20 shadow-md shadow-indigo-500/5" 
                          : "text-zinc-400 hover:text-zinc-200 bg-transparent border-transparent hover:bg-white/5"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-zinc-400"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar Footer Info */}
              <div className="p-4 border-t border-white/5 bg-[#050507]">
                <div className="bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10 text-[10px] text-zinc-500 leading-normal space-y-1 select-none">
                  <span className="font-bold text-indigo-400 block uppercase tracking-wider text-[9px]">Acesso de Segurança</span>
                  <p>As configurações salvas são mantidas de forma local em seu navegador criptografado.</p>
                </div>
              </div>
            </aside>

            {/* Main Section Content */}
            <main className="flex-grow p-6 md:p-8 space-y-6 overflow-y-auto max-w-5xl">
              
              {adminSubTab === "dashboard" && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-sans font-extrabold text-white tracking-tight">Visão Geral do Sistema</h2>
                    <p className="text-xs text-zinc-400 mt-1">Status em tempo real das conexões, recursos e estatísticas do gerador.</p>
                  </div>

                  {/* Modern Bento Grid Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    
                    {/* Credits Bento */}
                    <div className="bg-gradient-to-b from-[#09090b] to-[#060608] border border-white/5 p-5 rounded-2xl space-y-3 relative overflow-hidden group shadow-md">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Saldo do Usuário</span>
                        <Coins className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-sans font-extrabold text-white">{userCredits}</span>
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Créditos</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">Dedução automática por criação (15 CR) e refinamento (10 CR).</p>
                    </div>

                    {/* Active Model Bento */}
                    <div className="bg-gradient-to-b from-[#09090b] to-[#060608] border border-white/5 p-5 rounded-2xl space-y-3 relative overflow-hidden group shadow-md">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Modelo Ativo</span>
                        <Brain className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-semibold text-white truncate max-w-full">
                          {modelSelect === "gemini-3.5-flash" ? "Gemini 3.5 Flash" : modelSelect === "gemini-2.5-flash" ? "Gemini 2.5 Flash" : "Gemini 2.5 Pro"}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500">Modelo ultra otimizado para layouts limpos e responsivos.</p>
                    </div>

                    {/* Projects Created Bento */}
                    <div className="bg-gradient-to-b from-[#09090b] to-[#060608] border border-white/5 p-5 rounded-2xl space-y-3 relative overflow-hidden group shadow-md">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Projetos Gerados</span>
                        <Code className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-sans font-extrabold text-white">{history.length}</span>
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Histórico</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">Seus projetos estão salvos e podem ser recarregados a qualquer momento.</p>
                    </div>

                  </div>

                  {/* API Verification Row */}
                  <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 space-y-4 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">Status da Conexão da API</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Teste o tempo de resposta e a validade de sua chave do Google AI Studio.</p>
                      </div>
                      
                      <div className="flex items-center gap-3 self-start sm:self-center font-semibold">
                        {connectionStatus === "success" ? (
                          <span className="text-[11px] bg-green-500/10 border border-green-500/20 text-green-400 font-bold px-2 py-1 rounded-lg flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Conectado
                          </span>
                        ) : connectionStatus === "error" ? (
                          <span className="text-[11px] bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-2 py-1 rounded-lg flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Erro conexão
                          </span>
                        ) : connectionStatus === "validating" ? (
                          <span className="text-[11px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold px-2 py-1 rounded-lg flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span> Validando...
                          </span>
                        ) : (
                          <span className="text-[11px] bg-zinc-850 text-zinc-400 font-bold px-2 py-1 rounded-lg">Não testado</span>
                        )}

                        <button
                          type="button"
                          onClick={handleTestConnection}
                          disabled={connectionStatus === "validating"}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all"
                        >
                          Testar Conexão
                        </button>
                      </div>
                    </div>

                    {connectionErrorMsg && (
                      <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-lg text-[11px] text-red-400 leading-normal">
                        <strong>Erro de validação:</strong> {connectionErrorMsg}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {adminSubTab === "ia" && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h2 className="text-xl font-sans font-extrabold text-white tracking-tight">Configurações de Inteligência Artificial</h2>
                      <p className="text-xs text-zinc-400 mt-1">Configure chaves de API, escolha modelos de ponta ou use as suas próprias cotas corporativas.</p>
                    </div>
                    {adminStatusMsg && (
                      <div className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-400 font-medium animate-bounce">
                        {adminStatusMsg}
                      </div>
                    )}
                  </div>

                  {/* 1. Category selector sub-tabs */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5" /> Filtrar Provedores por Categoria
                    </label>
                    <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                      {[
                        "Modelos Gerais (Texto + Código)",
                        "Agregadores (1 API → vários modelos)",
                        "Código / Geração de Aplicações",
                        "Modelos Open Source (Auto-hospedáveis)",
                        "Imagem / UI / Design",
                        "Voz",
                        "Embeddings / Pesquisa"
                      ].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            selectedCategory === cat
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                              : "bg-[#141418] border border-white/5 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Providers Grid */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Selecione para configurar</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {AI_PROVIDERS.filter(p => p.category === selectedCategory).map((prov) => {
                        const isEditing = editingProvider === prov.id;
                        const isActive = activeProvider === prov.id;
                        const hasKey = apiKeys[prov.id] || (prov.id === "google-ai" && apiConfig.hasCustomApiKey);
                        return (
                          <button
                            key={prov.id}
                            type="button"
                            onClick={() => handleSelectEditingProvider(prov.id)}
                            className={`p-4 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                              isEditing
                                ? "bg-indigo-600/10 border-indigo-500 shadow-md shadow-indigo-500/10"
                                : "bg-[#09090b] border-white/5 hover:border-white/10"
                            }`}
                          >
                            <div className="w-full">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-bold text-xs text-white tracking-tight">{prov.name}</span>
                                <div className="flex items-center gap-1">
                                  {hasKey && (
                                    <span className="px-1 py-0.5 rounded bg-green-500/10 border border-green-500/25 text-[9px] font-mono text-green-400 flex items-center gap-0.5">
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                      Salvo
                                    </span>
                                  )}
                                  {isActive && (
                                    <span className="px-1 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-[9px] font-mono text-indigo-400">
                                      Ativo
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-[10px] text-zinc-400 leading-normal line-clamp-2">{prov.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Provider Config Form Card */}
                  {(() => {
                    const currentEditingProvider = AI_PROVIDERS.find(p => p.id === editingProvider) || AI_PROVIDERS[0];
                    return (
                      <form onSubmit={handleSaveConfig} className="bg-[#09090b] rounded-2xl border border-white/5 p-6 space-y-6 shadow-md">
                        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                              Configurar {currentEditingProvider.name}
                              {activeProvider === currentEditingProvider.id && (
                                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">Motor Ativo</span>
                              )}
                            </h3>
                            <p className="text-[11px] text-zinc-400 mt-0.5">{currentEditingProvider.description}</p>
                          </div>
                        </div>

                        {/* API Key Input */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Chave de API (Opcional se houver chave do servidor)</label>
                            <span className="text-[10px] text-zinc-500 uppercase font-mono">{currentEditingProvider.keyLabel}</span>
                          </div>
                          <div className="relative">
                            <input
                              type="password"
                              placeholder={currentEditingProvider.placeholderKey}
                              value={customKeyInput}
                              onChange={(e) => setCustomKeyInput(e.target.value)}
                              className={`w-full bg-[#141418] border rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-zinc-600 transition-all ${
                                isInputKeyInvalid
                                  ? "border-red-500 text-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-500/5"
                                  : "border-white/10 text-white focus:border-indigo-500/50"
                              }`}
                            />
                            {isInputKeyInvalid ? (
                              <AlertCircle className="absolute right-4 top-3.5 w-4 h-4 text-red-500 animate-pulse" />
                            ) : (
                              <Key className="absolute right-4 top-3.5 w-4 h-4 text-zinc-600" />
                            )}
                          </div>
                          {isInputKeyInvalid && (
                            <p className="text-red-400 text-[11px] leading-relaxed flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-red-500 inline shrink-0 animate-bounce" />
                              {editingProvider === "google-ai" 
                                ? 'Chave Gemini inválida. Formato esperado: AIzaSy seguido por exatamente 33 caracteres alfanuméricos.'
                                : 'Chave inválida. A chave informada é muito curta para este provedor de IA.'
                              }
                            </p>
                          )}
                          <p className="text-zinc-500 text-[11px] leading-relaxed">
                            A chave será guardada de forma criptografada no servidor. Deixe em branco se desejar usar as cotas integradas por padrão do sistema.
                          </p>
                        </div>

                        {/* Models & Settings Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {/* Models dropdown */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Selecione o Modelo</label>
                            <select
                              value={activeModel}
                              onChange={(e) => {
                                setActiveModel(e.target.value);
                                setModelSelect(e.target.value);
                              }}
                              disabled={showCustomModelField}
                              className="w-full bg-[#141418] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all disabled:opacity-40"
                            >
                              {currentEditingProvider.models
                                .filter(m => !filterFreeOnly || m.isFree)
                                .map(m => (
                                  <option key={m.id} value={m.id}>
                                    {m.name} {m.isFree ? " (Gratuito)" : ""}
                                  </option>
                                ))
                              }
                              {currentEditingProvider.models.filter(m => !filterFreeOnly || m.isFree).length === 0 && (
                                <option value="">Nenhum modelo nesta filtragem</option>
                              )}
                            </select>
                          </div>

                          {/* Filtering and Toggles */}
                          <div className="flex flex-col justify-end gap-3 pb-1">
                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={filterFreeOnly}
                                onChange={(e) => setFilterFreeOnly(e.target.checked)}
                                className="rounded border-white/10 bg-[#141418] text-indigo-600 focus:ring-0 focus:ring-offset-0 w-4 h-4"
                              />
                              <span className="text-xs text-zinc-400 hover:text-zinc-200">Apenas modelos com Plano Gratuito</span>
                            </label>

                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={showCustomModelField}
                                onChange={(e) => setShowCustomModelField(e.target.checked)}
                                className="rounded border-white/10 bg-[#141418] text-indigo-600 focus:ring-0 focus:ring-offset-0 w-4 h-4"
                              />
                              <span className="text-xs text-zinc-400 hover:text-zinc-200">Digitar modelo customizado</span>
                            </label>
                          </div>
                        </div>

                        {/* Custom model text field */}
                        {showCustomModelField && (
                          <div className="space-y-2 animate-fadeIn pt-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Identificador Técnico do Modelo</label>
                            <input
                              type="text"
                              placeholder="Ex: gpt-4o-2024-11-20, claude-3-5-sonnet-v2, ou mistral-large-latest"
                              value={customModelInput}
                              onChange={(e) => setCustomModelInput(e.target.value)}
                              className="w-full bg-[#141418] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 placeholder:text-zinc-600"
                            />
                            <p className="text-[11px] text-zinc-500">
                              Insira o nome técnico exato do modelo conforme documentação oficial do provedor.
                            </p>
                          </div>
                        )}

                        {/* Prompt systemInstruction field */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Prompt Boilerplate do Sistema</label>
                          <textarea
                            rows={4}
                            value={systemInstructionInput}
                            onChange={(e) => setSystemInstructionInput(e.target.value)}
                            className="w-full bg-[#141418] border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-sans focus:outline-none focus:border-indigo-500/50 leading-relaxed transition-all resize-none"
                            placeholder="Instruções de como o construtor deve se comportar..."
                          />
                          <p className="text-zinc-500 text-[10px] leading-relaxed">
                            Esse prompt dita os requisitos estruturais de código: CDN do Tailwind, Lucide Icons, e SPA responsivo.
                          </p>
                        </div>

                        {/* Action buttons inside form */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                          <button
                            type="button"
                            onClick={handleResetConfig}
                            disabled={adminSaving}
                            className="px-4 py-2.5 rounded-xl border border-white/5 hover:border-red-500/20 text-zinc-400 hover:text-red-400 text-xs font-semibold transition-all"
                          >
                            Restaurar Padrão
                          </button>

                          <div className="flex gap-2">
                            <button
                              type="submit"
                              disabled={adminSaving}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/15 flex items-center gap-1.5"
                            >
                              {adminSaving ? "Gravando..." : "Gravar e Ativar Provedor"}
                            </button>
                          </div>
                        </div>
                      </form>
                    );
                  })()}

                  {/* 4. Saved Configured Providers Grid */}
                  {savedProviders.length > 0 && (
                    <div className="bg-[#09090b] rounded-2xl border border-white/5 p-6 space-y-4 shadow-md">
                      <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                        <CheckCircle2 className="w-5 h-5 text-green-400 animate-pulse" />
                        <div>
                          <h3 className="text-sm font-bold text-white">Provedores Gravados e Disponíveis</h3>
                          <p className="text-[11px] text-zinc-400">Você tem chaves salvas para estes provedores. Clique em Ativar para alternar instantaneamente.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {savedProviders.map((provId) => {
                          const prov = AI_PROVIDERS.find(p => p.id === provId);
                          if (!prov) return null;
                          const isActive = activeProvider === provId;
                          return (
                            <div
                              key={provId}
                              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                                isActive
                                  ? "bg-indigo-600/10 border-indigo-500/40"
                                  : "bg-[#141418] border-white/5"
                              }`}
                            >
                              <div className="flex flex-col pr-2">
                                <span className="font-bold text-white tracking-tight">{prov.name}</span>
                                <span className="text-[9px] text-zinc-500 font-mono mt-0.5 truncate max-w-[130px]">{prov.category}</span>
                              </div>
                              {isActive ? (
                                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-[9px] font-bold text-indigo-400 select-none">
                                  Ativo
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setAdminSaving(true);
                                    try {
                                      const res = await fetch("/api/config", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                          activeProvider: provId,
                                          activeModel: prov.models[0]?.id || provId
                                        })
                                      });
                                      if (res.ok) {
                                        setAdminStatusMsg(`Provedor ${prov.name} ativado com sucesso!`);
                                        fetchConfig();
                                        setTimeout(() => setAdminStatusMsg(""), 3000);
                                      }
                                    } catch (e) {
                                      console.error(e);
                                    } finally {
                                      setAdminSaving(false);
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] font-medium text-white transition-all border border-white/5"
                                >
                                  Ativar
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {adminSubTab === "credits" && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-sans font-extrabold text-white tracking-tight">Gestão de Créditos</h2>
                    <p className="text-xs text-zinc-400 mt-1">Carregue ou gerencie os créditos disponíveis do usuário de forma flexível.</p>
                  </div>

                  <div className="bg-[#09090b] rounded-2xl border border-white/5 p-6 space-y-6 shadow-md">
                    
                    {/* Visual Card showing current balance */}
                    <div className="relative p-8 rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c0c0e] via-[#08080a] to-[#040405] border border-white/5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                      {/* Decorative glowing background accent */}
                      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-700"></div>
                      
                      <div className="space-y-3 relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest font-sans">
                          <Coins className="w-3.5 h-3.5" /> Saldo Ativo & Verificado
                        </span>
                        <div>
                          <div className="flex items-baseline gap-2">
                            <h4 className="text-5xl font-sans font-black text-white tracking-tighter leading-none">
                              {userCredits}
                            </h4>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono">Créditos de Criação</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-2 max-w-md leading-relaxed">
                            Seu saldo é monitorado e validado em tempo real pelo construtor NoCode. Use estes créditos para gerar e refinar projetos.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0 relative z-10 sm:text-right">
                        <button
                          onClick={() => setUserCredits(150)}
                          className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 hover:border-white/10 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-[0.98] cursor-pointer"
                        >
                          Restaurar Saldo (150 CR)
                        </button>
                        <span className="text-[10px] text-zinc-500 font-mono">Cota de demonstração local</span>
                      </div>
                    </div>

                    {/* Quick charge buttons */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block font-sans">Pacotes de Recarga Rápida</label>
                        <span className="text-[10px] text-zinc-500">Desenvolvimento / Simulação fictícia</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { amount: 100, desc: "Recarga Básica", price: "$9", icon: Sparkles, color: "from-blue-500/10 to-indigo-500/5", border: "hover:border-blue-500/20" },
                          { amount: 500, desc: "Desenvolvedor", price: "$29", icon: Zap, color: "from-indigo-500/10 to-purple-500/5", border: "hover:border-indigo-500/30", popular: true },
                          { amount: 1000, desc: "Acesso Ilimitado", price: "$49", icon: Award, color: "from-purple-500/10 to-pink-500/5", border: "hover:border-purple-500/20" }
                        ].map((pkg) => {
                          const IconComp = pkg.icon;
                          return (
                            <button
                              key={pkg.amount}
                              onClick={() => setUserCredits(prev => prev + pkg.amount)}
                              className={`relative overflow-hidden bg-gradient-to-b ${pkg.color} bg-opacity-40 hover:bg-opacity-75 border ${pkg.popular ? 'border-indigo-500/30' : 'border-white/5'} ${pkg.border} p-6 rounded-2xl flex flex-col text-left space-y-4 transition-all group cursor-pointer shadow-lg`}
                            >
                              {pkg.popular && (
                                <span className="absolute top-3 right-3 bg-indigo-600 text-[9px] font-extrabold px-2 py-0.5 rounded-full text-white tracking-widest uppercase">Mais Popular</span>
                              )}
                              <div className="p-2 bg-white/5 rounded-xl self-start">
                                <IconComp className="w-5 h-5 text-indigo-400" />
                              </div>
                              <div>
                                <h5 className="text-xs font-black text-white uppercase tracking-wider">{pkg.desc}</h5>
                                <div className="flex items-baseline gap-1 mt-1">
                                  <span className="text-2xl font-sans font-extrabold text-white">+{pkg.amount}</span>
                                  <span className="text-xs font-bold text-zinc-500">CR</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                                <span className="text-zinc-400 font-bold">{pkg.price} USD</span>
                                <span className="text-indigo-400 font-extrabold group-hover:translate-x-1 transition-transform">Adicionar →</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-[#0c0c0e] p-5 rounded-2xl border border-white/5 text-xs text-zinc-400 space-y-3 leading-relaxed">
                      <h5 className="font-bold text-zinc-200 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-indigo-400" /> Tabela de Custo de Operações:
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-zinc-500 pl-1">
                        <div className="space-y-1">
                          <p className="flex items-center justify-between border-b border-white/5 pb-1">
                            <span>Nova Geração de Site:</span>
                            <span className="font-bold text-zinc-300">15 créditos</span>
                          </p>
                          <p className="flex items-center justify-between border-b border-white/5 pb-1">
                            <span>Refinamento por Prompt:</span>
                            <span className="font-bold text-zinc-300">10 créditos</span>
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="flex items-center justify-between border-b border-white/5 pb-1">
                            <span>Suporte e Ajuda da IA:</span>
                            <span className="font-bold text-zinc-300">Grátis</span>
                          </p>
                          <p className="flex items-center justify-between border-b border-white/5 pb-1">
                            <span>Upload e Exportação ZIP:</span>
                            <span className="font-bold text-zinc-300">Grátis</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {adminSubTab === "projects" && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-sans font-extrabold text-white tracking-tight">Histórico de Sites Gerados</h2>
                    <p className="text-xs text-zinc-400 mt-1">Carregue projetos anteriores diretamente no construtor ou delete-os de sua lista.</p>
                  </div>

                  {history.length > 0 ? (
                    <div className="space-y-3">
                      {history.map((project, i) => (
                        <div key={i} className="bg-[#09090b] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-800 transition-all">
                          <div className="space-y-1 flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white truncate pr-4">"{project.prompt}"</h4>
                            <div className="flex flex-wrap items-center gap-3 text-[10px] text-zinc-500 font-mono">
                              <span>Gerado em: {new Date(project.timestamp).toLocaleString("pt-BR")}</span>
                              <span>•</span>
                              <span className="text-indigo-400 uppercase font-bold">PHP MVC Layout</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <button
                              onClick={() => {
                                setActiveProject(project);
                                setSelectedFileName("index.php");
                                setActiveTab("builder");
                              }}
                              className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/10 rounded-xl text-xs font-semibold transition-all animate-pulse"
                              style={{ animationDuration: "3s" }}
                            >
                              Carregar no Painel
                            </button>
                            <button
                              onClick={() => {
                                const cleanHistory = history.filter((_, idx) => idx !== i);
                                setHistory(cleanHistory);
                                localStorage.setItem("nocode_generator_history", JSON.stringify(cleanHistory));
                                if (activeProject?.timestamp === project.timestamp) {
                                  setActiveProject(cleanHistory.length > 0 ? cleanHistory[0] : null);
                                }
                              }}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 rounded-xl text-red-400 transition-all cursor-pointer"
                              title="Deletar projeto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#09090b] rounded-2xl border border-white/5 p-8 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
                        <History className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-white font-bold text-sm">Nenhum projeto no histórico</h4>
                        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                          Insira sua primeira ideia na página inicial e crie um site instantaneamente para povoar seu histórico.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("home")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                      >
                        Ir Criar Agora
                      </button>
                    </div>
                  )}
                </div>
              )}

            </main>
          </div>
        )}

      </div>

      {/* Bottom Status Bar */}
      {activeTab !== "builder" && (
        <footer id="footer-status" className={`h-8 px-4 flex items-center justify-between text-[10px] text-zinc-500 shrink-0 transition-all duration-300 ${activeTab === 'home' ? 'bg-transparent border-t border-transparent' : 'bg-[#050505] border-t border-white/5'}`}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> 
              <span>Servidor PHP Virtual: Ativo</span>
            </span>
            <span className="hidden sm:inline">PHP 8.2.12</span>
            <span className="hidden sm:inline">Tailwind v4.0</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-widest font-bold">NoCode-v1.0.8-stable</span>
          </div>
        </footer>
      )}

    </div>
  );
}
