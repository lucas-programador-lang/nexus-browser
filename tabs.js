let abas = []
let abaAtual = null

function novaAba(url = "https://google.com"){

const browserContainer = document.getElementById("browser-container")
const tabsContainer = document.getElementById("tabs")

const id = "tab-" + Date.now()

// botão da aba
const tabButton = document.createElement("div")
tabButton.className = "tab"
tabButton.id = id

// título da aba
const titulo = document.createElement("span")
titulo.innerText = "Nova Aba"

// botão fechar
const fechar = document.createElement("span")
fechar.innerText = " ✕"
fechar.className = "close-tab"

fechar.onclick = (e)=>{
e.stopPropagation()
fecharAba(id)
}

tabButton.appendChild(titulo)
tabButton.appendChild(fechar)

tabButton.onclick = ()=> trocarAba(id)

tabsContainer.appendChild(tabButton)

// criar webview
const webview = document.createElement("webview")

webview.src = url
webview.style.width = "100%"
webview.style.height = "100%"
webview.style.display = "none"

webview.id = "view-" + id

// atualizar título da aba
webview.addEventListener("page-title-updated", (e)=>{
titulo.innerText = e.title.substring(0,20)
})

// atualizar barra de URL
webview.addEventListener("did-navigate", ()=>{
const urlBar = document.getElementById("url")
if(urlBar){
urlBar.value = webview.getURL()
}
})

browserContainer.appendChild(webview)

abas.push({
id:id,
botao:tabButton,
webview:webview
})

trocarAba(id)

}

function trocarAba(id){

abas.forEach(tab=>{

tab.webview.style.display = "none"
tab.botao.classList.remove("active-tab")

})

const aba = abas.find(t=>t.id === id)

if(aba){

aba.webview.style.display = "flex"
aba.botao.classList.add("active-tab")
abaAtual = aba

}

}

function fecharAba(id){

const index = abas.findIndex(t=>t.id === id)

if(index === -1) return

const aba = abas[index]

aba.webview.remove()
aba.botao.remove()

abas.splice(index,1)

if(abas.length > 0){
trocarAba(abas[Math.max(0,index-1)].id)
}

}
