import { BrowserWindow, Tray, screen } from 'electron'

export const windowsWindowPosition = (win: BrowserWindow, tray: Tray) => {
    const windowBounds = win.getBounds()
    const trayBounds = tray.getBounds()
    const [windowWidth, windowHeight] = win.getSize()

    const screenwidth = screen.getPrimaryDisplay().workAreaSize.width
    const screenheight = screen.getPrimaryDisplay().workAreaSize.height

    let x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2)
    let y = Math.round(trayBounds.y + trayBounds.height + 4)

    if (x < 0) {
        x = 0
    }

    if (y < 0) {
        y = 0
    }

    if (x + windowWidth > screenwidth) {
        x = screenwidth - windowWidth
    }

    if (y + windowHeight > screenheight) {
        y = screenheight - windowHeight
    }

    return { x, y }
}
