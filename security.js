function verificarSite(url){

const palavrasSuspeitas = [
"free-money",
"bonus",
"crypto-bonus",
"win-money",
"double-your-money"
]

const suspeito = palavrasSuspeitas.some(p =>
url.toLowerCase().includes(p)
)

if(suspeito){

alert("⚠️ Atenção: Este site pode ser suspeito ou golpe.")

}

}
