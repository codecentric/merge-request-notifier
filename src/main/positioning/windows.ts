import { BrowserWindow, Tray } from 'electron'
import positioner from 'electron-traywindow-positioner'

export const windowsWindowPosition = (win: BrowserWindow, tray: Tray) => {
    return positioner.calculate(win.getBounds(), tray.getBounds())
}
