const { session } = require("electron")

// ===============================
// LISTA DE DOMÍNIOS DE ANÚNCIOS
// ===============================

const blockedDomains = [

"doubleclick.net",
"googlesyndication.com",
"ads.youtube.com",
"adservice.google.com",
"googletagmanager.com",
"google-analytics.com",
"facebook.net",
"ads-twitter.com",
"taboola.com",
"outbrain.com",
"adsystem.com",
"adnxs.com"

]


// ===============================
// ATIVAR ADBLOCK
// ===============================

function enableAdBlock(){

session.defaultSession.webRequest.onBeforeRequest(

(details, callback)=>{

const url = details.url.toLowerCase()

// bloquear domínios de anúncios
if(blockedDomains.some(domain => url.includes(domain))){

console.log("🚫 anúncio bloqueado:", url)

return callback({ cancel:true })

}

// bloquear scripts de ads comuns
if(url.includes("/ads/") || url.includes("advert")){

console.log("🚫 possível anúncio bloqueado:", url)

return callback({ cancel:true })

}

callback({})

})

}

module.exports = enableAdBlock
