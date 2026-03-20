// =======================================
// INTERFACE DA IA (NEXUS ASSISTANT)
// =======================================

function abrirIA() {
    let painel = document.getElementById("painelIA");
    if (painel) {
        fecharIA(); // Se já estiver aberto, fecha (toggle)
        return;
    }

    painel = document.createElement("div");
    painel.id = "painelIA";
    
    // Estilização via JS para garantir que o painel flutue sobre o webview
    Object.assign(painel.style, {
        position: "fixed",
        right: "0",
        top: "48px", // Abaixo da topbar
        width: "350px",
        height: "calc(100% - 48px)",
        background: "#0f172a",
        borderLeft: "1px solid #1e293b",
        zIndex: "9999",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-5px 0 15px rgba(0,0,0,0.3)",
        transition: "transform 0.3s ease"
    });

    painel.innerHTML = `
        <div style="padding: 15px; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; background: #020617;">
            <span style="font-weight: bold; color: #60a5fa; letter-spacing: 1px;">NEXUS AI</span>
            <button id="iaFechar" style="background:transparent; border:none; color:#94a3b8; cursor:pointer; font-size:18px;">&times;</button>
        </div>

        <div id="iaChat" style="flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; scroll-behavior: smooth;">
            <div class="msg-ia">Olá! Sou o assistente do Nexus. Como posso ajudar com sua navegação hoje?</div>
        </div>

        <div id="iaStatus" style="padding: 0 15px; font-size: 11px; color: #60a5fa; height: 15px; visibility: hidden;">Nexus está pensando...</div>

        <div style="padding: 15px; border-top: 1px solid #1e293b; background: #020617;">
            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                <button id="iaResumo" style="flex: 1; font-size: 11px; padding: 5px; background: #1e293b; color: #e2e8f0; border: 1px solid #334155; border-radius: 4px; cursor: pointer;">✨ Resumir Página</button>
                <button id="iaLimpar" style="font-size: 11px; padding: 5px; background: transparent; color: #94a3b8; border: none; cursor: pointer;">Limpar</button>
            </div>
            <div style="display: flex; gap: 6px;">
                <input id="iaInput" placeholder="Pergunte algo..." autocomplete="off" 
                    style="flex: 1; padding: 10px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: white; outline: none; font-size: 13px;" />
                <button id="iaEnviar" style="background: #2563eb; color: white; border: none; padding: 0 15px; border-radius: 6px; cursor: pointer; font-weight: bold;">></button>
            </div>
        </div>
    `;

    document.body.appendChild(painel);

    // Eventos
    document.getElementById("iaEnviar").onclick = enviarPerguntaIA;
    document.getElementById("iaResumo").onclick = analisarConteudoPagina;
    document.getElementById("iaFechar").onclick = fecharIA;
    document.getElementById("iaLimpar").onclick = () => { document.getElementById("iaChat").innerHTML = ""; };

    document.getElementById("iaInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") enviarPerguntaIA();
    });

    // Auto-foco no input
    document.getElementById("iaInput").focus();
}

function fecharIA() {
    const painel = document.getElementById("painelIA");
    if (painel) painel.remove();
}

// =======================================
// LÓGICA DE MENSAGENS
// =======================================

function adicionarMensagemChat(texto, remetente = "ia") {
    const chat = document.getElementById("iaChat");
    if (!chat) return;

    const msgDiv = document.createElement("div");
    msgDiv.style.padding = "10px 14px";
    msgDiv.style.borderRadius = "10px";
    msgDiv.style.fontSize = "13px";
    msgDiv.style.maxWidth = "85%";
    msgDiv.style.lineHeight = "1.5";

    if (remetente === "user") {
        msgDiv.style.alignSelf = "flex-end";
        msgDiv.style.background = "#2563eb";
        msgDiv.style.color = "white";
        msgDiv.innerText = texto;
    } else {
        msgDiv.style.alignSelf = "flex-start";
        msgDiv.style.background = "#1e293b";
        msgDiv.style.color = "#e2e8f0";
        msgDiv.style.border = "1px solid #334155";
        // Permite HTML básico para respostas formatadas
        msgDiv.innerHTML = texto.replace(/\n/g, '<br>');
    }

    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}

// =======================================
// COMUNICAÇÃO COM O PROCESSO MAIN
// =======================================

async function enviarPerguntaIA() {
    const input = document.getElementById("iaInput");
    const status = document.getElementById("iaStatus");
    const prompt = input.value.trim();

    if (!prompt || !window.nexus) return;

    adicionarMensagemChat(prompt, "user");
    input.value = "";
    input.disabled = true;
    status.style.visibility = "visible";

    try {
        const resposta = await window.nexus.askAI(prompt);
        adicionarMensagemChat(resposta, "ia");
    } catch (err) {
        adicionarMensagemChat("Desculpe, tive um problema ao processar sua pergunta. Verifique sua conexão.", "ia");
    } finally {
        input.disabled = false;
        status.style.visibility = "hidden";
        input.focus();
    }
}

// =======================================
// FERRAMENTAS DE PÁGINA (RESUMO / ESTUDO)
// =======================================

async function analisarConteudoPagina() {
    if (!window.abaAtual || !window.abaAtual.webview) {
        adicionarMensagemChat("Abra um site primeiro para que eu possa resumir.", "ia");
        return;
    }

    const status = document.getElementById("iaStatus");
    status.style.visibility = "visible";
    adicionarMensagemChat("Lendo o conteúdo da página para você...", "ia");

    try {
        // Extrai apenas o texto visível da página
        const textoPagina = await window.abaAtual.webview.executeJavaScript(`
            (() => {
                // Remove scripts, estilos e navegação para pegar o texto limpo
                const clone = document.body.cloneNode(true);
                const blocks = clone.querySelectorAll('script, style, nav, footer, header');
                blocks.forEach(b => b.remove());
                return clone.innerText.substring(0, 5000); // Limite de 5k caracteres
            })()
        `);

        const resumo = await window.nexus.askAI(`Resuma de forma concisa em português os pontos principais deste texto:\n\n${textoPagina}`);
        adicionarMensagemChat("<strong>Resumo da Página:</strong><br><br>" + resumo, "ia");

    } catch (err) {
        adicionarMensagemChat("Não consegui ler o conteúdo desta página.", "ia");
    } finally {
        status.style.visibility = "hidden";
    }
}

// MODO ESTUDO (MELHORADO)
function modoEstudo() {
    if (!window.abaAtual || !window.abaAtual.webview) return;

    window.abaAtual.webview.executeJavaScript(`
        (function() {
            const style = document.createElement('style');
            style.id = 'nexus-study-mode';
            style.innerHTML = \`
                body { 
                    background-color: #1a1a1a !important; 
                    color: #d1d1d1 !important; 
                    font-family: 'Georgia', serif !important;
                    line-height: 1.8 !important;
                    max-width: 800px !important;
                    margin: 0 auto !important;
                    padding: 40px !important;
                }
                img, video, iframe, ads, .ads, [class*="sidebar"] { display: none !important; }
                p, h1, h2, h3, h4, h5, h6 { color: #e0e0e0 !important; }
            \`;
            document.head.appendChild(style);
        })()
    `);
    
    // Opcional: Abre a IA para ajudar nos estudos
    abrirIA();
    adicionarMensagemChat("Modo Estudo ativado! Removi as distrações e foquei no texto para você.", "ia");
}
