let abas = []
let abaAtual = null


// ===============================
// NOVA ABA
// ===============================

function novaAba(url = "https://www.google.com") {

const browserContainer = document.getElementById("browser-container")
const tabsContainer = document.getElementById("tabs")

const id = "tab-" + Date.now()

// botão da aba
const tabButton = document.createElement("div")
tabButton.className = "tab"
tabButton.id = id


// ícone do site
const icon = document.createElement("img")
icon.src = "https://www.google.com/favicon.ico"
icon.width = 16
icon.height = 16


// título da aba
const titulo = document.createElement("span")
titulo.innerText = "Nova Aba"


// botão fechar
const fechar = document.createElement("span")
fechar.innerText = "✕"
fechar.className = "close-tab"

fechar.onclick = (e) => {

e.stopPropagation()
fecharAba(id)

}


// montar aba
tabButton.appendChild(icon)
tabButton.appendChild(titulo)
tabButton.appendChild(fechar)

tabButton.onclick = () => trocarAba(id)

tabsContainer.appendChild(tabButton)


// ===============================
// WEBVIEW
// ===============================

const webview = document.createElement("webview")

webview.src = url
webview.style.width = "100%"
webview.style.height = "100%"
webview.style.display = "none"

webview.id = "view-" + id


// atualizar título
webview.addEventListener("page-title-updated", (e) => {

titulo.innerText = e.title.substring(0, 20)

})


// atualizar favicon
webview.addEventListener("page-favicon-updated", (e) => {

if(e.favicons && e.favicons.length){

icon.src = e.favicons[0]

}

})


// atualizar barra de URL
webview.addEventListener("did-navigate", () => {

const urlBar = document.getElementById("url")

if (urlBar && abaAtual && abaAtual.webview === webview) {

urlBar.value = webview.getURL()

}

})


// página carregou
webview.addEventListener("did-finish-load", () => {

const urlBar = document.getElementById("url")

if (urlBar && abaAtual && abaAtual.webview === webview) {

urlBar.value = webview.getURL()

}

})


browserContainer.appendChild(webview)


// salvar aba
abas.push({

id: id,
botao: tabButton,
webview: webview

})


// ativar aba
trocarAba(id)

}



// ===============================
// TROCAR ABA
// ===============================

function trocarAba(id) {

abas.forEach(tab => {

tab.webview.style.display = "none"
tab.botao.classList.remove("active-tab")

})

const aba = abas.find(t => t.id === id)

if (aba) {

aba.webview.style.display = "flex"
aba.botao.classList.add("active-tab")

abaAtual = aba

const urlBar = document.getElementById("url")

if (urlBar) {

urlBar.value = aba.webview.getURL() || ""

}

}

}



// ===============================
// FECHAR ABA
// ===============================

function fecharAba(id) {

const index = abas.findIndex(t => t.id === id)

if (index === -1) return

const aba = abas[index]

aba.webview.remove()
aba.botao.remove()

abas.splice(index, 1)


// abrir outra aba
if (abas.length > 0) {

trocarAba(abas[Math.max(0, index - 1)].id)

} else {

novaAba("https://www.google.com")

}

}
