const { app, BrowserWindow } = require("electron")
const path = require("path")

// carregar bloqueador de anúncios
const enableAdBlock = require("./security/adblock")

let mainWindow

function createWindow(){

mainWindow = new BrowserWindow({

width:1400,
height:900,

webPreferences:{
preload: path.join(__dirname, "preload.js"),
nodeIntegration: false,
contextIsolation: true
}

})

mainWindow.loadFile("index.html")

}

// quando o Electron estiver pronto
app.whenReady().then(() => {

enableAdBlock()

createWindow()

// recriar janela se clicar no dock (Mac)
app.on("activate", () => {
if(BrowserWindow.getAllWindows().length === 0){
createWindow()
}
})

})

// fechar app quando todas janelas fecharem
app.on("window-all-closed", () => {

if(process.platform !== "darwin"){
app.quit()
}

})
