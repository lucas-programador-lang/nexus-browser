// =======================================
// CACHE DOM
// =======================================

let urlBar
let btnVoltar
let btnAvancar
let btnRecarregar
let btnIr


// =======================================
// INICIAR
// =======================================

window.addEventListener("DOMContentLoaded", () => {

urlBar = document.getElementById("url")
btnVoltar = document.getElementById("btnVoltar")
btnAvancar = document.getElementById("btnAvancar")
btnRecarregar = document.getElementById("btnRecarregar")
btnIr = document.getElementById("btnIr")

if(urlBar){

urlBar.addEventListener("keydown",(e)=>{

if(e.key === "Enter"){
navegar()
}

})

}


// BOTÕES

btnVoltar?.addEventListener("click", voltar)
btnAvancar?.addEventListener("click", avancar)
btnRecarregar?.addEventListener("click", recarregar)
btnIr?.addEventListener("click", navegar)

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


// SEGURANÇA

if(typeof verificarSite === "function"){
verificarSite(urlInput)
}


// ABA ATIVA

if(!abaAtual || !abaAtual.webview){
console.warn("Nenhuma aba ativa")
return
}


// EVITAR RELOAD DA MESMA URL

try{

if(abaAtual.webview.getURL() === urlInput){
return
}

}catch(e){}


// CARREGAR

try{

abaAtual.webview.loadURL(urlInput)

}catch(err){

console.error("Erro ao navegar:",err)

}

}


// =======================================
// ATUALIZAR URL
// =======================================

function atualizarBarra(){

if(!abaAtual || !abaAtual.webview) return

try{

urlBar.value = abaAtual.webview.getURL()

}catch(e){

console.warn("Erro atualizar barra")

}

}


// =======================================
// VOLTAR
// =======================================

function voltar(){

if(!abaAtual?.webview) return

try{

if(abaAtual.webview.canGoBack()){
abaAtual.webview.goBack()
}

}catch(e){

console.warn("Erro voltar")

}

}


// =======================================
// AVANÇAR
// =======================================

function avancar(){

if(!abaAtual?.webview) return

try{

if(abaAtual.webview.canGoForward()){
abaAtual.webview.goForward()
}

}catch(e){

console.warn("Erro avançar")

}

}


// =======================================
// RECARREGAR
// =======================================

function recarregar(){

if(!abaAtual?.webview) return

try{

abaAtual.webview.reload()

}catch(e){

console.warn("Erro reload")

}

}


// =======================================
// ATALHOS
// =======================================

document.addEventListener("keydown",(e)=>{


// CTRL L → barra

if(e.ctrlKey && e.key === "l"){

e.preventDefault()

urlBar.focus()
urlBar.select()

}


// CTRL T → nova aba

if(e.ctrlKey && e.key === "t"){

e.preventDefault()

novaAba("https://www.google.com")

}


// CTRL W → fechar aba

if(e.ctrlKey && e.key === "w"){

e.preventDefault()

if(abaAtual){
fecharAba(abaAtual.id)
}

}


// CTRL R → reload

if(e.ctrlKey && e.key === "r"){

e.preventDefault()

recarregar()

}


// CTRL H → histórico

if(e.ctrlKey && e.key === "h"){

e.preventDefault()

alert("Histórico em desenvolvimento")

}


// CTRL D → favoritos

if(e.ctrlKey && e.key === "d"){

e.preventDefault()

alert("Favoritos em desenvolvimento")

}


// ALT ←

if(e.altKey && e.key === "ArrowLeft"){
voltar()
}


// ALT →

if(e.altKey && e.key === "ArrowRight"){
avancar()
}

})
