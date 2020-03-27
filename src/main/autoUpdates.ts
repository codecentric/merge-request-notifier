import { ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as log from 'electron-log'
import * as path from 'path'

export const setupAutoUpdater = () => {
    autoUpdater.autoDownload = false

    if (process.env.NODE_ENV !== 'production') {
        // __dirname is the "dist" folder
        autoUpdater.updateConfigPath = path.join(__dirname, '../dev-app-update.yml')
    }

    ipcMain.on('download-and-install-update', () => {
        autoUpdater.once('update-downloaded', () => {
            autoUpdater.quitAndInstall()
        })

        autoUpdater.downloadUpdate()
    })

    ipcMain.handle('check-for-updates', async () => {
        return autoUpdater.checkForUpdates().catch(error => log.error('error while checking for updates', error))
    })
}
