// High-Fidelity local site generator fallback
// Automatically generates gorgeous, interactive Tailwind templates if no Gemini API Key is configured

function extractBrandName(prompt: string, defaultName: string): string {
  const cleanPrompt = prompt.trim();
  const quoteMatch = cleanPrompt.match(/["'“]([^"'”]+)["'”]/);
  if (quoteMatch && quoteMatch[1]) {
    return quoteMatch[1];
  }
  
  const calledMatch = cleanPrompt.match(/(?:chamad[ao]|nome|nomead[ao]|para\s+a|para\s+o|chamado\s+de|chamada\s+de)\s+([A-ZÀ-ÿ][A-Za-zÀ-ÿ0-9'\s]+)/i);
  if (calledMatch && calledMatch[1]) {
    const candidate = calledMatch[1].trim().split(/\s{2,}/)[0];
    if (candidate.length > 2) return candidate;
  }
  
  return defaultName;
}

export function generateFallbackSite(prompt: string) {
  const promptLower = prompt.toLowerCase();
  
  // 1. Barbearia / Barber Shop
  if (promptLower.includes("barber") || promptLower.includes("barbearia") || promptLower.includes("corte") || promptLower.includes("cabelo") || promptLower.includes("barba") || promptLower.includes("salão")) {
    const brand = extractBrandName(prompt, "Barbearia Estilo & Corte");
    return {
      html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brand} | Premium Barber</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-white">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/20">
                <i data-lucide="scissors" class="w-5 h-5"></i>
            </div>
            <span class="font-extrabold text-lg tracking-tight uppercase">${brand}</span>
        </div>
        <div class="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-400">
            <a href="#inicio" class="hover:text-amber-400 transition-colors">Início</a>
            <a href="#servicos" class="hover:text-amber-400 transition-colors">Serviços</a>
            <a href="#galeria" class="hover:text-amber-400 transition-colors">Portfólio</a>
            <a href="#depoimentos" class="hover:text-amber-400 transition-colors">Avaliações</a>
        </div>
        <a href="#agendamento" class="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-amber-500/10">Agendar Agora</a>
    </nav>

    <!-- Hero -->
    <section id="inicio" class="relative min-h-[80vh] flex items-center justify-center px-6 py-20 overflow-hidden">
        <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop" class="w-full h-full object-cover opacity-20 filter grayscale" alt="Barbearia">
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950"></div>
        </div>
        <div class="relative z-10 max-w-4xl text-center space-y-6">
            <span class="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">Experiência Premium de Corte</span>
            <h1 class="text-4xl md:text-6xl font-black tracking-tight uppercase">${brand}</h1>
            <p class="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">Estilo não é apenas aparência, é identidade. Oferecemos cortes sob medida, cuidados com a barba e uma experiência única de bem-estar com profissionais experientes.</p>
            <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a href="#servicos" class="bg-zinc-900 border border-zinc-800 hover:border-amber-500/30 text-white font-bold text-sm px-6 py-3 rounded-lg transition-all">Ver Nossos Serviços</a>
                <a href="#agendamento" class="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm px-6 py-3 rounded-lg transition-all shadow-lg shadow-amber-500/15">Agendar Horário</a>
            </div>
        </div>
    </section>

    <!-- Serviços -->
    <section id="servicos" class="px-6 py-24 bg-zinc-900/30 border-y border-zinc-900">
        <div class="max-w-6xl mx-auto space-y-12">
            <div class="text-center space-y-2">
                <span class="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Nossos Cuidados</span>
                <h2 class="text-3xl font-bold uppercase tracking-tight">O que fazemos de melhor</h2>
                <p class="text-zinc-500 text-xs max-w-md mx-auto">Serviços executados com rigor técnico, ferramentas premium e os melhores produtos do mercado.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl space-y-4 hover:border-amber-500/20 transition-all group">
                    <div class="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
                        <i data-lucide="scissors" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-lg font-bold">Corte de Cabelo</h3>
                    <p class="text-zinc-400 text-xs leading-relaxed">Cortes modernos, clássicos ou artísticos executados de acordo com sua fisionomia e estilo de vida.</p>
                    <span class="text-amber-400 font-bold text-sm block">R$ 50,00</span>
                </div>
                <div class="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl space-y-4 hover:border-amber-500/20 transition-all group">
                    <div class="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
                        <i data-lucide="sparkles" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-lg font-bold">Barba Completa</h3>
                    <p class="text-zinc-400 text-xs leading-relaxed">Modelagem de barba com toalha quente, óleos essenciais, massagem facial e navalha afiada.</p>
                    <span class="text-amber-400 font-bold text-sm block">R$ 40,00</span>
                </div>
                <div class="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl space-y-4 hover:border-amber-500/20 transition-all group">
                    <div class="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
                        <i data-lucide="coffee" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-lg font-bold">Combo Master</h3>
                    <p class="text-zinc-400 text-xs leading-relaxed">A experiência definitiva: cabelo, barba, lavagem com shampoo premium e nossa cerveja especial artesanal.</p>
                    <span class="text-amber-400 font-bold text-sm block">R$ 80,00</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Galeria -->
    <section id="galeria" class="px-6 py-24">
        <div class="max-w-6xl mx-auto space-y-12">
            <div class="text-center space-y-2">
                <span class="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Galeria Visual</span>
                <h2 class="text-3xl font-bold uppercase tracking-tight">Cortes & Estilos Recentes</h2>
            </div>
            
            <!-- Interactive Filter Tab -->
            <div class="flex justify-center gap-3" id="gallery-tabs">
                <button onclick="filterGallery('todos')" class="px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 text-xs font-bold transition-all" id="tab-todos">Todos</button>
                <button onclick="filterGallery('cabelo')" class="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-bold transition-all" id="tab-cabelo">Cabelo</button>
                <button onclick="filterGallery('barba')" class="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-bold transition-all" id="tab-barba">Barba</button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" id="gallery-items">
                <div class="group relative overflow-hidden rounded-2xl border border-zinc-900 aspect-square" data-type="cabelo">
                    <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600&auto=format&fit=crop" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Fade Cut">
                    <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <div>
                            <span class="text-amber-400 text-[10px] font-bold uppercase tracking-wider">Corte Degradê</span>
                            <h4 class="text-white font-bold text-sm">Degradê Americano (Fade)</h4>
                        </div>
                    </div>
                </div>
                <div class="group relative overflow-hidden rounded-2xl border border-zinc-900 aspect-square" data-type="barba">
                    <img src="https://images.unsplash.com/photo-1593702295094-aea22597af65?q=80&w=600&auto=format&fit=crop" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Beard Shave">
                    <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <div>
                            <span class="text-amber-400 text-[10px] font-bold uppercase tracking-wider">Barboterapia</span>
                            <h4 class="text-white font-bold text-sm">Alinhamento de Barba Completa</h4>
                        </div>
                    </div>
                </div>
                <div class="group relative overflow-hidden rounded-2xl border border-zinc-900 aspect-square" data-type="cabelo">
                    <img src="https://images.unsplash.com/photo-1605497746444-ac9dbd53d450?q=80&w=600&auto=format&fit=crop" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Pompadour Cut">
                    <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <div>
                            <span class="text-amber-400 text-[10px] font-bold uppercase tracking-wider">Estilo Clássico</span>
                            <h4 class="text-white font-bold text-sm">Pompadour Modernizado</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Depoimentos -->
    <section id="depoimentos" class="px-6 py-24 bg-zinc-900/20 border-t border-zinc-900">
        <div class="max-w-5xl mx-auto space-y-12">
            <div class="text-center space-y-2">
                <span class="text-[10px] font-bold text-amber-500 uppercase tracking-widest">O que dizem</span>
                <h2 class="text-3xl font-bold uppercase tracking-tight">Avaliações dos Clientes</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
                    <div class="flex items-center gap-1 text-amber-400">
                        <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                        <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                        <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                        <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                        <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                    </div>
                    <p class="text-zinc-300 text-xs leading-relaxed italic">"O melhor ambiente da cidade. Fazer a barba aqui é uma terapia, toalha quente e massagem sensacionais. Atendimento de primeira."</p>
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-xs">M</div>
                        <div>
                            <h4 class="font-bold text-xs">Maurício Silva</h4>
                            <span class="text-zinc-500 text-[10px]">Cliente Mensal</span>
                        </div>
                    </div>
                </div>
                <div class="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
                    <div class="flex items-center gap-1 text-amber-400">
                        <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                        <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                        <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                        <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                        <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                    </div>
                    <p class="text-zinc-300 text-xs leading-relaxed italic">"Cortei o cabelo com o design degradê e ficou perfeito. A cerveja cortesia e a conversa de alto nível são bônus incríveis."</p>
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-xs">G</div>
                        <div>
                            <h4 class="font-bold text-xs">Gabriel Neves</h4>
                            <span class="text-zinc-500 text-[10px]">Cliente Assíduo</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Agendamento -->
    <section id="agendamento" class="px-6 py-24">
        <div class="max-w-lg mx-auto bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6 shadow-xl relative">
            <div class="text-center space-y-2">
                <i data-lucide="calendar" class="w-8 h-8 text-amber-400 mx-auto"></i>
                <h3 class="text-xl font-bold uppercase tracking-tight">Reserve seu Horário</h3>
                <p class="text-zinc-500 text-xs">Preencha os dados e escolha o serviço para agendar imediatamente.</p>
            </div>
            <form id="booking-form" onsubmit="submitForm(event)" class="space-y-4">
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Seu Nome</label>
                    <input type="text" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all" placeholder="Digite seu nome completo">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Telefone</label>
                        <input type="tel" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all" placeholder="(11) 99999-9999">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Escolha o Serviço</label>
                        <select required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all">
                            <option value="cabelo">Corte de Cabelo (R$ 50)</option>
                            <option value="barba">Barba Completa (R$ 40)</option>
                            <option value="combo">Combo Master (R$ 80)</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Data</label>
                        <input type="date" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Hora</label>
                        <input type="time" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all">
                    </div>
                </div>
                <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-amber-500/10 uppercase tracking-wider">Confirmar Agendamento</button>
            </form>
        </div>
    </section>

    <!-- Success Modal -->
    <div id="success-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-zinc-900 border border-zinc-800 max-w-sm w-full p-6 rounded-3xl text-center space-y-4 shadow-2xl">
            <div class="w-12 h-12 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto">
                <i data-lucide="check" class="w-6 h-6"></i>
            </div>
            <div>
                <h4 class="text-white font-bold text-base">Agendamento Solicitado!</h4>
                <p class="text-zinc-400 text-xs mt-1">Seu horário foi reservado com sucesso no sistema. Entraremos em contato para confirmar!</p>
            </div>
            <button onclick="closeModal()" class="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs py-2.5 rounded-xl transition-all">Entendido</button>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-zinc-950 border-t border-zinc-900 py-12 px-6 text-center space-y-6 text-zinc-500 text-xs">
        <div class="flex items-center justify-center gap-2 text-zinc-300">
            <i data-lucide="scissors" class="w-4 h-4 text-amber-500"></i>
            <span class="font-extrabold tracking-widest uppercase">${brand}</span>
        </div>
        <p>&copy; 2026 ${brand}. Todos os direitos reservados. Design moderno no-code.</p>
    </footer>

    <script>
        // Initialize Lucide Icons
        lucide.createIcons();

        // Interactive Gallery Filtering
        function filterGallery(type) {
            const items = document.querySelectorAll('#gallery-items > div');
            const tabs = document.querySelectorAll('#gallery-tabs > button');
            
            tabs.forEach(tab => {
                tab.classList.remove('bg-amber-500', 'text-zinc-950');
                tab.classList.add('bg-zinc-900', 'text-zinc-400');
            });

            const activeTab = document.getElementById('tab-' + type);
            if (activeTab) {
                activeTab.classList.remove('bg-zinc-900', 'text-zinc-400');
                activeTab.classList.add('bg-amber-500', 'text-zinc-950');
            }

            items.forEach(item => {
                if (type === 'todos' || item.getAttribute('data-type') === type) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Form Submission
        function submitForm(e) {
            e.preventDefault();
            document.getElementById('success-modal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('success-modal').classList.add('hidden');
            document.getElementById('booking-form').reset();
        }
    </script>
</body>
</html>`,
      css: `@keyframes pulseGlow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }`,
      js: `console.log('${brand} inicializada com sucesso em modo de alta performance.');`,
      explanation: "Criamos um site completo e responsivo para uma Barbearia de alto nível, utilizando um tema escuro luxuoso com detalhes dourados (amber). O site inclui uma seção Hero impactante, lista de serviços com cards de preços, portfólio de cortes interativo com filtro por categoria de serviços, bloco de avaliações de clientes e um formulário de reserva completo integrado a uma janela popup (modal) de sucesso em puro JavaScript."
    };
  }
  
  // 2. Restaurante / Alimentação / Pizza
  if (promptLower.includes("pizza") || promptLower.includes("restaurante") || promptLower.includes("burger") || promptLower.includes("comida") || promptLower.includes("gourmet") || promptLower.includes("café") || promptLower.includes("sushi") || promptLower.includes("doce") || promptLower.includes("confeitaria")) {
    const brand = extractBrandName(prompt, "Bistrô Gourmet");
    return {
      html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brand} | Experiência Gastronômica</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-[#faf9f6] text-stone-800 font-sans selection:bg-emerald-500/10 selection:text-emerald-900">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-[#faf9f6]/90 backdrop-blur-md border-b border-stone-200/50 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                <i data-lucide="utensils" class="w-5 h-5"></i>
            </div>
            <span class="font-extrabold text-lg tracking-tight text-emerald-800">${brand}</span>
        </div>
        <div class="hidden md:flex items-center gap-8 text-sm font-bold text-stone-500">
            <a href="#inicio" class="hover:text-emerald-600 transition-colors">Início</a>
            <a href="#cardapio" class="hover:text-emerald-600 transition-colors">Nosso Menu</a>
            <a href="#diferenciais" class="hover:text-emerald-600 transition-colors">Diferenciais</a>
            <a href="#depoimentos" class="hover:text-emerald-600 transition-colors">Avaliações</a>
        </div>
        <a href="#reserva" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/15">Reservar Mesa</a>
    </nav>

    <!-- Hero -->
    <section id="inicio" class="relative min-h-[85vh] flex items-center justify-center px-6 py-20 overflow-hidden">
        <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop" class="w-full h-full object-cover opacity-15" alt="Gastronomia">
            <div class="absolute inset-0 bg-gradient-to-b from-[#faf9f6]/20 via-[#faf9f6] to-[#faf9f6]"></div>
        </div>
        <div class="relative z-10 max-w-4xl text-center space-y-6">
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">Sabor, Amor & Tradição</span>
            <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-stone-900 leading-tight">Momentos inesquecíveis para o seu paladar</h1>
            <p class="text-stone-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">Cozinha autoral com ingredientes selecionados, ervas frescas colhidas na hora e um toque contemporâneo do nosso chef premiado para alimentar sua alma.</p>
            <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a href="#cardapio" class="bg-white border border-stone-200 shadow-sm hover:border-emerald-600/30 text-stone-700 font-bold text-sm px-6 py-3 rounded-xl transition-all">Ver Nosso Menu</a>
                <a href="#reserva" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/15">Escolher Mesa</a>
            </div>
        </div>
    </section>

    <!-- Diferenciais -->
    <section id="diferenciais" class="px-6 py-24 bg-stone-100/50 border-y border-stone-200/50">
        <div class="max-w-6xl mx-auto space-y-12">
            <div class="text-center space-y-2">
                <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Nossos Diferenciais</span>
                <h2 class="text-3xl font-extrabold text-stone-900 tracking-tight">O Segredo da Nossa Cozinha</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white border border-stone-200/60 p-6 rounded-2xl text-center space-y-3">
                    <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 mx-auto">
                        <i data-lucide="leaf" class="w-6 h-6"></i>
                    </div>
                    <h3 class="font-bold text-sm text-stone-900">Ingredientes Orgânicos</h3>
                    <p class="text-stone-500 text-[11px] leading-relaxed">Legumes, verduras e temperos adquiridos diariamente de produtores locais selecionados.</p>
                </div>
                <div class="bg-white border border-stone-200/60 p-6 rounded-2xl text-center space-y-3">
                    <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 mx-auto">
                        <i data-lucide="chef-hat" class="w-6 h-6"></i>
                    </div>
                    <h3 class="font-bold text-sm text-stone-900">Chef de Renome</h3>
                    <p class="text-stone-500 text-[11px] leading-relaxed">Criações exclusivas que harmonizam sabores clássicos da culinária com técnicas modernas.</p>
                </div>
                <div class="bg-white border border-stone-200/60 p-6 rounded-2xl text-center space-y-3">
                    <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 mx-auto">
                        <i data-lucide="award" class="w-6 h-6"></i>
                    </div>
                    <h3 class="font-bold text-sm text-stone-900">Carta de Vinhos</h3>
                    <p class="text-stone-500 text-[11px] leading-relaxed">Uma adega completa com rótulos importados e nacionais perfeitos para harmonização.</p>
                </div>
                <div class="bg-white border border-stone-200/60 p-6 rounded-2xl text-center space-y-3">
                    <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 mx-auto">
                        <i data-lucide="heart" class="w-6 h-6"></i>
                    </div>
                    <h3 class="font-bold text-sm text-stone-900">Espaço Aconchegante</h3>
                    <p class="text-stone-500 text-[11px] leading-relaxed">Arquitetura rústico-chique ideal para jantares românticos ou reuniões em família.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Cardápio Interativo -->
    <section id="cardapio" class="px-6 py-24">
        <div class="max-w-5xl mx-auto space-y-12">
            <div class="text-center space-y-2">
                <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Opções do Chef</span>
                <h2 class="text-3xl font-extrabold text-stone-900 tracking-tight">Nosso Cardápio Selecionado</h2>
            </div>
            
            <!-- Filters -->
            <div class="flex justify-center gap-2" id="menu-tabs">
                <button onclick="filterMenu('todos')" class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold transition-all" id="tab-todos">Tudo</button>
                <button onclick="filterMenu('principais')" class="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-600 text-xs font-bold transition-all" id="tab-principais">Principais</button>
                <button onclick="filterMenu('sobremesas')" class="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-600 text-xs font-bold transition-all" id="tab-sobremesas">Sobremesas</button>
            </div>

            <!-- Menu Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8" id="menu-items">
                <div class="bg-white border border-stone-200/60 p-4 rounded-2xl flex gap-4" data-category="principais">
                    <img src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=300&auto=format&fit=crop" class="w-24 h-24 object-cover rounded-xl shrink-0" alt="Filet">
                    <div class="flex-grow flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-stone-900 text-sm">Filé de Costela com Alecrim</h4>
                            <p class="text-stone-500 text-[11px] mt-1">Filé bovino premium grelhado, acompanhado de batatas rústicas douradas e molho do chef.</p>
                        </div>
                        <span class="text-emerald-700 font-bold text-sm block">R$ 78,00</span>
                    </div>
                </div>
                <div class="bg-white border border-stone-200/60 p-4 rounded-2xl flex gap-4" data-category="principais">
                    <img src="https://images.unsplash.com/photo-1574484284002-982da33611f5?q=80&w=300&auto=format&fit=crop" class="w-24 h-24 object-cover rounded-xl shrink-0" alt="Peixe">
                    <div class="flex-grow flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-stone-900 text-sm">Salmão em Crosta de Ervas</h4>
                            <p class="text-stone-500 text-[11px] mt-1">Posta de salmão grelhada com crosta de ervas finas, servida sobre cama de risoto de limão siciliano.</p>
                        </div>
                        <span class="text-emerald-700 font-bold text-sm block">R$ 84,00</span>
                    </div>
                </div>
                <div class="bg-white border border-stone-200/60 p-4 rounded-2xl flex gap-4" data-category="sobremesas">
                    <img src="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=300&auto=format&fit=crop" class="w-24 h-24 object-cover rounded-xl shrink-0" alt="Doce">
                    <div class="flex-grow flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-stone-900 text-sm">Petit Gâteau de Pistache</h4>
                            <p class="text-stone-500 text-[11px] mt-1">Bolinho quente de pistache com interior cremoso, acompanhado de sorvete de baunilha artesanal.</p>
                        </div>
                        <span class="text-emerald-700 font-bold text-sm block">R$ 28,00</span>
                    </div>
                </div>
                <div class="bg-white border border-stone-200/60 p-4 rounded-2xl flex gap-4" data-category="sobremesas">
                    <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=300&auto=format&fit=crop" class="w-24 h-24 object-cover rounded-xl shrink-0" alt="Donuts">
                    <div class="flex-grow flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-stone-900 text-sm">Crème Brûlée Clássico</h4>
                            <p class="text-stone-500 text-[11px] mt-1">Creme de baunilha com favas naturais finalizado com casquinha crocante de açúcar queimado.</p>
                        </div>
                        <span class="text-emerald-700 font-bold text-sm block">R$ 24,00</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Reserva de Mesa -->
    <section id="reserva" class="px-6 py-24 bg-stone-100/30 border-t border-stone-200/30">
        <div class="max-w-md mx-auto bg-white border border-stone-200 p-8 rounded-3xl space-y-6 shadow-md relative">
            <div class="text-center space-y-2">
                <i data-lucide="calendar" class="w-8 h-8 text-emerald-600 mx-auto"></i>
                <h3 class="text-xl font-bold text-stone-900 tracking-tight">Faça sua Reserva</h3>
                <p class="text-stone-500 text-xs">Agende uma mesa para o seu jantar de forma instantânea e garanta sua vaga.</p>
            </div>
            <form id="reservation-form" onsubmit="submitReservation(event)" class="space-y-4">
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Seu Nome</label>
                    <input type="text" required class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-600 transition-all" placeholder="Digite seu nome">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Número de Pessoas</label>
                        <select required class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-600 transition-all">
                            <option value="2">2 Pessoas</option>
                            <option value="4">4 Pessoas</option>
                            <option value="6">6 Pessoas</option>
                            <option value="8">8+ Pessoas</option>
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Ocasião</label>
                        <select class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-600 transition-all">
                            <option value="comum">Jantar Casual</option>
                            <option value="aniversario">Aniversário</option>
                            <option value="romantico">Romântico</option>
                            <option value="negocios">Negócios</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Data</label>
                        <input type="date" required class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-600 transition-all">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Hora</label>
                        <input type="time" required class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-600 transition-all">
                    </div>
                </div>
                <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/10 uppercase tracking-wider">Solicitar Mesa</button>
            </form>
        </div>
    </section>

    <!-- Success Modal -->
    <div id="success-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-white border border-stone-200 max-w-sm w-full p-6 rounded-3xl text-center space-y-4 shadow-xl">
            <div class="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <i data-lucide="check" class="w-6 h-6"></i>
            </div>
            <div>
                <h4 class="text-stone-900 font-bold text-base">Mesa Reservada!</h4>
                <p class="text-stone-500 text-xs mt-1">Sua mesa foi reservada com sucesso no sistema. Enviamos uma notificação de confirmação e aguardamos você!</p>
            </div>
            <button onclick="closeModal()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all">Ótimo, obrigado!</button>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-stone-900 border-t border-stone-800 py-12 px-6 text-center space-y-6 text-stone-500 text-xs">
        <div class="flex items-center justify-center gap-2 text-white">
            <i data-lucide="utensils" class="w-4 h-4 text-emerald-500"></i>
            <span class="font-extrabold uppercase">${brand}</span>
        </div>
        <p>&copy; 2026 ${brand}. Todos os direitos reservados. Gastronomia No-Code de alta performance.</p>
    </footer>

    <script>
        lucide.createIcons();

        // Filter Menu
        function filterMenu(category) {
            const items = document.querySelectorAll('#menu-items > div');
            const tabs = document.querySelectorAll('#menu-tabs > button');
            
            tabs.forEach(tab => {
                tab.classList.remove('bg-emerald-600', 'text-white');
                tab.classList.add('bg-stone-200', 'text-stone-600');
            });

            const activeTab = document.getElementById('tab-' + category);
            if (activeTab) {
                activeTab.classList.remove('bg-stone-200', 'text-stone-600');
                activeTab.classList.add('bg-emerald-600', 'text-white');
            }

            items.forEach(item => {
                if (category === 'todos' || item.getAttribute('data-category') === category) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Booking submission
        function submitReservation(e) {
            e.preventDefault();
            document.getElementById('success-modal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('success-modal').classList.add('hidden');
            document.getElementById('reservation-form').reset();
        }
    </script>
</body>
</html>`,
      css: ``,
      js: ``,
      explanation: "Criamos um belíssimo site de página única (SPA) para Restaurante, Café ou Hambúrgueria Gourmet, utilizando um tema leve e elegante baseado em tons creme e sálvia/esmeralda. Apresenta uma seção Hero que estimula o apetite, bloco completo de diferenciais, um cardápio de pratos e sobremesas interativo que filtra os itens dinamicamente via abas em JavaScript puro, e um formulário de reserva de mesas de restaurante integrado a uma tela modal de sucesso estilizada."
    };
  }

  // 3. Advogado / Direito / Consultoria
  if (promptLower.includes("advogad") || promptLower.includes("direito") || promptLower.includes("jurídic") || promptLower.includes("lawyer") || promptLower.includes("consultoria") || promptLower.includes("advocacia")) {
    const brand = extractBrandName(prompt, "Advocacia Associada");
    return {
      html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brand} | Soluções Jurídicas Eficazes</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-slate-50 text-slate-800 font-sans selection:bg-blue-500/10 selection:text-blue-900">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-slate-50/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-blue-400">
                <i data-lucide="scale" class="w-5 h-5"></i>
            </div>
            <span class="font-extrabold text-lg text-slate-900 tracking-tight uppercase">${brand}</span>
        </div>
        <div class="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider uppercase text-slate-500">
            <a href="#inicio" class="hover:text-blue-600 transition-colors">Início</a>
            <a href="#atuacao" class="hover:text-blue-600 transition-colors">Áreas de Atuação</a>
            <a href="#sobre" class="hover:text-blue-600 transition-colors">O Escritório</a>
            <a href="#contato" class="hover:text-blue-600 transition-colors">Fale Conosco</a>
        </div>
        <a href="#contato" class="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all shadow-md shadow-slate-950/10">Falar com Advogado</a>
    </nav>

    <!-- Hero -->
    <section id="inicio" class="relative min-h-[80vh] flex items-center px-6 py-20 bg-slate-900 text-white overflow-hidden">
        <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" class="w-full h-full object-cover opacity-15" alt="Escritório">
            <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
        </div>
        <div class="relative z-10 max-w-3xl space-y-6">
            <span class="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-md">Atuação e Ética Profissional</span>
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">${brand}</h1>
            <p class="text-slate-400 text-xs md:text-sm max-w-xl leading-relaxed">Nosso compromisso é defender seus direitos com excelência, transparência e dedicação absoluta. Oferecemos soluções jurídicas inovadoras em diversas áreas do direito para garantir sua segurança e tranquilidade.</p>
            <div class="flex flex-wrap gap-4 pt-4">
                <a href="#atuacao" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-lg transition-all shadow-lg shadow-blue-600/15">Áreas de Atuação</a>
                <a href="#contato" class="bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 font-bold text-xs px-6 py-3 rounded-lg transition-all">Consulta On-line</a>
            </div>
        </div>
    </section>

    <!-- Áreas de Atuação -->
    <section id="atuacao" class="px-6 py-24">
        <div class="max-w-6xl mx-auto space-y-12">
            <div class="text-center space-y-2">
                <span class="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Serviços Advocatícios</span>
                <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Especialidades Jurídicas</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-sm hover:border-blue-500/30 transition-all">
                    <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600">
                        <i data-lucide="building" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-base font-bold text-slate-900">Direito Civil</h3>
                    <p class="text-slate-500 text-[11px] leading-relaxed">Atuação preventiva e litigiosa em contratos, responsabilidade civil, direitos das obrigações e direito imobiliário completo.</p>
                </div>
                <div class="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-sm hover:border-blue-500/30 transition-all">
                    <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600">
                        <i data-lucide="briefcase" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-base font-bold text-slate-900">Direito do Trabalho</h3>
                    <p class="text-slate-500 text-[11px] leading-relaxed">Defesa jurídica de interesses trabalhistas com foco em consultoria preventiva de empresas e resguardo de direitos de trabalhadores.</p>
                </div>
                <div class="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-sm hover:border-blue-500/30 transition-all">
                    <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600">
                        <i data-lucide="file-text" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-base font-bold text-slate-900">Planejamento Familiar</h3>
                    <p class="text-slate-500 text-[11px] leading-relaxed">Assessoria personalizada para inventários, heranças, divórcios consensuais e planejamento sucessório patrimonial inteligente.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contato -->
    <section id="contato" class="px-6 py-24 bg-slate-100 border-t border-slate-200">
        <div class="max-w-lg mx-auto bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm space-y-6">
            <div class="text-center space-y-2">
                <i data-lucide="mail" class="w-8 h-8 text-blue-600 mx-auto"></i>
                <h3 class="text-xl font-bold text-slate-900">Entre em Contato</h3>
                <p class="text-slate-500 text-xs">Agende uma consulta presencial ou virtual com nossos especialistas.</p>
            </div>
            <form onsubmit="submitContact(event)" id="contact-form" class="space-y-4">
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Seu Nome</label>
                    <input type="text" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition-all" placeholder="Nome completo">
                </div>
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">E-mail para Contato</label>
                    <input type="email" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition-all" placeholder="seu-email@dominio.com">
                </div>
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assunto / Descrição do Caso</label>
                    <textarea required rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition-all resize-none" placeholder="Conte-nos brevemente o seu caso..."></textarea>
                </div>
                <button type="submit" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-lg transition-all shadow-md shadow-slate-900/10 uppercase tracking-wider">Enviar Solicitação</button>
            </form>
        </div>
    </section>

    <!-- Success Popup -->
    <div id="success-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-white border border-slate-200 max-w-sm w-full p-6 rounded-2xl text-center space-y-4 shadow-lg">
            <div class="w-12 h-12 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto">
                <i data-lucide="check" class="w-6 h-6"></i>
            </div>
            <div>
                <h4 class="text-slate-900 font-bold text-base">Solicitação Enviada!</h4>
                <p class="text-slate-500 text-xs mt-1">Sua mensagem foi entregue com sucesso aos advogados do escritório. Retornaremos em breve por e-mail ou telefone.</p>
            </div>
            <button onclick="closeModal()" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-lg transition-all">Fechar</button>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-slate-950 border-t border-slate-900 py-12 px-6 text-center space-y-6 text-slate-500 text-xs">
        <div class="flex items-center justify-center gap-2 text-white">
            <i data-lucide="scale" class="w-4 h-4 text-blue-500"></i>
            <span class="font-extrabold uppercase">${brand}</span>
        </div>
        <p>&copy; 2026 ${brand}. Todos os direitos reservados. Atuação jurídica ética de alta integridade.</p>
    </footer>

    <script>
        lucide.createIcons();

        function submitContact(e) {
            e.preventDefault();
            document.getElementById('success-modal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('success-modal').classList.add('hidden');
            document.getElementById('contact-form').reset();
        }
    </script>
</body>
</html>`,
      css: ``,
      js: ``,
      explanation: "Criamos um site corporativo e elegante para Advocacia e Consultoria Jurídica, aplicando um layout de alta seriedade em tons de ardósia (slate), azul executivo e detalhes metálicos. Ele contém uma seção Hero escura majestosa com imagem de fundo, estatísticas de conquistas, grid explicativo de especialidades de atuação civil/trabalhista, e um formulário de solicitação de agendamento de casos que mostra popup inteligente de entrega de dados."
    };
  }

  // 4. Portfólio Pessoal / Freelancer / Designer
  if (promptLower.includes("portfólio") || promptLower.includes("portfolio") || promptLower.includes("currículo") || promptLower.includes("cv") || promptLower.includes("designer") || promptLower.includes("freelancer") || promptLower.includes("desenvolvedor")) {
    const brand = extractBrandName(prompt, "Lucas Designer");
    return {
      html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brand} | Portfolio de Criações</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-[#0b0a12] text-[#d4d1e2] font-sans selection:bg-purple-500/20 selection:text-white">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-[#0b0a12]/80 backdrop-blur-md border-b border-[#1b192c] px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-purple-600/25">
                <i data-lucide="sparkles" class="w-5 h-5"></i>
            </div>
            <span class="font-bold text-base text-white tracking-tight">${brand}</span>
        </div>
        <div class="hidden md:flex items-center gap-8 text-xs font-medium text-[#9d99b9]">
            <a href="#portfolio" class="hover:text-white transition-colors">Portfólio</a>
            <a href="#sobre" class="hover:text-white transition-colors">Sobre Mim</a>
            <a href="#habilidades" class="hover:text-white transition-colors">Habilidades</a>
        </div>
        <a href="#contato" class="bg-white text-purple-950 hover:bg-zinc-200 font-bold text-xs px-5 py-2.5 rounded-lg transition-all">Me Contrate</a>
    </nav>

    <!-- Hero -->
    <section class="relative min-h-[80vh] flex items-center justify-center px-6 py-20 text-center">
        <div class="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
            <div class="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]"></div>
            <div class="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]"></div>
        </div>
        <div class="relative z-10 max-w-3xl space-y-6">
            <span class="text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full">UI/UX Designer & Frontend</span>
            <h1 class="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase">Eu crio experiências digitais incríveis</h1>
            <p class="text-[#9692b1] text-xs md:text-sm max-w-lg mx-auto leading-relaxed">Olá, sou ${brand}. Desenvolvedor frontend e designer que cria layouts estéticos, limpos, dinâmicos e focados na usabilidade máxima para marcas ambiciosas ao redor do mundo.</p>
            <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a href="#portfolio" class="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-3 rounded-lg transition-all shadow-lg shadow-purple-600/15">Ver Trabalhos</a>
                <a href="#contato" class="bg-[#141221] border border-purple-500/10 hover:border-purple-500/30 text-white font-bold text-xs px-6 py-3 rounded-lg transition-all">Conversar</a>
            </div>
        </div>
    </section>

    <!-- Habilidades -->
    <section id="habilidades" class="px-6 py-20 bg-[#07060d] border-y border-[#151327]">
        <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="space-y-2">
                <div class="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                    <i data-lucide="layout" class="w-5 h-5"></i>
                </div>
                <h3 class="text-white font-bold text-sm">Visual Design</h3>
                <p class="text-[#8480a4] text-xs leading-relaxed">Criação de marcas, identidades visuais limpas e wireframes elegantes em alta fidelidade.</p>
            </div>
            <div class="space-y-2">
                <div class="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                    <i data-lucide="code" class="w-5 h-5"></i>
                </div>
                <h3 class="text-white font-bold text-sm">Desenvolvimento</h3>
                <p class="text-[#8480a4] text-xs leading-relaxed">Desenvolvimento rápido de interfaces performáticas utilizando React, Tailwind CSS e Vanilla JS.</p>
            </div>
            <div class="space-y-2">
                <div class="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                    <i data-lucide="target" class="w-5 h-5"></i>
                </div>
                <h3 class="text-white font-bold text-sm">User Experience</h3>
                <p class="text-[#8480a4] text-xs leading-relaxed">Testes de usabilidade e fluxos focados no crescimento de conversão e fidelização do cliente.</p>
            </div>
        </div>
    </section>

    <!-- Projetos -->
    <section id="portfolio" class="px-6 py-24">
        <div class="max-w-6xl mx-auto space-y-12">
            <div class="text-center space-y-2">
                <span class="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Trabalhos Selecionados</span>
                <h2 class="text-3xl font-black text-white tracking-tight uppercase">Meus Projetos Recentes</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="group relative overflow-hidden rounded-2xl border border-[#1b192c]">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" class="w-full h-64 object-cover" alt="SaaS Project">
                    <div class="p-6 bg-[#11101b] space-y-2">
                        <span class="text-purple-400 text-[10px] font-bold uppercase tracking-wider">Web Application</span>
                        <h3 class="text-white font-bold text-sm">SaaS Interface Analytics</h3>
                        <p class="text-[#8480a4] text-xs leading-relaxed">Painel de dados minimalista focado em monitoramento de conversão em tempo real de e-commerces.</p>
                    </div>
                </div>
                <div class="group relative overflow-hidden rounded-2xl border border-[#1b192c]">
                    <img src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop" class="w-full h-64 object-cover" alt="Visual Brand">
                    <div class="p-6 bg-[#11101b] space-y-2">
                        <span class="text-purple-400 text-[10px] font-bold uppercase tracking-wider">Visual Branding</span>
                        <h3 class="text-white font-bold text-sm">NFT Market App Brand</h3>
                        <p class="text-[#8480a4] text-xs leading-relaxed">Processo de criação completo, branding e layout interativo para aplicativo mobile de artes criptográficas.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contato -->
    <section id="contato" class="px-6 py-24 bg-[#07060d]">
        <div class="max-w-lg mx-auto bg-[#11101b] border border-[#1b192c] p-8 rounded-3xl space-y-6">
            <div class="text-center space-y-2">
                <i data-lucide="message-square" class="w-8 h-8 text-purple-400 mx-auto"></i>
                <h3 class="text-xl font-bold text-white uppercase">Vamos conversar?</h3>
                <p class="text-[#8480a4] text-xs">Preencha o formulário e receba uma proposta personalizada de orçamento.</p>
            </div>
            <form onsubmit="submitForm(event)" id="hire-form" class="space-y-4">
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-[#8480a4] uppercase tracking-wider">Seu E-mail</label>
                    <input type="email" required class="w-full bg-[#0b0a12] border border-[#1b192c] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-all" placeholder="voce@exemplo.com">
                </div>
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-[#8480a4] uppercase tracking-wider">Ideia do Projeto</label>
                    <textarea required rows="4" class="w-full bg-[#0b0a12] border border-[#1b192c] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-all resize-none" placeholder="Qual o seu projeto ou necessidade de design?"></textarea>
                </div>
                <button type="submit" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-purple-600/10 uppercase tracking-wider">Enviar Mensagem</button>
            </form>
        </div>
    </section>

    <!-- Modal Success -->
    <div id="success-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-[#11101b] border border-[#1b192c] max-w-sm w-full p-6 rounded-3xl text-center space-y-4">
            <div class="w-12 h-12 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto">
                <i data-lucide="check" class="w-6 h-6"></i>
            </div>
            <div>
                <h4 class="text-white font-bold text-base">Mensagem Enviada!</h4>
                <p class="text-[#8480a4] text-xs mt-1">Sua proposta foi registrada. Entrarei em contato em até 24 horas úteis. Obrigado!</p>
            </div>
            <button onclick="closeModal()" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all">Fechar</button>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-[#07060d] border-t border-[#151327] py-12 px-6 text-center space-y-4 text-xs text-[#5f5a7e]">
        <span class="font-bold text-white tracking-widest">${brand}</span>
        <p>&copy; 2026 ${brand}. Todos os direitos reservados. Feito com capricho e CSS moderno.</p>
    </footer>

    <script>
        lucide.createIcons();

        function submitForm(e) {
            e.preventDefault();
            document.getElementById('success-modal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('success-modal').classList.add('hidden');
            document.getElementById('hire-form').reset();
        }
    </script>
</body>
</html>`,
      css: ``,
      js: ``,
      explanation: "Criamos um portfólio pessoal moderno e responsivo para designers ou desenvolvedores freelancers, utilizando um tema escuro imersivo com orbes de fundo desfocados (neon glows) e detalhes em roxo/violeta. Apresenta uma cabeçalho de menu fixo, seção Hero minimalista, lista de principais habilidades, grid para exibição de projetos com animações de foco e um formulário de contato integrado com modal animado."
    };
  }

  // 5. Saúde / Academia / Clínicas
  if (promptLower.includes("academia") || promptLower.includes("fitness") || promptLower.includes("gym") || promptLower.includes("treino") || promptLower.includes("crossfit") || promptLower.includes("saúde") || promptLower.includes("médic") || promptLower.includes("dentista") || promptLower.includes("clínica")) {
    const brand = extractBrandName(prompt, "Vigor Saúde & Bem-estar");
    return {
      html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brand} | Força e Vitalidade</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-white">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-zinc-950 shadow-md shadow-cyan-500/20">
                <i data-lucide="activity" class="w-5 h-5"></i>
            </div>
            <span class="font-black text-lg tracking-wider uppercase text-white">${brand}</span>
        </div>
        <div class="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <a href="#inicio" class="hover:text-cyan-400 transition-colors">Início</a>
            <a href="#planos" class="hover:text-cyan-400 transition-colors">Planos</a>
            <a href="#servicos" class="hover:text-cyan-400 transition-colors">Especialidades</a>
        </div>
        <a href="#inscricao" class="bg-cyan-500 hover:bg-cyan-600 text-zinc-950 font-extrabold text-xs px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-cyan-500/10">Matricular-se</a>
    </nav>

    <!-- Hero -->
    <section id="inicio" class="relative min-h-[80vh] flex items-center justify-center px-6 py-20 overflow-hidden">
        <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop" class="w-full h-full object-cover opacity-20 filter contrast-125" alt="Treino">
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950"></div>
        </div>
        <div class="relative z-10 max-w-4xl text-center space-y-6">
            <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full">Sua Transformação Começa Hoje</span>
            <h1 class="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none">Ultrapasse Seus Limites Físicos</h1>
            <p class="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">Conquiste o corpo e a mente dos seus sonhos com infraestrutura de ponta, acompanhamento de personal trainers qualificados e treinos dinâmicos para todos os níveis.</p>
            <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a href="#planos" class="bg-zinc-900 border border-zinc-800 hover:border-cyan-500/30 text-white font-bold text-xs px-6 py-3 rounded-lg transition-all">Conhecer Planos</a>
                <a href="#inscricao" class="bg-cyan-500 hover:bg-cyan-600 text-zinc-950 font-bold text-xs px-6 py-3 rounded-lg transition-all shadow-lg shadow-cyan-500/15">Começar Treino</a>
            </div>
        </div>
    </section>

    <!-- Serviços -->
    <section id="servicos" class="px-6 py-24 bg-zinc-900/30 border-y border-zinc-900">
        <div class="max-w-6xl mx-auto space-y-12">
            <div class="text-center space-y-2">
                <span class="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Modalidades</span>
                <h2 class="text-3xl font-black uppercase">Treinos de Alta Performance</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-zinc-900/50 border border-zinc-850 p-6 rounded-2xl space-y-4 hover:border-cyan-500/20 transition-all">
                    <div class="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                        <i data-lucide="flame" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-lg font-bold">Crossfit & Funcional</h3>
                    <p class="text-zinc-400 text-xs leading-relaxed">Exercícios de alta intensidade com peso corporal e levantamento olímpico para queimar calorias e ganhar força.</p>
                </div>
                <div class="bg-zinc-900/50 border border-zinc-850 p-6 rounded-2xl space-y-4 hover:border-cyan-500/20 transition-all">
                    <div class="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                        <i data-lucide="trophy" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-lg font-bold">Musculação Clássica</h3>
                    <p class="text-zinc-400 text-xs leading-relaxed">Equipamentos modernos e treinos periodizados para ganho de massa muscular, definição de membros e postura.</p>
                </div>
                <div class="bg-zinc-900/50 border border-zinc-850 p-6 rounded-2xl space-y-4 hover:border-cyan-500/20 transition-all">
                    <div class="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                        <i data-lucide="clock" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-lg font-bold">Spinning & Cardio</h3>
                    <p class="text-zinc-400 text-xs leading-relaxed">Aulas dinâmicas sobre bikes profissionais focadas em queima lipídica intensa e aumento de resistência pulmonar.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Inscrição -->
    <section id="inscricao" class="px-6 py-24">
        <div class="max-w-lg mx-auto bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6 shadow-xl relative">
            <div class="text-center space-y-2">
                <i data-lucide="user-plus" class="w-8 h-8 text-cyan-400 mx-auto"></i>
                <h3 class="text-xl font-bold uppercase tracking-wider">Formulário de Matrícula</h3>
                <p class="text-zinc-500 text-xs">Preencha seus dados de pré-matrícula e receba as instruções no celular.</p>
            </div>
            <form onsubmit="submitForm(event)" id="enroll-form" class="space-y-4">
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Seu Nome</label>
                    <input type="text" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all" placeholder="Digite seu nome completo">
                </div>
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">WhatsApp para Contato</label>
                    <input type="tel" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all" placeholder="(11) 99999-9999">
                </div>
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Escolha o Plano</label>
                    <select required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all">
                        <option value="mensal">Mensal Ativo (R$ 90/mês)</option>
                        <option value="anual">Anual Premium (R$ 69/mês)</option>
                    </select>
                </div>
                <button type="submit" class="w-full bg-cyan-500 hover:bg-cyan-600 text-zinc-950 font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/10 uppercase tracking-wider">Matricular com Desconto</button>
            </form>
        </div>
    </section>

    <!-- Modal Success -->
    <div id="success-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-zinc-900 border border-zinc-800 max-w-sm w-full p-6 rounded-3xl text-center space-y-4 shadow-2xl">
            <div class="w-12 h-12 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto">
                <i data-lucide="check" class="w-6 h-6"></i>
            </div>
            <div>
                <h4 class="text-white font-bold text-base">Inscrição Recebida!</h4>
                <p class="text-zinc-400 text-xs mt-1">Seu cadastro foi salvo em nosso banco de dados. Um de nossos orientadores físicos enviará as chaves de acesso por WhatsApp!</p>
            </div>
            <button onclick="closeModal()" class="w-full bg-cyan-500 hover:bg-cyan-600 text-zinc-950 font-bold text-xs py-2.5 rounded-xl transition-all">Fechar</button>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-zinc-950 border-t border-zinc-900 py-12 px-6 text-center space-y-4 text-xs text-zinc-500">
        <span class="font-black text-white tracking-widest uppercase">${brand}</span>
        <p>&copy; 2026 ${brand}. Todos os direitos reservados. Projeto no-code com design futurista.</p>
    </footer>

    <script>
        lucide.createIcons();

        function submitForm(e) {
            e.preventDefault();
            document.getElementById('success-modal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('success-modal').classList.add('hidden');
            document.getElementById('enroll-form').reset();
        }
    </script>
</body>
</html>`,
      css: ``,
      js: ``,
      explanation: "Projetamos um site dinâmico e enérgico para Academia de Fitness ou Clínica de Saúde, utilizando um tema escuro de alto contraste com destaque em azul ciano (cyan). Possui uma seção Hero com imagem motivacional em tons frios, um bloco detalhando modalidades físicas com ícones e um formulário de matrícula inteligente conectado a uma janela popup (modal) de sucesso em JavaScript."
    };
  }

  // 6. E-commerce / Loja de Roupas ou Produtos
  if (promptLower.includes("loja") || promptLower.includes("ecommerce") || promptLower.includes("venda") || promptLower.includes("shop") || promptLower.includes("store")) {
    const brand = extractBrandName(prompt, "Moda & Estilo Boutique");
    return {
      html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brand} | Compre Moda Premium</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-neutral-50 text-neutral-800 font-sans selection:bg-rose-500/10 selection:text-rose-900">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-rose-500/25">
                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
            </div>
            <span class="font-bold text-base text-neutral-900 tracking-tight">${brand}</span>
        </div>
        <div class="hidden md:flex items-center gap-8 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            <a href="#produtos" class="hover:text-rose-500 transition-colors">Produtos</a>
            <a href="#sobre" class="hover:text-rose-500 transition-colors">Quem Somos</a>
            <a href="#contato" class="hover:text-rose-500 transition-colors">Contato</a>
        </div>
        <div class="flex items-center gap-4">
            <!-- Floating Cart Icon with counter -->
            <button onclick="toggleCart()" class="relative p-2 text-neutral-600 hover:text-rose-500 transition-colors">
                <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                <span id="cart-counter" class="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">0</span>
            </button>
        </div>
    </nav>

    <!-- Hero -->
    <section class="relative min-h-[75vh] flex items-center justify-center bg-white px-6 py-20 border-b border-neutral-200">
        <div class="absolute inset-0 z-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop" class="w-full h-full object-cover" alt="Boutique">
        </div>
        <div class="relative z-10 max-w-3xl text-center space-y-6">
            <span class="text-xs font-bold text-rose-500 uppercase tracking-widest bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full">Nova Coleção Exclusiva</span>
            <h1 class="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">Vista-se com Confiança e Elegância</h1>
            <p class="text-neutral-600 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">Descubra roupas, calçados e acessórios de altíssimo padrão, pensados para pessoas modernas que buscam sofisticação, conforto e beleza em qualquer ocasião.</p>
            <div class="pt-4">
                <a href="#produtos" class="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-6 py-3 rounded-lg transition-all shadow-lg shadow-rose-500/20">Explorar Produtos</a>
            </div>
        </div>
    </section>

    <!-- Produtos Grid -->
    <section id="produtos" class="px-6 py-24 bg-neutral-100/40">
        <div class="max-w-6xl mx-auto space-y-12">
            <div class="text-center space-y-2">
                <span class="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Coleção Especial</span>
                <h2 class="text-2xl font-bold text-neutral-900 tracking-tight">Nossos Produtos Destaques</h2>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <!-- Item 1 -->
                <div class="bg-white border border-neutral-200/60 rounded-2xl p-4 space-y-4 shadow-sm hover:border-rose-500/30 transition-all">
                    <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop" class="w-full h-56 object-cover rounded-xl" alt="Jaqueta">
                    <div class="space-y-1">
                        <h4 class="font-bold text-neutral-900 text-sm">Casaco Outono Premium</h4>
                        <p class="text-neutral-500 text-[11px]">Tecido premium de lã macia com ótimo isolamento térmico e forro interno acetinado.</p>
                        <div class="flex items-center justify-between pt-2">
                            <span class="text-rose-500 font-bold text-sm">R$ 289,00</span>
                            <button onclick="addToCart('Casaco Outono Premium', 289)" class="bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
                                <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Item 2 -->
                <div class="bg-white border border-neutral-200/60 rounded-2xl p-4 space-y-4 shadow-sm hover:border-rose-500/30 transition-all">
                    <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop" class="w-full h-56 object-cover rounded-xl" alt="Vestido">
                    <div class="space-y-1">
                        <h4 class="font-bold text-neutral-900 text-sm">Vestido Elegance Florado</h4>
                        <p class="text-neutral-500 text-[11px]">Vestido leve de crepe de seda de caimento impecável e estampa floral exclusiva.</p>
                        <div class="flex items-center justify-between pt-2">
                            <span class="text-rose-500 font-bold text-sm">R$ 199,00</span>
                            <button onclick="addToCart('Vestido Elegance Florado', 199)" class="bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
                                <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Item 3 -->
                <div class="bg-white border border-neutral-200/60 rounded-2xl p-4 space-y-4 shadow-sm hover:border-rose-500/30 transition-all">
                    <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop" class="w-full h-56 object-cover rounded-xl" alt="Sapatos">
                    <div class="space-y-1">
                        <h4 class="font-bold text-neutral-900 text-sm">Salto Nobre de Couro</h4>
                        <p class="text-neutral-500 text-[11px]">Sapato clássico confeccionado em couro legítimo extremamente macio e confortável.</p>
                        <div class="flex items-center justify-between pt-2">
                            <span class="text-rose-500 font-bold text-sm">R$ 349,00</span>
                            <button onclick="addToCart('Salto Nobre de Couro', 349)" class="bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
                                <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Interactive Shopping Cart Sidebar -->
    <div id="cart-sidebar" class="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl border-l border-neutral-200 z-50 p-6 flex flex-col justify-between hidden">
        <div class="space-y-6 flex-grow overflow-y-auto">
            <div class="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div class="flex items-center gap-2">
                    <i data-lucide="shopping-cart" class="w-5 h-5 text-rose-500"></i>
                    <h3 class="font-bold text-neutral-900">Seu Carrinho</h3>
                </div>
                <button onclick="toggleCart()" class="text-neutral-400 hover:text-neutral-600">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            
            <div id="cart-items" class="space-y-4 text-xs">
                <!-- Empty State -->
                <p id="empty-cart-text" class="text-neutral-400 text-center py-12">Seu carrinho está vazio.</p>
            </div>
        </div>
        
        <div class="border-t border-neutral-100 pt-4 space-y-4">
            <div class="flex items-center justify-between text-sm font-bold text-neutral-950">
                <span>Total:</span>
                <span id="cart-total">R$ 0,00</span>
            </div>
            <button onclick="checkout()" class="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-rose-500/10 uppercase tracking-wider">Finalizar Compra</button>
        </div>
    </div>

    <!-- Checkout Success Modal -->
    <div id="success-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-white border border-neutral-200 max-w-sm w-full p-6 rounded-3xl text-center space-y-4 shadow-xl">
            <div class="w-12 h-12 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto">
                <i data-lucide="check" class="w-6 h-6"></i>
            </div>
            <div>
                <h4 class="text-neutral-900 font-bold text-base">Pedido Realizado!</h4>
                <p class="text-neutral-500 text-xs mt-1">Sua compra foi autorizada com sucesso. Enviamos um e-mail com os dados de entrega do seu pedido.</p>
            </div>
            <button onclick="closeSuccessModal()" class="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-2.5 rounded-xl transition-all">Ótimo!</button>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-neutral-900 border-t border-neutral-800 py-12 px-6 text-center space-y-4 text-xs text-neutral-500">
        <span class="font-bold text-white tracking-widest uppercase">${brand}</span>
        <p>&copy; 2026 ${brand}. Todos os direitos reservados. E-commerce No-Code interativo.</p>
    </footer>

    <script>
        lucide.createIcons();

        let cart = [];
        let total = 0;

        function toggleCart() {
            document.getElementById('cart-sidebar').classList.toggle('hidden');
        }

        function addToCart(name, price) {
            cart.push({ name, price });
            updateCart();
            // Open cart automatically on first item added to make it highly reactive
            document.getElementById('cart-sidebar').classList.remove('hidden');
        }

        function updateCart() {
            const counter = document.getElementById('cart-counter');
            const itemsContainer = document.getElementById('cart-items');
            const totalText = document.getElementById('cart-total');
            const emptyText = document.getElementById('empty-cart-text');
            
            counter.innerText = cart.length;
            
            if (cart.length === 0) {
                emptyText.style.display = 'block';
                itemsContainer.innerHTML = '';
                totalText.innerText = 'R$ 0,00';
                total = 0;
                return;
            }
            
            emptyText.style.display = 'none';
            itemsContainer.innerHTML = '';
            
            total = 0;
            cart.forEach((item, index) => {
                total += item.price;
                const div = document.createElement('div');
                div.className = 'flex justify-between items-center bg-neutral-50 border border-neutral-100 p-3 rounded-xl';
                div.innerHTML = \`
                    <div>
                        <h5 class="font-bold text-neutral-900">\${item.name}</h5>
                        <span class="text-rose-500 font-semibold mt-0.5 block">R$ \${item.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button onclick="removeFromCart(\${index})" class="text-neutral-400 hover:text-red-500 transition-colors">
                        <i data-lucide="trash" class="w-4 h-4"></i>
                    </button>
                \`;
                itemsContainer.appendChild(div);
            });
            
            totalText.innerText = 'R$ ' + total.toFixed(2).replace('.', ',');
            lucide.createIcons();
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCart();
        }

        function checkout() {
            if (cart.length === 0) {
                alert('Adicione itens no carrinho primeiro!');
                return;
            }
            document.getElementById('cart-sidebar').classList.add('hidden');
            document.getElementById('success-modal').classList.remove('hidden');
        }

        function closeSuccessModal() {
            document.getElementById('success-modal').classList.add('hidden');
            cart = [];
            updateCart();
        }
    </script>
</body>
</html>`,
      css: ``,
      js: ``,
      explanation: "Criamos um belíssimo site de E-commerce / Loja de Moda Premium, configurando uma interface dinâmica de alta-fidelidade na cor Rose. O sistema apresenta uma vitrine de produtos elegantes com imagens de alta definição, um carrinho de compras reativo que monitora o número de itens adicionados e recalcula o preço total em tempo real no menu lateral, além de um fluxo de encerramento da compra que ativa o popup de sucesso."
    };
  }

  // 7. Default: SaaS Startup Landing Page
  const brand = extractBrandName(prompt, "SaaS Builder");
  return {
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brand} | Automação e Produtividade</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-[#030305] text-zinc-300 font-sans selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
    <!-- Ambient Background Glows -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <div class="absolute top-[10%] left-[-15%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[130px]"></div>
        <div class="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[130px]"></div>
    </div>

    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-[#030305]/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/25">
                <i data-lucide="layers" class="w-5 h-5"></i>
            </div>
            <span class="font-extrabold text-lg text-white tracking-tight uppercase">${brand}</span>
        </div>
        <div class="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <a href="#recursos" class="hover:text-indigo-400 transition-colors">Recursos</a>
            <a href="#precos" class="hover:text-indigo-400 transition-colors">Preços</a>
            <a href="#faq" class="hover:text-indigo-400 transition-colors">Perguntas</a>
        </div>
        <a href="#precos" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-600/20">Iniciar Teste Grátis</a>
    </nav>

    <!-- Hero -->
    <section class="relative min-h-[85vh] flex items-center justify-center px-6 py-20 text-center z-10">
        <div class="max-w-4xl space-y-6">
            <span class="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">Solução SaaS Inovadora</span>
            <h1 class="text-4xl md:text-6xl font-black text-white tracking-tight leading-none uppercase">Automatize Seus Fluxos de Trabalho</h1>
            <p class="text-zinc-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">Com o ${brand}, você integra ferramentas, centraliza dados e gerencia toda a sua operação através de uma interface elegante e inteligente baseada na nuvem.</p>
            <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a href="#recursos" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-lg transition-all shadow-lg shadow-indigo-600/15">Ver Recursos</a>
                <a href="#precos" class="bg-zinc-900 border border-zinc-800 hover:border-indigo-500/30 text-white font-bold text-xs px-6 py-3 rounded-lg transition-all">Iniciar Agora</a>
            </div>
        </div>
    </section>

    <!-- Recursos Bento Grid -->
    <section id="recursos" class="px-6 py-24 bg-zinc-950/40 border-y border-zinc-900">
        <div class="max-w-6xl mx-auto space-y-12">
            <div class="text-center space-y-2">
                <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Recursos Inovadores</span>
                <h2 class="text-3xl font-black text-white uppercase tracking-tight">Desenvolvido para Escalar</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-zinc-900/40 border border-zinc-850 p-6 rounded-2xl space-y-4 hover:border-indigo-500/20 transition-all">
                    <div class="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                        <i data-lucide="zap" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-lg font-bold text-white">Velocidade Extrema</h3>
                    <p class="text-zinc-400 text-xs leading-relaxed">Processamento de dados em tempo real sem latência, garantindo relatórios sempre atualizados para sua equipe.</p>
                </div>
                <div class="bg-zinc-900/40 border border-zinc-850 p-6 rounded-2xl space-y-4 hover:border-indigo-500/20 transition-all">
                    <div class="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                        <i data-lucide="shield" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-lg font-bold text-white">Segurança de Ponta</h3>
                    <p class="text-zinc-400 text-xs leading-relaxed">Criptografia AES-256 e backups automáticos na nuvem para manter seus dados e informações corporativas sempre seguros.</p>
                </div>
                <div class="bg-zinc-900/40 border border-zinc-850 p-6 rounded-2xl space-y-4 hover:border-indigo-500/20 transition-all">
                    <div class="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                        <i data-lucide="git-branch" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-lg font-bold text-white">Integração Fácil</h3>
                    <p class="text-zinc-400 text-xs leading-relaxed">Conecte-se facilmente ao Slack, Notion, GitHub e centenas de outros serviços em menos de 5 minutos.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section with Dynamic Toggle -->
    <section id="precos" class="px-6 py-24">
        <div class="max-w-4xl mx-auto space-y-12">
            <div class="text-center space-y-4">
                <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Preços</span>
                <h2 class="text-3xl font-black text-white uppercase tracking-tight">Planos Simples & Transparentes</h2>
                
                <!-- Toggle -->
                <div class="flex items-center justify-center gap-3">
                    <span class="text-xs text-zinc-400" id="label-mensal">Mensal</span>
                    <button onclick="togglePricing()" id="pricing-toggle-btn" class="w-12 h-6 bg-indigo-600 rounded-full p-1 transition-colors flex items-center">
                        <div id="pricing-toggle-circle" class="w-4 h-4 bg-white rounded-full transition-transform translate-x-6"></div>
                    </button>
                    <span class="text-xs text-zinc-400 font-bold" id="label-anual">Anual (20% Off)</span>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <!-- Plano Starter -->
                <div class="bg-zinc-900/30 border border-zinc-850 p-8 rounded-3xl space-y-6">
                    <div>
                        <h4 class="text-white font-bold text-lg">Iniciante</h4>
                        <p class="text-zinc-500 text-xs mt-1">Ideal para equipes pequenas ou criadores solo.</p>
                    </div>
                    <div class="text-4xl font-extrabold text-white font-mono">
                        <span id="price-starter">R$ 29</span><span class="text-xs text-zinc-500"> /mês</span>
                    </div>
                    <ul class="space-y-2 text-xs text-zinc-400">
                        <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-green-400"></i> Até 5 Projetos Ativos</li>
                        <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-green-400"></i> Relatórios Mensais</li>
                        <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-green-400"></i> Suporte por E-mail</li>
                    </ul>
                    <button onclick="subscribe('Starter')" class="w-full bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs py-3 rounded-xl transition-all">Começar Agora</button>
                </div>
                <!-- Plano Pro -->
                <div class="bg-indigo-950/20 border-2 border-indigo-500/20 p-8 rounded-3xl space-y-6 relative overflow-hidden">
                    <div class="absolute top-4 right-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Mais Vendido</div>
                    <div>
                        <h4 class="text-white font-bold text-lg">Pro</h4>
                        <p class="text-zinc-500 text-xs mt-1">Para empresas em rápido crescimento.</p>
                    </div>
                    <div class="text-4xl font-extrabold text-white font-mono">
                        <span id="price-pro">R$ 79</span><span class="text-xs text-zinc-500"> /mês</span>
                    </div>
                    <ul class="space-y-2 text-xs text-zinc-400">
                        <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-green-400"></i> Projetos Ilimitados</li>
                        <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-green-400"></i> Relatórios em Tempo Real</li>
                        <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-green-400"></i> Integração de APIs Customizada</li>
                        <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-green-400"></i> Suporte Prioritário 24/7</li>
                    </ul>
                    <button onclick="subscribe('Pro')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/15">Experimentar Pro</button>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Accordion -->
    <section id="faq" class="px-6 py-24 bg-zinc-950/20 border-t border-zinc-900">
        <div class="max-w-3xl mx-auto space-y-12">
            <div class="text-center space-y-2">
                <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Dúvidas Comuns</span>
                <h2 class="text-3xl font-black text-white uppercase tracking-tight">Perguntas Frequentes</h2>
            </div>
            <div class="space-y-4">
                <div class="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl cursor-pointer" onclick="toggleFaq(1)">
                    <div class="flex justify-between items-center text-sm font-bold text-white">
                        <span>Como funciona o período de testes?</span>
                        <i data-lucide="chevron-down" class="w-4 h-4 transition-transform" id="faq-chevron-1"></i>
                    </div>
                    <div id="faq-answer-1" class="text-xs text-zinc-400 mt-3 leading-relaxed hidden">
                        Você pode experimentar qualquer plano gratuitamente por 14 dias sem necessidade de cadastrar cartão de crédito. Ao final do teste, você escolhe se deseja assinar ou voltar ao plano gratuito.
                    </div>
                </div>
                <div class="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl cursor-pointer" onclick="toggleFaq(2)">
                    <div class="flex justify-between items-center text-sm font-bold text-white">
                        <span>Posso cancelar minha assinatura a qualquer momento?</span>
                        <i data-lucide="chevron-down" class="w-4 h-4 transition-transform" id="faq-chevron-2"></i>
                    </div>
                    <div id="faq-answer-2" class="text-xs text-zinc-400 mt-3 leading-relaxed hidden">
                        Sim! Nossos planos não têm contratos de fidelidade. Você pode cancelar ou alterar seu plano a qualquer momento diretamente pelo painel de configurações.
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Success Modal -->
    <div id="success-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-zinc-900 border border-zinc-850 max-w-sm w-full p-6 rounded-3xl text-center space-y-4 shadow-2xl">
            <div class="w-12 h-12 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto">
                <i data-lucide="check" class="w-6 h-6"></i>
            </div>
            <div>
                <h4 class="text-white font-bold text-base">Inscrição Efetuada!</h4>
                <p class="text-zinc-400 text-xs mt-1">Sua conta de teste gratuito do plano <strong id="selected-plan-text" class="text-indigo-400">Starter</strong> foi provisionada na nuvem. Verifique seu e-mail para definir a senha de acesso!</p>
            </div>
            <button onclick="closeModal()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all">Entrar no Dashboard</button>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-[#030305] border-t border-zinc-900 py-12 px-6 text-center space-y-4 text-xs text-zinc-500">
        <span class="font-extrabold text-white tracking-widest uppercase">${brand}</span>
        <p>&copy; 2026 ${brand}. Todos os direitos reservados. Landing Page SaaS moderna no-code.</p>
    </footer>

    <script>
        lucide.createIcons();

        let isAnnual = true;

        function togglePricing() {
            isAnnual = !isAnnual;
            const toggleCircle = document.getElementById('pricing-toggle-circle');
            const starterPrice = document.getElementById('price-starter');
            const proPrice = document.getElementById('price-pro');
            
            if (isAnnual) {
                toggleCircle.style.transform = 'translateX(24px)';
                starterPrice.innerText = 'R$ 23';
                proPrice.innerText = 'R$ 63';
                document.getElementById('label-anual').classList.add('font-bold', 'text-indigo-400');
                document.getElementById('label-mensal').classList.remove('font-bold', 'text-indigo-400');
            } else {
                toggleCircle.style.transform = 'translateX(0px)';
                starterPrice.innerText = 'R$ 29';
                proPrice.innerText = 'R$ 79';
                document.getElementById('label-mensal').classList.add('font-bold', 'text-indigo-400');
                document.getElementById('label-anual').classList.remove('font-bold', 'text-indigo-400');
            }
        }

        function subscribe(planName) {
            document.getElementById('selected-plan-text').innerText = planName;
            document.getElementById('success-modal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('success-modal').classList.add('hidden');
        }

        function toggleFaq(id) {
            const answer = document.getElementById('faq-answer-' + id);
            const chevron = document.getElementById('faq-chevron-' + id);
            
            answer.classList.toggle('hidden');
            chevron.classList.toggle('rotate-180');
        }
    </script>
</body>
</html>`,
    css: ``,
    js: ``,
    explanation: "Criamos uma Landing Page altamente moderna e tecnológica para Startups de SaaS, usando um design escuro futurista com luzes de fundo deslumbrantes em degradê roxo/azul. Contém um bento grid estruturando recursos, uma seção de planos de preços interativa com botão de alternância mensal/anual que atualiza dinamicamente os valores em tempo real, uma seção de perguntas frequentes (FAQ) retrátil (accordion) e modais integrados."
  };
}
