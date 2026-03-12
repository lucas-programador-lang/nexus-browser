// =======================================
// CACHE DOM
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
btnVoltar && btnVoltar.addEventListener("click", voltar)
btnAvancar && btnAvancar.addEventListener("click", avancar)
btnRecarregar && btnRecarregar.addEventListener("click", recarregar)
btnIr && btnIr.addEventListener("click", navegar)

})


// =======================================
// NAVEGAR
// =======================================

function navegar(){

if(!urlBar) return

let urlInput = urlBar.value.trim()

if(!urlInput) return


// =======================================
// PÁGINAS INTERNAS
// =======================================

if(urlInput.startsWith("nexus://")){
abrirPaginaInterna(urlInput)
return
}


// =======================================
// PESQUISA INTELIGENTE
// =======================================

if(!urlInput.includes(".")){
urlInput = "https://www.google.com/search?q=" + encodeURIComponent(urlInput)
}


// HTTPS AUTOMÁTICO

if(!urlInput.startsWith("http://") && !urlInput.startsWith("https://")){
urlInput = "https://" + urlInput
}


// SEGURANÇA

if(typeof verificarSite === "function"){
verificarSite(urlInput)
}


// VERIFICAR ABA

if(!window.abaAtual || !window.abaAtual.webview){
console.warn("Nenhuma aba ativa")
return
}


// EVITAR RELOAD

try{
if(window.abaAtual.webview.getURL() === urlInput){
return
}
}catch(e){}


// NAVEGAR

try{
window.abaAtual.webview.loadURL(urlInput)
}catch(err){
console.error("Erro navegar:",err)
}

}


// =======================================
// PÁGINAS INTERNAS DO NAVEGADOR
// =======================================

function abrirPaginaInterna(url){

if(!window.abaAtual || !window.abaAtual.webview) return

let pagina = ""

if(url === "nexus://history"){

pagina = `
<h1>Histórico</h1>
<p>Histórico do navegador.</p>
`

}

else if(url === "nexus://downloads"){

pagina = `
<h1>Downloads</h1>
<p>Gerenciador de downloads.</p>
`

}

else if(url === "nexus://favorites"){

pagina = `
<h1>Favoritos</h1>
<p>Seus sites favoritos.</p>
`

}

else if(url === "nexus://settings"){

pagina = `
<h1>Configurações</h1>
<p>Configurações do Nexus Browser.</p>
`

}

else{

pagina = `
<h1>Nexus Browser</h1>
<p>Página não encontrada.</p>
`

}

window.abaAtual.webview.loadURL(
"data:text/html;charset=utf-8," + encodeURIComponent(pagina)
)

}


// =======================================
// ATUALIZAR BARRA
// =======================================

function atualizarBarra(){

if(!window.abaAtual || !window.abaAtual.webview) return

try{
if(urlBar){
urlBar.value = window.abaAtual.webview.getURL()
}
}catch(e){
console.warn("Erro atualizar barra")
}

}


// =======================================
// VOLTAR
// =======================================

function voltar(){

if(!window.abaAtual || !window.abaAtual.webview) return

try{
if(window.abaAtual.webview.canGoBack()){
window.abaAtual.webview.goBack()
}
}catch(e){
console.warn("Erro voltar")
}

}


// =======================================
// AVANÇAR
// =======================================

function avancar(){

if(!window.abaAtual || !window.abaAtual.webview) return

try{
if(window.abaAtual.webview.canGoForward()){
window.abaAtual.webview.goForward()
}
}catch(e){
console.warn("Erro avançar")
}

}


// =======================================
// RECARREGAR
// =======================================

function recarregar(){

if(!window.abaAtual || !window.abaAtual.webview) return

try{
window.abaAtual.webview.reload()
}catch(e){
console.warn("Erro reload")
}

}


// =======================================
// ATALHOS
// =======================================

document.addEventListener("keydown",(e)=>{


// CTRL + L
if(e.ctrlKey && e.key === "l"){
e.preventDefault()
urlBar && urlBar.focus()
urlBar && urlBar.select()
}


// CTRL + T
if(e.ctrlKey && e.key === "t"){
e.preventDefault()
if(typeof novaAba === "function"){
novaAba("https://www.google.com")
}
}


// CTRL + W
if(e.ctrlKey && e.key === "w"){
e.preventDefault()
if(window.abaAtual && typeof fecharAba === "function"){
fecharAba(window.abaAtual.id)
}
}


// CTRL + R
if(e.ctrlKey && e.key === "r"){
e.preventDefault()
recarregar()
}


// CTRL + H
if(e.ctrlKey && e.key === "h"){
e.preventDefault()
urlBar.value = "nexus://history"
navegar()
}


// CTRL + D
if(e.ctrlKey && e.key === "d"){
e.preventDefault()
urlBar.value = "nexus://favorites"
navegar()
}


// CTRL + J
if(e.ctrlKey && e.key === "j"){
e.preventDefault()
urlBar.value = "nexus://downloads"
navegar()
}


// CTRL + ,
if(e.ctrlKey && e.key === ","){
e.preventDefault()
urlBar.value = "nexus://settings"
navegar()
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
