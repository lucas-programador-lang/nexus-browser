const { contextBridge, ipcRenderer } = require("electron");

// =======================================
// SEGURANÇA: VERIFICAÇÃO DE ORIGEM
// =======================================
// Isso impede que sites externos (como google.com) tentem acessar 
// as funções internas do seu navegador pelo console.
const IS_INTERNAL = window.location.protocol === 'file:';

// =======================================
// API DO NAVEGADOR (NEXUS BRIDGE)
// =======================================

// Somente expõe a API se estivermos nas páginas internas do navegador
if (IS_INTERNAL) {
    contextBridge.exposeInMainWorld("nexus", {
        
        // --- HISTÓRICO E FAVORITOS ---
        getHistory: () => ipcRenderer.invoke("get-history"),
        getFavorites: () => ipcRenderer.invoke("get-favorites"),
        addFavorite: (data) => ipcRenderer.invoke("add-favorite", data),

        // --- NAVEGAÇÃO E SISTEMA ---
        // Nova função para registrar o histórico vindo do renderer (UI)
        registerHistory: (data) => ipcRenderer.send("register-history", data),
        
        checkUpdate: () => ipcRenderer.send("check-update"),

        // --- CONFIGURAÇÕES E IA ---
        getSettings: () => ipcRenderer.invoke("get-settings"),
        saveSettings: (data) => ipcRenderer.invoke("save-settings", data),
        askAI: (prompt) => ipcRenderer.invoke("ask-ai", prompt),

        // --- EVENTOS DE DOWNLOAD (OTIMIZADOS) ---
        // Usamos um padrão de "limpeza" para evitar vazamento de memória
        onDownloadProgress: (callback) => {
            const subscription = (event, data) => callback(data);
            ipcRenderer.on("download-progress", subscription);
            return () => ipcRenderer.removeListener("download-progress", subscription);
        },

        onDownloadComplete: (callback) => {
            const subscription = (event, fileName) => callback(fileName);
            ipcRenderer.on("download-complete", subscription);
            return () => ipcRenderer.removeListener("download-complete", subscription);
        }
    });
}

// =======================================
// INICIALIZAÇÃO
// =======================================

window.addEventListener("DOMContentLoaded", () => {
    if (IS_INTERNAL) {
        console.log("🚀 Nexus Bridge: Protegida e Ativa");
    }
});
