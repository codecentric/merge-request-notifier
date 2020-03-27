import { BrowserWindow, Tray } from 'electron'

export const macOsWindowPosition = (win: BrowserWindow, tray: Tray) => {
    const windowBounds = win.getBounds()
    const trayBounds = tray.getBounds()

    const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2)
    const y = Math.round(trayBounds.y + trayBounds.height + 4)

    return { x, y }
}
