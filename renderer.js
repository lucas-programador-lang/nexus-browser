// =======================================
// CACHE DOM & ESTADO
// =======================================
const DOM = {
    urlBar: null,
    btnVoltar: null,
    btnAvancar: null,
    btnRecarregar: null,
    btnIr: null,
    btnIA: null,
    btnEstudo: null,
    containerAbas: null // Onde os webviews ficam
};

// =======================================
// INICIALIZAÇÃO
// =======================================
window.addEventListener("DOMContentLoaded", () => {
    // Mapeamento do DOM
    DOM.urlBar = document.getElementById("url");
    DOM.btnVoltar = document.getElementById("btnVoltar");
    DOM.btnAvancar = document.getElementById("btnAvancar");
    DOM.btnRecarregar = document.getElementById("btnRecarregar");
    DOM.btnIr = document.getElementById("btnIr");
    DOM.btnIA = document.getElementById("btnIA");
    DOM.btnEstudo = document.getElementById("btnEstudo");

    // Eventos de Input
    if (DOM.urlBar) {
        DOM.urlBar.addEventListener("keydown", (e) => {
            if (e.key === "Enter") navegar();
        });
        // Auto-selecionar texto ao clicar na barra
        DOM.urlBar.addEventListener("click", () => DOM.urlBar.select());
    }

    // Eventos de Botões
    if (DOM.btnVoltar) DOM.btnVoltar.onclick = voltar;
    if (DOM.btnAvancar) DOM.btnAvancar.onclick = avancar;
    if (DOM.btnRecarregar) DOM.btnRecarregar.onclick = recarregar;
    if (DOM.btnIr) DOM.btnIr.onclick = navegar;

    // IA e Modo Estudo (Verificação de existência das funções)
    if (DOM.btnIA) DOM.btnIA.onclick = () => (typeof abrirIA === "function") && abrirIA();
    if (DOM.btnEstudo) DOM.btnEstudo.onclick = () => (typeof modoEstudo === "function") && modoEstudo();

    console.log("🚀 Interface Nexus Renderer carregada.");
});

// =======================================
// LÓGICA DE NAVEGAÇÃO
// =======================================
function navegar() {
    if (!DOM.urlBar) return;

    let urlInput = DOM.urlBar.value.trim();
    if (!urlInput) return;

    // 1. Tratar Protocolo Interno
    if (urlInput.startsWith("nexus://")) {
        renderizarPaginaInterna(urlInput);
        return;
    }

    // 2. Tratar busca ou URL direta
    let finalUrl = urlInput;
    const isUrl = urlInput.includes(".") && !urlInput.includes(" ");

    if (!isUrl) {
        // Se não for URL, pesquisa no Google
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(urlInput)}`;
    } else {
        // Se for URL mas faltar o protocolo
        if (!/^https?:\/\//i.test(urlInput)) {
            finalUrl = `https://${urlInput}`;
        }
    }

    // 3. Executar carga no WebView da aba ativa
    const webview = getActiveWebview();
    if (webview) {
        webview.loadURL(finalUrl);
        // Registrar no histórico via IPC (Preload)
        window.nexus.registerHistory({ url: finalUrl, title: "Carregando..." });
    } else {
        console.error("Nenhum WebView ativo encontrado.");
    }
}

// =======================================
// PÁGINAS INTERNAS (SISTEMA DE TEMPLATES)
// =======================================
async function renderizarPaginaInterna(protocolo) {
    const webview = getActiveWebview();
    if (!webview) return;

    let config = { title: "Nexus", content: "" };

    try {
        if (protocolo === "nexus://history") {
            const data = await window.nexus.getHistory();
            config.title = "Histórico de Navegação";
            config.content = data.reverse().map(h => `
                <div class="item">
                    <span class="date">${h.date || ''}</span>
                    <a href="#" onclick="window.location.href='${h.url}'">${h.url}</a>
                </div>
            `).join("") || "Nenhum registro.";
        } 
        else if (protocolo === "nexus://favorites") {
            const data = await window.nexus.getFavorites();
            config.title = "Meus Favoritos";
            config.content = data.map(f => `
                <div class="item">
                    <strong>${f.title || 'Sem título'}</strong><br>
                    <a href="#" onclick="window.location.href='${f.url}'">${f.url}</a>
                </div>
            `).join("") || "Sua lista está vazia.";
        }
        else if (protocolo === "nexus://settings") {
            config.title = "Configurações";
            config.content = `
                <p>Gerencie as preferências do seu navegador.</p>
                <button class="btn" onclick="window.nexus.checkUpdate()">Verificar Atualizações</button>
            `;
        }
    } catch (err) {
        config.content = `<p style="color:red">Erro ao carregar dados: ${err.message}</p>`;
    }

    const html = `
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; padding: 50px; }
                .card { background: #1e293b; padding: 25px; border-radius: 12px; border: 1px solid #334155; }
                h1 { color: #60a5fa; margin-top: 0; }
                .item { padding: 10px 0; border-bottom: 1px solid #334155; }
                .date { font-size: 11px; color: #94a3b8; display: block; }
                a { color: #38bdf8; text-decoration: none; font-size: 14px; }
                a:hover { text-decoration: underline; }
                .btn { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>${config.title}</h1>
                ${config.content}
            </div>
        </body>
        </html>
    `;

    webview.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
    if (DOM.urlBar) DOM.urlBar.value = protocolo;
}

// =======================================
// UTILITÁRIOS DE NAVEGAÇÃO
// =======================================

function getActiveWebview() {
    // Se você estiver usando o objeto window.abaAtual definido em outro script (como tabs.js)
    if (window.abaAtual && window.abaAtual.webview) {
        return window.abaAtual.webview;
    }
    // Fallback: busca o primeiro webview visível no documento
    return document.querySelector("webview.active") || document.querySelector("webview");
}

function voltar() {
    const wv = getActiveWebview();
    if (wv && wv.canGoBack()) wv.goBack();
}

function avancar() {
    const wv = getActiveWebview();
    if (wv && wv.canGoForward()) wv.goForward();
}

function recarregar() {
    const wv = getActiveWebview();
    if (wv) wv.reload();
}

// Escuta atualizações de URL vindas do WebView para atualizar a barra
// Nota: Isso deve ser configurado quando a aba é criada
function vincularEventosWebview(webview) {
    webview.addEventListener('did-navigate', (e) => {
        if (DOM.urlBar && !e.url.startsWith('data:')) {
            DOM.urlBar.value = e.url;
        }
    });
}
