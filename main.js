const { app, BrowserWindow, shell } = require("electron")
const path = require("path")

// bloqueador de anúncios
const enableAdBlock = require("./adblock")

let mainWindow

function createWindow(){

mainWindow = new BrowserWindow({

width:1400,
height:900,
minWidth:900,
minHeight:600,

webPreferences:{
preload: path.join(__dirname,"preload.js"),
nodeIntegration:false,
contextIsolation:true,
webviewTag:true
}

})

// carregar interface do navegador
mainWindow.loadFile("index.html")

// impedir abrir novas janelas internas perigosas
mainWindow.webContents.setWindowOpenHandler(({ url }) => {

shell.openExternal(url)

return { action: "deny" }

})

// remover menu padrão
mainWindow.setMenu(null)

}

app.whenReady().then(() => {

try{

// ativar bloqueador de anúncios
enableAdBlock()

}catch(err){

console.error("Erro ao iniciar adblock:",err)

}

// criar janela
createWindow()

// comportamento padrão macOS
app.on("activate",()=>{

if(BrowserWindow.getAllWindows().length === 0){
createWindow()
}

})

})

// fechar app quando todas janelas fecharem
app.on("window-all-closed",()=>{

if(process.platform !== "darwin"){
app.quit()
}

})
