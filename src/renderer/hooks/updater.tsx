import React from 'react'
import { ipcRenderer } from 'electron'
import * as log from 'electron-log'
import moment from 'moment'
import * as request from 'superagent'
import showdown from 'showdown'

export interface UpdateInfo {
    version: string
    releaseDate: string
    releaseNotes?: string
}

interface UpdaterContext {
    updateInfo: UpdateInfo | undefined
    install: () => void
}

const converter = new showdown.Converter()

const Context = React.createContext<UpdaterContext | null>(null)

const url = new URL(document.location.href)
const SHOW_FAKE_UPDATE = url.searchParams.has('fake-update')
if (SHOW_FAKE_UPDATE) {
    log.info('Application shows a "Fake Update"')
}

const FAKE_UPDATE: UpdateInfo = {
    version: '13.3.7',
    releaseNotes:
        '<p><g-emoji class="g-emoji" alias="raised_hands" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f64c.png">🙌</g-emoji> <strong>New Features:</strong></p>\n<ul>\n<li>New "about us" page</li>\n<li>showing the current app version</li>\n</ul>\n<p>🧐 <strong>Under the hood:</strong></p>\n<ul>\n<li>Updating some dependencies</li>\n</ul>', // tslint:disable-line:max-line-length
    releaseDate: moment().toISOString(),
}

export function useUpdater() {
    const context = React.useContext(Context)
    if (!context) {
        throw new Error('Please use the UpdaterProvider')
    }
    return context
}

export const UpdaterProvider = ({ ...props }) => {
    const [updateInfo, setUpdateInfo] = React.useState<UpdateInfo | undefined>(SHOW_FAKE_UPDATE ? FAKE_UPDATE : undefined)

    const install = () => {
        ipcRenderer.send('download-and-install-update')
    }

    const checkForUpdates = () => {
        if (SHOW_FAKE_UPDATE) {
            return
        }

        // export interface UpdateInfo {
        //     /**
        //      * The version.
        //      */
        //     readonly version: string;
        //     readonly files: Array<UpdateFileInfo>;
        //     /** @deprecated */
        //     readonly path: string;
        //     /** @deprecated */
        //     readonly sha512: string;
        //     /**
        //      * The release name.
        //      */
        //     releaseName?: string | null;
        //     /**
        //      * The release notes. List if `updater.fullChangelog` is set to `true`, `string` otherwise.
        //      */
        //     releaseNotes?: string | Array<ReleaseNoteInfo> | null;
        //     /**
        //      * The release date.
        //      */
        //     releaseDate: string;
        //     /**
        //      * The [staged rollout](/auto-update#staged-rollouts) percentage, 0-100.
        //      */
        //     readonly stagingPercentage?: number;
        // }

        request.get('https://api.github.com/repos/codecentric/merge-request-notifier/releases/latest').then(result => {
            const {
                body: { tag_name, published_at, body },
            } = result

            const releaseNotes = converter.makeHtml(body)

            setUpdateInfo({
                version: tag_name,
                releaseDate: published_at,
                releaseNotes,
            })
        })
    }

    React.useEffect(() => {
        checkForUpdates()

        const everyTenMinutes = 10 * 60 * 1000
        const interval = setInterval(checkForUpdates, everyTenMinutes)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return <Context.Provider value={{ updateInfo, install }} {...props} />
}
