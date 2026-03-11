let abas = []
let abaAtual = null

function novaAba(url = "https://google.com"){

const browserContainer = document.getElementById("browser-container")
const tabsContainer = document.getElementById("tabs")

const id = "tab-" + Date.now()

// criar botão da aba
const tabButton = document.createElement("button")
tabButton.innerText = "Nova Aba"
tabButton.id = id

tabButton.onclick = () => trocarAba(id)

tabsContainer.appendChild(tabButton)

// criar navegador
const webview = document.createElement("webview")

webview.src = url
webview.style.width = "100%"
webview.style.height = "100%"
webview.style.display = "none"

webview.id = "view-" + id

browserContainer.appendChild(webview)

abas.push({
id:id,
webview:webview
})

trocarAba(id)

}

function trocarAba(id){

abas.forEach(tab=>{

tab.webview.style.display = "none"

})

const aba = abas.find(t=>t.id === id)

if(aba){

aba.webview.style.display = "flex"
abaAtual = aba

}

}
