// ===============================
// VERIFICAR SITE SUSPEITO
// ===============================

function verificarSite(url){

if(!url) return

url = url.toLowerCase()


// ===============================
// PALAVRAS SUSPEITAS
// ===============================

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
"instant-money"

]


// ===============================
// ENCURTADORES DE LINK
// ===============================

const encurtadores = [

"bit.ly",
"tinyurl.com",
"cutt.ly",
"t.co",
"shorturl",
"goo.gl",
"is.gd"

]


// ===============================
// DOMÍNIOS PERIGOSOS
// ===============================

const dominiosPerigosos = [

"phishing",
"login-secure",
"account-verify",
"update-wallet",
"crypto-airdrop"

]


// ===============================
// DETECÇÃO
// ===============================

const palavraPerigosa = palavrasSuspeitas.some(p => url.includes(p))

const linkEncurtado = encurtadores.some(p => url.includes(p))

const dominioFalso = dominiosPerigosos.some(p => url.includes(p))

const httpInseguro = url.startsWith("http://")


// ===============================
// ALERTAS
// ===============================

if(palavraPerigosa){

alert("⚠️ Atenção: Este site contém termos frequentemente usados em golpes.")

}


if(linkEncurtado){

alert("⚠️ Este link é encurtado. Verifique antes de acessar.")

}


if(dominioFalso){

alert("⚠️ Possível página falsa detectada.")

}


if(httpInseguro){

console.warn("Site sem HTTPS:", url)

}

}
