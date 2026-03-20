const { app, BrowserWindow, shell, session, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

// Importa seu AdBlock personalizado (opcional)
// const { enableAdBlock } = require('./adblock.js'); 

// CONFIGURAÇÃO DE LOGS
log.transports.file.level = "info";
autoUpdater.logger = log;

// BLOQUEADOR DE ANÚNCIOS (Tentativa de carregamento de biblioteca externa)
let adBlockerInstance = null;
try {
    const { ElectronBlocker } = require("@cliqz/adblocker-electron");
    const fetch = require("cross-fetch");
    adBlockerInstance = { ElectronBlocker, fetch };
} catch (e) {
    console.log("Dica: Use 'npm install @cliqz/adblocker-electron' para bloqueio avançado.");
}

// VARIÁVEIS GLOBAIS
let mainWindow;
const dataPath = app.getPath("userData");
const historyFile = path.join(dataPath, "history.json");
const favFile = path.join(dataPath, "favorites.json");

let historico = [];
let favoritos = [];

// =======================================
// GESTÃO DE DADOS (CARREGAR/SALVAR)
// =======================================

function carregarDados() {
    try {
        if (fs.existsSync(historyFile)) {
            historico = JSON.parse(fs.readFileSync(historyFile, "utf8"));
        }
        if (fs.existsSync(favFile)) {
            favoritos = JSON.parse(fs.readFileSync(favFile, "utf8"));
        }
    } catch (e) {
        console.error("Erro ao carregar dados:", e);
        historico = [];
        favoritos = [];
    }
}

let saveTimeout;
function agendarSalvamentoHistorico() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        const data = JSON.stringify(historico.slice(-500), null, 2);
        fs.writeFile(historyFile, data, (err) => {
            if (err) console.error("Erro ao salvar histórico:", err);
        });
    }, 5000); 
}

function salvarFavoritos() {
    try {
        fs.writeFileSync(favFile, JSON.stringify(favoritos, null, 2));
    } catch (e) {
        console.error("Erro ao salvar favoritos");
    }
}

// =======================================
// SEGURANÇA E SESSÃO
// =======================================

async function setupSecurity(sess) {
    // 1. Ativar Adblocker Externo
    if (adBlockerInstance) {
        adBlockerInstance.ElectronBlocker.fromPrebuiltAdsAndTracking(adBlockerInstance.fetch).then(blocker => {
            blocker.enableBlockingInSession(sess);
            console.log("🛡️ Adblock Engine: Ativado.");
        });
    }

    // 2. Gerenciar permissões
    sess.setPermissionRequestHandler((webContents, permission, callback) => {
        const allowed = ["notifications", "fullscreen", "audioCapture"]; 
        callback(allowed.includes(permission));
    });

    // 3. Headers de Segurança (Opcional: melhora privacidade)
    sess.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ["default-src * 'unsafe-inline' 'unsafe-eval' data: blob:"]
            }
        });
    });
}

// =======================================
// JANELA PRINCIPAL
// =======================================

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 850,
        minWidth: 900,
        minHeight: 600,
        title: "Nexus Browser",
        backgroundColor: "#020617",
        icon: path.join(__dirname, "assets/logo.png"),
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true
        }
    });

    mainWindow.loadFile("index.html");
    mainWindow.setMenu(null);

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
        // Se quiser abrir o DevTools automaticamente no início:
        // mainWindow.webContents.openDevTools();
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("http")) shell.openExternal(url);
        return { action: "deny" };
    });
}

// =======================================
// IPC HANDLERS
// =======================================

function setupIPC() {
    // Favoritos
    ipcMain.handle("get-favorites", () => favoritos);
    ipcMain.handle("add-favorite", (event, data) => {
        if (!favoritos.find(f => f.url === data.url)) {
            favoritos.push(data);
            salvarFavoritos();
            return true;
        }
        return false;
    });

    // Histórico
    ipcMain.handle("get-history", () => historico);
    ipcMain.on("register-history", (event, data) => {
        if (data.url.startsWith("http")) {
            historico.push({
                title: data.title || "Nova Aba",
                url: data.url,
                date: new Date().toLocaleTimeString()
            });
            agendarSalvamentoHistorico();
        }
    });

    // Atualizações
    ipcMain.on("check-update", () => {
        if (app.isPackaged) autoUpdater.checkForUpdatesAndNotify();
    });

    // IA - Mock de resposta (Aqui você conectaria com uma API real como Gemini/OpenAI)
    ipcMain.handle("ask-ai", async (event, prompt) => {
        // Exemplo simples de retorno:
        return `O Nexus AI recebeu sua mensagem: "${prompt}". (Para respostas reais, configure sua chave de API no processo Main).`;
    });
}

// =======================================
// CICLO DE VIDA
// =======================================

app.whenReady().then(async () => {
    carregarDados();
    setupIPC();
    await setupSecurity(session.defaultSession);
    
    // Inicia downloads
    session.defaultSession.on("will-download", (event, item) => {
        const ext = path.extname(item.getFilename()).toLowerCase();
        if ([".exe", ".bat", ".msi"].includes(ext)) {
            const choice = dialog.showMessageBoxSync({
                type: "warning",
                message: "Este arquivo pode ser perigoso. Baixar?",
                buttons: ["Cancelar", "Baixar"]
            });
            if (choice === 0) return event.preventDefault();
        }
    });

    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
