const { session } = require("electron")

const blockedDomains = [
"doubleclick.net",
"googlesyndication.com",
"ads.youtube.com",
"adservice.google.com"
]

function enableAdBlock(){

session.defaultSession.webRequest.onBeforeRequest(
(details, callback) => {

if(blockedDomains.some(domain => details.url.includes(domain))){
return callback({ cancel:true })
}

callback({})
})

}

module.exports = enableAdBlock
