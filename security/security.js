// =======================================
// SEGURANÇA DO NAVEGADOR
// =======================================

// evita alertas repetidos
let ultimoAviso = ""


// =======================================
// VERIFICAR SITE
// =======================================

function verificarSite(url){

if(!url) return

try{

url = url.toLowerCase()

}catch(e){
return
}


// =======================================
// PALAVRAS SUSPEITAS
// =======================================

const palavrasSuspeitas = [

"free-money",
"bonus",
"crypto-bonus",
"win-money",
"double-your-money",
"earn-fast",
"giveaway",
"claim-reward",
"bitcoin-free",
"easy-profit",
"instant-money",
"get-rich",
"airdrop",
"free-crypto"

]


// =======================================
// ENCURTADORES DE LINK
// =======================================

const encurtadores = [

"bit.ly",
"tinyurl.com",
"cutt.ly",
"t.co",
"is.gd",
"shorturl",
"rebrand.ly",
"tiny.cc"

]


// =======================================
// DOMÍNIOS SUSPEITOS
// =======================================

const dominiosPerigosos = [

"login-secure",
"verify-account",
"account-verify",
"update-wallet",
"secure-wallet",
"crypto-airdrop",
"metamask-login",
"wallet-update"

]


// =======================================
// DETECÇÃO
// =======================================

const palavraPerigosa =
palavrasSuspeitas.some(p => url.includes(p))

const linkEncurtado =
encurtadores.some(p => url.includes(p))

const dominioFalso =
dominiosPerigosos.some(p => url.includes(p))

const httpInseguro =
url.startsWith("http://")


// =======================================
// ALERTAS
// =======================================

if(palavraPerigosa){

mostrarAlertaSeguranca(
"⚠️ Este site contém termos frequentemente usados em golpes."
)

}


if(linkEncurtado){

mostrarAlertaSeguranca(
"⚠️ Este link usa encurtador. Verifique o destino antes de acessar."
)

}


if(dominioFalso){

mostrarAlertaSeguranca(
"🚨 Possível página de phishing detectada."
)

}


if(httpInseguro){

console.warn("Site sem HTTPS:", url)

}

}


// =======================================
// ALERTA VISUAL
// =======================================

function mostrarAlertaSeguranca(msg){

// evita repetição

if(ultimoAviso === msg) return

ultimoAviso = msg


let alerta = document.getElementById("alertaSeguranca")

if(alerta) alerta.remove()


alerta = document.createElement("div")

alerta.id = "alertaSeguranca"

alerta.style.position = "fixed"
alerta.style.bottom = "20px"
alerta.style.left = "20px"
alerta.style.background = "#7f1d1d"
alerta.style.color = "white"
alerta.style.padding = "12px 16px"
alerta.style.borderRadius = "8px"
alerta.style.fontSize = "14px"
alerta.style.zIndex = "99999"
alerta.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)"

alerta.innerText = msg

document.body.appendChild(alerta)


// remover automaticamente

setTimeout(()=>{
alerta.remove()
},5000)

}
