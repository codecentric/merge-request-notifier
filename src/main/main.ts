import { app, BrowserWindow, Tray, ipcMain, Menu, MenuItemConstructorOptions, systemPreferences, nativeTheme } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as log from 'electron-log'
import * as path from 'path'
import * as url from 'url'
import * as electronSettings from 'electron-settings'

import { reportUnhandledRejections } from '../share/reportUnhandledRejections'

import { macOsWindowPosition } from './positioning/mac-os'
import { windowsWindowPosition } from './positioning/windows'
import { linuxWindowPosition } from './positioning/linux'
import { Config } from '../share/config'

let tray: Tray | null
let win: BrowserWindow | null

const WINDOW_WIDTH = 380
const WINDOW_HEIGHT = 460

const DEFAULT_CONFIG: Config = {
    generalConfig: {
        useNotifications: true,
        disableWipNotifications: true,
        darkMode: nativeTheme.shouldUseDarkColors,
    },
}

const installExtensions = async () => {
    const installer = require('electron-devtools-installer')
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = ['REACT_DEVELOPER_TOOLS']

    return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(console.log)
}

const getTrayImage = () => {
    const icon = nativeTheme.shouldUseDarkColors ? 'icon-dark-mode.png' : 'icon.png'

    return path.join(__dirname, 'assets', icon)
}

const createTray = () => {
    tray = new Tray(getTrayImage())

    tray.setToolTip('Merge Request Notifier')
    tray.on('click', toggleWindow)
}

const toggleWindow = () => {
    win && win.isVisible() ? hideWindow() : showWindow()
}

const getWindowPosition = () => {
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
        return linuxWindowPosition(win, tray)
    }

    return undefined
}

const setup = async () => {
    reportUnhandledRejections()
    log.debug('Starting the app')

    try {
        autoUpdater.autoDownload = false

        if (process.env.NODE_ENV !== 'production') {
            // __dirname is the "dist" folder
            autoUpdater.updateConfigPath = path.join(__dirname, '../dev-app-update.yml')
            await installExtensions()
        }

        createTray()
        createWindow()
        createMenu()

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

const hideWindow = () => {
    if (win && win.isVisible()) {
        win.hide()
        if (app.dock) {
            app.dock.hide()
        }
    }
}

const showWindow = () => {
    const position = getWindowPosition()

    if (position && win) {
        if (app.dock) {
            app.dock.show()
        }

        // We have to wait a bit because the dock.show() is triggering a "window.hide" event
        // otherwise the app would be closed immediately
        setTimeout(() => {
            win!.setPosition(position.x, position.y, false)
            win!.show()
        }, 200)
    }
}

const createMenu = () => {
    const menuTemplate: MenuItemConstructorOptions[] = [
        {
            label: 'Application',
            submenu: [
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: () => {
                        app.quit()
                    },
                },
            ],
        },
        {
            label: 'Development',
            submenu: [
                { type: 'separator' },
                {
                    label: 'Toggle DevTools',
                    click: () => {
                        if (win) {
                            if (win.webContents.isDevToolsOpened()) {
                                win.webContents.closeDevTools()
                                win.setSize(WINDOW_WIDTH, WINDOW_HEIGHT)
                            } else {
                                win.webContents.openDevTools()
                                win.setSize(WINDOW_WIDTH * 3, WINDOW_HEIGHT * 2)
                            }
                        }
                    },
                },
                {
                    label: 'Toggle Test Data',
                    click: () => {
                        toggleQueryParam('test-data')
                    },
                },
                {
                    label: 'Toggle Fake update',
                    click: () => {
                        toggleQueryParam('fake-update')
                    },
                },
            ],
        },
        {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
                { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
                { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
                { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
                { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
            ],
        },
    ]

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
}

const toggleQueryParam = (parameter: string) => {
    if (win) {
        const currentUrl = new URL(win.webContents.getURL())

        if (currentUrl.searchParams.has(parameter)) {
            currentUrl.searchParams.delete(parameter)
        } else {
            currentUrl.searchParams.set(parameter, '1')
        }

        win.loadURL(currentUrl.href)
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
    win = new BrowserWindow({
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

    win.on('closed', () => {
        win = null
    })

    win.on('blur', () => {
        hideWindow()
    })
}

if (app.dock) {
    app.dock.hide()
}

app.on('ready', () => {
    setup().then(() => {
        log.debug('Setup completed')
    })
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
        if (openMergeRequests === 0) {
            tray.setTitle('')
        } else {
            tray.setTitle(String(openMergeRequests))
        }
    }
})

ipcMain.on('download-and-install-update', () => {
    autoUpdater.once('update-downloaded', () => {
        autoUpdater.quitAndInstall()
    })

    autoUpdater.downloadUpdate()
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
    electronSettings.set('config.v3', data as any)
})

ipcMain.handle('check-for-updates', async () => {
    return autoUpdater.checkForUpdates().catch(error => log.error('error while checking for updates', error))
})

ipcMain.on('close-application', () => {
    app.quit()
})
