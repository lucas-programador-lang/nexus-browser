// ===============================
// RESUMIR PÁGINA
// ===============================

function resumir(){

if(!abaAtual || !abaAtual.webview){

alert("Nenhuma página aberta.")

return

}

// pegar texto da página
abaAtual.webview.executeJavaScript(`

document.body.innerText

`).then((texto)=>{

if(!texto){

alert("Não foi possível obter o conteúdo.")

return

}

// resumo simples
let resumo = texto
.replace(/\\s+/g," ")
.substring(0,800)

mostrarJanelaIA(resumo)

})

}


// ===============================
// MODO ESTUDO
// ===============================

function modoEstudo(){

if(!abaAtual || !abaAtual.webview){

alert("Nenhuma página aberta.")

return

}

abaAtual.webview.executeJavaScript(`

document.body.style.background = "#111";
document.body.style.color = "#eee";
document.body.style.fontSize = "18px";
document.body.style.lineHeight = "1.7";

`)

alert("Modo estudo ativado.")

}


// ===============================
// JANELA DA IA
// ===============================

function mostrarJanelaIA(texto){

let janela = document.getElementById("janelaIA")

if(!janela){

janela = document.createElement("div")

janela.id = "janelaIA"

janela.style.position = "fixed"
janela.style.right = "20px"
janela.style.bottom = "20px"
janela.style.width = "350px"
janela.style.height = "400px"

janela.style.background = "#0f172a"
janela.style.border = "1px solid #334155"
janela.style.borderRadius = "10px"
janela.style.padding = "15px"
janela.style.overflow = "auto"

janela.style.zIndex = "9999"
janela.style.color = "white"

document.body.appendChild(janela)

}

janela.innerHTML = `

<h3>Resumo da Página</h3>

<p style="font-size:14px;line-height:1.6">

${texto}

</p>

<button onclick="fecharIA()" style="
margin-top:10px;
padding:6px 10px;
background:#2563eb;
border:none;
border-radius:6px;
color:white;
cursor:pointer;
">

Fechar

</button>

`

}


// ===============================
// FECHAR IA
// ===============================

function fecharIA(){

const janela = document.getElementById("janelaIA")

if(janela){

janela.remove()

}

}
