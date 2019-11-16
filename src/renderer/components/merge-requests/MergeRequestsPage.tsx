import * as React from 'react'
import * as moment from 'moment'
import { ipcRenderer, shell } from 'electron'

import { MergeRequestGroup } from './list/MergeRequestGroup'
import { MergeRequestItem } from './list/MergeRequestItem'

import { useBackend } from '../../hooks/merge-requests/backend'
import { MergeRequest } from '../../hooks/merge-requests/types'
import * as Alerts from './Alerts'

const openMergeRequest = (url: string) => () => {
    shell.openExternal(url)
}

const renderMergeRequest = (mergeRequest: MergeRequest) => {
    const time = moment(mergeRequest.updated_at).format('DD.MM. HH:mm')
    const assignee = mergeRequest.assignee ? ` — ${mergeRequest.assignee.name}` : ''
    const secondaryText = `${time} ${assignee}`

    return (
        <MergeRequestItem
            key={mergeRequest.id}
            title={mergeRequest.title}
            subTitle={secondaryText}
            avatar={{ src: mergeRequest.author.avatar_url, alt: mergeRequest.author.name, title: mergeRequest.author.name }}
            stats={{
                downVotes: mergeRequest.downvotes,
                upVotes: mergeRequest.upvotes,
                commentCount: mergeRequest.user_notes_count,
                pipelineStatus: mergeRequest.pipeline_status,
            }}
            onClick={openMergeRequest(mergeRequest.web_url)}
        />
    )
}

export const MergeRequestsPage: React.FunctionComponent = () => {
    const { groupedMergeRequests } = useBackend()
    if (!groupedMergeRequests) {
        return <Alerts.CouldNotLoadMergeRequests />
    }
    if (groupedMergeRequests.length === 0) {
        return <Alerts.NoMergeRequests />
    }

    const numberOfOpenMergeRequest = groupedMergeRequests.reduce(
        (total, entry) => total + entry.mergeRequests.filter(mergeRequest => !mergeRequest.work_in_progress).length,
        0,
    )

    ipcRenderer.send('update-open-merge-requests', numberOfOpenMergeRequest)

    return (
        <>
            {groupedMergeRequests.map(entry => (
                <MergeRequestGroup key={entry.project.id} label={entry.project.name}>
                    {entry.mergeRequests.map(renderMergeRequest)}
                </MergeRequestGroup>
            ))}
        </>
    )
}
