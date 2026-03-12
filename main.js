const { app, BrowserWindow, shell, session, dialog } = require("electron")
const path = require("path")

// bloqueador de anúncios
const enableAdBlock = require("./security/adblock")

let mainWindow

// histórico simples em memória
let historico = []


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


// abrir links externos no navegador do sistema

mainWindow.webContents.setWindowOpenHandler(({ url }) => {

shell.openExternal(url)

return { action:"deny" }

})


// remover menu padrão

mainWindow.setMenu(null)


// garantir zoom padrão

mainWindow.webContents.on("did-finish-load",()=>{

mainWindow.webContents.setZoomFactor(1)

})

}


// =======================================
// INICIAR APP
// =======================================

app.whenReady().then(()=>{

// iniciar adblock

try{

enableAdBlock()

}catch(err){

console.error("Erro ao iniciar AdBlock:",err)

}


// =======================================
// DOWNLOAD MANAGER
// =======================================

session.defaultSession.on("will-download",(event,item)=>{

const url = item.getURL()
const fileName = item.getFilename()

console.log("Download iniciado:",fileName)


// bloquear arquivos perigosos

if(
url.endsWith(".bat") ||
url.endsWith(".cmd") ||
url.endsWith(".ps1")
){

event.preventDefault()

dialog.showErrorBox(
"Download bloqueado",
"Este tipo de arquivo pode ser perigoso."
)

return

}


// progresso download

item.on("updated",(event,state)=>{

if(state === "progressing"){

const percent =
Math.round((item.getReceivedBytes()/item.getTotalBytes())*100)

console.log("Download:",percent+"%")

}

})


// download finalizado

item.once("done",(event,state)=>{

if(state === "completed"){

console.log("Download concluído")

shell.showItemInFolder(item.getSavePath())

}else{

console.log("Download cancelado")

}

})

})


// =======================================
// HISTÓRICO DE NAVEGAÇÃO
// =======================================

app.on("web-contents-created",(event,contents)=>{

contents.on("did-navigate",(event,url)=>{

historico.push({
url:url,
data:new Date()
})


// limitar histórico

if(historico.length > 500){
historico.shift()
}

})

})


createWindow()


// macOS comportamento padrão

app.on("activate",()=>{

if(BrowserWindow.getAllWindows().length === 0){
createWindow()
}

})

})


// =======================================
// FECHAR APP
// =======================================

app.on("window-all-closed",()=>{

if(process.platform !== "darwin"){
app.quit()
}

})
