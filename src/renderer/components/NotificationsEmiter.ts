import { useState, useEffect } from 'react'

import { useBackend } from '../hooks/merge-requests/backend'
import { MergeRequestWithProject } from '../hooks/merge-requests/types'

export const NotificationsEmiter = () => {
    const { mergeRequestWithProjects } = useBackend()
    const [previousMergeRequests, setPreviousMergeRequests] = useState<MergeRequestWithProject[] | undefined>(undefined)

    useEffect(() => {
        const newMergeRequests = getNewMergeRequests(mergeRequestWithProjects, previousMergeRequests)
        if (newMergeRequests.length > 0) {
            const moreThenOneNewMergeRequest = newMergeRequests.length > 1

            newMergeRequests.forEach(newMergeRequest => {
                const body = newMergeRequest.title
                const icon = newMergeRequest.author.avatar_url

                new Notification('New Merge Request', { body, icon })
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
