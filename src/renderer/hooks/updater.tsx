import * as React from 'react'
import { UpdateCheckResult } from 'electron-updater'
import { ipcRenderer } from 'electron'

export type UpdateInfo = undefined | UpdateCheckResult

interface UpdaterContext {
    updateInfo: UpdateInfo
    install: () => void
}

const Context = React.createContext<UpdaterContext | null>(null)

const url = new URL(document.location.href)
const SHOW_FAKE_UPDATE = url.searchParams.has('fake-update')
if (SHOW_FAKE_UPDATE) {
    console.info('Application show a "Fake Update"')
}

const FAKE_UPDATE: UpdateCheckResult = {
    updateInfo: {
        version: '1.0.0',
        files: [],
        path: 'deprecated',
        sha512: 'deprecated',
        releaseName: 'Version 1.0',
        releaseNotes:
            '<p><g-emoji class="g-emoji" alias="raised_hands" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f64c.png">🙌</g-emoji> <strong>New Features:</strong></p>\n<ul>\n<li>New "about us" page</li>\n<li>showing the current app version</li>\n</ul>\n<p>🧐 <strong>Under the hood:</strong></p>\n<ul>\n<li>Updating some dependencies</li>\n</ul>', // tslint:disable-line:max-line-length
        releaseDate: '2019-11-07T11:49:04.948Z',
    },
    versionInfo: {
        version: 'deprecated',
        files: [],
        path: 'deprecated',
        sha512: 'deprecated',
        releaseName: 'deprecated',
        releaseNotes: 'deprecated',
        releaseDate: 'deprecated',
    },
}

export function useUpdater() {
    const context = React.useContext(Context)
    if (!context) {
        throw new Error('Please use the UpdaterProvider')
    }
    return context
}

export const UpdaterProvider = ({ ...props }) => {
    const [updateInfo, setUpdateInfo] = React.useState<UpdateInfo>(SHOW_FAKE_UPDATE ? FAKE_UPDATE : undefined)

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
