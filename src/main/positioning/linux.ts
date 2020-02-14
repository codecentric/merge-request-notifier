import { BrowserWindow, Tray } from 'electron'

export const linuxWindowPosition = (win: BrowserWindow, tray: Tray) => {
    // TODO: Carsten please have a look and fix the position ;-)

    const windowBounds = win.getBounds()
    const trayBounds = tray.getBounds()

    const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2)
    const y = Math.round(trayBounds.y + trayBounds.height + 4)

    return { x, y }
}
