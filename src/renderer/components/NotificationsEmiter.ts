import { useState, useEffect } from 'react'
import { shell } from 'electron'

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
            newMergeRequests.forEach(newMergeRequest => {
                const body = newMergeRequest.title
                const icon = newMergeRequest.author.avatar_url
                const data = {
                    url: newMergeRequest.web_url,
                }

                const notification = new Notification('New Merge Request', { body, icon, data })
                notification.onclick = event => {
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

    return current.filter(entry => !previous.some(previousEntry => previousEntry.id === entry.id))
}
