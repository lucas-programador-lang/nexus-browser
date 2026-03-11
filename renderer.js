// ===============================
// NAVEGAR
// ===============================

function navegar(){

const urlBar = document.getElementById("url")

if(!urlBar) return

let urlInput = urlBar.value.trim()

if(!urlInput) return


// -------------------------------
// PESQUISA AUTOMÁTICA
// -------------------------------

if(!urlInput.includes(".")){

urlInput =
"https://www.google.com/search?q=" +
encodeURIComponent(urlInput)

}


// -------------------------------
// HTTPS AUTOMÁTICO
// -------------------------------

if(
!urlInput.startsWith("http://") &&
!urlInput.startsWith("https://")
){

urlInput = "https://" + urlInput

}


// -------------------------------
// VERIFICAR SEGURANÇA
// -------------------------------

if(typeof verificarSite === "function"){

verificarSite(urlInput)

}


// -------------------------------
// VERIFICAR ABA ATIVA
// -------------------------------

if(!abaAtual || !abaAtual.webview){

console.warn("Nenhuma aba ativa")

return

}


// -------------------------------
// NAVEGAR
// -------------------------------

abaAtual.webview.loadURL(urlInput)

}


// ===============================
// ATUALIZAR BARRA DE URL
// ===============================

function atualizarBarra(){

if(!abaAtual || !abaAtual.webview) return

const urlBar = document.getElementById("url")

if(!urlBar) return

try{

urlBar.value = abaAtual.webview.getURL()

}catch(err){

console.warn("Erro ao atualizar URL")

}

}


// ===============================
// EVENTOS DA PÁGINA
// ===============================

window.addEventListener("DOMContentLoaded", () => {

const urlBar = document.getElementById("url")

if(!urlBar) return


// ENTER NA BARRA

urlBar.addEventListener("keydown",(e)=>{

if(e.key === "Enter"){

navegar()

}

})

})


// ===============================
// ATALHOS DE TECLADO
// ===============================

document.addEventListener("keydown",(e)=>{


// Ctrl + L -> focar barra

if(e.ctrlKey && e.key === "l"){

e.preventDefault()

document.getElementById("url").focus()

}


// Ctrl + T -> nova aba

if(e.ctrlKey && e.key === "t"){

e.preventDefault()

novaAba("https://www.google.com")

}


// Ctrl + W -> fechar aba

if(e.ctrlKey && e.key === "w"){

e.preventDefault()

if(abaAtual){

fecharAba(abaAtual.id)

}

}

})
