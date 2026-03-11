const { app, BrowserWindow, shell, session } = require("electron")
const path = require("path")

// bloqueador de anúncios
const enableAdBlock = require("./security/adblock")

let mainWindow


// ===============================
// CRIAR JANELA
// ===============================

function createWindow(){

mainWindow = new BrowserWindow({

width:1400,
height:900,
minWidth:900,
minHeight:600,

backgroundColor:"#0f172a",

icon: path.join(__dirname,"assets/logo.png"),

webPreferences:{
preload: path.join(__dirname,"preload.js"),
nodeIntegration:false,
contextIsolation:true,
webviewTag:true,

sandbox:true,
enableBlinkFeatures:"OverlayScrollbars"
}

})

mainWindow.loadFile("index.html")

mainWindow.webContents.setWindowOpenHandler(({ url }) => {

shell.openExternal(url)

return { action:"deny" }

})

mainWindow.setMenu(null)

mainWindow.webContents.on("did-finish-load",()=>{

mainWindow.webContents.setZoomFactor(1)

})

}


// ===============================
// INICIAR APP
// ===============================

app.whenReady().then(()=>{

try{
enableAdBlock()
}catch(err){
console.error("Erro ao iniciar AdBlock:",err)
}

// SEGURANÇA DE DOWNLOAD
session.defaultSession.on("will-download",(event,item)=>{

const url = item.getURL()

if(url.includes(".exe") || url.includes(".bat")){
console.warn("Download potencialmente perigoso:",url)
}

})

createWindow()

app.on("activate",()=>{

if(BrowserWindow.getAllWindows().length === 0){
createWindow()
}

})

})


// ===============================
// FECHAR APP
// ===============================

app.on("window-all-closed",()=>{

if(process.platform !== "darwin"){
app.quit()
}

})
