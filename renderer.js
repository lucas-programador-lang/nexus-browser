function navegar(){

let urlInput = document.getElementById("url").value.trim()
let browser = document.getElementById("browser")

if(!urlInput){
return
}

// se não tiver ponto, considerar como pesquisa
if(!urlInput.includes(".")){
urlInput = "https://www.google.com/search?q=" + encodeURIComponent(urlInput)
}

// adicionar https se não tiver protocolo
if(!urlInput.startsWith("http://") && !urlInput.startsWith("https://")){
urlInput = "https://" + urlInput
}

// verificar site suspeito
if(typeof verificarSite === "function"){
verificarSite(urlInput)
}

// abrir página
browser.src = urlInput

}
