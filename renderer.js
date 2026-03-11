function navegar(){

const urlBar = document.getElementById("url")

if(!urlBar) return

let urlInput = urlBar.value.trim()

if(!urlInput) return

// pesquisa se não tiver domínio
if(!urlInput.includes(".")){
urlInput = "https://www.google.com/search?q=" + encodeURIComponent(urlInput)
}

// adicionar https
if(!urlInput.startsWith("http://") && !urlInput.startsWith("https://")){
urlInput = "https://" + urlInput
}

// verificar site suspeito
if(typeof verificarSite === "function"){
verificarSite(urlInput)
}

// verificar se existe aba ativa
if(!abaAtual || !abaAtual.webview){
console.warn("Nenhuma aba ativa")
return
}

// navegar
abaAtual.webview.src = urlInput

}


// atualizar barra de endereço quando navegar
function atualizarBarra(){

if(!abaAtual || !abaAtual.webview) return

const urlBar = document.getElementById("url")

if(urlBar){
urlBar.value = abaAtual.webview.getURL()
}

}


// listeners quando o navegador carregar
window.addEventListener("DOMContentLoaded", () => {

const urlBar = document.getElementById("url")

if(urlBar){

urlBar.addEventListener("keydown",(e)=>{

if(e.key === "Enter"){
navegar()
}

})

}

})
