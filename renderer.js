// =======================================
// CACHE DOM
// =======================================

let urlBar = null
let btnVoltar = null
let btnAvancar = null
let btnRecarregar = null
let btnIr = null
let btnIA = null
let btnEstudo = null


// =======================================
// INICIAR
// =======================================

window.addEventListener("DOMContentLoaded", () => {

urlBar = document.getElementById("url")
btnVoltar = document.getElementById("btnVoltar")
btnAvancar = document.getElementById("btnAvancar")
btnRecarregar = document.getElementById("btnRecarregar")
btnIr = document.getElementById("btnIr")
btnIA = document.getElementById("btnIA")
btnEstudo = document.getElementById("btnEstudo")


// ENTER NA BARRA
if(urlBar){
urlBar.addEventListener("keydown",(e)=>{
if(e.key === "Enter"){
navegar()
}
})
}


// BOTÕES NAVEGAÇÃO

if(btnVoltar) btnVoltar.onclick = voltar
if(btnAvancar) btnAvancar.onclick = avancar
if(btnRecarregar) btnRecarregar.onclick = recarregar
if(btnIr) btnIr.onclick = navegar


// IA

if(btnIA){
btnIA.onclick = ()=>{
if(typeof abrirIA === "function"){
abrirIA()
}
}
}


// MODO ESTUDO

if(btnEstudo){
btnEstudo.onclick = ()=>{
if(typeof modoEstudo === "function"){
modoEstudo()
}
}
}

})



// =======================================
// NAVEGAR
// =======================================

function navegar(){

if(!urlBar) return

let urlInput = urlBar.value.trim()

if(!urlInput) return


// PÁGINAS INTERNAS

if(urlInput.startsWith("nexus://")){
abrirPaginaInterna(urlInput)
return
}


// PESQUISA GOOGLE

if(!urlInput.includes(".")){

urlInput =
"https://www.google.com/search?q=" +
encodeURIComponent(urlInput)

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
// PÁGINAS INTERNAS
// =======================================

function abrirPaginaInterna(url){

if(!window.abaAtual || !window.abaAtual.webview) return

let titulo = ""
let conteudo = ""

if(url === "nexus://history"){
titulo = "Histórico"
conteudo = "Aqui aparecerá o histórico do navegador."
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
font-family:Segoe UI;
background:#0f172a;
color:white;
margin:0;
padding:40px;
}

.container{
max-width:900px;
margin:auto;
}

.card{
background:#1e293b;
padding:20px;
border-radius:10px;
margin-top:20px;
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

const url = window.abaAtual.webview.getURL()

if(url.startsWith("data:text/html")) return

urlBar.value = url

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
