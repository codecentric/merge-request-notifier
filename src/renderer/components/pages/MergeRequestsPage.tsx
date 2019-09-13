import * as React from 'react'
import * as moment from 'moment'
import { ipcRenderer, shell } from 'electron'

import DoneAllIcon from '@material-ui/icons/DoneAll'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import { Heading, Box, Text } from 'rebass'

import { MergeRequestGroup } from '../list/MergeRequestGroup'
import { MergeRequestItem } from '../list/MergeRequestItem'

import { useBackend } from '../../hooks/backend'
import { MergeRequest } from '../../hooks/types'

const openMergeRequest = (url: string) => () => {
    shell.openExternal(url)
}

const renderMergeRequest = (mergeRequest: MergeRequest) => {
    const time = moment(mergeRequest.updated_at).format('DD.MM. HH:mm')
    const assignee = mergeRequest.assignee ? ` — ${mergeRequest.assignee.name}` : ''
    const secondaryText = `${time} ${assignee}`

    return (
        <React.Fragment key={mergeRequest.id}>
            <MergeRequestItem
                title={mergeRequest.title}
                subTitle={secondaryText}
                avatar={{ src: mergeRequest.author.avatar_url, alt: mergeRequest.author.name }}
                stats={{
                    downVotes: mergeRequest.downvotes,
                    upVotes: mergeRequest.upvotes,
                    commentCount: mergeRequest.user_notes_count,
                }}
                onClick={openMergeRequest(mergeRequest.web_url)}
            />
        </React.Fragment>
    )
}

export const MergeRequestsPage = () => {
    const { mergeRequests } = useBackend()
    if (!mergeRequests) {
        return (
            <Box p={3}>
                <Heading my={2} fontSize={3}>
                    <ErrorOutlineIcon color='error' /> Something went wrong
                </Heading>
                <Text>Could not load your merge requests</Text>
            </Box>
        )
    }
    const noMergeRequests = mergeRequests.length === 0
    const numberOfOpenMergeRequest = mergeRequests.reduce(
        (total, entry) => total + entry.mergeRequests.filter(mergeRequest => !mergeRequest.work_in_progress).length,
        0,
    )

    ipcRenderer.send('update-open-merge-requests', numberOfOpenMergeRequest)

    return noMergeRequests ? (
        <Box p={3}>
            <Text my={2} fontSize={3}>
                <DoneAllIcon color='action' /> There are no open merge requests
            </Text>
        </Box>
    ) : (
        <>
            {mergeRequests.map(entry => (
                <MergeRequestGroup label={entry.project.name_with_namespace}>{entry.mergeRequests.map(renderMergeRequest)}</MergeRequestGroup>
            ))}
        </>
    )
}
