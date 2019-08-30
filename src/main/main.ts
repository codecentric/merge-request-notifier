import { app, BrowserWindow, Tray, ipcMain } from 'electron'
import * as path from 'path'
import * as url from 'url'

let tray: Tray | null
let win: BrowserWindow | null

const installExtensions = async () => {
    const installer = require('electron-devtools-installer')
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

    return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(console.log)
}

const createTray = () => {
    tray = new Tray(path.join(__dirname, 'assets', 'icon.png'))

    tray.setToolTip('Merge Requests Notifier')
    tray.on('click', toggleWindow)
}

const toggleWindow = () => {
    win && win.isVisible() ? win.hide() : showWindow()
}

const getWindowPosition = () => {
    if (!win || !tray) {
        return undefined
    }

    const windowBounds = win.getBounds()
    const trayBounds = tray.getBounds()

    const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2)
    const y = Math.round(trayBounds.y + trayBounds.height + 4)

    return { x, y }
}

const setup = async () => {
    try {
        if (process.env.NODE_ENV !== 'production') {
            await installExtensions()
        }

        createTray()
        createWindow()
    } catch (error) {
        console.error('could not start the app', error)
    }
}

const showWindow = () => {
    const position = getWindowPosition()

    if (position && win) {
        win.setPosition(position.x, position.y, false)
        win.show()
    }
}

const createWindow = () => {
    win = new BrowserWindow({
        width: 550,
        height: 650,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: false,
        webPreferences: {
            backgroundThrottling: false,
        },
    })

    if (process.env.NODE_ENV !== 'production') {
        process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'
        win.loadURL(`http://localhost:2003`)
    } else {
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true,
            }),
        )
    }

    // if (process.env.NODE_ENV !== 'production') {
    //     // Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
    //     win.webContents.once('dom-ready', () => {
    //         win!.webContents.openDevTools()
    //     })
    // }

    win.on('closed', () => {
        win = null
    })

    win.on('blur', () => {
        win && win.hide()
    })
}

app.dock.hide()

app.on('ready', setup)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', async () => {
    if (win === null) {
        await createWindow()
    }
})

ipcMain.on('update-open-merge-requests', (_: any, openMergeRequests: number) => {
    if (tray) {
        if (openMergeRequests === 0) {
            tray.setTitle('')
        } else {
            tray.setTitle(String(openMergeRequests))
        }
    }
})

ipcMain.on('close-application', () => {
    app.quit()
})
