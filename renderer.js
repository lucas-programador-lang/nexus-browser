// =======================================
// CACHE DOM (melhor performance)
// =======================================

let urlBar = null
let btnVoltar = null
let btnAvancar = null
let btnRecarregar = null
let btnIr = null


// =======================================
// INICIAR
// =======================================

window.addEventListener("DOMContentLoaded", () => {

urlBar = document.getElementById("url")
btnVoltar = document.getElementById("btnVoltar")
btnAvancar = document.getElementById("btnAvancar")
btnRecarregar = document.getElementById("btnRecarregar")
btnIr = document.getElementById("btnIr")

// ENTER na barra

if(urlBar){
urlBar.addEventListener("keydown",(e)=>{

if(e.key === "Enter"){
navegar()
}

})
}


// BOTÕES

if(btnVoltar){
btnVoltar.addEventListener("click",voltar)
}

if(btnAvancar){
btnAvancar.addEventListener("click",avancar)
}

if(btnRecarregar){
btnRecarregar.addEventListener("click",recarregar)
}

if(btnIr){
btnIr.addEventListener("click",navegar)
}

})


// =======================================
// NAVEGAR
// =======================================

function navegar(){

if(!urlBar) return

let urlInput = urlBar.value.trim()

if(!urlInput) return


// PESQUISA AUTOMÁTICA

if(!urlInput.includes(".")){

urlInput =
"https://www.google.com/search?q=" +
encodeURIComponent(urlInput)

}


// HTTPS AUTOMÁTICO

if(
!urlInput.startsWith("http://") &&
!urlInput.startsWith("https://")
){

urlInput = "https://" + urlInput

}


// VERIFICAÇÃO DE SEGURANÇA

if(typeof verificarSite === "function"){

verificarSite(urlInput)

}


// VERIFICAR ABA ATIVA

if(!abaAtual || !abaAtual.webview){

console.warn("Nenhuma aba ativa")

return

}


// EVITAR RECARREGAR MESMA URL

try{

if(abaAtual.webview.getURL() === urlInput){
return
}

}catch(err){}


// NAVEGAR

try{

abaAtual.webview.loadURL(urlInput)

}catch(err){

console.error("Erro ao navegar:",err)

}

}


// =======================================
// ATUALIZAR BARRA DE URL
// =======================================

function atualizarBarra(){

if(!abaAtual || !abaAtual.webview) return

try{

if(urlBar){
urlBar.value = abaAtual.webview.getURL()
}

}catch(err){

console.warn("Erro ao atualizar URL")

}

}


// =======================================
// VOLTAR
// =======================================

function voltar(){

if(!abaAtual || !abaAtual.webview) return

try{

if(abaAtual.webview.canGoBack()){
abaAtual.webview.goBack()
}

}catch(err){

console.warn("Erro ao voltar")

}

}


// =======================================
// AVANÇAR
// =======================================

function avancar(){

if(!abaAtual || !abaAtual.webview) return

try{

if(abaAtual.webview.canGoForward()){
abaAtual.webview.goForward()
}

}catch(err){

console.warn("Erro ao avançar")

}

}


// =======================================
// RECARREGAR
// =======================================

function recarregar(){

if(!abaAtual || !abaAtual.webview) return

try{

abaAtual.webview.reload()

}catch(err){

console.warn("Erro ao recarregar")

}

}


// =======================================
// ATALHOS DE TECLADO
// =======================================

document.addEventListener("keydown",(e)=>{


// Ctrl + L → focar barra

if(e.ctrlKey && e.key === "l"){

e.preventDefault()

if(urlBar){
urlBar.focus()
urlBar.select()
}

}


// Ctrl + T → nova aba

if(e.ctrlKey && e.key === "t"){

e.preventDefault()

novaAba("https://www.google.com")

}


// Ctrl + W → fechar aba

if(e.ctrlKey && e.key === "w"){

e.preventDefault()

if(abaAtual){
fecharAba(abaAtual.id)
}

}


// Ctrl + R → recarregar

if(e.ctrlKey && e.key === "r"){

e.preventDefault()

recarregar()

}


// Alt + ← voltar

if(e.altKey && e.key === "ArrowLeft"){

voltar()

}


// Alt + → avançar

if(e.altKey && e.key === "ArrowRight"){

avancar()

}

})
