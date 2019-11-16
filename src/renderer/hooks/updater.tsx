import * as React from 'react'
import { UpdateCheckResult } from 'electron-updater'
import { ipcRenderer } from 'electron'

export type UpdateInfo = undefined | UpdateCheckResult

interface UpdaterContext {
    updateInfo: UpdateInfo
    install: () => void
}

const Context = React.createContext<UpdaterContext | null>(null)

export function useUpdater() {
    const context = React.useContext(Context)
    if (!context) {
        throw new Error('Please use the UpdaterProvider')
    }
    return context
}

export const UpdaterProvider = ({ ...props }) => {
    const [updateInfo, setUpdateInfo] = React.useState<UpdateInfo>(undefined)

    const install = () => {
        ipcRenderer.send('download-and-install-update')
    }

    const checkForUpdates = () => {
        ipcRenderer.invoke('check-for-updates').then(result => {
            console.log('check-for-updates result', result)
            setUpdateInfo(result as UpdateCheckResult)
        })
    }

    React.useEffect(() => {
        checkForUpdates()

        const interval = setInterval(checkForUpdates, 10000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return <Context.Provider value={{ updateInfo, install }} {...props} />
}
