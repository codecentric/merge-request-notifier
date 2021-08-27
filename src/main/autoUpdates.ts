import { ipcMain, app } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as log from 'electron-log'
import * as path from 'path'

export const setupAutoUpdater = () => {
    autoUpdater.autoDownload = false

    if (!app.isPackaged) {
        // __dirname is the "dist" folder
        const updateConfigPath = path.join(__dirname, '../dev-app-update.yml')

        log.info(`Updating the auto updater config path to "${updateConfigPath}".`)
        autoUpdater.updateConfigPath = updateConfigPath
    }

    ipcMain.on('download-and-install-update', () => {
        autoUpdater.once('update-downloaded', () => {
            autoUpdater.quitAndInstall()
        })

        autoUpdater.downloadUpdate()
    })

    ipcMain.handle('check-for-updates', async () => {
        if (process.platform === 'darwin') {
            return autoUpdater.checkForUpdates().catch((error) => log.error('Error while checking for updates', error))
        }
        return undefined
    })
}
