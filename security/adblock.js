const { session } = require("electron");

// =======================================
// CONFIGURAÇÃO DO NEXUS SHIELD (ADBLOCK)
// =======================================

// Lista expandida e organizada por categorias
const blockedPatterns = [
    // Redes de Anúncios Comuns
    "doubleclick.net",
    "googlesyndication.com",
    "adservice.google.com",
    "googletagmanager.com",
    "google-analytics.com",
    "analytics.google.com",
    "ads.youtube.com",
    "facebook.net",
    "connect.facebook.net",
    "ads-twitter.com",
    "taboola.com",
    "outbrain.com",
    "adnxs.com",
    "adsystem.com",
    "casalemedia.com",
    "rubiconproject.com",
    "popads.net",
    "ad-delivery.net",
    
    // Padrões de URL de anúncios
    "/ads/",
    "/advertisements/",
    "/show_ads.",
    "adsbygoogle",
    "telemetry",
    "tracking-pixel"
];

// Transforma a lista em uma única Regex para performance máxima
const blockRegex = new RegExp(blockedPatterns.join("|"), "i");

/**
 * Ativa o bloqueador de anúncios na sessão padrão do Electron.
 */
function enableAdBlock() {
    const filter = {
        urls: ["http://*/*", "https://*/*"]
    };

    session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
        const url = details.url.toLowerCase();

        // 1. Exceção: Não bloquear requisições internas do próprio navegador ou Google Auth
        if (url.includes("accounts.google.com") || url.startsWith("file://")) {
            return callback({ cancel: false });
        }

        // 2. Verificação de bloqueio via Regex
        if (blockRegex.test(url)) {
            // Log silencioso para não poluir o console do dev, 
            // mas você pode reativar se quiser debugar.
            // console.log("🚫 Nexus Shield bloqueou:", url.substring(0, 50) + "...");
            return callback({ cancel: true });
        }

        // 3. Permitir o restante
        callback({ cancel: false });
    });

    console.log("🛡️ Nexus Shield AdBlock: Ativado e Monitorando.");
}

module.exports = { enableAdBlock };
