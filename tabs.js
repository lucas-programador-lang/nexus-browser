// =======================================
// SISTEMA DE ABAS
// =======================================

let abas = []
let abaAtual = null
let contadorAbas = 0

const SESSION_KEY = "nexus_tabs_session"


// =======================================
// SALVAR SESSÃO
// =======================================

function salvarSessao(){

const dados = abas.map(a => {

try{
return a.webview.getURL()
}catch(e){
return "https://www.google.com"
}

})

localStorage.setItem(SESSION_KEY, JSON.stringify(dados))

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


// BOTÃO ABA

const tabButton = document.createElement("div")
tabButton.className = "tab"
tabButton.id = id


// favicon

const icon = document.createElement("img")
icon.src = "https://www.google.com/favicon.ico"


// título

const titulo = document.createElement("span")
titulo.innerText = "Nova Aba"


// botão fechar

const fechar = document.createElement("span")
fechar.innerText = "✕"
fechar.className = "close-tab"

fechar.onclick = (e)=>{

e.stopPropagation()
fecharAba(id)

}


// montar

tabButton.appendChild(icon)
tabButton.appendChild(titulo)
tabButton.appendChild(fechar)

tabButton.onclick = ()=> trocarAba(id)

tabsContainer.appendChild(tabButton)


// WEBVIEW

const webview = document.createElement("webview")

webview.src = url
webview.className = "browser-view"
webview.id = "view-" + id

webview.style.display="none"


// título

webview.addEventListener("page-title-updated",(e)=>{

if(e.title){
titulo.innerText = e.title.substring(0,25)
}

})


// favicon

webview.addEventListener("page-favicon-updated",(e)=>{

if(e.favicons && e.favicons.length){
icon.src = e.favicons[0]
}

})


// atualizar barra

webview.addEventListener("did-navigate", atualizarBarra)
webview.addEventListener("did-navigate-in-page", atualizarBarra)
webview.addEventListener("did-finish-load", atualizarBarra)


// detectar crash

webview.addEventListener("crashed", ()=>{

alert("A aba travou.")

})


// abrir nova aba

webview.addEventListener("new-window",(e)=>{

if(e.url){
novaAba(e.url)
}

})


// adicionar

browserContainer.appendChild(webview)


// salvar

abas.push({

id:id,
botao:tabButton,
webview:webview

})


// ativar

trocarAba(id)

salvarSessao()

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

abaAtual = aba

if(typeof atualizarBarra === "function"){
atualizarBarra()
}

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

if(abas.length){

const novaIndex = Math.max(0,index-1)

trocarAba(abas[novaIndex].id)

}else{

novaAba()

}

salvarSessao()

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

if(abas.length===0){
restaurarSessao()
}

},200)

})
