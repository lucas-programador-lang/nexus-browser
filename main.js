const { app, BrowserWindow } = require("electron")

function createWindow(){

const win = new BrowserWindow({
width:1400,
height:900,
webPreferences:{
preload: __dirname + "/preload.js"
}
})

win.loadFile("index.html")

}

app.whenReady().then(createWindow)
