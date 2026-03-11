// ===============================
// CACHE DOM (melhor performance)
// ===============================

let urlBar = null

window.addEventListener("DOMContentLoaded", () => {

urlBar = document.getElementById("url")

if(urlBar){

urlBar.addEventListener("keydown",(e)=>{

if(e.key === "Enter"){
navegar()
}

})

}

})


// ===============================
// NAVEGAR
// ===============================

function navegar(){

if(!urlBar) return

let urlInput = urlBar.value.trim()

if(!urlInput) return


// -------------------------------
// PESQUISA AUTOMÁTICA
// -------------------------------

if(!urlInput.includes(".")){

urlInput =
"https://www.google.com/search?q=" +
encodeURIComponent(urlInput)

}


// -------------------------------
// HTTPS AUTOMÁTICO
// -------------------------------

if(
!urlInput.startsWith("http://") &&
!urlInput.startsWith("https://")
){

urlInput = "https://" + urlInput

}


// -------------------------------
// VERIFICAÇÃO DE SEGURANÇA
// -------------------------------

if(typeof verificarSite === "function"){
verificarSite(urlInput)
}


// -------------------------------
// VERIFICAR ABA
// -------------------------------

if(!abaAtual || !abaAtual.webview){
console.warn("Nenhuma aba ativa")
return
}


// -------------------------------
// CACHE SIMPLES DE NAVEGAÇÃO
// -------------------------------

if(abaAtual.webview.getURL() === urlInput){
return
}


// -------------------------------
// NAVEGAR
// -------------------------------

abaAtual.webview.src = urlInput

}


// ===============================
// ATUALIZAR BARRA DE URL
// ===============================

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


// ===============================
// VOLTAR
// ===============================

function voltar(){

if(!abaAtual || !abaAtual.webview) return

if(abaAtual.webview.canGoBack()){
abaAtual.webview.goBack()
}

}


// ===============================
// AVANÇAR
// ===============================

function avancar(){

if(!abaAtual || !abaAtual.webview) return

if(abaAtual.webview.canGoForward()){
abaAtual.webview.goForward()
}

}


// ===============================
// RECARREGAR
// ===============================

function recarregar(){

if(!abaAtual || !abaAtual.webview) return

abaAtual.webview.reload()

}


// ===============================
// ATALHOS DE TECLADO
// ===============================

document.addEventListener("keydown",(e)=>{


// Ctrl + L

if(e.ctrlKey && e.key === "l"){

e.preventDefault()

if(urlBar){
urlBar.focus()
}

}


// Ctrl + T

if(e.ctrlKey && e.key === "t"){

e.preventDefault()

novaAba("https://www.google.com")

}


// Ctrl + W

if(e.ctrlKey && e.key === "w"){

e.preventDefault()

if(abaAtual){
fecharAba(abaAtual.id)
}

}


// Ctrl + R

if(e.ctrlKey && e.key === "r"){

e.preventDefault()

recarregar()

}

})
