const { contextBridge, ipcRenderer } = require("electron")

// ===============================
// INICIAR NAVEGADOR
// ===============================

window.addEventListener("DOMContentLoaded", () => {

console.log("🚀 Nexus Browser iniciado")

})


// ===============================
// API SEGURA PARA FRONTEND
// ===============================

contextBridge.exposeInMainWorld("nexusAPI", {


// enviar mensagem para o processo principal
send: (channel, data) => {
ipcRenderer.send(channel, data)
},

// receber mensagem
receive: (channel, func) => {
ipcRenderer.on(channel, (event, ...args) => func(...args))
}

})
