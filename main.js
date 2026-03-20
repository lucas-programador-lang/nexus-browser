const { app, BrowserWindow, shell, session, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

// CONFIGURAÇÃO DE LOGS
log.transports.file.level = "info";
autoUpdater.logger = log;

// BLOQUEADOR DE ANÚNCIOS (Tentativa de carregamento)
let adBlockerInstance = null;
try {
    const { ElectronBlocker } = require("@cliqz/adblocker-electron");
    const fetch = require("cross-fetch");
    adBlockerInstance = { ElectronBlocker, fetch };
} catch (e) {
    console.log("Adblocker module não instalado. Use: npm install @cliqz/adblocker-electron cross-fetch");
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
    }
}

// Debounce para salvar histórico (evita escrita excessiva no SSD/HD)
let saveTimeout;
function agendarSalvamentoHistorico() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        fs.writeFile(historyFile, JSON.stringify(historico.slice(-500), null, 2), (err) => {
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
// CONFIGURAÇÃO DE SEGURANÇA E SESSÃO
// =======================================

async function setupSecurity(sess) {
    // Ativar Adblocker se disponível
    if (adBlockerInstance) {
        const blocker = await adBlockerInstance.ElectronBlocker.fromPrebuiltAdsAndTracking(adBlockerInstance.fetch);
        blocker.enableBlockingInSession(sess);
        console.log("Adblock ativo na sessão.");
    }

    // Gerenciar permissões (Geolocalização, Notificações, etc)
    sess.setPermissionRequestHandler((webContents, permission, callback) => {
        const allowedPermissions = ["notifications", "fullscreen"]; 
        if (allowedPermissions.includes(permission)) {
            callback(true);
        } else {
            console.log(`Permissão negada automaticamente: ${permission}`);
            callback(false);
        }
    });
}

// =======================================
// JANELA PRINCIPAL
// =======================================

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        backgroundColor: "#0f172a",
        icon: path.join(__dirname, "assets/nexus.ico"),
        show: false, // Só mostra quando estiver pronto (evita flash branco)
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true,
            devTools: true
        }
    });

    mainWindow.loadFile("index.html");
    mainWindow.setMenu(null);

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });

    // Abrir links externos com segurança
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("http")) {
            shell.openExternal(url);
        }
        return { action: "deny" };
    });
}

// =======================================
// DOWNLOAD MANAGER
// =======================================

function iniciarDownloads() {
    session.defaultSession.on("will-download", (event, item) => {
        const fileName = item.getFilename();
        const url = item.getURL();
        const ext = path.extname(fileName).toLowerCase();

        // Bloqueio de arquivos perigosos
        const dangerExts = [".bat", ".cmd", ".ps1", ".exe", ".msi", ".vbs"];
        if (dangerExts.includes(ext)) {
            const choice = dialog.showMessageBoxSync(mainWindow, {
                type: "warning",
                buttons: ["Cancelar", "Baixar assim mesmo"],
                title: "Aviso de Segurança",
                message: `O arquivo "${fileName}" pode ser perigoso. Deseja continuar?`,
                defaultId: 0
            });

            if (choice === 0) {
                event.preventDefault();
                return;
            }
        }

        item.on("updated", (event, state) => {
            if (state === "progressing") {
                const percent = item.getTotalBytes() > 0 
                    ? Math.round((item.getReceivedBytes() / item.getTotalBytes()) * 100) 
                    : -1;
                
                if (!mainWindow.isDestroyed()) {
                    mainWindow.webContents.send("download-progress", { fileName, percent });
                }
            }
        });

        item.once("done", (event, state) => {
            if (state === "completed" && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send("download-complete", fileName);
                // Notificação nativa opcional
                shell.beep();
            }
        });
    });
}

// =======================================
// IPC HANDLERS (Comunicação Renderer -> Main)
// =======================================

function setupIPC() {
    ipcMain.handle("get-favorites", () => favoritos);
    
    ipcMain.handle("add-favorite", (event, data) => {
        const exists = favoritos.find(f => f.url === data.url);
        if (!exists) {
            favoritos.push(data);
            salvarFavoritos();
            return true;
        }
        return false;
    });

    ipcMain.handle("get-history", () => historico);

    ipcMain.on("check-update", () => {
        if (app.isPackaged) {
            autoUpdater.checkForUpdatesAndNotify();
        } else {
            console.log("Modo desenvolvimento: Update ignorado.");
        }
    });

    // Registrar navegação no histórico vindo do WebView (via Preload)
    ipcMain.on("register-history", (event, data) => {
        historico.push({
            title: data.title || "Sem título",
            url: data.url,
            date: new Date().toLocaleString()
        });
        agendarSalvamentoHistorico();
    });
}

// =======================================
// CICLO DE VIDA
// =======================================

app.whenReady().then(async () => {
    carregarDados();
    await setupSecurity(session.defaultSession);
    iniciarDownloads();
    setupIPC();
    createWindow();

    // Auto-update apenas em produção
    if (app.isPackaged) {
        autoUpdater.checkForUpdatesAndNotify();
    }

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
