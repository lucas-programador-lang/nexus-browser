// =======================================
// ABRIR PAINEL IA
// =======================================

function abrirIA(){

let painel = document.getElementById("painelIA")

if(painel) return

painel = document.createElement("div")

painel.id = "painelIA"

painel.style.position = "fixed"
painel.style.right = "0"
painel.style.top = "0"
painel.style.width = "380px"
painel.style.height = "100%"
painel.style.background = "#0f172a"
painel.style.borderLeft = "1px solid #334155"
painel.style.zIndex = "9999"
painel.style.display = "flex"
painel.style.flexDirection = "column"

painel.innerHTML = `

<div style="
padding:12px;
border-bottom:1px solid #334155;
font-weight:bold;
">

Nexus AI

</div>

<div id="iaChat" style="
flex:1;
padding:10px;
overflow:auto;
font-size:14px;
line-height:1.6;
">

Olá 👋  
Posso ajudar a explicar páginas, resumir conteúdo ou responder perguntas.

</div>

<div style="
padding:10px;
border-top:1px solid #334155;
display:flex;
gap:6px;
">

<input
id="iaInput"
placeholder="Pergunte algo..."
style="
flex:1;
padding:8px;
border:none;
border-radius:6px;
background:#1e293b;
color:white;
outline:none;
"
/>

<button id="iaEnviar">Enviar</button>

<button onclick="resumirPagina()">Resumo</button>

<button onclick="fecharIA()">✕</button>

</div>

`

document.body.appendChild(painel)

document.getElementById("iaEnviar").onclick = perguntarIA

}


// =======================================
// FECHAR IA
// =======================================

function fecharIA(){

const painel = document.getElementById("painelIA")

if(painel){
painel.remove()
}

}


// =======================================
// PERGUNTAR PARA IA
// =======================================

async function perguntarIA(){

const input = document.getElementById("iaInput")
const chat = document.getElementById("iaChat")

if(!input.value.trim()) return

const pergunta = input.value

chat.innerHTML += `<p><b>Você:</b> ${pergunta}</p>`

input.value = ""

chat.innerHTML += `<p><i>IA pensando...</i></p>`

try{

const resposta = await window.nexus.askAI(pergunta)

chat.innerHTML += `<p><b>IA:</b> ${resposta}</p>`

}catch(e){

chat.innerHTML += `<p><b>Erro ao consultar IA</b></p>`

}

chat.scrollTop = chat.scrollHeight

}


// =======================================
// RESUMIR PÁGINA
// =======================================

function resumirPagina(){

if(!abaAtual || !abaAtual.webview){

alert("Nenhuma página aberta")

return

}

abaAtual.webview.executeJavaScript(`

document.body.innerText

`).then(async texto=>{

const conteudo = texto.substring(0,4000)

const chat = document.getElementById("iaChat")

chat.innerHTML += `<p><i>Resumindo página...</i></p>`

try{

const resumo = await window.nexus.askAI(
"Resuma este texto:\n\n" + conteudo
)

chat.innerHTML += `<p><b>Resumo:</b> ${resumo}</p>`

}catch(e){

chat.innerHTML += `<p>Erro ao gerar resumo</p>`

}

})

}


// =======================================
// MODO ESTUDO
// =======================================

function modoEstudo(){

if(!abaAtual || !abaAtual.webview){

alert("Nenhuma página aberta.")

return

}

abaAtual.webview.executeJavaScript(`

document.body.style.background="#111";
document.body.style.color="#eee";
document.body.style.fontSize="18px";
document.body.style.lineHeight="1.7";

Array.from(document.querySelectorAll("img,video")).forEach(e=>e.style.display="none")

`)

alert("Modo estudo ativado")

}
