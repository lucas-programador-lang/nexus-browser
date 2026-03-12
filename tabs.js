// =======================================
// SISTEMA DE ABAS
// =======================================

let abas = []
window.abaAtual = null
let contadorAbas = 0

const SESSION_KEY = "nexus_tabs_session"


// =======================================
// SALVAR SESSÃO
// =======================================

function salvarSessao(){

try{

const dados = abas.map(a => {

try{
return a.webview.getURL()
}catch(e){
return "https://www.google.com"
}

})

localStorage.setItem(SESSION_KEY, JSON.stringify(dados))

}catch(e){
console.warn("Erro salvar sessão")
}

}


// =======================================
// RESTAURAR SESSÃO
// =======================================

function restaurarSessao(){

const dados = localStorage.getItem(SESSION_KEY)

if(!dados){
novaAba("https://www.google.com")
return
}

try{

const urls = JSON.parse(dados)

if(!urls.length){
novaAba("https://www.google.com")
return
}

urls.forEach(url => novaAba(url))

}catch(e){

novaAba("https://www.google.com")

}

}


// =======================================
// NOVA ABA
// =======================================

function novaAba(url = "https://www.google.com") {

const browserContainer = document.getElementById("browser-container")
const tabsContainer = document.getElementById("tabs")

if(!browserContainer || !tabsContainer) return

contadorAbas++

const id = "tab-" + contadorAbas


// =======================================
// BOTÃO DA ABA
// =======================================

const tabButton = document.createElement("div")
tabButton.className = "tab"
tabButton.id = id


// favicon padrão

const icon = document.createElement("img")
icon.src = "assets/logo.png"


// título

const titulo = document.createElement("span")
titulo.innerText = "Nova Aba"


// botão fechar

const fechar = document.createElement("span")
fechar.innerHTML = "&times;"
fechar.className = "close-tab"

fechar.onclick = (e)=>{
e.stopPropagation()
fecharAba(id)
}


// montar aba

tabButton.appendChild(icon)
tabButton.appendChild(titulo)
tabButton.appendChild(fechar)

tabButton.onclick = ()=> trocarAba(id)

tabsContainer.appendChild(tabButton)


// =======================================
// WEBVIEW
// =======================================

const webview = document.createElement("webview")

webview.src = url
webview.className = "browser-view"
webview.id = "view-" + id

webview.style.display="none"
webview.style.width="100%"
webview.style.height="100%"


// título da página

webview.addEventListener("page-title-updated",(e)=>{

if(!e.title) return

titulo.innerText = e.title.length > 25
? e.title.substring(0,25) + "..."
: e.title

})


// favicon da página

webview.addEventListener("page-favicon-updated",(e)=>{

if(e.favicons && e.favicons.length){
icon.src = e.favicons[0]
}

})


// atualizar barra

webview.addEventListener("did-navigate", atualizarBarraSegura)
webview.addEventListener("did-navigate-in-page", atualizarBarraSegura)
webview.addEventListener("did-finish-load", atualizarBarraSegura)


// crash da aba

webview.addEventListener("crashed", ()=>{

alert("A aba travou.")

})


// abrir links em nova aba

webview.addEventListener("new-window",(e)=>{

if(!e.url) return

if(e.url.startsWith("http")){
novaAba(e.url)
}

})


// adicionar ao navegador

browserContainer.appendChild(webview)


// salvar aba

abas.push({

id:id,
botao:tabButton,
webview:webview

})


// ativar aba

trocarAba(id)


// salvar sessão

setTimeout(()=>{
salvarSessao()
},300)

}


// =======================================
// ATUALIZAR BARRA SEGURO
// =======================================

function atualizarBarraSegura(){

if(typeof atualizarBarra === "function"){
atualizarBarra()
}

}


// =======================================
// TROCAR ABA
// =======================================

function trocarAba(id){

abas.forEach(tab=>{

tab.webview.style.display="none"
tab.botao.classList.remove("active-tab")

})

const aba = abas.find(t=>t.id === id)

if(!aba) return

aba.webview.style.display="flex"
aba.botao.classList.add("active-tab")

window.abaAtual = aba

atualizarBarraSegura()

}


// =======================================
// FECHAR ABA
// =======================================

function fecharAba(id){

const index = abas.findIndex(t=>t.id === id)

if(index === -1) return

const aba = abas[index]

try{

aba.webview.remove()
aba.botao.remove()

}catch(e){}

abas.splice(index,1)


// ainda existem abas

if(abas.length){

const novaIndex = Math.max(0,index-1)

trocarAba(abas[novaIndex].id)

}else{

novaAba("https://www.google.com")

}

salvarSessao()

}


// =======================================
// DUPLICAR ABA
// =======================================

function duplicarAba(){

if(!window.abaAtual) return

try{

const url = window.abaAtual.webview.getURL()

novaAba(url)

}catch(e){

console.warn("Erro duplicar aba")

}

}


// =======================================
// DUPLO CLIQUE NOVA ABA
// =======================================

document.addEventListener("dblclick",(e)=>{

if(e.target.id === "tabs"){
novaAba()
}

})


// =======================================
// RESTAURAR AO INICIAR
// =======================================

window.addEventListener("DOMContentLoaded",()=>{

setTimeout(()=>{

if(abas.length === 0){
restaurarSessao()
}

},200)

})
