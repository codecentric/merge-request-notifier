import { app, Menu, MenuItemConstructorOptions } from 'electron'
import BrowserWindow = Electron.BrowserWindow

import { WINDOW_HEIGHT, WINDOW_WIDTH } from './main'

export const createMenu = (window: BrowserWindow) => {
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
                        if (window.webContents.isDevToolsOpened()) {
                            window.webContents.closeDevTools()
                            window.setSize(WINDOW_WIDTH, WINDOW_HEIGHT)
                        } else {
                            window.webContents.openDevTools()
                            window.setSize(WINDOW_WIDTH * 3, WINDOW_HEIGHT * 2)
                        }
                    },
                },
                {
                    label: 'Toggle Test Data',
                    click: () => {
                        toggleQueryParam(window, 'test-data')
                    },
                },
                {
                    label: 'Toggle Fake update',
                    click: () => {
                        toggleQueryParam(window, 'fake-update')
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

    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
}

const toggleQueryParam = (window: BrowserWindow, parameter: string) => {
    const currentUrl = new URL(window.webContents.getURL())

    if (currentUrl.searchParams.has(parameter)) {
        currentUrl.searchParams.delete(parameter)
    } else {
        currentUrl.searchParams.set(parameter, '1')
    }

    window.loadURL(currentUrl.href)
}
