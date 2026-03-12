const { app, BrowserWindow, shell, session, dialog, ipcMain } = require("electron")
const path = require("path")
const fs = require("fs")

// UPDATE
const { autoUpdater } = require("electron-updater")
const log = require("electron-log")

log.transports.file.level = "info"
autoUpdater.logger = log

// bloqueador de anúncios
const enableAdBlock = require("./security/adblock")

let mainWindow

// caminhos de dados
const dataPath = app.getPath("userData")
const historyFile = path.join(dataPath,"history.json")
const favFile = path.join(dataPath,"favorites.json")

let historico = []
let favoritos = []

// =======================================
// CARREGAR DADOS
// =======================================

function carregarDados(){

try{
if(fs.existsSync(historyFile)){
historico = JSON.parse(fs.readFileSync(historyFile))
}
}catch(e){
historico=[]
}

try{
if(fs.existsSync(favFile)){
favoritos = JSON.parse(fs.readFileSync(favFile))
}
}catch(e){
favoritos=[]
}

}

// salvar histórico
function salvarHistorico(){
fs.writeFileSync(historyFile,JSON.stringify(historico,null,2))
}

// salvar favoritos
function salvarFavoritos(){
fs.writeFileSync(favFile,JSON.stringify(favoritos,null,2))
}


// =======================================
// CRIAR JANELA
// =======================================

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
webviewTag:true
}

})

mainWindow.loadFile("index.html")

// abrir links externos no navegador
mainWindow.webContents.setWindowOpenHandler(({ url }) => {

shell.openExternal(url)

return { action:"deny" }

})

mainWindow.setMenu(null)

mainWindow.webContents.on("did-finish-load",()=>{
mainWindow.webContents.setZoomFactor(1)
})

}


// =======================================
// DOWNLOAD MANAGER
// =======================================

function iniciarDownloads(){

session.defaultSession.on("will-download",(event,item)=>{

const fileName = item.getFilename()
const url = item.getURL()

console.log("Download iniciado:",fileName)

// bloquear scripts perigosos
if(url.endsWith(".bat") || url.endsWith(".cmd") || url.endsWith(".ps1")){

event.preventDefault()

dialog.showErrorBox(
"Download bloqueado",
"Arquivo potencialmente perigoso."
)

return
}

item.on("updated",(event,state)=>{

if(state === "progressing"){

const percent =
Math.round((item.getReceivedBytes()/item.getTotalBytes())*100)

mainWindow.webContents.send("download-progress",percent)

}

})

item.once("done",(event,state)=>{

if(state === "completed"){

shell.showItemInFolder(item.getSavePath())

mainWindow.webContents.send("download-complete",fileName)

}

})

})

}


// =======================================
// HISTÓRICO
// =======================================

function iniciarHistorico(){

app.on("web-contents-created",(event,contents)=>{

contents.on("did-navigate",(event,url)=>{

historico.push({
url:url,
data:new Date()
})

if(historico.length>500){
historico.shift()
}

salvarHistorico()

})

})

}


// =======================================
// IPC FAVORITOS
// =======================================

ipcMain.handle("get-favorites",()=>{
return favoritos
})

ipcMain.handle("add-favorite",(event,data)=>{

favoritos.push(data)
salvarFavoritos()

})

ipcMain.handle("get-history",()=>{
return historico
})


// =======================================
// SISTEMA DE ATUALIZAÇÃO
// =======================================

function iniciarAtualizacao(){

autoUpdater.checkForUpdatesAndNotify()

autoUpdater.on("checking-for-update",()=>{
console.log("Verificando atualização...")
})

autoUpdater.on("update-available",()=>{

dialog.showMessageBox({
type:"info",
title:"Atualização disponível",
message:"Nova versão do Nexus Browser encontrada. Baixando atualização..."
})

})

autoUpdater.on("update-downloaded",()=>{

dialog.showMessageBox({
type:"info",
title:"Atualização pronta",
message:"Atualização baixada. O navegador será reiniciado."
}).then(()=>{

autoUpdater.quitAndInstall()

})

})

}


// botão verificar atualização

ipcMain.on("check-update",()=>{
autoUpdater.checkForUpdates()
})


// =======================================
// INICIAR APP
// =======================================

app.whenReady().then(()=>{

carregarDados()

try{
enableAdBlock()
}catch(e){
console.log("Adblock não iniciado")
}

iniciarDownloads()
iniciarHistorico()
iniciarAtualizacao()

createWindow()

app.on("activate",()=>{

if(BrowserWindow.getAllWindows().length===0){
createWindow()
}

})

})


// =======================================
// FECHAR APP
// =======================================

app.on("window-all-closed",()=>{

if(process.platform!=="darwin"){
app.quit()
}

})
