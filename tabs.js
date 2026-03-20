// =======================================
// SISTEMA DE ABAS - NEXUS ENGINE
// =======================================

let abas = [];
window.abaAtual = null;
let contadorAbas = 0;

const SESSION_KEY = "nexus_tabs_session";

// =======================================
// PERSISTÊNCIA (SESSÃO)
// =======================================

function salvarSessao() {
    try {
        const dados = abas.map(a => {
            try {
                const url = a.webview.getURL();
                // Não salva páginas internas de dados ou erro como sessão
                return url.startsWith("data:") ? "https://www.google.com" : url;
            } catch (e) {
                return "https://www.google.com";
            }
        });
        localStorage.setItem(SESSION_KEY, JSON.stringify(dados));
    } catch (e) {
        console.error("Erro ao salvar sessão:", e);
    }
}

function restaurarSessao() {
    const dados = localStorage.getItem(SESSION_KEY);
    try {
        const urls = dados ? JSON.parse(dados) : ["https://www.google.com"];
        if (!urls.length) urls.push("https://www.google.com");
        
        urls.forEach(url => novaAba(url));
    } catch (e) {
        novaAba("https://www.google.com");
    }
}

// =======================================
// CRIAÇÃO DE NOVA ABA
// =======================================

function novaAba(url = "https://www.google.com") {
    const browserContainer = document.getElementById("browser-container");
    const tabsContainer = document.getElementById("tabs");

    if (!browserContainer || !tabsContainer) return;

    contadorAbas++;
    const id = `tab-${contadorAbas}`;

    // --- ELEMENTO VISUAL DA ABA (BOTÃO) ---
    const tabButton = document.createElement("div");
    tabButton.className = "tab";
    tabButton.id = id;

    const icon = document.createElement("img");
    icon.src = "assets/logo.png";
    icon.onerror = () => { icon.src = "assets/icons/default-web.svg"; };

    const titulo = document.createElement("span");
    titulo.innerText = "Carregando...";

    const fechar = document.createElement("span");
    fechar.innerHTML = "&times;";
    fechar.className = "close-tab";
    fechar.title = "Fechar aba";
    fechar.onclick = (e) => {
        e.stopPropagation();
        fecharAba(id);
    };

    tabButton.appendChild(icon);
    tabButton.appendChild(titulo);
    tabButton.appendChild(fechar);
    tabButton.onclick = () => trocarAba(id);
    tabsContainer.appendChild(tabButton);

    // --- ELEMENTO WEBVIEW ---
    const webview = document.createElement("webview");
    webview.src = url;
    webview.className = "browser-view";
    webview.id = `view-${id}`;
    webview.style.display = "none";
    
    // Atributos necessários para o Electron
    webview.setAttribute("allowpopups", ""); 
    webview.setAttribute("webpreferences", "contextIsolation=true, nodeIntegration=false");

    // --- EVENTOS DO WEBVIEW ---

    // Atualizar título
    webview.addEventListener("page-title-updated", (e) => {
        const texto = e.title || "Nova Aba";
        titulo.innerText = texto.length > 20 ? texto.substring(0, 20) + "..." : texto;
        tabButton.title = texto; // Tooltip com título completo
    });

    // Atualizar Favicon
    webview.addEventListener("page-favicon-updated", (e) => {
        if (e.favicons && e.favicons.length > 0) {
            icon.src = e.favicons[0];
        }
    });

    // Controle de links (Target _blank)
    webview.addEventListener("new-window", (e) => {
        const protocol = new URL(e.url).protocol;
        if (protocol === "http:" || protocol === "https:") {
            novaAba(e.url);
        }
    });

    // Atualizar barra de endereço global
    const atualizarBarraUI = () => {
        if (window.abaAtual && window.abaAtual.id === id) {
            if (typeof atualizarBarra === "function") atualizarBarra();
        }
        salvarSessao();
    };

    webview.addEventListener("did-navigate", atualizarBarraUI);
    webview.addEventListener("did-navigate-in-page", atualizarBarraUI);
    
    // Tratamento de Erros
    webview.addEventListener("did-fail-load", (e) => {
        if (e.errorCode !== -3 && e.validatedURL !== "about:blank") {
             console.warn("Falha ao carregar:", e.errorDescription);
        }
    });

    browserContainer.appendChild(webview);

    // --- SALVAR NO ESTADO ---
    const novaAbaObj = {
        id: id,
        botao: tabButton,
        webview: webview
    };

    abas.push(novaAbaObj);
    
    // Ativa a aba recém-criada
    trocarAba(id);
}

// =======================================
// GERENCIAMENTO DE ESTADO DAS ABAS
// =======================================

function trocarAba(id) {
    const abaAlvo = abas.find(t => t.id === id);
    if (!abaAlvo) return;

    // Esconde todas e desativa botões
    abas.forEach(tab => {
        tab.webview.style.display = "none";
        tab.botao.classList.remove("active-tab");
        tab.webview.classList.remove("active-view");
    });

    // Ativa a selecionada
    abaAlvo.webview.style.display = "flex";
    abaAlvo.botao.classList.add("active-tab");
    abaAlvo.webview.classList.add("active-view");

    window.abaAtual = abaAlvo;

    // Garante que o foco vá para o webview
    abaAlvo.webview.focus();

    // Atualiza a barra de endereço no renderer.js
    if (typeof atualizarBarra === "function") {
        atualizarBarra();
    }
}

function fecharAba(id) {
    const index = abas.findIndex(t => t.id === id);
    if (index === -1) return;

    const abaParaRemover = abas[index];

    // Se a aba fechada for a ativa, precisamos trocar antes de remover
    if (window.abaAtual && window.abaAtual.id === id) {
        if (abas.length > 1) {
            const proximaIndex = index === 0 ? 1 : index - 1;
            trocarAba(abas[proximaIndex].id);
        }
    }

    // Remove do DOM e do Array
    abaParaRemover.webview.remove();
    abaParaRemover.botao.remove();
    abas.splice(index, 1);

    // Se não sobrar nenhuma, abre uma em branco
    if (abas.length === 0) {
        novaAba("https://www.google.com");
    }

    salvarSessao();
}

// =======================================
// EVENTOS GLOBAIS
// =======================================

// Atalho Ctrl+T para nova aba
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "t") {
        novaAba();
    }
    if (e.ctrlKey && e.key === "w") {
        if (window.abaAtual) fecharAba(window.abaAtual.id);
    }
});

// Duplo clique na barra de abas cria nova aba
document.getElementById("tabs")?.addEventListener("dblclick", (e) => {
    if (e.target.id === "tabs") novaAba();
});

// Inicialização
window.addEventListener("DOMContentLoaded", () => {
    // Pequeno delay para garantir que o Electron estabilizou
    setTimeout(() => {
        if (abas.length === 0) {
            restaurarSessao();
        }
    }, 100);
});
