import { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import { useBackend } from '../hooks/backend'
import { MergeRequestWithProject } from '../hooks/types'

export const NotificationsEmiter = () => {
    const { mergeRequestWithProjects } = useBackend()
    const [previousMergeRequests, setPreviousMergeRequests] = useState<MergeRequestWithProject[] | undefined>(undefined)

    useEffect(() => {
        const newMergeRequests = getNewMergeRequests(mergeRequestWithProjects, previousMergeRequests)
        if (newMergeRequests.length > 0) {
            const moreThenOneNewMergeRequest = newMergeRequests.length > 1
            const title = moreThenOneNewMergeRequest ? 'New Merge Requests' : 'New Merge Request'
            const subtitle = newMergeRequests[0].title
            const body = 'test body'

            console.log('send notification', title, subtitle)
            ipcRenderer.send('show-notification', { title, subtitle, body })
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
