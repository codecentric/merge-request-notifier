import { BrowserWindow, Tray, screen } from 'electron'

export const linuxWindowPosition = (win: BrowserWindow, tray: Tray, fromTray: boolean) => {
    const windowBounds = win.getBounds()
    const mousePosition = screen.getCursorScreenPoint()
    const { bounds: displayBounds } = screen.getDisplayNearestPoint(mousePosition)

    if (fromTray) {
        const trayBounds = tray.getBounds()

        let x: number
        let y: number
        if (trayBounds.width > 0) {
            x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2)
            y = Math.round(trayBounds.y + trayBounds.height + 4)
        } else {
            // no tray info
            x = Math.round(mousePosition.x - windowBounds.width / 2)
            y = Math.round(mousePosition.y + 4)
        }

        x = Math.min(x, displayBounds.x + displayBounds.width - windowBounds.width - 10)
        y = Math.min(y, displayBounds.y + displayBounds.height - windowBounds.height - 20)

        return { x, y }
    } else {
        // use centered window
        const x = displayBounds.x + (displayBounds.width - windowBounds.width) / 2
        const y = displayBounds.y + (displayBounds.height - windowBounds.height) / 2
        return { x, y }
    }
}
