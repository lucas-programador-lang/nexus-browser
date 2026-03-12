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
const data = fs.readFileSync(historyFile)
historico = JSON.parse(data || "[]")
}
}catch(e){
historico=[]
}

try{
if(fs.existsSync(favFile)){
const data = fs.readFileSync(favFile)
favoritos = JSON.parse(data || "[]")
}
}catch(e){
favoritos=[]
}

}


// =======================================
// SALVAR DADOS
// =======================================

function salvarHistorico(){

try{
fs.writeFileSync(historyFile,JSON.stringify(historico,null,2))
}catch(e){
console.log("Erro salvar histórico")
}

}

function salvarFavoritos(){

try{
fs.writeFileSync(favFile,JSON.stringify(favoritos,null,2))
}catch(e){
console.log("Erro salvar favoritos")
}

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
webviewTag:true,
sandbox:true
}

})

mainWindow.loadFile("index.html")

// abrir links externos
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

if(mainWindow){
mainWindow.webContents.send("download-progress",percent)
}

}

})

item.once("done",(event,state)=>{

if(state === "completed"){

shell.showItemInFolder(item.getSavePath())

if(mainWindow){
mainWindow.webContents.send("download-complete",fileName)
}

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

// não roda update em modo dev
if(!app.isPackaged) return

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

if(app.isPackaged){
autoUpdater.checkForUpdates()
}else{
dialog.showMessageBox({
type:"info",
message:"Atualizações funcionam apenas no aplicativo instalado."
})
}

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
