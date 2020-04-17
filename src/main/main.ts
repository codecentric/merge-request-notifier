import { app, BrowserWindow, globalShortcut, ipcMain, nativeTheme, systemPreferences, Tray } from 'electron'
import * as log from 'electron-log'
import * as path from 'path'
import * as url from 'url'
import * as electronSettings from 'electron-settings'

import { reportUnhandledRejections } from '../share/reportUnhandledRejections'

import { macOsWindowPosition } from './positioning/mac-os'
import { windowsWindowPosition } from './positioning/windows'
import { linuxWindowPosition } from './positioning/linux'
import { Config, DEFAULT_CONFIG } from '../share/config'
import { setupAutoUpdater } from './autoUpdates'
import { createMenu } from './menu'

let tray: Tray | null
let win: BrowserWindow | null

export const WINDOW_WIDTH = 380
export const WINDOW_HEIGHT = 460

const installExtensions = async () => {
    const installer = require('electron-devtools-installer')
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = ['REACT_DEVELOPER_TOOLS']

    return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(console.log)
}

const getTrayImage = (openMergeRequests: number = 0) => {
    const suffix = openMergeRequests === 0 ? '' : openMergeRequests > 20 ? '-more' : `-${openMergeRequests}`
    const icon = nativeTheme.shouldUseDarkColors ? 'icon-dark-mode' : 'icon'

    return path.join(__dirname, 'assets', `${icon}${suffix}@2x.png`)
}

const createTray = () => {
    tray = new Tray(getTrayImage())

    tray.setToolTip('Merge Request Notifier')
    tray.on('click', () => toggleWindow(true))
}

const getWindowPosition = (fromTray: boolean) => {
    if (!win || !tray) {
        return undefined
    }

    if (process.platform === 'darwin') {
        return macOsWindowPosition(win, tray)
    }
    if (process.platform === 'win32') {
        return windowsWindowPosition(win, tray)
    }
    if (process.platform === 'linux') {
        return linuxWindowPosition(win, tray, fromTray)
    }

    return undefined
}

const setup = async () => {
    reportUnhandledRejections()
    log.debug('Starting the app')

    try {
        setupAutoUpdater()

        if (process.env.NODE_ENV !== 'production') {
            await installExtensions()
        }

        createTray()
        win = createWindow()
        createMenu(win)

        const config = getConfig()
        updateGlobalShortcut(config.generalConfig.openShortcut)
        updateStartOnLoginConfiguration(config.generalConfig.startOnLogin)

        if (process.platform === 'darwin') {
            // macOS specific configuration
            systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => {
                if (tray) {
                    tray.setImage(getTrayImage())
                }
            })
        }

        if (process.platform === 'win32') {
            // windows specific configuration
            app.setAppUserModelId(process.execPath)
        }

        log.debug('App started')
    } catch (error) {
        log.error(`Could not start the app: ${JSON.stringify(error)}`)
    }
}

const toggleWindow = (fromTray: boolean) => {
    win?.isVisible() ? hideWindow() : showWindow(fromTray)
}

const hideWindow = () => {
    if (win?.isVisible()) {
        win.hide()
        app.dock?.hide()
    }
}

const showWindow = (fromTray: boolean) => {
    const position = getWindowPosition(fromTray)

    if (position && win) {
        app.dock?.show()

        // We have to wait a bit because the dock.show() is triggering a "window.hide" event
        // otherwise the app would be closed immediately
        setTimeout(() => {
            win?.setPosition(position.x, position.y, false)
            win?.show()
        }, 200)
    }
}

const getConfig = (): Config => {
    const savedConfig = electronSettings.get('config.v3') as any
    log.debug('loading config', savedConfig)

    if (savedConfig) {
        return {
            connectionConfig: savedConfig.connectionConfig,
            generalConfig: {
                ...DEFAULT_CONFIG.generalConfig,
                ...savedConfig.generalConfig,
            },
        }
    }

    return DEFAULT_CONFIG
}

const createWindow = () => {
    const browserWindow = new BrowserWindow({
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: false,
        webPreferences: {
            backgroundThrottling: false,
            nodeIntegration: true,
        },
    })

    if (process.env.NODE_ENV !== 'production') {
        process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'
        browserWindow.loadURL(`http://localhost:2003`)
    } else {
        browserWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true,
            }),
        )
    }

    browserWindow.on('closed', () => {
        win = null
    })

    browserWindow.on('blur', () => {
        hideWindow()
    })

    return browserWindow
}

const updateStartOnLoginConfiguration = (startOnLogin: boolean) => {
    app.setLoginItemSettings({
        openAtLogin: startOnLogin,
        openAsHidden: true,
    })
}

const updateGlobalShortcut = (shortcut: string) => {
    globalShortcut.unregisterAll()
    globalShortcut.register(shortcut, () => {
        if (win) {
            toggleWindow(false)
        }
    })
}

app.dock?.hide()

app.on('ready', () => {
    setup().then(() => {
        log.debug('Setup completed')
    })
})

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
})

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
        const { showOpenMergeRequestsInTrayIcon } = getConfig().generalConfig
        if (showOpenMergeRequestsInTrayIcon) {
            tray.setImage(getTrayImage(openMergeRequests))
        }
    }
})

ipcMain.on('remove-config', (event: Electron.IpcMainEvent) => {
    electronSettings.delete('config.v3')

    event.returnValue = DEFAULT_CONFIG
})

ipcMain.on('get-config', (event: Electron.IpcMainEvent) => {
    event.returnValue = getConfig()
})

ipcMain.on('set-config', (_: Electron.IpcMainEvent, data: Config) => {
    log.debug('saving the config', data)

    updateGlobalShortcut(data.generalConfig.openShortcut)
    updateStartOnLoginConfiguration(data.generalConfig.startOnLogin)

    electronSettings.set('config.v3', data as any)
})

ipcMain.on('close-application', () => {
    app.quit()
})
