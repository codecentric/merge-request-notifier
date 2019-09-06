import * as React from 'react'
import * as moment from 'moment'
import { ipcRenderer, shell } from 'electron'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import CommentIcon from '@material-ui/icons/Comment'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import Typography from '@material-ui/core/Typography'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { MergeRequest, useBackend } from '../../hooks/backend'

const useStyles = makeStyles(theme => ({
    headline: {
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    votes: {
        marginLeft: theme.spacing(0.5),
        marginTop: 4,
        fontSize: 18,
    },
    listItemIcon: {
        minWidth: 0,
        marginLeft: theme.spacing(1),
    },
    list: {
        padding: 0,
    },
    upVoteIcon: {
        marginBottom: 5,
    },
    downVoteIcon: {
        marginTop: 5,
    },
    commentIcon: {
        marginTop: 5,
    },
    errorStatusBoxIcon: {
        fontSize: 96,
        marginTop: theme.spacing(4),
        width: '100%',
    },
    errorStatusBoxHeadline: {
        textAlign: 'center',
    },
    errorStatusBox: {
        margin: theme.spacing(4),
        padding: theme.spacing(2),
    },
}))

const openMergeRequest = (url: string) => () => {
    shell.openExternal(url)
}

const renderMergeRequest = (classes: any) => (mergeRequest: MergeRequest, index: number) => {
    const time = moment(mergeRequest.updated_at).format('DD.MM. HH:mm')
    const downVotes = !!mergeRequest.downvotes && (
        <ListItemIcon className={classes.listItemIcon}>
            <>
                <ThumbDownIcon className={classes.downVoteIcon} /> <strong className={classes.votes}>{mergeRequest.downvotes}</strong>
            </>
        </ListItemIcon>
    )
    const upVotes = !!mergeRequest.upvotes && (
        <ListItemIcon className={classes.listItemIcon}>
            <>
                <ThumbUpIcon className={classes.upVoteIcon} /> <strong className={classes.votes}>{mergeRequest.upvotes}</strong>
            </>
        </ListItemIcon>
    )
    const userNotes = !!mergeRequest.user_notes_count && (
        <ListItemIcon className={classes.listItemIcon}>
            <>
                <CommentIcon className={classes.commentIcon} /> <strong className={classes.votes}>{mergeRequest.user_notes_count}</strong>
            </>
        </ListItemIcon>
    )
    const assignee = !!mergeRequest.assignee && <span>, Assignee: {mergeRequest.assignee.name}</span>
    const secondaryText = (
        <>
            {time}
            {assignee}
        </>
    )

    return (
        <React.Fragment key={mergeRequest.id}>
            {index !== 0 && <Divider variant='inset' component='li' />}
            <ListItem button onClick={openMergeRequest(mergeRequest.web_url)}>
                <ListItemAvatar>
                    <Avatar alt={mergeRequest.author.name} src={mergeRequest.author.avatar_url} />
                </ListItemAvatar>
                <ListItemText id={`mr-${mergeRequest.id}`} primary={mergeRequest.title} secondary={secondaryText} className={classes.listItemText} />
                {userNotes}
                {upVotes}
                {downVotes}
            </ListItem>
        </React.Fragment>
    )
}

export const MergeRequestsPage = () => {
    const classes = useStyles()
    const { mergeRequests } = useBackend()
    if (!mergeRequests) {
        return (
            <Paper className={classes.errorStatusBox}>
                <Typography variant='h6' color='inherit' className={classes.errorStatusBoxHeadline}>
                    Could not load your merge requests
                </Typography>
                <ErrorOutlineIcon className={classes.errorStatusBoxIcon} color='error' />
            </Paper>
        )
    }
    const wipMergeRequests = mergeRequests.filter(mergeRequest => mergeRequest.work_in_progress)
    const openMergeRequests = mergeRequests.filter(mergeRequest => !mergeRequest.work_in_progress)
    const noMergeRequests = openMergeRequests.length === 0 && wipMergeRequests.length === 0

    ipcRenderer.send('update-open-merge-requests', openMergeRequests.length)

    return (
        <>
            {openMergeRequests.length > 0 && (
                <>
                    <Typography variant='h6' color='inherit' className={classes.headline}>
                        Open
                    </Typography>
                    <List className={classes.list}>{openMergeRequests.map(renderMergeRequest(classes))}</List>
                </>
            )}
            {wipMergeRequests.length > 0 && (
                <>
                    <Typography variant='h6' color='inherit' className={classes.headline}>
                        Work In Progress
                    </Typography>
                    <List className={classes.list}>{wipMergeRequests.map(renderMergeRequest(classes))}</List>
                </>
            )}
            {noMergeRequests && (
                <Paper className={classes.errorStatusBox}>
                    <Typography variant='h6' color='inherit' className={classes.errorStatusBoxHeadline}>
                        There are no open merge requests
                    </Typography>
                    <DoneAllIcon className={classes.errorStatusBoxIcon} color='action' />
                </Paper>
            )}
        </>
    )
}
