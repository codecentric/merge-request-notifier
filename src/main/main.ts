import { app, BrowserWindow, globalShortcut, ipcMain, nativeTheme, systemPreferences, Tray } from 'electron'
import * as log from 'electron-log'
import * as path from 'path'
import * as url from 'url'
import * as electronSettings from 'electron-settings'

import { reportUnhandledRejections } from '../share/reportUnhandledRejections'

import { macOsWindowPosition } from './positioning/mac-os'
import { windowsWindowPosition } from './positioning/windows'
import { linuxWindowPosition } from './positioning/linux'
import { Config, DEFAULT_CONFIG, GeneralConfig } from '../share/config'
import { setupAutoUpdater } from './autoUpdates'
import { createMenu } from './menu'

let tray: Tray | null
let win: BrowserWindow | null

const IS_DEV = process.env.NODE_ENV !== 'production'

export const WINDOW_WIDTH = 380
export const WINDOW_HEIGHT = 460

const installExtensions = async () => {
    const installer = require('electron-devtools-installer')
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = ['REACT_DEVELOPER_TOOLS']

    return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(log.error)
}

const getTrayImage = (openMergeRequests: number = 0) => {
    const generalConfig = getGeneralConfig()
    const suffix = openMergeRequests === 0 ? 'default' : openMergeRequests > 9 ? 'more' : openMergeRequests
    let icon
    if (generalConfig.trayIconForDarkMode === 'system') {
        icon = nativeTheme.shouldUseDarkColors ? 'icon-dark-mode' : 'icon-light-mode'
    } else if (generalConfig.trayIconForDarkMode === 'darkMode') {
        icon = 'icon-dark-mode'
    } else {
        icon = 'icon-light-mode'
    }

    return path.join(__dirname, 'assets', `${icon}-${suffix}.png`)
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
    log.transports.console.level = IS_DEV ? 'silly' : 'error'
    log.debug('Starting the app')

    try {
        if (IS_DEV) {
            await installExtensions()
        }

        createTray()
        win = createWindow()
        createMenu(win)

        const generalConfig = getGeneralConfig()
        updateGlobalShortcut(generalConfig.openShortcut)
        updateStartOnLoginConfiguration(generalConfig.startOnLogin)

        if (process.platform === 'darwin') {
            // macOS specific configuration
            setupAutoUpdater()

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
        log.error('Could not start the app', error)
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
    const savedConfig: Config = electronSettings.get('config.v3') as any

    if (savedConfig) {
        log.debug('Found config', { ...savedConfig, connectionConfig: { ...savedConfig.connectionConfig, token: 'hidden' } })

        return {
            connectionConfig: savedConfig.connectionConfig,
            generalConfig: {
                ...DEFAULT_CONFIG.generalConfig,
                ...savedConfig.generalConfig,
            },
        }
    } else {
        log.debug('No saved config found')
    }

    return DEFAULT_CONFIG
}

const getGeneralConfig = (): GeneralConfig => {
    const savedConfig: Config = electronSettings.get('config.v3') as any

    if (savedConfig) {
        return savedConfig.generalConfig
    }

    return DEFAULT_CONFIG.generalConfig
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

    if (IS_DEV) {
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

app.allowRendererProcessReuse = true

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
        const { showOpenMergeRequestsInTrayIcon } = getGeneralConfig()
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
    log.debug('Saving the config', { ...data, connectionConfig: { ...data.connectionConfig, token: 'hidden' } })

    updateGlobalShortcut(data.generalConfig.openShortcut)
    updateStartOnLoginConfiguration(data.generalConfig.startOnLogin)

    electronSettings.set('config.v3', data as any)
})

ipcMain.on('close-application', () => {
    app.quit()
})
