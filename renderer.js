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

let titulo = ""
let conteudo = ""

if(url === "nexus://history"){
titulo = "Histórico"
conteudo = "Histórico do navegador."
}

else if(url === "nexus://downloads"){
titulo = "Downloads"
conteudo = "Gerenciador de downloads."
}

else if(url === "nexus://favorites"){
titulo = "Favoritos"
conteudo = "Seus sites favoritos."
}

else if(url === "nexus://settings"){
titulo = "Configurações"
conteudo = "Configurações do Nexus Browser."
}

else{
titulo = "Nexus Browser"
conteudo = "Página não encontrada."
}

const pagina = `
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<style>

body{
font-family:Segoe UI, Arial;
background:#0f172a;
color:white;
margin:0;
padding:40px;
}

.container{
max-width:900px;
margin:auto;
}

h1{
font-size:32px;
margin-bottom:10px;
}

.card{
background:#1e293b;
padding:20px;
border-radius:10px;
margin-top:20px;
}

p{
color:#94a3b8;
font-size:16px;
}

</style>

</head>

<body>

<div class="container">

<h1>${titulo}</h1>

<div class="card">
<p>${conteudo}</p>
</div>

</div>

</body>
</html>
`

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
