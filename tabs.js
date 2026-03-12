// =======================================
// SISTEMA DE ABAS
// =======================================

let abas = []
let abaAtual = null
let contadorAbas = 0


// =======================================
// NOVA ABA
// =======================================

function novaAba(url = "https://www.google.com") {

const browserContainer = document.getElementById("browser-container")
const tabsContainer = document.getElementById("tabs")

if(!browserContainer || !tabsContainer){
console.warn("Containers não encontrados")
return
}

contadorAbas++

const id = "tab-" + contadorAbas


// =======================================
// BOTÃO DA ABA
// =======================================

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

webview.style.width = "100%"
webview.style.height = "100%"
webview.style.display = "none"


// título da página

webview.addEventListener("page-title-updated",(e)=>{

if(e.title){
titulo.innerText = e.title.substring(0,25)
}

})


// favicon da página

webview.addEventListener("page-favicon-updated",(e)=>{

if(e.favicons && e.favicons.length){
icon.src = e.favicons[0]
}

})


// atualizar barra de URL

webview.addEventListener("did-navigate", ()=>{

if(typeof atualizarBarra === "function"){
atualizarBarra()
}

})

webview.addEventListener("did-navigate-in-page", ()=>{

if(typeof atualizarBarra === "function"){
atualizarBarra()
}

})

webview.addEventListener("did-finish-load", ()=>{

if(typeof atualizarBarra === "function"){
atualizarBarra()
}

})


// abrir links externos em nova aba

webview.addEventListener("new-window",(e)=>{

if(e.url){
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

// remover elementos

try{
aba.webview.remove()
aba.botao.remove()
}catch(err){
console.warn("Erro ao remover aba")
}

// remover da lista

abas.splice(index,1)


// se ainda existem abas

if(abas.length){

const novaIndex = Math.max(0,index-1)

trocarAba(abas[novaIndex].id)

}else{

novaAba()

}

}
