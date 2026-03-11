function verificarSite(url){

if(!url) return

url = url.toLowerCase()

// palavras suspeitas comuns em golpes
const palavrasSuspeitas = [
"free-money",
"bonus",
"crypto-bonus",
"win-money",
"double-your-money",
"earn-fast",
"giveaway",
"claim-reward",
"bitcoin-free"
]

// domínios encurtadores (usados em golpes)
const encurtadores = [
"bit.ly",
"tinyurl.com",
"cutt.ly",
"t.co",
"shorturl"
]

// verificar palavras suspeitas
const palavraPerigosa = palavrasSuspeitas.some(p =>
url.includes(p)
)

// verificar encurtadores
const linkEncurtado = encurtadores.some(p =>
url.includes(p)
)

// verificar HTTP inseguro
const httpInseguro = url.startsWith("http://")

if(palavraPerigosa){

alert("⚠️ Este site contém termos frequentemente usados em golpes.")

}

if(linkEncurtado){

alert("⚠️ Este link é encurtado. Tenha cuidado antes de acessar.")

}

if(httpInseguro){

console.warn("Site sem HTTPS:", url)

}

}
