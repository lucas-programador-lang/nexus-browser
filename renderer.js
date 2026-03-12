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

// ENTER na barra
if(urlBar){
urlBar.addEventListener("keydown",(e)=>{
if(e.key === "Enter"){
navegar()
}
})
}

// BOTÕES
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

try{
window.abaAtual.webview.loadURL(urlInput)
}catch(err){
console.error("Erro navegar:",err)
}

}


// =======================================
// PÁGINAS INTERNAS
// =======================================

async function abrirPaginaInterna(url){

if(!window.abaAtual || !window.abaAtual.webview) return

let titulo = ""
let conteudo = ""

if(url === "nexus://history"){

titulo = "Histórico"

try{

const history = await window.nexus.getHistory()

conteudo = history.map(h => `
<div style="margin-bottom:10px">
<a href="${h.url}" style="color:#60a5fa">${h.url}</a>
</div>
`).join("") || "Nenhum histórico ainda."

}catch{
conteudo = "Erro ao carregar histórico."
}

}


else if(url === "nexus://downloads"){

titulo = "Downloads"

conteudo = "Downloads aparecerão aqui quando você baixar arquivos."

}


else if(url === "nexus://favorites"){

titulo = "Favoritos"

try{

const favs = await window.nexus.getFavorites()

conteudo = favs.map(f => `
<div style="margin-bottom:10px">
<a href="${f.url}" style="color:#60a5fa">${f.title || f.url}</a>
</div>
`).join("") || "Nenhum favorito salvo."

}catch{
conteudo = "Erro ao carregar favoritos."
}

}


else if(url === "nexus://settings"){

titulo = "Configurações"

conteudo = `
<button onclick="window.nexusAPI.send('check-update')">
Verificar atualização do navegador
</button>
`

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

.card{
background:#1e293b;
padding:20px;
border-radius:10px;
margin-top:20px;
}

a{
color:#60a5fa;
text-decoration:none;
}

</style>

</head>

<body>

<h1>${titulo}</h1>

<div class="card">
${conteudo}
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
