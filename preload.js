const { contextBridge, ipcRenderer } = require("electron")

// =======================================
// INICIAR NAVEGADOR
// =======================================

window.addEventListener("DOMContentLoaded", () => {

console.log("🚀 Nexus Browser iniciado")

})


// =======================================
// API SEGURA DO NAVEGADOR
// =======================================

contextBridge.exposeInMainWorld("nexus", {


// ===============================
// HISTÓRICO
// ===============================

getHistory: () => ipcRenderer.invoke("get-history"),


// ===============================
// FAVORITOS
// ===============================

getFavorites: () => ipcRenderer.invoke("get-favorites"),

addFavorite: (data) => ipcRenderer.invoke("add-favorite", data),


// ===============================
// DOWNLOADS
// ===============================

onDownloadProgress: (callback) => {

ipcRenderer.on("download-progress", (event, percent) => {
callback(percent)
})

},

onDownloadComplete: (callback) => {

ipcRenderer.on("download-complete", (event, file) => {
callback(file)
})

},


// ===============================
// CONFIGURAÇÕES
// ===============================

getSettings: () => ipcRenderer.invoke("get-settings"),

saveSettings: (data) => ipcRenderer.invoke("save-settings", data),


// ===============================
// IA DO NAVEGADOR
// ===============================

askAI: (prompt) => ipcRenderer.invoke("ask-ai", prompt)

})
