// =======================================
// MÓDULO DE SEGURANÇA NEXUS (SHIELD)
// =======================================

let ultimoAvisoSeguranca = "";
let timeoutAviso = null;

/**
 * Verifica a URL antes da navegação para detectar riscos.
 * @param {string} urlString 
 */
function verificarSite(urlString) {
    if (!urlString) return;

    let url;
    try {
        // Normaliza a URL para análise
        url = new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`);
    } catch (e) {
        return; // URL inválida
    }

    const hostname = url.hostname.toLowerCase();
    const fullUrl = url.href.toLowerCase();

    // 1. PALAVRAS DE GOLPE (SCAM KEYWORDS)
    const palavrasGolpe = [
        "free-money", "crypto-bonus", "win-money", "double-your-money",
        "earn-fast", "giveaway", "claim-reward", "bitcoin-free",
        "get-rich", "airdrop", "free-crypto", "lottery-win"
    ];

    // 2. ENCURTADORES (SITES DE REDIRECIONAMENTO)
    const encurtadores = [
        "bit.ly", "tinyurl.com", "cutt.ly", "t.co", "is.gd", 
        "rebrand.ly", "tiny.cc", "ow.ly", "buff.ly"
    ];

    // 3. PADRÕES DE PHISHING (DOMÍNIOS MASCARADOS)
    const padroesPhishing = [
        "login-secure", "verify-account", "update-wallet", 
        "metamask-login", "pague-seguro", "caixa-atualiza",
        "banco-seguranca", "netflix-payment"
    ];

    // --- EXECUÇÃO DA CHECAGEM ---

    // Alerta de HTTP Inseguro (Apenas se não for localhost)
    if (url.protocol === "http:" && hostname !== "localhost") {
        exibirAlertaSeguranca("🔓 Conexão insegura (HTTP). Não insira senhas neste site.", "warning");
    }

    // Alerta de Termos Suspeitos
    if (palavrasGolpe.some(p => fullUrl.includes(p))) {
        exibirAlertaSeguranca("⚠️ Conteúdo suspeito: Este site pode ser um golpe financeiro.", "danger");
    }

    // Alerta de Encurtadores
    if (encurtadores.some(e => hostname.includes(e))) {
        exibirAlertaSeguranca("🔗 Link encurtado: O destino real está oculto. Cuidado.", "info");
    }

    // Alerta de Phishing (Domínios falsos)
    if (padroesPhishing.some(d => hostname.includes(d))) {
        exibirAlertaSeguranca("🚨 Alerta de Phishing: Este site imita uma página oficial.", "danger");
    }

    // Verificação de Homógrafo (Ex: 'g00gle.com' em vez de 'google.com')
    // Nota: Aqui você poderia expandir com uma lista de domínios reais conhecidos.
}

/**
 * Renderiza um alerta visual elegante na interface.
 */
function exibirAlertaSeguranca(msg, tipo = "danger") {
    // Evita spam de alertas idênticos
    if (ultimoAvisoSeguranca === msg) return;
    ultimoAvisoSeguranca = msg;

    // Limpa timeout anterior se houver
    if (timeoutAviso) clearTimeout(timeoutAviso);

    let alerta = document.getElementById("nexus-security-alert");
    if (alerta) alerta.remove();

    alerta = document.createElement("div");
    alerta.id = "nexus-security-alert";

    // Cores baseadas no tipo
    const cores = {
        danger: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6"
    };

    Object.assign(alerta.style, {
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: cores[tipo] || "#1e293b",
        color: "white",
        padding: "12px 24px",
        borderRadius: "30px",
        fontSize: "13px",
        fontWeight: "600",
        zIndex: "100000",
        boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        animation: "slideUp 0.3s ease-out"
    });

    // Adiciona animação ao CSS se não existir
    if (!document.getElementById("security-anim")) {
        const style = document.createElement("style");
        style.id = "security-anim";
        style.innerHTML = `
            @keyframes slideUp {
                from { transform: translate(-50%, 100%); opacity: 0; }
                to { transform: translate(-50%, 0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    alerta.innerHTML = `<span>${msg}</span><button onclick="this.parentElement.remove()" style="background:none; border:none; color:white; cursor:pointer; font-weight:bold; margin-left:10px;">✕</button>`;

    document.body.appendChild(alerta);

    // Remove após 6 segundos
    timeoutAviso = setTimeout(() => {
        if (alerta) {
            alerta.style.opacity = "0";
            alerta.style.transition = "opacity 0.5s";
            setTimeout(() => { alerta.remove(); ultimoAvisoSeguranca = ""; }, 500);
        }
    }, 6000);
}
