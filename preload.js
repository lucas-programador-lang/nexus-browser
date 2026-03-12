const { contextBridge, ipcRenderer } = require("electron")

// =======================================
// INICIAR NAVEGADOR
// =======================================

window.addEventListener("DOMContentLoaded", () => {
console.log("🚀 Nexus Browser iniciado")
})


// =======================================
// CANAIS PERMITIDOS (SEGURANÇA)
// =======================================

const validSendChannels = [
"check-update"
]

const validReceiveChannels = [
"download-progress",
"download-complete"
]

const validInvokeChannels = [
"get-history",
"get-favorites",
"add-favorite",
"get-settings",
"save-settings",
"ask-ai"
]


// =======================================
// API DO NAVEGADOR
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
// CONFIGURAÇÕES
// ===============================

getSettings: () => ipcRenderer.invoke("get-settings"),

saveSettings: (data) => ipcRenderer.invoke("save-settings", data),


// ===============================
// IA DO NAVEGADOR
// ===============================

askAI: (prompt) => ipcRenderer.invoke("ask-ai", prompt),


// ===============================
// DOWNLOAD PROGRESS
// ===============================

onDownloadProgress: (callback) => {

ipcRenderer.removeAllListeners("download-progress")

ipcRenderer.on("download-progress",(event,percent)=>{
callback(percent)
})

},


// ===============================
// DOWNLOAD COMPLETO
// ===============================

onDownloadComplete: (callback) => {

ipcRenderer.removeAllListeners("download-complete")

ipcRenderer.on("download-complete",(event,file)=>{
callback(file)
})

},


// ===============================
// ATUALIZAÇÃO
// ===============================

checkUpdate: () => ipcRenderer.send("check-update")

})
