import { useState, useEffect } from 'react'
import { shell } from 'electron'
import * as log from 'electron-log'

import { useBackend } from '../hooks/merge-requests/backend'
import { MergeRequestWithProject } from '../hooks/merge-requests/types'
import { useConfig } from '../hooks/config'

export const NotificationsEmiter = () => {
    const { mergeRequestWithProjects } = useBackend()
    const { config } = useConfig()

    const [previousMergeRequests, setPreviousMergeRequests] = useState<MergeRequestWithProject[] | undefined>(undefined)

    useEffect(() => {
        const newMergeRequests = getNewMergeRequests(mergeRequestWithProjects, previousMergeRequests)
        if (newMergeRequests.length > 0 && config.generalConfig.useNotifications) {
            newMergeRequests.forEach((newMergeRequest) => {
                if (config.generalConfig.disableWipNotifications && newMergeRequest.work_in_progress) {
                    log.debug(`Ignoring the WIP merge request "${newMergeRequest.title}"`)
                    return
                }
                const body = newMergeRequest.title
                const icon = newMergeRequest.author.avatar_url
                const data = {
                    url: newMergeRequest.web_url,
                }

                const title = newMergeRequest.work_in_progress ? 'New WIP Merge Request' : 'New Merge Request'
                const notification = new Notification(title, { body, icon, data })
                notification.onclick = (event) => {
                    const url = (event?.currentTarget as any)?.data?.url
                    if (url) {
                        shell.openExternal(url)
                    }
                }
            })
        }

        setPreviousMergeRequests(mergeRequestWithProjects)
    }, [mergeRequestWithProjects])

    return null
}

function getNewMergeRequests(current?: MergeRequestWithProject[], previous?: MergeRequestWithProject[]): MergeRequestWithProject[] {
    if (!current || !previous) {
        return []
    }

    return current.filter((entry) => !previous.some((previousEntry) => previousEntry.id === entry.id))
}
